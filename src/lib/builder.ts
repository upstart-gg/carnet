import { promises as fs } from 'node:fs'
import path from 'node:path'
import { discoverAgents, discoverSkills, discoverTools, discoverToolsets } from './discovery'
import { parseMarkdownFile, parseToolFile } from './parser'
import { agentSchema, type CarnetConfig, skillSchema, toolsetSchema } from './schemas'
import type { Agent, Manifest, Skill, Tool, Toolset } from './types'

async function loadContent(contentDir: string) {
  const agents = new Map<string, Agent>()
  for await (const file of discoverAgents(contentDir)) {
    console.log('Found agent file:', file)
    const agent = await parseMarkdownFile(path.resolve(file), agentSchema)
    agents.set(agent.name, agent)
  }

  const skills = new Map<string, Skill>()
  for await (const file of discoverSkills(contentDir)) {
    const skill = await parseMarkdownFile(path.resolve(file), skillSchema)
    skills.set(skill.name, skill)
  }

  const toolsets = new Map<string, Toolset>()
  const tools = new Map<string, Tool>()

  for await (const file of discoverToolsets(contentDir)) {
    const toolset = await parseMarkdownFile(path.resolve(file), toolsetSchema)
    toolsets.set(toolset.name, toolset)

    for await (const toolFile of discoverTools(path.dirname(file))) {
      const tool = await parseToolFile(path.resolve(toolFile))
      tools.set(tool.name, tool)
    }
  }

  return { agents, skills, toolsets, tools }
}

export async function validate(contentDir: string): Promise<void> {
  const { agents, skills, toolsets, tools } = await loadContent(contentDir)
  validateReferences(agents, skills, toolsets, tools)
}

export async function build(options: CarnetConfig, carnetDir: string = './carnet'): Promise<void> {
  const { output } = options
  const { agents, skills, toolsets, tools } = await loadContent(carnetDir)

  validateReferences(agents, skills, toolsets, tools)

  const manifest: Manifest = {
    version: 1,
    app: options.app,
    agents: Object.fromEntries(agents),
    skills: Object.fromEntries(skills),
    toolsets: Object.fromEntries(toolsets),
    tools: Object.fromEntries(tools),
  }

  try {
    const stats = await fs.stat(output)
    if (!stats.isDirectory()) {
      await fs.mkdir(output, { recursive: true })
    }
  } catch {
    // Directory doesn't exist, create it
    await fs.mkdir(output, { recursive: true })
  }

  const manifestPath = path.join(output, 'manifest.json')
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2))

  console.log(`Build successful! Manifest written to ${manifestPath}`)
}

function validateReferences(
  agents: Map<string, Agent>,
  skills: Map<string, Skill>,
  toolsets: Map<string, Toolset>,
  tools: Map<string, Tool>
) {
  for (const agent of agents.values()) {
    for (const skillName of [...agent.initialSkills, ...agent.skills]) {
      if (!skills.has(skillName)) {
        throw new Error(`Agent "${agent.name}" references non-existent skill "${skillName}"`)
      }
    }
  }
  for (const skill of skills.values()) {
    for (const toolsetName of skill.toolsets) {
      if (!toolsets.has(toolsetName)) {
        throw new Error(`Skill "${skill.name}" references non-existent toolset "${toolsetName}"`)
      }
    }
  }
  for (const toolset of toolsets.values()) {
    for (const toolName of toolset.tools) {
      if (!tools.has(toolName)) {
        throw new Error(`Toolset "${toolset.name}" references non-existent tool "${toolName}"`)
      }
    }
  }
}

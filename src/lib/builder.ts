import { accessSync, constants, existsSync, promises as fs } from 'node:fs'
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
  const { output = './dist', app = { globalInitialSkills: [], globalSkills: [] } } = options
  const { agents, skills, toolsets, tools } = await loadContent(carnetDir)

  validateReferences(agents, skills, toolsets, tools)

  // Validate file references exist and are accessible
  validateSkillFileReferences(skills, carnetDir)

  // Read and embed file contents
  await readSkillFileContents(skills, carnetDir)

  const manifest: Manifest = {
    version: 1,
    app,
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

  const manifestPath = path.join(output, 'carnet.manifest.json')
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2))

  console.log(`Build successful! Manifest written to ${manifestPath}`)
}

/**
 * Validate that all file references in skills exist and are accessible
 */
function validateSkillFileReferences(skills: Map<string, Skill>, contentDir: string): void {
  for (const skill of skills.values()) {
    if (!skill.files || skill.files.length === 0) {
      continue
    }

    const skillDir = path.join(contentDir, 'skills', skill.name)

    for (const fileRef of skill.files) {
      // Ensure path doesn't start with ./ (normalize)
      if (fileRef.path.startsWith('./') || fileRef.path.startsWith('.\\')) {
        throw new Error(
          `Skill "${skill.name}": file path "${fileRef.path}" should not start with "./". Use relative path: "${fileRef.path.slice(2)}"`
        )
      }

      // Resolve path relative to skill directory
      const absolutePath = path.resolve(skillDir, fileRef.path)

      // Security: ensure file is within skill directory
      const normalizedPath = path.normalize(absolutePath)
      const normalizedSkillDir = path.normalize(skillDir)
      if (!normalizedPath.startsWith(normalizedSkillDir)) {
        throw new Error(
          `Skill "${skill.name}": file path "${fileRef.path}" resolves outside skill directory (security violation)`
        )
      }

      // Check file exists
      if (!existsSync(absolutePath)) {
        throw new Error(
          `Skill "${skill.name}" references non-existent file: ${fileRef.path}\n` +
            `Expected at: ${absolutePath}`
        )
      }

      // Check file is readable
      try {
        accessSync(absolutePath, constants.R_OK)
      } catch {
        throw new Error(
          `Skill "${skill.name}" references unreadable file: ${fileRef.path}\n` +
            `Path: ${absolutePath}`
        )
      }
    }
  }
}

/**
 * Read and embed file contents into skill file references
 */
async function readSkillFileContents(
  skills: Map<string, Skill>,
  contentDir: string
): Promise<void> {
  for (const skill of skills.values()) {
    if (!skill.files || skill.files.length === 0) {
      continue
    }

    const skillDir = path.join(contentDir, 'skills', skill.name)

    for (const fileRef of skill.files) {
      const absolutePath = path.resolve(skillDir, fileRef.path)

      try {
        // Read file and embed content
        fileRef.content = await fs.readFile(absolutePath, 'utf-8')
      } catch (error) {
        throw new Error(
          `Failed to read file "${fileRef.path}" from skill "${skill.name}": ` +
            `${error instanceof Error ? error.message : String(error)}`
        )
      }
    }
  }
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

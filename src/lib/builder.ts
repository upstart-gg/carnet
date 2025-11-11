import { accessSync, constants, existsSync, promises as fs } from 'node:fs'
import path from 'node:path'
import { discoverAgents, discoverSkills, discoverToolsets } from './discovery'
import { BuildError } from './errors'
import { parseMarkdownFile } from './parser'
import { agentSchema, type CarnetConfig, skillSchema, toolsetSchema } from './schemas'
import type { Agent, Manifest, Skill, Toolset } from './types'

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

  for await (const file of discoverToolsets(contentDir)) {
    const toolset = await parseMarkdownFile(path.resolve(file), toolsetSchema)
    toolsets.set(toolset.name, toolset)
  }

  return { agents, skills, toolsets }
}

export async function validate(contentDir: string): Promise<void> {
  const { agents, skills, toolsets } = await loadContent(contentDir)
  validateReferences(agents, skills, toolsets)
}

export async function build(options: CarnetConfig, carnetDir: string = './carnet'): Promise<void> {
  const { app = { globalInitialSkills: [], globalSkills: [] } } = options

  try {
    const { agents, skills, toolsets } = await loadContent(carnetDir)

    validateReferences(agents, skills, toolsets)

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
    }

    const manifestPath = path.join(carnetDir, 'carnet.manifest.json')
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2))

    console.log(`Build successful! Manifest written to ${manifestPath}`)
  } catch (error) {
    // Wrap non-Carnet errors in BuildError
    if (error instanceof Error && error.name.endsWith('Error') && error.name.startsWith('Carnet')) {
      // Already a Carnet error, re-throw
      throw error
    }
    throw new BuildError(
      `Build failed: ${error instanceof Error ? error.message : String(error)}`,
      'build',
      { carnetDir }
    )
  }
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
        throw new BuildError(
          `Skill "${skill.name}": file path "${fileRef.path}" should not start with "./". Use relative path: "${fileRef.path.slice(2)}"`,
          'validation',
          { skill: skill.name, filePath: fileRef.path }
        )
      }

      // Resolve path relative to skill directory
      const absolutePath = path.resolve(skillDir, fileRef.path)

      // Security: ensure file is within skill directory
      const normalizedPath = path.normalize(absolutePath)
      const normalizedSkillDir = path.normalize(skillDir)
      if (!normalizedPath.startsWith(normalizedSkillDir)) {
        throw new BuildError(
          `Skill "${skill.name}": file path "${fileRef.path}" resolves outside skill directory (security violation)`,
          'validation',
          { skill: skill.name, filePath: fileRef.path, absolutePath }
        )
      }

      // Check file exists
      if (!existsSync(absolutePath)) {
        throw new BuildError(
          `Skill "${skill.name}" references non-existent file: ${fileRef.path}\nExpected at: ${absolutePath}`,
          'validation',
          { skill: skill.name, filePath: fileRef.path, expectedPath: absolutePath }
        )
      }

      // Check file is readable
      try {
        accessSync(absolutePath, constants.R_OK)
      } catch {
        throw new BuildError(
          `Skill "${skill.name}" references unreadable file: ${fileRef.path}\nPath: ${absolutePath}`,
          'validation',
          { skill: skill.name, filePath: fileRef.path, absolutePath }
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
        throw new BuildError(
          `Failed to read file "${fileRef.path}" from skill "${skill.name}": ${error instanceof Error ? error.message : String(error)}`,
          'file-read',
          { skill: skill.name, filePath: fileRef.path, absolutePath }
        )
      }
    }
  }
}

function validateReferences(
  agents: Map<string, Agent>,
  skills: Map<string, Skill>,
  toolsets: Map<string, Toolset>
) {
  for (const agent of agents.values()) {
    for (const skillName of [...agent.initialSkills, ...agent.skills]) {
      if (!skills.has(skillName)) {
        throw new BuildError(
          `Agent "${agent.name}" references non-existent skill "${skillName}"`,
          'validation',
          { agent: agent.name, missingSkill: skillName }
        )
      }
    }
  }
  for (const skill of skills.values()) {
    for (const toolsetName of skill.toolsets) {
      if (!toolsets.has(toolsetName)) {
        throw new BuildError(
          `Skill "${skill.name}" references non-existent toolset "${toolsetName}"`,
          'validation',
          { skill: skill.name, missingToolset: toolsetName }
        )
      }
    }
  }
}

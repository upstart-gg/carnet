import { existsSync, promises as fs } from 'node:fs'
import { manifestSchema } from './schemas'
import type {
  ContentRetrievalOptions,
  GenerateAgentPromptOptions,
  GeneratedPrompt,
  Manifest,
  SkillMetadata,
  ToolMetadata,
  ToolsetMetadata,
} from './types'
import { PromptGenerator } from './prompt-generator'
import { VariableInjector } from './variable-injector'

export * from './types'
export { VariableInjector } from './variable-injector'
export { PromptGenerator } from './prompt-generator'

export class Carnet {
  protected manifest: Manifest
  protected cwd: string
  protected variableInjector: VariableInjector
  protected promptGenerator: PromptGenerator

  static MANIFEST_FILENAME = 'carnet.manifest.json'

  constructor(
    manifest: Manifest,
    cwd: string = process.cwd(),
    options: {
      variables?: Record<string, string>
      envPrefixes?: string[]
    } = {},
  ) {
    this.manifest = this.validateManifest(manifest)
    this.cwd = cwd
    this.variableInjector = new VariableInjector({
      variables: options.variables,
      envPrefixes: options.envPrefixes,
    })
    this.promptGenerator = new PromptGenerator(this.variableInjector)
  }

  static async fromFile(
    manifestPath: string,
    options?: {
      variables?: Record<string, string>
      envPrefixes?: string[]
    },
    cwd?: string,
  ): Promise<Carnet> {
    if (!existsSync(manifestPath)) {
      throw new Error(`Manifest file not found: ${manifestPath}`)
    }
    const content = await fs.readFile(manifestPath, 'utf-8')
    const manifest = JSON.parse(content)
    return new Carnet(manifest, cwd, options)
  }

  private validateManifest(manifest: unknown): Manifest {
    const parsed = manifestSchema.safeParse(manifest)
    if (!parsed.success) {
      throw new Error(`Invalid manifest: ${parsed.error.message}`)
    }
    return parsed.data
  }

  // Original API (kept for compatibility)
  get agents(): Manifest['agents'] {
    return this.manifest.agents
  }

  getAgent(name: string, _options: { rewritePrompt?: boolean } = { rewritePrompt: true }) {
    return this.manifest.agents[name]
  }

  getSkill(name: string) {
    return this.manifest.skills[name]
  }

  getToolset(name: string) {
    return this.manifest.toolsets[name]
  }

  getTool(name: string) {
    return this.manifest.tools[name]
  }

  // NEW API: Content retrieval with variable injection

  /**
   * Get skill content with optional variable injection
   */
  getSkillContent(name: string, options: ContentRetrievalOptions = {}): string {
    const skill = this.manifest.skills[name]
    if (!skill) {
      throw new Error(`Skill not found: ${name}`)
    }

    if (options.raw) {
      return skill.content
    }

    return this.variableInjector.inject(skill.content, options.variables)
  }

  /**
   * Get toolset content with optional variable injection
   */
  getToolsetContent(name: string, options: ContentRetrievalOptions = {}): string {
    const toolset = this.manifest.toolsets[name]
    if (!toolset) {
      throw new Error(`Toolset not found: ${name}`)
    }

    if (options.raw) {
      return toolset.content
    }

    return this.variableInjector.inject(toolset.content, options.variables)
  }

  /**
   * Get tool content with optional variable injection
   */
  getToolContent(name: string, options: ContentRetrievalOptions = {}): string {
    const tool = this.manifest.tools[name]
    if (!tool) {
      throw new Error(`Tool not found: ${name}`)
    }

    if (options.raw) {
      return tool.content
    }

    return this.variableInjector.inject(tool.content, options.variables)
  }

  // NEW API: Metadata retrieval for progressive loading

  /**
   * Get skill metadata (name, description, toolsets) without full content
   */
  getSkillMetadata(name: string): SkillMetadata {
    const skill = this.manifest.skills[name]
    if (!skill) {
      throw new Error(`Skill not found: ${name}`)
    }

    return {
      name: skill.name,
      description: skill.description,
      toolsets: skill.toolsets,
    }
  }

  /**
   * Get toolset metadata (name, description, tools) without full content
   */
  getToolsetMetadata(name: string): ToolsetMetadata {
    const toolset = this.manifest.toolsets[name]
    if (!toolset) {
      throw new Error(`Toolset not found: ${name}`)
    }

    return {
      name: toolset.name,
      description: toolset.description,
      tools: toolset.tools,
    }
  }

  /**
   * Get tool metadata (name, description) without full content
   */
  getToolMetadata(name: string): ToolMetadata {
    const tool = this.manifest.tools[name]
    if (!tool) {
      throw new Error(`Tool not found: ${name}`)
    }

    return {
      name: tool.name,
      description: tool.description,
    }
  }

  /**
   * List all available skills for an agent
   * Combines initialSkills and dynamically loadable skills
   */
  listAvailableSkills(agentName: string): SkillMetadata[] {
    const agent = this.manifest.agents[agentName]
    if (!agent) {
      throw new Error(`Agent not found: ${agentName}`)
    }

    const allSkillNames = [...new Set([...agent.initialSkills, ...agent.skills])]
    return allSkillNames
      .map((name) => this.getSkillMetadata(name))
      .filter((skill) => skill !== undefined)
  }

  /**
   * List all toolsets for a skill
   */
  listSkillToolsets(skillName: string): ToolsetMetadata[] {
    const skill = this.manifest.skills[skillName]
    if (!skill) {
      throw new Error(`Skill not found: ${skillName}`)
    }

    return skill.toolsets
      .map((name) => this.getToolsetMetadata(name))
      .filter((toolset) => toolset !== undefined)
  }

  /**
   * List all tools for a toolset
   */
  listToolsetTools(toolsetName: string): ToolMetadata[] {
    const toolset = this.manifest.toolsets[toolsetName]
    if (!toolset) {
      throw new Error(`Toolset not found: ${toolsetName}`)
    }

    return toolset.tools
      .map((name) => this.getToolMetadata(name))
      .filter((tool) => tool !== undefined)
  }

  // NEW API: Prompt generation for LLM consumption

  /**
   * Generate a complete, LLM-ready prompt for an agent
   * Includes initial skills, skill catalog, and loading instructions
   */
  generateAgentPrompt(
    agentName: string,
    options: GenerateAgentPromptOptions = {},
  ): GeneratedPrompt {
    const agent = this.manifest.agents[agentName]
    if (!agent) {
      throw new Error(`Agent not found: ${agentName}`)
    }

    // Get initial skills (always included if they exist)
    const initialSkills = agent.initialSkills
      .map((name) => this.manifest.skills[name])
      .filter((skill) => skill !== undefined)

    // Get available skills metadata (includes initial + dynamic skills)
    const availableSkills = this.listAvailableSkills(agentName)

    return this.promptGenerator.generateAgentPrompt(
      agent,
      initialSkills,
      availableSkills,
      options,
    )
  }
}

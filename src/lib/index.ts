import { existsSync, promises as fs } from 'node:fs'
import type { ToolSet } from 'ai'
import { DynamicPromptGenerator } from './dynamic-prompt-generator'
import type { PromptGenerator } from './prompt-generator'
import { manifestSchema } from './schemas'
import { mergeToolSets } from './tool-filtering'
import type { ToolOptions } from './tools'
import { createCarnetTools } from './tools'
import type {
  CarnetSessionState,
  ContentRetrievalOptions,
  GenerateAgentPromptOptions,
  GeneratedPrompt,
  Manifest,
  PromptOptions,
  SkillMetadata,
  ToolMetadata,
  ToolsetMetadata,
} from './types'
import { VariableInjector } from './variable-injector'

export { PromptGenerator } from './prompt-generator'
export type { ToolOptions } from './tools'
// `createCarnetTools` is intentionally not re-exported — it's internal. Use `carnet.getTools()`.
export * from './types'
export { VariableInjector } from './variable-injector'

/**
 * Main Carnet class for loading and using AI agent manifests
 *
 * Provides methods to:
 * - Load agent, skill, toolset, and tool definitions
 * - Generate agent prompts with variable injection
 * - Retrieve content with variable substitution
 *
 * @example
 * ```typescript
 * const carnet = await Carnet.fromManifest('./carnet.manifest.json')
 * const agent = carnet.getAgent('myAgent')
 * const prompt = carnet.generateAgentPrompt('myAgent')
 * ```
 */
export class Carnet {
  protected manifest: Manifest
  protected cwd: string
  protected variableInjector: VariableInjector
  protected promptGenerator: PromptGenerator
  protected readonly sessions: Map<string, CarnetSessionState>

  static MANIFEST_FILENAME = 'carnet.manifest.json'

  /**
   * Create a new Carnet instance
   * @param manifest The parsed manifest object containing agents, skills, toolsets, and tools
   * @param cwd Current working directory for relative file paths (defaults to process.cwd())
   * @param options Configuration options for variable injection
   * @param options.variables Custom variables to inject into prompts
   * @param options.envPrefixes Environment variable prefixes to allow (e.g., ['CARNET_', 'PUBLIC_'])
   */
  constructor(
    manifest: Manifest,
    cwd: string = process.cwd(),
    options: {
      variables?: Record<string, string>
      envPrefixes?: string[]
    } = {}
  ) {
    this.manifest = this.validateManifest(manifest)
    this.cwd = cwd
    this.variableInjector = new VariableInjector({
      variables: options.variables,
      envPrefixes: options.envPrefixes,
    })
    this.promptGenerator = new DynamicPromptGenerator(this.variableInjector)
    this.sessions = new Map()
  }

  /**
   * Load a Carnet instance from a manifest file
   * @param manifestPath Path to the carnet.manifest.json file
   * @param options Configuration options for variable injection
   * @param cwd Current working directory (defaults to process.cwd())
   * @returns A new Carnet instance
   * @throws Error if manifest file not found or invalid
   * @example
   * ```typescript
   * const carnet = await Carnet.fromManifest('./carnet.manifest.json')
   * ```
   */
  static async fromManifest(
    manifestPath: string,
    options?: {
      variables?: Record<string, string>
      envPrefixes?: string[]
    },
    cwd?: string
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

  // Domain Tool and Session Management

  public getDiscoveredSkills(agentName: string): string[] {
    const session = this.sessions.get(agentName)
    return session ? Array.from(session.discoveredSkills) : []
  }

  public getAvailableTools(agentName: string): string[] {
    const session = this.sessions.get(agentName)
    return session ? Array.from(session.exposedDomainTools) : []
  }

  public resetSession(agentName: string): void {
    this.sessions.delete(agentName)
  }

  /**
   * Updates the session state after a skill has been successfully loaded.
   * This is called internally by the `loadSkill` tool.
   * @param agentName The name of the agent for the current session.
   * @param skillName The name of the skill that was loaded.
   * @internal
   */
  public _updateSessionOnSkillLoad(agentName: string, skillName: string): void {
    const session = this.getOrCreateSession(agentName)
    const skill = this.getSkill(skillName)

    if (!skill) {
      // This should ideally not be reached if the skill loading was successful.
      return
    }

    session.discoveredSkills.add(skillName)

    for (const toolsetName of skill.toolsets) {
      session.loadedToolsets.add(toolsetName)
    }

    // Recalculate the set of exposed domain tools (names only)
    const allExposedTools = skill.toolsets.flatMap((t) => this.getToolset(t)?.tools ?? [])
    session.exposedDomainTools = new Set(allExposedTools)
  }

  private getOrCreateSession(agentName: string): CarnetSessionState {
    if (!this.sessions.has(agentName)) {
      const agent = this.getAgent(agentName)
      if (!agent) {
        throw new Error(`Agent not found: ${agentName}`)
      }

      const initialSkills = new Set(agent.initialSkills)
      const loadedToolsets = new Set<string>()

      for (const skillName of initialSkills) {
        const skill = this.getSkill(skillName)
        if (skill) {
          for (const toolsetName of skill.toolsets) {
            loadedToolsets.add(toolsetName)
          }
        }
      }

      const exposedDomainTools = new Set(
        Array.from(loadedToolsets).flatMap((t) => this.getToolset(t)?.tools ?? [])
      )

      this.sessions.set(agentName, {
        agentName,
        discoveredSkills: initialSkills,
        loadedToolsets,
        exposedDomainTools,
      })
    }
    // biome-ignore lint/style/noNonNullAssertion: safe to assume session exists here
    return this.sessions.get(agentName)!
  }

  /**
   * Get all agents from the manifest
   * @returns Record of agent name to agent definition
   */
  get agents() {
    return this.manifest.agents
  }

  /**
   * Get a single agent by name
   */
  getAgent(name: string) {
    return this.manifest.agents[name]
  }

  /**
   * Get a skill by name
   */
  getSkill(name: string) {
    return this.manifest.skills[name]
  }

  /**
   * Get a toolset by name
   * @param name The name of the toolset to retrieve
   * @returns The toolset definition, or undefined if not found
   */
  getToolset(name: string) {
    return this.manifest.toolsets[name]
  }

  /**
   * Get a tool by name
   * @param name The name of the tool to retrieve
   * @returns The tool definition, or undefined if not found
   */
  getTool(name: string) {
    return this.manifest.tools[name]
  }

  // Content retrieval with variable injection

  /**
   * Get skill content with optional variable injection
   * @param name The name of the skill to retrieve
   * @param options Retrieval options (raw: skip variable injection)
   * @returns The skill content with variables injected (unless raw is true)
   * @throws Error if skill not found
   * @example
   * ```typescript
   * const skillContent = carnet.getSkillContent('research', { variables: { topic: 'AI' } })
   * ```
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
   * @param name The name of the toolset to retrieve
   * @param options Retrieval options (raw: skip variable injection)
   * @returns The toolset content with variables injected (unless raw is true)
   * @throws Error if toolset not found
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
   * @param name The name of the tool to retrieve
   * @param options Retrieval options (raw: skip variable injection)
   * @returns The tool content with variables injected (unless raw is true)
   * @throws Error if tool not found
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

  // Metadata retrieval for progressive loading

  /**
   * Get skill metadata (name, description, toolsets) without full content
   * Useful for listing available skills without loading full content
   * @param name The name of the skill
   * @returns Metadata object with name, description, and toolsets list
   * @throws Error if skill not found
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

  /**
   * Generate a complete, LLM-ready prompt for an agent
   *
   * Creates a comprehensive prompt that includes:
   * - Agent description and base prompt
   * - Initial skills with full content
   * - Catalog of available skills for on-demand loading
   * - Instructions for progressive skill loading
   * - Variable substitution
   *
   * @returns Generated prompt object with content and metadata
   * @throws Error if agent not found
   */
  generateAgentPrompt(
    agentName: string,
    options: GenerateAgentPromptOptions = {}
  ): GeneratedPrompt {
    const agent = this.manifest.agents[agentName]
    if (!agent) {
      throw new Error(`Agent not found: ${agentName}`)
    }

    const session = this.getOrCreateSession(agentName)

    // Get initial skills (always included if they exist)
    const initialSkills = agent.initialSkills
      .map((name) => this.manifest.skills[name])
      .filter((skill) => skill !== undefined)

    // Get available skills metadata (includes initial + dynamic skills)
    const availableSkills = this.listAvailableSkills(agentName)

    const prompt = (this.promptGenerator as DynamicPromptGenerator).generateAgentPrompt(
      agent,
      initialSkills,
      availableSkills,
      options
    )

    const dynamicSections = []
    if (options.includeLoadedSkills) {
      dynamicSections.push(
        (this.promptGenerator as DynamicPromptGenerator).generateLoadedSkillsSection(
          session,
          this.manifest
        )
      )
    }
    if (options.includeAvailableTools) {
      const availableToolsets = options.tools ?? {}
      const availableToolsSection = (
        this.promptGenerator as DynamicPromptGenerator
      ).generateAvailableToolsSection(session, availableToolsets)
      if (availableToolsSection.trim().length > 0) {
        dynamicSections.push(availableToolsSection)
      }
    }

    prompt.content = [prompt.content, ...dynamicSections].filter(Boolean).join('\n\n')

    return prompt
  }

  /**
   * Generate a system prompt for an agent, ready to use with Vercel AI SDK
   *
   * @returns The system prompt string
   * @throws Error if agent not found
   */
  getSystemPrompt(agentName: string, options: PromptOptions = {}): string {
    const prompt = this.generateAgentPrompt(agentName, options)
    return prompt.content
  }

  /**
   * Get a ToolSet compatible with Vercel AI SDK for an agent
   *
   * Merge 2 tools for progressive skill and content loading:
   * - listAvailableSkills: List all available skills for the agent
   * - loadSkill: Load a specific skill with full content
   *
   * With domain tools provided via the `tools` option.
   *
   * @param agentName The name of the agent
   * @param options Configuration options containing domain tools
   * @returns A ToolSet for use with Vercel AI SDK
   * @throws Error if agent not found
   */
  getTools(agentName: string, options: ToolOptions = {}): ToolSet {
    const session = this.getOrCreateSession(agentName)
    const carnetTools = createCarnetTools(this, agentName)
    return mergeToolSets(carnetTools, session, options.tools ?? {})
  }
}

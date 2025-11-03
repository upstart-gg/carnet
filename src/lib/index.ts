import { existsSync, promises as fs } from 'node:fs'
import type { ToolSet } from 'ai'
import { DynamicPromptGenerator } from './dynamic-prompt-generator'
import { ConfigError, ValidationError } from './errors'
import type { PromptGenerator } from './prompt-generator'
import { manifestSchema } from './schemas'
import { mergeToolSets } from './tool-filtering'
import { ToolRegistry } from './tool-registry'
import type { ToolOptions } from './tools'
import { createCarnetTools } from './tools'
import type {
  Agent,
  CarnetSessionState,
  ContentRetrievalOptions,
  GenerateAgentPromptOptions,
  GeneratedPrompt,
  Manifest,
  PromptOptions,
  Skill,
  SkillMetadata,
  Tool,
  ToolFilteringDiagnostics,
  ToolMetadata,
  Toolset,
  ToolsetMetadata,
} from './types'
import { VariableInjector } from './variable-injector'

export { PromptGenerator } from './prompt-generator'
export { ToolRegistry } from './tool-registry'
export type { ToolOptions } from './tools'
export type { ToolFilteringDiagnostics } from './types'
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
      throw new ConfigError(`Manifest file not found`, { manifestPath })
    }
    const content = await fs.readFile(manifestPath, 'utf-8')
    const manifest = JSON.parse(content)
    return new Carnet(manifest, cwd, options)
  }

  private validateManifest(manifest: unknown): Manifest {
    const parsed = manifestSchema.safeParse(manifest)
    if (!parsed.success) {
      throw new ValidationError(`Invalid manifest format`, 'manifest', 'root', {
        error: parsed.error.message,
      })
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
   * Inspects the current session state for an agent.
   * Useful for debugging why certain tools are or aren't available.
   * @param agentName The name of the agent
   * @returns The session state (discovered skills, loaded toolsets, exposed tools) or null if no session exists
   */
  public getSessionState(agentName: string): CarnetSessionState | null {
    const session = this.sessions.get(agentName)
    if (!session) return null

    return {
      agentName: session.agentName,
      discoveredSkills: new Set(session.discoveredSkills),
      loadedToolsets: new Set(session.loadedToolsets),
      exposedDomainTools: new Set(session.exposedDomainTools),
    }
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

    // Update the set of exposed domain tools with new tools from loaded skill
    const newExposedTools = skill.toolsets.flatMap((t) => this.getToolset(t)?.tools ?? [])
    for (const toolName of newExposedTools) {
      session.exposedDomainTools.add(toolName)
    }
  }

  private getOrCreateSession(agentName: string): CarnetSessionState {
    if (!this.sessions.has(agentName)) {
      const agent = this.getAgent(agentName)
      if (!agent) {
        throw new ValidationError(`Agent not found`, 'agent', agentName)
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
    return this.manifest.agents as Record<string, Agent>
  }

  /**
   * Get a single agent by name
   */
  getAgent(name: string) {
    return this.manifest.agents[name] as Agent | undefined
  }

  /**
   * Get a skill by name
   */
  getSkill(name: string) {
    return this.manifest.skills[name] as Skill | undefined
  }

  /**
   * Get a toolset by name
   * @param name The name of the toolset to retrieve
   * @returns The toolset definition, or undefined if not found
   */
  getToolset(name: string) {
    return this.manifest.toolsets[name] as Toolset | undefined
  }

  /**
   * Get a tool by name
   * @param name The name of the tool to retrieve
   * @returns The tool definition, or undefined if not found
   */
  getTool(name: string) {
    return this.manifest.tools[name] as Tool | undefined
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
      throw new ValidationError(`Skill not found`, 'skill', name)
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
      throw new ValidationError(`Toolset not found`, 'toolset', name)
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
      throw new ValidationError(`Tool not found`, 'tool', name)
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
      throw new ValidationError(`Skill not found`, 'skill', name)
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
      throw new ValidationError(`Toolset not found`, 'toolset', name)
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
      throw new ValidationError(`Tool not found`, 'tool', name)
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
      throw new ValidationError(`Agent not found`, 'agent', agentName)
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
      throw new ValidationError(`Skill not found`, 'skill', skillName)
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
      throw new ValidationError(`Toolset not found`, 'toolset', toolsetName)
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
      throw new ValidationError(`Agent not found`, 'agent', agentName)
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
      // Convert flat domain tools to ToolRegistry
      // Only include tools that match the currently exposed domain tools
      const toolRegistry = new ToolRegistry()
      const runtimeTools = options.tools ?? {}
      if (Object.keys(runtimeTools).length > 0) {
        const exposedRuntimeTools: typeof runtimeTools = {}
        for (const toolName of session.exposedDomainTools) {
          const tool = runtimeTools[toolName]
          if (tool) {
            exposedRuntimeTools[toolName] = tool
          }
        }
        if (Object.keys(exposedRuntimeTools).length > 0) {
          toolRegistry.register('runtime-tools', exposedRuntimeTools)
        }
      }
      const availableToolsSection = (
        this.promptGenerator as DynamicPromptGenerator
      ).generateAvailableToolsSection(session, toolRegistry)
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
   * Tool Filtering Diagnostics:
   * - Only tools in session.exposedDomainTools are included
   * - Tools not in this set are filtered out (see getToolFilteringDiagnostics)
   * - Filtering occurs after skill loading to progressively expose tools
   *
   * @param agentName The name of the agent
   * @param options Configuration options containing domain tools
   * @returns A ToolSet for use with Vercel AI SDK
   * @throws ValidationError if agent not found
   * @see getToolFilteringDiagnostics For debugging tool filtering decisions
   */
  getTools(agentName: string, options: ToolOptions = {}): ToolSet {
    const session = this.getOrCreateSession(agentName)
    const carnetTools = createCarnetTools(this, agentName)

    // Convert flat domain tools to ToolRegistry
    // Only include tools that match the currently exposed domain tools
    const toolRegistry = new ToolRegistry()
    const runtimeTools = options.tools ?? {}
    if (Object.keys(runtimeTools).length > 0) {
      const exposedRuntimeTools: typeof runtimeTools = {}
      const filteredOutTools: string[] = []

      for (const toolName of Object.keys(runtimeTools)) {
        if (session.exposedDomainTools.has(toolName)) {
          const tool = runtimeTools[toolName]
          if (tool) {
            exposedRuntimeTools[toolName] = tool
          }
        } else {
          filteredOutTools.push(toolName)
        }
      }

      if (Object.keys(exposedRuntimeTools).length > 0) {
        toolRegistry.register('runtime-tools', exposedRuntimeTools)
        session.loadedToolsets.add('runtime-tools')
      }

      // Store diagnostics on session for debugging
      session.__toolFilteringDiagnostics = {
        exposedTools: Array.from(session.exposedDomainTools),
        filteredOutTools,
        providedTools: Object.keys(runtimeTools),
        reason: 'Tools filtered based on currently loaded skills and toolsets',
      }
    }

    return mergeToolSets(carnetTools, session, toolRegistry)
  }

  /**
   * Get tool filtering diagnostics for debugging tool availability.
   * Useful for understanding why certain tools are or aren't available.
   *
   * @param agentName The name of the agent
   * @returns Object with filtering diagnostics or null if no session exists
   * @example
   * ```typescript
   * const diagnostics = carnet.getToolFilteringDiagnostics('myAgent')
   * console.log(`Filtered out tools: ${diagnostics?.filteredOutTools.join(', ')}`)
   * console.log(`Exposed tools: ${diagnostics?.exposedTools.join(', ')}`)
   * ```
   */
  getToolFilteringDiagnostics(agentName: string): ToolFilteringDiagnostics | null {
    const session = this.sessions.get(agentName)
    if (!session) return null

    const diagnostics = session.__toolFilteringDiagnostics
    if (!diagnostics) {
      return {
        exposedTools: Array.from(session.exposedDomainTools),
        filteredOutTools: [],
        providedTools: [],
        reason: 'No tools provided or filtering not yet performed',
      }
    }

    return diagnostics
  }
}

import type { Carnet } from '../../lib/index'
import type { AdapterOptions } from '../shared/types'

/**
 * Adapter for Anthropic SDK
 *
 * Usage:
 * ```typescript
 * import { CarnetAnthropicAdapter } from '@upstart-gg/carnet/adapters/anthropic'
 * import Anthropic from '@anthropic-ai/sdk'
 *
 * const carnet = await Carnet.fromFile('./carnet.manifest.json')
 * const adapter = new CarnetAnthropicAdapter(carnet, 'my-agent')
 *
 * const client = new Anthropic()
 * const stream = await client.messages.stream({
 *   model: 'claude-3-5-sonnet-20241022',
 *   max_tokens: 1024,
 *   ...adapter.getConfig(),
 *   messages: [{ role: 'user', content: 'Help me!' }]
 * })
 * ```
 */
export class CarnetAnthropicAdapter {
  private systemPrompt: string
  private toolsList: Array<{
    name: string
    description: string
    input_schema: unknown
  }>

  constructor(
    private carnet: Carnet,
    private agentName: string,
    private options: AdapterOptions = {}
  ) {
    this.systemPrompt = this.buildSystemPrompt()
    this.toolsList = this.buildTools()
  }

  /**
   * Get configuration object for use with Anthropic SDK
   */
  getConfig() {
    return {
      system: this.systemPrompt,
      tools: this.toolsList,
    }
  }

  /**
   * Get the system prompt separately
   */
  getSystemPrompt(): string {
    return this.systemPrompt
  }

  /**
   * Get the tools separately
   */
  getTools() {
    return this.toolsList
  }

  /**
   * Execute a tool call by name and input
   */
  async executeToolCall(name: string, input: unknown): Promise<unknown> {
    const params = input as Record<string, string>

    switch (name) {
      case 'listAvailableSkills':
        return this.handleListAvailableSkills()

      case 'loadSkill':
        return this.handleLoadSkill(params.skillName)

      case 'listSkillToolsets':
        return this.handleListSkillToolsets(params.skillName)

      case 'loadToolset':
        return this.handleLoadToolset(params.toolsetName)

      case 'loadTool':
        return this.handleLoadTool(params.toolName)

      default:
        return { success: false, error: `Unknown tool: ${name}` }
    }
  }

  private buildSystemPrompt(): string {
    return this.carnet
      .generateAgentPrompt(this.agentName, {
        includeSkillCatalog: this.options.includeSkillCatalog ?? true,
        includeInitialSkills: this.options.includeInitialSkills ?? true,
        variables: this.options.variables,
      })
      .content
  }

  private buildTools() {
    const enabledTools = this.options.tools ?? [
      'listAvailableSkills',
      'loadSkill',
      'listSkillToolsets',
      'loadToolset',
      'loadTool',
    ]

    const tools: Array<{
      name: string
      description: string
      input_schema: unknown
    }> = []

    if (enabledTools.includes('listAvailableSkills')) {
      tools.push({
        name: 'listAvailableSkills',
        description: 'List all available skills for the agent',
        input_schema: {
          type: 'object',
          properties: {},
          required: [],
        },
      })
    }

    if (enabledTools.includes('loadSkill')) {
      tools.push({
        name: 'loadSkill',
        description: 'Load a skill by name to get its full content and capabilities',
        input_schema: {
          type: 'object',
          properties: {
            skillName: {
              type: 'string',
              description: 'The name of the skill to load',
            },
          },
          required: ['skillName'],
        },
      })
    }

    if (enabledTools.includes('listSkillToolsets')) {
      tools.push({
        name: 'listSkillToolsets',
        description: 'List all toolsets available in a skill',
        input_schema: {
          type: 'object',
          properties: {
            skillName: {
              type: 'string',
              description: 'The name of the skill',
            },
          },
          required: ['skillName'],
        },
      })
    }

    if (enabledTools.includes('loadToolset')) {
      tools.push({
        name: 'loadToolset',
        description: 'Load a toolset to get its instructions and available tools',
        input_schema: {
          type: 'object',
          properties: {
            toolsetName: {
              type: 'string',
              description: 'The name of the toolset to load',
            },
          },
          required: ['toolsetName'],
        },
      })
    }

    if (enabledTools.includes('loadTool')) {
      tools.push({
        name: 'loadTool',
        description: 'Load a specific tool to get its full documentation and usage',
        input_schema: {
          type: 'object',
          properties: {
            toolName: {
              type: 'string',
              description: 'The name of the tool to load',
            },
          },
          required: ['toolName'],
        },
      })
    }

    return tools
  }

  private async handleListAvailableSkills() {
    try {
      const skills = this.carnet.listAvailableSkills(this.agentName)
      return {
        success: true,
        skills: skills.map((s) => ({
          name: s.name,
          description: s.description,
          toolsets: s.toolsets,
        })),
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to list skills: ${error instanceof Error ? error.message : String(error)}`,
      }
    }
  }

  private async handleLoadSkill(skillName: string) {
    try {
      const content = this.carnet.getSkillContent(skillName)
      const metadata = this.carnet.getSkillMetadata(skillName)
      return {
        success: true,
        content,
        metadata,
      }
    } catch (error) {
      return {
        success: false,
        error: `Skill not found: ${skillName}`,
        available: this.carnet.listAvailableSkills(this.agentName).map((s) => s.name),
      }
    }
  }

  private async handleListSkillToolsets(skillName: string) {
    try {
      const toolsets = this.carnet.listSkillToolsets(skillName)
      return {
        success: true,
        toolsets: toolsets.map((t) => ({
          name: t.name,
          description: t.description,
          toolCount: t.tools.length,
        })),
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to list toolsets: ${error instanceof Error ? error.message : String(error)}`,
      }
    }
  }

  private async handleLoadToolset(toolsetName: string) {
    try {
      const content = this.carnet.getToolsetContent(toolsetName)
      const tools = this.carnet.listToolsetTools(toolsetName)

      return {
        success: true,
        content,
        availableTools: tools.map((t) => ({
          name: t.name,
          description: t.description,
        })),
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to load toolset: ${error instanceof Error ? error.message : String(error)}`,
      }
    }
  }

  private async handleLoadTool(toolName: string) {
    try {
      const content = this.carnet.getToolContent(toolName)
      const metadata = this.carnet.getToolMetadata(toolName)

      return {
        success: true,
        metadata,
        content,
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to load tool: ${error instanceof Error ? error.message : String(error)}`,
      }
    }
  }
}

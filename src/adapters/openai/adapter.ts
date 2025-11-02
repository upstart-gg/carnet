import type { Carnet } from '../../lib/index'
import type { AdapterOptions } from '../shared/types'

/**
 * Adapter for OpenAI SDK
 *
 * Usage:
 * ```typescript
 * import { CarnetOpenAIAdapter } from '@upstart-gg/carnet/adapters/openai'
 * import OpenAI from 'openai'
 *
 * const carnet = await Carnet.fromManifest('./carnet.manifest.json')
 * const adapter = new CarnetOpenAIAdapter(carnet, 'my-agent')
 *
 * const client = new OpenAI()
 * const completion = await client.chat.completions.create({
 *   model: 'gpt-4',
 *   ...adapter.getConfig(),
 *   messages: [
 *     ...adapter.getConfig().messages,
 *     { role: 'user', content: 'Help me!' }
 *   ]
 * })
 * ```
 */
export class CarnetOpenAIAdapter {
  private systemPrompt: string
  private toolsList: Array<{
    type: 'function'
    function: {
      name: string
      description: string
      parameters: unknown
    }
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
   * Get configuration object for use with OpenAI SDK
   */
  getConfig() {
    return {
      messages: [{ role: 'system' as const, content: this.systemPrompt }],
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
   * Execute a tool call by name and JSON args
   */
  async executeToolCall(name: string, args: string): Promise<unknown> {
    const parsed = JSON.parse(args)

    switch (name) {
      case 'listAvailableSkills':
        return this.handleListAvailableSkills()

      case 'loadSkill':
        return this.handleLoadSkill(parsed.skillName)

      case 'listSkillToolsets':
        return this.handleListSkillToolsets(parsed.skillName)

      case 'loadToolset':
        return this.handleLoadToolset(parsed.toolsetName)

      case 'loadTool':
        return this.handleLoadTool(parsed.toolName)

      default:
        return { success: false, error: `Unknown tool: ${name}` }
    }
  }

  private buildSystemPrompt(): string {
    return this.carnet.generateAgentPrompt(this.agentName, {
      includeSkillCatalog: this.options.includeSkillCatalog ?? true,
      includeInitialSkills: this.options.includeInitialSkills ?? true,
      variables: this.options.variables,
    }).content
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
      type: 'function'
      function: {
        name: string
        description: string
        parameters: unknown
      }
    }> = []

    if (enabledTools.includes('listAvailableSkills')) {
      tools.push({
        type: 'function',
        function: {
          name: 'listAvailableSkills',
          description: 'List all available skills for the agent',
          parameters: {
            type: 'object',
            properties: {},
            required: [],
          },
        },
      })
    }

    if (enabledTools.includes('loadSkill')) {
      tools.push({
        type: 'function',
        function: {
          name: 'loadSkill',
          description: 'Load a skill by name to get its full content and capabilities',
          parameters: {
            type: 'object',
            properties: {
              skillName: {
                type: 'string',
                description: 'The name of the skill to load',
              },
            },
            required: ['skillName'],
          },
        },
      })
    }

    if (enabledTools.includes('listSkillToolsets')) {
      tools.push({
        type: 'function',
        function: {
          name: 'listSkillToolsets',
          description: 'List all toolsets available in a skill',
          parameters: {
            type: 'object',
            properties: {
              skillName: {
                type: 'string',
                description: 'The name of the skill',
              },
            },
            required: ['skillName'],
          },
        },
      })
    }

    if (enabledTools.includes('loadToolset')) {
      tools.push({
        type: 'function',
        function: {
          name: 'loadToolset',
          description: 'Load a toolset to get its instructions and available tools',
          parameters: {
            type: 'object',
            properties: {
              toolsetName: {
                type: 'string',
                description: 'The name of the toolset to load',
              },
            },
            required: ['toolsetName'],
          },
        },
      })
    }

    if (enabledTools.includes('loadTool')) {
      tools.push({
        type: 'function',
        function: {
          name: 'loadTool',
          description: 'Load a specific tool to get its full documentation and usage',
          parameters: {
            type: 'object',
            properties: {
              toolName: {
                type: 'string',
                description: 'The name of the tool to load',
              },
            },
            required: ['toolName'],
          },
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
    } catch (_error) {
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

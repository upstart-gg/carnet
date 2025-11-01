import type { Carnet } from '../../lib/index'
import type { AdapterOptions } from '../shared/types'
import type { CoreTool } from 'ai'
import { tool } from 'ai'
import { z } from 'zod'

/**
 * Adapter for Vercel AI SDK v5
 *
 * Usage:
 * ```typescript
 * import { CarnetVercelAdapter } from '@upstart-gg/carnet/adapters/vercel-ai'
 * import { streamText } from 'ai'
 * import { openai } from '@ai-sdk/openai'
 *
 * const carnet = await Carnet.fromManifest('./carnet.manifest.json')
 * const adapter = new CarnetVercelAdapter(carnet, 'my-agent')
 *
 * const result = await streamText({
 *   model: openai('gpt-4'),
 *   ...adapter.getConfig(),
 *   messages: [{ role: 'user', content: 'Help me!' }]
 * })
 * ```
 */
export class CarnetVercelAdapter {
  private systemPrompt: string
  private toolsCache: Record<string, CoreTool>

  constructor(
    private carnet: Carnet,
    private agentName: string,
    private options: AdapterOptions = {}
  ) {
    this.systemPrompt = this.buildSystemPrompt()
    this.toolsCache = this.buildTools()
  }

  /**
   * Get configuration object for use with Vercel AI SDK
   */
  getConfig() {
    return {
      system: this.systemPrompt,
      tools: this.toolsCache,
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
  getTools(): Record<string, CoreTool> {
    return this.toolsCache
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

  private buildTools(): Record<string, CoreTool> {
    const enabledTools = this.options.tools ?? [
      'listAvailableSkills',
      'loadSkill',
      'listSkillToolsets',
      'loadToolset',
      'loadTool',
    ]

    const tools: Record<string, CoreTool> = {}

    if (enabledTools.includes('listAvailableSkills')) {
      tools.listAvailableSkills = tool({
        description: 'List all available skills for the agent',
        parameters: z.object({}),
        execute: async () => {
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
        },
      })
    }

    if (enabledTools.includes('loadSkill')) {
      tools.loadSkill = tool({
        description: 'Load a skill by name to get its full content and capabilities',
        parameters: z.object({
          skillName: z.string().describe('The name of the skill to load'),
        }),
        execute: async ({ skillName }) => {
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
              available: this.carnet
                .listAvailableSkills(this.agentName)
                .map((s) => s.name),
            }
          }
        },
      })
    }

    if (enabledTools.includes('listSkillToolsets')) {
      tools.listSkillToolsets = tool({
        description: 'List all toolsets available in a skill',
        parameters: z.object({
          skillName: z.string().describe('The name of the skill'),
        }),
        execute: async ({ skillName }) => {
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
        },
      })
    }

    if (enabledTools.includes('loadToolset')) {
      tools.loadToolset = tool({
        description: 'Load a toolset to get its instructions and available tools',
        parameters: z.object({
          toolsetName: z.string().describe('The name of the toolset to load'),
        }),
        execute: async ({ toolsetName }) => {
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
        },
      })
    }

    if (enabledTools.includes('loadTool')) {
      tools.loadTool = tool({
        description: 'Load a specific tool to get its full documentation and usage',
        parameters: z.object({
          toolName: z.string().describe('The name of the tool to load'),
        }),
        execute: async ({ toolName }) => {
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
        },
      })
    }

    return tools
  }
}

import type { ToolSet } from 'ai'
import { tool } from 'ai'
import { z } from 'zod'
import type { Carnet } from '../../lib/index'
import { CarnetAdapter } from '../shared/adapter'
import type { AdapterOptions } from '../shared/types'

export class VercelAdapter extends CarnetAdapter {
  private systemPrompt: string
  private toolsCache: ToolSet

  constructor(
    carnet: Carnet,
    agentName: string,
    private options: AdapterOptions = {}
  ) {
    super(carnet, agentName)
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
  getTools(): ToolSet {
    return this.toolsCache
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

    const tools: ToolSet = {}

    if (enabledTools.includes('listAvailableSkills')) {
      tools.listAvailableSkills = tool({
        description: 'List all available skills for the agent',
        inputSchema: z.object({}),
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
        inputSchema: z.object({
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
          } catch (_error) {
            return {
              success: false,
              error: `Skill not found: ${skillName}`,
              available: this.carnet.listAvailableSkills(this.agentName).map((s) => s.name),
            }
          }
        },
      })
    }

    if (enabledTools.includes('listSkillToolsets')) {
      tools.listSkillToolsets = tool({
        description: 'List all toolsets available in a skill',
        inputSchema: z.object({
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
        inputSchema: z.object({
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
        inputSchema: z.object({
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

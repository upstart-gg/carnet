import type { ToolSet } from 'ai'
import { tool } from 'ai'
import { z } from 'zod'
import type { Carnet } from './index'

/**
 * Options for configuring which Carnet tools to expose
 */
export interface ToolOptions {
  /**
   * List of specific tools to include. If undefined, all tools are included.
   * This can include both Carnet meta-tools and any registered domain tools.
   */
  tools?: string[]
}

/**
 * Create a complete ToolSet for use with Vercel AI SDK
 *
 * Exposes five tools for progressive skill and content loading:
 * - listAvailableSkills: List all available skills for an agent
 * - loadSkill: Load a specific skill with full content
 * - listSkillToolsets: List toolsets within a skill
 * - loadToolset: Load a specific toolset with instructions
 * - loadTool: Load a specific tool with full documentation
 *
 * @param carnet The Carnet instance
 * @param agentName The name of the agent to create tools for
 * @param options Configuration options for which tools to expose
 * @returns A ToolSet compatible with Vercel AI SDK
 *
 * @example
 * ```typescript
 * const carnet = await Carnet.fromManifest('./carnet.manifest.json')
 * const tools = createCarnetTools(carnet, 'my-agent')
 *
 * // Use with streamText
 * const result = await streamText({
 *   model: openai('gpt-4'),
 *   system: carnet.getSystemPrompt('my-agent'),
 *   tools,
 *   messages: [...]
 * })
 * ```
 */
export function createCarnetTools(
  carnet: Carnet,
  agentName: string,
  options: ToolOptions = {}
): ToolSet {
  const enabledTools = options.tools ?? [
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
          const skills = carnet.listAvailableSkills(agentName)
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
          const content = carnet.getSkillContent(skillName)
          const metadata = carnet.getSkillMetadata(skillName)

          // Update the session state with the newly discovered skill and its toolsets
          carnet._updateSessionOnSkillLoad(agentName, skillName)

          return {
            success: true,
            content,
            metadata,
          }
        } catch (_error) {
          return {
            success: false,
            error: `Skill not found: ${skillName}`,
            available: carnet.listAvailableSkills(agentName).map((s) => s.name),
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
          const toolsets = carnet.listSkillToolsets(skillName)
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
          const content = carnet.getToolsetContent(toolsetName)
          const tools = carnet.listToolsetTools(toolsetName)

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
          const content = carnet.getToolContent(toolName)
          const metadata = carnet.getToolMetadata(toolName)

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

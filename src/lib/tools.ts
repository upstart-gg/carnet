import { tool } from 'ai'
import { z } from 'zod'
import type { Carnet } from './index'
import type { DomainToolSet } from './types'

/**
 * Options for configuring which Carnet tools to expose
 */
export interface ToolOptions {
  /**
   * List of specific tools to include. If undefined, all tools are included.
   * This can include both Carnet meta-tools and any domain tools from toolsets.
   */
  tools?: string[]

  /**
   * Domain toolsets to make available to the agent.
   * Keys should match toolset names from your manifest.
   *
   * @example
   * ```typescript
   * const tools = carnet.getTools('researcher', {
   *   toolsets: {
   *     'search': searchTools,
   *     'analysis': analysisTools
   *   }
   * })
   * ```
   */
  toolsets?: Record<string, DomainToolSet>
}

type ListAvailableResult =
  | {
      success: true
      skills: Array<{
        name: string
        description: string
        toolsets: string[]
      }>
    }
  | {
      success: false
      error: string
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
 *
 * @internal
 * This function is used internally by Carnet.getTools() and should not be called directly by user code.
 * Users should invoke `carnet.getTools()` instead, which wraps and manages this factory internally.
 */
export function createCarnetTools(carnet: Carnet, agentName: string) {
  const tools = {
    listAvailableSkills: tool({
      description: 'List all available skills for the agent',
      inputSchema: z.object({}),
      execute: async (): Promise<ListAvailableResult> => {
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
    }),
    loadSkill: tool({
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
    }),
  }

  // Note: only `listAvailableSkills` and `loadSkill` are exported as Carnet meta-tools.
  // Toolsets and individual tool loading are performed by domain tool providers
  // exposed via the `toolsets` option to `getTools()`.

  return tools
}

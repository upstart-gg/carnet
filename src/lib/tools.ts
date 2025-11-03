import { tool } from 'ai'
import { z } from 'zod'
import type { Carnet } from './index'
import type { DomainToolSet } from './types'

/**
 * Options for configuring which Carnet tools to expose
 */
export interface ToolOptions {
  /**
   * Domain tools for the agent.
   * Keys should match tool names from your manifest.
   *
   **/
  tools?: DomainToolSet
}

/**
 * Create a complete ToolSet for use with Vercel AI SDK
 *
 * Exposes the `loadSkill` tool for progressive skill loading.
 * Skills are discovered via the system prompt's skill catalog, and this tool
 * is used to load their full content on-demand.
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

  // Note: only `loadSkill` is exported as a Carnet meta-tool.
  // Skills are discovered via the system prompt's skill catalog.
  // Toolsets and individual tool loading are performed by domain tool providers
  // exposed via the `tools` option to `getTools()`.

  return tools
}

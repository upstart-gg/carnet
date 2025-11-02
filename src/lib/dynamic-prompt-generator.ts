import type { ToolSet } from 'ai'
import { PromptGenerator } from './prompt-generator'
import type { ToolRegistry } from './tool-registry'
import type { CarnetSessionState, Manifest } from './types'

/**
 * Extends the base PromptGenerator to add dynamic sections to the prompt
 * based on the current agent session state.
 */
export class DynamicPromptGenerator extends PromptGenerator {
  /**
   * Generates a markdown section listing the skills that have been
   * discovered during the current session.
   * @param session The current session state.
   * @param manifest The Carnet manifest.
   * @returns A markdown string for the loaded skills section, or an empty string.
   */
  public generateLoadedSkillsSection(session: CarnetSessionState, manifest: Manifest): string {
    if (session.discoveredSkills.size === 0) {
      return ''
    }

    const skillNames = Array.from(session.discoveredSkills)
    const skillDetails = skillNames
      .map((skillName) => {
        const skill = manifest.skills[skillName]
        if (!skill) return null
        const toolsets = skill.toolsets.length > 0 ? `(toolsets: ${skill.toolsets.join(', ')})` : ''
        return `- **${skill.name}**: ${skill.description} ${toolsets}`.trim()
      })
      .filter(Boolean)
      .join('\n')

    return `## Currently Loaded Skills\n\nSkills you have discovered during this session:\n\n${skillDetails}`
  }

  /**
   * Generates a markdown section listing the domain tools that are currently
   * available to the agent based on the loaded skills.
   * @param session The current session state.
   * @param registry The tool registry containing all domain tools.
   * @returns A markdown string for the available tools section, or an empty string.
   */
  public generateAvailableToolsSection(
    session: CarnetSessionState,
    toolsRegistery: ToolRegistry
  ): string {
    if (session.exposedDomainTools.size === 0) {
      return ''
    }

    const toolNames = Array.from(session.exposedDomainTools)
    const allTools: ToolSet = toolsRegistery.getToolsForToolsets(session.loadedToolsets)

    const toolDetails = toolNames
      .map((toolName) => {
        const tool = allTools[toolName]
        if (!tool?.description) return null
        return `- **${toolName}**: ${tool.description}`
      })
      .filter(Boolean)
      .join('\n')

    if (!toolDetails) {
      return ''
    }

    return `## Available Domain Tools\n\nBased on your loaded skills, you can now use these tools:\n\n${toolDetails}`
  }
}

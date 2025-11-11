import type {
  Agent,
  GenerateAgentPromptOptions,
  GeneratedPrompt,
  Skill,
  SkillMetadata,
  ToolMetadata,
  ToolsetMetadata,
} from './types'
import type { VariableInjector } from './variable-injector'

/**
 * PromptGenerator assembles LLM-ready prompts for agents
 * Includes initial skills, skill catalogs, and loading instructions
 */
export class PromptGenerator {
  constructor(private variableInjector: VariableInjector) {}

  /**
   * Generate a complete agent prompt for LLM consumption
   *
   * The generated prompt includes:
   * 1. Agent's main prompt (with variables injected)
   * 2. Initial skills section (full content, variables injected)
   * 3. Available skills catalog (name + description only)
   * 4. Instructions for loading skills dynamically
   *
   * @param agent - The agent to generate prompt for
   * @param initialSkills - Skills to include in full (loaded at initialization)
   * @param availableSkills - Metadata for skills available on-demand
   * @param options - Generation options including variables and flags
   * @returns Generated prompt object
   */
  generateAgentPrompt(
    agent: Agent,
    initialSkills: Skill[],
    availableSkills: SkillMetadata[],
    options: GenerateAgentPromptOptions = {}
  ): GeneratedPrompt {
    const { variables = {}, includeInitialSkills = true, includeSkillCatalog = true } = options

    // Inject variables into agent prompt
    const agentPrompt = this.variableInjector.inject(agent.prompt, variables)

    // Build the full prompt content
    const sections: string[] = [agentPrompt]

    // Add initial skills section if requested
    if (includeInitialSkills && initialSkills.length > 0) {
      sections.push(this.generateInitialSkillsSection(initialSkills, variables))
    }

    // Add available skills catalog and loading instructions if requested
    if (includeSkillCatalog && availableSkills.length > 0) {
      sections.push(this.generateSkillCatalogSection(availableSkills))
      sections.push(this.generateSkillLoadingInstructions())
    }

    const content = sections.join('\n\n')

    return {
      content,
      agent,
      initialSkills,
      availableSkills,
    }
  }

  /**
   * Generate the initial skills section with full content
   * These skills are loaded at agent initialization
   */
  private generateInitialSkillsSection(skills: Skill[], variables: Record<string, string>): string {
    const skillSections = skills.map((skill) => {
      const skillContent = this.variableInjector.inject(skill.content, variables)
      return `## Skill: ${skill.name}\n\n${skill.description}\n\n${skillContent}`
    })

    return `## Initial Skills\n\nYou have the following skills available immediately:\n\n${skillSections.join('\n\n---\n\n')}`
  }

  /**
   * Generate the skill catalog section
   * Lists available skills with metadata for on-demand loading
   */
  private generateSkillCatalogSection(availableSkills: SkillMetadata[]): string {
    const skillLines = availableSkills
      .map((skill) => `- **${skill.name}**: ${skill.description}`)
      .join('\n')

    return `## Available Skills (On-Demand)\n\nYou can load these skills on-demand by using the \`loadSkill\` tool:\n\n${skillLines}`
  }

  /**
   * Generate instructions for dynamically loading skills
   */
  private generateSkillLoadingInstructions(): string {
    return `## How to Load Skills

To access additional capabilities, use the \`loadSkill\` tool to load a skill by name from the catalog above.

When you load a skill:
1. You receive its full documentation and instructions
2. You receive a list of available files (if any) with descriptions
3. All associated toolsets and tools are automatically loaded
4. You can load specific files on-demand using the \`loadSkillFile\` tool

Example workflow:
- Review the "Available Skills (On-Demand)" catalog above
- Call \`loadSkill({ skillName: "code-review" })\` to load a skill
- Review the \`files\` array in the response to see available resources
- Call \`loadSkillFile({ skillName: "code-review", path: "guidelines/python-pep8.md" })\` to load a specific file
- Use the file content to inform your work

Available tools for progressive loading:
- \`loadSkill(skillName)\` - Load a skill and get access to its tools
- \`loadSkillFile(skillName, path)\` - Load a specific file from a loaded skill

Note: You do not need to manually load toolsets or individual tools - they become available automatically when you load their parent skill.`
  }

  /**
   * Generate metadata sections for a skill (name + description + toolset catalog)
   */
  generateSkillMetadataSection(skill: SkillMetadata, toolsets: ToolsetMetadata[]): string {
    const relevantToolsets = toolsets.filter((t) => skill.toolsets.includes(t.name))

    let content = `## Skill: ${skill.name}\n\n${skill.description}`

    if (relevantToolsets.length > 0) {
      const toolsetLines = relevantToolsets
        .map((t) => `- **${t.name}**: ${t.description}`)
        .join('\n')
      content += `\n\n### Associated Toolsets\n\n${toolsetLines}`
    }

    return content
  }

  /**
   * Generate metadata sections for a toolset (name + description + tool catalog)
   */
  generateToolsetMetadataSection(toolset: ToolsetMetadata, tools: ToolMetadata[]): string {
    const relevantTools = tools.filter((t) =>
      toolset.tools.some((toolsetTool) => toolsetTool.name === t.name)
    )

    let content = `## Toolset: ${toolset.name}\n\n${toolset.description}`

    if (relevantTools.length > 0) {
      const toolLines = relevantTools.map((t) => `- **${t.name}**: ${t.description}`).join('\n')
      content += `\n\n### Tools in this Toolset\n\n${toolLines}`
    }

    return content
  }
}

/**
 * Shared types for all framework adapters
 */

export interface AdapterOptions {
  /**
   * Include the skill catalog in the system prompt
   * @default true
   */
  includeSkillCatalog?: boolean

  /**
   * Include initial skills content in the system prompt
   * @default true
   */
  includeInitialSkills?: boolean

  /**
   * Variables to inject into content
   */
  variables?: Record<string, string>

  /**
   * Specific tools to enable. If not specified, all tools are enabled
   */
  tools?: CarnetToolName[]
}

export type CarnetToolName =
  | 'listAvailableSkills'
  | 'loadSkill'
  | 'listSkillToolsets'
  | 'loadToolset'
  | 'loadTool'

/**
 * Standardized tool result format
 */
export interface ToolSuccess<T = unknown> {
  success: true
  data: T
}

export interface ToolError {
  success: false
  error: string
  available?: string[]
}

export type ToolResult<T = unknown> = ToolSuccess<T> | ToolError

/**
 * Skill info returned by listAvailableSkills tool
 */
export interface SkillInfo {
  name: string
  description: string
  toolsets: string[]
}

/**
 * Skill content returned by loadSkill tool
 */
export interface SkillContent {
  content: string
  metadata: {
    name: string
    description: string
    toolsets: string[]
  }
}

/**
 * Toolset info returned by listSkillToolsets tool
 */
export interface ToolsetInfo {
  name: string
  description: string
  toolCount: number
}

/**
 * Toolset content returned by loadToolset tool
 */
export interface ToolsetContent {
  content: string
  tools: Array<{
    name: string
    description: string
  }>
}

/**
 * Tool metadata returned by tool tools
 */
export interface ToolInfo {
  name: string
  description: string
}

/**
 * Tool content returned by loadTool tool
 */
export interface ToolContent {
  metadata: {
    name: string
    description: string
  }
  content: string
}

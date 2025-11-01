import type { z } from 'zod'
import type {
  agentSchema,
  appConfigSchema,
  manifestSchema,
  skillSchema,
  toolSchema,
  toolsetSchema,
} from './schemas'

export type AppConfig = z.infer<typeof appConfigSchema>
export type Agent = z.infer<typeof agentSchema>
export type Skill = z.infer<typeof skillSchema>
export type Toolset = z.infer<typeof toolsetSchema>
export type Tool = z.infer<typeof toolSchema>
export type Manifest = z.infer<typeof manifestSchema>

export interface GeneratePromptOptions {
  includeSkills?: string[]
  excludeSkills?: string[]
  variables?: Record<string, string>
}

// Runtime content retrieval options
export interface ContentRetrievalOptions {
  variables?: Record<string, string>
  raw?: boolean // default: false (inject variables)
}

// Agent prompt generation options
export interface GenerateAgentPromptOptions {
  variables?: Record<string, string>
  includeInitialSkills?: boolean // default: true
  includeSkillCatalog?: boolean // default: true
}

// Metadata types for progressive loading
export interface SkillMetadata {
  name: string
  description: string
  toolsets: string[]
}

export interface ToolsetMetadata {
  name: string
  description: string
  tools: string[]
}

export interface ToolMetadata {
  name: string
  description: string
}

// Generated prompt return type
export interface GeneratedPrompt {
  content: string
  agent: Agent
  initialSkills: Skill[]
  availableSkills: SkillMetadata[]
}

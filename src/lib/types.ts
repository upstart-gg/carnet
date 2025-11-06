import type { z } from 'zod'
import type {
  agentSchema,
  appConfigSchema,
  manifestSchema,
  skillFileReferenceSchema,
  skillSchema,
  toolSchema,
  toolsetSchema,
} from './schemas'

export type AppConfig = z.infer<typeof appConfigSchema>
export type Agent = z.infer<typeof agentSchema>
export type Skill = z.infer<typeof skillSchema>
export type SkillFileReference = z.infer<typeof skillFileReferenceSchema>
export type Toolset = z.infer<typeof toolsetSchema>
export type Tool = z.infer<typeof toolSchema>
export type Manifest = z.infer<typeof manifestSchema>

// Metadata types for progressive loading
export type SkillMetadata = Pick<Skill, 'name' | 'description' | 'toolsets' | 'files'>
export type ToolsetMetadata = Pick<Toolset, 'name' | 'description' | 'tools'>
export type ToolMetadata = Pick<Tool, 'name' | 'description'>

// Runtime content retrieval options
export interface ContentRetrievalOptions {
  variables?: Record<string, string>
  raw?: boolean // default: false (inject variables)
}

// Agent prompt generation options
export interface GenerateAgentPromptOptions {
  variables?: Record<string, string>
  tools?: DomainToolSet
  includeInitialSkills?: boolean // default: true
  includeSkillCatalog?: boolean // default: true
  includeLoadedSkills?: boolean // default: true
  includeAvailableTools?: boolean // default: true
}

// Generated prompt return type
export interface GeneratedPrompt {
  content: string
  agent: Agent
  initialSkills: Skill[]
  availableSkills: SkillMetadata[]
}

// Options for generating system prompts
export interface PromptOptions {
  variables?: Record<string, string>
  includeInitialSkills?: boolean // default: true
  includeSkillCatalog?: boolean // default: true
  includeLoadedSkills?: boolean // default: true
  includeAvailableTools?: boolean // default: true
}

// Domain toolset type - a collection of executable Vercel AI SDK tools
export type DomainToolSet = Record<string, import('ai').Tool>

export interface ToolFilteringDiagnostics {
  exposedTools: string[]
  filteredOutTools: string[]
  providedTools: string[]
  reason: string
}

export interface CarnetSessionState {
  agentName: string
  discoveredSkills: Set<string>
  loadedToolsets: Set<string>
  exposedDomainTools: Set<string>
  __toolFilteringDiagnostics?: ToolFilteringDiagnostics
}

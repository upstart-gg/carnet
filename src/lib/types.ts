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

import type { ToolSet } from 'ai'

export interface VercelAIConfig {
  system: string
  tools: ToolSet
}

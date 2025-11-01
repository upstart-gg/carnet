import type { CoreTool } from 'ai'

export interface VercelAIConfig {
  system: string
  tools: Record<string, CoreTool>
}

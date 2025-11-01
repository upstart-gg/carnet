export interface AnthropicConfig {
  system: string
  tools: Array<{
    name: string
    description: string
    input_schema: unknown
  }>
}

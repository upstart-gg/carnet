export interface OpenAIConfig {
  messages: Array<{
    role: 'system'
    content: string
  }>
  tools: Array<{
    type: 'function'
    function: {
      name: string
      description: string
      parameters: unknown
    }
  }>
}

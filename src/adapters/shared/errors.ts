/**
 * Adapter-specific error types
 */

export enum AdapterErrorCode {
  SKILL_NOT_FOUND = 'SKILL_NOT_FOUND',
  TOOLSET_NOT_FOUND = 'TOOLSET_NOT_FOUND',
  TOOL_NOT_FOUND = 'TOOL_NOT_FOUND',
  AGENT_NOT_FOUND = 'AGENT_NOT_FOUND',
  INVALID_PARAMETERS = 'INVALID_PARAMETERS',
}

export class CarnetAdapterError extends Error {
  constructor(
    message: string,
    public code: AdapterErrorCode,
    public details?: unknown
  ) {
    super(message)
    this.name = 'CarnetAdapterError'
    Object.setPrototypeOf(this, CarnetAdapterError.prototype)
  }
}

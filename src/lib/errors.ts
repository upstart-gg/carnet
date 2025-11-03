/**
 * Base error class for all Carnet errors
 * Provides consistent error interface with optional context
 */
export class CarnetError extends Error {
  readonly context?: Record<string, unknown>

  constructor(message: string, context?: Record<string, unknown>) {
    super(message)
    this.name = 'CarnetError'
    this.context = context
    Object.setPrototypeOf(this, CarnetError.prototype)
  }

  /**
   * Convert error to plain object for serialization
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      context: this.context,
    } as {
      name: string
      message: string
      context?: Record<string, unknown>
    }
  }
}

/**
 * Error thrown when configuration is invalid or missing required properties
 */
export class ConfigError extends CarnetError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, context)
    this.name = 'ConfigError'
    Object.setPrototypeOf(this, ConfigError.prototype)
  }
}

/**
 * Error thrown when markdown file parsing fails
 */
export class ParseError extends CarnetError {
  readonly filePath?: string
  readonly lineNumber?: number

  constructor(
    message: string,
    filePath?: string,
    lineNumber?: number,
    context?: Record<string, unknown>
  ) {
    super(message, context)
    this.name = 'ParseError'
    this.filePath = filePath
    this.lineNumber = lineNumber
    Object.setPrototypeOf(this, ParseError.prototype)
  }
}

/**
 * Error thrown when schema validation fails
 */
export class ValidationError extends CarnetError {
  readonly entityType?: string
  readonly entityName?: string

  constructor(
    message: string,
    entityType?: string,
    entityName?: string,
    context?: Record<string, unknown>
  ) {
    super(message, context)
    this.name = 'ValidationError'
    this.entityType = entityType
    this.entityName = entityName
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

/**
 * Error thrown when the build process fails
 */
export class BuildError extends CarnetError {
  readonly phase?: string

  constructor(message: string, phase?: string, context?: Record<string, unknown>) {
    super(message, context)
    this.name = 'BuildError'
    this.phase = phase
    Object.setPrototypeOf(this, BuildError.prototype)
  }
}

/**
 * Type guard to check if an error is a CarnetError
 */
export function isCarnetError(error: unknown): error is CarnetError {
  return error instanceof CarnetError
}

/**
 * Type guard to check if an error is a ConfigError
 */
export function isConfigError(error: unknown): error is ConfigError {
  return error instanceof ConfigError
}

/**
 * Type guard to check if an error is a ParseError
 */
export function isParseError(error: unknown): error is ParseError {
  return error instanceof ParseError
}

/**
 * Type guard to check if an error is a ValidationError
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError
}

/**
 * Type guard to check if an error is a BuildError
 */
export function isBuildError(error: unknown): error is BuildError {
  return error instanceof BuildError
}

/**
 * Format error with context for display
 */
export function formatError(error: unknown): string {
  if (isCarnetError(error)) {
    let message = `${error.name}: ${error.message}`

    if (isParseError(error)) {
      if (error.filePath) {
        message += `\n  File: ${error.filePath}`
      }
      if (error.lineNumber) {
        message += `\n  Line: ${error.lineNumber}`
      }
    }

    if (isValidationError(error)) {
      if (error.entityType) {
        message += `\n  Type: ${error.entityType}`
      }
      if (error.entityName) {
        message += `\n  Name: ${error.entityName}`
      }
    }

    if (isBuildError(error) && error.phase) {
      message += `\n  Phase: ${error.phase}`
    }

    if (error.context && Object.keys(error.context).length > 0) {
      message += '\n  Context:'
      for (const [key, value] of Object.entries(error.context)) {
        if (typeof value === 'string') {
          message += `\n    ${key}: ${value}`
        } else {
          message += `\n    ${key}: ${JSON.stringify(value)}`
        }
      }
    }

    return message
  }

  if (error instanceof Error) {
    return `${error.name}: ${error.message}`
  }

  return String(error)
}

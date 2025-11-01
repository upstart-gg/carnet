/**
 * VariableInjector handles runtime variable replacement in content
 * Supports custom variables and environment variables with prefix filtering
 */
export class VariableInjector {
  private readonly envPrefixes: string[]
  private readonly customVariables: Record<string, string>

  constructor(
    options: {
      variables?: Record<string, string>
      envPrefixes?: string[]
    } = {}
  ) {
    this.customVariables = options.variables ?? {}
    this.envPrefixes = options.envPrefixes ?? ['CARNET_', 'PUBLIC_']
  }

  /**
   * Inject variables into content using {{ VARIABLE_NAME }} syntax
   * Supports custom variables and environment variables (with prefix filtering)
   *
   * @param content - The content with variable placeholders
   * @param additionalVariables - Optional additional variables to inject
   * @returns Content with variables replaced
   */
  inject(content: string, additionalVariables?: Record<string, string>): string {
    const allVariables = {
      ...this.getEnvironmentVariables(),
      ...this.customVariables,
      ...additionalVariables,
    }

    // Replace {{ VAR_NAME }} syntax with variable values
    return content.replace(/\{\{\s*([A-Z_][A-Z0-9_]*)\s*\}\}/g, (match, varName) => {
      if (varName in allVariables) {
        return String(allVariables[varName])
      }
      // Return the original placeholder if variable not found
      // This allows for graceful degradation
      return match
    })
  }

  /**
   * Get environment variables that match the configured prefixes
   */
  private getEnvironmentVariables(): Record<string, string> {
    const envVars: Record<string, string> = {}

    for (const [key, value] of Object.entries(process.env)) {
      if (this.envPrefixes.some((prefix) => key.startsWith(prefix))) {
        envVars[key] = value ?? ''
      }
    }

    return envVars
  }

  /**
   * Check if content has any variable placeholders
   */
  hasVariables(content: string): boolean {
    return /\{\{\s*[A-Z_][A-Z0-9_]*\s*\}\}/.test(content)
  }
}

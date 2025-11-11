import { promises as fs } from 'node:fs'
import path from 'node:path'
import { ConfigError } from './errors'
import { type CarnetConfig, configSchema } from './schemas'

/**
 * Load config file from a Carnet directory.
 * @param dir Path to Carnet directory (defaults to './carnet'). Looks for carnet.config.json inside.
 * @returns Parsed and validated config, with defaults applied for missing values
 */
export async function loadConfigFile(dir = './carnet'): Promise<CarnetConfig> {
  const configFilePath = path.join(dir, 'carnet.config.json')
  try {
    const content = await fs.readFile(configFilePath, 'utf-8')
    const config = JSON.parse(content)
    return configSchema.parse(config)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // File doesn't exist - return defaults instead of throwing
      return getDefaultConfig()
    }
    // Wrap JSON parse or schema validation errors
    if (error instanceof SyntaxError) {
      throw new ConfigError(`Failed to parse config file: ${error.message}`, {
        path: configFilePath,
      })
    }
    if (error instanceof Error && error.name === 'ZodError') {
      throw new ConfigError(`Invalid configuration: ${error.message}`, { path: configFilePath })
    }
    throw error
  }
}

/**
 * Load config from environment variables with CARNET_ prefix.
 * Supports:
 * - CARNET_OUTPUT
 * - CARNET_INCLUDE (comma-separated)
 * - CARNET_EXCLUDE (comma-separated)
 * - CARNET_GLOBAL_SKILLS (comma-separated)
 * - CARNET_GLOBAL_INITIAL_SKILLS (comma-separated)
 * @param processEnv Environment variables object (defaults to process.env)
 * @returns Partial config from environment variables
 */
export function loadEnvConfig(
  processEnv: Record<string, string | undefined> = process.env
): Partial<CarnetConfig> {
  const envConfig: Partial<CarnetConfig> = {}

  // Array options (comma-separated)
  if (processEnv.CARNET_INCLUDE) {
    envConfig.include = processEnv.CARNET_INCLUDE.split(',').map((s) => s.trim())
  }
  if (processEnv.CARNET_EXCLUDE) {
    envConfig.exclude = processEnv.CARNET_EXCLUDE.split(',').map((s) => s.trim())
  }

  // App config
  const globalSkills = processEnv.CARNET_GLOBAL_SKILLS
    ? processEnv.CARNET_GLOBAL_SKILLS.split(',').map((s) => s.trim())
    : undefined
  const globalInitialSkills = processEnv.CARNET_GLOBAL_INITIAL_SKILLS
    ? processEnv.CARNET_GLOBAL_INITIAL_SKILLS.split(',').map((s) => s.trim())
    : undefined

  if (globalSkills || globalInitialSkills) {
    envConfig.app = {
      globalSkills: globalSkills || [],
      globalInitialSkills: globalInitialSkills || [],
    }
  }

  return envConfig
}

/**
 * Get default configuration with all schema defaults applied
 * @returns Default CarnetConfig
 */
export function getDefaultConfig(): CarnetConfig {
  return configSchema.parse({})
}

/**
 * Merge multiple config sources following precedence order.
 * Precedence: Defaults → Config File → Environment Variables → CLI Options
 * @param fileConfig Config loaded from file (or undefined)
 * @param envConfig Config from environment variables (or undefined)
 * @param cliConfig Config from CLI options (or undefined)
 * @returns Merged configuration
 */
export function mergeConfigurations(
  fileConfig?: Partial<CarnetConfig>,
  envConfig?: Partial<CarnetConfig>,
  cliConfig?: Partial<CarnetConfig>
): CarnetConfig {
  // Start with defaults
  const merged = getDefaultConfig()

  // Apply file config if provided
  if (fileConfig) {
    Object.assign(merged, fileConfig)
  }

  // Apply env config if provided
  if (envConfig) {
    Object.assign(merged, envConfig)
  }

  // Apply CLI config if provided (highest priority)
  if (cliConfig) {
    Object.assign(merged, cliConfig)
  }

  // Validate final merged config
  try {
    return configSchema.parse(merged)
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      throw new ConfigError(`Invalid merged configuration: ${error.message}`, {
        sources: { fileConfig: !!fileConfig, envConfig: !!envConfig, cliConfig: !!cliConfig },
      })
    }
    throw error
  }
}

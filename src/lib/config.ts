import { promises as fs } from 'node:fs'
import { type CarnetConfig, configSchema } from './schemas'

/**
 * Load config file from disk. Returns defaults if file doesn't exist.
 * @param configFilePath Path to config file (defaults to 'carnet.config.json')
 * @returns Parsed and validated config, with defaults applied for missing values
 */
export async function loadConfigFile(configFilePath = 'carnet.config.json'): Promise<CarnetConfig> {
  try {
    const content = await fs.readFile(configFilePath, 'utf-8')
    const config = JSON.parse(content)
    return configSchema.parse(config)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // File doesn't exist - return defaults instead of throwing
      return getDefaultConfig()
    }
    throw error
  }
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
  cliConfig?: Partial<CarnetConfig>,
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
  return configSchema.parse(merged)
}

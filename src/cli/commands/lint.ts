import path from 'node:path'
import type { Command } from 'commander'
import { validate } from '../../lib/builder'
import { loadConfigFile, loadEnvConfig, mergeConfigurations } from '../../lib/config'
import { colors } from '../colors'

export function registerLintCommand(program: Command): void {
  program
    .command('lint')
    .description('Lint markdown files')
    .option('-d, --dir <dir>', 'Carnet project directory containing content (default: ./carnet)')
    .option(
      '-v, --variables <key=value...>',
      'custom variables to inject (can be used multiple times)'
    )
    .option(
      '--env-prefix <prefix...>',
      'environment variable prefixes to allow (can be used multiple times)'
    )
    .option('--include <pattern...>', 'glob patterns to include (can be used multiple times)')
    .option('--exclude <pattern...>', 'glob patterns to exclude (can be used multiple times)')
    .option(
      '--global-skills <skill...>',
      'global skills available to all agents (can be used multiple times)'
    )
    .option(
      '--global-initial-skills <skill...>',
      'initial skills available to all agents at startup (can be used multiple times)'
    )
    .action(async (options) => {
      const globalOptions = program.opts()
      await runLintCommand({
        ...globalOptions,
        ...options,
      })
    })
}

async function runLintCommand(options: {
  dir?: string
  variables?: string[]
  envPrefix?: string[]
  include?: string[]
  exclude?: string[]
  globalSkills?: string[]
  globalInitialSkills?: string[]
}) {
  const carnetDir = path.resolve(options.dir || './carnet')
  const fileConfig = await loadConfigFile(carnetDir)

  // Parse CLI variables (format: "KEY=VALUE")
  const cliVariables: Record<string, string> = {}
  if (options.variables && Array.isArray(options.variables)) {
    for (const varStr of options.variables) {
      const [key, value] = varStr.split('=')
      if (key && value !== undefined) {
        cliVariables[key] = value
      }
    }
  }

  // Build CLI config from options
  const cliConfig: Partial<typeof fileConfig> = {}

  if (Object.keys(cliVariables).length > 0) cliConfig.variables = cliVariables
  if (options.envPrefix) cliConfig.envPrefix = options.envPrefix
  if (options.include) cliConfig.include = options.include
  if (options.exclude) cliConfig.exclude = options.exclude

  if (options.globalSkills || options.globalInitialSkills) {
    cliConfig.app = {
      globalSkills: options.globalSkills || [],
      globalInitialSkills: options.globalInitialSkills || [],
    }
  }

  // Load environment variables and merge configurations with proper precedence
  const envConfig = loadEnvConfig()
  const _config = mergeConfigurations(fileConfig, envConfig, cliConfig)

  // Validate that content directory exists
  const { promises: fs } = await import('node:fs')
  const contentDir = `${carnetDir}/agents`
  try {
    await fs.access(contentDir)
  } catch {
    throw new Error(`Content directory does not exist: ${contentDir}`)
  }

  console.log(colors.info('Linting Carnet project...'))
  try {
    await validate(carnetDir)
    console.log(colors.success('Lint successful!'))
  } catch (error) {
    console.error(colors.error(`Lint failed: ${(error as Error).message}`))
    process.exit(1)
  }
}

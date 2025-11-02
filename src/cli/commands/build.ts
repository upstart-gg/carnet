import { watch } from 'node:fs/promises'
import path from 'node:path'
import { loadConfigFile, loadEnvConfig, mergeConfigurations } from '@lib/config'
import type { Command } from 'commander'
import { build } from '../../lib/builder'
import { colors } from '../colors'

export function registerBuildCommand(program: Command) {
  program
    .command('build')
    .description('Build markdown files into JSON artifacts')
    .option('-o, --output <dir>', 'output directory (default: ./dist)')
    .option('-w, --watch', 'watch for changes and rebuild')
    .option('-v, --variables <key=value...>', 'custom variables to inject (can be used multiple times)')
    .option('--env-prefix <prefix...>', 'environment variable prefixes to allow (can be used multiple times)')
    .option('--include <pattern...>', 'glob patterns to include (can be used multiple times)')
    .option('--exclude <pattern...>', 'glob patterns to exclude (can be used multiple times)')
    .option('--global-skills <skill...>', 'global skills available to all agents (can be used multiple times)')
    .option('--global-initial-skills <skill...>', 'initial skills available to all agents at startup (can be used multiple times)')
    .action(async (options) => {
      const globalOptions = program.opts()
      await runBuildCommand({
        ...globalOptions,
        ...options,
      })
    })
}

async function runBuildCommand(options: {
  dir?: string
  output?: string
  watch?: boolean
  config?: string
  variables?: string[]
  envPrefix?: string[]
  include?: string[]
  exclude?: string[]
  globalSkills?: string[]
  globalInitialSkills?: string[]
}) {
  const fileConfig = await loadConfigFile(options.config)

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

  if (options.dir) cliConfig.baseDir = options.dir
  if (options.output) cliConfig.output = options.output
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
  const buildConfig = mergeConfigurations(fileConfig, envConfig, cliConfig)

  // Validate that content directory exists
  const { promises: fs } = await import('node:fs')
  try {
    await fs.access(buildConfig.baseDir)
  } catch {
    throw new Error(`Content directory does not exist: ${buildConfig.baseDir}`)
  }

  const runBuild = async () => {
    console.log(colors.info('Building Carnet project...'))
    try {
      await build(buildConfig)
    } catch (error) {
      console.error(colors.error(`Build failed: ${(error as Error).message}`))
    }
  }

  await runBuild()

  if (options.watch) {
    console.log(
      colors.info(`\nWatching for changes in ${path.resolve(buildConfig.baseDir)}...`)
    )
    try {
      const watcher = watch(buildConfig.baseDir, { recursive: true })
      for await (const event of watcher) {
        console.log(
          colors.dimmed(
            `[${new Date().toLocaleTimeString()}] Change detected in ${
              event.filename
            }. Rebuilding...`
          )
        )
        await runBuild()
      }
    } catch (error) {
      console.error(colors.error(`File watcher failed: ${(error as Error).message}`))
      process.exit(1)
    }
  }
}

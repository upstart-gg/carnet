import { watch } from 'node:fs/promises'
import path from 'node:path'
import { loadConfigFile } from '@lib/config'
import type { Command } from 'commander'
import { build } from '../../lib/builder'
import { colors } from '../colors'

export function registerBuildCommand(program: Command) {
  program
    .command('build')
    .description('Build markdown files into JSON artifacts')
    .option('-o, --output <dir>', 'output directory (default: ./dist)')
    .option('-w, --watch', 'watch for changes and rebuild')
    .option('--strict', 'enable strict validation')
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
  strict?: boolean
  watch?: boolean
  config?: string
}) {
  const config = await loadConfigFile(options.config)
  const buildConfig = {
    ...config,
    baseDir: options.dir || config.baseDir,
    output: options.output || config.output,
  }

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

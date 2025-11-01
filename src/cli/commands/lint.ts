import type { Command } from 'commander'
import { validate } from '../../lib/builder'
import { loadConfigFile } from '../../lib/config'
import { colors } from '../colors'

export function registerLintCommand(program: Command) {
  program
    .command('lint')
    .description('Lint markdown files')
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
  config?: string
}) {
  const config = await loadConfigFile(options.config)
  const contentDir = options.dir || config.baseDir

  // Validate that content directory exists
  const { promises: fs } = await import('node:fs')
  try {
    await fs.access(contentDir)
  } catch {
    throw new Error(`Content directory does not exist: ${contentDir}`)
  }

  console.log(colors.info('Linting Carnet project...'))
  try {
    await validate(contentDir)
    console.log(colors.success('Lint successful!'))
  } catch (error) {
    console.error(colors.error(`Lint failed: ${(error as Error).message}`))
    process.exit(1)
  }
}

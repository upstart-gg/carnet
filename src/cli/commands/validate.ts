import type { Command } from 'commander'
import { validate } from '../../lib/builder'
import { loadConfigFile } from '../../lib/config'
import { colors } from '../colors'

export function registerValidateCommand(program: Command) {
  program
    .command('validate')
    .description('Validate markdown files')
    .option('--strict', 'enable strict validation')
    .action(async (options) => {
      const globalOptions = program.opts()
      await runValidateCommand({
        ...globalOptions,
        ...options,
      })
    })
}

async function runValidateCommand(options: {
  content?: string
  strict?: boolean
  config?: string
}) {
  const config = await loadConfigFile(options.config)
  const contentDir = options.content || config.baseDir

  // Validate that content directory exists
  const { promises: fs } = await import('node:fs')
  try {
    await fs.access(contentDir)
  } catch {
    throw new Error(`Content directory does not exist: ${contentDir}`)
  }

  console.log(colors.info('Validating Carnet project...'))
  try {
    await validate(contentDir)
    console.log(colors.success('Validation successful!'))
  } catch (error) {
    console.error(colors.error(`Validation failed: ${(error as Error).message}`))
    process.exit(1)
  }
}

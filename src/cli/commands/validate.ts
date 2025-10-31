import { validate } from '../../lib/builder'
import { loadConfig } from '../../lib/loadConfig'
import { colors } from '../colors'

export const validateCommand = {
  name: 'validate',
  description: 'Validate markdown files',
  async run(values: { content?: string; strict?: boolean }) {
    const config = await loadConfig()
    const contentDir = values.content || config.baseDir

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
  },
}

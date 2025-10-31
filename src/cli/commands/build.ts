import { watch } from 'node:fs/promises'
import path from 'node:path'
import { build } from '../../lib/builder'
import { loadConfig } from '../../lib/loadConfig'
import { colors } from '../colors'

export const buildCommand = {
  name: 'build',
  description: 'Build markdown files into JSON artifacts',
  async run(values: { content?: string; output?: string; strict?: boolean; watch?: boolean }) {
    const config = await loadConfig()
    const buildOptions = {
      contentDir: values.content || config.baseDir,
      outputDir: values.output || config.output,
      strict: values.strict || config.validation.strict,
    }

    // Validate that content directory exists
    const { promises: fs } = await import('node:fs')
    try {
      await fs.access(buildOptions.contentDir)
    } catch {
      throw new Error(`Content directory does not exist: ${buildOptions.contentDir}`)
    }

    const runBuild = async () => {
      console.log(colors.info('Building Carnet project...'))
      try {
        await build(buildOptions)
      } catch (error) {
        console.error(colors.error(`Build failed: ${(error as Error).message}`))
      }
    }

    await runBuild()

    if (values.watch) {
      console.log(
        colors.info(`\nWatching for changes in ${path.resolve(buildOptions.contentDir)}...`)
      )
      try {
        const watcher = watch(buildOptions.contentDir, { recursive: true })
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
  },
}

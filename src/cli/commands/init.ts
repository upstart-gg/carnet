import { promises as fs } from 'node:fs'
import path from 'node:path'
import { configSchema } from '@lib/schemas'
import type { Command } from 'commander'
import { colors } from '../colors'

export function registerInitCommand(program: Command) {
  program
    .command('init [dir]')
    .description('Initialize a new Carnet project')
    .action(async (dir) => {
      await runInitCommand(dir)
    })
}

async function runInitCommand(dir: string = '.') {
  console.log(colors.info(`Initializing Carnet project in ${path.resolve(dir)}...`))
  await fs.mkdir(path.join(dir, 'agents'), { recursive: true })
  await fs.mkdir(path.join(dir, 'skills'), { recursive: true })
  await fs.mkdir(path.join(dir, 'toolsets'), { recursive: true })
  // Create carnet.config.json file
  const configPath = path.join(dir, 'carnet.config.json')
  const configExists = await fs
    .access(configPath)
    .then(() => true)
    .catch(() => false)
  if (!configExists) {
    const configContent = configSchema.parse({})
    await fs.writeFile(configPath, JSON.stringify(configContent, null, 2), 'utf-8')
  } else {
    console.log(colors.dimmed(`Configuration file already exists at ${configPath}, skipping...`))
  }
  console.log(colors.success('Project initialized successfully!'))
}

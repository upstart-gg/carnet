import { promises as fs } from 'node:fs'
import path from 'node:path'
import { configSchema } from '@lib/schemas'
import type { Command } from 'commander'
import { colors } from '../colors'

export function registerInitCommand(program: Command) {
  program
    .command('init [dir]')
    .description('Initialize a new Carnet project')
    .option('-d, --dir <dir>', 'Carnet project directory to initialize (default: ./carnet)')
    .action(async (dir, options) => {
      // Commander passes positional arg as first param, and flag as options.dir
      const inputDir = options.dir ?? dir ?? './carnet'
      const targetDir = inputDir === '.' ? process.cwd() : path.resolve(process.cwd(), inputDir)
      console.log(colors.info(`Resolved init directory: ${targetDir}`))
      await runInitCommand(targetDir)
    })
}

async function runInitCommand(dir: string = './carnet') {
  const targetDir = path.resolve(dir)

  // If dir is ".", use current working directory directly
  if (targetDir === process.cwd()) {
    console.log(colors.info(`Initializing Carnet project in current directory...`))
  } else {
    console.log(colors.info(`Initializing Carnet project in ${targetDir}...`))
    await fs.mkdir(targetDir, { recursive: true })
  }

  // Create required subdirectories directly inside targetDir
  const subDirs = ['agents', 'skills', 'toolsets']
  for (const sub of subDirs) {
    await fs.mkdir(path.join(targetDir, sub), { recursive: true })
  }

  // Create carnet.config.json file
  const configPath = path.join(targetDir, 'carnet.config.json')
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

import fs from 'node:fs'
import path from 'node:path'
import type { Command } from 'commander'
import type { z } from 'zod'
import { loadConfigFile } from '../../lib/config'
import type { Manifest } from '../../lib/index'
import { parseMarkdownFile } from '../../lib/parser'
import { agentSchema, skillSchema, toolsetSchema } from '../../lib/schemas'
import { colors } from '../colors'

export function registerShowCommand(program: Command): void {
  program
    .command('show <type> <name>')
    .description('Show detailed information about an entity')
    .action(async (type, name, options) => {
      const globalOptions = program.opts()
      await runShowCommand(type, name, {
        ...globalOptions,
        ...options,
      })
    })
}

async function runShowCommand(type: string, name: string, options: { dir?: string }) {
  const cwd = process.env.INIT_CWD ?? process.env.PWD ?? process.cwd()
  const carnetDir = path.resolve(cwd, options.dir || './carnet')
  await loadConfigFile(carnetDir)
  let filePath: string
  let schema: z.ZodType<unknown>

  switch (type) {
    case 'agent':
      filePath = path.join(carnetDir, 'agents', name, 'AGENT.md')
      schema = agentSchema
      break
    case 'skill':
      // This is a simplification. In a real-world scenario,
      // we'd need to search for the skill in all categories.
      filePath = path.join(carnetDir, 'skills', 'shared', name, 'SKILL.md')
      schema = skillSchema
      break
    case 'toolset':
      filePath = path.join(carnetDir, 'toolsets', name, 'TOOLSET.md')
      schema = toolsetSchema
      break

    case 'agent:prompt': {
      const { Carnet } = await import('../../lib/index')
      const manifestPath = path.join(carnetDir, 'carnet.manifest.json')
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) as Manifest
      const carnet = new Carnet(manifest)
      console.log(carnet.getSystemPrompt(name))
      return
    }

    default:
      console.error(colors.error(`Unknown entity type: ${type}`))
      process.exit(1)
  }

  try {
    const entity = await parseMarkdownFile(filePath, schema)
    console.log(colors.info(JSON.stringify(entity, null, 2)))
  } catch (error) {
    console.error(colors.error(`Could not show ${type} "${name}": ${(error as Error).message}`))
    process.exit(1)
  }
}

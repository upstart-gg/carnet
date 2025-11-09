import path from 'node:path'
import type { Command } from 'commander'
import type { z } from 'zod'
import { loadConfigFile } from '../../lib/config'
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
  // Use INIT_CWD (set by npm/pnpm/yarn) to get the directory where the command was invoked
  // Fall back to process.cwd() if INIT_CWD is not available
  const cwd = process.env.INIT_CWD || process.cwd()
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

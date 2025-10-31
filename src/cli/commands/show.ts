import path from 'node:path'
import type { Command } from 'commander'
import type { z } from 'zod'
import { parseMarkdownFile } from '../../lib/parser'
import { agentSchema, skillSchema, toolsetSchema } from '../../lib/schemas'
import { colors } from '../colors'

export function registerShowCommand(program: Command) {
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

async function runShowCommand(type: string, name: string, options: { content?: string }) {
  const contentDir = options.content || './content'
  let filePath: string
  let schema: z.ZodType<unknown>

  switch (type) {
    case 'agent':
      filePath = path.join(contentDir, 'agents', name, 'AGENT.md')
      schema = agentSchema
      break
    case 'skill':
      // This is a simplification. In a real-world scenario,
      // we'd need to search for the skill in all categories.
      filePath = path.join(contentDir, 'skills', 'shared', name, 'SKILL.md')
      schema = skillSchema
      break
    case 'toolset':
      filePath = path.join(contentDir, 'toolsets', name, 'TOOLSET.md')
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

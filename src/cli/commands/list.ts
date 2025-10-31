import path from 'node:path'
import type { Command } from 'commander'
import { discoverAgents, discoverSkills, discoverToolsets } from '../../lib/discovery'
import { colors } from '../colors'

export function registerListCommand(program: Command) {
  program
    .command('list <type>')
    .description('List all entities of a type')
    .action(async (type, options) => {
      const globalOptions = program.opts()
      await runListCommand(type, {
        ...globalOptions,
        ...options,
      })
    })
}

async function runListCommand(type: string, options: { content?: string }) {
  const contentDir = options.content || './content'
  try {
    switch (type) {
      case 'agents':
        await listEntities(discoverAgents, 'Agents', contentDir)
        break
      case 'skills':
        await listEntities(discoverSkills, 'Skills', contentDir)
        break
      case 'toolsets':
        await listEntities(discoverToolsets, 'Toolsets', contentDir)
        break
      default:
        console.error(colors.error(`Unknown entity type: ${type}`))
        process.exit(1)
    }
  } catch (error) {
    console.error(colors.error(`Failed to list ${type}: ${(error as Error).message}`))
    process.exit(1)
  }
}

async function listEntities(
  discoverFn: (dir: string) => AsyncIterable<string>,
  title: string,
  contentDir: string
) {
  console.log(colors.bold(`${title}:`))
  for await (const file of discoverFn(contentDir)) {
    const name = path.basename(file, path.extname(file))
    const displayName =
      path.basename(path.dirname(file)) !== path.basename(contentDir)
        ? path.basename(path.dirname(file))
        : name
    console.log(colors.dimmed(`- ${displayName}`))
  }
}

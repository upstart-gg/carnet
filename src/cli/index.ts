import { parseArgs } from 'node:util'
import { colors } from './colors'
import { buildCommand } from './commands/build'
import { graphCommand } from './commands/graph'
import { initCommand } from './commands/init'
import { listCommand } from './commands/list'
import { showCommand } from './commands/show'
import { validateCommand } from './commands/validate'

const commands = [
  initCommand,
  buildCommand,
  validateCommand,
  listCommand,
  showCommand,
  graphCommand,
]

const { values, positionals } = parseArgs({
  options: {
    output: { type: 'string', short: 'o' },
    'output-dir': { type: 'string' },
    content: { type: 'string' },
    strict: { type: 'boolean' },
    watch: { type: 'boolean', short: 'w' },
    help: { type: 'boolean', short: 'h' },
    category: { type: 'string', short: 'c' },
    skills: { type: 'string', short: 's' },
    var: { type: 'string', short: 'v', multiple: true },
  },
  allowPositionals: true,
})

const commandName = positionals[0]

if (values.help || !commandName) {
  showHelp()
  process.exit(0)
}

const command = commands.find((c) => c.name === commandName)

if (!command) {
  console.error(`Unknown command: ${commandName}`)
  showHelp()
  process.exit(1)
}

;(command.run as (...args: unknown[]) => void)(...positionals.slice(1), values)

function showHelp() {
  console.log(`
    Usage: carnet <command> [options]

    ${colors.bold('Commands:')}
      ${commands.map((c) => `${c.name.padEnd(10)} ${c.description}`).join('\n      ')}

    ${colors.bold('Options:')}
      -o, --output <dir>        Output directory (default: ./dist)
      --output-dir <dir>        Output directory for built artifacts (default: ./dist)
      --content <dir>           Content directory (default: ./content)
      -w, --watch               Watch for changes and rebuild
      --strict                  Enable strict validation
      -c, --category <cat>      Category for skills
      -s, --skills <skills>     Comma-separated skills to include
      -v, --var <KEY=value>     Template variable substitution
      -h, --help                Show this help message
  `)
}

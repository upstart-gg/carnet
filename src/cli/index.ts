import { Command } from 'commander'
import pkg from '../../package.json' with { type: 'macro' }
import { registerBuildCommand } from './commands/build'
import { registerInitCommand } from './commands/init'
import { registerLintCommand } from './commands/lint'
import { registerListCommand } from './commands/list'
import { registerShowCommand } from './commands/show'

const program = new Command()

program
  .name('carnet')
  .description(
    'A library and CLI for managing AI agent definitions, skills, toolsets, and tools through markdown files with smart prompt generation'
  )
  .version(pkg.version)

// Global options
program
  .option('-d, --dir <dir>', 'Carnet project directory containing carnet.config.json and content (default: ./carnet)')

// Register commands
registerInitCommand(program)
registerBuildCommand(program)
registerLintCommand(program)
registerListCommand(program)
registerShowCommand(program)

program.parse()

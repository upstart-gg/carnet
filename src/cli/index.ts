import { Command } from 'commander'
import { registerBuildCommand } from './commands/build'
import { registerInitCommand } from './commands/init'
import { registerListCommand } from './commands/list'
import { registerShowCommand } from './commands/show'
import { registerValidateCommand } from './commands/validate'

const program = new Command()

program
  .name('carnet')
  .description(
    'A library and CLI for managing AI agent definitions, skills, toolsets, and tools through markdown files with smart prompt generation'
  )
  .version('0.1.0')

// Global options
program
  .option('-c, --config <path>', 'path to the carnet config file')
  .option('--content <dir>', 'content directory (default: ./content)')

// Register commands
registerInitCommand(program)
registerBuildCommand(program)
registerValidateCommand(program)
registerListCommand(program)
registerShowCommand(program)

program.parse()

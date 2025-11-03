#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Command } from 'commander'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkgPath = resolve(__dirname, '../../package.json')
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))

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
program.option(
  '-d, --dir <dir>',
  'Carnet project directory containing carnet.config.json and content (default: ./carnet)'
)

// Register commands
registerInitCommand(program)
registerBuildCommand(program)
registerLintCommand(program)
registerListCommand(program)
registerShowCommand(program)

program.parse()

import { promises as fs } from 'node:fs'
import path from 'node:path'

interface CommandMetadata {
  name: string
  description: string
  aliases: string[]
  arguments: Array<{ name: string }>
  options: Array<{ flags: string; description: string }>
}

async function extractCliCommands(): Promise<Map<string, CommandMetadata>> {
  const commands = new Map<string, CommandMetadata>()

  const cliDir = 'src/cli/commands'
  const files = await fs.readdir(cliDir)

  for (const file of files) {
    if (file === 'index.ts' || !file.endsWith('.ts')) continue

    const commandName = file.replace('.ts', '')
    const filePath = path.join(cliDir, file)
    const content = await fs.readFile(filePath, 'utf-8')

    const metadata = extractCommandMetadata(content)
    if (metadata) {
      commands.set(commandName, metadata)
    }
  }

  return commands
}

function extractCommandMetadata(fileContent: string): CommandMetadata | null {
  let name = ''
  let description = ''
  const aliases: string[] = []
  const arguments_: Array<{ name: string }> = []
  const options: Array<{ flags: string; description: string }> = []

  // Extract command name and arguments from .command('init [dir]')
  const cmdMatch = fileContent.match(/\.command\('([^']+)'\)/)
  if (cmdMatch) {
    const fullCmd = cmdMatch[1]
    const parts = fullCmd.split(/\s+/)
    name = parts[0]

    // Parse arguments like [dir] or <arg>
    for (let i = 1; i < parts.length; i++) {
      const arg = parts[i].replace(/[\[\]<>]/g, '')
      if (arg) {
        arguments_.push({ name: arg })
      }
    }
  }

  // Extract aliases from .alias('...')
  const aliasMatches = [...fileContent.matchAll(/\.alias\('([^']+)'\)/g)]
  for (const match of aliasMatches) {
    aliases.push(match[1])
  }

  // Extract description from .description('...')
  const descMatch = fileContent.match(/\.description\('([^']+)'\)/)
  if (descMatch) {
    description = descMatch[1]
  }

  // Extract options from .option('-flag', '...') or .option('-flag', '...', 'default')
  const optMatches = [...fileContent.matchAll(/\.option\('([^']+)',\s*'([^']+)'(?:,\s*'[^']*')?\)/g)]
  for (const match of optMatches) {
    options.push({
      flags: match[1],
      description: match[2],
    })
  }

  if (!name) return null

  return {
    name,
    description,
    aliases,
    arguments: arguments_,
    options,
  }
}

async function generateCommandDocs(commands: Map<string, CommandMetadata>) {
  // Global options that apply to all commands
  const globalOptions = [
    { flags: '-c, --config <path>', description: 'path to the carnet config file' },
    { flags: '-d, --dir <dir>', description: 'content directory (default: ./carnet)' },
  ]

  for (const [name, metadata] of commands) {
    const argsText = metadata.arguments.length
      ? `\n\n## Arguments\n\n${metadata.arguments.map(a => `- \`${a.name}\``).join('\n')}`
      : ''

    // Combine command-specific and global options
    const allOptions = [...metadata.options, ...globalOptions]
    const optionsText = allOptions.length
      ? `\n\n## Options\n\n| Option | Description |\n|--------|-------------|\n${allOptions.map(o => `| \`${o.flags}\` | ${o.description} |`).join('\n')}`
      : ''

    const argsUsage = metadata.arguments.length
      ? ` ${metadata.arguments.map(a => `[${a.name}]`).join(' ')}`
      : ''

    // Build usage examples with aliases
    let usageExamples = `\`\`\`bash\ncarnet ${name}${argsUsage}`
    if (metadata.aliases.length > 0) {
      for (const alias of metadata.aliases) {
        usageExamples += `\ncarnet ${alias}${argsUsage}`
      }
    }
    usageExamples += '\n```'

    const markdown = `# \`carnet ${name}\`

${metadata.description}

## Usage

${usageExamples}${argsText}${optionsText}
`

    const docsDir = 'docs/cli'
    await fs.mkdir(docsDir, { recursive: true })
    await fs.writeFile(path.join(docsDir, `${name}.md`), markdown.trim())
  }
}

async function main() {
  try {
    const commands = await extractCliCommands()
    await generateCommandDocs(commands)
    console.log(`✓ Generated CLI documentation for ${commands.size} commands`)
  } catch (error) {
    console.error('Error generating CLI docs:', error)
    process.exit(1)
  }
}

main()

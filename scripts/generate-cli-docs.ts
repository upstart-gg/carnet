import { promises as fs } from 'node:fs'
import path from 'node:path'

interface CommandMetadata {
  name: string
  description: string
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

  // Extract description from .description('...')
  const descMatch = fileContent.match(/\.description\('([^']+)'\)/)
  if (descMatch) {
    description = descMatch[1]
  }

  // Extract options from .option('-flag', '...')
  const optMatches = [...fileContent.matchAll(/\.option\('([^']+)',\s*'([^']+)'\)/g)]
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
    arguments: arguments_,
    options,
  }
}

async function generateCommandDocs(commands: Map<string, CommandMetadata>) {
  for (const [name, metadata] of commands) {
    const argsText = metadata.arguments.length
      ? `\n\n## Arguments\n\n${metadata.arguments.map(a => `- \`${a.name}\``).join('\n')}`
      : ''

    const optionsText = metadata.options.length
      ? `\n\n## Options\n\n| Option | Description |\n|--------|-------------|\n${metadata.options.map(o => `| \`${o.flags}\` | ${o.description} |`).join('\n')}`
      : ''

    const argsUsage = metadata.arguments.length
      ? ` ${metadata.arguments.map(a => `[${a.name}]`).join(' ')}`
      : ''

    const markdown = `# \`carnet ${name}\`

${metadata.description}

## Usage

\`\`\`bash
carnet ${name}${argsUsage}
\`\`\`${argsText}${optionsText}
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

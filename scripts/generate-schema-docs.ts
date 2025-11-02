import { promises as fs } from 'node:fs'
import path from 'node:path'

const SCHEMA_DOCS: Record<string, string> = {
  'docs/configuration/config-file.md': `# Configuration Schema

The \`carnet.config.json\` configuration file defines how your Carnet project builds and processes content.

## Configuration Options

All options are optional and have sensible defaults.

### \`baseDir\`

- **Type:** \`string\`
- **Default:** \`"./carnet"\`
- **Description:** Path to the content directory containing agents, skills, toolsets, and tools

### \`output\`

- **Type:** \`string\`
- **Default:** \`"./dist"\`
- **Description:** Output directory where the compiled manifest.json will be written

### \`app\`

- **Type:** \`AppConfig\`
- **Description:** Application-level configuration for skills and capabilities

### \`variables\`

- **Type:** \`Record<string, string>\`
- **Default:** \`{}\`
- **Description:** Custom variables to be injected into markdown content using \`{{ VARIABLE_NAME }}\` syntax

### \`envPrefix\`

- **Type:** \`string[]\`
- **Default:** \`["CARNET_", "PUBLIC_"]\`
- **Description:** Environment variable prefixes that are allowed to be injected into content

### \`include\`

- **Type:** \`string[]\`
- **Default:** \`[]\`
- **Description:** Glob patterns of content files or directories to include in processing

### \`exclude\`

- **Type:** \`string[]\`
- **Default:** \`[]\`
- **Description:** Glob patterns of content files or directories to exclude from processing

## Example Configuration

\`\`\`json
{
  "baseDir": "./content",
  "output": "./dist",
  "app": {
    "globalInitialSkills": ["common"],
    "globalSkills": ["utilities"]
  },
  "variables": {
    "COMPANY": "Acme Corp",
    "SUPPORT_EMAIL": "support@acme.com"
  },
  "envPrefix": ["CARNET_", "PUBLIC_"],
  "include": ["agents/**", "skills/**"],
  "exclude": ["**/draft/**"]
}
\`\`\`
`,

  'docs/content/agents.md': `# Agent Schema

An agent is the main entity in Carnet - it represents an AI agent with a system prompt and a set of skills.

## Schema Fields

### \`name\`

- **Type:** \`string\`
- **Required:** Yes
- **Description:** Unique identifier for the agent

### \`description\`

- **Type:** \`string\`
- **Required:** Yes
- **Description:** Human-readable description of the agent's purpose

### \`initialSkills\`

- **Type:** \`string[]\`
- **Default:** \`[]\`
- **Description:** Skills that are automatically loaded when the agent is created

### \`skills\`

- **Type:** \`string[]\`
- **Default:** \`[]\`
- **Description:** Additional skills that can be loaded on demand during the agent's lifecycle

### \`prompt\`

- **Type:** \`string\` (markdown)
- **Required:** Yes
- **Description:** The system prompt for the agent (markdown content)

## Example Agent

\`\`\`markdown
---
name: code-assistant
description: AI assistant for code generation and debugging
initialSkills: [code-analysis]
skills: [code-generation, testing, documentation]
---

# Code Assistant

You are a skilled code assistant. Help users write, debug, and improve code. Focus on best practices and clear explanations.

This is the markdown body of the agent, which becomes the system prompt.
\`\`\`
`,

  'docs/content/skills.md': `# Skill Schema

A skill is a collection of related toolsets that provide specific capabilities to an agent.

## Schema Fields

### \`name\`

- **Type:** \`string\`
- **Required:** Yes
- **Description:** Unique identifier for the skill

### \`description\`

- **Type:** \`string\`
- **Required:** Yes
- **Description:** Human-readable description of what this skill provides

### \`toolsets\`

- **Type:** \`string[]\`
- **Default:** \`[]\`
- **Description:** List of toolsets that make up this skill

### \`content\`

- **Type:** \`string\` (markdown)
- **Description:** Detailed documentation and implementation notes for the skill

## Example Skill

\`\`\`markdown
---
name: code-generation
description: Code generation and synthesis capabilities
toolsets: [python-codegen, typescript-codegen]
---

# Code Generation Skill

This skill provides code generation and synthesis capabilities across multiple languages. It bundles together tools for Python and TypeScript code generation.

The markdown body here documents the skill in detail.
\`\`\`
`,

  'docs/content/toolsets.md': `# Toolset Schema

A toolset is a collection of related tools that work together to provide functionality.

## Schema Fields

### \`name\`

- **Type:** \`string\`
- **Required:** Yes
- **Description:** Unique identifier for the toolset

### \`description\`

- **Type:** \`string\`
- **Required:** Yes
- **Description:** Human-readable description of the toolset

### \`tools\`

- **Type:** \`string[]\`
- **Required:** Yes
- **Description:** List of tools included in this toolset

### \`content\`

- **Type:** \`string\` (markdown)
- **Description:** Documentation for the toolset and its tools

## File Structure

Toolsets and their tools are organized in a nested directory structure:

\`\`\`
content/toolsets/
├── [toolset-name]/
│   ├── TOOLSET.md          # Toolset definition
│   ├── [tool-1-name].md    # First tool
│   ├── [tool-2-name].md    # Second tool
│   └── [tool-3-name].md    # Third tool
├── [another-toolset]/
│   ├── TOOLSET.md
│   ├── tool-a.md
│   └── tool-b.md
└── ...
\`\`\`

Tools are defined as individual markdown files within their parent toolset directory, not in a separate top-level tools directory.

## Example Toolset

\`\`\`markdown
---
name: code-formatter
description: Code formatting and styling tools
tools: [prettier, eslint-formatter]
---

# Code Formatter Toolset

This toolset provides tools for formatting and styling code according to industry best practices. It includes Prettier for general formatting and ESLint formatter for JavaScript-specific concerns.

The markdown body documents how these tools work together.
\`\`\`
`,

  'docs/content/tools.md': `# Tool Schema

A tool is the smallest unit - it represents a single capability or function available to an agent. Tools are always defined within a toolset.

## Schema Fields

### \`name\`

- **Type:** \`string\`
- **Required:** Yes
- **Description:** Unique identifier for the tool (must match the filename without .md)

### \`description\`

- **Type:** \`string\`
- **Required:** Yes
- **Description:** Human-readable description of what the tool does

### \`content\`

- **Type:** \`string\` (markdown)
- **Description:** Detailed documentation, usage examples, and implementation notes

## File Structure

Tools are defined as markdown files (without YAML frontmatter keys for name/description) directly within their parent toolset directory:

\`\`\`
content/toolsets/[toolset-name]/
├── TOOLSET.md           # Toolset definition
├── tool-name-1.md       # Tool definition
├── tool-name-2.md       # Tool definition
└── tool-name-3.md       # Tool definition
\`\`\`

The filename (minus .md extension) becomes the tool's name.

## Example Tool

\`\`\`markdown
---
name: format-code
description: Format code using Prettier
---

# Format Code Tool

This tool wraps Prettier to format code consistently. It handles JavaScript, TypeScript, JSX, CSS, JSON and more.

## Usage

Format your code files with consistent styling.

## Configuration

Prettier configuration can be specified in .prettierrc
\`\`\`
`,
}

async function main() {
  try {
    for (const [filePath, content] of Object.entries(SCHEMA_DOCS)) {
      await fs.mkdir(path.dirname(filePath), { recursive: true })
      await fs.writeFile(filePath, content.trim())
    }
    console.log(`✓ Generated schema documentation for ${Object.keys(SCHEMA_DOCS).length} schemas`)
  } catch (error) {
    console.error('Error generating schema docs:', error)
    process.exit(1)
  }
}

main()

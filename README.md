# Carnet

> A build system and content management library for AI agents defined in markdown files

**Carnet** (French for "notebook") is a framework for managing AI agent definitions, skills, toolsets, and tools through markdown files. Define your agents declaratively, validate references at build time, and get optimized JSON manifests for runtime use.

## Features

- **Markdown-First** - Define all agent content in git-friendly markdown files
- **Build-Time Validation** - Catch broken references before deployment
- **Zero Runtime Overhead** - Compile to fast-loading JSON manifests
- **Flexible API** - Use the CLI to compile prompts and the library to load them
- 🌍 **Multi-Runtime** - Works with Node.js, Bun, and Deno
- 🎯 **Minimal Dependencies** - Only 4 production dependencies
- 🔒 **Type-Safe** - Full TypeScript support with Zod validation
- 🔄 **Watch Mode** - Rebuild automatically during development

## Quick Start

### Installation

**For CLI usage (recommended - install globally):**

```bash
# npm
npm install -g @upstart-gg/carnet

# bun
bun add -g @upstart-gg/carnet

# pnpm
pnpm add -g @upstart-gg/carnet
```

**For programmatic usage (install locally):**

```bash
# npm
npm install @upstart-gg/carnet

# bun
bun add @upstart-gg/carnet

# pnpm
pnpm add @upstart-gg/carnet
```

**Or use without installing:**

```bash
# npm
npx @upstart-gg/carnet init my-agents

# bun
bunx @upstart-gg/carnet init my-agents

# pnpm
pnpm dlx @upstart-gg/carnet init my-agents
```

### Initialize a Project

With global installation:
```bash
carnet init my-agents
cd my-agents
npm install
```

Or with npx (no installation needed):
```bash
npx @upstart-gg/carnet init my-agents
cd my-agents
npm install
```

This creates:

```
my-agents/
├── package.json
├── carnet.config.json
└── content/
    ├── agents/
    │   └── my-agent/AGENT.md
    ├── skills/
    │   └── example-skill/SKILL.md
    ├── toolsets/
    │   └── example-toolset/TOOLSET.md
    └── tools/
        └── example-tool/TOOL.md
```

### Build Your Content

```bash
carnet build              # Build once
carnet build --watch      # Watch for changes (development)
```

This generates `dist/carnet.manifest.json` with all your agents, skills, toolsets, and tools compiled together.

### Use Your Agents

```typescript
import { Carnet } from '@upstart-gg/carnet'

const carnet = await Carnet.fromFile('./dist/carnet.manifest.json')
const agent = carnet.getAgent('my-agent')
console.log(agent.prompt) // Get agent's system prompt
```

## How It Works

### Content Structure

Carnet organizes content into four entity types, forming a hierarchy:

```
Agent
├── Skills (on-demand)
│   └── Toolsets
│       └── Tools
└── Skills (auto-loaded)
    └── Toolsets
        └── Tools
```

### Entity Types

**Agent** - An AI agent with a prompt and skill references:

```markdown
---
name: coder
description: Code generation assistant
initialSkills: [code-execution]
skills: [code-generation, debugging]
prompt: |
  You are an AI code assistant.
  Your role is to help write, debug, and improve code.
---

# Coder Agent

Additional documentation here...
```

**Skill** - A capability grouping tools:

```markdown
---
name: code-generation
description: Generate and write code
toolsets: [code-formatter, code-analyzer]
---

# Code Generation

This skill enables AI agents to generate code...
```

**Toolset** - A collection of related tools:

```markdown
---
name: code-formatter
description: Format and style code
tools: [prettier, eslint]
---

# Code Formatter

Tools for formatting and styling code...
```

**Tool** - A single capability:

```markdown
---
name: prettier
description: Format code with Prettier
---

# Prettier

A code formatter for JavaScript, TypeScript, and more...
```

## CLI Commands

### `carnet init [dir]`

Initialize a new Carnet project.

```bash
carnet init my-project     # Create new directory
carnet init                # Use current directory
```

### `carnet build [options]`

Build markdown files into a compiled manifest.

```bash
carnet build               # Build once
carnet build --watch       # Watch mode
carnet build -o ./output   # Custom output directory
```

**Options:**
- `-o, --output <dir>` - Output directory
- `-w, --watch` - Watch for changes
- `--strict` - Strict validation

### `carnet validate`

Validate content without building.

```bash
carnet validate            # Check content validity
```

### `carnet list [agent]`

Display agent structure in tree format.

```bash
carnet list                # Show all agents
carnet list coder          # Show specific agent
```

**Example output:**
```
coder
├── code-generation
│   └── code-formatter
│       └── prettier
└── debugging
    └── debugger
        └── console-logger
```

### `carnet show <type> <name>`

Display entity details.

```bash
carnet show agent coder
carnet show skill code-generation
carnet show toolset code-formatter
carnet show tool prettier
```

### Global Options

Available with all commands:

```bash
carnet build --config ./custom.config.json
carnet build --content ./my-content-dir
```

- `-c, --config <path>` - Config file path
- `--content <dir>` - Content directory

## Programmatic API

### Loading and Querying

```typescript
import { Carnet } from '@upstart-gg/carnet'

// Load from built manifest
const carnet = await Carnet.fromFile('./dist/carnet.manifest.json')

// Access agents
const agent = carnet.getAgent('coder')
console.log(agent.prompt)

// List all agents
for (const [name, agent] of Object.entries(carnet.agents)) {
  console.log(`${name}: ${agent.description}`)
}

// Access skills, toolsets, tools
const skill = carnet.getSkill('code-generation')
const toolset = carnet.getToolset('code-formatter')
const tool = carnet.getTool('prettier')
```

### Building Programmatically

```typescript
import { build, validate } from '@upstart-gg/carnet'

// Validate first
await validate('./content')

// Build
await build({
  baseDir: './content',
  output: './dist',
  app: {
    globalInitialSkills: ['common'],
    globalSkills: ['utilities'],
  },
  variables: {
    COMPANY: 'ACME Corp',
    SUPPORT_EMAIL: 'support@acme.com',
  },
})
```

## Configuration

### carnet.config.json

```json
{
  "baseDir": "./content",
  "output": "./dist",
  "app": {
    "globalInitialSkills": [],
    "globalSkills": ["utilities"]
  },
  "variables": {
    "COMPANY": "My Company",
    "API_ENDPOINT": "https://api.example.com"
  },
  "envPrefix": ["CARNET_", "PUBLIC_"],
  "include": ["agents/**", "skills/**"],
  "exclude": ["**/draft/**"]
}
```

**Configuration Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `baseDir` | string | `"./content"` | Content directory location |
| `output` | string | `"./dist"` | Output directory for manifest |
| `app.globalInitialSkills` | string[] | `[]` | Skills auto-loaded for all agents |
| `app.globalSkills` | string[] | `[]` | Skills available to all agents |
| `variables` | object | `{}` | Template variables for content |
| `envPrefix` | string[] | `["CARNET_", "PUBLIC_"]` | Env var prefixes to allow |
| `include` | string[] | - | Glob patterns to include |
| `exclude` | string[] | - | Glob patterns to exclude |

### Environment Variables & Templates

Use variables in your markdown:

```markdown
# Company Policies

Contact {{ COMPANY }} at {{ SUPPORT_EMAIL }}

For API details, visit {{ API_ENDPOINT }}
```

Variables can come from:
1. **Config file:** `variables` object in `carnet.config.json`
2. **Environment:** Variables matching `envPrefix` (e.g., `CARNET_API_KEY`)

## Manifest Output

After building, you get a `carnet.manifest.json`:

```json
{
  "version": "0.1.0",
  "app": {
    "globalInitialSkills": [],
    "globalSkills": ["utilities"]
  },
  "agents": {
    "coder": {
      "name": "coder",
      "description": "Code generation assistant",
      "initialSkills": ["code-execution"],
      "skills": ["code-generation"],
      "prompt": "You are an AI code assistant..."
    }
  },
  "skills": { ... },
  "toolsets": { ... },
  "tools": { ... }
}
```

Load and use it anywhere:

```typescript
const manifest = await fetch('./dist/carnet.manifest.json').then(r => r.json())
const agentPrompt = manifest.agents.coder.prompt
```

## Development Workflow

### 1. Create Agents

Define your agents in `content/agents/`:

```bash
mkdir -p content/agents/my-agent
cat > content/agents/my-agent/AGENT.md << 'EOF'
---
name: my-agent
description: My AI agent
initialSkills: []
skills: []
prompt: |
  You are my-agent.
---

# My Agent

Documentation here.
EOF
```

### 2. Create Skills & Tools

Similarly create skills and tools in `content/skills/`, `content/toolsets/`, `content/tools/`.

### 3. Reference Them

Update agent:

```markdown
skills:
  - my-skill
```

Update skill:

```markdown
toolsets:
  - my-toolset
```

### 4. Build & Test

```bash
carnet build --watch        # Build with watch mode
carnet validate             # Check for errors
carnet list                 # View structure
```

### 5. Use in Your App

```typescript
import { Carnet } from '@upstart-gg/carnet'
const carnet = await Carnet.fromFile('./dist/carnet.manifest.json')
// Use carnet.getAgent('my-agent'), etc.
```

## Examples

See the `examples/` directory for complete working projects:

- **basic-cli/** - Using Carnet via CLI
- **nodejs-programmatic/** - Using Carnet as a library
- **ci-cd/** - Integrating with GitHub Actions
- **my-app/** - Comprehensive real-world example

Run an example:

```bash
cd examples/nodejs-programmatic
npm install
npm run build
npm run start
```




## Changesets & Versioning

This project uses Changesets for semantic versioning:

```bash
# Create a changeset
bun changeset

# Version will be auto-bumped on merge to main
# Auto-published to npm
```

## TypeScript Support

Carnet is written in TypeScript and exports full types:

```typescript
import type {
  Agent,
  Skill,
  Toolset,
  Tool,
  Manifest,
  CarnetConfig,
} from '@upstart-gg/carnet'
```

All APIs are type-safe with IntelliSense support.

## Documentation

- **[Official Documentation](https://upstart-gg.github.io/carnet/)** - Complete guides, API reference, and more
- **[AGENTS.md](./AGENTS.md)** - Technical reference for AI assistants (AI-focused)
- **[npm Package](https://www.npmjs.com/package/@upstart-gg/carnet)** - Package page

## Technology

- **Language:** TypeScript
- **Runtime:** Node.js 22+, Bun 1.0+, Deno 2.0+
- **Builder:** Bun bundler
- **Validation:** Zod
- **CLI:** Commander.js
- **Linter:** Biome
- **Testing:** Bun test

## License

MIT

## Support

- 📖 [Documentation](https://upstart-gg.github.io/carnet/)
- 🐛 [Report Issues](https://github.com/upstart-gg/carnet/issues)
- 💬 [Discussions](https://github.com/upstart-gg/carnet/discussions)
- 📦 [npm Package](https://www.npmjs.com/package/@upstart-gg/carnet)

---

**Happy building! 🚀**

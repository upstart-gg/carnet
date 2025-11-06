# Carnet - AI Agent Framework

## Project Overview

**Carnet** (French for "notebook") is a production-ready framework for building AI agents with Vercel AI SDK using markdown-based content management. It provides intelligent prompt generation and progressive skill loading to build scalable, context-aware AI agents.

## Core Concepts

### Architecture

Carnet follows a hierarchical content model:

1. **Agents** - Top-level AI agent definitions with system prompts and configurations
2. **Skills** - Reusable capabilities that can be attached to agents
3. **Toolsets** - Collections of related tools grouped by functionality
4. **Tools** - Individual executable functions that agents can use

All content is defined using markdown files with frontmatter metadata, making them human-readable and version-controllable.

### Workflow

1. **Write** agent, skill, toolset, and tool definitions in markdown files
2. **Build** content with `carnet build` CLI to generate a validated manifest
3. **Integrate** with Vercel AI SDK using `getSystemPrompt()` and `getTools()` methods

## Directory Structure

```
/
├── src/
│   ├── cli/              # CLI commands and tooling
│   │   ├── commands/     # Build, init, list, show, lint commands
│   │   └── index.ts      # CLI entry point
│   └── lib/              # Core library functionality
│       ├── builder.ts    # Manifest building logic
│       ├── parser.ts     # Markdown file parsing
│       ├── discovery.ts  # Content discovery system
│       ├── prompt-generator.ts           # System prompt generation
│       ├── dynamic-prompt-generator.ts   # Dynamic prompt generation
│       ├── tools.ts      # Tool management
│       ├── tool-registry.ts              # Tool registration
│       ├── tool-filtering.ts             # Tool filtering logic
│       ├── variable-injector.ts          # Variable injection system
│       ├── config.ts     # Configuration management
│       ├── schemas.ts    # Zod validation schemas
│       └── types.ts      # TypeScript type definitions
├── tests/
│   ├── lib/              # Library unit tests
│   ├── integration/      # Integration tests
│   └── fixtures/         # Test fixtures
├── docs/                 # VitePress documentation
│   ├── guide/            # User guides
│   ├── api/              # API reference
│   ├── cli/              # CLI documentation
│   ├── content/          # Content definition guides
│   └── configuration/    # Configuration docs
└── scripts/              # Build and utility scripts
```

## Tech Stack

- **Runtime**: Node.js >=22, Bun >=1.0, Deno >=2.0
- **Language**: TypeScript
- **Testing**: Bun test runner
- **Linting/Formatting**: Biome
- **Documentation**: VitePress
- **Build Tool**: bunup
- **Parsing**: gray-matter (frontmatter parsing)
- **CLI**: commander
- **Peer Dependencies**:
  - Vercel AI SDK (ai >=5.0.0)
  - Zod (^4.0.0)

## Development Commands

- `bun dev` - Watch mode development
- `bun build` - Build the project and generate config schema
- `bun test` - Run tests
- `bun lint` - Lint code with Biome
- `bun format` - Format code with Biome
- `bun docs:dev` - Start documentation dev server
- `bun docs:build` - Build documentation
- `bun changeset` - Create a changeset for versioning

## CLI Commands

- `carnet init` - Initialize a new Carnet project
- `carnet build` - Build and validate content manifest
- `carnet list` - List all content (agents, skills, toolsets, tools)
- `carnet show <id>` - Show details of a specific content item
- `carnet lint` - Lint markdown content files

## Key Components

### Parser (`src/lib/parser.ts`)
Parses markdown files with frontmatter metadata, extracting content and validating schemas.

### Builder (`src/lib/builder.ts`)
Builds the manifest by discovering, parsing, and validating all content files. Creates the `.carnet/manifest.json` file.

### Discovery (`src/lib/discovery.ts`)
Discovers content files in the project following the standard directory structure.

### Prompt Generator (`src/lib/prompt-generator.ts`)
Generates system prompts for agents by combining agent definitions, skills, and tools.

### Dynamic Prompt Generator (`src/lib/dynamic-prompt-generator.ts`)
Provides runtime prompt generation with progressive skill loading.

### Tool System
- `tool-registry.ts` - Registers and manages tool definitions
- `tools.ts` - Core tool management functionality
- `tool-filtering.ts` - Filters tools based on various criteria

### Variable Injection (`src/lib/variable-injector.ts`)
Handles variable substitution in prompts and content using `{{variable}}` syntax.

## Content File Structure

Content files follow a standard structure with frontmatter and markdown body:

```markdown
---
id: example-id
name: Example Name
description: Example description
# Additional metadata...
---

Markdown content body...
```

## Important Conventions

1. **Content Discovery**: Files are discovered in standard directories (agents, skills, toolsets, tools)
2. **ID Format**: Use kebab-case for content IDs
3. **Validation**: All content is validated against Zod schemas
4. **Manifest**: Built manifest is stored in `.carnet/manifest.json`
5. **Variable Syntax**: Use `{{variableName}}` for variable injection

## Configuration

Configuration is defined in `carnet.config.ts` with schema validation. See `src/lib/config.ts` and generated `config.schema.json`.

## Testing

- Unit tests in `tests/lib/`
- Integration tests in `tests/integration/`
- Test fixtures in `tests/fixtures/`

## Version Management

- Uses Changesets for version management
- Automated releases via GitHub Actions
- Follow conventional commit patterns

## External Resources

- [Documentation](https://carnet.upstart.gg)
- [GitHub Repository](https://github.com/upstart-gg/carnet)
- [npm Package](https://www.npmjs.com/package/@upstart.gg/carnet)
- [Report Issues](https://github.com/upstart-gg/carnet/issues)

## License

MIT License - see LICENSE file for details.

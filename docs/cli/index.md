# CLI Commands

Carnet provides a command-line interface for managing your agent content
and building the final manifest. This guide covers the available commands,

## Key Features

- **No Config Required** - Works with built-in defaults immediately
- **Config File Optional** - Use `carnet.config.json` for persistent settings
- **Full CLI Control** - All configuration options available as CLI flags
- **Configuration Precedence** - CLI options override config file and environment variables
- **Repeatable Options** - Use options multiple times: `--variables KEY=VALUE --variables KEY2=VALUE2`

## Global Options

All commands support these global options:

```bash
carnet [command] [options]
```

**Available globally:**
- `-d, --dir <dir>` - Carnet project directory containing carnet.config.json and content (default: `./carnet`)

## Configuration Precedence

When you specify the same setting in multiple ways, Carnet uses this priority order:

1. **CLI options** (highest priority) - What you type on the command line
2. **Environment variables** (e.g., `CARNET_OUTPUT=./build`)
3. **Config file** (`carnet.config.json`)
4. **Schema defaults** (lowest priority) - Built-in sensible defaults

Example:

```bash
# Config file says: output: "./dist"
# But CLI option wins:
carnet build --output ./build   # Uses ./build (CLI wins)

# Environment variable overrides config but not CLI:
CARNET_OUTPUT=./app carnet build        # Uses ./app (env var)
CARNET_OUTPUT=./app carnet build --output ./custom  # Uses ./custom (CLI wins)
```

## Available Commands

| Command | Purpose |
|---------|---------|
| [`init`](/cli/init) | Initialize a new Carnet project |
| [`build`](/cli/build) | Build markdown files into manifest |
| [`lint`](/cli/lint) | Lint content without building |
| [`list`](/cli/list) | Display agents in tree format |
| [`show`](/cli/show) | Display entity details |

## Quick Reference

### Initialize a Project

:::tabs
== Local Installation
```bash
carnet init my-project
```

== npx
```bash
npx @upstart-gg/carnet init my-project
```

== bunx
```bash
bunx @upstart-gg/carnet init my-project
```

== pnpmx
```bash
pnpmx @upstart-gg/carnet init my-project
```

== yarn dlx
```bash
yarn dlx @upstart-gg/carnet init my-project
```


:::

### Build Your Content

Without config file (CLI-only):
```bash
# Uses defaults: ./carnet → ./dist
carnet build

# Override with CLI options
carnet build --output ./build --variables API_KEY=secret
```

With config file:
```bash
carnet build
carnet build --watch         # Watch for changes
carnet build -o ./output     # Custom output directory
```

### Lint Content

Without config file:
```bash
carnet lint
```

With options:
```bash
carnet lint --exclude "**/draft/**"
carnet lint --variables ENV=prod
```

### List Agents
```bash
carnet list
carnet list my-agent         # Show specific agent
```

### Show Details
```bash
carnet show agent my-agent
carnet show skill my-skill
carnet show toolset my-toolset
carnet show tool my-tool
```

## Common Workflows

### Development Workflow
```bash
# Watch for changes during development
carnet build --watch
```

### CI/CD Integration
```bash
# Lint before building
carnet lint || exit 1

# Build for deployment
carnet build --output ./dist

# Verify structure
carnet list
```

### Production Build
```bash
# Build with specific config
carnet build --config ./config.prod.json --output ./dist

# Lint the output
carnet lint --config ./config.prod.json
```

## Help & Documentation

Get help for any command:
```bash
carnet --help                    # Show all commands
carnet build --help              # Show build command help
carnet --version                 # Show version
```

## Next Steps

- Detailed [command reference](/cli/)
- [Configuration options](/configuration/)
- [API reference](/api/)
- [Examples and patterns](/guide/example-projects)

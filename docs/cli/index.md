# CLI Commands

Carnet provides a command-line interface for managing your agent content.

## Global Options

All commands support these global options:

```bash
carnet [command] [options]
```

**Available globally:**
- `-c, --config <path>` - Path to `carnet.config.json` (default: `./carnet.config.json`)
- `--content <dir>` - Content directory (overrides config)

## Available Commands

| Command | Purpose |
|---------|---------|
| [`init`](/cli/init) | Initialize a new Carnet project |
| [`build`](/cli/build) | Build markdown files into manifest |
| [`validate`](/cli/validate) | Validate content without building |
| [`list`](/cli/list) | Display agents in tree format |
| [`show`](/cli/show) | Display entity details |

## Quick Reference

### Initialize a Project
```bash
carnet init my-project
```

### Build Your Content
```bash
carnet build
carnet build --watch         # Watch for changes
carnet build -o ./output     # Custom output directory
```

### Validate Content
```bash
carnet validate
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

# In another terminal, validate continuously
watch -n 2 carnet validate

# View current structure
carnet list
```

### CI/CD Integration
```bash
# Validate before building
carnet validate || exit 1

# Build for deployment
carnet build --output ./dist

# Verify structure
carnet list
```

### Production Build
```bash
# Build with specific config
carnet build --config ./config.prod.json --output ./dist

# Validate the output
carnet validate --config ./config.prod.json
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
- [Examples and patterns](/guide/examples)

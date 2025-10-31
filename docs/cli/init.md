# carnet init

Initialize a new Carnet project.

## Usage

```bash
carnet init [directory]
```

## Arguments

- `[directory]` - Directory to create (optional, defaults to current directory)

## Options

None (uses global options only)

## Examples

Create new project in current directory:
```bash
carnet init
```

Create new project in `my-agents` directory:
```bash
carnet init my-agents
cd my-agents
```

## What It Creates

The `init` command creates a complete project structure:

```
my-project/
├── carnet.config.json          # Configuration file
└── content/
    ├── agents/
    │   └── my-agent/AGENT.md   # Example agent
    ├── skills/
    │   └── example-skill/SKILL.md   # Example skill
    ├── toolsets/
    │   └── example-toolset/TOOLSET.md   # Example toolset
    └── tools/
        └── example-tool/TOOL.md # Example tool
```

## Next Steps

After initialization:

1. **Build the project:** `carnet build`
2. **View the structure:** `carnet list`
3. **Show details:** `carnet show agent my-agent`
4. **Edit content:** Modify files in `content/` directory
5. **Rebuild:** `carnet build`

## Configuration

After initialization, you can customize `carnet.config.json`:

```json
{
  "baseDir": "./content",
  "output": "./dist",
  "app": {
    "globalInitialSkills": [],
    "globalSkills": []
  }
}
```

See [Configuration](/configuration/) for all options.

## Related Commands

- [`build`](/cli/build) - Build your content
- [`validate`](/cli/validate) - Validate without building
- [`list`](/cli/list) - View project structure

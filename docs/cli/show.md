# `carnet show`

Show detailed information about an entity

## Usage

```bash
carnet show [type] [name]
```

## Arguments

- `type` - The entity type to display. One of: `agent`, `skill`, or `toolset`.
- `name` - The name of the entity to display.

## Options

| Option | Description |
|--------|-------------|
| `-c, --config <path>` | Path to the carnet.config.json configuration file. If not specified, looks for `./carnet/carnet.config.json` by default. |
| `-d, --dir <dir>` | Content directory containing agents, skills, and toolsets. Defaults to `./carnet`. |

## Examples

```bash
# Show an agent
carnet show agent my-agent

# Show a skill
carnet show skill search-skill

# Show a toolset
carnet show toolset web-tools

# Show with custom content directory
carnet show agent my-agent --dir ./my-carnet-project
```
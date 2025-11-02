# `carnet show`

Show detailed information about an entity

## Usage

```bash
carnet show [type] [name]
```

## Arguments

- `<type>` - The type of entity to display. Valid values: `agent`, `skill`, `toolset`, or `tool`.
- `<name>` - The name of the entity to display.

## Options

| Option | Description |
|--------|-------------|
| `-d, --dir <dir>` | Carnet project directory containing carnet.config.json and content (agents, skills, toolsets). Defaults to `./carnet` |
# `carnet list`

List agents with their skills and toolsets in tree format

## Usage

```bash
carnet list [agent]
carnet ls [agent]
```

## Arguments

- `agent` (optional) - Name of a specific agent to display. If not provided, all agents are listed.

## Options

| Option | Description |
|--------|-------------|
| `--depth <level>` | Control how deep the tree structure is displayed. `1` shows only agent names, `2` includes agent skills, `3+` shows full detail with toolsets. Defaults to `3`. |
| `-c, --config <path>` | Path to the carnet.config.json configuration file. If not specified, looks for `./carnet/carnet.config.json` by default. |
| `-d, --dir <dir>` | Content directory containing agents, skills, and toolsets. Defaults to `./carnet`. |
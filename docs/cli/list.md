# `carnet list`

List agents with their skills and toolsets in tree format

## Usage

```bash
carnet list [agent]
carnet ls [agent]
```

## Arguments

- `[agent]` - Optional name of a specific agent to display. If not provided, displays all agents.

## Options

| Option | Description |
|--------|-------------|
| `--depth <level>` | limit tree depth (1 for agents only, 2 for agents + skills, 3+ for full tree) |
| `-d, --dir <dir>` | Carnet project directory containing carnet.config.json and content (agents, skills, toolsets). Defaults to `./carnet` |
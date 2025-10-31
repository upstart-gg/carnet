# Basic CLI Example

This example demonstrates the basic usage of Carnet with the CLI.

## Setup

1. Initialize Carnet in this directory:
```bash
carnet init
```

2. Build the agents:
```bash
carnet build
```

3. Validate the setup:
```bash
carnet validate
```

## Usage

### List available agents
```bash
carnet list agents
```

### Show agent details
```bash
carnet show agent hello-world
```

### Generate a prompt
```bash
carnet prompt hello-world
```

### Build with watch mode
```bash
carnet build --watch
```

## Project Structure

```
content/
├── agents/
│   └── hello-world/
│       └── AGENT.md
├── skills/
│   └── greeting/
│       └── SKILL.md
└── toolsets/
    └── console/
        ├── TOOLSET.md
        └── console-log.md
```

## Next Steps

- Try modifying the agent content in `content/agents/hello-world/AGENT.md`
- Add new skills or toolsets
- Experiment with different prompt variables
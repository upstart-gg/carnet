# Quick Start

Get up and running with Carnet in 5 minutes.

## 1. Install Carnet

Choose your preferred method:

```bash
# Global installation (recommended)
npm install -g @upstart-gg/carnet

# Or use without installing
npx @upstart-gg/carnet init my-agents
```

## 2. Initialize a Project

```bash
carnet init my-agents
cd my-agents
```

This creates:
```
my-agents/
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

## 3. Build Your Content

```bash
carnet build
```

This generates `dist/carnet.manifest.json` with all your agents compiled.

## 4. View Your Structure

```bash
carnet list
```

You should see a tree view of your agents, skills, and toolsets.

## 5. Use in Your Code

```typescript
import { Carnet } from '@upstart-gg/carnet'

const carnet = await Carnet.fromFile('./dist/carnet.manifest.json')
const agent = carnet.getAgent('my-agent')
console.log(agent.prompt)
```

## Next Steps

- Learn about [Core Concepts](/guide/concepts)
- Explore [CLI Commands](/cli/)
- Check [API Reference](/api/)
- See real-world [Examples](/guide/examples)

## Tips

**Watch mode during development:**
```bash
carnet build --watch
```

**Validate without building:**
```bash
carnet validate
```

**Show details about an entity:**
```bash
carnet show agent my-agent
```

That's it! You now have a working Carnet project. 🎉

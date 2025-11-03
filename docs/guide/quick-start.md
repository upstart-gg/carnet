# Quick Start

Get up and running with Carnet in 5 minutes.

## 1. Install Carnet

See the [Installation Guide](/guide/installation) for detailed instructions.


## 2. Initialize a Project

```bash
carnet init my-app
cd my-app
```

This creates:
```
my-app/
├── carnet.config.json
└── content/
    ├── agents/
    │   └── my-agent/AGENT.md
    ├── skills/
    │   └── example-skill/SKILL.md
    └── toolsets/
        └── example-toolset/
            ├── TOOLSET.md
            └── example-tool.md
```

## 3. Build Your Content

```bash
carnet build
```

This generates `dist/carnet.manifest.json` with all your agents compiled.

See [*carnet build* usage](/cli/build) for options.

## 4. View Your Structure

```bash
carnet list
```

You should see a tree view of your agents, skills, and toolsets.

## 5. Use in Your Code

Integrate with Vercel AI SDK:

```typescript
import { Carnet } from '@upstart-gg/carnet'
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

// Load your manifest
const carnet = await Carnet.fromManifest('./carnet.manifest.json')

// Get system prompt and tools for your agent
const result = await streamText({
  model: openai('gpt-4'),
  system: carnet.getSystemPrompt('my-agent'),
  tools: carnet.getTools('my-agent'),
  messages: [{ role: 'user', content: 'Help me with a task!' }]
})
```

See [Using with Vercel AI SDK](/guide/vercel-ai-sdk) for complete examples and advanced patterns.


## Next Steps

- Learn about [Core Concepts](/guide/concepts)
- Explore [Using with Vercel AI SDK](/guide/vercel-ai-sdk) - Full LLM integration guide
- Browse [CLI Commands](/cli/)
- Check [API Reference](/api/)

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

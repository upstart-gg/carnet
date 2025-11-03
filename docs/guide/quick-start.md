# Quick Start

Get up and running with Carnet in 5 minutes.

## 1. Install Carnet

See the [Installation Guide](/guide/installation) for detailed instructions.


## 2. Initialize a Project

```bash
cd my-app
carnet init
```

This creates a `carnet/` folder with the following structure:
```
my-app/
└── carnet/
    ├── carnet.config.json
    ├── agents/
    ├── skills/
    └── toolsets/
```

> **Note:** `carnet init` creates a `carnet/` directory by default. You can specify a different name with `carnet init <directory-name>`, or use `carnet init .` to initialize in the current directory.

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
import { tool } from 'ai'
import { z } from 'zod'

// Load your manifest
const carnet = await Carnet.fromManifest('./carnet.manifest.json')

// Define your domain tools (from your toolsets)
const searchTool = tool({
  description: 'Search for information',
  inputSchema: z.object({ query: z.string() }),
  execute: async ({ query }) => ({ results: `Results for "${query}"` })
})

// Get system prompt and tools for your agent
const result = await streamText({
  model: openai('gpt-4'),
  system: carnet.getSystemPrompt('my-agent'),
  tools: carnet.getTools('my-agent', {
    tools: { search: searchTool }
  }),
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

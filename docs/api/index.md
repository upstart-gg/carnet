# API Reference

Use Carnet programmatically in your Node.js, Bun, or Deno applications.

## Getting Started

Choose your integration path:

### 🎯 Recommended: Framework Adapters

**For most users**, use our pre-built adapters with your preferred LLM SDK:

- **[Vercel AI SDK](/api/adapters)** - Powerful streaming, tool calling, and multi-model support
- **[OpenAI SDK](/api/adapters)** - Direct integration with OpenAI's function calling
- **[Anthropic SDK](/api/adapters)** - Full Claude tool use capability

Adapters reduce integration boilerplate from 75+ lines to just 3 lines with zero configuration.

### 🔧 Advanced: Manual API

For advanced use cases, interact directly with the Carnet API to:
- Build custom adapters
- Integrate with frameworks we don't support yet
- Implement specialized workflows
- Debug or understand Carnet internals

See the [Advanced API Reference](#advanced-api-reference) below.

---

## Overview

Carnet provides a comprehensive API for managing agents, skills, toolsets, and tools with:

- **Dynamic content retrieval** with automatic variable injection
- **Progressive loading** for LLM agents with metadata-first discovery
- **Prompt generation** for creating LLM-ready agent prompts
- **Type safety** with full TypeScript support

Installation is covered in the [Quick Start Guide](/guide/quick-start).

## Loading a Manifest

```typescript
import { Carnet } from '@upstart-gg/carnet'

// Load from file
const carnet = await Carnet.fromManifest('./path/to/carnet.manifest.json')

// Or load directly from an object
const carnet = new Carnet(manifestObject)

// With options
const carnet = await Carnet.fromManifest(
  './carnet.manifest.json',
  {
    variables: { API_KEY: 'my-key' },
    envPrefixes: ['MYAPP_', 'PUBLIC_'],
  }
)
```

## Advanced Topics

For developers building custom adapters or integrating with unsupported frameworks:

### [Advanced Examples](./examples.md)
Real-world examples of direct API usage for custom implementations.

### [Prompt Generation](./methods/prompt-generation.md)
How to generate LLM-ready prompts programmatically.

### [Content Retrieval](./methods/content-retrieval.md)
Methods to load skill, toolset, and tool content with variable injection.

### [Variable Injection](./concepts/variable-injection.md)
How to inject variables into content using Mustache-style syntax.

### [Progressive Loading](./concepts/progressive-loading.md)
Efficient on-demand loading patterns for LLM agents.

**Full API Reference** (for adapter developers):
- [Metadata Retrieval](./methods/metadata-retrieval.md) - Load metadata without full content
- [Listing Methods](./methods/listing.md) - List agents, skills, toolsets, and tools

## Error Handling

All methods throw an error if the requested item is not found:

```typescript
try {
  const skill = carnet.getSkillContent('nonExistent')
} catch (error) {
  console.error(error.message)  // "Skill not found: nonExistent"
}
```

## Quick Links

### Adapters (Recommended)
- **[Framework Adapters](/api/adapters)** - Pre-built adapters for Vercel AI, OpenAI, and Anthropic
- **[Using with LLMs](/guide/using-with-llms)** - Complete integration guide

### Getting Started
- **[Quick Start](/guide/quick-start)** - Get started with Carnet
- **[Installation](/guide/installation)** - Setup instructions

### Examples & Learning
- **[Example Projects](/guide/example-projects)** - Working code examples
- **[Patterns & Best Practices](/guide/patterns)** - Common usage patterns

### Reference
- **[Configuration](/configuration/)** - Config file and CLI options
- **[Content Schema](/configuration/manifest-schema)** - Entity structure and format

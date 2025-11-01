# API Reference

Use Carnet programmatically in your Node.js, Bun, or Deno applications.

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

## API Documentation

The API is organized into several categories:

### [Content Retrieval](./methods/content-retrieval.md)
Methods to retrieve full content with automatic variable injection:
- `getSkillContent()` - Get skill content
- `getToolsetContent()` - Get toolset content
- `getToolContent()` - Get tool content

### [Metadata Retrieval](./methods/metadata-retrieval.md)
Lightweight methods for progressive loading and discovery:
- `getSkillMetadata()` - Get skill metadata without content
- `getToolsetMetadata()` - Get toolset metadata without content
- `getToolMetadata()` - Get tool metadata without content

### [Listing Methods](./methods/listing.md)
Methods to list available items and their relationships:
- `listAvailableSkills()` - List all skills for an agent
- `listSkillToolsets()` - List toolsets in a skill
- `listToolsetTools()` - List tools in a toolset

### [Prompt Generation](./methods/prompt-generation.md)
Generate LLM-ready prompts:
- `generateAgentPrompt()` - Generate complete agent prompt with skills and catalog

## Concepts

### [Variable Injection](./concepts/variable-injection.md)
Learn how to inject variables into content with Mustache-style syntax, variable precedence, and environment variable filtering.

### [Progressive Loading](./concepts/progressive-loading.md)
Understand how to efficiently load content on-demand for LLM agents with metadata-first discovery.

### [Examples](./examples.md)
Working examples showing how to use the API in common scenarios.

## Error Handling

All methods throw an error if the requested item is not found:

```typescript
try {
  const skill = carnet.getSkillContent('nonExistent')
} catch (error) {
  console.error(error.message)  // "Skill not found: nonExistent"
}
```

## See Also

- [Quick Start](/guide/quick-start) - Get started with Carnet
- [Using with LLMs](/guide/using-with-llms) - LLM integration patterns
- [Example Projects](/guide/example-projects) - Working repository examples

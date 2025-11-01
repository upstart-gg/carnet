# API Reference

Use Carnet programmatically in your Node.js, Bun, or Deno applications.

## Overview

Carnet provides a comprehensive API for managing agents, skills, toolsets, and tools. The library is designed to support:

- **Dynamic content retrieval** with automatic variable injection
- **Progressive loading** for LLM agents with metadata-first discovery
- **Prompt generation** for creating LLM-ready agent prompts
- **Variable injection** from custom variables and environment variables
- **Type safety** with full TypeScript support

## Installation

```bash
npm install @upstart-gg/carnet
# or
bun add @upstart-gg/carnet
```

## Quick Start

### Loading a Manifest

```typescript
import { Carnet } from '@upstart-gg/carnet'

// Load from file
const carnet = await Carnet.fromFile('./path/to/carnet.manifest.json')

// Or load directly from an object
const carnet = new Carnet(manifestObject)

// With variable injection options
const carnet = await Carnet.fromFile(
  './carnet.manifest.json',
  {
    variables: { API_KEY: 'my-key' },
    envPrefixes: ['MYAPP_', 'PUBLIC_'],
  }
)
```

### Constructor Options

```typescript
interface CarnetOptions {
  variables?: Record<string, string>      // Custom variables for injection
  envPrefixes?: string[]                  // Environment variable prefixes to allow
}
```

**Default behavior:**
- `envPrefixes` defaults to `['CARNET_', 'PUBLIC_']` if not specified
- Variables are merged and prioritized as: additional vars > constructor vars > env vars

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

### [Type Definitions](./types.md)
Complete TypeScript type definitions for all API methods and interfaces.

## Complete Example

For a complete working example combining all features, see [Examples](./examples.md).

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

- [Progressive Loading Example](../../examples/progressive-loading.ts)
- [Library Enhancements Documentation](../../LIBRARY_ENHANCEMENTS.md)

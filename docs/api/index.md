# API Reference

Use Carnet programmatically in your Node.js, Bun, or Deno applications.

## Quick Start

```typescript
import { Carnet, build, validate } from '@upstart-gg/carnet'

// Load manifest
const carnet = await Carnet.fromFile('./dist/carnet.manifest.json')

// Access agents
const agent = carnet.getAgent('my-agent')
console.log(agent.prompt)

// Build programmatically
await build({
  baseDir: './content',
  output: './dist'
})

// Validate
await validate('./content')
```

## Main Components

### Carnet Class
Load and access compiled agents, skills, toolsets, and tools.

[Read more →](/api/carnet-class)

### build()
Build markdown files into compiled manifest.

[Read more →](/api/build-function)

### validate()
Validate content without building.

[Read more →](/api/validate-function)

### Types
TypeScript types for all Carnet entities.

[Read more →](/api/types)

## Installation

```bash
npm install @upstart-gg/carnet
bun add @upstart-gg/carnet
pnpm add @upstart-gg/carnet
```

## Node Versions

- Node.js 22+
- Bun 1.0+
- Deno 2.0+

## Examples

### Load and Query
```typescript
import { Carnet } from '@upstart-gg/carnet'

const carnet = await Carnet.fromFile('./dist/carnet.manifest.json')

// Get all agents
const agents = carnet.agents

// Get specific agent
const coder = carnet.getAgent('coder')

// List all skills
for (const skill of Object.values(carnet.skills)) {
  console.log(skill.name, skill.description)
}
```

### Build
```typescript
import { build } from '@upstart-gg/carnet'

await build({
  baseDir: './content',
  output: './dist',
  variables: {
    API_KEY: process.env.API_KEY
  }
})
```

### Validate
```typescript
import { validate } from '@upstart-gg/carnet'

try {
  await validate('./content')
  console.log('✓ All valid!')
} catch (error) {
  console.error('✗ Validation failed:', error.message)
}
```

## Related

- [CLI Reference](/cli/)
- [Configuration](/configuration/)
- [Content Types](/content/)

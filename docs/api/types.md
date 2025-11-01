# Type Definitions

Complete TypeScript type definitions for all Carnet API methods and interfaces.

## Constructor Options

```typescript
interface CarnetOptions {
  variables?: Record<string, string>      // Custom variables for injection
  envPrefixes?: string[]                  // Environment variable prefixes to allow
}
```

## Content Retrieval Options

```typescript
interface ContentRetrievalOptions {
  variables?: Record<string, string>  // Additional variables to inject
  raw?: boolean                       // Return raw content (no injection)
}
```

## Prompt Generation Options

```typescript
interface GenerateAgentPromptOptions {
  variables?: Record<string, string>  // Override variables for prompt
  includeInitialSkills?: boolean      // Include initial skills section
  includeSkillCatalog?: boolean       // Include available skills catalog
}
```

## Metadata Types

```typescript
interface SkillMetadata {
  name: string
  description: string
  toolsets: string[]
}

interface ToolsetMetadata {
  name: string
  description: string
  tools: string[]
}

interface ToolMetadata {
  name: string
  description: string
}
```

## Manifest Types

```typescript
interface Agent {
  name: string
  description: string
  initialSkills: string[]
  skills: string[]
  prompt: string
}

interface Skill {
  name: string
  description: string
  toolsets: string[]
  content: string
}

interface Toolset {
  name: string
  description: string
  tools: string[]
  content: string
}

interface Tool {
  name: string
  description: string
  content: string
}

interface Manifest {
  version: number
  agents: Record<string, Agent>
  skills: Record<string, Skill>
  toolsets: Record<string, Toolset>
  tools: Record<string, Tool>
}
```

## Prompt Generation Return Type

```typescript
interface GeneratedPrompt {
  content: string                      // The complete prompt for LLM
  agent: Agent                         // Agent definition
  initialSkills: Skill[]               // Full skill objects with content
  availableSkills: SkillMetadata[]     // Skill metadata without content
}
```

## Usage Examples

### Type-Safe Content Retrieval

```typescript
const options: ContentRetrievalOptions = {
  variables: { THEME: 'dark' },
  raw: false
}

const content: string = carnet.getSkillContent('mySkill', options)
```

### Type-Safe Prompt Generation

```typescript
const options: GenerateAgentPromptOptions = {
  variables: { API_VERSION: 'v2' },
  includeInitialSkills: true,
  includeSkillCatalog: true
}

const prompt: GeneratedPrompt = carnet.generateAgentPrompt('coder', options)

// Type-safe access to prompt properties
const agentName: string = prompt.agent.name
const skillCount: number = prompt.initialSkills.length
const availableCount: number = prompt.availableSkills.length
```

### Working with Metadata

```typescript
const skillMeta: SkillMetadata = carnet.getSkillMetadata('mySkill')

// Type-safe access
const name: string = skillMeta.name
const description: string = skillMeta.description
const toolsets: string[] = skillMeta.toolsets
```

### Listing Operations

```typescript
const skills: SkillMetadata[] = carnet.listAvailableSkills('myAgent')
const toolsets: ToolsetMetadata[] = carnet.listSkillToolsets('mySkill')
const tools: ToolMetadata[] = carnet.listToolsetTools('myToolset')

// All properly typed for iteration
skills.forEach((skill: SkillMetadata) => {
  console.log(skill.name, skill.description)
})
```

## Exporting Types

All types are exported from the main module for use in your application:

```typescript
import type {
  Carnet,
  Agent,
  Skill,
  Toolset,
  Tool,
  Manifest,
  SkillMetadata,
  ToolsetMetadata,
  ToolMetadata,
  ContentRetrievalOptions,
  GenerateAgentPromptOptions,
  GeneratedPrompt,
  CarnetOptions,
} from '@upstart-gg/carnet'
```

## See Also

- [API Reference](./index.md) - Main API documentation
- [Content Retrieval](./methods/content-retrieval.md) - Using content methods
- [Prompt Generation](./methods/prompt-generation.md) - Prompt generation details

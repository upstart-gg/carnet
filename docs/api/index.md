# API Reference

Use Carnet programmatically in your Node.js, Bun, or Deno applications with Vercel AI SDK.

## Core Methods

Carnet provides two main methods for integration with Vercel AI SDK:

### `getSystemPrompt(agentName, options?): string`

Generate a system prompt for an agent with optional skill catalogs and variable injection.

**Parameters:**
- `agentName: string` - The name of the agent to generate a prompt for
- `options?: PromptOptions` - Generation options
  - `includeInitialSkills?: boolean` - Include initial skill content (default: true)
  - `includeSkillCatalog?: boolean` - Include available skills list (default: true)
  - `variables?: Record<string, string>` - Custom variables for injection

**Returns:** `string` - The generated system prompt

**Example:**
```typescript
const prompt = carnet.getSystemPrompt('researcher', {
  includeSkillCatalog: true,
  variables: { TOPIC: 'machine learning' }
})
```

### `getTools(agentName, options?): ToolSet`

Get a complete ToolSet for an agent with five built-in progressive loading tools.

**Parameters:**
- `agentName: string` - The name of the agent
- `options?: ToolOptions` - Configuration options
  - `tools?: string[]` - Specific tools to include (optional subset filtering)

**Returns:** `ToolSet` - A Vercel AI SDK compatible ToolSet

**Tools included:**
- `listAvailableSkills` - List all available skills for the agent
- `loadSkill` - Load a skill with full content
- `listSkillToolsets` - List toolsets in a skill
- `loadToolset` - Load a toolset with instructions
- `loadTool` - Load a specific tool with documentation

**Example:**
```typescript
const tools = carnet.getTools('researcher', {
  tools: ['listAvailableSkills', 'loadSkill']  // Optional: subset
})
```

## Utility Methods

### `generateAgentPrompt(agentName, options?): GeneratedPrompt`

Generate a complete agent prompt with full details (lower-level than `getSystemPrompt`).

**Returns:** `GeneratedPrompt` object with:
- `content: string` - The prompt text
- `agent: Agent` - The agent definition
- `initialSkills: Skill[]` - Initial skills array
- `availableSkills: SkillMetadata[]` - Available skills metadata

### Content Retrieval Methods

```typescript
// Get raw definitions
getAgent(name: string): Agent
getSkill(name: string): Skill
getToolset(name: string): Toolset
getTool(name: string): Tool

// Get content with variable injection
getSkillContent(name: string, options?: ContentRetrievalOptions): string
getToolsetContent(name: string, options?: ContentRetrievalOptions): string
getToolContent(name: string, options?: ContentRetrievalOptions): string

// Get metadata (without content)
getSkillMetadata(name: string): SkillMetadata
getToolsetMetadata(name: string): ToolsetMetadata
getToolMetadata(name: string): ToolMetadata

// List related items
listAvailableSkills(agentName: string): SkillMetadata[]
listSkillToolsets(skillName: string): ToolsetMetadata[]
listToolsetTools(toolsetName: string): ToolMetadata[]
```

## Types

### `PromptOptions`

Options for `getSystemPrompt()`:

```typescript
interface PromptOptions {
  variables?: Record<string, string>
  includeInitialSkills?: boolean  // default: true
  includeSkillCatalog?: boolean   // default: true
}
```

### `ToolOptions`

Options for `getTools()`:

```typescript
interface ToolOptions {
  tools?: Array<
    | 'listAvailableSkills'
    | 'loadSkill'
    | 'listSkillToolsets'
    | 'loadToolset'
    | 'loadTool'
  >
}
```

### `ContentRetrievalOptions`

Options for content retrieval methods:

```typescript
interface ContentRetrievalOptions {
  variables?: Record<string, string>
  raw?: boolean  // Skip variable injection (default: false)
}
```

## Examples

### Basic Usage

```typescript
import { Carnet } from '@upstart-gg/carnet'
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

const carnet = await Carnet.fromManifest('./carnet.manifest.json')

const result = await streamText({
  model: openai('gpt-4'),
  system: carnet.getSystemPrompt('my-agent'),
  tools: carnet.getTools('my-agent'),
  messages: [{ role: 'user', content: 'Hello!' }]
})
```

### Advanced: Custom Tool Subset

```typescript
// Only expose skill listing and loading
const tools = carnet.getTools('agent', {
  tools: ['listAvailableSkills', 'loadSkill']
})
```

### Advanced: Variable Injection

```typescript
const carnet = await Carnet.fromManifest('./manifest.json', {
  variables: { COMPANY: 'Acme' }
})

const prompt = carnet.getSystemPrompt('agent', {
  variables: { CONTEXT: 'user is a developer' }
})
```

## Related Documentation

- [Using with Vercel AI SDK](/guide/using-with-llms) - Complete integration guide
- [Quick Start](/guide/quick-start) - 5-minute setup
- [Progressive Loading](/api/concepts/progressive-loading) - Pattern explanation
- [Variable Injection](/api/variable-injection) - Variables documentation

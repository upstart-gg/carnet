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
  - `includeLoadedSkills?: boolean` - Include a section listing skills loaded during the session (default: true).
  - `includeAvailableTools?: boolean` - Include a section listing currently available domain tools (default: true).
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

Returns a `ToolSet` for the specified agent. Carnet exposes a minimal set of built‑in meta‑tools used to support progressive loading. Domain tools from your manifest's toolsets are merged into the returned `ToolSet` via the `tools` option.

> **Note:** Users do **not** need to create or manage the meta‑tools directly. Use `carnet.getTools()` which builds the appropriate `ToolSet` and merges domain tools at runtime.

**Parameters:**
- `agentName: string` – The name of the agent.
- `options?: ToolOptions` – Configuration for which meta‑tools or domain tools to expose.

**Returns:** `ToolSet` – A Vercel AI SDK‑compatible set of tools automatically created by Carnet.

- `loadSkill(skillName)` – Load a skill by name to get its full content and capabilities. Returns the skill metadata, content, and list of available files (if any). Skills are discovered via the system prompt's skill catalog.
- `loadSkillFile(skillName, path)` – Load the content of a file from a previously loaded skill. Returns the file content, allowing LLMs to fetch resources on-demand.

These meta‑tools are always included and used alongside any domain tools you provide via the `tools` option. They are created internally and are not intended for direct instantiation.

**Example:**
```typescript
// Expose Carnet meta‑tools (always included) and your domain tools
const tools = carnet.getTools('researcher', {
  tools: {
    search: searchTools,
    analyze: analyzeTools,
  }
})
```

## Session and Tool Management

These methods allow you to manage agent sessions and register your own executable tools.

### `getDiscoveredSkills(agentName: string): string[]`

Returns an array of skill names that have been discovered by the agent in the current session.

### `getAvailableTools(agentName: string): string[]`

Returns an array of the names of the domain tools that are currently exposed and available to the agent.

### `resetSession(agentName: string): void`

Clears the session state for a specific agent, resetting its discovered skills and tool exposure to the initial state.

## Debugging and Diagnostics

These methods help you understand agent session state and tool availability for debugging purposes.

### `getSessionState(agentName: string): CarnetSessionState | null`

Inspect the current session state for an agent. Returns the complete session state including discovered skills, loaded toolsets, and exposed domain tools. Useful for debugging why certain tools are or aren't available.

**Returns:** `CarnetSessionState` object or `null` if no session exists:
```typescript
interface CarnetSessionState {
  agentName: string
  discoveredSkills: Set<string>      // Skills loaded during this session
  loadedToolsets: Set<string>        // Toolsets auto-loaded with skills
  exposedDomainTools: Set<string>    // Domain tools currently available to the agent
}
```

**Example:**
```typescript
// Check what's been loaded in the current session
const state = carnet.getSessionState('researcher')
if (state) {
  console.log('Discovered skills:', Array.from(state.discoveredSkills))
  console.log('Exposed tools:', Array.from(state.exposedDomainTools))
}
```

### `getToolFilteringDiagnostics(agentName: string): ToolFilteringDiagnostics | null`

Get detailed diagnostics about tool filtering. Helps understand why certain tools were or weren't exposed. Returns information about which tools were provided, which were filtered out, and why.

**Returns:** `ToolFilteringDiagnostics` object or `null` if no session exists:
```typescript
interface ToolFilteringDiagnostics {
  providedTools: string[]              // Tools provided to getTools()
  exposedTools: string[]               // Tools that were exposed
  filteredOutTools: string[]           // Tools that were filtered out
  reason: string                       // Explanation of filtering
}
```

**Example:**
```typescript
// Understand tool filtering decisions
const diagnostics = carnet.getToolFilteringDiagnostics('coder')
if (diagnostics) {
  console.log('Exposed:', diagnostics.exposedTools)
  console.log('Filtered out:', diagnostics.filteredOutTools)
  console.log('Reason:', diagnostics.reason)
}
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
loadSkillFile(skillName: string, filePath: string): string

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
  // Domain tools to merge into the returned ToolSet
  // Keys should match tool names from your manifest
  tools?: DomainToolSet  // e.g., { search: searchTools, analyze: analyzeTools }
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
import { tool } from 'ai'
import { z } from 'zod'

const carnet = await Carnet.fromManifest('./carnet.manifest.json')

// Define your domain tools
const helloTool = tool({
  description: 'Greet the user',
  inputSchema: z.object({ name: z.string() }),
  execute: async ({ name }) => ({ greeting: `Hello, ${name}!` })
})

const result = await streamText({
  model: openai('gpt-4'),
  system: carnet.getSystemPrompt('my-agent'),
  tools: carnet.getTools('my-agent', {
    tools: { hello: helloTool }
  }),
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

- [Using with Vercel AI SDK](/guide/vercel-ai-sdk) - Complete integration guide
- [Quick Start](/guide/quick-start) - 5-minute setup
- [Progressive Loading](/api/concepts/progressive-loading) - Pattern explanation
- [Variable Injection](/api/variable-injection) - Variables documentation

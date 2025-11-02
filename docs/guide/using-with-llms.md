# Using with Vercel AI SDK

Integrate Carnet with **Vercel AI SDK** to give AI agents intelligent access to your skills and tools.

## Overview

Carnet is purpose-built for Vercel AI SDK. It provides two key capabilities:

1. **System Prompts** - Generate LLM-ready prompts with `getSystemPrompt()`
2. **Progressive Loading Tools** - Provide tool-based access to skills and tools on demand with `getTools()`

This enables memory-efficient agent architectures that scale beyond simple context windows.

## Installation

```bash
npm install @upstart-gg/carnet ai zod

# Install a language model provider
npm install @ai-sdk/openai    # OpenAI
npm install @ai-sdk/anthropic # Anthropic
npm install @ai-sdk/google    # Google
# ... or your preferred provider
```

## Quick Start

```typescript
import { Carnet } from '@upstart-gg/carnet'
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

// Load your manifest
const carnet = await Carnet.fromManifest('./dist/carnet.manifest.json')

// Stream response with system prompt and tools
const result = await streamText({
  model: openai('gpt-4'),
  system: carnet.getSystemPrompt('my-agent'),
  tools: carnet.getTools('my-agent'),
  messages: [{ role: 'user', content: 'Help me with a task!' }]
})

// Process the response
for await (const chunk of result.textStream) {
  process.stdout.write(chunk)
}
```

That's it! Carnet automatically handles:
- System prompt generation with skill catalogs
- Five progressive loading tools (listAvailableSkills, loadSkill, loadToolset, listSkillToolsets, loadTool)
- Tool execution and error handling
- Variable injection

## API Methods

### `getSystemPrompt(agentName, options?)`

Generate a system prompt for an agent.

```typescript
const prompt = carnet.getSystemPrompt('researcher', {
  includeSkillCatalog: true,      // Include available skills (default: true)
  includeInitialSkills: true,     // Include initial skill content (default: true)
  variables: { TOPIC: 'AI' }      // Custom variables for injection
})

// Use with Vercel AI SDK
const result = await streamText({
  model: openai('gpt-4'),
  system: prompt,
  messages: [...]
})
```

### `getTools(agentName, options?)`

Get a complete ToolSet for an agent.

```typescript
const tools = carnet.getTools('researcher', {
  tools: ['listAvailableSkills', 'loadSkill', 'loadToolset'] // Optional: limit tools
})

// Use with Vercel AI SDK
const result = await streamText({
  model: openai('gpt-4'),
  system: carnet.getSystemPrompt('researcher'),
  tools: tools,
  messages: [...]
})
```

The returned ToolSet includes five tools:
- **listAvailableSkills** - List all available skills for the agent
- **loadSkill** - Load a skill by name with full content
- **listSkillToolsets** - List toolsets within a skill
- **loadToolset** - Load a toolset with instructions and available tools
- **loadTool** - Load a specific tool with full documentation

## Complete Examples

### Basic Prompt Only

```typescript
import { Carnet } from '@upstart-gg/carnet'
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

const carnet = await Carnet.fromManifest('./dist/carnet.manifest.json')

const { text } = await generateText({
  model: openai('gpt-4'),
  system: carnet.getSystemPrompt('coder'),
  messages: [{ role: 'user', content: 'Write a hello world function' }]
})

console.log(text)
```

### With Tool Calling (Progressive Loading)

```typescript
import { Carnet } from '@upstart-gg/carnet'
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

const carnet = await Carnet.fromManifest('./dist/carnet.manifest.json')

const result = await streamText({
  model: openai('gpt-4'),
  system: carnet.getSystemPrompt('researcher'),
  tools: carnet.getTools('researcher'),
  messages: [
    {
      role: 'user',
      content: 'Research what capabilities I have available and create a plan'
    }
  ]
})

// Process streaming results
for await (const chunk of result.textStream) {
  process.stdout.write(chunk)
}
```

### Multi-Turn Conversations

```typescript
import { Carnet } from '@upstart-gg/carnet'
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

const carnet = await Carnet.fromManifest('./dist/carnet.manifest.json')
const systemPrompt = carnet.getSystemPrompt('assistant')

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const conversationHistory: Message[] = []

async function chat(userMessage: string) {
  conversationHistory.push({ role: 'user', content: userMessage })

  const { text } = await generateText({
    model: openai('gpt-4'),
    system: systemPrompt,
    messages: conversationHistory
  })

  conversationHistory.push({ role: 'assistant', content: text })
  return text
}

// Multi-turn conversation
const response1 = await chat('What skills are available?')
console.log('Assistant:', response1)

const response2 = await chat('Tell me more about the code analysis skill')
console.log('Assistant:', response2)
```

### With Custom Variables

```typescript
import { Carnet } from '@upstart-gg/carnet'
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

// Load with custom variables
const carnet = await Carnet.fromManifest('./dist/carnet.manifest.json', {
  variables: {
    COMPANY: 'Acme Corp',
    TEAM: 'Engineering',
    EXPERTISE_LEVEL: 'senior'
  }
})

const result = await streamText({
  model: openai('gpt-4'),
  system: carnet.getSystemPrompt('coder', {
    variables: { CONTEXT: 'Building a web platform' }
  }),
  tools: carnet.getTools('coder'),
  messages: [...]
})
```

### Agentic Loop with Tool Results

```typescript
import { Carnet } from '@upstart-gg/carnet'
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

const carnet = await Carnet.fromManifest('./dist/carnet.manifest.json')

// Start streaming with agent
const result = await streamText({
  model: openai('gpt-4'),
  system: carnet.getSystemPrompt('researcher'),
  tools: carnet.getTools('researcher'),
  messages: [
    {
      role: 'user',
      content: `Research what capabilities I have and create a detailed plan
                for implementing a new analytics feature. First, list available skills.`
    }
  ]
})

// Stream text and handle tool calls automatically
for await (const chunk of result.textStream) {
  process.stdout.write(chunk)
}
```

## Progressive Loading Pattern

The progressive loading pattern is essential for scaling AI agents. Here's why:

### Problem: Context Window Limits

```typescript
// ✗ Bad - Loads ALL skill content at once
const result = await streamText({
  model: openai('gpt-4'),
  system: `You have access to these skills:
    ${allSkills.map(s => s.fullContent).join('\n')}  // Way too much!
  `,
  messages: [...]
})
```

### Solution: Progressive Loading

```typescript
// ✓ Good - Catalog only, content loaded on demand
const result = await streamText({
  model: openai('gpt-4'),
  system: carnet.getSystemPrompt('agent', {
    includeInitialSkills: true,   // Only initial skills have content
    includeSkillCatalog: true     // Others are just listed
  }),
  tools: carnet.getTools('agent'), // Agent can load what it needs
  messages: [...]
})
```

The agent starts with:
1. Brief descriptions of all available skills
2. Full content of initial skills (pre-loaded)
3. Five tools to dynamically load more content

The agent can then:
1. Call `listAvailableSkills` to see what's available
2. Call `loadSkill` to load a specific skill
3. Call `listSkillToolsets` to see toolsets in a skill
4. Call `loadToolset` to get toolset details
5. Call `loadTool` to get specific tool documentation

## Best Practices

### 1. Use Progressive Loading

Always use the default progressive loading pattern for production agents:

```typescript
// Metadata only in initial prompt
const prompt = carnet.getSystemPrompt('agent', {
  includeInitialSkills: true,   // Initial skills have content
  includeSkillCatalog: true     // Others are just listed
})

// Tools for on-demand loading
const tools = carnet.getTools('agent')
```

### 2. Customize Tools Exposed

Only expose the tools your agent needs:

```typescript
// Only allow skill browsing, not toolset/tool loading
const tools = carnet.getTools('agent', {
  tools: ['listAvailableSkills', 'loadSkill']
})
```

### 3. Handle Variables Strategically

Use variables for agent-facing context:

```typescript
const carnet = await Carnet.fromManifest('./manifest.json', {
  variables: {
    COMPANY_CONTEXT: 'user is a senior developer',
    FEATURE_AREA: 'payment processing',
    CONSTRAINTS: 'must be PCI compliant'
  }
})
```

### 4. Monitor Token Usage

Track tokens when using progressive loading:

```typescript
const result = await streamText({
  model: openai('gpt-4'),
  system: carnet.getSystemPrompt('agent'),
  tools: carnet.getTools('agent'),
  messages: [...]
})

// Monitor usage
if (result.usage && result.usage.totalTokens > threshold) {
  console.warn('High token usage:', result.usage)
}
```

## Troubleshooting

### Agent Doesn't Load Skills

Make sure the agent has access to the tools:

```typescript
// ✓ Correct - Tools provided
const result = await streamText({
  model: openai('gpt-4'),
  system: carnet.getSystemPrompt('agent'),
  tools: carnet.getTools('agent'),  // Tools included
  messages: [...]
})

// ✗ Wrong - No tools
const result = await streamText({
  model: openai('gpt-4'),
  system: carnet.getSystemPrompt('agent'),
  // Missing tools!
  messages: [...]
})
```

### Variables Not Injected

Check that variables are passed at both manifest load and prompt generation:

```typescript
// Manifest-level variables (defaults)
const carnet = await Carnet.fromManifest('./manifest.json', {
  variables: { GLOBAL_VAR: 'value' }
})

// Prompt-level variables (override)
const prompt = carnet.getSystemPrompt('agent', {
  variables: { LOCAL_VAR: 'value' }
})
```

### Tool Execution Fails

Tools include error handling with fallback information:

```typescript
// If loadSkill fails, it returns available skills
const result = await tools.loadSkill.execute({
  skillName: 'typo-skill-name'
})
// Returns: { success: false, error: '...', available: ['skill1', 'skill2'] }
```

## See Also

- [API Reference](/api/carnet.md) - Complete Carnet API documentation
- [Progressive Loading](/api/concepts/progressive-loading) - The pattern explained
- [Vercel AI SDK Docs](https://sdk.vercel.ai) - Complete SDK API reference
- [Example Projects](/guide/example-projects) - Working examples
- [Quick Start](/guide/quick-start) - Get started in 5 minutes

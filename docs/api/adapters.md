# Framework Adapters

Zero-config adapters that simplify integrating Carnet with popular LLM SDKs.

## Overview

Framework adapters reduce integration boilerplate from 75+ lines to just 3 lines. They handle tool creation, system prompt generation, and error handling automatically.

**Without adapter:**
```typescript
const tools = {
  listSkills: tool({...}),
  loadSkill: tool({...}),
  listSkillToolsets: tool({...}),
  loadToolset: tool({...}),
  loadTool: tool({...})
  // ... 75+ lines of manual tool definitions
}
```

**With adapter:**
```typescript
const adapter = new CarnetVercelAdapter(carnet, 'my-agent')
// Done! 3 lines total
```

## Requirements

- Carnet (`@upstart-gg/carnet`)
- One of the supported SDKs:
  - Vercel AI SDK (`ai` and `@ai-sdk/openai`)
  - OpenAI SDK (`openai`)
  - Anthropic SDK (`@anthropic-ai/sdk`)

## Quick Start

Choose your SDK for a complete working example:

:::tabs
== Vercel AI SDK

```typescript
import { Carnet } from '@upstart-gg/carnet'
import { CarnetVercelAdapter } from '@upstart-gg/carnet/adapters/vercel-ai'
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

const carnet = await Carnet.fromManifest('./carnet.manifest.json')
const adapter = new CarnetVercelAdapter(carnet, 'my-agent')

const result = await streamText({
  model: openai('gpt-4'),
  messages: [{ role: 'user', content: 'Help me!' }]
  ...adapter.getConfig(), // => { system: "...", tools: {...} }
})

for await (const chunk of result.textStream) {
  process.stdout.write(chunk)
}
```

== OpenAI SDK

```typescript
import { Carnet } from '@upstart-gg/carnet'
import { CarnetOpenAIAdapter } from '@upstart-gg/carnet/adapters/openai'
import OpenAI from 'openai'

const carnet = await Carnet.fromManifest('./carnet.manifest.json')
const adapter = new CarnetOpenAIAdapter(carnet, 'code-reviewer')

const client = new OpenAI()
const completion = await client.chat.completions.create({
  model: 'gpt-4',
  ...adapter.getConfig(),
  messages: [
    ...adapter.getConfig().messages, // System message
    { role: 'user', content: 'Review this code' }
  ]
})

console.log(completion.choices[0].message.content)
```

== Anthropic SDK

```typescript
import { Carnet } from '@upstart-gg/carnet'
import { CarnetAnthropicAdapter } from '@upstart-gg/carnet/adapters/anthropic'
import Anthropic from '@anthropic-ai/sdk'

const carnet = await Carnet.fromManifest('./carnet.manifest.json')
const adapter = new CarnetAnthropicAdapter(carnet, 'analyst')

const client = new Anthropic()
const stream = await client.messages.stream({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  ...adapter.getConfig(),
  messages: [{ role: 'user', content: 'Analyze this' }]
})

for await (const chunk of stream) {
  if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
    process.stdout.write(chunk.delta.text)
  }
}
```
:::

## Available Tools

All adapters provide these 5 progressive loading tools:

1. **listAvailableSkills** - List all skills for the agent
   - No parameters
   - Returns: `{ success: true, skills: [{name, description, toolsets}] }`

2. **loadSkill** - Get full skill content
   - Parameters: `{ skillName: string }`
   - Returns: `{ success: true, content: string, metadata: {...} }`

3. **listSkillToolsets** - List toolsets in a skill
   - Parameters: `{ skillName: string }`
   - Returns: `{ success: true, toolsets: [{name, description, toolCount}] }`

4. **loadToolset** - Get toolset content and tools
   - Parameters: `{ toolsetName: string }`
   - Returns: `{ success: true, content: string, availableTools: [{name, description}] }`

5. **loadTool** - Get tool documentation
   - Parameters: `{ toolName: string }`
   - Returns: `{ success: true, metadata: {...}, content: string }`


## Common Patterns

### Progressive Skill Loading

Use tools to load skills progressively as the LLM requests them:

```typescript
const adapter = new CarnetVercelAdapter(carnet, 'assistant', {
  includeSkillCatalog: true,    // Show what's available
  includeInitialSkills: false   // Don't load everything upfront
})
```

The LLM will:
1. See available skills in system prompt
2. Ask to load specific skills with `loadSkill`
3. Explore toolsets and tools with other tools
4. Only load what it needs

This saves tokens significantly for large skill sets.

### Custom Variables

Inject variables into all content:

```typescript
const adapter = new CarnetVercelAdapter(carnet, 'agent-name', {
  variables: {
    COMPANY: 'My Company',
    API_VERSION: 'v2'
  }
})
```

Variables are available in all skill content through `{{ VARIABLE_NAME }}` syntax.

### Limited Tool Set

Use only specific tools:

```typescript
const adapter = new CarnetVercelAdapter(carnet, 'reader', {
  tools: ['listAvailableSkills', 'loadSkill']
})

// LLM can now only list and load skills, not access toolsets/tools
```

## Error Handling

All adapters return standardized error responses:

```typescript
{
  success: false,
  error: "Skill not found: my-skill",
  available: ["skill1", "skill2", ...] // Helpful fallback
}
```

Errors are caught automatically - the LLM will see the error and can recover.

## See Also

- [Using with LLMs](/guide/using-with-llms) - Complete integration guide with all SDKs
- [Quick Start](/guide/quick-start) - Get started in 5 minutes
- [Progressive Loading](/api/concepts/progressive-loading) - Pattern explanation

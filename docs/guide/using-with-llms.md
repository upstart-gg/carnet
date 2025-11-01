# Using with LLMs

Integrate Carnet with LLM frameworks and SDKs to give AI agents intelligent access to your skills and tools.

## Overview

Carnet provides two key capabilities for LLM integration:

1. **Initial Context** - Generate complete, LLM-ready prompts with `generateAgentPrompt()`
2. **Progressive Loading** - Provide tool-based access to skills and tools on demand

This enables memory-efficient agent architectures that scale beyond simple context windows.

## Using Framework Adapters (Recommended)

Framework adapters simplify LLM integration from 75+ lines of manual code to just 3 lines. Adapters handle tool creation, schema generation, system prompt building, and error handling automatically.

### Installation

```bash
npm install @upstart-gg/carnet zod

# Then install your chosen SDK
npm install ai @ai-sdk/openai         # Vercel AI SDK
# or
npm install openai                     # OpenAI SDK
# or
npm install @anthropic-ai/sdk         # Anthropic SDK
```

### Quick Start

:::tabs
== Vercel AI SDK

```typescript
import { Carnet } from '@upstart-gg/carnet'
import { CarnetVercelAdapter } from '@upstart-gg/carnet/adapters/vercel-ai'
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

const carnet = await Carnet.fromManifest('./dist/carnet.manifest.json')
const adapter = new CarnetVercelAdapter(carnet, 'my-agent')

const result = await streamText({
  model: openai('gpt-4'),
  ...adapter.getConfig(),
  messages: [{ role: 'user', content: 'Help me!' }]
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

const carnet = await Carnet.fromManifest('./dist/carnet.manifest.json')
const adapter = new CarnetOpenAIAdapter(carnet, 'my-agent')

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const config = adapter.getConfig()
const completion = await client.chat.completions.create({
  model: 'gpt-4',
  ...config,
  messages: [
    ...config.messages,
    { role: 'user', content: 'Help me!' }
  ]
})

console.log(completion.choices[0].message.content)
```

== Anthropic SDK

```typescript
import { Carnet } from '@upstart-gg/carnet'
import { CarnetAnthropicAdapter } from '@upstart-gg/carnet/adapters/anthropic'
import Anthropic from '@anthropic-ai/sdk'

const carnet = await Carnet.fromManifest('./dist/carnet.manifest.json')
const adapter = new CarnetAnthropicAdapter(carnet, 'my-agent')

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

const stream = await client.messages.stream({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  ...adapter.getConfig(),
  messages: [{ role: 'user', content: 'Help me!' }]
})

for await (const chunk of stream) {
  if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
    process.stdout.write(chunk.delta.text)
  }
}
```
:::

### Benefits

The adapter automatically:
- Generates system prompts with skill catalogs
- Creates progressive loading tools (listAvailableSkills, loadSkill, loadToolset, loadTool, listSkillToolsets)
- Handles tool execution and error responses
- Manages variable injection
- Provides TypeScript support

**Learn more:** See the [Framework Adapters](/api/adapters) documentation for complete API reference, options, and advanced patterns.

## Manual Integration (Advanced)

For custom integrations or unsupported SDKs, you can use the Carnet API directly with the `generateAgentPrompt()` and `getSkillContent()` methods.

### With Vercel AI SDK

:::tabs
== Basic Integration

**Simple example with Carnet agent prompt:**

```typescript
import { Carnet } from '@upstart-gg/carnet'
import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

// Load your Carnet agent
const carnet = await Carnet.fromManifest('./dist/carnet.manifest.json', {
  variables: {
    COMPANY: 'My Company'
  }
})

// Generate initial prompt for agent
const agentPrompt = carnet.generateAgentPrompt('coder', {
  includeSkillCatalog: true
})

// Stream response
const result = await streamText({
  model: openai('gpt-4'),
  system: agentPrompt.content,
  messages: [
    {
      role: 'user',
      content: 'Help me implement a new feature'
    }
  ]
})

// Stream to console
for await (const textPart of result.textStream) {
  process.stdout.write(textPart)
}
```

== With Tool Calling

**Full example with progressive loading tools:**

```typescript
import { Carnet } from '@upstart-gg/carnet'
import { openai } from '@ai-sdk/openai'
import { streamText, tool } from 'ai'
import { z } from 'zod'

// Load Carnet
const carnet = await Carnet.fromManifest('./dist/carnet.manifest.json')

// Create progressive loading tools for the agent
const carnetTools = {
  listSkills: tool({
    description: 'List all available skills for the agent',
    parameters: z.object({
      agentName: z.string().describe('Name of the agent')
    }),
    execute: async ({ agentName }) => {
      const skills = carnet.listAvailableSkills(agentName)
      return skills.map(s => ({
        name: s.name,
        description: s.description,
        toolsets: s.toolsets
      }))
    }
  }),

  getSkill: tool({
    description: 'Load a skill to see its full content and capabilities',
    parameters: z.object({
      skillName: z.string().describe('Name of the skill to load')
    }),
    execute: async ({ skillName }) => {
      try {
        const content = carnet.getSkillContent(skillName)
        const metadata = carnet.getSkillMetadata(skillName)
        return {
          name: metadata.name,
          description: metadata.description,
          toolsets: metadata.toolsets,
          content
        }
      } catch (error) {
        return { error: `Skill not found: ${skillName}` }
      }
    }
  }),

  listToolsets: tool({
    description: 'List all toolsets in a skill',
    parameters: z.object({
      skillName: z.string().describe('Name of the skill')
    }),
    execute: async ({ skillName }) => {
      try {
        const toolsets = carnet.listSkillToolsets(skillName)
        return toolsets.map(t => ({
          name: t.name,
          description: t.description,
          toolCount: t.tools.length
        }))
      } catch (error) {
        return { error: `Skill not found: ${skillName}` }
      }
    }
  }),

  getTool: tool({
    description: 'Load a specific tool to see its documentation',
    parameters: z.object({
      toolName: z.string().describe('Name of the tool')
    }),
    execute: async ({ toolName }) => {
      try {
        const metadata = carnet.getToolMetadata(toolName)
        const content = carnet.getToolContent(toolName)
        return {
          name: metadata.name,
          description: metadata.description,
          content
        }
      } catch (error) {
        return { error: `Tool not found: ${toolName}` }
      }
    }
  })
}

// Generate agent prompt
const agentPrompt = carnet.generateAgentPrompt('coder', {
  includeSkillCatalog: true
})

// Stream with tools
const result = await streamText({
  model: openai('gpt-4'),
  system: agentPrompt.content,
  tools: carnetTools,
  messages: [
    {
      role: 'user',
      content: 'I need help with building a web application. What skills do you have available?'
    }
  ]
})

// Process streaming results
for await (const event of result) {
  if (event.type === 'text-delta') {
    process.stdout.write(event.text)
  } else if (event.type === 'tool-call') {
    console.log(`\nTool: ${event.toolName}`)
  }
}
```

== With Chat History

**Managing conversation state with Carnet:**

```typescript
import { Carnet } from '@upstart-gg/carnet'
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'

const carnet = await Carnet.fromManifest('./dist/carnet.manifest.json')
const agentPrompt = carnet.generateAgentPrompt('assistant')

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const conversationHistory: Message[] = []

async function chat(userMessage: string) {
  // Add user message to history
  conversationHistory.push({
    role: 'user',
    content: userMessage
  })

  // Get response
  const { text } = await generateText({
    model: openai('gpt-4'),
    system: agentPrompt.content,
    messages: conversationHistory
  })

  // Add assistant response to history
  conversationHistory.push({
    role: 'assistant',
    content: text
  })

  return text
}

// Multi-turn conversation
const response1 = await chat('What skills are available?')
console.log('Assistant:', response1)

const response2 = await chat('Tell me more about the code analysis skill')
console.log('Assistant:', response2)

const response3 = await chat('Can you generate a function?')
console.log('Assistant:', response3)
```

== Agentic Loops

**Implement an agentic loop where the LLM calls tools to load information:**

```typescript
import { Carnet } from '@upstart-gg/carnet'
import { openai } from '@ai-sdk/openai'
import { streamText, tool } from 'ai'
import { z } from 'zod'

const carnet = await Carnet.fromManifest('./dist/carnet.manifest.json')
const agentPrompt = carnet.generateAgentPrompt('researcher', {
  includeSkillCatalog: true
})

// Define tools for the agent to call
const tools = {
  loadSkill: tool({
    description: 'Load detailed information about a skill',
    parameters: z.object({
      skillName: z.string()
    }),
    execute: async ({ skillName }) => {
      return {
        content: carnet.getSkillContent(skillName),
        metadata: carnet.getSkillMetadata(skillName)
      }
    }
  }),
  // Add more tools as needed
}

// Run the agentic loop
const result = await streamText({
  model: openai('gpt-4'),
  system: agentPrompt.content,
  tools,
  messages: [
    {
      role: 'user',
      content: `Research what capabilities I have available and create a plan
                for implementing a new feature. Start by listing and loading skills.`
    }
  ]
})

// Process results
for await (const chunk of result.textStream) {
  process.stdout.write(chunk)
}
```
:::

### With OpenAI SDK

```typescript
import { Carnet } from '@upstart-gg/carnet'
import OpenAI from 'openai'

const carnet = await Carnet.fromManifest('./dist/carnet.manifest.json')
const agentPrompt = carnet.generateAgentPrompt('coder')

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const stream = openai.beta.chat.completions.stream({
  model: 'gpt-4',
  system: agentPrompt.content,
  messages: [
    {
      role: 'user',
      content: 'Hello, can you help me with my code?'
    }
  ]
})

stream.on('text', (text) => {
  process.stdout.write(text)
})

await stream.finalMessage()
```

### With Anthropic SDK

```typescript
import { Carnet } from '@upstart-gg/carnet'
import Anthropic from '@anthropic-ai/sdk'

const carnet = await Carnet.fromManifest('./dist/carnet.manifest.json')
const agentPrompt = carnet.generateAgentPrompt('analyst')

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

const stream = await client.messages.stream({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  system: agentPrompt.content,
  messages: [
    {
      role: 'user',
      content: 'Analyze this code for me'
    }
  ]
})

for await (const chunk of stream) {
  if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
    process.stdout.write(chunk.delta.text)
  }
}
```

## Best Practices

### 1. Use Progressive Loading

Don't include all skill content in initial prompt:

```typescript
// ✓ Good - Metadata only, content loaded on demand
const prompt = carnet.generateAgentPrompt('agent', {
  includeSkillCatalog: true,
  includeInitialSkills: true  // Only initial skills have full content
})

// ✗ Bad - All content in initial prompt
const allSkills = carnet.listAvailableSkills('agent')
// Include full content of all skills...
```

### 2. Provide Clear Tool Descriptions

LLMs make better decisions with clear descriptions:

```typescript
tool({
  description: 'Load a skill to understand what tools it provides',  // Clear!
  parameters: z.object({
    skillName: z.string().describe('Name of the skill to load')
  }),
  // ...
})
```

### 3. Handle Tool Errors Gracefully

Always provide fallback information:

```typescript
execute: async ({ skillName }) => {
  try {
    return carnet.getSkillContent(skillName)
  } catch (error) {
    return {
      error: `Skill "${skillName}" not found`,
      available: carnet.listAvailableSkills('agent').map(s => s.name)
    }
  }
}
```

### 4. Control Variable Injection

Use variables for LLM-facing context:

```typescript
const carnet = await Carnet.fromManifest(
  './dist/carnet.manifest.json',
  {
    variables: {
      CONTEXT: 'user is a senior developer',
      EXPERTISE_LEVEL: 'advanced'
    }
  }
)
```

## See Also

- [Framework Adapters](/api/adapters) - Complete adapter API reference
- [Progressive Loading](/api/concepts/progressive-loading) - The pattern explained
- [Vercel AI SDK Docs](https://sdk.vercel.ai) - Complete API reference
- [Example Projects](/guide/example-projects) - Working examples in repository
- [Quick Start](/guide/quick-start) - Get started in 5 minutes

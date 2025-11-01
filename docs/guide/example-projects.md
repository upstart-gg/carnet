# Example Projects & Patterns

Learn how to use Carnet through patterns and real-world scenarios.

## Framework Adapters (Recommended)

For most LLM integration use cases, start with a framework adapter:

### Vercel AI SDK
The most powerful adapter with streaming support and tool calling.

```typescript
import { Carnet } from '@upstart-gg/carnet'
import { CarnetVercelAdapter } from '@upstart-gg/carnet/adapters/vercel-ai'
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

const carnet = await Carnet.fromManifest('./carnet.manifest.json')
const adapter = new CarnetVercelAdapter(carnet, 'my-agent')

const result = await streamText({
  model: openai('gpt-4'),
  ...adapter.getConfig(),
  messages: [{ role: 'user', content: 'Help me!' }]
})
```

See [Framework Adapters](/api/adapters) for complete examples with OpenAI and Anthropic.

## CLI Usage

### Basic Workflow

Build without a config file:
```bash
# Uses defaults
carnet build

# With custom options
carnet build --output ./build --variables API_KEY=secret
```

Lint before building:
```bash
carnet lint
carnet build
```

### CI/CD Integration

Automate builds in your pipeline:
```bash
# Validate content
carnet lint --config ./carnet.prod.json || exit 1

# Build for production
carnet build --config ./carnet.prod.json --output ./dist

# Optional: verify structure
carnet list
```

See [Build Command](/cli/build) and [Lint Command](/cli/lint) for all options.

## Programmatic API

### Progressive Loading Pattern

Load skill metadata first, then content on-demand:

```typescript
import { Carnet } from '@upstart-gg/carnet'

const carnet = await Carnet.fromManifest('./carnet.manifest.json')

// 1. Get agent and its available skills
const agent = carnet.getAgent('my-agent')
const metadata = carnet.getSkillMetadata('my-skill')

// 2. Generate initial prompt with skill catalog (default)
const prompt = carnet.generateAgentPrompt('my-agent')

// 3. Load skills on-demand as needed
const skillContent = carnet.getSkillContent('my-skill')
```

See [Progressive Loading](/api/concepts/progressive-loading) for details.

### Variable Injection

Inject custom variables into all content:

```typescript
const carnet = await Carnet.fromManifest('./carnet.manifest.json', {
  variables: {
    API_KEY: 'secret-key',
    COMPANY_NAME: 'My Company'
  }
})

// All loaded content has variables substituted
const skill = carnet.getSkillContent('my-skill')
// {{ API_KEY }} → secret-key
// {{ COMPANY_NAME }} → My Company
```

See [Variable Injection](/api/concepts/variable-injection) for advanced patterns.

### Custom Tool Definition

Build your own tool definitions programmatically:

```typescript
const toolset = carnet.getToolsetContent('my-toolset')
const tools = carnet.listToolsetTools('my-toolset')

// Use in your LLM SDK
const myTools = tools.map(tool => ({
  name: tool.name,
  description: tool.description,
  // ... define tool schema and handler
}))
```

## See Also

- [Quick Start](/guide/quick-start) - Get started in 5 minutes
- [Using with LLMs](/guide/using-with-llms) - Practical LLM integration examples
- [Patterns](/guide/patterns) - Common architectural patterns
- [Organizing Projects](/guide/organizing-projects) - Multi-agent system examples

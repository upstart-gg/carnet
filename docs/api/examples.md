# Advanced API Examples

⚠️ **Most users should use [Framework Adapters](/api/adapters) instead of the manual API.**

This page shows advanced examples for:
- Building custom adapters
- Integrating with unsupported frameworks
- Special use cases requiring direct API access

For typical LLM integration, see [Framework Adapters](/api/adapters).

## Example: Generate Agent Prompt

```typescript
import { Carnet } from '@upstart-gg/carnet'

// Load manifest
const carnet = await Carnet.fromManifest('./carnet.manifest.json', {
  variables: {
    API_URL: 'https://api.example.com',
  },
})

// Generate prompt for your agent
const prompt = carnet.generateAgentPrompt('my-agent')

console.log(prompt.content)
// Contains: agent prompt + initial skills + skill catalog
```

## Example: Custom Adapter Implementation

If you need to build a custom adapter:

```typescript
class CustomAdapter {
  constructor(private carnet: Carnet, private agentName: string) {}

  getConfig() {
    const prompt = this.carnet.generateAgentPrompt(this.agentName)

    // Define your adapter-specific tools
    const tools = {
      loadSkill: {
        description: 'Load a skill by name',
        execute: async (skillName: string) => {
          return this.carnet.getSkillContent(skillName)
        }
      }
    }

    return { system: prompt.content, tools }
  }
}
```

## Example: Variable Injection

```typescript
const carnet = await Carnet.fromManifest('./carnet.manifest.json', {
  variables: {
    COMPANY: 'Acme Corp',
    API_KEY: process.env.API_KEY || 'default-key',
  },
})

// All loaded content has variables substituted
const skill = carnet.getSkillContent('api-handler')
// Content with {{ COMPANY }} → "Acme Corp"
```

## See Also

- [Progressive Loading](./concepts/progressive-loading.md) - Learn the pattern
- [Variable Injection](./concepts/variable-injection.md) - Variable usage patterns
- [Prompt Generation](./methods/prompt-generation.md) - Prompt generation details
- [Framework Adapters](./adapters.md) - Pre-built adapters for popular LLM SDKs

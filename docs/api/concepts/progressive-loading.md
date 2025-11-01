# Progressive Loading

Understand how to efficiently load content on-demand for LLM agents with metadata-first discovery.

## Overview

Progressive loading enables efficient LLM agents that request content on demand instead of receiving everything upfront. This pattern:

- **Reduces initial prompt size** by loading metadata first
- **Improves token efficiency** for expensive LLM API calls
- **Scales to many skills/tools** without overwhelming context
- **Enables agent-driven discovery** of available capabilities

## Pattern

Progressive loading follows this flow:

```
1. Generate initial prompt with metadata catalog
   ↓
2. Agent requests skill metadata (lightweight)
   ↓
3. Agent requests full skill content (if needed)
   ↓
4. Agent explores toolsets and tools (on demand)
```

## Step-by-Step Example

### 1. Generate Initial Prompt

```typescript
// Include metadata catalog but not full content
const prompt = carnet.generateAgentPrompt('coder')

console.log(prompt.content)
// Contains:
// - Agent instructions
// - Initial skills (full content)
// - Available skills metadata (lightweight)
// - Instructions on how to load more
```

### 2. Agent Requests Skill Metadata

```typescript
// Agent: "What skills are available?"
const skillMeta = carnet.getSkillMetadata('react')
// Returns: { name: 'react', description: '...', toolsets: ['components'] }
// Size: Small, efficient for LLMs
```

### 3. Agent Requests Full Skill Content

```typescript
// Agent: "Show me the React skill details"
const skillContent = carnet.getSkillContent('react')
// Returns: Full skill documentation with variables injected
```

### 4. Agent Explores Toolsets

```typescript
// Agent: "What tools are in the components toolset?"
const toolsets = carnet.listSkillToolsets('react')
// Returns: [{ name: 'components', description: '...', tools: [...] }]

const tools = carnet.listToolsetTools('components')
// Returns: Array of tool metadata
```

### 5. Agent Loads Specific Tool

```typescript
// Agent: "Show me the Button component"
const toolContent = carnet.getToolContent('button')
// Returns: Full tool documentation
```

## API Methods by Category

### Metadata (Lightweight)

```typescript
carnet.getSkillMetadata(name)      // Returns metadata only
carnet.getToolsetMetadata(name)    // Returns metadata only
carnet.getToolMetadata(name)       // Returns metadata only
carnet.listAvailableSkills(agent)  // Lists with metadata
carnet.listSkillToolsets(skill)    // Lists with metadata
carnet.listToolsetTools(toolset)   // Lists with metadata
```

### Content (Full)

```typescript
carnet.getSkillContent(name)       // Full content with variables
carnet.getToolsetContent(name)     // Full content with variables
carnet.getToolContent(name)        // Full content with variables
carnet.generateAgentPrompt(agent)  // Complete LLM-ready prompt
```

## Efficiency Benefits

### Tokens Saved Example

```typescript
// Without progressive loading:
// Send full prompt with all 20 skills = 5,000 tokens

// With progressive loading:
// Send prompt with metadata of 20 skills = 500 tokens
// Agent asks for 3 skills = 1,500 tokens (on demand)
// Total: 2,000 tokens (60% reduction!)
```

## Best Practices

### 1. Start with Metadata Catalog

Always include the metadata catalog in the initial prompt so agents know what's available:

```typescript
const prompt = carnet.generateAgentPrompt('coder', {
  includeSkillCatalog: true,  // ✅ Always include
})
```

### 2. Use Descriptive Metadata

Ensure metadata descriptions are clear and concise:

```
Good: "React component builder with JSX support"
Bad: "React stuff"
```

### 3. Organize Content Logically

Structure skills, toolsets, and tools to support discovery:

```
Agent
  └─ React skill
      └─ Components toolset
          ├─ Button tool
          ├─ Card tool
          └─ Modal tool
```

### 4. Handle Missing Content Gracefully

Always handle errors for non-existent items:

```typescript
try {
  const content = carnet.getSkillContent(requestedSkill)
} catch (error) {
  // Skill doesn't exist, inform the agent
  console.log(`Skill not found: ${requestedSkill}`)
}
```

## Implementation for App Developers

If you're creating an app that wraps Carnet for LLM agents, create tools around these methods:

```typescript
const tools = {
  listSkills: {
    name: 'listSkills',
    description: 'List available skills with metadata',
    execute: () => carnet.listAvailableSkills('agentName')
  },

  getSkill: {
    name: 'getSkill',
    description: 'Get full skill content',
    execute: (skillName) => carnet.getSkillContent(skillName)
  },

  listTools: {
    name: 'listTools',
    description: 'List tools in a toolset',
    execute: (toolsetName) => carnet.listToolsetTools(toolsetName)
  },

  getTool: {
    name: 'getTool',
    description: 'Get full tool documentation',
    execute: (toolName) => carnet.getToolContent(toolName)
  }
}
```

## See Also

- [Metadata Retrieval](../methods/metadata-retrieval.md) - Lightweight discovery
- [Content Retrieval](../methods/content-retrieval.md) - Full content loading
- [Prompt Generation](../methods/prompt-generation.md) - Initial prompt setup
- [Examples](../examples.md) - Working progressive loading examples

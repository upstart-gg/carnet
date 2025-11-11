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

### 4. Toolsets and Tools Auto-Load with Skills

When an agent loads a skill, all associated toolsets and tools become immediately available:

```typescript
// Agent calls: loadSkill('react')
// Carnet automatically:
// 1. Returns full skill documentation
// 2. Exposes all tools in skill's toolsets
// 3. Updates session state with loaded toolsets

// The agent can now immediately use any tools from those toolsets
// No separate tool/toolset loading steps needed!
```

**Note:** The metadata inspection methods `listSkillToolsets()` and `listToolsetTools()` are for debugging and UI purposes only, not part of the LLM's typical workflow. Tools become available through the `loadSkill()` meta-tool automatically.


## See Also

- [API Reference](../) - Complete API documentation
- [Variable Injection](../variable-injection) - Dynamic variable injection
- [Using with Vercel AI SDK](/guide/vercel-ai-sdk) - Practical implementation guide

# Metadata Retrieval Methods

These methods retrieve lightweight metadata without full content, useful for progressive loading and LLM discovery.

## getSkillMetadata()

**Signature:**
```typescript
getSkillMetadata(name: string): SkillMetadata
```

Get skill metadata (name, description, toolsets) without content.

**Example:**

```typescript
const metadata = carnet.getSkillMetadata('mySkill')
// Returns: { name: 'mySkill', description: '...', toolsets: ['...'] }
```

## getToolsetMetadata()

**Signature:**
```typescript
getToolsetMetadata(name: string): ToolsetMetadata
```

Get toolset metadata (name, description, tools) without content.

**Example:**

```typescript
const metadata = carnet.getToolsetMetadata('uiComponents')
// Returns: { name: 'uiComponents', description: '...', tools: ['...'] }
```

## getToolMetadata()

**Signature:**
```typescript
getToolMetadata(name: string): ToolMetadata
```

Get tool metadata (name, description) without content.

**Example:**

```typescript
const metadata = carnet.getToolMetadata('createComponent')
// Returns: { name: 'createComponent', description: '...' }
```

## Return Types

### SkillMetadata

```typescript
interface SkillMetadata {
  name: string
  description: string
  toolsets: string[]
}
```

### ToolsetMetadata

```typescript
interface ToolsetMetadata {
  name: string
  description: string
  tools: string[]
}
```

### ToolMetadata

```typescript
interface ToolMetadata {
  name: string
  description: string
}
```

## Use Cases

Metadata retrieval is ideal for:

- **Progressive loading**: Load metadata first, then request full content on demand
- **LLM discovery**: Present available options to LLMs without overwhelming context
- **UI display**: Show navigation or selection interfaces
- **Efficient caching**: Metadata is small, content can be large

## Error Handling

All metadata retrieval methods throw an error if the requested item is not found:

```typescript
try {
  const skill = carnet.getSkillMetadata('nonExistent')
} catch (error) {
  console.error(error.message)  // "Skill not found: nonExistent"
}
```

## See Also

- [Progressive Loading](../concepts/progressive-loading.md) - Learn about progressive loading patterns
- [Content Retrieval](./content-retrieval.md) - Retrieve full content with variables

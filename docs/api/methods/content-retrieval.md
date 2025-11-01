# Content Retrieval Methods

These methods retrieve full content with automatic variable injection (unless `raw: true`).

## getSkillContent()

**Signature:**
```typescript
getSkillContent(name: string, options?: ContentRetrievalOptions): string
```

Get the full content of a skill with variable injection.

**Examples:**

```typescript
// Get skill content with variables injected
const content = carnet.getSkillContent('mySkill')

// Get raw content without variable injection
const raw = carnet.getSkillContent('mySkill', { raw: true })

// Override variables for this retrieval
const custom = carnet.getSkillContent('mySkill', {
  variables: { THEME: 'dark' }
})
```

## getToolsetContent()

**Signature:**
```typescript
getToolsetContent(name: string, options?: ContentRetrievalOptions): string
```

Get the full content of a toolset with variable injection.

**Examples:**

```typescript
const content = carnet.getToolsetContent('uiComponents')
const raw = carnet.getToolsetContent('uiComponents', { raw: true })
```

## getToolContent()

**Signature:**
```typescript
getToolContent(name: string, options?: ContentRetrievalOptions): string
```

Get the full content of a tool with variable injection.

**Examples:**

```typescript
const content = carnet.getToolContent('createComponent')
```

## Options

### ContentRetrievalOptions

```typescript
interface ContentRetrievalOptions {
  variables?: Record<string, string>  // Additional variables to inject
  raw?: boolean                       // Return raw content (no injection)
}
```

**Parameters:**
- `variables` - Optional record of variables to inject into the content. These take precedence over constructor variables.
- `raw` - If `true`, returns the content without variable injection. Defaults to `false`.

## Error Handling

All content retrieval methods throw an error if the requested item is not found:

```typescript
try {
  const skill = carnet.getSkillContent('nonExistent')
} catch (error) {
  console.error(error.message)  // "Skill not found: nonExistent"
}
```

## See Also

- [Variable Injection](../concepts/variable-injection.md) - Learn about variable injection
- [Metadata Retrieval](./metadata-retrieval.md) - Lightweight alternative for discovery

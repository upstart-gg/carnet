# Listing Methods

These methods list available items and their relationships.

## listAvailableSkills()

**Signature:**
```typescript
listAvailableSkills(agentName: string): SkillMetadata[]
```

List all skills available to an agent (both initial and dynamically loadable).

**Example:**

```typescript
const skills = carnet.listAvailableSkills('myAgent')
// Returns array of SkillMetadata, includes both initialSkills and skills
```

**Returns:** Array of `SkillMetadata` objects with name, description, and toolsets.

## listSkillToolsets()

**Signature:**
```typescript
listSkillToolsets(skillName: string): ToolsetMetadata[]
```

List all toolsets associated with a skill.

**Example:**

```typescript
const toolsets = carnet.listSkillToolsets('mySkill')
// Returns array of ToolsetMetadata
```

**Returns:** Array of `ToolsetMetadata` objects with name, description, and tools.

## listToolsetTools()

**Signature:**
```typescript
listToolsetTools(toolsetName: string): ToolMetadata[]
```

List all tools in a toolset.

**Example:**

```typescript
const tools = carnet.listToolsetTools('uiComponents')
// Returns array of ToolMetadata
```

**Returns:** Array of `ToolMetadata` objects with name and description.

## Common Use Cases

### Discover Available Skills

```typescript
const agent = 'coder'
const skills = carnet.listAvailableSkills(agent)

skills.forEach(skill => {
  console.log(`Skill: ${skill.name}`)
  console.log(`Description: ${skill.description}`)
  console.log(`Toolsets: ${skill.toolsets.join(', ')}`)
})
```

### Explore Skill Details

```typescript
const skillName = 'typescript'
const toolsets = carnet.listSkillToolsets(skillName)

toolsets.forEach(toolset => {
  console.log(`Toolset: ${toolset.name}`)
  console.log(`Tools: ${toolset.tools.join(', ')}`)
})
```

### List Tools in a Toolset

```typescript
const toolsetName = 'typeChecking'
const tools = carnet.listToolsetTools(toolsetName)

tools.forEach(tool => {
  console.log(`- ${tool.name}: ${tool.description}`)
})
```

## Error Handling

All listing methods throw an error if the requested parent item is not found:

```typescript
try {
  const toolsets = carnet.listSkillToolsets('nonExistent')
} catch (error) {
  console.error(error.message)  // "Skill not found: nonExistent"
}
```

## Return Types

These methods return metadata types. See [Type Definitions](../types.md) for complete type information.

## See Also

- [Metadata Retrieval](./metadata-retrieval.md) - Get individual metadata
- [Progressive Loading](../concepts/progressive-loading.md) - Learn about discovery patterns

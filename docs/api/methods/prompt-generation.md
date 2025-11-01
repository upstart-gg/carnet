# Prompt Generation

Generate complete, LLM-ready prompts for agents with skills and catalogs.

## generateAgentPrompt()

**Signature:**
```typescript
generateAgentPrompt(
  agentName: string,
  options?: GenerateAgentPromptOptions
): GeneratedPrompt
```

Generate a complete, LLM-ready prompt for an agent including initial skills, skill catalog, and loading instructions.

## Basic Usage

```typescript
const prompt = carnet.generateAgentPrompt('coder')

// Access the generated content and metadata
console.log(prompt.content)           // Complete prompt string for LLM
console.log(prompt.agent)             // Agent metadata
console.log(prompt.initialSkills)     // Full Skill objects (with content)
console.log(prompt.availableSkills)   // Skill metadata (without content)
```

## Options

### GenerateAgentPromptOptions

```typescript
interface GenerateAgentPromptOptions {
  variables?: Record<string, string>  // Override variables for this prompt
  includeInitialSkills?: boolean      // Include initial skills (default: true)
  includeSkillCatalog?: boolean       // Include available skills catalog (default: true)
}
```

**Parameters:**
- `variables` - Override variables for prompt generation. These take precedence over constructor variables.
- `includeInitialSkills` - If `false`, excludes the "Initial Skills" section. Defaults to `true`.
- `includeSkillCatalog` - If `false`, excludes the "Available Skills" catalog and loading instructions. Defaults to `true`.

## Usage Examples

### Complete Prompt

```typescript
const prompt = carnet.generateAgentPrompt('coder', {
  includeInitialSkills: true,  // default
  includeSkillCatalog: true,   // default
})

console.log(prompt.content)

// Or simply: carnet.generateAgentPrompt('coder')
```

### Minimal Prompt

```typescript
const prompt = carnet.generateAgentPrompt('coder', {
  includeInitialSkills: false,
  includeSkillCatalog: false,
})

// Returns only the agent prompt itself
```

### Override Variables

```typescript
const prompt = carnet.generateAgentPrompt('coder', {
  variables: { API_VERSION: 'v2.0' }
})
```

## Return Type

### GeneratedPrompt

```typescript
interface GeneratedPrompt {
  content: string              // The complete prompt for LLM
  agent: Agent                 // Agent definition
  initialSkills: Skill[]       // Full skill objects with content
  availableSkills: SkillMetadata[]  // Skill metadata without content
}
```

## Prompt Structure

The generated prompt includes:

1. **Agent Instructions**: The agent's main prompt with variables injected
2. **Initial Skills**: Full content of skills loaded at startup
3. **Skill Catalog**: List of available on-demand skills with descriptions
4. **Loading Instructions**: Instructions for the LLM on how to load additional skills

## Error Handling

Throws an error if the agent is not found:

```typescript
try {
  const prompt = carnet.generateAgentPrompt('nonExistent')
} catch (error) {
  console.error(error.message)  // "Agent not found: nonExistent"
}
```

## See Also

- [Progressive Loading](../concepts/progressive-loading.md) - Learn how agents request content dynamically
- [Variable Injection](../concepts/variable-injection.md) - Understand variable injection in prompts
- [Examples](../examples.md) - Complete working examples

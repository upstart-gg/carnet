# Examples

Complete working examples combining all Carnet features.

## Basic Setup

All examples start with Carnet initialization:

```typescript
import { Carnet } from '@upstart-gg/carnet'

const carnet = await Carnet.fromManifest(
  './carnet.manifest.json',
  {
    variables: {
      APP_NAME: 'MyAgent',
      API_BASE: 'https://api.example.com',
    },
    envPrefixes: ['MYAPP_', 'PUBLIC_'],
  }
)
```

## Example 1: Generate Agent Prompt

Generate an LLM-ready prompt with initial skills and catalog:

```typescript
// Generate initial prompt for agent
const agentPrompt = carnet.generateAgentPrompt('coder', {
  includeSkillCatalog: true,
})

console.log('Agent Prompt for LLM:')
console.log(agentPrompt.content)

// Access structured data
console.log('Agent:', agentPrompt.agent.name)
console.log('Initial Skills:', agentPrompt.initialSkills.length)
console.log('Available Skills:', agentPrompt.availableSkills.length)
```

## Example 2: Discover Available Skills

List and explore available skills:

```typescript
// Get all available skills
const skills = carnet.listAvailableSkills('coder')

console.log(`\nAgent has ${skills.length} available skills:\n`)

skills.forEach(skill => {
  console.log(`📚 ${skill.name}`)
  console.log(`   ${skill.description}`)
  console.log(`   Toolsets: ${skill.toolsets.join(', ')}`)
})
```

## Example 3: Progressive Loading

Load content on demand as an agent requests it:

```typescript
// 1. Start with metadata
const skillMeta = carnet.getSkillMetadata('typescript')
console.log('Available Skill:', skillMeta)

// 2. Agent wants more details
const skillContent = carnet.getSkillContent('typescript')
console.log('\nSkill Content:', skillContent)

// 3. Explore toolsets
const toolsets = carnet.listSkillToolsets('typescript')
console.log('\nToolsets:', toolsets.map(t => t.name))

// 4. Load specific tools
const tools = carnet.listToolsetTools('typeChecking')
console.log('\nTools in typeChecking:', tools.map(t => t.name))

// 5. Get tool details
const toolContent = carnet.getToolContent('typeScriptCompiler')
console.log('\nTool Documentation:', toolContent)
```

## Example 4: Variable Injection

Use variables in content:

```typescript
// Setup variables
const carnet = new Carnet(manifest, {
  variables: {
    API_URL: 'https://api.example.com',
    API_VERSION: 'v2',
  },
})

// Content automatically has variables injected
const content = carnet.getSkillContent('apiClient')

// If skill contains:
// "API Base: {{ API_URL }}"
// "Using API version: {{ API_VERSION }}"
//
// Result:
// "API Base: https://api.example.com"
// "Using API version: v2"

console.log('Content with variables:')
console.log(content)
```

## Example 5: Environment-Specific Configuration

Use environment variables for configuration:

```typescript
// Configure allowed env var prefixes
const carnet = new Carnet(manifest, {
  envPrefixes: ['APP_'],
})

// Set environment variables
process.env.APP_ENVIRONMENT = 'production'
process.env.APP_DEBUG = 'false'

// Content includes environment configuration
const prompt = carnet.generateAgentPrompt('coder')
console.log(prompt.content)
// Contains injected APP_ENVIRONMENT and APP_DEBUG values
```

## Example 6: Minimal Prompt (Development)

Generate a minimal prompt without full content:

```typescript
const prompt = carnet.generateAgentPrompt('coder', {
  includeInitialSkills: false,
  includeSkillCatalog: false,
})

console.log(prompt.content)
// Contains only the agent prompt, lightweight for testing
```

## Example 7: Override Variables per Request

Use different variables for different requests:

```typescript
// Base configuration
const carnet = new Carnet(manifest, {
  variables: { THEME: 'light' }
})

// Request 1: Use base variables
const lightTheme = carnet.getSkillContent('ui')
// Contains {{ THEME }} → "light"

// Request 2: Override variables
const darkTheme = carnet.getSkillContent('ui', {
  variables: { THEME: 'dark' }
})
// Contains {{ THEME }} → "dark"
```

## Example 8: Iterate Over All Items

Process all agents, skills, and tools:

```typescript
// Get all agents
const agents = carnet.agents
Object.values(agents).forEach(agent => {
  console.log(`Agent: ${agent.name}`)

  // List available skills
  carnet.listAvailableSkills(agent.name).forEach(skill => {
    console.log(`  Skill: ${skill.name}`)

    // List toolsets
    carnet.listSkillToolsets(skill.name).forEach(toolset => {
      console.log(`    Toolset: ${toolset.name}`)

      // List tools
      carnet.listToolsetTools(toolset.name).forEach(tool => {
        console.log(`      Tool: ${tool.name}`)
      })
    })
  })
})
```

## Example 9: Error Handling

Handle errors gracefully:

```typescript
function getSkillSafely(skillName: string): string | null {
  try {
    return carnet.getSkillContent(skillName)
  } catch (error) {
    console.error(`Failed to load skill "${skillName}":`, error.message)
    return null
  }
}

const content = getSkillSafely('typescript')
if (content) {
  console.log('Skill loaded:', content)
} else {
  console.log('Skill not available')
}
```

## Example 10: Complete LLM Agent Workflow

Simulate a complete workflow:

```typescript
// 1. Initialize
const carnet = await Carnet.fromManifest('./carnet.manifest.json')

// 2. Create initial agent prompt
const initialPrompt = carnet.generateAgentPrompt('coder')
console.log('Initial prompt for LLM:', initialPrompt.content)

// 3. Simulate agent requests
const simulateAgent = async (request: string) => {
  if (request.includes('list skills')) {
    const skills = carnet.listAvailableSkills('coder')
    return `Available skills: ${skills.map(s => s.name).join(', ')}`
  }

  if (request.startsWith('load skill:')) {
    const skillName = request.replace('load skill:', '').trim()
    try {
      return carnet.getSkillContent(skillName)
    } catch (error) {
      return `Skill "${skillName}" not found`
    }
  }

  if (request.startsWith('list tools in:')) {
    const toolsetName = request.replace('list tools in:', '').trim()
    try {
      const tools = carnet.listToolsetTools(toolsetName)
      return `Tools: ${tools.map(t => t.name).join(', ')}`
    } catch (error) {
      return `Toolset "${toolsetName}" not found`
    }
  }

  return 'Unknown request'
}

// 4. Simulate agent interaction
console.log(await simulateAgent('list skills'))
console.log(await simulateAgent('load skill: typescript'))
console.log(await simulateAgent('list tools in: typeChecking'))
```

## See Also

- [Progressive Loading](./concepts/progressive-loading.md) - Learn the pattern
- [Variable Injection](./concepts/variable-injection.md) - Variable usage patterns
- [Prompt Generation](./methods/prompt-generation.md) - Prompt generation details
- [Progressive Loading Example](../../examples/progressive-loading.ts) - Complete working example in the repository

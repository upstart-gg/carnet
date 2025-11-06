# Error Handling

Carnet provides structured error classes for consistent error handling and better debugging.

## Error Classes

All Carnet errors extend from the base `CarnetError` class:

### Base Class: `CarnetError`

The base class for all Carnet-specific errors. Includes context about what went wrong.

```typescript
class CarnetError extends Error {
  readonly context: {
    message: string
    resourceType?: string
    resourceName?: string
  }
}
```

### `ValidationError`

Thrown when manifest validation fails or required resources are not found.

**When it occurs:**
- Skill/toolset/tool not found in manifest
- Agent not found
- Resource names don't exist

**Example:**
```typescript
try {
  const skill = carnet.getSkillContent('non-existent-skill')
} catch (error) {
  if (isValidationError(error)) {
    console.error(`${error.context.resourceType} not found: ${error.context.resourceName}`)
    // Output: skill not found: non-existent-skill
  }
}
```

### `ConfigError`

Thrown when configuration loading or validation fails.

**When it occurs:**
- Config file has invalid JSON syntax
- Config schema validation fails
- Environment variable configuration is invalid
- Merged configuration doesn't meet schema requirements

**Example:**
```typescript
import { loadConfigFile, isConfigError } from '@upstart-gg/carnet'

try {
  const config = await loadConfigFile('./carnet')
} catch (error) {
  if (isConfigError(error)) {
    console.error(`Configuration error: ${error.message}`)
    console.error('Context:', error.context)
  }
}
```

### `ParseError`

Thrown when parsing markdown files fails during the build process.

**When it occurs:**
- Invalid frontmatter in agent/skill/toolset/tool markdown files
- File not found during parsing
- Schema validation fails on parsed frontmatter
- Unable to read or decode file content

**Example:**
```typescript
import { parseMarkdownFile, isParseError, skillSchema } from '@upstart-gg/carnet'

try {
  const skill = await parseMarkdownFile('./skills/research.md', skillSchema)
} catch (error) {
  if (isParseError(error)) {
    console.error(`Failed to parse file: ${error.message}`)
    console.error(`File: ${error.filePath}`)
    if (error.lineNumber) {
      console.error(`Line: ${error.lineNumber}`)
    }
  }
}
```

### `BuildError`

Thrown when the build process fails while compiling the manifest.

**When it occurs:**
- Agent references non-existent skill
- Skill references non-existent toolset
- Toolset references non-existent tool
- Skill file reference paths are invalid (starts with `./`, outside skill directory, etc.)
- Referenced skill files don't exist or aren't readable
- File I/O errors during build

**Example:**
```typescript
import { build, isBuildError } from '@upstart-gg/carnet'

try {
  await build(config, './carnet')
} catch (error) {
  if (isBuildError(error)) {
    console.error(`Build failed: ${error.message}`)
    console.error(`Phase: ${error.phase}`)
    console.error('Context:', error.context)
  }
}
```

## Type Guards

Use type guards to safely handle different error types:

```typescript
import {
  isCarnetError,
  isValidationError,
  isConfigError,
  isParseError,
  isBuildError
} from '@upstart-gg/carnet'

try {
  const skill = carnet.getSkillContent('research')
} catch (error) {
  if (isCarnetError(error)) {
    // It's a Carnet error
    if (isValidationError(error)) {
      console.error(`Resource not found: ${error.context.resourceName}`)
    } else if (isConfigError(error)) {
      console.error(`Configuration problem: ${error.message}`)
    } else if (isParseError(error)) {
      console.error(`Parse error: ${error.message}`)
    }
  } else {
    // It's some other error type
    console.error('Unknown error:', error)
  }
}
```

## Error Formatting

Use the `formatError()` utility for consistent error messages:

```typescript
import { formatError } from '@upstart-gg/carnet'
import manifest from './carnet/carnet.manifest.json'

try {
  const carnet = new Carnet(manifest)
} catch (error) {
  const formatted = formatError(error)
  console.error(formatted)
  // Output: "ConfigError: Invalid manifest format"
}
```

## Common Error Scenarios

### Scenario 1: Skill Not Found

When an agent tries to load a skill that doesn't exist:

```typescript
try {
  await carnet.getSkillContent('unknown-skill')
} catch (error) {
  if (isValidationError(error)) {
    // Inform the LLM about available skills
    const available = carnet.listAvailableSkills('agent-name')
    console.log('Available skills:', available.map(s => s.name))
  }
}
```

### Scenario 2: Invalid Manifest

When the manifest structure is invalid:

```typescript
import manifest from './carnet/carnet.manifest.json'

try {
  const carnet = new Carnet(manifest)
} catch (error) {
  if (isConfigError(error)) {
    // Check manifest structure and provide helpful message
    console.error('Invalid manifest structure. Please ensure carnet.manifest.json is properly formatted.')
  }
}
```

### Scenario 3: Invalid Agent Name

When getTools() is called with non-existent agent:

```typescript
try {
  const tools = carnet.getTools('non-existent-agent')
} catch (error) {
  if (isValidationError(error)) {
    // Use a default agent or inform user
    const agents = carnet.listAgents()
    console.error(`Agent not found. Available agents: ${agents.join(', ')}`)
  }
}
```

## Best Practices

### 1. Always Catch Carnet Errors

```typescript
// ❌ Don't ignore errors
const skill = carnet.getSkillContent('skill')

// ✅ Handle errors properly
try {
  const skill = carnet.getSkillContent('skill')
} catch (error) {
  if (isCarnetError(error)) {
    // Handle Carnet-specific error
  } else {
    // Handle unexpected error
    throw error
  }
}
```

### 2. Use Type Guards for Specific Handling

```typescript
import manifest from './carnet/carnet.manifest.json'

// ❌ Generic error handling
try {
  const carnet = new Carnet(manifest)
} catch (error) {
  console.error('Error:', error)
}

// ✅ Specific handling by error type
try {
  const carnet = new Carnet(manifest)
} catch (error) {
  if (isParseError(error)) {
    console.error('Invalid manifest format')
  } else if (isConfigError(error)) {
    console.error('Invalid manifest structure')
  }
}
```

### 3. Provide Context in Error Messages

```typescript
// ❌ Unclear message
catch (error) {
  if (isValidationError(error)) {
    console.error('Error:', error.message)
  }
}

// ✅ Clear context
catch (error) {
  if (isValidationError(error)) {
    console.error(
      `Cannot load ${error.context.resourceType}: ` +
      `"${error.context.resourceName}" not found`
    )
  }
}
```

### 4. Log Errors with Full Context

```typescript
// ✅ Log complete error information
catch (error) {
  const formatted = formatError(error)
  logger.error('Carnet operation failed', {
    error: formatted,
    timestamp: new Date().toISOString(),
    context: isCarnetError(error) ? error.context : undefined
  })
}
```

## Related Documentation

- [API Reference](/api/index.md) - Full API documentation
- [Quick Start](/guide/quick-start.md) - Getting started guide
- [Using with Vercel AI SDK](/guide/vercel-ai-sdk) - Integration guide

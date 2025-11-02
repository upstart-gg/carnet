# Variable Injection

Learn how to inject variables into content with Mustache-style syntax, variable precedence, and environment variable filtering.

## How It Works

Variables are injected into content using Mustache-style syntax:

```
This is a {{ VARIABLE_NAME }} example.
```

Variable resolution follows this precedence (highest to lowest):
1. Variables passed in method call
2. Variables from constructor options
3. Environment variables matching allowed prefixes
4. Left as-is if not found: `{{ UNDEFINED_VAR }}`

## Environment Variables

Environment variables are filtered by prefix for security. Only environment variables matching the allowed prefixes will be injected.

### Default Prefixes

By default, these prefixes are allowed:
- `CARNET_`
- `PUBLIC_`

### Custom Prefixes

Specify custom prefixes when creating a Carnet instance:

```typescript
const carnet = new Carnet(manifest, process.cwd(), {
  envPrefixes: ['MYAPP_', 'PUBLIC_'],
})
```

## Examples

### Setup

```typescript
// Setup with variables
const carnet = new Carnet(manifest, process.cwd(), {
  variables: { userFullName: 'John Doe' },
  envPrefixes: ['MYAPP_'],
})

// Environment variable (MYAPP_KEY)
process.env.MYAPP_KEY = 'secret'
```

### Content Retrieval

```typescript
// Content with variables
const content = carnet.getSkillContent('mySkill')

// Override for specific call
const custom = carnet.getSkillContent('mySkill', {
  variables: { userFullName: 'John Doe' }
})
// {{ userFullName }} gets replaced with "John Doe" in all content
```

## Precedence Example

When a variable is defined in multiple places:

```typescript
const carnet = new Carnet(manifest, {
  variables: { ENV: 'production' }
})

process.env.CARNET_ENV = 'development'

// Method call override takes precedence
const content = carnet.getSkillContent('mySkill', {
  variables: { ENV: 'staging' }
})
// Result: "staging" (from method call)

// Without method override, constructor vars take precedence
const content2 = carnet.getSkillContent('mySkill')
// Result: "production" (from constructor)

// Env vars are used only as fallback
```

## Use Cases

### Configuration Management

```typescript
const carnet = new Carnet(manifest, {
  variables: {
    API_BASE: process.env.API_BASE || 'https://api.example.com',
    APP_VERSION: packageJson.version,
  },
})

const skillContent = carnet.getSkillContent('apiIntegration')
// All content has {{ API_BASE }} and {{ APP_VERSION }} injected
```

### Environment-Specific Content

```typescript
const carnet = new Carnet(manifest, {
  envPrefixes: ['APP_'],
})

process.env.APP_ENVIRONMENT = 'production'
process.env.APP_DEBUG = 'false'

const prompt = carnet.generateAgentPrompt('coder')
// Prompt will contain environment-specific configuration
```

### Runtime Overrides

```typescript
const basePrompt = carnet.generateAgentPrompt('coder', {
  variables: { THEME: 'dark' }
})

// Get alternative version with different theme
const lightPrompt = carnet.generateAgentPrompt('coder', {
  variables: { THEME: 'light' }
})
```

## Security Considerations

Environment variable filtering by prefix is a security measure:

```typescript
// This configuration is INSECURE - allows all env vars
// ❌ DON'T DO THIS:
const carnet = new Carnet(manifest, {
  envPrefixes: [''] // Empty prefix matches everything
})

// This is SECURE - only allows specific prefixes
// ✅ DO THIS:
const carnet = new Carnet(manifest, {
  envPrefixes: ['MYAPP_', 'PUBLIC_']
})
```

## See Also

- [Content Retrieval](../methods/content-retrieval.md) - How to retrieve content with injection
- [Prompt Generation](../methods/prompt-generation.md) - Prompts with variable injection
- [Examples](../examples.md) - Working examples with variables

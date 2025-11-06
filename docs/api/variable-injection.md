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
4. Replaced by an empty string if not found

## Environment Variables

Environment variables are filtered by prefix for security. Only environment variables matching the allowed prefixes will be injected.

### Default Prefixes

By default, these prefixes are allowed:
- `CARNET_`
- `PUBLIC_`

### Custom Prefixes

Specify custom prefixes when creating a Carnet instance:

```typescript
const carnet = new Carnet(manifest, {
  envPrefixes: ['MYAPP_', 'PUBLIC_'],
})
```

## Examples

### Setup

```typescript
// Setup with variables
const carnet = new Carnet(manifest, {
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

### Dynamic Prompt Adaptation

The most powerful use case for variables is **dynamic prompt adaptation**. By passing variables to `getSystemPrompt()`, you can customize prompts at runtime based on user context:

```typescript
// Example: Customer support agent with dynamic context
const carnet = new Carnet(manifest, {
  variables: { COMPANY_NAME: 'Acme Corp' }
})

// Adapt prompt based on customer tier
const premiumPrompt = carnet.getSystemPrompt('support', {
  variables: {
    CUSTOMER_TIER: 'premium',
    RESPONSE_STYLE: 'detailed and personalized'
  }
})

const basicPrompt = carnet.getSystemPrompt('support', {
  variables: {
    CUSTOMER_TIER: 'basic',
    RESPONSE_STYLE: 'concise and efficient'
  }
})

// Each call generates a customized prompt for the specific context
```

**Benefits of Dynamic Variables:**
- **Context-aware agents**: Adapt behavior based on user, session, or request context
- **A/B testing**: Test different prompt variations dynamically
- **Multi-tenant systems**: Customize prompts per tenant without duplicating content
- **Personalization**: Inject user-specific data into prompts at runtime

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

- [API Reference](../) - Complete API documentation
- [Progressive Loading](./concepts/progressive-loading) - Loading skills with variables
- [Using with Vercel AI SDK](/guide/vercel-ai-sdk) - Practical implementation guide

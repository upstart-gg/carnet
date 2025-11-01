# Variables

Configure and use variables to customize Carnet content across different environments and use cases.

## Overview

Variables allow you to inject dynamic values into your content during the build process. This enables:

- **Environment-specific customization** - Different values for dev/prod
- **Template-like behavior** - Reuse content with different variables
- **Configuration externalization** - Store values in config instead of content
- **Security** - Avoid hardcoding sensitive information

## Defining Variables

### In Configuration File

Define variables in `carnet.config.json`:

```json
{
  "baseDir": "./content",
  "variables": {
    "COMPANY": "ACME Corp",
    "API_VERSION": "v2",
    "REGION": "us-west-2",
    "SUPPORT_EMAIL": "support@acme.com"
  }
}
```

### Environment Variables

Use environment variables with allowed prefixes:

```json
{
  "envPrefixes": ["CARNET_", "PUBLIC_"]
}
```

Set in environment:
```bash
CARNET_API_KEY=secret123 carnet build
PUBLIC_ANALYTICS_ID=abc carnet build
```

Then use in content:
```markdown
API Key: {{ CARNET_API_KEY }}
Analytics: {{ PUBLIC_ANALYTICS_ID }}
```

## Using Variables in Content

Use Mustache syntax (`{{ VARIABLE_NAME }}`) in any markdown file:

### Basic Usage

**carnet.config.json:**
```json
{
  "variables": {
    "APP_NAME": "MyAgent",
    "VERSION": "1.0.0"
  }
}
```

**content/agents/helper/AGENT.md:**
```markdown
---
name: helper
description: "{{ APP_NAME }} v{{ VERSION }}"
---

# {{ APP_NAME }} Helper Agent

This is {{ APP_NAME }} version {{ VERSION }}.
```

**Generated prompt includes:**
```
description: "MyAgent v1.0.0"
# MyAgent Helper Agent

This is MyAgent version 1.0.0.
```

### In Agent Prompts

**carnet.config.json:**
```json
{
  "variables": {
    "COMPANY": "TechCorp",
    "SUPPORT_URL": "https://support.techcorp.com"
  }
}
```

**content/agents/customer-support/AGENT.md:**
```yaml
---
name: customer-support
description: Customer support representative
prompt: |
  You are a customer support representative for {{ COMPANY }}.

  Always direct users to {{ SUPPORT_URL }} for additional help.

  Company values:
  - Professional
  - Helpful
  - Responsive
---
```

### In Skill Content

**carnet.config.json:**
```json
{
  "variables": {
    "API_BASE": "https://api.example.com/v2",
    "RATE_LIMIT": "1000 requests per hour"
  }
}
```

**content/skills/api-integration/SKILL.md:**
```markdown
---
name: api-integration
description: Integration with our REST API
---

# API Integration Guide

**Base URL:** {{ API_BASE }}

**Rate Limits:** {{ RATE_LIMIT }}

...
```

## Variable Precedence

Variables are resolved in this order (first match wins):

1. **Programmatic override** - Variables passed to `carnet.fromManifest()` or `generateAgentPrompt()`
2. **Environment variables** - Variables from process.env matching configured prefixes
3. **Configuration file** - Variables defined in `carnet.config.json`
4. **Not found** - Variable name is left as-is if not found

### Example with Precedence

**carnet.config.json:**
```json
{
  "variables": {
    "THEME": "light",
    "LOG_LEVEL": "info"
  },
  "envPrefixes": ["CARNET_"]
}
```

**Environment:**
```bash
export CARNET_THEME=dark
```

**Programmatic:**
```typescript
const carnet = await Carnet.fromManifest('./dist/carnet.manifest.json', {
  variables: { THEME: 'high-contrast' }
})
```

**Result:**
- `{{ THEME }}` → `'high-contrast'` (from programmatic)
- `{{ LOG_LEVEL }}` → `'info'` (from config, env not set)

## Environment Variable Prefixes

### Purpose

Control which environment variables are available to prevent security issues:

```json
{
  "envPrefixes": ["CARNET_", "PUBLIC_"]
}
```

**Only these can be used:**
- `CARNET_*` variables
- `PUBLIC_*` variables
- Other environment variables are ignored

### Security Benefit

Prevents accidentally exposing sensitive environment variables:

```bash
# These won't be accessible even though they're set:
DATABASE_URL=secret
AWS_ACCESS_KEY_ID=secret
API_KEY=secret

# Only these are accessible:
CARNET_API_KEY=can_be_used
PUBLIC_ANALYTICS_ID=can_be_used
```

## Common Use Cases

### Configuration by Environment

```json
{
  "variables": {
    "ENVIRONMENT": "development",
    "API_BASE": "http://localhost:3000",
    "DEBUG": "true"
  }
}
```

For production, use a different config file:

```bash
carnet build --config carnet.config.prod.json
```

### Template Content

```json
{
  "variables": {
    "COMPANY": "TechCorp",
    "SUPPORT_EMAIL": "support@techcorp.com",
    "WEBSITE": "https://techcorp.com"
  }
}
```

Use same content across multiple deployments by changing variables.

### Feature Flags

```json
{
  "variables": {
    "FEATURE_BETA": "disabled",
    "FEATURE_EXPERIMENTAL": "disabled",
    "FEATURE_PREMIUM": "enabled"
  }
}
```

In content, conditionally describe features:

```markdown
## Advanced Features

(Only enabled if FEATURE_ADVANCED is "enabled")

...
```

## Programmatic Usage

### With TypeScript/JavaScript

```typescript
import { Carnet } from '@upstart-gg/carnet'

// Load with config variables
const carnet = await Carnet.fromManifest(
  './dist/carnet.manifest.json',
  {
    variables: {
      CUSTOM_VAR: 'custom_value'
    }
  }
)

// Override variables for specific call
const content = carnet.getSkillContent('my-skill', {
  variables: {
    CUSTOM_VAR: 'override_value'
  }
})
```

### Getting Raw Content

Get content without variable injection:

```typescript
// With variables injected
const injected = carnet.getSkillContent('my-skill')

// Raw content (variables not replaced)
const raw = carnet.getSkillContent('my-skill', { raw: true })
```

## Examples

### Multi-Region Setup

```json
{
  "variables": {
    "REGION": "us-west-2",
    "REGION_NAME": "US West",
    "ENDPOINT": "https://api.us-west-2.example.com"
  }
}
```

Run builds for each region:

```bash
# Build for US
carnet build

# Build for EU (using different config)
carnet build --config carnet.config.eu.json
```

### Multi-Tenant Setup

```json
{
  "variables": {
    "TENANT": "acme-corp",
    "TENANT_NAME": "ACME Corporation",
    "TENANT_DOMAIN": "acme.example.com"
  }
}
```

Content automatically customizes per tenant based on variables.

### Development vs Production

**carnet.config.json (dev):**
```json
{
  "variables": {
    "API_BASE": "http://localhost:3000",
    "DEBUG_MODE": "true",
    "LOG_LEVEL": "debug"
  }
}
```

**carnet.config.prod.json (prod):**
```json
{
  "variables": {
    "API_BASE": "https://api.example.com",
    "DEBUG_MODE": "false",
    "LOG_LEVEL": "error"
  }
}
```

## See Also

- [Configuration Overview](/configuration/) - Configuration file structure
- [Configuration Patterns](/configuration/patterns) - Common configuration patterns
- [Variable Injection (API)](/api/concepts/variable-injection) - Technical API details
- [Tips & Tricks](/guide/tips-and-tricks) - Practical usage tips

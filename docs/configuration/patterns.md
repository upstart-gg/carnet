# Configuration Patterns

Learn common patterns for configuring Carnet across different environments and use cases.

## Development vs Production

Use different config files for different environments to manage variables, content inclusion, and output paths.

### Development Configuration

**carnet.config.json**
```json
{
  "baseDir": "./content",
  "output": "./dist",
  "include": ["**/*.dev.md"],
  "app": {
    "globalSkills": ["development-tools", "debugging"]
  },
  "variables": {
    "ENVIRONMENT": "development",
    "LOG_LEVEL": "debug",
    "API_BASE": "http://localhost:3000"
  }
}
```

Features:
- Includes development tools and skills
- Debug logging enabled
- Local API endpoints
- Includes `.dev.md` files

### Production Configuration

**carnet.config.prod.json**
```json
{
  "baseDir": "./content",
  "output": "./dist",
  "exclude": ["**/draft/**", "**/experimental/**", "**/*.dev.md"],
  "app": {
    "globalSkills": ["production-utilities"]
  },
  "variables": {
    "ENVIRONMENT": "production",
    "LOG_LEVEL": "warn",
    "API_BASE": "https://api.example.com"
  }
}
```

Features:
- Excludes draft and development content
- No development tools
- Reduced logging
- Production API endpoints

### Build Commands

```bash
# Development build
carnet build

# Production build
carnet build --config carnet.config.prod.json
```

### In CI/CD Pipeline

```yaml
# Example GitHub Actions
- name: Build development manifest
  run: carnet build

- name: Build production manifest
  run: carnet build --config carnet.config.prod.json
```

## Template Variables

Use variables in your content for environment-specific customization.

### Define Variables

**carnet.config.json:**
```json
{
  "variables": {
    "COMPANY": "ACME Corp",
    "API_VERSION": "v2",
    "REGION": "us-west-2",
    "SUPPORT_EMAIL": "support@acme.com"
  }
}
```

### Use in Content

Variables are available in all markdown files using Mustache syntax:

**content/skills/my-skill/SKILL.md:**
```markdown
# {{ COMPANY }} Integration

This skill helps integrate with {{ COMPANY }} services.

API Endpoint: `https://api.{{ REGION }}.{{ COMPANY }}.com/{{ API_VERSION }}`

Support: {{ SUPPORT_EMAIL }}
```

### Multiple Environments with Variables

Use variables to customize behavior by environment:

**carnet.config.json (development):**
```json
{
  "variables": {
    "ENVIRONMENT": "development",
    "FEATURES_BETA": "enabled",
    "API_TIMEOUT": "30000"
  }
}
```

**carnet.config.prod.json (production):**
```json
{
  "variables": {
    "ENVIRONMENT": "production",
    "FEATURES_BETA": "disabled",
    "API_TIMEOUT": "5000"
  }
}
```

Content automatically adapts based on which config is used during build.

## Conditional Content Inclusion

### Exclude Files

Use glob patterns to exclude specific content:

```json
{
  "exclude": [
    "**/draft/**",
    "**/experimental/**",
    "**/*.example.md",
    "**/beta/**"
  ]
}
```

This is useful for:
- Draft content not ready for production
- Experimental features still in development
- Beta features in limited release
- Example files for documentation

### Include Files

Explicitly include files that would otherwise be excluded:

```json
{
  "include": [
    "**/*.prod-only.md",
    "content/skills/premium/**"
  ]
}
```

## Team-Based Configuration

For teams with different needs, use configuration profiles:

### Frontend Team Config

**carnet.config.frontend.json:**
```json
{
  "include": ["**/frontend/**", "**/shared/**"],
  "exclude": ["**/backend/**", "**/devops/**"],
  "variables": {
    "TEAM": "frontend"
  }
}
```

### Backend Team Config

**carnet.config.backend.json:**
```json
{
  "include": ["**/backend/**", "**/shared/**"],
  "exclude": ["**/frontend/**", "**/mobile/**"],
  "variables": {
    "TEAM": "backend"
  }
}
```

Build for specific team:
```bash
carnet build --config carnet.config.frontend.json
carnet build --config carnet.config.backend.json
```

## Per-Agent Customization

Use variables in agent prompts for customization:

**content/agents/assistant/AGENT.md:**
```yaml
---
name: assistant
description: General assistant
initialSkills:
  - conversation
skills:
  - analysis
prompt: |
  You are a helpful assistant for {{ COMPANY }}.

  Your role is to help users with {{ TEAM }} tasks.

  Environment: {{ ENVIRONMENT }}
  Log Level: {{ LOG_LEVEL }}
---
```

Same agent works differently based on active variables during build.

## Scaling Configuration

### For Single Large Project

Keep single config with broad scope:

```json
{
  "baseDir": "./content",
  "variables": {
    "COMPANY": "Acme",
    "ENVIRONMENT": "production"
  }
}
```

### For Monorepo with Multiple Agents

Use multiple configs for different sections:

```
carnet.config.json          # Root/shared config
apps/
├── app1/carnet.config.json # App-specific config
├── app2/carnet.config.json
└── app3/carnet.config.json
```

Build each:
```bash
carnet build --config apps/app1/carnet.config.json
carnet build --config apps/app2/carnet.config.json
```

## See Also

- [Configuration Overview](/configuration/) - Configuration file reference
- [Variables](/configuration/variables) - Variable usage and precedence
- [Tips & Tricks](/guide/tips-and-tricks) - Practical development tips
- [Patterns](/guide/patterns) - Architectural patterns

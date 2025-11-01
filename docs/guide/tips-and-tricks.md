# Tips & Tricks

Practical tips and tricks for working with Carnet effectively.

## Bulk Skill Assignment

If many agents use the same skills, use global configuration instead of repeating in each agent:

**Instead of this** (repeats in every agent):
```yaml
# agents/agent1/AGENT.md
initialSkills:
  - common-utils
  - logging
  - error-handling

# agents/agent2/AGENT.md
initialSkills:
  - common-utils
  - logging
  - error-handling
```

**Do this** (configured once):
```json
{
  "app": {
    "globalSkills": ["common-utils", "logging", "error-handling"]
  }
}
```

Global skills are automatically available to all agents.

## Conditional Includes

Exclude draft or experimental content from production builds:

```json
{
  "exclude": ["**/draft/**", "**/experimental/**", "**/*.example.md"]
}
```

This prevents incomplete or test content from being included in the manifest.

## Development-Only Skills

In development, include extra debugging and testing skills:

```json
{
  "include": ["**/*.dev.md"],
  "variables": {
    "DEBUG_MODE": "true"
  }
}
```

Then use in your content:
```markdown
# Debug Utilities

```typescript
if ({{ DEBUG_MODE }}) {
  console.log('Debug mode enabled')
}
```
```

## Using Multiple Config Files

### Development Configuration
**carnet.config.json:**
```json
{
  "baseDir": "./content",
  "output": "./dist",
  "include": ["**/*.dev.md"],
  "variables": {
    "ENVIRONMENT": "development",
    "LOG_LEVEL": "debug"
  }
}
```

### Production Configuration
**carnet.config.prod.json:**
```json
{
  "baseDir": "./content",
  "output": "./dist",
  "exclude": ["**/draft/**", "**/*.dev.md"],
  "variables": {
    "ENVIRONMENT": "production",
    "LOG_LEVEL": "warn"
  }
}
```

### Build Commands
```bash
# Development
carnet build

# Production
carnet build --config carnet.config.prod.json
```

## Organizing Large Projects

### By Capability Type
```
content/
├── agents/
├── skills/
│   ├── frontend/
│   ├── backend/
│   ├── devops/
│   └── shared/
├── toolsets/
└── tools/
```

### By Team/Domain
```
content/
├── frontend-team/
│   ├── agents/
│   ├── skills/
│   └── toolsets/
├── backend-team/
│   ├── agents/
│   ├── skills/
│   └── toolsets/
└── shared/
    ├── agents/
    └── skills/
```

Choose the structure that matches your organization.

## Naming Conventions

### Use Descriptive Names
```
✓ code-quality-analyzer
✓ web-framework-knowledge
✓ api-endpoint-tester

✗ tool1
✗ skill
✗ utils
```

### Use Hyphens for Multi-word Names
```
✓ code-review
✓ test-runner
✓ document-generator
```

### Indicate Purpose
```
✓ eslint-config-checker
✓ jest-test-executor
✓ markdown-formatter

✗ linter
✗ tester
✗ tool
```

## Efficient Variable Management

### Configuration File Variables
```json
{
  "variables": {
    "COMPANY_NAME": "Acme Corp",
    "API_VERSION": "v2",
    "REGION": "us-east-1"
  }
}
```

### Environment Variable Prefixes
Control which environment variables can be used:

```json
{
  "envPrefixes": ["CARNET_", "PUBLIC_"]
}
```

Only variables starting with `CARNET_` or `PUBLIC_` will be available.

### Verification
Check that variables are used consistently:

```bash
carnet list --type variables
```

## Debugging Content Issues

### Validate Your Manifest
```bash
carnet lint
```

Checks for:
- Missing references
- Invalid names
- Circular dependencies
- Structural issues

### List All Entities
```bash
carnet list --type agents
carnet list --type skills
carnet list --type toolsets
carnet list --type tools
```

### View Specific Entity
```bash
carnet show agent my-agent
carnet show skill my-skill
```

## Performance Tips

### Keep Initial Skills Minimal
Use `initialSkills` only for essential capabilities:

```yaml
initialSkills:
  - core-functionality      # ✓ Essential
  - basic-utilities

skills:
  - advanced-features       # ✓ Loaded on demand
  - experimental-tools
```

### Organize for Progressive Loading
Structure skills so on-demand loading is efficient:

```yaml
initialSkills:
  - conversation            # Always needed
skills:
  - code-generation        # Advanced feature
  - data-analysis          # Specialized capability
```

This keeps initial prompts small for better token efficiency.

## See Also

- [Core Concepts](/guide/concepts) - Entity types and architecture
- [Patterns](/guide/patterns) - Architectural patterns
- [Configuration](/configuration/) - Configuration options
- [Troubleshooting](/guide/troubleshooting) - Solving common problems

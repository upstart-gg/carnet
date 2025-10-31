# Examples & Patterns

Learn from real-world examples and common patterns.

## Example Projects

The Carnet repository includes several complete example projects. Check the `examples/` directory:

- **basic-cli/** - Simple CLI usage example
- **nodejs-programmatic/** - Using Carnet as a library in Node.js
- **ci-cd/** - Integrating Carnet into CI/CD pipelines
- **my-app/** - Comprehensive real-world example

### Running Examples

```bash
cd examples/nodejs-programmatic
bun install
bun run build
bun run start
```

## Common Patterns

### Pattern 1: Specialized Agent

Create an agent with specific expertise:

**content/agents/researcher/AGENT.md:**
```yaml
---
name: researcher
description: Research and information gathering specialist
initialSkills:
  - search
skills:
  - analysis
  - summarization
  - citation
prompt: |
  You are a research specialist. Your role is to:
  1. Search for accurate information
  2. Analyze sources critically
  3. Summarize findings clearly
  4. Provide proper citations
---

# Researcher Agent
...
```

### Pattern 2: Reusable Skill Set

Create a skill that multiple agents can use:

**content/skills/code-quality/SKILL.md:**
```yaml
---
name: code-quality
description: Code quality analysis and improvement
toolsets:
  - linting
  - testing
  - documentation
---

# Code Quality Skill
...
```

Then reference it in multiple agents:

```yaml
skills:
  - code-quality
  - code-generation
```

### Pattern 3: Global Utilities

Define common skills available to all agents:

**carnet.config.json:**
```json
{
  "app": {
    "globalSkills": ["common-utilities", "error-handling"]
  }
}
```

**content/skills/common-utilities/SKILL.md:**
```yaml
---
name: common-utilities
description: Common utilities available to all agents
toolsets:
  - string-manipulation
  - math-operations
  - formatting
---

# Common Utilities
...
```

### Pattern 4: Domain-Specific Agent

Create agents specialized for specific domains:

```
content/agents/
├── web-developer/AGENT.md
├── data-scientist/AGENT.md
├── devops-engineer/AGENT.md
└── security-analyst/AGENT.md

content/skills/
├── web-frameworks/SKILL.md
├── data-analysis/SKILL.md
├── infrastructure/SKILL.md
└── security-testing/SKILL.md
```

### Pattern 5: Progressive Capability Loading

Use initial skills for core functionality and on-demand skills for advanced features:

```yaml
---
name: assistant
description: General purpose assistant
initialSkills:
  - conversation
  - basic-calculation
skills:
  - advanced-analysis
  - code-generation
  - image-processing
  - document-analysis
prompt: |
  You are a helpful assistant with broad capabilities.
---
```

## Real-World Example: Multi-Agent System

Here's a practical example of organizing agents for a software development team:

**Directory structure:**
```
content/
├── agents/
│   ├── code-reviewer/AGENT.md
│   ├── bug-finder/AGENT.md
│   └── documentation-writer/AGENT.md
├── skills/
│   ├── code-analysis/SKILL.md
│   ├── testing/SKILL.md
│   └── writing/SKILL.md
├── toolsets/
│   ├── linters/TOOLSET.md
│   ├── test-runners/TOOLSET.md
│   └── doc-generators/TOOLSET.md
└── tools/
    ├── eslint-runner/TOOL.md
    ├── jest-runner/TOOL.md
    └── markdown-formatter/TOOL.md
```

**Configuration:**
```json
{
  "app": {
    "globalSkills": ["version-control", "communication"]
  }
}
```

**Agent definitions:**

Code Reviewer:
```yaml
name: code-reviewer
initialSkills:
  - code-analysis
skills:
  - testing
  - documentation
```

Bug Finder:
```yaml
name: bug-finder
initialSkills:
  - code-analysis
skills:
  - testing
  - debugging
```

Documentation Writer:
```yaml
name: documentation-writer
initialSkills:
  - writing
skills:
  - code-analysis
  - testing
```

## Configuration Patterns

### Development vs Production

Use different config files for different environments:

**carnet.config.json** (development):
```json
{
  "baseDir": "./content",
  "output": "./dist",
  "app": {
    "globalSkills": ["development-tools"]
  }
}
```

**carnet.config.prod.json** (production):
```json
{
  "baseDir": "./content",
  "output": "./dist",
  "app": {
    "globalSkills": ["production-utilities"]
  },
  "exclude": ["**/beta/**", "**/experimental/**"]
}
```

Use it:
```bash
carnet build --config carnet.config.prod.json
```

### Template Variables

Use environment-specific variables:

**carnet.config.json:**
```json
{
  "variables": {
    "COMPANY": "ACME Corp",
    "API_VERSION": "v1",
    "REGION": "us-west-2"
  },
  "envPrefix": ["CARNET_", "PUBLIC_"]
}
```

**Use in markdown:**
```markdown
# {{ COMPANY }} Services

API endpoint: https://api.{{ REGION }}.{{ COMPANY }}.com/{{ API_VERSION }}
```

## Best Practices

### 1. Logical Organization
Group related tools into toolsets and toolsets into skills.

### 2. Reusability
Create skills that multiple agents can share to reduce duplication.

### 3. Clear Naming
Use descriptive names that indicate purpose:
- `code-analysis` (clear) vs `tools` (vague)
- `web-framework-knowledge` vs `web` (specific vs generic)

### 4. Focused Agents
Each agent should have a clear purpose and not try to do everything.

### 5. Documentation
Document each entity's purpose and capabilities in the markdown content.

## Tips & Tricks

### Bulk Skill Assignment

If many agents use the same skills, use global configuration:

```json
{
  "app": {
    "globalSkills": ["common-utils", "logging", "error-handling"]
  }
}
```

### Conditional Includes

Exclude draft or experimental content from production:

```json
{
  "exclude": ["**/draft/**", "**/experimental/**", "**/*.example.md"]
}
```

### Development Tools

In development, include extra debugging skills:

```json
{
  "include": ["**/*.dev.md"],
  "variables": {
    "DEBUG_MODE": "true"
  }
}
```

## Troubleshooting

### "Unknown skill referenced"

Error: Agent references a skill that doesn't exist.

**Solution:** Check spelling in agent's `skills` array and ensure the skill markdown file exists.

### "Circular dependency"

Error: Tools, toolsets, or skills form a circular reference.

**Solution:** Restructure your hierarchy - skills should reference toolsets, toolsets reference tools, but not vice versa.

### "Missing entity"

Error: Referenced entity (agent, skill, toolset, or tool) doesn't exist.

**Solution:** Run `carnet validate` to see all missing references, then create the missing entities.

## Next Steps

- Create your first [agent content](/content/)
- Learn about [configuration](/configuration/)
- Explore the [CLI](/cli/)
- Check the [API](/api/) for programmatic usage

# Architectural Patterns

Learn common patterns for organizing agents, skills, and toolsets effectively.

## Pattern 1: Specialized Agent

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

## Pattern 2: Reusable Skill Set

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

## Pattern 3: Global Utilities

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

## Pattern 4: Domain-Specific Agents

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

## Pattern 5: Progressive Capability Loading

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

This pattern is especially useful with the [Progressive Loading](/api/concepts/progressive-loading) API pattern for efficient context window usage.

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

## See Also

- [Core Concepts](/guide/concepts) - Understand agents, skills, toolsets, and tools
- [Using with LLMs](/guide/using-with-llms) - Apply patterns with real LLM integrations
- [Organizing Projects](/guide/organizing-projects) - Multi-agent system examples

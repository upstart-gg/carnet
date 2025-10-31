# Content Types

Learn how to define agents, skills, toolsets, and tools.

## The Four Types

### [Agents](/content/agents)
AI agents with prompts and skill references.

### [Skills](/content/skills)
Capabilities that group tools.

### [Toolsets](/content/toolsets)
Collections of related tools.

### [Tools](/content/tools)
Individual capabilities or functions.

## Quick Examples

### Agent
```yaml
---
name: coder
description: Code generation assistant
initialSkills: [code-execution]
skills: [code-generation]
prompt: |
  You are a code assistant...
---

# Coder Agent
...
```

### Skill
```yaml
---
name: code-generation
description: Generate code
toolsets: [code-formatter]
---

# Code Generation
...
```

### Toolset
```yaml
---
name: code-formatter
description: Format code
tools: [prettier]
---

# Code Formatter
...
```

### Tool
```yaml
---
name: prettier
description: Format code
---

# Prettier
...
```

## File Organization

```
content/
├── agents/[name]/AGENT.md
├── skills/[name]/SKILL.md
├── toolsets/[name]/TOOLSET.md
└── tools/[name]/TOOL.md
```

## Learn More

- [Agents](/content/agents) - Agent definitions
- [Skills](/content/skills) - Skill definitions
- [Toolsets](/content/toolsets) - Toolset definitions
- [Tools](/content/tools) - Tool definitions
- [Concepts](/guide/concepts) - Architecture overview

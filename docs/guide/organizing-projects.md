# Organizing Multi-Agent Systems

Learn how to structure complex projects with multiple agents working together.

## Real-World Example: Software Development Team

Here's a practical example of organizing agents for a software development team with different specializations.

### Directory Structure

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

### Global Configuration

**carnet.config.json:**
```json
{
  "app": {
    "globalSkills": ["version-control", "communication"]
  }
}
```

Global skills are available to all agents, reducing duplication.

### Agent Definitions

#### Code Reviewer Agent

Specializes in code quality and standards:

```yaml
---
name: code-reviewer
description: Reviews code for quality, standards, and best practices
initialSkills:
  - code-analysis
skills:
  - testing
  - documentation
prompt: |
  You are an expert code reviewer. Your role is to:
  1. Check code quality and style
  2. Verify testing coverage
  3. Review documentation
  4. Suggest improvements
---
```

#### Bug Finder Agent

Specializes in identifying and analyzing issues:

```yaml
---
name: bug-finder
description: Identifies bugs and potential issues in code
initialSkills:
  - code-analysis
skills:
  - testing
  - debugging
prompt: |
  You are an expert bug finder. Your role is to:
  1. Analyze code for potential bugs
  2. Review test coverage
  3. Identify edge cases
  4. Suggest debugging approaches
---
```

#### Documentation Writer Agent

Specializes in creating clear documentation:

```yaml
---
name: documentation-writer
description: Creates and maintains documentation
initialSkills:
  - writing
skills:
  - code-analysis
  - testing
prompt: |
  You are an expert technical writer. Your role is to:
  1. Write clear documentation
  2. Explain complex concepts simply
  3. Include code examples
  4. Maintain consistency
---
```

## Organization Principles

### 1. Clear Role Separation
Each agent has a distinct primary purpose and sets of initial skills that define its core functionality.

### 2. Shared Skills
Common skills (like code-analysis) are referenced by multiple agents instead of duplicated.

### 3. Global Utilities
Use `globalSkills` in configuration for cross-cutting concerns like version control and communication.

### 4. Scalable Structure
This structure scales from 2 agents to 20+ agents without becoming unmanageable.

### 5. Domain Boundaries
Skills group related toolsets, toolsets group related tools, creating clear boundaries.

## Scaling Patterns

### For Larger Teams
Add more specialized agents and skills:

```
agents/
├── code-reviewer/AGENT.md
├── bug-finder/AGENT.md
├── performance-analyst/AGENT.md
├── security-auditor/AGENT.md
├── documentation-writer/AGENT.md
└── devops-engineer/AGENT.md

skills/
├── code-analysis/SKILL.md
├── testing/SKILL.md
├── performance/SKILL.md
├── security/SKILL.md
├── writing/SKILL.md
└── infrastructure/SKILL.md
```

### For Organizational Hierarchies
Group by department or team:

```
content/
├── frontend-team/
│   ├── agents/
│   │   ├── web-developer/AGENT.md
│   │   └── ux-reviewer/AGENT.md
│   ├── skills/
│   │   └── web-frameworks/SKILL.md
│   └── toolsets/
├── backend-team/
│   ├── agents/
│   │   ├── api-developer/AGENT.md
│   │   └── database-specialist/AGENT.md
│   └── skills/
│       └── backend-services/SKILL.md
└── shared/
    ├── agents/
    │   └── qa-automation/AGENT.md
    └── skills/
        ├── code-quality/SKILL.md
        └── testing/SKILL.md
```

## See Also

- [Architectural Patterns](/guide/patterns) - Common design patterns
- [Core Concepts](/guide/concepts) - Agent/skill/toolset/tool architecture
- [Configuration Patterns](/configuration/patterns) - Dev/prod configuration strategies

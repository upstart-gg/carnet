# Skill Schema

A skill is a collection of related toolsets that provide specific capabilities to an agent.

## Schema Fields

### `name`

- **Type:** `string`
- **Required:** Yes
- **Description:** Unique identifier for the skill

### `description`

- **Type:** `string`
- **Required:** Yes
- **Description:** Human-readable description of what this skill provides

### `toolsets`

- **Type:** `string[]`
- **Default:** `[]`
- **Description:** List of toolsets that make up this skill

### `files` (Optional)

- **Type:** `array` of file references
- **Default:** `[]`
- **Description:** Files available for on-demand loading by the LLM

Each file reference has:
- **`path`** (required): Relative path from skill root directory (no `./` prefix)
- **`description`** (required): Description to help LLM decide when to load this file

When a skill is loaded, the LLM receives the list of available files with their descriptions. The LLM can then use the `loadSkillFile` tool to fetch specific files as needed.

### `content`

- **Type:** `string` (markdown)
- **Description:** Detailed documentation and implementation notes for the skill

## Example Skill

```markdown
---
name: code-generation
description: Code generation and synthesis capabilities
toolsets: [python-codegen, typescript-codegen]
files:
  - path: templates/python-function.py
    description: Python function template for code generation
  - path: templates/typescript-class.ts
    description: TypeScript class template for code generation
---

# Code Generation Skill

This skill provides code generation and synthesis capabilities across multiple languages. It bundles together tools for Python and TypeScript code generation.

Use the `loadSkillFile` tool to access code templates when generating code in a specific language.
```

## Skill with Files - Full Example

**Directory structure:**
```
skills/code-review/
├── SKILL.md
├── guidelines/
│   ├── python-pep8.md
│   ├── typescript-style.md
│   └── security-checks.md
└── examples/
    └── review-template.md
```

**SKILL.md:**
```yaml
---
name: code-review
description: Perform comprehensive code reviews
toolsets: [static-analysis]
files:
  - path: guidelines/python-pep8.md
    description: PEP 8 style guide for Python code reviews
  - path: guidelines/typescript-style.md
    description: TypeScript coding standards
  - path: guidelines/security-checks.md
    description: Security vulnerability checklist
  - path: examples/review-template.md
    description: Template structure for code review reports
---

# Code Review Skill

When reviewing code, you can load language-specific style guides using the `loadSkillFile` tool.
```

## LLM Workflow with Files

1. **Load skill:**
   ```typescript
   loadSkill({ skillName: 'code-review' })
   ```
   Returns skill content + files array with metadata

2. **Review available files and decide what to load:**
   ```typescript
   // User asks to review Python code
   loadSkillFile({
     skillName: 'code-review',
     path: 'guidelines/python-pep8.md'
   })
   ```
   Returns full content of the PEP 8 guide

## Use Cases for Files

- **Style guides** - Load language-specific guidelines only when needed
- **Code examples** - Fetch templates when generating code
- **Reference docs** - Load API documentation on-demand
- **Pre-made artifacts** - Access configuration templates when requested

## Benefits

- Keeps skill prompts concise
- LLM loads only what it needs
- Reduces initial context size
- Enables context-aware resource loading

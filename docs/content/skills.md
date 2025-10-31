# Skill Schema

A skill is a collection of related toolsets that provide specific capabilities to an agent.

## TypeScript Type

See the [API Reference](/api/reference/type-aliases/Skill) for the complete `Skill` type definition.

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

### `content`

- **Type:** `string` (markdown)
- **Description:** Detailed documentation and implementation notes for the skill

## Example Skill

```markdown
---
name: code-generation
description: Code generation and synthesis capabilities
toolsets: [python-codegen, typescript-codegen]
---

# Code Generation Skill

This skill provides code generation and synthesis capabilities across multiple languages. It bundles together tools for Python and TypeScript code generation.

The markdown body here documents the skill in detail.
```
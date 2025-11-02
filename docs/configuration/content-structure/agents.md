# Agent Schema

An agent is the main entity in Carnet - it represents an AI agent with a system prompt and a set of skills.

## Schema Fields

### `name`

- **Type:** `string`
- **Required:** Yes
- **Description:** Unique identifier for the agent

### `description`

- **Type:** `string`
- **Required:** Yes
- **Description:** Human-readable description of the agent's purpose

### `initialSkills`

- **Type:** `string[]`
- **Default:** `[]`
- **Description:** Skills that are automatically loaded when the agent is created

### `skills`

- **Type:** `string[]`
- **Default:** `[]`
- **Description:** Additional skills that can be loaded on demand during the agent's lifecycle

### `prompt`

- **Type:** `string` (markdown)
- **Required:** Yes
- **Description:** The system prompt for the agent (markdown content)

## Example Agent

```markdown
---
name: code-assistant
description: AI assistant for code generation and debugging
initialSkills: [code-analysis]
skills: [code-generation, testing, documentation]
---

# Code Assistant

You are a skilled code assistant. Help users write, debug, and improve code. Focus on best practices and clear explanations.

This is the markdown body of the agent, which becomes the system prompt.
```

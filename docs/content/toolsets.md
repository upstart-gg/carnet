# Toolset Schema

A toolset is a collection of related tools that work together to provide functionality.

## TypeScript Type

See the [API Reference](/api/types) for type definitions.

## Schema Fields

### `name`

- **Type:** `string`
- **Required:** Yes
- **Description:** Unique identifier for the toolset

### `description`

- **Type:** `string`
- **Required:** Yes
- **Description:** Human-readable description of the toolset

### `tools`

- **Type:** `string[]`
- **Required:** Yes
- **Description:** List of tools included in this toolset

### `content`

- **Type:** `string` (markdown)
- **Description:** Documentation for the toolset and its tools

## File Structure

Toolsets and their tools are organized in a nested directory structure:

```
content/toolsets/
├── [toolset-name]/
│   ├── TOOLSET.md          # Toolset definition
│   ├── [tool-1-name].md    # First tool
│   ├── [tool-2-name].md    # Second tool
│   └── [tool-3-name].md    # Third tool
├── [another-toolset]/
│   ├── TOOLSET.md
│   ├── tool-a.md
│   └── tool-b.md
└── ...
```

Tools are defined as individual markdown files within their parent toolset directory, not in a separate top-level tools directory.

## Example Toolset

```markdown
---
name: code-formatter
description: Code formatting and styling tools
tools: [prettier, eslint-formatter]
---

# Code Formatter Toolset

This toolset provides tools for formatting and styling code according to industry best practices. It includes Prettier for general formatting and ESLint formatter for JavaScript-specific concerns.

The markdown body documents how these tools work together.
```
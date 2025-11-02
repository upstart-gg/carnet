# Tool Schema

A tool is the smallest unit - it represents a single capability or function available to an agent. Tools are always defined within a toolset.

## Schema Fields

### `name`

- **Type:** `string`
- **Required:** Yes
- **Description:** Unique identifier for the tool (must match the filename without .md)

### `description`

- **Type:** `string`
- **Required:** Yes
- **Description:** Human-readable description of what the tool does

### `content`

- **Type:** `string` (markdown)
- **Description:** Detailed documentation, usage examples, and implementation notes

## File Structure

Tools are defined as markdown files (without YAML frontmatter keys for name/description) directly within their parent toolset directory:

```
content/toolsets/[toolset-name]/
├── TOOLSET.md           # Toolset definition
├── tool-name-1.md       # Tool definition
├── tool-name-2.md       # Tool definition
└── tool-name-3.md       # Tool definition
```

The filename (minus .md extension) becomes the tool's name.

## Example Tool

```markdown
---
name: format-code
description: Format code using Prettier
---

# Format Code Tool

This tool wraps Prettier to format code consistently. It handles JavaScript, TypeScript, JSX, CSS, JSON and more.

## Usage

Format your code files with consistent styling.

## Configuration

Prettier configuration can be specified in .prettierrc
```
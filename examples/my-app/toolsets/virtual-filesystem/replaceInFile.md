---
name: replaceInFile
description: Make targeted string replacements in an existing file
---

# replaceInFile

Make targeted string replacements in an existing file.

## Overview

Modify specific portions of a file while preserving the rest of its content. Always read file first before replacing.

## Parameters

- `path` (required) - File path to modify
- `old` (required) - Text to find and replace
- `new` (required) - Replacement text

## Examples

### Update Component Props
```
replaceInFile({
  path: "./app/components/ProductCard.tsx",
  old: "export const props = Type.Object({...})",
  new: "export const props = Type.Object({...new props...})"
})
```

### Update Theme Colors
```
replaceInFile({
  path: "./app/themes/ocean-blue.json",
  old: "\"primary\": \"oklch(0.5 0.1 200)\"",
  new: "\"primary\": \"oklch(0.6 0.15 220)\""
})
```

### Update Page Content
```
replaceInFile({
  path: "./app/pages/home.tsx",
  old: "Old page title",
  new: "New page title"
})
```

## Best Practices

- Always `readFile` first to see current content
- Make exact string matches - spacing matters
- Make one logical change per replacement
- Use `patch` for complex multi-line edits
- Include enough context to make match unique

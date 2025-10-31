---
name: find
description: Locate files by name pattern
---

# find

Locate files by name pattern.

## Overview

Search for files matching name patterns. Use when you can't remember exact file locations or searching by filename.

## Parameters

- `path` (required) - Directory to search in
- `pattern` (required) - File name pattern to match
- `recursive` (optional) - Search subdirectories (default: false)

## Examples

### Find Component Files
```
find({
  path: "./app/components/",
  pattern: "*.tsx",
  recursive: true
})
```

### Find Theme Files
```
find({
  path: "./app/themes/",
  pattern: "*.json",
  recursive: true
})
```

### Find Specific File
```
find({
  path: "./app/",
  pattern: "ProductCard.tsx",
  recursive: true
})
```

## Best Practices

- Use `recursive: true` for broad searches
- Use wildcards (* and ?) for flexible matching
- Combine with `readFile` to open found files
- Use `grep` for content-based searches

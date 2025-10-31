---
name: grep
description: Search for content in files across the filesystem
---

# grep

Search for content in files across the filesystem.

## Overview

Find specific patterns or content across multiple files. Useful for locating where functions/components are used or finding specific code patterns.

## Parameters

- `path` (required) - Directory or file to search in
- `pattern` (required) - Pattern or text to search for
- `recursive` (optional) - Search subdirectories (default: false)

## Examples

### Find Where Component is Imported
```
grep({
  path: "./app/",
  pattern: "import.*ProductCard",
  recursive: true
})
```

### Find Datasource References
```
grep({
  path: "./app/pages/",
  pattern: "datasource\\(",
  recursive: true
})
```

### Find Specific Text
```
grep({
  path: "./app/",
  pattern: "TODO",
  recursive: true
})
```

## Best Practices

- Use `recursive: true` to search entire directories
- Use regex patterns for flexible matching
- Combine with `find` for file name searches
- Use before modifying to understand current usage

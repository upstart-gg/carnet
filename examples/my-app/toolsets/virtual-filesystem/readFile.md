---
name: readFile
description: Read the complete contents of a file
---

# readFile

Read the complete contents of a file.

## Overview

Retrieve the full contents of any file in the virtual filesystem. Always read existing files before modifying them.

## Parameters

- `path` (required) - File path to read (absolute or relative)

## Examples

### Read Component File
```
readFile({ path: "./app/components/Header.tsx" })
```

### Read Configuration File
```
readFile({ path: "./app/config/site.json" })
```

### Read Theme File
```
readFile({ path: "./app/themes/default.json" })
```

### Read Datasource Schema
```
readFile({ path: "./app/config/datasources/products.json" })
```

## Best Practices

- Always read before modifying files
- Use `ls` if unsure of file location first
- Use `grep` or `find` to locate files by content/name
- Check file exists with `ls` before reading

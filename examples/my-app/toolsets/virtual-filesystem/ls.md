---
name: ls
description: List directory contents
---

# ls

List directory contents.

## Overview

See what files and folders exist in a directory. Useful for exploring project structure and checking what assets are available.

## Parameters

- `path` (required) - Directory path to list

## Examples

### List All Components
```
ls({ path: "./app/components/" })
```

### List All Datasources
```
ls({ path: "./app/config/datasources/" })
```

### List All Pages
```
ls({ path: "./app/pages/" })
```

### List All Themes
```
ls({ path: "./app/themes/" })
```

### Explore Project Root
```
ls({ path: "./" })
```

## Best Practices

- Use before reading specific files if unsure of exact names
- Check existence of files/folders before operations
- Explore structure when first working in new area
- Use with `grep` or `find` to locate specific files

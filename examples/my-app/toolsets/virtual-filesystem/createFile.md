---
name: createFile
description: Create a new file in the virtual filesystem
---

# createFile

Create a new file in the virtual filesystem.

## Overview

Create new files for components, pages, schemas, configurations, and other assets. Auto-commit captures file creation.

## Parameters

- `path` (required) - File path to create (absolute or relative)
- `content` (required) - File contents

## Examples

### Create Component File
```
createFile({
  path: "./app/components/ProductCard.tsx",
  content: "import { Type, type Static } from \"@sinclair/typebox\";\n\nexport const props = Type.Object({...});\n\nexport default function ProductCard({...}) {...}"
})
```

### Create Theme File
```
createFile({
  path: "./app/themes/ocean-blue.json",
  content: "{\"name\": \"ocean-blue\", \"colors\": {...}}"
})
```

### Create Datasource Schema
```
createFile({
  path: "./app/config/datasources/products.json",
  content: "{\"name\": \"products\", \"fields\": [...]}"
})
```

### Create Configuration File
```
createFile({
  path: "./app/config/settings.json",
  content: "{\"theme\": \"ocean-blue\", \"language\": \"en\"}"
})
```

## Best Practices

- Check if file exists with `ls` before creating
- Use consistent paths and naming conventions
- Create related files (components, schemas) in appropriate directories
- Include necessary boilerplate and imports
- Auto-commit will track file creation

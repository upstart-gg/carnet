---
name: patch
description: Apply complex multi-line edits to files
---

# patch

Apply complex multi-line edits to files.

## Overview

Make sophisticated changes to files including multi-line replacements, insertions, and deletions. More flexible than replaceInFile for complex edits.

## Parameters

- `path` (required) - File path to modify
- `old` (required) - Exact text block to replace (can be multiple lines)
- `new` (required) - Replacement text block

## Examples

### Update Component Implementation
```
patch({
  path: "./app/components/ProductCard.tsx",
  old: "export default function ProductCard({ title, price }: Static<typeof props>) {\n  return (\n    <div className=\"card\">\n      <p>{title}</p>\n      <p>{price}</p>\n    </div>\n  );\n}",
  new: "export default function ProductCard({ title, price, image }: Static<typeof props>) {\n  return (\n    <div className=\"card\">\n      <img src={image} alt={title} className=\"card-image\" />\n      <p className=\"card-title\">{title}</p>\n      <p className=\"card-price\">${price}</p>\n    </div>\n  );\n}"
})
```

### Add Multiple Lines
```
patch({
  path: "./app/pages/home.tsx",
  old: "import Header from '../components/Header';",
  new: "import Header from '../components/Header';\nimport Footer from '../components/Footer';\nimport { useEffect, useState } from 'react';"
})
```

## Best Practices

- Always `readFile` first to get exact text
- Preserve formatting and indentation exactly
- Make sure old block is unique in file
- Include enough context lines to be unambiguous
- Test changes carefully

---
name: lint
description: Check code quality and identify style/syntax issues
---

# lint

Check code quality and identify style/syntax issues.

## Overview

Run code quality checks to catch errors, style violations, and potential issues before deployment.

## Parameters

(Optional) Path or file to lint specifically

## Examples

### Lint All Code
```
lint()
```

### Lint Specific File
```
lint({ path: "./app/components/ProductCard.tsx" })
```

## What It Checks

- Syntax errors
- Code style violations
- Unused variables
- Missing imports
- Type errors
- Best practice violations

## Best Practices

- Run after making changes
- Fix all errors before delivery
- Run before task completion
- Use feedback to improve code

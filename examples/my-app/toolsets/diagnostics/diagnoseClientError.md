---
name: diagnoseClientError
description: Diagnose and understand client-side errors
---

# diagnoseClientError

Diagnose and understand client-side errors.

## Overview

Get detailed analysis of errors reported by users or discovered during testing. Helps identify root causes and solutions.

## Parameters

- `error` (required) - Error message or stack trace
- (Optional) Additional context about what was happening when error occurred

## Examples

### Diagnose Error
```
diagnoseClientError({ error: "Cannot read property 'name' of undefined" })
```

### Diagnose with Context
```
diagnoseClientError({
  error: "TypeError: Cannot read property 'map' of null",
  context: "Happened when clicking 'Show Products' button on home page"
})
```

## What It Does

- Explains the error
- Identifies likely causes
- Suggests solutions
- Helps locate the issue in code

## Use Cases

- User reports error
- Testing reveals error
- Unexpected behavior investigation

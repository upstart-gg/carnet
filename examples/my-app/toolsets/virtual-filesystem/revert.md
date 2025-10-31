---
name: revert
description: Restore the entire project to a previous commit
---

# revert

Restore the entire project to a previous commit.

## Overview

Roll back all changes to a known good state. Use sparingly - only when you need to completely undo recent work.

## Parameters

- `commitId` (required) - The commit ID to revert to

## When to Use

- Undo recent breaking changes
- Return to known working state
- Roll back failed experiment
- Recover from major mistakes

## Examples

### Revert to Previous Commit
```
revert({ commitId: "abc123def456" })
```

## Best Practices

- Use `gitLog` to find target commit first
- Confirm you have right commit before reverting
- Use sparingly - prefer fixing specific files
- Document why you reverted in memory
- Last resort for recovery

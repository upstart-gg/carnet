---
name: memoryDelete
description: Delete specific entries from your persistent memory
---

# memoryDelete

Delete specific entries from your persistent memory.

## Overview

Remove outdated, incorrect, or resolved information from memory to keep it current and relevant.

## Parameters

- `id` (required) - The memory entry ID to delete

## When to Delete

- Information is outdated or incorrect
- Issue was resolved (clean up from `project_known_issues`)
- Entry was added by mistake
- Context no longer relevant to project

## Examples

### Delete Resolved Issue
```
memoryDelete({ id: "memory-entry-123" })
```
Removes a resolved issue from `project_known_issues`.

### Clean Up After Resolution
```
// Issue was recorded earlier
memoryAdd({
  category: "project_known_issues",
  content: "Products datasource missing - blocker for products page"
})

// ... later, after Data Architect creates datasource ...

// Clean up resolved issue
memorySearch({ query: "products datasource missing" })
// Get the ID from search results, then delete
memoryDelete({ id: "resolved-issue-id" })

// Record the resolution
memoryAdd({
  category: "project_recent_changes",
  content: "Products datasource created by Data Architect with fields: name, price, description, image, category"
})
```

## Best Practices

- Clean up resolved issues regularly to keep memory focused
- Delete outdated information rather than adding "updates"
- Use search to find entry IDs before deleting
- Don't delete decision history - that's valuable context

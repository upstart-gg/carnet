---
name: todoUpdate
description: Update an existing todo item (change status, priority, or description)
---

# todoUpdate

Update an existing todo item (change status, priority, or description).

## Overview

Keep your todo list current by updating task status as you progress. This helps you stay organized and track what you're working on.

## Parameters

- `id` (required) - The todo ID
- `status` (optional) - `pending`, `in_progress`, or `completed`
- `priority` (optional) - `low`, `medium`, or `high`
- `description` (optional) - New description

## Status Workflow

1. **Start**: Task is created as `pending`
2. **Begin work**: Update to `in_progress`
3. **Finish work**: Update to `completed`

## Examples

### Mark Task as In Progress
```
todoUpdate({ id: "todo-123", status: "in_progress" })
```

### Complete a Task
```
todoUpdate({ id: "todo-123", status: "completed" })
```

### Increase Priority
```
todoUpdate({ id: "todo-456", priority: "high" })
```

### Update Description
```
todoUpdate({
  id: "todo-789",
  description: "Create product listing with pagination (not infinite scroll)"
})
```

### Progress Through Tasks
```
// Discover blockers and reorder
todoUpdate({ id: "current-task", status: "pending" })  // Not blocking
todoUpdate({ id: "blocker-task", status: "in_progress" })  // Work on blocker first

// After blocker resolved
todoUpdate({ id: "blocker-task", status: "completed" })
todoUpdate({ id: "current-task", status: "in_progress" })  // Resume original
```

## Best Practices

- Update status immediately after changes
- Keep only ONE task in `in_progress` at a time
- Mark completed immediately, don't batch completions
- Use priority changes to reflect urgent work discovered

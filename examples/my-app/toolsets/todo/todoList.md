---
name: todoList
description: View tasks from your private todo list with optional filtering
---

# todoList

View tasks from your private todo list with optional filtering.

## Overview

Review your tasks with flexible filtering to see what you're working on, what's pending, or completed work.

## Parameters

- `statuses` (optional) - Array of statuses to show
  - Default: `["pending", "in_progress"]` - Shows only active tasks
  - `["completed"]` - Shows only completed work
  - `["pending", "in_progress", "completed"]` - Shows everything

## Examples

### View Active Tasks (Default)
```
todoList()
```
Shows all pending and in_progress tasks - your active work items.

### View Only Current Work
```
todoList({ statuses: ["in_progress"] })
```
Shows only the task(s) you're currently working on.

### Review Completed Work
```
todoList({ statuses: ["completed"] })
```
Shows all completed tasks - useful for cleanup or reference.

### See Everything
```
todoList({ statuses: ["pending", "in_progress", "completed"] })
```
Shows all tasks regardless of status.

## Best Practices

- Check active tasks regularly to stay focused
- Review completed work before starting new tasks
- Clean up completed tasks periodically
- Use active task view (default) most often

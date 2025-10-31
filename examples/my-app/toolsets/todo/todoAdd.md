---
name: todoAdd
description: Add a new task to your private todo list
---

# todoAdd

Add a new task to your private todo list.

## Overview

Create tasks to track action items and organize work. Breaking down complex tasks into steps helps you stay organized and focused.

## Parameters

- `description` (required) - Clear description of the task
- `priority` (optional) - `low`, `medium`, or `high` (default: `medium`)
- `insertAfter` (optional) - Control where the task is added:
  - `"start"` - Add at top (urgent items)
  - `"current"` - Add right after current task
  - `<todo-id>` - Insert after specific todo
  - Default: Append to end

## Examples

### Add Normal Task
```
todoAdd({ description: "Create product listing component" })
```

### Add Urgent Blocker at Top
```
todoAdd({
  description: "Fix critical datasource connection issue",
  priority: "high",
  insertAfter: "start"
})
```

### Queue Follow-up After Current Task
```
todoAdd({
  description: "Add error handling to form",
  insertAfter: "current"
})
```

### Breaking Down Complex Work
```
// When starting a theme creation task
todoAdd({ description: "Load theme-creation and theme-color-theory skills" })
todoAdd({ description: "Analyze user's color preference from memory" })
todoAdd({ description: "Generate OKLCH color palette" })
todoAdd({ description: "Create theme JSON file" })
todoAdd({ description: "Validate with lint" })
todoAdd({ description: "Document color choices in memory" })
```

## Best Practices

- Keep descriptions specific and actionable
- Use `insertAfter: "start"` for discovered blockers
- Use `insertAfter: "current"` for discovered follow-ups
- Break complex work into steps before starting
- Update status immediately when starting each task

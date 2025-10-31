---
name: todoDelete
description: Delete a todo item from your private list
---

# todoDelete

Delete a todo item from your private list.

## Overview

Remove tasks that are no longer relevant to keep your list focused and clean.

## Parameters

- `id` (required) - The todo ID to delete

## When to Delete

- Task is no longer relevant
- Task was added by mistake
- Completed tasks that clutter the list (optional, but good practice)

## Examples

### Delete Irrelevant Task
```
todoDelete({ id: "todo-123" })
```

### Clean Up Completed Tasks
```
// After reviewing completed work
todoList({ statuses: ["completed"] })

// Delete if no longer relevant
todoDelete({ id: "old-completed-task" })
```

## Best Practices

- Delete tasks that are clearly no longer needed
- Clean up regularly to keep list focused
- Keep important completed tasks if they're good reference material

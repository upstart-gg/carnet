---
name: todo-management
description: Managing your private todo list for task tracking and organization. Use when you need to plan, track, or organize multiple tasks.
toolsets:
  - todo
---

# Todo Management

## Overview
Each agent has a **private todo list** separate from memory. Todos are for tracking tasks and actions, while memory is for storing context, decisions, and knowledge.

## Available Tools

- `todoAdd` - Add a new task to your private todo list
- `todoUpdate` - Update an existing todo (change status, priority, description)
- `todoDelete` - Delete a todo item
- `todoList` - List your todos with optional filtering

## When to Use Todos vs Memory

### Use Todos For:
- ✅ Tracking tasks and action items
- ✅ Breaking down complex work into steps
- ✅ Organizing work by priority
- ✅ Tracking what's pending, in progress, or completed
- ✅ Managing dependencies between tasks

### Use Memory For:
- ✅ Storing context and decisions
- ✅ Remembering user preferences
- ✅ Documenting why you made certain choices
- ✅ Recording learnings and insights
- ✅ Sharing information with other agents

## Tool Details

### `todoAdd` - Adding Tasks

**Parameters:**
- `description` (required) - Clear description of the task
- `priority` (optional) - `low`, `medium`, or `high` (default: `medium`)
- `insertAfter` (optional) - Control where the task is added:
  - `"start"` - Add at the top (urgent items)
  - `"current"` - Add right after what you're working on
  - `<todo-id>` - Insert after a specific todo
  - Default: Appends to the end

**Examples:**
```
// Add a normal task
todoAdd({ description: "Create product listing component" })

// Add urgent blocker at top
todoAdd({
  description: "Fix critical datasource connection issue",
  priority: "high",
  insertAfter: "start"
})

// Queue follow-up after current task
todoAdd({
  description: "Add error handling to form",
  insertAfter: "current"
})
```

### `todoUpdate` - Updating Tasks

**Parameters:**
- `id` (required) - The todo ID
- `status` (optional) - `pending`, `in_progress`, or `completed`
- `priority` (optional) - `low`, `medium`, or `high`
- `description` (optional) - New description

**Status Workflow:**
1. Start: Task is `pending`
2. Begin work: Update to `in_progress`
3. Finish work: Update to `completed`

**Examples:**
```
// Mark task as in progress
todoUpdate({ id: "todo-123", status: "in_progress" })

// Complete a task
todoUpdate({ id: "todo-123", status: "completed" })

// Increase priority
todoUpdate({ id: "todo-456", priority: "high" })

// Update description
todoUpdate({
  id: "todo-789",
  description: "Create product listing with pagination (not infinite scroll)"
})
```

### `todoList` - Viewing Tasks

**Parameters:**
- `statuses` (optional) - Array of statuses to show
  - Default: `["pending", "in_progress"]` - Shows only active tasks
  - `["completed"]` - Shows only completed work
  - `["pending", "in_progress", "completed"]` - Shows everything

**Examples:**
```
// View active tasks (default)
todoList()

// View only what you're working on
todoList({ statuses: ["in_progress"] })

// Review completed work
todoList({ statuses: ["completed"] })

// See everything
todoList({ statuses: ["pending", "in_progress", "completed"] })
```

### `todoDelete` - Removing Tasks

**Parameters:**
- `id` (required) - The todo ID

**When to delete:**
- Task is no longer relevant
- Task was added by mistake
- Completed tasks that clutter the list

**Example:**
```
todoDelete({ id: "todo-123" })
```

## Best Practices

### 1. Break Down Complex Tasks
Don't create a single vague todo. Break it into concrete steps:

❌ **Bad:**
```
- Build the entire homepage
```

✅ **Good:**
```
- Create hero section component
- Add features showcase section
- Create testimonials component
- Add CTA section
- Integrate all sections in homepage
```

### 2. Update Status Regularly
Keep your list current:

```
// Start working
todoUpdate({ id: "current-task", status: "in_progress" })

// ... do the work ...

// Immediately mark complete when done
todoUpdate({ id: "current-task", status: "completed" })

// Start next task
todoUpdate({ id: "next-task", status: "in_progress" })
```

### 3. Use Priority Strategically
- `high` - Blockers, critical issues, urgent user requests
- `medium` - Normal feature work (default)
- `low` - Nice-to-haves, optimizations, cleanup

### 4. Use `insertAfter` for Dependencies

When you discover a blocker:
```
// You're working on task B, but realize you need task A first
todoAdd({
  description: "Create datasource for products (needed for product page)",
  priority: "high",
  insertAfter: "start"  // Jump to top
})

// Mark current task as blocked or lower priority
todoUpdate({ id: "current-task", priority: "low" })
```

When you discover a follow-up:
```
// While working on a component, realize you need to add tests
todoAdd({
  description: "Add unit tests for ProductCard component",
  insertAfter: "current"  // Queue it next
})
```

### 5. Keep List Focused
Regularly clean up completed tasks:
```
// Review completed work
todoList({ statuses: ["completed"] })

// Delete if no longer relevant
todoDelete({ id: "old-completed-task" })
```

### 6. Coordinate with Memory
After completing major tasks, update memory:
```
// Complete task
todoUpdate({ id: "schema-creation", status: "completed" })

// Document decision in memory
memoryAdd({
  category: "data-architect_decisions",
  content: "Created single 'products' datasource instead of separate tables for different product types. Rationale: All products share same core fields (name, price, description). Using 'category' field to distinguish types is more maintainable."
})
```

## Common Workflows

### Starting a Delegated Task
```
// 1. Read memory for context
memoryRead({ category: "main_task_context" })

// 2. Break down the work
todoAdd({ description: "Read existing component structure" })
todoAdd({ description: "Create ProductCard component" })
todoAdd({ description: "Add DaisyUI styling" })
todoAdd({ description: "Test component with sample data" })
todoAdd({ description: "Run lint" })
todoAdd({ description: "Update memory with decisions" })
todoAdd({ description: "Report completion" })

// 3. Start first task
todoUpdate({ id: "first-task-id", status: "in_progress" })
```

### Handling Discovered Dependencies
```
// Working on a page, realize datasource doesn't exist
todoAdd({
  description: "Report failure - products datasource missing",
  priority: "high",
  insertAfter: "start"
})

// Immediately work on blocker
todoUpdate({ id: "new-blocker-task", status: "in_progress" })
```

### Multi-Phase Feature Implementation
```
// Phase 1: Setup
todoAdd({ description: "Create base page structure", priority: "high" })
todoAdd({ description: "Set up page routing" })

// Phase 2: Components (depends on phase 1)
todoAdd({ description: "Create hero component" })
todoAdd({ description: "Create features component" })

// Phase 3: Integration (depends on phase 2)
todoAdd({ description: "Integrate components in page" })
todoAdd({ description: "Add responsive styles" })

// Phase 4: Quality (depends on phase 3)
todoAdd({ description: "Run lint and fix errors" })
todoAdd({ description: "Test on different viewports" })
```

## Examples by Agent Type

### Coder Agent
```
// Breaking down a component creation task
todoAdd({ description: "Check if similar components exist" })
todoAdd({ description: "Load components skill" })
todoAdd({ description: "Create ProductCard.tsx with TypeBox props" })
todoAdd({ description: "Add DaisyUI styling classes" })
todoAdd({ description: "Create example usage in test page" })
todoAdd({ description: "Run lint" })
todoAdd({ description: "Document component in memory" })
```

### Designer Agent
```
// Theme creation task
todoAdd({ description: "Load theme-creation and theme-color-theory skills" })
todoAdd({ description: "Analyze user's color preference" })
todoAdd({ description: "Generate OKLCH color palette" })
todoAdd({ description: "Create theme JSON file" })
todoAdd({ description: "Validate with lint" })
todoAdd({ description: "Document color choices in memory" })
```

### Data Architect Agent
```
// Schema design task
todoAdd({ description: "Load data-modeling-philosophy skill" })
todoAdd({ description: "Check existing datasources for consolidation" })
todoAdd({ description: "Design schema with optional fields" })
todoAdd({ description: "Create datasource JSON file" })
todoAdd({ description: "Run lint to validate" })
todoAdd({ description: "Document design rationale in memory" })
```

### Main Agent
```
// Website building task
todoAdd({ description: "Load project-planning skill" })
todoAdd({ description: "Identify site type and pages needed" })
todoAdd({ description: "Delegate theme creation to Designer" })
todoAdd({ description: "Delegate datasource design to Data Architect" })
todoAdd({ description: "Delegate homepage to Coder" })
todoAdd({ description: "Run QA after each major completion" })
todoAdd({ description: "Update user with progress" })
```

## Anti-Patterns to Avoid

❌ **Don't batch todo updates:**
```
// Bad: Waiting to mark multiple tasks complete
// (You completed task 1, 2, 3 but haven't updated any)
```

✅ **Do update immediately:**
```
// Good: Mark complete right after finishing
todoUpdate({ id: "task-1", status: "completed" })
// ... continue to next task ...
```

❌ **Don't create vague todos:**
```
// Bad
todoAdd({ description: "Fix the website" })
```

✅ **Do be specific:**
```
// Good
todoAdd({ description: "Fix broken image link in hero section" })
```

❌ **Don't forget to use skills:**
```
// Bad: Adding todo without loading relevant skill
todoAdd({ description: "Create a page" })
// ... starts working without guidance ...
```

✅ **Do load skills first:**
```
// Good
todoAdd({ description: "Load pages skill" })
todoAdd({ description: "Create products listing page" })
```

## Summary

**Key Principles:**
1. **Todos = Actions**, Memory = Context
2. **Update status immediately** after changes
3. **Break down complex work** into steps
4. **Use priorities** to manage urgent work
5. **Use insertAfter** for discovered dependencies
6. **Clean up regularly** to keep list focused
7. **Coordinate with memory** for decisions and learnings

Effective todo management keeps you organized, helps track progress, and ensures nothing is forgotten during complex multi-step tasks.

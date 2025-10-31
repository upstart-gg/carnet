---
name: todo
description: Tools for managing private todo lists and organizing work
tools:
  - todoAdd
  - todoUpdate
  - todoDelete
  - todoList
---

# Todo Management Tools

Each agent has a **private todo list** separate from memory for tracking tasks and organizing work.

## Overview

Todos are for tracking action items and organizing complex work into steps. Your todo list is private to you and helps:
- Break down complex tasks into manageable steps
- Track what's pending, in progress, or completed
- Manage priorities and dependencies
- Keep organized during multi-step projects

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

## Best Practices

### 1. Break Down Complex Tasks
Don't create a single vague todo. Break it into concrete steps:

**Bad:** "Build the entire homepage"

**Good:**
- Create hero section component
- Add features showcase section
- Create testimonials component
- Add CTA section
- Integrate all sections in homepage

### 2. Update Status Regularly
Keep your list current and immediately mark tasks as you progress.

### 3. Use Priority Strategically
- `high` - Blockers, critical issues, urgent requests
- `medium` - Normal feature work (default)
- `low` - Nice-to-haves, optimizations, cleanup

### 4. Keep ONE Task in Progress
Only have one `in_progress` task at a time to maintain focus.

### 5. Keep List Focused
Regularly clean up completed tasks to avoid clutter.

### 6. Coordinate with Memory
After completing major tasks, document decisions in memory.

## Common Workflows

### Starting a Delegated Task
1. Read memory for context
2. Break down the work into todos
3. Mark first task as in_progress
4. Work through each task, updating status immediately
5. After completion, document decisions in memory

### Handling Discovered Dependencies
If you discover a blocker:
1. Add high-priority todo for the blocker
2. Mark current task as pending
3. Work on blocker first
4. Report if you can't resolve it

### Multi-Phase Implementation
Break into phases with todos for each:
1. Phase 1: Setup and preparation
2. Phase 2: Create components/schemas
3. Phase 3: Integration
4. Phase 4: Quality and testing

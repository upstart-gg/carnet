---
name: memoryRead
description: Read from your persistent memory store to retrieve context, decisions, and learnings
---

# memoryRead

Read from your persistent memory.

## Overview

Retrieve context, decisions, and learnings from your memory store. Use this at the start of tasks to understand project state and decision history.

## Parameters

- `category` (optional) - Specific memory category to read
  - Omit to read all accessible categories
  - Specify to read only one category for efficiency

## Examples

### Read All Memory
```
memoryRead()
```
Returns all accessible memory across all categories you can read.

### Read Specific Category
```
memoryRead({ category: "main_project_context" })
```
Returns only entries in the specified category.

## Available Categories (by agent role)

### Main Agent (write)
- `main_project_context` - Project summary and architecture
- `main_user_preferences` - User requirements and constraints
- `main_task_context` - Current task details for delegated work

### Main Agent (read)
- All categories (own + all other agents' memory)

### Sub-agents (read/write own + shared)
- `coder_decisions`, `coder_notes` (coder only)
- `designer_decisions`, `designer_notes` (designer only)
- `data-architect_decisions`, `data-architect_notes` (data-architect only)
- `project_recent_changes` (all agents)
- `project_known_issues` (all agents)
- `project_decisions` (all agents)
- `main_*` (read-only for all sub-agents)

## Common Workflows

### Sub-agent Starting Delegated Task
```
// Read task context from main agent
memoryRead({ category: "main_task_context" })

// Read user preferences
memoryRead({ category: "main_user_preferences" })

// Read recent project changes
memoryRead({ category: "project_recent_changes" })
```

### Main Agent Starting Session
```
// Get complete picture of project state
memoryRead()
```

## Best Practices

- Always read memory FIRST before starting tasks
- Read relevant categories to understand context before acting
- Use `memorySearch` when you need to find specific information by topic

---
name: memory
description: Tools for managing persistent memory across tasks and agents
tools:
  - memoryRead
  - memoryAdd
  - memorySearch
  - memoryDelete
---

# Memory Management Tools

You have access to memory management tools for storing and retrieving context, decisions, and learnings that persist across tasks.

## Overview

Memory is your long-term knowledge base separate from the filesystem and todos. It stores:
- Project context and user preferences (written by main agent)
- Technical and design decisions with rationale
- Learnings and discoveries from completed work
- Known issues and blockers
- Recent changes and updates

## When to Use Memory

### Use Memory For:
- ✅ Project context and goals
- ✅ User preferences and constraints
- ✅ Design and technical decisions with rationale
- ✅ Learnings and insights discovered during work
- ✅ Known issues and blockers
- ✅ Recent changes and updates

### Don't Use Memory For:
- ❌ Tasks and action items (use todos instead)
- ❌ Source code or actual project files (use filesystem)
- ❌ Temporary work state (use todos)

## Memory Categories

Memory is organized by access patterns:

### Main Agent Categories (Main writes, all agents read)
- `main_project_context` - Overall project summary and architecture
- `main_user_preferences` - User's style, requirements, constraints
- `main_task_context` - Detailed plan for current delegated task

### Shared Project Categories (All agents read/write)
- `project_recent_changes` - Recent commits and updates
- `project_known_issues` - Bugs, blockers, workarounds
- `project_decisions` - Important design and technical decisions

### Agent-Specific Categories (Agent writes, all agents read)
- `coder_decisions` - Technical/architectural choices
- `coder_notes` - Learnings and observations
- `designer_decisions` - Design decisions and rationale
- `designer_notes` - What works, accessibility constraints
- `data-architect_decisions` - Data design decisions
- `data-architect_notes` - Performance and relationship patterns

## Best Practices

### 1. Read First, Act Second
Always start by reading memory to understand context before taking action.

### 2. Write Specific, Clear Entries
Include what you did, why you did it, and the rationale behind decisions.

**Bad:** "Made some changes"
**Good:** "Created reusable ProductCard component. Rationale: This pattern needed on multiple pages (home, products, search results). Includes image, title, price, CTA button using DaisyUI."

### 3. Include Rationale
Always explain WHY, not just WHAT, in your memory entries.

### 4. Be Consistent with Categories
Follow agent access patterns - don't write to categories you don't own.

### 5. Update, Don't Duplicate
When information changes, add new entry with context showing it supersedes previous entry.

### 6. Keep Memory Clean
Use `memoryDelete` to remove outdated or resolved information regularly.

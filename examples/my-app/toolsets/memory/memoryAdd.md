---
name: memoryAdd
description: Write new content to your persistent memory store
---

# memoryAdd

Write new content to your persistent memory.

## Overview

Store important decisions, learnings, and context to your memory. Use this immediately after making important decisions or discovering key insights.

## Parameters

- `category` (required) - Which category to write to
- `content` (required) - The information to store (clear, detailed text)

## Available Categories (by agent role)

### Main Agent (can write)
- `main_project_context` - Project summary and architecture
- `main_user_preferences` - User requirements and constraints
- `main_task_context` - Current task details for delegated work

### Sub-agents (can write own categories)
- `coder_decisions`, `coder_notes` (coder only)
- `designer_decisions`, `designer_notes` (designer only)
- `data-architect_decisions`, `data-architect_notes` (data-architect only)

### All agents (can write shared categories)
- `project_recent_changes` - Recent commits and updates
- `project_known_issues` - Known problems and blockers
- `project_decisions` - Important design/technical decisions

## Examples

### Document a Decision
```
memoryAdd({
  category: "coder_decisions",
  content: "Created reusable ProductCard component instead of inline markup. Rationale: The product card pattern will be used on multiple pages (home, products list, search results). Component includes image, title, price, and CTA button. Using TypeBox for prop validation."
})
```

### Record a Learning
```
memoryAdd({
  category: "coder_notes",
  content: "Discovered that DaisyUI card component works better with 'card-compact' class for product listings. Standard card has too much padding for grid layouts."
})
```

### Document Design Decision
```
memoryAdd({
  category: "designer_decisions",
  content: "Created 'ocean-breeze' theme with blue/teal OKLCH palette using analogous harmony. Primary color: oklch(0.6 0.15 220) chosen for professional tech feel requested by user."
})
```

### Record Recent Change
```
memoryAdd({
  category: "project_recent_changes",
  content: "Added contact form page with email validation. Created 'contact-submissions' forms schema with name, email, subject, and message fields."
})
```

### Document Known Issue
```
memoryAdd({
  category: "project_known_issues",
  content: "Products datasource not yet created. Blocker for products listing page. Needs Data Architect to create schema for name, price, description, image, category fields."
})
```

## Best Practices

### Be Specific and Clear
Include what, why, and rationale:
- ✅ "Created Header component with responsive navigation using DaisyUI navbar. Rationale: User requested sticky navigation visible on all pages."
- ❌ "Made a component"

### Include Rationale
Always explain the reasoning behind decisions:
- ✅ "Selected high-quality hero image of modern office workspace. Rationale: User building SaaS for businesses, needs professional and aspirational feel."
- ❌ "Found an image"

### Use Appropriate Categories
Respect access patterns - only write to categories you own or shared categories:
- Main agent writes to `main_*` categories
- Agents write their own decisions/notes
- All agents can write to `project_*` shared categories

### Write Immediately After Decisions
Don't wait until task completion - document decisions when you make them.

## When to Delete Instead
If information is outdated or incorrect, use `memoryDelete` to remove it rather than adding new entries for simple updates.

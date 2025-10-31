---
name: delegateToDesigner
description: Delegate design and image tasks to the Designer agent
---

# delegateToDesigner

Delegate design and image tasks to the Designer agent.

## Overview

Use this tool to assign work to the Designer who specializes in themes, colors, and imagery.

## Parameters

- `task` (required) - Clear description of design work
- `context` (optional) - Additional context or references to memory
- `priority` (optional) - `low`, `medium`, or `high`

## Examples

### Delegate Theme Creation
```
delegateToDesigner({
  task: "Create a professional yet energetic theme using blue primary colors and orange accents",
  context: "See main_user_preferences for brand guidelines. User is building SaaS for startups.",
  priority: "high"
})
```

### Delegate Image Search
```
delegateToDesigner({
  task: "Find 3 hero images for the homepage. Need modern, professional office settings with diverse teams.",
  context: "User prefers images with natural lighting. Check main_user_preferences for style guidance."
})
```

### Delegate Image Generation
```
delegateToDesigner({
  task: "Generate a minimalist logo for the company. Should be geometric, use blue/white colors, professional feel.",
  priority: "medium"
})
```

## What Designer Does

- Creates themes and color schemes
- Searches for images
- Generates custom images
- Makes aesthetic decisions
- Works with color theory
- Analyzes reference websites

## Best Practices

- Provide clear design direction
- Reference user preferences
- Provide reference URLs if available
- Clarify color preferences
- Wait for completion report before proceeding

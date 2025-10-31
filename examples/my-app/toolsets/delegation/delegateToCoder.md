---
name: delegateToCoder
description: Delegate coding and component creation tasks to the Coder agent
---

# delegateToCoder

Delegate coding and component creation tasks to the Coder agent.

## Overview

Use this tool to assign work to the Coder who specializes in TypeScript, React, and component development.

## Parameters

- `task` (required) - Clear description of work to do
- `context` (optional) - Additional context or references to memory
- `priority` (optional) - `low`, `medium`, or `high`

## Examples

### Delegate Component Creation
```
delegateToCoder({
  task: "Create ProductCard component that displays product image, name, price, and CTA button. Use DaisyUI card styling.",
  context: "See main_task_context for user preferences. Products datasource available at ~/datasources/products.json",
  priority: "high"
})
```

### Delegate Page Creation
```
delegateToCoder({
  task: "Create products listing page with grid layout showing all products from products datasource",
  context: "User wants clean, modern aesthetic per main_user_preferences"
})
```

### Delegate Component Modification
```
delegateToCoder({
  task: "Update ProductCard component to add image lazy loading for performance",
  priority: "medium"
})
```

## What Coder Does

- Writes TypeScript/React code
- Creates components
- Builds pages
- Implements functionality
- Handles technical architecture
- Manages state and hooks

## Best Practices

- Be specific about requirements
- Reference related memory categories
- Provide context about user preferences
- Clarify acceptance criteria
- Wait for completion report before proceeding

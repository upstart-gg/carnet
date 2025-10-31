---
name: reportFailure
description: Report inability to complete a delegated task due to blockers or dependencies
---

# reportFailure

Report inability to complete a delegated task due to blockers or dependencies.

## Overview

Use this tool when you encounter blockers that prevent task completion and you cannot resolve them yourself. Provide clear context so the main agent can help.

## Parameters

- `type` (required) - Category of failure:
  - `dependency-missing` - Required file, datasource, or component doesn't exist
  - `blocker` - External issue blocking progress
  - `unclear-requirements` - Task requirements ambiguous or conflicting
  - `impossible-constraint` - Task is impossible with current constraints
  - `other` - Other issue

- `message` (required) - Clear explanation of the blocker
- `details` (optional) - Additional context, what you tried, what's needed to unblock

## Examples

### Report Missing Datasource
```
reportFailure({
  type: "dependency-missing",
  message: "Cannot create products page - products datasource doesn't exist",
  details: "Need datasource with fields: name, price, description, imageUrl, category. Requested from Data Architect. Waiting for delivery before continuing."
})
```

### Report Unclear Requirements
```
reportFailure({
  type: "unclear-requirements",
  message: "Cannot design theme - conflicting user preferences",
  details: "User requested both 'minimalist, clean aesthetic' and 'vibrant, energetic colors'. These styles conflict. Need clarification on which is priority."
})
```

### Report Impossible Constraint
```
reportFailure({
  type: "impossible-constraint",
  message: "Cannot create responsive navbar with current DaisyUI version",
  details: "DaisyUI navbar doesn't support the specific mobile behavior user wants (nested dropdowns in mobile menu). Would need custom CSS outside DaisyUI paradigm."
})
```

### Report Blocker with Workaround
```
reportFailure({
  type: "blocker",
  message: "Blocked on image optimization - cloudinary integration unavailable",
  details: "Attempted: Used local image optimization, but performance not acceptable. Tried: Three workarounds - all have trade-offs. Recommend: Wait for cloudinary setup or reduce image quality (trade-off: visual quality)"
})
```

## Best Practices

- Be clear about WHAT is blocking you
- Explain WHAT you tried to resolve it
- Specify WHAT would unblock you
- Include relevant context and memory references
- Don't report failures until you've exhausted your options
- Coordinate with memory - document known issues there too

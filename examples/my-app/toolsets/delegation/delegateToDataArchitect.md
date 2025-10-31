---
name: delegateToDataArchitect
description: Delegate data schema and datasource design tasks to the Data Architect agent
---

# delegateToDataArchitect

Delegate data schema and datasource design tasks to the Data Architect agent.

## Overview

Use this tool to assign work to the Data Architect who specializes in data modeling and schema design.

## Parameters

- `task` (required) - Clear description of data work
- `context` (optional) - Additional context or references to memory
- `priority` (optional) - `low`, `medium`, or `high`

## Examples

### Delegate Datasource Creation
```
delegateToDataArchitect({
  task: "Create 'products' datasource with fields: name, description, price, imageUrl, category. All required except optional imageUrl and category.",
  context: "This will be used by products listing page being created by Coder. See main_task_context for requirements.",
  priority: "high"
})
```

### Delegate Schema Design
```
delegateToDataArchitect({
  task: "Design blog post schema that supports both standalone posts and posts in a series. Should handle optional series relationship gracefully.",
  context: "User wants simple blog feature with ability to organize related posts. Check main_user_preferences."
})
```

### Delegate Backward Compatibility Review
```
delegateToDataArchitect({
  task: "Review existing customers datasource and ensure new fields for phone and address are backward compatible",
  priority: "medium"
})
```

## What Data Architect Does

- Designs datasource schemas
- Plans data models
- Ensures data consistency
- Handles backward compatibility
- Optimizes data structure
- Manages relationships

## Best Practices

- Be clear about required fields
- Mention optional fields
- Provide context about how data will be used
- Reference user requirements
- Consider scalability
- Wait for completion report before proceeding

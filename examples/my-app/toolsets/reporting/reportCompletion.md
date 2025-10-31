---
name: reportCompletion
description: Report successful completion of a delegated task to the main agent
---

# reportCompletion

Report successful completion of a delegated task to the main agent.

## Overview

Use this tool when you have successfully completed all work from a delegation. The main agent will review your completion report before assigning next steps.

## Parameters

- `summary` (required) - Brief summary of what was completed
- `details` (optional) - Detailed explanation of deliverables, decisions, or important context

## Examples

### Report Completed Component
```
reportCompletion({
  summary: "Created ProductCard component with TypeBox props validation",
  details: "Component located at ~/components/ProductCard.tsx. Includes image, title, price, CTA button. Uses DaisyUI card styling. Exported props schema for editor integration. Tested with sample data."
})
```

### Report Completed Theme
```
reportCompletion({
  summary: "Created 'ocean-breeze' theme with OKLCH colors",
  details: "Theme file: ~/themes/ocean-breeze.json. Uses analogous color harmony - primary blue oklch(0.6 0.15 220) for trust, secondary teal oklch(0.55 0.12 200) for calm. Matches user's preference for professional yet approachable feel."
})
```

### Report Completed Datasource
```
reportCompletion({
  summary: "Created 'products' datasource schema",
  details: "Datasource file: ~/datasources/products.json. Fields: name (required), description, price, imageUrl, category. Designed for flexibility - all fields except name are optional to accommodate partial data. Ready for integration with products page."
})
```

## Best Practices

- Provide clear summary of what was delivered
- Include file locations for created assets
- Mention key decisions made
- Note any important context for next phases
- Keep summary concise, put details in details field

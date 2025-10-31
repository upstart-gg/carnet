---
name: runQA
description: Run comprehensive quality assurance checks on the entire project
---

# runQA

Run comprehensive quality assurance checks on the entire project.

## Overview

Execute full QA suite to validate website functionality, performance, and quality before delivery.

## Parameters

(Optional) Specific areas or components to focus QA on

## Examples

### Run Full QA
```
runQA()
```

### Run QA on Specific Area
```
runQA({ area: "components" })
```

## What It Checks

- Functionality across pages
- Responsive design on different viewports
- Performance metrics
- Accessibility compliance
- Error logging
- User interactions

## Best Practices

- Run before reporting task completion
- Fix any failures found
- Review all warnings and messages
- Address critical issues immediately

## Use Cases

- After major feature completion
- Before delivering to user
- Testing new components/pages
- Verifying fixes work

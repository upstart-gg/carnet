---
name: web-analysis
description: Analyzing websites for design elements, content structure, and inspiration. Use when users provide URLs as references for design or content.
toolsets:
  - web-analysis
---

# Web Analysis

## Available Tools

- `analyzeDesign` - Extract design information including style, colors, fonts, layouts, and UI patterns
- `analyzeContent` - Analyze content structure, key points, headings, and summaries
- `fetchUrl` - Retrieve raw page content, optionally converted to markdown

## When to Use Each Tool

### Use `analyzeDesign` when:
- User provides URL as design reference or inspiration
- Need design elements: colors, fonts, layouts, UI patterns
- User asks to "copy page", "analyze design", "look at style", or "get inspiration from" a site
- **Default for design-focused requests**

### Use `analyzeContent` when:
- User provides URL as content reference
- Need content structure, key points, headings, content, summaries
- User asks to "analyze content", "summarize page", or "get key points" from a site
- **Default for content analysis requests**

### Use `fetchUrl` when:
- Need raw page content, optionally in markdown
- User asks to "get text from", "extract content", or "fetch page"
- When raw content is needed for further processing (summarization, rewriting, etc.)

## Quick Decision Guide

```
URL provided →
  ├─ About DESIGN/STYLE? → Use `analyzeDesign`
  ├─ About CONTENT/TEXT? → Use `analyzeContent`
  └─ Need RAW CONTENT? → Use `fetchUrl`
```

## Examples

**Design Analysis:**
```
User: "I love the design of stripe.com, can we use similar colors?"
→ Use analyzeDesign to extract color palette and design patterns
```

**Content Analysis:**
```
User: "Check out this competitor's features page at example.com/features"
→ Use analyzeContent to understand content structure and key points
```

**Raw Content:**
```
User: "Get all the text from this blog post so I can rewrite it"
→ Use fetchUrl to retrieve raw content in markdown format
```

## Best Practices

- Always explain to users what design elements or content structure you extracted
- When analyzing design, focus on colors, typography, layout patterns, and UI components
- When analyzing content, focus on structure, messaging, and key information
- Use insights from analysis to inform your own implementation, don't just copy

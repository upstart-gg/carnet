---
name: memorySearch
description: Search your persistent memory with semantic queries
---

# memorySearch

Search your persistent memory with semantic queries.

## Overview

Find information in your memory by topic or concept rather than exact keywords. Use this when you need specific information but aren't sure which category it's in.

## Parameters

- `query` (required) - Semantic search query describing what you're looking for
- `category` (optional) - Limit search to a specific memory category

## Examples

### Search Across All Memory
```
memorySearch({ query: "products datasource schema" })
```
Returns memory entries related to products datasource structure across all categories you can read.

### Search Within Specific Category
```
memorySearch({
  query: "color palette",
  category: "designer_decisions"
})
```
Returns only designer decision entries related to color choices.

### Find Previous Similar Work
```
memorySearch({ query: "form validation patterns" })
```
Returns memory entries about form validation from your previous work.

### Look for Known Issues
```
memorySearch({
  query: "image loading problems",
  category: "project_known_issues"
})
```
Returns issues related to image loading specifically.

### Search for User Preferences
```
memorySearch({
  query: "user prefers minimal design",
  category: "main_user_preferences"
})
```
Returns entries about user's aesthetic preferences.

## Common Use Cases

- Finding similar component patterns you've created
- Locating previous technical decisions for reference
- Checking what blockers were encountered before
- Finding user requirements for a feature area
- Understanding design themes previously chosen

## Best Practices

- Use descriptive, natural language queries
- Search when you need specific info but aren't sure of the category
- Combine with `memoryRead` for category browsing and `memorySearch` for topic search

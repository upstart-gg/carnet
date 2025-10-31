---
name: searchImages
description: Search for stock images from public databases
---

# searchImages

Search for stock images from public databases.

## Overview

Find high-quality images across multiple image databases. Always perform multiple search queries with different angles to find the best results.

## Parameters

- `query` (required) - Search term/description for images
- (Optional) Additional parameters for filtering, size, license type

## Best Practices

### Always Perform Multiple Searches
- Use exactly 3 different search queries
- Vary keywords and angles for different results
- Examples: "modern office", "professional workspace", "team collaboration"

### Use Descriptive Keywords
- Be specific about what you're looking for
- Describe context and mood
- Avoid brand names in searches
- Example: "sustainable technology" instead of "Tesla office"

### Evaluate Results
- Check image quality
- Verify licensing allows use
- Look for professional, high-resolution images
- Report multiple options for user choice

## Examples

### Search for Hero Image
```
searchImages({ query: "modern office with natural light" })
searchImages({ query: "professional team collaboration workspace" })
searchImages({ query: "bright contemporary office environment" })
```

### Search for Product Images
```
searchImages({ query: "product photography flatlay" })
searchImages({ query: "minimalist product showcase" })
searchImages({ query: "professional product display" })
```

### Search for People Images
```
searchImages({ query: "diverse business professionals" })
searchImages({ query: "team working together collaboration" })
searchImages({ query: "people in modern office setting" })
```

## Reporting Results

Provide clear recommendations:
- Image name/source
- Description of content
- Why it works for the use case
- License information

---
name: image-search-strategy
description: Finding appropriate stock images for websites using effective search strategies. Use when tasked with finding images for specific sections or content.
toolsets:
  - image-search
---

# Image Search Strategy

## Overview
When users need images, you search public image databases (Unsplash, Pexels, Pixabay, etc.) to find suitable stock photography.

## Workflow

### 1. Check Existing Images First
Before searching for new images:
```bash
# List all images recursively
ls ./public/images/
```

Look for:
- Images that already exist and can be reused
- Similar images that might work
- Read metadata files (.json) to understand existing image purpose

### 2. Understand the Need
Analyze what kind of images are needed:
- **Hero images**: Wide (16:9), impactful, high-quality
- **Section backgrounds**: Subtle, non-distracting
- **Product images**: Clear, professional, well-lit
- **Team/about**: Authentic, friendly people
- **Icons/illustrations**: Simple, matching style

### 3. Perform Multiple Searches
**Always do exactly 3 different search queries** to get variety.

## Search Query Best Practices

### Be Specific
```
Good: "modern office workspace desk laptop"
Bad: "office"
```

### Avoid Brand Names
You're searching public databases, avoid trademarked terms.
```
Good: "smartphone on desk"
Bad: "iPhone 15 on desk"
```

### Use Descriptive Keywords
Include:
- Subject (what's in the image)
- Style (modern, vintage, minimal)
- Setting (indoor, outdoor, studio)
- Mood (bright, dark, professional, casual)

### Consider Context
Match the website's purpose:
- Restaurant: "food photography plated dish"
- Tech startup: "team collaboration modern office"
- E-commerce: "product flat lay white background"
- Consulting: "business handshake professional"

## Search Examples by Use Case

### Hero Images
Wide, impactful shots:
- "aerial city skyline sunset"
- "mountain landscape wide vista"
- "modern architecture building exterior"
- "team working together bright office"

### About Page
Authentic, people-focused:
- "team meeting diverse professionals"
- "office culture collaborative workspace"
- "business people casual discussion"

### Product/Service Pages
Clean, focused:
- "laptop desk workspace overhead"
- "hands using smartphone closeup"
- "product flatlay white background"
- "modern interior design minimal"

### Blog/Content
Relevant to topic:
- "person writing notebook coffee"
- "reading book comfortable setting"
- "thoughtful person looking distance"

### Backgrounds
Subtle, non-distracting:
- "abstract geometric pattern subtle"
- "gradient background soft"
- "texture paper white minimal"
- "blurred background bokeh"

## Three Search Strategy

Perform 3 searches with different angles:

### Example: Restaurant Hero Image
1. "gourmet plated food elegant"
2. "restaurant interior ambiance warm lighting"
3. "chef preparing food kitchen professional"

### Example: Tech Startup
1. "modern office collaboration team"
2. "workspace desk laptop minimal clean"
3. "diverse professionals meeting discussion"

### Example: E-commerce
1. "product photography white background"
2. "lifestyle product use natural setting"
3. "hands holding product closeup detail"

## Evaluating Results

Choose images that:
- **Match the brand** - style, mood, colors
- **High quality** - sharp, well-composed, good lighting
- **Relevant** - actually fits the section/purpose
- **Diverse** - represent different people when featuring humans
- **Authentic** - avoid overly staged or cheesy stock photos
- **Appropriate aspect ratio** - wide for heroes, square for cards

## Aspect Ratio Guidelines

- **Hero sections**: 16:9 or 21:9 (wide)
- **Square tiles/cards**: 1:1
- **Mobile hero**: 9:16 (vertical)
- **Wide banners**: 16:9
- **Portrait sections**: 3:4 or 4:5

## Best Practices

1. **Always check filesystem first** - Reuse before searching
2. **Do exactly 3 searches** - Variety increases chances of finding perfect match
3. **Be specific in queries** - Better results than generic terms
4. **Avoid brands** - Public databases don't have branded content
5. **Consider industry** - Match imagery to business type
6. **Think about mood** - Professional, casual, vibrant, calm?
7. **Check image quality** - Must be high-resolution
8. **Review all results** - Don't just pick the first one
9. **Update memory** - Record what images were found and their purpose
10. **Report comprehensively** - List all found images with descriptions

## Search Query Patterns

### Formula: Subject + Style + Context
```
"[main subject] [style adjective] [setting/context]"

Examples:
- "coffee cup minimal white background"
- "laptop workspace modern bright"
- "handshake business professional office"
```

### Formula: Action + Subject + Mood
```
"[person/thing doing action] [subject] [mood adjective]"

Examples:
- "team collaborating workspace energetic"
- "person writing journal peaceful"
- "chef cooking kitchen busy"
```

## Common Mistakes to Avoid

❌ **Too generic**: "business" → ✅ "diverse team meeting modern office"
❌ **Too specific**: "2024 Tesla Model X red" → ✅ "electric car modern design"
❌ **Brand names**: "Macbook Pro" → ✅ "laptop silver aluminum"
❌ **Only one search**: Do 3 different searches
❌ **Ignore existing images**: Always check filesystem first

## Reporting Results

When reporting back, include:
- **Summary**: Brief description of search task
- **Images found**: List each image with description
- **Recommendations**: Which images work best for which sections
- **Alternative options**: Give user choices

Example report:
"I've found 12 high-quality images across 3 searches:
1. Hero options: 4 images of modern office spaces with natural lighting
2. About section: 3 images of diverse teams collaborating
3. Product showcase: 5 images of workspaces with laptops and devices

I recommend using image-xyz.jpg for the hero section as it has the warm, professional feel you requested."

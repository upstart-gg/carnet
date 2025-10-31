---
name: image-generation
description: Creating custom AI-generated images with effective prompts for specific use cases. Use when stock images don't fit and custom images are needed.
toolsets:
  - image-generation
---

# Image Generation

## Overview
Generate custom images using AI when stock images don't fit the need. This is for unique, branded, or specific imagery that can't be found in stock libraries.

**Important**: Image generation is costly - only generate when explicitly requested by the main agent or when stock images are insufficient.

## When to Generate vs. Search

### Generate When:
- Need branded/unique imagery (logos, custom illustrations)
- Specific vision that stock photos can't match
- Consistent style across multiple images
- Conceptual or abstract imagery
- Main agent explicitly requests generation

### Search Stock Photos When:
- Need realistic photography
- Common scenes (offices, people, products)
- Quick results needed
- Generic imagery is acceptable

## Prompt Writing Essentials

### Anatomy of a Good Prompt

```
[Subject] + [Style] + [Details] + [Composition] + [Lighting] + [Mood]
```

### Components:

1. **Subject**: What's in the image
   - Be specific and descriptive
   - Include important details

2. **Style**: Visual aesthetic
   - Photography, illustration, 3D render, etc.
   - Art style (minimalist, realistic, abstract)

3. **Details**: Specific elements
   - Colors, textures, materials
   - Objects, people, settings

4. **Composition**: Layout
   - Camera angle, framing
   - Foreground/background elements

5. **Lighting**: Light quality
   - Natural, studio, dramatic, soft
   - Time of day, light direction

6. **Mood**: Emotional tone
   - Professional, playful, calm, energetic
   - Atmosphere and feeling

## Prompt Examples by Use Case

### Logo/Brand Mark
```
A minimalist geometric logo featuring a stylized mountain peak,
clean lines, modern design, blue and white color scheme,
professional and trustworthy feeling, simple flat design,
vector style, on white background
```

### Hero Image - Tech Startup
```
Modern office workspace with diverse team collaborating,
bright natural lighting from large windows,
clean minimal aesthetic, laptops and monitors visible,
professional yet friendly atmosphere,
slightly elevated camera angle,
vibrant but not oversaturated colors
```

### Abstract Background
```
Abstract geometric pattern with soft gradient background,
subtle blend of blue and purple tones,
minimal design, smooth flowing shapes,
professional and modern feel,
suitable for web background,
low contrast for text overlay
```

### Product Illustration
```
3D rendered laptop computer on a clean desk,
isometric view, soft shadows,
pastel color scheme with white and light blue,
minimalist style, no background clutter,
modern and professional aesthetic,
studio lighting
```

### Icon Set
```
Set of 5 minimalist line icons representing
[specific concepts],
uniform stroke weight,
simple geometric shapes,
navy blue color,
professional business style,
transparent background,
16x16 grid alignment
```

### Team/People
```
Diverse group of 4 professionals in casual business attire,
smiling and engaged in discussion,
modern office setting with soft natural light,
authentic and friendly expressions,
medium shot composition,
bright and welcoming atmosphere,
realistic style
```

## Style Keywords

### Visual Styles
- **Photography**: "photorealistic", "DSLR quality", "professional photography"
- **Illustration**: "flat design", "vector art", "illustrated style"
- **3D**: "3D render", "isometric", "low poly", "smooth 3D"
- **Abstract**: "geometric abstract", "fluid shapes", "minimal abstract"
- **Artistic**: "watercolor", "sketch", "hand-drawn", "artistic"

### Aesthetic Moods
- **Professional**: "clean", "minimal", "corporate", "polished"
- **Creative**: "vibrant", "artistic", "bold", "dynamic"
- **Friendly**: "warm", "approachable", "welcoming", "casual"
- **Modern**: "contemporary", "sleek", "cutting-edge", "trendy"
- **Elegant**: "sophisticated", "refined", "premium", "luxurious"

## Color Specifications

### Be Specific About Colors
```
Good: "navy blue (#2C3E50) and coral orange (#FF6B6B)"
Better: "cool blue tones with warm orange accents"
Best: "analogous color scheme using blues and teals"
```

### Color Harmony Terms
- "Monochromatic blue scheme"
- "Complementary blue and orange"
- "Analogous warm colors"
- "Pastel color palette"
- "High contrast black and white"

## Composition Guidelines

### Camera Angles
- "Bird's eye view" / "Overhead shot"
- "Eye level view"
- "Low angle looking up"
- "Isometric view"
- "Close-up" / "Macro"

### Framing
- "Centered composition"
- "Rule of thirds"
- "Negative space on left"
- "Full frame"
- "With copy space for text"

## Aspect Ratio Selection

Choose based on use case:

### 16:9 (Wide)
- Hero sections
- Banner images
- Desktop backgrounds
- Video thumbnails

### 1:1 (Square)
- Social media posts
- Profile images
- Product tiles
- Grid layouts

### 3:4 (Portrait)
- Mobile hero sections
- Vertical cards
- Magazine-style layouts

### 9:16 (Tall)
- Mobile screens
- Stories format
- Vertical banners

## Advanced Prompt Techniques

### Negative Prompts (What to Avoid)
Some systems support negative prompts:
```
"Generate: [your prompt]
Avoid: watermarks, text, logos, people with unrealistic features"
```

### Emphasis
Use descriptive adjectives for emphasis:
```
"A strikingly vibrant sunset" (emphasis on vibrant)
"Extremely minimal and clean design" (emphasis on minimal)
```

### Multiple Concepts
For complex images, structure clearly:
```
"Main subject: [...]
Background: [...]
Style: [...]
Mood: [...]"
```

## Quality Checklist

Before submitting a generation prompt, ensure:
- [ ] Subject is clearly described
- [ ] Style is specified
- [ ] Colors are mentioned
- [ ] Composition/angle is indicated
- [ ] Mood/atmosphere is defined
- [ ] Aspect ratio is appropriate
- [ ] Prompt is detailed but not overly complex
- [ ] Brand guidelines are considered (if applicable)

## Common Mistakes to Avoid

❌ **Too vague**: "A nice office"
✅ **Better**: "Modern office with natural light, clean desks, plants, professional atmosphere"

❌ **Too complex**: "An office with exactly 3 people at desks with laptops showing code and a whiteboard with diagrams and a plant in a blue pot..."
✅ **Better**: "Team of professionals working in modern office, laptops and whiteboard visible, plants, clean aesthetic"

❌ **Missing style**: "A logo for a tech company"
✅ **Better**: "Minimalist geometric logo for tech company, clean lines, blue tones, modern professional style"

❌ **Wrong aspect ratio**: Generating 1:1 image for hero section
✅ **Better**: Use 16:9 for hero sections

## Workflow

1. **Read memory** - Understand brand guidelines and preferences
2. **Determine if generation is needed** - Can stock photos work?
3. **Craft detailed prompt** - Use the formula above
4. **Select appropriate aspect ratio** - Based on usage
5. **Generate image(s)** - Use the `generateImages` tool
6. **Update memory** - Document what was generated and why
7. **Report back** - List generated images with descriptions

## Reporting Results

When reporting generation completion:
```
Generated 3 custom images:
1. Hero image (16:9): Modern office scene with collaborative team
2. Abstract background (16:9): Geometric pattern in brand colors
3. Icon set (1:1): 5 minimalist icons for features section

All images follow the brand guidelines with blue/teal color scheme
and maintain a professional, modern aesthetic.
```

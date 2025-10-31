---
name: generateImages
description: Create custom AI-generated images with detailed prompts
---

# generateImages

Create custom AI-generated images with detailed prompts.

## Overview

Generate unique images using AI based on detailed descriptions. Use for branded imagery, custom illustrations, or specific artistic visions.

## Parameters

- `prompt` (required) - Detailed description of desired image
- `aspectRatio` (optional) - Image dimensions (16:9, 1:1, 3:4, 9:16)
- (Optional) Additional parameters for style, quality, etc.

## Prompt Formula

Structure prompts with these elements:
```
[Subject] + [Style] + [Details] + [Composition] + [Lighting] + [Mood]
```

### Prompt Components

1. **Subject**: What's in the image
2. **Style**: Visual aesthetic (photography, illustration, 3D, abstract)
3. **Details**: Colors, textures, materials, objects
4. **Composition**: Camera angle, framing, layout
5. **Lighting**: Light quality, time of day, direction
6. **Mood**: Emotional tone, atmosphere

## Aspect Ratio Selection

- **16:9** - Hero sections, banners, desktop backgrounds
- **1:1** - Social media, profile images, product tiles, grids
- **3:4** - Mobile hero, vertical cards, magazine layouts
- **9:16** - Mobile screens, stories, vertical banners

## Examples

### Logo/Brand Mark
```
"A minimalist geometric logo featuring a stylized mountain peak, clean lines, modern design, blue and white color scheme, professional and trustworthy feeling, simple flat design, vector style, on white background"
```

### Hero Image - Tech Startup
```
"Modern office workspace with diverse team collaborating, bright natural lighting from large windows, clean minimal aesthetic, laptops and monitors visible, professional yet friendly atmosphere, slightly elevated camera angle, vibrant but not oversaturated colors"
```

### Abstract Background
```
"Abstract geometric pattern with soft gradient background, subtle blend of blue and purple tones, minimal design, smooth flowing shapes, professional and modern feel, suitable for web background, low contrast for text overlay"
```

### Product Illustration
```
"3D rendered laptop computer on a clean desk, isometric view, soft shadows, pastel color scheme with white and light blue, minimalist style, no background clutter, modern and professional aesthetic, studio lighting"
```

## Style Keywords

### Visual Styles
- Photography: "photorealistic", "DSLR quality", "professional photography"
- Illustration: "flat design", "vector art", "illustrated style"
- 3D: "3D render", "isometric", "low poly", "smooth 3D"
- Abstract: "geometric abstract", "fluid shapes", "minimal abstract"
- Artistic: "watercolor", "sketch", "hand-drawn", "artistic"

### Aesthetic Moods
- Professional: "clean", "minimal", "corporate", "polished"
- Creative: "vibrant", "artistic", "bold", "dynamic"
- Friendly: "warm", "approachable", "welcoming", "casual"
- Modern: "contemporary", "sleek", "cutting-edge", "trendy"
- Elegant: "sophisticated", "refined", "premium", "luxurious"

## Quality Checklist

Before submitting prompt, ensure:
- [ ] Subject clearly described
- [ ] Style specified
- [ ] Colors mentioned
- [ ] Composition/angle indicated
- [ ] Mood/atmosphere defined
- [ ] Aspect ratio appropriate
- [ ] Prompt detailed but not overly complex
- [ ] Brand guidelines considered (if applicable)

## Common Mistakes to Avoid

❌ Too vague: "A nice office"
✅ Better: "Modern office with natural light, clean desks, plants, professional atmosphere"

❌ Too complex: "An office with exactly 3 people at desks with laptops showing code..."
✅ Better: "Team of professionals working in modern office, laptops visible, plants"

❌ Missing style: "A logo for a tech company"
✅ Better: "Minimalist geometric logo for tech, clean lines, blue tones, modern professional"

❌ Wrong aspect ratio: Generating 1:1 for hero section
✅ Better: Use 16:9 for hero sections

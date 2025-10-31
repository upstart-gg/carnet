---
name: theme-color-theory
description: Understanding OKLCH color space and creating harmonious color schemes for themes. Use when selecting colors for themes or explaining color choices.
toolsets: []
---

# Theme Color Theory

## OKLCH Color Space

OKLCH is the preferred color notation for themes because it's perceptually uniform - changes in values produce consistent visual changes.

### OKLCH Format
`oklch(L C H)` where:
- **L** (Lightness): 0 to 1 (0 = black, 1 = white)
- **C** (Chroma): 0 to ~0.4 (0 = grayscale, higher = more saturated)
- **H** (Hue): 0 to 360 (color angle on the color wheel)

### Hue Reference
- 0° / 360° - Red
- 30° - Orange
- 60° - Yellow
- 120° - Green
- 180° - Cyan
- 220° - Blue
- 270° - Purple
- 300° - Magenta

## Color Harmony Strategies

### Analogous Colors
Colors adjacent on the color wheel (within 30-60° of each other).
Creates calm, cohesive designs.

```json
{
  "primary": "oklch(0.55 0.20 220)",   // Blue
  "secondary": "oklch(0.50 0.18 250)", // Blue-purple
  "accent": "oklch(0.60 0.18 190)"     // Cyan-blue
}
```

### Complementary Colors
Colors opposite on the color wheel (180° apart).
Creates vibrant, high-contrast designs.

```json
{
  "primary": "oklch(0.55 0.22 250)",  // Blue
  "accent": "oklch(0.70 0.20 70)"     // Yellow-orange
}
```

### Triadic Colors
Three colors evenly spaced (120° apart).
Creates balanced, colorful designs.

```json
{
  "primary": "oklch(0.55 0.20 0)",    // Red
  "secondary": "oklch(0.55 0.20 120)", // Green
  "accent": "oklch(0.55 0.20 240)"    // Blue
}
```

### Monochromatic
Same hue with different lightness and chroma.
Creates sophisticated, cohesive designs.

```json
{
  "primary": "oklch(0.50 0.22 220)",   // Dark saturated blue
  "secondary": "oklch(0.60 0.18 220)", // Medium blue
  "accent": "oklch(0.75 0.12 220)"     // Light blue
}
```

## Creating Light Themes

### Primary Brand Color
- Lightness: 0.45-0.60 (medium)
- Chroma: 0.15-0.25 (moderately saturated)
- Hue: Based on brand

Example: `oklch(0.55 0.20 220)` - medium blue

### Base Colors
- `base100`: `oklch(0.98 0.01 H)` - near white, main background
- `base200`: `oklch(0.95 0.01 H)` - slightly darker, cards/elevated surfaces
- `base300`: `oklch(0.92 0.02 H)` - even darker, borders/dividers

Use same or similar hue as primary for cohesion.

### Semantic Colors
- `info`: `oklch(0.60 0.15 220)` - blue
- `success`: `oklch(0.65 0.15 150)` - green
- `warning`: `oklch(0.75 0.15 80)` - yellow
- `error`: `oklch(0.60 0.20 25)` - red

## Creating Dark Themes

### Primary Brand Color
- Lightness: 0.60-0.75 (brighter than light theme)
- Chroma: 0.18-0.25 (similar saturation)
- Hue: Same as light theme

Example: `oklch(0.65 0.20 220)` - brighter blue for dark background

### Base Colors
- `base100`: `oklch(0.15 0.01 H)` - near black, main background
- `base200`: `oklch(0.18 0.01 H)` - slightly lighter, cards/elevated surfaces
- `base300`: `oklch(0.22 0.02 H)` - even lighter, borders/dividers

**Important**: In dark themes, elevated surfaces are **lighter**, not darker!

### Semantic Colors
Slightly brighter than light theme versions:
- `info`: `oklch(0.65 0.15 220)`
- `success`: `oklch(0.70 0.15 150)`
- `warning`: `oklch(0.80 0.15 80)`
- `error`: `oklch(0.65 0.20 25)`

## Contrast & Accessibility

### Minimum Contrast Ratios (WCAG)
- Normal text: 4.5:1
- Large text (18pt+): 3:1
- UI components: 3:1

### Testing Contrast
The system auto-generates `-content` colors (text colors) that provide sufficient contrast. Trust this system.

### Tips for Good Contrast
1. **Light themes**: Use lightness 0.45-0.60 for colors on white background
2. **Dark themes**: Use lightness 0.60-0.75 for colors on dark background
3. **High chroma reduces perceived lightness** - adjust accordingly

## Common Color Combinations

### Professional Blue
```json
{
  "primary": "oklch(0.50 0.20 230)",     // Professional blue
  "secondary": "oklch(0.45 0.15 200)",   // Deeper blue
  "accent": "oklch(0.65 0.18 180)",      // Cyan accent
  "neutral": "oklch(0.40 0.02 230)"      // Blue-gray
}
```

### Vibrant Startup
```json
{
  "primary": "oklch(0.60 0.25 300)",     // Vibrant magenta
  "secondary": "oklch(0.55 0.22 260)",   // Purple
  "accent": "oklch(0.70 0.20 60)",       // Yellow
  "neutral": "oklch(0.45 0.05 280)"      // Purple-gray
}
```

### Natural Green
```json
{
  "primary": "oklch(0.55 0.18 150)",     // Natural green
  "secondary": "oklch(0.50 0.15 170)",   // Teal
  "accent": "oklch(0.70 0.15 80)",       // Warm yellow
  "neutral": "oklch(0.40 0.03 150)"      // Green-gray
}
```

### Elegant Dark
```json
{
  "primary": "oklch(0.65 0.18 30)",      // Warm orange
  "secondary": "oklch(0.55 0.15 350)",   // Deep red
  "accent": "oklch(0.75 0.12 60)",       // Gold
  "neutral": "oklch(0.45 0.02 30)"       // Warm gray
}
```

## Tips for Color Selection

1. **Start with brand colors** - If user has brand colors, match them in OKLCH
2. **Consider the industry**:
   - Tech: Blues, purples, teals
   - Finance: Blues, grays, dark greens
   - Creative: Vibrant, bold colors
   - Health: Greens, blues, calm colors
   - Food: Warm colors (reds, oranges, yellows)

3. **Match the mood**:
   - Professional: Low chroma (0.10-0.18), blues/grays
   - Playful: High chroma (0.20-0.30), varied hues
   - Elegant: Medium chroma (0.15-0.20), sophisticated hues

4. **Test readability** - Ensure text is readable on all backgrounds

5. **Provide alternatives** - Create 2-3 theme variations for user to choose

## Explaining Color Choices

When reporting theme creation, explain:
- The harmony strategy used (analogous, complementary, etc.)
- Why these colors match the brand/industry/mood
- How the colors work together
- Any accessibility considerations

Example:
"I've created a theme using an analogous color harmony with blues and teals, which conveys professionalism and trust - perfect for a financial services company. The primary blue is vibrant enough for call-to-actions while maintaining corporate credibility."

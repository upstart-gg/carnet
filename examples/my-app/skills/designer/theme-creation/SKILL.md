---
name: theme-creation
description: Creating and editing theme JSON files with proper structure, validation, and git workflow. Use when creating new themes or modifying existing ones.
toolsets:
  - virtual-filesystem
  - diagnostics
---

# Theme Creation

## Overview
Themes are JSON files that control colors, fonts, and UI style for the entire website. Themes are located in `./app/themes/` directory.

## Theme Structure

A theme must comply with this JSON schema shape:

```json
{{ THEME_JSON_SCHEMA }}
```

## Theme Components

### Theme Identity
- `id` - Unique identifier (kebab-case)
- `name` - Display name
- `description` - Brief description
- `tags` - Array of descriptive tags (e.g., ["dark", "minimal", "professional"])
- `browserColorScheme` - Either "light" or "dark"

### Colors
Required color keys:
- `primary` - Main brand color (for CTAs and important actions)
- `secondary` - Secondary brand color
- `accent` - Accent color (for highlights and special elements)
- `neutral` - Neutral color (for borders, dividers)
- Semantic colors: `info`, `success`, `warning`, `error`
- Base surfaces: `base100` (main background), `base200` (elevated), `base300` (more elevated)

### Typography
- `base` - Root font size in pixels (typically 16)
- `heading` - Font for headings (can be stack, google, or theme)
- `body` - Font for body text (can be stack, google, or theme)

## Creating a New Theme

### Workflow:

1. **Read memory** to understand brand guidelines and user preferences
2. **Create theme file** in `./app/themes/` with descriptive name (e.g., `modern-blue.json`)
3. **Validate with lint** tool
4. **Commit** changes

### Example:

```json
{
  "id": "modern-blue",
  "name": "Modern Blue",
  "description": "A clean, modern theme with blue accents",
  "tags": ["modern", "professional", "blue", "light"],
  "browserColorScheme": "light",
  "colors": {
    "primary": "oklch(0.55 0.20 250)",
    "secondary": "oklch(0.45 0.15 270)",
    "accent": "oklch(0.65 0.18 180)",
    "neutral": "oklch(0.35 0.02 270)",
    "base100": "oklch(0.98 0.01 270)",
    "base200": "oklch(0.95 0.01 270)",
    "base300": "oklch(0.92 0.02 270)",
    "info": "oklch(0.60 0.15 220)",
    "success": "oklch(0.65 0.15 150)",
    "warning": "oklch(0.75 0.15 80)",
    "error": "oklch(0.60 0.20 25)"
  },
  "typography": {
    "base": 16,
    "heading": {
      "type": "google",
      "family": "Inter"
    },
    "body": {
      "type": "google",
      "family": "Inter"
    }
  }
}
```

## Editing an Existing Theme

### Workflow:

1. **Find the theme** file in `./app/themes/`
2. **Read the theme** using `readFile`
3. **Make changes** using `replaceInFile` or `patch`
4. **Validate with lint** tool
5. **Commit** changes

## Color Guidelines

### Use OKLCH Format
Prefer OKLCH notation: `oklch(L C H)` where:
- L = Lightness (0-1)
- C = Chroma/saturation (0-0.4)
- H = Hue angle (0-360)

### Base Colors
- `base100` should be near-white for light themes (`oklch(0.98 0.01 H)`)
- `base100` should be near-black for dark themes (`oklch(0.15 0.01 H)`)
- `base200` and `base300` create elevation layers:
  - Light themes: progressively darker
  - Dark themes: progressively lighter

### Brand Colors
- `primary` is the main brand color (use for CTAs)
- Keep it vibrant but not overwhelming
- Ensure good contrast with text

## Font Options

### Stack (Generic Font Families)
```json
"heading": {
  "type": "stack",
  "family": "sans-serif"  // or "serif", "monospace"
}
```

### Google Fonts
```json
"heading": {
  "type": "google",
  "family": "Roboto"  // Any Google Font name
}
```

### Theme-Specific Fonts
```json
"heading": {
  "type": "theme",
  "family": "custom-font-name"
}
```

## Common Theme Patterns

### Light Professional Theme
```json
{
  "browserColorScheme": "light",
  "colors": {
    "primary": "oklch(0.50 0.20 230)",
    "base100": "oklch(0.98 0.01 230)",
    "base200": "oklch(0.95 0.01 230)",
    "base300": "oklch(0.92 0.02 230)"
  }
}
```

### Dark Minimal Theme
```json
{
  "browserColorScheme": "dark",
  "colors": {
    "primary": "oklch(0.65 0.20 250)",
    "base100": "oklch(0.15 0.01 250)",
    "base200": "oklch(0.18 0.01 250)",
    "base300": "oklch(0.22 0.02 250)"
  }
}
```

### Vibrant Colorful Theme
```json
{
  "browserColorScheme": "light",
  "colors": {
    "primary": "oklch(0.55 0.25 340)",
    "secondary": "oklch(0.50 0.22 180)",
    "accent": "oklch(0.70 0.20 60)",
    "base100": "oklch(0.99 0.00 0)"
  }
}
```

## Tagging Guidelines

Use descriptive tags to help discovery:
- Style: "modern", "classic", "minimal", "vibrant"
- Tone: "professional", "playful", "elegant", "bold"
- Color: "dark", "light", "colorful", "monochrome"
- Use case: "corporate", "creative", "tech", "e-commerce"

## Best Practices

1. **Start with user preferences** - Ask about brand colors, style
2. **Maintain good contrast** - Ensure readability
3. **Use OKLCH for consistency** - Better than hex or RGB
4. **Test on light and dark modes** - Set `browserColorScheme` correctly
5. **Provide all required colors** - Schema validator requires all keys
6. **Choose appropriate fonts** - Match the brand's personality
7. **Document reasoning** - Update memory with design decisions
8. **Always lint after creating/editing**
9. **Always commit with descriptive message**

## Reverting Changes

If you need to undo changes:
1. Use `gitLog` to see commit history
2. Use `revert` tool with the commit ID to restore previous version

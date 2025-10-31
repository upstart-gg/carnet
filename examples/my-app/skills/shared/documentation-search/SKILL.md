---
name: documentation-search
description: Searching through Upstart platform, React Router, and DaisyUI documentation for implementation details and best practices.
toolsets:
  - documentation-search
---

# Documentation Search

## Available Documentation Tools

### Upstart Platform
- `askUpstartExpert` - Ask an Upstart Platform expert for complex questions about architecture, best practices, pages, layouts, components, themes, datasources, forms schemas, and more

### React Router
- `search_react_router_documentation` - Semantically search within React Router docs
- `search_react_router_code` - Search for exact code matches in React Router docs

### DaisyUI
- `search_daisyui_documentation` - Semantically search within DaisyUI docs
- `search_daisyui_code` - Search for exact code matches in DaisyUI docs

## Usage Guidelines

### Generic Search
Begin with `search_*_documentation` using semantic queries to find relevant concepts or components.

**Examples:**
- "How do I create a dropdown menu?"
- "What are the navigation patterns?"
- "How do I style buttons?"

### Code Search
Use `search_*_code` when you know what you're looking for and need specific implementation examples. This is best for finding precise usage of a function or prop.

**Examples:**
- "NavLink className"
- "useLoaderData example"
- "btn-primary"

## Important Notes

- **Upstart Platform** is the primary framework and uses React Router v7 in *data mode* with some important differences from standard React Router usage
- Always prioritize Upstart Platform documentation for platform-specific features
- Use React Router and DaisyUI docs for understanding underlying technologies
- When in doubt about Upstart-specific behavior, use `askUpstartExpert`

## Search Strategy

1. **Start specific**: If you know exactly what you need, search for it directly
2. **Broaden if needed**: If specific search fails, try more general terms
3. **Cross-reference**: Sometimes combining insights from multiple docs is helpful
4. **Verify compatibility**: Ensure React Router patterns align with Upstart's data mode

## Examples

**Finding a Component:**
```
1. search_daisyui_documentation: "modal component"
2. search_daisyui_code: "modal" (for exact implementation)
```

**Understanding Routing:**
```
1. askUpstartExpert: "How does routing work in Upstart?"
2. search_react_router_documentation: "data router" (for deeper understanding)
```

**Styling Components:**
```
1. search_daisyui_documentation: "button styles"
2. search_daisyui_code: "btn-" (to see all button variants)
```

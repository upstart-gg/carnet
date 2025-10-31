---
name: delegation-strategy
description: How to delegate tasks to specialist agents (Coder, Designer, Data Architect). Use when planning which agent should handle specific tasks and in what order.
toolsets:
  - delegation
---

# Delegation Strategy

## Your Team (Internal Only)

You manage specialist agents behind the scenes:
- **Coder Agent**: Writes and updates website structure (has memory access)
- **Designer Agent**: Creates themes and finds images (has memory access)
- **Data Architect Agent**: Manages datasources and schemas (has memory access)

**Users must never be aware of these agents or the delegation process.**

## Available Delegation Tools

- `delegateToCoder` - Delegate code generation, component creation, and development tasks
- `delegateToDesigner` - Delegate theme creation, image search, and design tasks
- `delegateToDataArchitect` - Delegate datasource schema design and form creation

## When to Delegate to Each Agent

### Coder Agent
Delegate when you need:
- Creating or modifying pages (homepage, about, contact, etc.)
- Creating or updating components (navbar, footer, hero, cards, etc.)
- Creating or modifying layouts
- Building forms on pages
- Implementing any code-based functionality
- Using existing datasources or forms schemas in the UI

### Designer Agent
Delegate when you need:
- Creating or editing themes (colors, fonts, branding)
- Finding stock images for the website
- Generating custom images with AI

### Data Architect Agent
Delegate when you need:
- Creating datasource schemas (for storing data like blog posts, products, etc.)
- Creating forms schemas (for collecting user input like contact forms, signups)
- Modifying existing schemas (backward-compatible changes only)

## Delegation Sequence Patterns

### New Website Sequence
1. **Designer** (theme + images) AND **Data Architect** (datasources + schemas) **in parallel**
2. **Wait for both to complete**
3. **Coder** builds homepage
4. **Coder** builds secondary pages

### Editing Existing Website
1. **Identify specific changes** needed
2. **Check dependencies**: Does Coder need Data Architect to finish first?
3. **Delegate to appropriate agents** in the correct order

### Complex Feature Addition
Example: Adding a blog section
1. **Data Architect**: Create blog posts datasource
2. **Wait for completion**
3. **Coder**: Create blog listing page and detail page
4. **Designer** (if needed): Find blog-related images

## Delegation Guidelines

### Provide Full Context
Specialist agents do not have access to user conversation. When delegating, you MUST provide:
- Complete requirements from the user
- Relevant decisions from memory
- Any constraints or preferences
- Dependencies they should be aware of

### Delegate, Don't Micromanage
- Define the **desired outcome**, not exact steps
- Trust specialists to use their skills
- Let them make technical decisions within their domain

**Good delegation:**
```
Task: "Create a pricing page section with three pricing tiers. The user wants a modern, clean look with clear call-to-action buttons."
```

**Bad delegation:**
```
Task: "Add a box, then add three columns, then add text elements..."
```

### Check Dependencies

**Before delegating to Coder, ask:**
- Does this need datasources? → Data Architect first
- Does this need forms schemas? → Data Architect first
- Does this need images? → Designer first (or let Coder proceed without)
- Does this need a specific theme? → Designer first

**Coder can only use what exists** - they cannot create datasources, schemas, or themes.

## Handling Agent Responses

When an agent reports completion:
1. Read their summary and results
2. Update memory with what was completed
3. Proceed to next step or delegate to next agent
4. Translate technical updates to user-friendly language

When an agent reports failure:
1. Analyze the blocker
2. Check if you need to delegate to another agent first
3. Provide missing context or dependencies
4. Retry or adjust the plan

## Examples

### Example 1: New Restaurant Website
```
User: "I need a website for my restaurant"

Plan:
1. Designer (theme with warm colors) + Data Architect (menu datasource) [PARALLEL]
2. Coder (homepage with hero, about section, call to action)
3. Coder (menu page using menu datasource)
4. Coder (contact page)
```

### Example 2: Adding Newsletter Signup
```
User: "Add a newsletter signup form"

Plan:
1. Data Architect (create newsletter-signups forms schema)
2. Coder (add newsletter form to homepage footer)
```

### Example 3: Redesigning Look
```
User: "I want a darker, more professional look"

Plan:
1. Designer (create new dark theme based on user preferences)
2. Done (theme changes apply automatically, no code changes needed)
```

## Remember

- **Users should never know** about the delegation process
- Always provide **full context** to specialist agents
- Check **dependencies** before delegating
- Respect each agent's **domain expertise**
- **Translate** their work into user-friendly updates

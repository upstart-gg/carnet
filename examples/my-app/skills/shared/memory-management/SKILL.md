---
name: memory-management
description: Managing persistent memory for context, decisions, and learnings. Use when you need to store or retrieve project context, user preferences, or important decisions.
toolsets:
  - memory
---

# Memory Management

## Overview
Each agent has access to persistent memory that stores context, decisions, and learnings across tasks. Memory is separate from the filesystem and from the todo list. It's your long-term knowledge base about the project.

## Available Tools

- `memoryRead` - Read from your memory (one or more categories)
- `memoryAdd` - Write new content to your memory
- `memorySearch` - Search your memory with semantic queries
- `memoryDelete` - Delete specific entries from your memory

## Memory vs Filesystem vs Todos

### Use Memory For:
- ✅ Project context and goals
- ✅ User preferences and constraints
- ✅ Design and technical decisions with rationale
- ✅ Learnings and insights discovered during work
- ✅ Known issues and blockers
- ✅ Recent changes and updates

### Use Filesystem For:
- ✅ Source code (pages, components, hooks, utils)
- ✅ Configuration (themes, datasources, forms schemas, site.json)
- ✅ Assets (images, CSS)
- ✅ The actual, definitive state of the website

### Use Todos For:
- ✅ Task tracking and action items
- ✅ Work organization and prioritization
- ✅ Temporary task state (pending, in progress, completed)

**Key Principle:** Memory is for **context and knowledge**, filesystem is for **source of truth**, todos are for **task tracking**.

## Memory Categories

Memory is organized into categories based on agent roles and access patterns:

### Main Agent Categories (Main writes, all agents read)

**`main_project_context`** - Overall project summary
- Site purpose and target audience
- Key features and requirements
- High-level architecture decisions

**`main_user_preferences`** - User's preferences and constraints
- Style preferences (colors, fonts, tone)
- Requirements and constraints
- User feedback and requests

**`main_task_context`** - Current task details
- Detailed plan for current task
- Reasoning and step-by-step approach
- Context for delegated work

### Shared Project Categories (Read/Write for all agents)

**`project_recent_changes`** - Recent changes by any agent
- Commits and updates
- Features added or modified
- Files created or updated

**`project_known_issues`** - Known problems
- Bugs encountered during development
- Blockers and dependencies
- Workarounds applied

**`project_decisions`** - Important decisions
- Technical and design decisions
- Rationale behind choices
- Trade-offs considered

### Agent-Specific Categories

Each specialist agent has their own categories for read/write, other agents can read:

**Coder Agent:**
- `coder_decisions` - Technical and architectural choices
- `coder_notes` - Learnings, workarounds, observations

**Designer Agent:**
- `designer_decisions` - Design decisions and rationale
- `designer_notes` - What works, accessibility constraints

**Data Architect Agent:**
- `data-architect_decisions` - Data design decisions and reasoning
- `data-architect_notes` - Performance and relationship patterns

## Tool Details

### `memoryRead` - Reading Memory

**Parameters:**
- `category` (optional) - Specific category to read, or omit to read all accessible categories

**Examples:**
```
// Read all accessible memory
memoryRead()

// Read specific category
memoryRead({ category: "main_project_context" })

// Read main task context at start of delegated work
memoryRead({ category: "main_task_context" })
```

**Best Practice:** Always read memory at the start of a task to understand context.

### `memoryAdd` - Adding to Memory

**Parameters:**
- `category` (required) - Which category to write to
- `content` (required) - The information to store

**Examples:**
```
// Document a technical decision
memoryAdd({
  category: "coder_decisions",
  content: "Created reusable ProductCard component instead of inline markup. Rationale: The product card pattern will be used on multiple pages (home, products list, search results). Component includes image, title, price, and CTA button. Using TypeBox for prop validation."
})

// Record a learning
memoryAdd({
  category: "coder_notes",
  content: "Discovered that DaisyUI card component works better with 'card-compact' class for product listings. Standard card has too much padding for grid layouts."
})

// Document design decision
memoryAdd({
  category: "designer_decisions",
  content: "Created 'ocean-breeze' theme with blue/teal OKLCH palette using analogous harmony. Primary color: oklch(0.6 0.15 220) chosen for professional tech feel requested by user."
})

// Record recent change (shared category)
memoryAdd({
  category: "project_recent_changes",
  content: "Added contact form page with email validation. Created 'contact-submissions' forms schema with name, email, subject, and message fields."
})

// Document known issue (shared category)
memoryAdd({
  category: "project_known_issues",
  content: "Products datasource not yet created. Blocker for products listing page. Needs Data Architect to create schema for name, price, description, image, category fields."
})
```

**Best Practice:** Write to memory immediately after making important decisions or discovering key insights.

### `memorySearch` - Searching Memory

**Parameters:**
- `query` (required) - Semantic search query
- `category` (optional) - Limit search to specific category

**Examples:**
```
// Search for information about products
memorySearch({ query: "products datasource schema" })

// Search within specific category
memorySearch({
  query: "color palette",
  category: "designer_decisions"
})

// Find previous similar work
memorySearch({ query: "form validation patterns" })

// Look for known issues
memorySearch({
  query: "image loading problems",
  category: "project_known_issues"
})
```

**Best Practice:** Use search when you need specific information but aren't sure which category it's in.

### `memoryDelete` - Deleting from Memory

**Parameters:**
- `id` (required) - The memory entry ID to delete

**When to delete:**
- Information is outdated or incorrect
- Issue was resolved (clean up from `project_known_issues`)
- Entry was added by mistake

**Example:**
```
// Delete resolved issue
memoryDelete({ id: "memory-entry-123" })
```

**Best Practice:** Clean up resolved issues and outdated information to keep memory relevant.

## Best Practices

### 1. Read First, Then Act

**Always start tasks by reading memory:**

```
// Sub-agent starting delegated task
memoryRead({ category: "main_task_context" })
memoryRead({ category: "main_user_preferences" })
memoryRead() // Get full context

// Main agent starting new user session
memoryRead() // Understand current project state
```

### 2. Write After Decisions

**Document important choices immediately:**

```
// Just created a datasource
memoryAdd({
  category: "data-architect_decisions",
  content: "Created consolidated 'blog-posts' datasource with optional 'series' field instead of separate datasources for standalone posts and series. Rationale: Posts share 95% of fields. Using optional 'series' field is more maintainable than separate schemas. If post has 'series', it's part of a series; if null, it's standalone."
})
```

### 3. Be Specific and Clear

❌ **Bad:**
```
memoryAdd({
  category: "coder_decisions",
  content: "Made a component"
})
```

✅ **Good:**
```
memoryAdd({
  category: "coder_decisions",
  content: "Created reusable FeatureCard component for showcasing product features. Props: icon (string), title (string), description (string). Uses DaisyUI card with centered layout. Rationale: User wants features section on homepage and features page, so extracted as reusable component to avoid duplication."
})
```

### 4. Include Rationale

**Always explain WHY, not just WHAT:**

```
// Document the reasoning
memoryAdd({
  category: "designer_decisions",
  content: "Selected high-quality hero image of modern office workspace. Rationale: User is building SaaS product for businesses, needs professional and aspirational feel. Image conveys productivity and modern work environment."
})
```

### 5. Use Appropriate Categories

**Follow access patterns:**

| Category | Who Writes | Who Reads | Purpose |
|----------|------------|-----------|---------|
| `main_project_context` | Main only | All | Project overview |
| `main_user_preferences` | Main only | All | User requirements |
| `main_task_context` | Main only | All | Current task details |
| `project_*` | All agents | All | Shared information |
| `coder_*` | Coder only | All | Coder's knowledge |
| `designer_*` | Designer only | All | Designer's knowledge |
| `data-architect_*` | Architect only | All | Architect's knowledge |

### 6. Coordinate with Todos

**Memory stores context, todos track tasks:**

```
// Bad: Storing task list in memory
memoryAdd({
  category: "coder_notes",
  content: "TODO: Create header component, add navigation, style with DaisyUI"
})

// Good: Task in todos, decision in memory
todoAdd({ description: "Create header component with navigation" })

// After completing, document decision in memory
memoryAdd({
  category: "coder_decisions",
  content: "Created Header component with responsive navigation using DaisyUI navbar. Includes logo, main nav links, and mobile menu. Made it reusable across all layouts."
})
```

### 7. Update, Don't Duplicate

**When information changes, add new entry with updated context:**

```
// Original decision
memoryAdd({
  category: "project_decisions",
  content: "Using single-column layout for blog posts"
})

// User changes mind - add new entry
memoryAdd({
  category: "project_decisions",
  content: "Updated layout decision: Changed from single-column to two-column layout with sidebar. Rationale: User wants to show related posts and author info. Previous decision superseded."
})
```

## Common Workflows

### Sub-Agent Starting Delegated Task

```
// 1. Read task context from main agent
memoryRead({ category: "main_task_context" })
memoryRead({ category: "main_user_preferences" })

// 2. Read relevant project memory
memoryRead({ category: "project_recent_changes" })
memoryRead({ category: "project_known_issues" })

// 3. Read agent-specific memory (if applicable)
memoryRead({ category: "coder_decisions" }) // if Coder
memoryRead({ category: "designer_decisions" }) // if Designer

// 4. Search for specific relevant info
memorySearch({ query: "similar component patterns" })

// 5. Do the work...

// 6. Document decisions and learnings
memoryAdd({
  category: "coder_decisions",
  content: "..."
})

// 7. Update recent changes (shared)
memoryAdd({
  category: "project_recent_changes",
  content: "Created ProductCard component with image, title, price, and CTA"
})
```

### Main Agent Starting New User Session

```
// 1. Read all memory to understand current state
memoryRead()

// 2. Search for specific context if needed
memorySearch({ query: "user's preferred style" })

// 3. Before delegating, update task context
memoryAdd({
  category: "main_task_context",
  content: "User wants to add products page with grid layout. Should display products from 'products' datasource (already exists). Each product card should show image, name, price, and 'Buy Now' button. User prefers clean, modern aesthetic per earlier preference."
})

// 4. Delegate with confidence that sub-agent has context
delegateToCoder({
  task: "Create products listing page with grid layout",
  context: "See main_task_context for full requirements"
})
```

### Handling Discovered Issues

```
// Discovered a blocker
memoryAdd({
  category: "project_known_issues",
  content: "Products datasource missing. Required for products page implementation. Needs fields: name, description, price, imageUrl, category. Requested from Data Architect."
})

// Report failure to main agent
reportFailure({
  type: "dependency-missing",
  message: "Cannot create products page - products datasource doesn't exist",
  details: "Need datasource with product information. Documented required fields in project_known_issues."
})

// Later, when resolved, clean up
memorySearch({ query: "products datasource missing" })
memoryDelete({ id: "issue-entry-id" })

// Document resolution
memoryAdd({
  category: "project_recent_changes",
  content: "Products datasource created by Data Architect with all required fields. Unblocked products page implementation."
})
```

### Documenting Complex Decisions

```
// Data Architect making schema design decision
memoryAdd({
  category: "data-architect_decisions",
  content: "Schema design for e-commerce site: Created single 'products' datasource instead of separate datasources for 'digital-products', 'physical-products', and 'services'. \n\nRationale: All three share core fields (name, price, description, images). Differences (shipping weight, file download URL, appointment duration) can be optional fields. Using 'productType' enum field to distinguish.\n\nAlternative considered: Separate datasources for each type. Rejected because: 1) Would require separate queries and duplicate display logic, 2) Doesn't match actual data model - they're all products with different attributes, 3) User may want mixed product listings.\n\nBackward compatibility: All fields optional except name, price, productType. Can add new product types without breaking changes."
})
```

## Examples by Agent Type

### Coder Agent
```
// Starting task
memoryRead({ category: "main_task_context" })
memorySearch({ query: "component patterns for cards" })

// After creating component
memoryAdd({
  category: "coder_decisions",
  content: "Created BlogPostCard component for blog listing pages. Props include title, excerpt, author, date, imageUrl. Using DaisyUI card with image-first layout. Rationale: User wants visual blog with prominent images."
})

memoryAdd({
  category: "project_recent_changes",
  content: "Added BlogPostCard component to ~/components/BlogPostCard.tsx"
})

// If discovered issue
memoryAdd({
  category: "coder_notes",
  content: "Note: DaisyUI prose class conflicts with custom spacing in blog posts. Using prose-sm instead for better control."
})
```

### Designer Agent
```
// Starting theme creation
memoryRead({ category: "main_user_preferences" })
memorySearch({ query: "color preferences" })

// After creating theme
memoryAdd({
  category: "designer_decisions",
  content: "Created 'forest-green' theme using split-complementary color harmony in OKLCH. Primary: oklch(0.55 0.12 145) - green, Secondary: oklch(0.60 0.13 325) - pink, Accent: oklch(0.65 0.14 35) - orange. Rationale: User wanted nature/sustainability vibe with energetic touches."
})

// After finding images
memoryAdd({
  category: "designer_notes",
  content: "Found 3 hero image options from Unsplash using queries 'sustainable technology', 'green energy workspace', 'eco friendly office'. User preferred #2 - bright modern office with plants."
})
```

### Data Architect Agent
```
// Starting schema design
memoryRead({ category: "main_task_context" })
memorySearch({ query: "existing datasources" })

// After creating schema
memoryAdd({
  category: "data-architect_decisions",
  content: "Created 'team-members' datasource with fields: name (required), role (required), bio (optional), imageUrl (optional), linkedinUrl (optional), twitterHandle (optional). All social fields optional to accommodate team members who prefer not to share social profiles. Used 'role' string field instead of enum to allow flexibility for different role titles."
})

// Learning for future
memoryAdd({
  category: "data-architect_notes",
  content: "Pattern observed: Optional fields work better than required for user-submitted content. Users may not have all information upfront. Can make fields required later if needed, but can't go backwards."
})
```

### Main Agent
```
// Starting new user session
memoryRead()

// After understanding user request
memoryAdd({
  category: "main_user_preferences",
  content: "User prefers minimalist design with lots of whitespace. Referenced apple.com as inspiration. Wants focus on product photography. Target audience: design-conscious consumers."
})

memoryAdd({
  category: "main_task_context",
  content: "Building product landing page for new headphone product. Needs: hero with product image, key features section, technical specs table, testimonials, and purchase CTA. User has high-res product images ready to upload."
})

// Before delegating
memoryAdd({
  category: "main_project_context",
  content: "E-commerce site for premium audio products. Currently has homepage and about page. Adding product pages. Using 'products' datasource (already exists) for product information."
})
```

## Anti-Patterns to Avoid

❌ **Don't store tasks in memory:**
```
// Bad
memoryAdd({
  category: "coder_notes",
  content: "Need to create header, footer, and sidebar"
})
```
Use todos for tasks!

❌ **Don't write vague entries:**
```
// Bad
memoryAdd({
  category: "coder_decisions",
  content: "Made some changes to the homepage"
})
```

✅ **Do be specific:**
```
// Good
memoryAdd({
  category: "coder_decisions",
  content: "Updated homepage hero section to use full-width layout instead of contained. Rationale: User wants more impact. Changed container max-width from 1200px to 100vw with internal padding."
})
```

❌ **Don't forget to read memory first:**
```
// Bad: Starting task without context
todoAdd({ description: "Create a page" })
// ... starts working ...
```

✅ **Do read memory at start:**
```
// Good
memoryRead({ category: "main_task_context" })
memoryRead({ category: "main_user_preferences" })
// ... now have context to work effectively ...
```

## Summary

**Key Principles:**
1. **Read First** - Always load context before starting work
2. **Write After Decisions** - Document important choices immediately
3. **Be Specific** - Include what, why, and rationale
4. **Use Right Categories** - Follow agent access patterns
5. **Memory ≠ Todos** - Memory is knowledge, todos are tasks
6. **Memory ≠ Filesystem** - Memory is context, filesystem is source of truth
7. **Clean Up** - Remove outdated information

Effective memory management ensures continuity across tasks, helps agents understand context, and preserves important decisions and learnings throughout the project.

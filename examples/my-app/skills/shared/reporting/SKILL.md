---
name: reporting
description: Communicating task completion and failures to the main agent. Use when finishing delegated tasks or encountering blockers. For sub-agents only.
toolsets:
  - reporting
---

# Reporting to Main Agent

## Overview
Sub-agents (Coder, Designer, Data Architect) use reporting tools to communicate their status back to the Main agent. These tools are the primary communication channel between sub-agents and the Main agent.

**Note:** This skill is for sub-agents only. The Main agent does not use these tools.

## Available Tools

- `reportCompletion` - Signal that the delegated task has been completed successfully
- `reportFailure` - Signal that the task cannot be completed due to an error, blocker, or constraint

## When to Use Each Tool

### Use `reportCompletion` when:
- ✅ Task is fully complete
- ✅ All changes saved to filesystem
- ✅ Code has been linted and validated
- ✅ Memory has been updated with decisions
- ✅ Ready for main agent to proceed

### Use `reportFailure` when:
- ❌ Missing required dependencies (datasources, schemas, themes, images)
- ❌ Task requirements are unclear or ambiguous
- ❌ Encountered unrecoverable errors
- ❌ Task is impossible given current constraints
- ❌ Need clarification from user (via main agent)

## Tool Details

### `reportCompletion` - Successful Task Completion

**Parameters:**
- `summary` (required) - Brief description of what was completed
- `details` (optional) - Additional context, decisions made, or next steps

**When to call:**
- Call AFTER all work is done and saved
- Call AFTER running lint/validation
- Call AFTER updating memory
- This is the LAST action before ending your task

**Examples:**

```
// Simple completion
reportCompletion({
  summary: "Created ProductCard component with DaisyUI styling"
})

// Detailed completion
reportCompletion({
  summary: "Created products listing page with grid layout and filtering",
  details: "Page displays products from 'products' datasource in responsive grid (1-4 columns). Added category filter dropdown. Each card shows image, name, price, and 'View Details' link. Used DaisyUI card components for consistency. All changes committed and linted successfully."
})

// Completion with guidance for next steps
reportCompletion({
  summary: "Created contact form page with validation",
  details: "Form submits to 'contact-submissions' forms schema. Includes client-side validation for email format. Success message displays after submission. Note: User may want to add email notification integration in the future - would require additional setup."
})
```

**Best Practice:** Include enough detail so the main agent understands what was done and can inform the user appropriately.

### `reportFailure` - Task Cannot Be Completed

**Parameters:**
- `type` (required) - Type of failure:
  - `"dependency-missing"` - Required resource doesn't exist
  - `"unclear-requirements"` - Task is ambiguous or contradictory
  - `"error"` - Encountered unrecoverable error
  - `"constraint"` - Task is impossible given current constraints
- `message` (required) - Brief description of the problem
- `details` (optional) - Additional context, what was tried, what's needed

**Failure Types Explained:**

#### `dependency-missing`
Use when you need something that doesn't exist yet.

**Examples:**
- Coder needs datasource that doesn't exist
- Coder needs theme that hasn't been created
- Data Architect needs clarification on data structure
- Designer needs specific brand assets

```
reportFailure({
  type: "dependency-missing",
  message: "Cannot create products page - 'products' datasource doesn't exist",
  details: "Task requires products datasource to display product information. Need datasource with fields: name, description, price, imageUrl, category. Please delegate datasource creation to Data Architect, then I can complete the page."
})
```

#### `unclear-requirements`
Use when task description is ambiguous, contradictory, or missing critical information.

**Examples:**
- Conflicting instructions
- Missing design specifications
- Unclear data relationships
- Ambiguous user requirements

```
reportFailure({
  type: "unclear-requirements",
  message: "Unclear how testimonials should be stored - as datasource or hardcoded",
  details: "Task asks to add testimonials section but doesn't specify if these should come from a datasource (dynamic, user-manageable) or be hardcoded in the component (static). For 3-5 testimonials, either approach works. Please clarify user preference."
})
```

#### `error`
Use when you encounter technical errors that cannot be resolved.

**Examples:**
- Linting errors that can't be fixed
- Invalid schema structure
- File corruption
- System errors

```
reportFailure({
  type: "error",
  message: "TypeBox schema validation failing for unknown reason",
  details: "Created datasource schema with standard fields, but lint reports 'Invalid schema structure' error. Validated against TypeBox documentation - schema appears correct. Error message: 'Type.Object requires string keys'. Reviewed existing datasources for reference - using same pattern. May be TypeBox version issue or need system diagnostics."
})
```

#### `constraint`
Use when task is impossible given platform limitations or architectural constraints.

**Examples:**
- Feature not supported by platform
- Architectural limitation
- Performance constraint
- Security restriction

```
reportFailure({
  type: "constraint",
  message: "Cannot implement real-time chat - not supported by platform",
  details: "User requested live chat feature. The Upstart platform is static site generator without backend server. Real-time features require persistent connections (WebSockets) which aren't available. Alternative options: 1) Embed third-party chat widget (Intercom, Drift), 2) Use contact form for async communication. Please clarify with user which approach they prefer."
})
```

## Best Practices

### 1. Report Promptly

**Don't delay reporting:**

```
// Bad: Trying to work around blocker for too long
// (Wasting time trying impossible workarounds)

// Good: Report blocker immediately
reportFailure({
  type: "dependency-missing",
  message: "Need theme before styling pages",
  details: "Task requires theme for color palette. No themes exist in ./app/config/themes/. Please delegate theme creation to Designer first."
})
```

### 2. Be Specific

**Provide actionable information:**

❌ **Bad:**
```
reportFailure({
  type: "dependency-missing",
  message: "Something is missing"
})
```

✅ **Good:**
```
reportFailure({
  type: "dependency-missing",
  message: "Missing 'blog-posts' datasource required for blog page",
  details: "Blog listing page needs to query blog posts. Datasource './app/config/datasources/blog-posts.json' doesn't exist. Required fields: title, excerpt, content, author, publishDate, imageUrl. Please delegate datasource creation to Data Architect."
})
```

### 3. Report After Due Diligence

**Don't report failure prematurely:**

```
// BEFORE reporting failure, try:
// 1. Search documentation
askUpstartExpert({ query: "how to implement forms" })

// 2. Check filesystem for existing patterns
ls("./app/components/")

// 3. Search memory for previous similar work
memorySearch({ query: "similar component patterns" })

// 4. Consult relevant skill
describeSkills({ skills: ["components"] })

// ONLY THEN, if truly blocked, report failure
```

### 4. Update Memory Before Reporting

**Document your work even when reporting failure:**

```
// Document what you tried
memoryAdd({
  category: "coder_notes",
  content: "Attempted to create products page. Discovered 'products' datasource missing. Documented required fields in failure report. Work paused pending datasource creation."
})

// Then report
reportFailure({
  type: "dependency-missing",
  message: "Missing products datasource",
  details: "Required fields: name, description, price, imageUrl, category"
})
```

### 5. Provide Solutions, Not Just Problems

**Suggest how to unblock:**

❌ **Bad:**
```
reportFailure({
  type: "unclear-requirements",
  message: "Don't know what to do"
})
```

✅ **Good:**
```
reportFailure({
  type: "unclear-requirements",
  message: "Unclear whether to use modal or separate page for product details",
  details: "Task says 'show product details' but doesn't specify UI pattern. Options: 1) Modal overlay (better for quick browsing, keeps context), 2) Separate page (better for SEO, shareable links). Both are viable. Please clarify user preference based on site goals (e-commerce vs. catalog)."
})
```

### 6. Clean Todos Before Reporting

**Complete or clean up todo list:**

```
// Mark completed work
todoUpdate({ id: "current-task", status: "completed" })

// Delete tasks that are now irrelevant due to blocker
todoDelete({ id: "task-that-cant-be-done" })

// Then report
reportFailure({ ... })
```

## Common Workflows

### Successful Task Completion

```
// 1. Complete the work
// ... create files, make changes ...

// 2. Validate work
lint({ path: "./app/pages/products.tsx" })

// 3. Update memory
memoryAdd({
  category: "coder_decisions",
  content: "Created products page with grid layout..."
})

memoryAdd({
  category: "project_recent_changes",
  content: "Added products listing page at /products"
})

// 4. Clean up todos
todoUpdate({ id: "create-page", status: "completed" })

// 5. Report completion
reportCompletion({
  summary: "Created products listing page",
  details: "Grid layout with filtering, responsive design, DaisyUI styling"
})
```

### Encountering Missing Dependency

```
// 1. Discover blocker
ls("./app/config/datasources/")
// products.json not found!

// 2. Document in memory
memoryAdd({
  category: "project_known_issues",
  content: "Products datasource missing - blocker for products page"
})

// 3. Update todos
todoUpdate({
  id: "current-task",
  status: "pending"
}) // Back to pending

// 4. Report failure with specifics
reportFailure({
  type: "dependency-missing",
  message: "Products datasource required but doesn't exist",
  details: "Need datasource at ./app/config/datasources/products.json with fields: name (string), description (string), price (number), imageUrl (string), category (string, optional). Please delegate to Data Architect."
})
```

### Encountering Unclear Requirements

```
// 1. Read task context
memoryRead({ category: "main_task_context" })
// Task says "add testimonials" but unclear if static or dynamic

// 2. Search for clarification
memorySearch({ query: "testimonials" })
// No additional context found

// 3. Document ambiguity
memoryAdd({
  category: "coder_notes",
  content: "Testimonials implementation unclear - static vs dynamic"
})

// 4. Report with options
reportFailure({
  type: "unclear-requirements",
  message: "Unclear if testimonials should be static or from datasource",
  details: "Task doesn't specify testimonial source. Options:\n\n1) Static hardcoded (simpler, good for 3-5 fixed testimonials)\n2) Datasource-driven (flexible, user can manage via CMS)\n\nPlease clarify user preference. If choosing option 2, will need 'testimonials' datasource created first."
})
```

### Partial Completion with Blocker

```
// 1. Complete what you can
// Created page structure, but can't add data without datasource

// 2. Document partial work
memoryAdd({
  category: "coder_decisions",
  content: "Created products page structure with grid layout. Placeholder for product data - awaiting products datasource."
})

// 3. Report failure with context
reportFailure({
  type: "dependency-missing",
  message: "Products page structure created but blocked on datasource",
  details: "Created page at ./app/pages/products.tsx with responsive grid layout and filter UI. Cannot populate with actual data - products datasource doesn't exist. Need datasource with fields: name, description, price, imageUrl, category. Page is ready to integrate datasource once available."
})
```

## Examples by Agent Type

### Coder Agent

**Successful completion:**
```
reportCompletion({
  summary: "Created hero section component with animated text",
  details: "Component accepts title, subtitle, ctaText, ctaLink props. Includes fade-in animation and responsive image. Used DaisyUI hero class with custom Tailwind animations. Tested on mobile and desktop viewports."
})
```

**Missing dependency:**
```
reportFailure({
  type: "dependency-missing",
  message: "Blog page needs 'blog-posts' datasource",
  details: "Cannot implement blog listing without datasource. Need schema with: title, excerpt, content, author, publishDate, tags[], featuredImage. Please delegate to Data Architect."
})
```

### Designer Agent

**Successful completion:**
```
reportCompletion({
  summary: "Created 'ocean-blue' theme with professional color palette",
  details: "Used split-complementary harmony in OKLCH. Primary: blue (trust, professionalism), Secondary: orange (energy), Accent: teal (freshness). Validated with lint. Matches user's request for corporate professional theme."
})
```

**Unclear requirements:**
```
reportFailure({
  type: "unclear-requirements",
  message: "Need guidance on brand colors vs. selecting colors",
  details: "Task asks to 'create theme for fitness brand' but unclear if user has specific brand colors or wants me to suggest palette. Please clarify: 1) Does user have existing brand colors to use? 2) If not, any color preferences (energetic, calm, bold)?"
})
```

### Data Architect Agent

**Successful completion:**
```
reportCompletion({
  summary: "Created 'events' datasource with date and location fields",
  details: "Schema includes: title, description, eventDate, location, registrationUrl (optional). All fields except registrationUrl required. Used string for eventDate (will be ISO format). Location is string to allow flexibility (could be address, city, or 'Virtual'). Validated with lint."
})
```

**Unclear requirements:**
```
reportFailure({
  type: "unclear-requirements",
  message: "Unclear data relationship between products and categories",
  details: "Task mentions products with categories but unclear if: 1) Category is simple string field on product, 2) Category is enum with fixed values, 3) Category is separate datasource with relationships. Each approach has trade-offs. Please clarify how user wants to manage categories (fixed list vs. flexible)."
})
```

## Anti-Patterns to Avoid

❌ **Don't report completion prematurely:**
```
// Bad: Reporting before validating
createFile({ ... })
reportCompletion({ summary: "Created file" })
// (File might have errors!)

// Good: Validate first
createFile({ ... })
lint({ path: "..." })
reportCompletion({ summary: "Created and validated file" })
```

❌ **Don't report vague failures:**
```
// Bad
reportFailure({
  type: "error",
  message: "Something went wrong"
})

// Good
reportFailure({
  type: "error",
  message: "TypeScript compilation error in component",
  details: "Error: Type 'string | undefined' is not assignable to type 'string'. On line 42 in ProductCard.tsx. Prop 'imageUrl' is optional but used without null check. Need to either make prop required or add conditional rendering."
})
```

❌ **Don't report failure without trying:**
```
// Bad: Reporting immediately when unsure
reportFailure({
  type: "unclear-requirements",
  message: "Don't know how to do this"
})

// Good: Research first
describeSkills({ skills: ["components"] })
memorySearch({ query: "component patterns" })
// ... if still unclear after research ...
reportFailure({ ... })
```

## Communication Patterns

### Main Agent → Sub Agent (via delegation)
```
// Main agent provides context
memoryAdd({
  category: "main_task_context",
  content: "Create products page with filtering..."
})

delegateToCoder({
  task: "Create products listing page",
  context: "See main_task_context for requirements"
})
```

### Sub Agent → Main Agent (via reporting)
```
// Sub agent reports status
reportCompletion({
  summary: "Products page created",
  details: "..."
})

// OR

reportFailure({
  type: "dependency-missing",
  message: "Need products datasource",
  details: "..."
})
```

### Main Agent handles failure
```
// Main agent receives failure report
// Decides next action:
// - Delegate to different agent to create dependency
// - Ask user for clarification
// - Adjust requirements and re-delegate
```

## Summary

**Key Principles:**
1. **Report Promptly** - Don't delay when blocked or finished
2. **Be Specific** - Provide actionable details
3. **Due Diligence First** - Research before reporting failure
4. **Update Memory** - Document work even when blocked
5. **Suggest Solutions** - Help main agent unblock you
6. **Clean Up** - Complete todos and validations before reporting

**Decision Tree:**
```
Task complete?
├─ Yes → Validated and saved?
│  ├─ Yes → reportCompletion()
│  └─ No → Validate and save first
└─ No → Can I proceed?
   ├─ Yes → Continue working
   └─ No → Blocker?
      ├─ Missing dependency → reportFailure(type: "dependency-missing")
      ├─ Unclear requirements → reportFailure(type: "unclear-requirements")
      ├─ Technical error → reportFailure(type: "error")
      └─ Platform limitation → reportFailure(type: "constraint")
```

Effective reporting keeps the main agent informed, unblocks work efficiently, and ensures smooth coordination between agents.

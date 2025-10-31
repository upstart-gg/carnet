---
name: diagnostics
description: Debugging and quality assurance tools for validating code, diagnosing errors, and ensuring quality. Use when validating work or troubleshooting issues.
toolsets:
  - diagnostics
---

# Diagnostics & Quality Assurance

## Overview
Diagnostic tools help you validate code, troubleshoot errors, and ensure quality before completing tasks. These tools catch issues early and provide actionable feedback for fixes.

## Available Tools

- `lint` - Lint and compile code or schemas to check for syntax errors and correctness (sub-agents only)
- `diagnoseClientError` - Get console logs from the client-side browser to diagnose front-end errors (sub-agents only)
- `runQA` - Run automated quality assurance checks on the generated website (main agent only)

## When to Use Each Tool

### Use `lint` when:
- ✅ After creating or modifying any file
- ✅ Before reporting completion
- ✅ When encountering unexpected behavior
- ✅ After applying major refactoring

### Use `diagnoseClientError` when:
- ✅ User reports something "doesn't work"
- ✅ Page isn't rendering as expected
- ✅ Component behavior is broken
- ✅ Need to see runtime errors

### Use `runQA` when (Main agent only):
- ✅ After specialist agent reports completion
- ✅ After major feature additions
- ✅ Before presenting work to user
- ✅ Periodically during development

## Tool Details

### `lint` - Code Validation (Sub-agents only)

**Parameters:**
- `path` (optional) - Specific file or directory to lint
  - If omitted: Lints entire project
  - File: `./app/pages/products.tsx`
  - Directory: `./app/components/`

**What it checks:**
- TypeScript compilation errors
- React/JSX syntax issues
- TypeBox schema validation
- JSON syntax in config files
- Import statement correctness
- Type mismatches

**Examples:**

```
// Lint specific file
lint({ path: "./app/pages/products.tsx" })

// Lint all components
lint({ path: "./app/components/" })

// Lint config file
lint({ path: "./app/config/datasources/products.json" })

// Lint entire project
lint()
```

**Best Practice:** Always lint after making changes, before reporting completion.

### `diagnoseClientError` - Runtime Debugging (Sub-agents only)

**Parameters:**
- None - Retrieves current browser console logs

**What it provides:**
- JavaScript runtime errors
- React error messages
- Console warnings
- Network request failures
- Component render errors

**When to use:**
- User reports: "The page is blank"
- User reports: "Button doesn't work"
- User reports: "Form isn't submitting"
- Visual issues without obvious cause

**Examples:**

```
// User reports broken page
diagnoseClientError()
// Returns: "TypeError: Cannot read property 'map' of undefined at ProductsList.tsx:42"

// User reports button not working
diagnoseClientError()
// Returns: "Uncaught Error: handleClick is not defined"
```

**Best Practice:** Use this when user feedback indicates runtime issues, not compile-time issues (use `lint` for those).

### `runQA` - Automated Quality Checks (Main agent only)

**Parameters:**
- None - Runs comprehensive site checks

**What it checks:**
- All pages render without errors
- Navigation links work
- Forms are functional
- Images load correctly
- Responsive design issues
- Accessibility basics
- Console errors across site

**When to use:**
- After Coder completes major page work
- After Designer adds theme or images
- Before showing work to user
- After Data Architect creates datasources

**Examples:**

```
// After coder finishes homepage
runQA()
// Returns: "All checks passed. 5 pages tested, 0 errors found."

// After adding new feature
runQA()
// Returns: "Warning: Image missing on /about page. Error: Form submit fails on /contact"
```

**Best Practice:** Run QA proactively after major changes to catch issues before the user does.

## Common Validation Workflows

### After Creating a Component (Coder)

```
// 1. Create component
createFile({
  path: "./app/components/ProductCard.tsx",
  content: "..."
})

// 2. Lint immediately
lint({ path: "./app/components/ProductCard.tsx" })

// 3. If errors, fix them
// ... apply fixes ...

// 4. Lint again to verify
lint({ path: "./app/components/ProductCard.tsx" })

// 5. Continue with next task
```

### After Creating a Page (Coder)

```
// 1. Create page
createFile({
  path: "./app/pages/products.tsx",
  content: "..."
})

// 2. Lint the page
lint({ path: "./app/pages/products.tsx" })

// 3. If clean, report completion
reportCompletion({
  summary: "Created products page",
  details: "Linted successfully, no errors"
})
```

### After Creating Theme (Designer)

```
// 1. Create theme
createFile({
  path: "./app/config/themes/ocean-blue.json",
  content: "..."
})

// 2. Lint to validate JSON and structure
lint({ path: "./app/config/themes/ocean-blue.json" })

// 3. Fix any validation errors
// ... corrections ...

// 4. Verify again
lint({ path: "./app/config/themes/ocean-blue.json" })

// 5. Report completion
reportCompletion({ summary: "Created ocean-blue theme" })
```

### After Creating Schema (Data Architect)

```
// 1. Create datasource
createFile({
  path: "./app/config/datasources/products.json",
  content: "..."
})

// 2. Validate schema structure
lint({ path: "./app/config/datasources/products.json" })

// 3. If errors, review TypeBox requirements
describeSkills({ skills: ["typebox-schemas"] })

// 4. Fix and re-validate
lint({ path: "./app/config/datasources/products.json" })

// 5. Report completion
reportCompletion({ summary: "Created products datasource" })
```

### Diagnosing User-Reported Issues (Coder)

```
// User: "The products page shows a blank screen"

// 1. Check for client-side errors
diagnoseClientError()
// Returns: "TypeError: products.map is not a function"

// 2. Understand the error
// → products is likely undefined or not an array

// 3. Read the file
readFile({ path: "./app/pages/products.tsx" })

// 4. Identify issue
// → Missing null check before mapping

// 5. Fix the issue
replaceInFile({
  path: "./app/pages/products.tsx",
  oldString: "products.map(...)",
  newString: "products?.map(...) ?? []"
})

// 6. Lint to verify fix
lint({ path: "./app/pages/products.tsx" })

// 7. Check runtime again
diagnoseClientError()
// Returns: "No errors"

// 8. Report fix
reportCompletion({
  summary: "Fixed products page rendering issue",
  details: "Added null check for products array. Page now handles empty state correctly."
})
```

### Main Agent Quality Check Flow

```
// After Coder reports completion of homepage

// 1. Run QA
runQA()

// 2. Review results
// → "Warning: Hero image returns 404"

// 3. Investigate
ls("./public/images/")

// 4. Image is missing - delegate to Designer
delegateToDesigner({
  task: "Find hero image for homepage",
  context: "Homepage needs hero image. Previous image missing. Looking for professional, modern workspace image."
})

// 5. After Designer reports completion, verify
runQA()
// → "All checks passed"

// 6. Inform user
// "Homepage is complete and tested!"
```

## Understanding Error Messages

### TypeScript Errors (from `lint`)

**Common patterns and solutions:**

#### Type Mismatch
```
Error: Type 'string | undefined' is not assignable to type 'string'
Location: ProductCard.tsx:42
```

**Cause:** Optional prop used without null checking

**Fix:**
```typescript
// Before
<img src={imageUrl} />

// After
<img src={imageUrl ?? '/placeholder.png'} />
```

#### Missing Import
```
Error: Cannot find module '~/components/Header'
Location: page.tsx:3
```

**Cause:** File doesn't exist or wrong path

**Fix:**
- Verify file exists: `ls("./app/components/")`
- Check import path matches actual file location

#### Property Doesn't Exist
```
Error: Property 'title' does not exist on type 'Product'
Location: ProductCard.tsx:25
```

**Cause:** TypeBox schema doesn't include field

**Fix:**
- Read datasource schema
- Either add field to schema OR remove from component

### React/JSX Errors (from `lint` or `diagnoseClientError`)

#### Map Without Key
```
Warning: Each child in a list should have a unique "key" prop
```

**Fix:**
```typescript
// Before
{products.map(product => <ProductCard {...product} />)}

// After
{products.map(product => <ProductCard key={product.$id} {...product} />)}
```

#### Hook Rules Violation
```
Error: React Hook "useState" is called conditionally
```

**Fix:** Move hooks to top level, not inside conditions or loops

### Schema Validation Errors (from `lint`)

#### Invalid TypeBox Schema
```
Error: Invalid schema structure
Location: products.json
```

**Causes:**
- Missing required TypeBox fields
- Invalid type definition
- Incorrect JSON syntax

**Fix:**
```
// Check documentation
describeSkills({ skills: ["typebox-schemas"] })

// Verify against existing schemas
readFile({ path: "./app/config/datasources/blog-posts.json" })

// Compare and correct structure
```

### Runtime Errors (from `diagnoseClientError`)

#### Undefined Variable
```
ReferenceError: handleClick is not defined
Location: Button component
```

**Cause:** Function not defined or not in scope

**Fix:** Define the function or import it

#### Cannot Read Property
```
TypeError: Cannot read property 'name' of undefined
Location: ProductCard.tsx:42
```

**Cause:** Object is undefined/null

**Fix:** Add null checking or optional chaining

## Debugging Strategies

### Strategy 1: Lint Early and Often

```
// Bad: Lint once at the end
createFile({ ... })
createFile({ ... })
createFile({ ... })
lint() // Find 15 errors!

// Good: Lint after each file
createFile({ path: "file1.tsx", ... })
lint({ path: "file1.tsx" }) // Fix immediately

createFile({ path: "file2.tsx", ... })
lint({ path: "file2.tsx" }) // Fix immediately

createFile({ path: "file3.tsx", ... })
lint({ path: "file3.tsx" }) // Fix immediately
```

### Strategy 2: Isolate the Problem

```
// Issue: Page not rendering

// 1. Check compile-time errors
lint({ path: "./app/pages/problem-page.tsx" })
// → No errors

// 2. Check runtime errors
diagnoseClientError()
// → "TypeError in ProductList component"

// 3. Check specific component
lint({ path: "./app/components/ProductList.tsx" })
// → No errors

// 4. Read component code
readFile({ path: "./app/components/ProductList.tsx" })
// → Spot logic error in data handling

// 5. Fix and verify
replaceInFile({ ... })
diagnoseClientError()
// → No errors
```

### Strategy 3: Compare with Working Examples

```
// New component has errors

// 1. Find similar working component
ls("./app/components/")

// 2. Read working component
readFile({ path: "./app/components/BlogPostCard.tsx" })

// 3. Compare patterns
// → Working component uses different prop structure

// 4. Apply pattern to new component
// 5. Lint to verify
```

### Strategy 4: Consult Documentation

```
// Schema validation failing

// 1. Load TypeBox skill
describeSkills({ skills: ["typebox-schemas"] })

// 2. Review requirements
// → Understand string formats, optional fields

// 3. Apply correct pattern
// 4. Validate
lint({ path: "./app/config/datasources/products.json" })
```

## Quality Assurance Checklist

### Before Reporting Completion (Sub-agents)

- [ ] All created/modified files linted successfully
- [ ] No TypeScript compilation errors
- [ ] No React/JSX warnings
- [ ] Schema files validated (if applicable)
- [ ] Imports resolve correctly
- [ ] No console errors in browser (if applicable)

### After Receiving Completion (Main agent)

- [ ] Run QA to verify changes
- [ ] Check pages render correctly
- [ ] Verify navigation works
- [ ] Test forms (if applicable)
- [ ] Check responsive design
- [ ] Review console for warnings

## Examples by Agent Type

### Coder Agent

**Creating component:**
```
createFile({ path: "./app/components/TestimonialCard.tsx", content: "..." })
lint({ path: "./app/components/TestimonialCard.tsx" })
// Error: Missing key prop
replaceInFile({ ... })
lint({ path: "./app/components/TestimonialCard.tsx" })
// Success ✓
```

**Diagnosing issue:**
```
// User reports form broken
diagnoseClientError()
// "Error: formSchema is undefined"
readFile({ path: "./app/pages/contact.tsx" })
// → Missing import for form schema
```

### Designer Agent

**Creating theme:**
```
createFile({ path: "./app/config/themes/sunset.json", content: "..." })
lint({ path: "./app/config/themes/sunset.json" })
// Error: Invalid OKLCH format
replaceInFile({ ... })
lint({ path: "./app/config/themes/sunset.json" })
// Success ✓
```

### Data Architect Agent

**Creating schema:**
```
createFile({ path: "./app/config/datasources/events.json", content: "..." })
lint({ path: "./app/config/datasources/events.json" })
// Error: Invalid TypeBox schema
describeSkills({ skills: ["typebox-schemas"] })
replaceInFile({ ... })
lint({ path: "./app/config/datasources/events.json" })
// Success ✓
```

### Main Agent

**After delegation:**
```
// Coder reports completion
runQA()
// "Warning: 2 broken links on homepage"

// Investigate and delegate fix
delegateToCoder({
  task: "Fix broken links on homepage",
  context: "QA found 2 broken links. Please check and correct navigation."
})

// After fix
runQA()
// "All checks passed"
```

## Anti-Patterns to Avoid

❌ **Don't skip linting:**
```
// Bad
createFile({ ... })
reportCompletion({ summary: "Created component" })
// (Might have errors!)
```

✅ **Always lint:**
```
// Good
createFile({ ... })
lint({ path: "..." })
reportCompletion({ summary: "Created and validated component" })
```

❌ **Don't guess at errors:**
```
// Bad: User reports issue
// Agent: "Maybe try refreshing?"

// Good: Diagnose first
diagnoseClientError()
// Now you have actual error message to fix
```

❌ **Don't batch validations:**
```
// Bad
createFile({ path: "file1.tsx", ... })
createFile({ path: "file2.tsx", ... })
createFile({ path: "file3.tsx", ... })
lint() // 10 errors!

// Good
createFile({ path: "file1.tsx", ... })
lint({ path: "file1.tsx" })
createFile({ path: "file2.tsx", ... })
lint({ path: "file2.tsx" })
```

## Summary

**Key Principles:**
1. **Lint After Every Change** - Catch errors immediately
2. **Use Diagnostics for Runtime Issues** - Don't guess, diagnose
3. **Run QA After Major Work** - Verify changes don't break site
4. **Fix Errors Before Proceeding** - Don't build on broken foundation
5. **Understand Errors** - Read messages carefully
6. **Consult Documentation** - Use skills when stuck

**Validation Workflow:**
```
Create/Modify File
       ↓
    Lint File
       ↓
  Errors Found? ─No──→ Continue
       │
      Yes
       ↓
   Fix Errors
       ↓
   Lint Again
       ↓
   All Clear? ─Yes──→ Continue
       │
      No
       ↓
   Consult Docs
       ↓
   Retry Fix
```

Effective use of diagnostic tools ensures high-quality, error-free deliverables and catches issues before they reach users.

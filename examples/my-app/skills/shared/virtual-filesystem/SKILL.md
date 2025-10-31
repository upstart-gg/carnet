---
name: virtual-filesystem
description: Understanding the virtual filesystem structure, file organization, and filesystem operations for the Upstart platform. Use this skill when you need to read, write, or navigate the project filesystem.
toolsets:
  - virtual-filesystem
---

# Virtual Filesystem

## Overview
The environment uses a virtual filesystem to store all files of the website. Any change to the filesystem auto-generates a commit. You can read and write files using the provided filesystem tools depending on your agent role.

## Available Filesystem Tools

### Read Operations
- `readFile` - Read file contents
- `ls` - List directory contents
- `grep` - Search for content in files
- `find` - Locate files by name pattern

### Write Operations
- `createFile` - Create new files
- `replaceInFile` - Make targeted replacements
- `patch` - Apply more complex edits

### History & Revert Operations
- `gitLog` - View commit history
- `revert` - Restore to a previous commit ID

## Fundamental Principles

**The Filesystem is the Source of Truth**
The state of the website is defined by the files in the virtual filesystem. Always read from a file to get the most current version of any asset. Memory stores context, but filesystem stores the actual code and configuration.

**Read Before You Write**
Always use `readFile` to load the existing content of a file before making any modifications. This ensures you are working with the latest version and helps avoid conflicts.

**Auto-Commit Behavior**
Any change to the filesystem automatically generates a commit. This means every file creation, modification, or deletion is tracked in version control.

## Usage Guidelines by Operation Type

### Reading Files

**Use `readFile` when:**
- You need the complete contents of a specific file
- You're about to modify a file
- You need to understand code structure
- You're debugging an issue

**Example:**
```
readFile({ path: "./app/components/Header.tsx" })
```

**Use `ls` when:**
- You need to see what files exist in a directory
- You're exploring the project structure
- You're checking if a file or folder exists
- You want to see available themes, datasources, or components

**Example:**
```
// List all components
ls({ path: "./app/components/" })

// List all datasources
ls({ path: "./app/config/datasources/" })

// List pages
ls({ path: "./app/pages/" })
```

**Use `grep` when:**
- You're searching for specific content across files
- You want to find where a function or component is used
- You need to quickly check if a pattern exists
- You're locating imports or dependencies

**Example:**
```
// Find where ProductCard is imported
grep({
  path: "./app/",
  pattern: "import.*ProductCard",
  recursive: true
})

// Find all datasource queries
grep({
  path: "./app/pages/",
  pattern: "datasource\\(",
  recursive: true
})
```

**Use `find` when:**
- You're looking for files by name pattern
- You can't remember exact file location
- You're searching for specific file types

**Example:**
```
// Find all TypeScript component files
find({
  path: "./app/",
  pattern: "*.tsx"
})

// Find all JSON config files
find({
  path: "./app/config/",
  pattern: "*.json"
})
```

### Writing Files

**Use `createFile` when:**
- Creating a new component, page, hook, or utility
- Adding a new theme, datasource, or forms schema
- Creating any file that doesn't yet exist

**Important:** Always check if file exists first using `ls` or `find`

**Example:**
```
// Check first
ls({ path: "./app/components/" })

// Then create
createFile({
  path: "./app/components/ProductCard.tsx",
  content: `import { Type } from "@sinclair/typebox"
...`
})
```

**Use `replaceInFile` when:**
- Making targeted changes to existing code
- Updating specific lines or blocks
- Fixing bugs or errors
- Modifying configuration values

**Important:** Always `readFile` first to see current content

**Example:**
```
// Read first
readFile({ path: "./app/pages/products.tsx" })

// Then replace
replaceInFile({
  path: "./app/pages/products.tsx",
  oldString: "products.map(",
  newString: "products?.map("
})
```

**Use `patch` when:**
- Making complex multi-line changes
- Restructuring code sections
- Applying larger refactorings

### Version Control Operations

**Use `gitLog` when:**
- You need to understand recent changes
- You're looking for a specific commit to revert to
- You want to see what was modified recently
- You need context on file evolution

**Example:**
```
gitLog({ limit: 10 })
```

**Use `revert` when:**
- You need to undo recent changes
- An error was introduced and you want to go back
- You want to restore a previous working state

**Important:** Use with caution - this affects the entire working directory

**Example:**
```
// Get commit ID from gitLog first
gitLog({ limit: 5 })

// Then revert
revert({ commitId: "abc123def456" })
```

## Best Practices

### 1. Explore Before Acting

Always understand the current state before making changes:

```
// Bad: Create file without checking
createFile({ path: "./app/components/Button.tsx", content: "..." })

// Good: Check first
ls({ path: "./app/components/" })
// See that Button.tsx might already exist
readFile({ path: "./app/components/Button.tsx" })
// Decide whether to modify existing or create new
```

### 2. Read Before Writing

Never modify a file without reading it first:

```
// Bad: Modify without reading
replaceInFile({
  path: "./app/pages/home.tsx",
  oldString: "old text",
  newString: "new text"
})

// Good: Read first
readFile({ path: "./app/pages/home.tsx" })
// Understand current content
// Then make targeted change
replaceInFile({ ... })
```

### 3. Use grep for Quick Checks

Before reading large files, use grep to verify content:

```
// Check if file contains what you're looking for
grep({
  path: "./app/pages/",
  pattern: "ProductCard",
  recursive: true
})

// If found, then read the specific file
readFile({ path: "./app/pages/products.tsx" })
```

### 4. Verify Changes

After writing, verify your changes took effect:

```
// Make change
replaceInFile({
  path: "./app/pages/products.tsx",
  oldString: "const limit = 10",
  newString: "const limit = 20"
})

// Verify
readFile({ path: "./app/pages/products.tsx" })
// Check that change was applied correctly
```

### 5. Use Appropriate Paths

Always use correct path format:

```
// Good: Relative paths from project root
ls({ path: "./app/components/" })
readFile({ path: "./app/pages/index.tsx" })

// Good: In code, use ~ alias
import Header from "~/components/Header"
import { siteConfig } from "~/config/site.json"
```

## Common Workflows

### Creating a New Component

```
// 1. Check what components exist
ls({ path: "./app/components/" })

// 2. Check if similar component exists
find({ path: "./app/components/", pattern: "*Card*" })

// 3. If similar exists, read for reference
readFile({ path: "./app/components/BlogPostCard.tsx" })

// 4. Create new component
createFile({
  path: "./app/components/ProductCard.tsx",
  content: "..."
})

// 5. Verify creation
ls({ path: "./app/components/" })
```

### Modifying Existing Code

```
// 1. Read current content
readFile({ path: "./app/pages/products.tsx" })

// 2. Make targeted change
replaceInFile({
  path: "./app/pages/products.tsx",
  oldString: "limit(10)",
  newString: "limit(20)"
})

// 3. Verify change
readFile({ path: "./app/pages/products.tsx" })
```

### Exploring Project Structure

```
// 1. See what pages exist
ls({ path: "./app/pages/" })

// 2. See what datasources are available
ls({ path: "./app/config/datasources/" })

// 3. See what themes exist
ls({ path: "./app/config/themes/" })

// 4. Find all component usage
grep({
  path: "./app/",
  pattern: "import.*from.*components",
  recursive: true
})
```

### Debugging an Issue

```
// 1. User reports issue with products page
// Read the page
readFile({ path: "./app/pages/products.tsx" })

// 2. Check what datasources it uses
grep({
  path: "./app/pages/products.tsx",
  pattern: "datasource\\("
})

// 3. Verify datasource exists
ls({ path: "./app/config/datasources/" })

// 4. Read datasource schema
readFile({ path: "./app/config/datasources/products.json" })

// 5. Identify issue and fix
replaceInFile({ ... })
```

### Reverting Bad Changes

```
// 1. See recent changes
gitLog({ limit: 10 })

// 2. Identify commit before error
// Look for commit message or timestamp

// 3. Revert to that commit
revert({ commitId: "commit-id-here" })

// 4. Verify revert worked
readFile({ path: "./app/pages/problem-page.tsx" })
```

## Anti-Patterns to Avoid

❌ **Don't create without checking:**
```
// Bad
createFile({ path: "./app/components/Button.tsx", content: "..." })
// Might overwrite existing file!
```

✅ **Do check first:**
```
// Good
ls({ path: "./app/components/" })
// Verify Button.tsx doesn't exist, then create
```

❌ **Don't modify without reading:**
```
// Bad
replaceInFile({
  path: "./app/pages/home.tsx",
  oldString: "old text",
  newString: "new text"
})
// Don't know if "old text" even exists!
```

✅ **Do read first:**
```
// Good
readFile({ path: "./app/pages/home.tsx" })
// See exact content, then make precise change
```

❌ **Don't revert without checking history:**
```
// Bad
revert({ commitId: "random-id" })
```

✅ **Do check history first:**
```
// Good
gitLog({ limit: 10 })
// Identify correct commit, then revert
```

## Summary

**Key Principles:**
1. **Filesystem = Source of Truth** - Always check filesystem for current state
2. **Read Before Write** - Understand before modifying
3. **Explore First** - Use ls/find/grep before reading files
4. **Verify Changes** - Check that modifications worked
5. **Commit Awareness** - Every change is auto-committed

**Tool Selection Guide:**
```
Need to...
├─ Read file contents? → readFile
├─ See directory contents? → ls
├─ Search for patterns? → grep
├─ Find files by name? → find
├─ Create new file? → createFile (after checking existence)
├─ Modify existing file? → replaceInFile (after reading)
├─ View history? → gitLog
└─ Undo changes? → revert (with caution)
```

Effective filesystem usage ensures accurate understanding of project state, prevents conflicts, and maintains code quality throughout development.

## Filesystem Structure

**IMPORTANT: The filesystem structure must not be changed**

- `./app/layouts/` - Contains layout files (.tsx)
  - `_default.tsx` - Default empty layout (no navbar, no footer)
- `./app/components/` - Store reusable components (.tsx) (empty by default)
- `./app/hooks/` - Store reusable hooks (.ts or .tsx) (empty by default)
- `./app/utils/` - Store reusable utilities (.ts or .tsx) (empty by default)
- `./app/pages/` - Contains all pages (.tsx) (contains only index.tsx by default)
  - `index.tsx` - The homepage of the website
- `./app/config/` - Contains configuration files (.json)
  - `site.json` - Current site attributes
  - `app.css` - Global CSS file (includes Tailwind CSS & DaisyUI directives)
  - `themes/*` - Store all themes to choose from (.json)
  - `datasources/*` - Store datasources definition files (.json)
  - `forms-schemas/*` - Store forms schemas definition files (.json)
- `./public/*` - Store all generated and uploaded images (.png, .jpg, .svg, etc.). Some images have a corresponding metadata file (.json) with the same name.

## Path Aliases

In code, you can use either full relative paths or the `~` alias which links to the app folder:

- `./app/layouts/` => `~/layouts/`
- `./app/config/` => `~/config/`
- `./app/components/` => `~/components/`
- `./app/hooks/` => `~/hooks/`
- `./app/utils/` => `~/utils/`
- `./app/pages/` => `~/pages/`

---
name: virtual-filesystem
description: Tools for reading, writing, and managing files in the virtual filesystem
tools:
  - readFile
  - ls
  - grep
  - find
  - createFile
  - replaceInFile
  - patch
  - gitLog
  - revert
---

# Virtual Filesystem Tools

Tools for interacting with the project's virtual filesystem where all website files are stored.

## Overview

The virtual filesystem stores all files for the website. Any change auto-generates a commit. These tools let you read, write, search, and manage files.

## Fundamental Principles

### The Filesystem is the Source of Truth
The state of the website is defined by files in the filesystem. Always read from files to get current version of any asset. Memory stores context, filesystem stores actual code and configuration.

### Read Before You Write
Always use `readFile` to load existing file content before modifying. This ensures you work with latest version and avoid conflicts.

### Auto-Commit Behavior
Any filesystem change automatically generates a commit. Every creation, modification, or deletion is tracked in version control.

## Tool Categories

### Read Operations
- `readFile` - Read complete file contents
- `ls` - List directory contents
- `grep` - Search for content in files
- `find` - Locate files by name pattern

### Write Operations
- `createFile` - Create new files
- `replaceInFile` - Make targeted replacements
- `patch` - Apply complex edits

### History & Revert Operations
- `gitLog` - View commit history
- `revert` - Restore to previous commit

## Usage Guidelines

### When Reading Files
Use `readFile`:
- Need complete contents of specific file
- About to modify a file
- Need to understand code structure
- Debugging an issue

Use `ls`:
- See what files exist in directory
- Exploring project structure
- Checking if file/folder exists
- Viewing available themes, datasources, components

Use `grep`:
- Searching for specific content across files
- Finding where function/component is used
- Quickly checking if pattern exists
- Locating imports or dependencies

Use `find`:
- Looking for files by name pattern
- Can't remember exact file location
- Searching for specific file types

### When Writing Files
Use `createFile`:
- Creating new files (components, pages, schemas)
- Auto-commit captures creation

Use `replaceInFile`:
- Making targeted replacements in existing files
- Preserving file structure while changing specific content

Use `patch`:
- Applying complex, multi-line edits
- More flexible than replaceInFile

### When Reviewing History
Use `gitLog`:
- View commit history
- Understand what changed and when
- See commit messages

Use `revert`:
- Restore entire project to previous commit
- Undo recent changes
- Roll back to known good state

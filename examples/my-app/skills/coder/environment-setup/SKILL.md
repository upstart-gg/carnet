---
name: environment-setup
description: Upstart development environment setup, tech stack, Cloudflare Workers constraints, and authorized libraries. Understanding the environment is critical for all coding.
toolsets: []
---

# Upstart SDK Environment Setup

## Work Environment Overview

The Upstart environment is a complete platform for building websites using React, TypeScript, and modern web technologies. Understanding the constraints and architecture is critical for all development work.

---

## Tech Stack

The Upstart tech stack is built around **React**, **React Router**, **TailwindCSS**, **DaisyUI**, and the **Upstart framework** (SDK + components).

The Upstart framework is a set of component wrappers that allow you to use DaisyUI and TailwindCSS components in a no-code/low-code way. When wrapped inside Upstart wrappers, components can be dragged, dropped, and configured visually in the Upstart editor.

Upstart also provides a set of React hooks to fetch data from datasources (databases) and submit forms to forms schemas (tables).

---

## Critical Constraint: Cloudflare Workers (Serverless Edge)

### Environment Architecture

On the server side, Upstart uses **Cloudflare Workers** to host websites. This means:

- **Serverless**: Code runs on the edge, not on a traditional server
- **No Node.js APIs**: You **cannot use Node-specific libraries or APIs** (no `fs`, `path`, `http.Server`, etc.)
- **Web Standard APIs Only**: Use only the Web standard APIs available in Cloudflare Workers

### What This Means For Your Code

- ❌ **NO** `fs` module (file system) - data comes from databases/APIs only
- ❌ **NO** `node:path` or Node-specific modules
- ❌ **NO** `process.env` (use configuration files in `./app/config/` instead)
- ✅ **YES** `fetch()` API
- ✅ **YES** Web standard APIs (crypto, URL, etc.)
- ✅ **YES** Cloudflare Workers KV storage (if needed)

---

## React 19

Enjoy the latest React 19 with concurrent features enabled. Use imports from `react` and `react-dom`.

```tsx
import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
```

---

## React Router v7 (with Upstart Customizations)

The environment comes with **React Router v7** running in `data` mode with a custom routing system for Upstart.

### Important Terminology

- Upstart uses the word **"Page"** to refer to pages
- React Router uses the word **"Route"**
- **Both relate to the same concept** - a web page at a specific URL

### Key Differences from Standard React Router

1. **No `routes.ts` file** - The list of pages and their paths is automatically generated from the `attributes.path` exported in each page file

2. **No `export const meta = { ... }`** - Dynamic metadata is not supported via meta export:
   - For **dynamic pages**: Put `<title>My page title</title>` and meta description in the page component directly, and set `attributes.title` to `null` to prevent the Upstart editor from overriding it
   - For **static pages**: You can export `title`, `description`, and `keywords` in the `attributes` object exported in the page file

3. **Only import from `react-router`** - DO NOT use `react-router-dom` package

4. **JSON configuration files** - Upstart uses JSON configuration files to define:
   - Site attributes
   - Themes
   - Datasources
   - Forms schemas
   - Examples available in the `./app/config` folder

### Example Router Usage

```tsx
// ✅ CORRECT - import from react-router
import { useLoaderData, Form } from "react-router";

// ❌ WRONG - do not use react-router-dom
import { useLoaderData, Form } from "react-router-dom";
```

---

## TailwindCSS v4 & DaisyUI

The environment uses **TailwindCSS v4** with **DaisyUI**. Both are preconfigured and ready to use.

### CSS Configuration

The main CSS file is located at `./app/config/app.css`. You can **read** it, but editing it is the job of the **Designer Agent**. If you need CSS changes, report it to the Designer.

### Tailwind Plugins Already Installed

- `@tailwindcss/typography` (*prose*)
- `@tailwindcss/forms`
- `daisyui`

### Color & Styling

Always use **DaisyUI semantic colors** (`primary`, `secondary`, `accent`, `neutral`, `base-100/200/300`, etc.) instead of raw Tailwind colors. Never use colors like `bg-blue-500` - always use the semantic color system defined by the theme.

---

## Upstart SDK & Components

Upstart is both a platform and a framework (SDK + components) to build websites using an AI assistant and a visual editor.

### Core Concepts & Relationships

#### Site
A website described by a set of attributes.
- A site has a **Theme** defining the colors and fonts available
- A site can have **Datasources** to display dynamic content
- A site can have **Forms Schemas** to collect user-submitted data
- A site has one or more **Pages**

#### Theme
A set of available colors and fonts applied to the whole site. Themes are managed by the Designer Agent.

#### Page
A web page described by a set of attributes and organized into **Droppables**. Pages are the primary building blocks for site content.

#### Droppable
A page is composed of droppables that serve as containers for draggable components. Each droppable can contain multiple draggable components arranged horizontally or vertically based on the `direction` prop.

#### Draggable
A draggable component is a unit of content within a droppable that can be visually rearranged in the Upstart editor.

#### Datasource
Datasources represent a source of dynamic data that can be consumed by pages. Under the hood, it is backed by a database, but the user doesn't have to manage it directly.
- *"Datasource"* is the name used in code and the SDK
- *"Database"* is the name used in the UI and by users
- Datasources are **read-only** from the coder's perspective
- Datasources are mandatory for sites with dynamic content

#### Forms Schemas
A Form Schema is a defined destination for data submitted by users through forms and surveys.
- Forms Schemas are **write-only** - you can submit data to them
- They define the structure of user-submitted data
- Managed by the Data Architect Agent

#### Images
Images can be uploaded to the Upstart platform and used in various components. Images can be searched and/or generated with the AI assistant.

---

## File Imports & Path Aliases

You can use the `~/` path alias prefix to refer to the root folder of the project (the `./app` folder).

### Path Alias Examples

```tsx
import MyLayout from "~/layouts/my-layout";
import MyComponent from "~/components/my-component";
import { useMyHook } from "~/hooks/my-hook";
import { formatDate } from "~/utils/formatting";
```

### Equivalent Paths

- `./app/layouts/` ⟺ `~/layouts/`
- `./app/config/` ⟺ `~/config/`
- `./app/pages/` ⟺ `~/pages/`
- `./app/components/` ⟺ `~/components/`

---

## Authorized Libraries

You can only import from the following libraries in your code:

{{ AUTHORIZED_LIBRARIES }}

**Important:** DO NOT use any other library. It would not be available in the environment and would cause errors.

**NO OTHER LIBRARIES ARE AUTHORIZED.** You cannot ask for new libraries to be added.

---

## Environment Constraints Summary

### Must Remember

1. **Cloudflare Workers only** - No Node.js APIs, Web APIs only
2. **React Router v7** - Use `react-router`, not `react-router-dom`
3. **DaisyUI semantic colors** - Never use raw Tailwind colors
4. **`~/` path aliases** - Always use for imports
5. **Authorized libraries only** - No external dependencies beyond what's listed
6. **JSON configuration** - Themes, datasources, forms schemas are JSON files
7. **No meta export** - Use dynamic `<title>` and `<meta>` tags in components

### Development Workflow

1. Always read memory to understand project context
2. Check existing components, datasources, forms schemas before creating new ones
3. Use filesystem tools to validate structure
4. Report missing dependencies (datasources, forms schemas, images) - don't try to create them
5. Lint after every file change
6. Commit with clear messages

---

## When to Use This Skill

Use **environment-setup** when:
- You need to understand the development environment and constraints
- You're working with Cloudflare Workers limitations
- You're setting up React Router pages
- You need to understand Upstart concepts (pages, droppables, datasources, etc.)
- You're concerned about authorized libraries or imports

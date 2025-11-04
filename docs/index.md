---
layout: home

hero:
  name: "Carnet"
  text: "Manage your AI agents prompt using markdown"
  image:
    src: /dog-running.svg
    alt: Carnet
  tagline: Define, validate, and manage agents through markdown files
  actions:
    - theme: brand
      text: Get Started
      link: /guide/
    - theme: alt
      text: View on GitHub
      link: https://github.com/upstart-gg/carnet

features:
  - icon: 📝
    title: Markdown-First
    details: Define all agent content in git-friendly markdown files with YAML frontmatter
  - icon: ✅
    title: Build-Time Validation
    details: Catch broken references before deployment with comprehensive validation
  - icon: 📦
    title: Zero Runtime Overhead
    details: Compile to fast-loading JSON manifests for instant runtime loading
  - icon: 🔧
    title: Flexible API
    details: Use via CLI for compilation or programmatically in your application
  - icon: 🌍
    title: Multi-Runtime
    details: Works seamlessly with Node.js, Bun, and Deno
  - icon: 🎯
    title: Minimal Dependencies
    details: Only 3 production dependencies with no bloat
  - icon: 🔒
    title: Type-Safe
    details: Full TypeScript support with Zod validation throughout
  - icon: 🔄
    title: Watch Mode
    details: Rebuild automatically during development with hot reload
---


## Get Started

See the [Quick Start Guide](/guide/quick-start) to build your first agent in 5 minutes, or check the [Installation Guide](/guide/installation) for detailed setup instructions.

## Key Features

- **Markdown-Based** - Define agents in version-controlled markdown files
- **Build-Time Safety** - Validate all references before deployment
- **JSON Manifests** - Compile to fast-loading JSON for any language
- **Progressive Loading** - Efficiently load agent capabilities on demand
- **Vercel AI SDK Native** - Built specifically for Vercel AI SDK with zero abstraction

## Why Carnet?

**Standard Specification** - Carnet defines a clear, language-agnostic specification for declaring AI agents, skills, and tools. This standardization makes your agent definitions portable and tool-agnostic.

**Markdown-Based Content Management** - Agents, skills, and tools live in version-controlled markdown files, making them easy to manage alongside your code.

**Build-Time Safety** - All references are validated at build time, catching broken links and missing dependencies before they cause problems.

**Production Ready** - Compiled manifests load instantly with zero runtime parsing overhead, perfect for production environments.

**Developer Friendly** - Simple CLI, full TypeScript support, and flexible APIs make Carnet a joy to work with.

---

**Ready to build AI agents the right way?** [Get started with Carnet](/guide/)

# Getting Started with Carnet

**Carnet** is both a specification and a build system for managing AI agents through markdown files. It defines a standard format for declaring agents, skills, toolsets, and tools—then provides tools to compile, validate, and use them in your applications.

## How Carnet Works

Carnet follows a simple three-step workflow:

1. **Define** - Write markdown files describing your agents, skills, toolsets, and tools
2. **Build** - Use the Carnet CLI to parse and compile these markdown files into a manifest
3. **Use** - Load the manifest in your application and retrieve prompts, skills, and configurations

The key insight: markdown files are human-editable and version-controllable, while the compiled manifest is optimized for production runtime use.

### Language-Agnostic Design

While Carnet provides a JavaScript/TypeScript library for convenient access, the compiled manifest is a **standard JSON file** that any language can parse. Whether you're using Node.js, Python, Go, Rust, or any other runtime, you can read and use the Carnet manifest directly. This makes Carnet truly language-agnostic.

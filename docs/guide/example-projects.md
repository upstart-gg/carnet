# Example Projects

Explore complete working examples in the Carnet repository.

## Available Examples

The Carnet repository includes several complete example projects in the `examples/` directory:

### basic-cli
Simple command-line usage of the Carnet CLI.

**Use this to:**
- Learn basic CLI commands
- Understand the build process
- See minimal project structure

### nodejs-programmatic
Using Carnet as a library in Node.js with the JavaScript API.

**Use this to:**
- Learn programmatic API usage
- Integrate Carnet into your application
- Understand progressive loading patterns
- Work with variable injection

### ci-cd
Integrating Carnet into CI/CD pipelines.

**Use this to:**
- Automate manifest building
- Validate content in pipelines
- Integrate with GitHub Actions or similar
- Set up automated testing

### my-app
A comprehensive real-world example with multiple agents and complex hierarchy.

**Use this to:**
- See production-ready structure
- Learn advanced patterns
- Understand scaling to larger projects
- See best practices in action

## Running Examples

### Setup
```bash
cd examples/nodejs-programmatic
npm install
# or
bun install
```

### Build
```bash
npm run build
# Generates dist/carnet.manifest.json
```

### Run
```bash
npm run start
# Executes the example code
```

## Progressive Loading Example

The `nodejs-programmatic` example includes a complete progressive loading demonstration:

**examples/progressive-loading.ts**

This example shows:
- Loading a Carnet manifest from file
- Generating initial agent prompts
- Progressive loading of skills and tools
- Variable injection
- Tool calling patterns for LLM integration

Run it:
```bash
bun run examples/progressive-loading.ts
```

See the [Progressive Loading](/api/concepts/progressive-loading) API documentation for details on the pattern.

## Using Examples as Templates

### 1. Copy an Example

```bash
cp -r examples/nodejs-programmatic my-project
cd my-project
npm install
```

### 2. Customize

- Modify agent definitions in `content/agents/`
- Add your own skills in `content/skills/`
- Create toolsets and tools as needed

### 3. Build and Test

```bash
npm run build
npm start
```

## See Also

- [Quick Start](/guide/quick-start) - Get started in 5 minutes
- [Using with LLMs](/guide/using-with-llms) - Practical LLM integration examples
- [Patterns](/guide/patterns) - Common architectural patterns
- [Organizing Projects](/guide/organizing-projects) - Multi-agent system examples

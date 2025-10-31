# Carnet Examples

This directory contains examples demonstrating different ways to use Carnet for managing AI agent content.

## Examples Overview

### [basic-cli](./basic-cli/)
**Getting started with Carnet CLI**

- Simple agent setup with greeting functionality
- Demonstrates basic CLI commands: `init`, `build`, `validate`, `list`, `show`, `prompt`
- Shows watch mode for automatic rebuilding

### [nodejs-programmatic](./nodejs-programmatic/)
**Using Carnet in Node.js applications**

- Programmatic API usage with `loadManifest()` and `loadAgent()`
- Template variable substitution
- Integration patterns for Node.js projects

### [deno-programmatic](./deno-programmatic/)
**Using Carnet in Deno applications**

- Zero-installation usage with `npm:` specifiers
- TypeScript support out of the box
- Secure permission-based execution

### [ci-cd](./ci-cd/)
**CI/CD integration examples**

- GitHub Actions workflows
- GitLab CI pipelines
- Pre-commit hooks with husky
- VS Code tasks
- Docker integration
- Quality gates and testing

## Quick Start

1. **Try the CLI example:**
   ```bash
   cd examples/basic-cli
   # Follow the README instructions
   ```

2. **Run a programmatic example:**
   ```bash
   cd examples/nodejs-programmatic
   npm install
   cp -r ../basic-cli/dist ./dist
   npm start
   ```

3. **Set up CI/CD:**
   ```bash
   # Copy the workflow from examples/ci-cd/ to .github/workflows/
   ```

## Common Patterns

### Loading Agents

```typescript
// Primary entry point - load manifest
const manifest = await loadManifest('./dist/manifest.json');

// Load specific agent
const agent = await loadAgent(manifest, 'agent-name');

// Generate prompt with variables
const prompt = await agent.generatePrompt({
  variables: { KEY: 'value' }
});
```

### CLI Workflow

```bash
# Initialize project
carnet init

# Validate content
carnet validate --strict

# Build agents
carnet build

# Preview prompts
carnet prompt agent-name

# Watch for changes
carnet build --watch
```

### Configuration

Create `carnet.config.json` for advanced features:

```json
{
  "$schema": "./node_modules/@upstart.gg/carnet/schema/config.schema.json",
  "content": "./content",
  "output": "./dist",
  "templates": {
    "variables": {
      "API_ENDPOINT": "./config/api.json"
    }
  }
}
```

## Runtime Support

| Runtime | Installation | Example |
|---------|-------------|---------|
| Node.js | `npm install @upstart.gg/carnet` | [nodejs-programmatic](./nodejs-programmatic/) |
| Bun | `bun add @upstart.gg/carnet` | Works with Node.js example |
| Deno | No install needed | [deno-programmatic](./deno-programmatic/) |

## Next Steps

- Explore the [main documentation](../../AGENTS.md) for detailed API reference
- Check the [existing agent content](../../examples/my-app/) for comprehensive examples
- Read the [architecture overview](../../AGENTS.md#architecture) for design principles
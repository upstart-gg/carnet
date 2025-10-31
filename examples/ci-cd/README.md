# CI/CD Integration Example

This example shows how to integrate Carnet validation and building into your CI/CD pipeline.

## GitHub Actions

Create `.github/workflows/validate-agents.yml`:

```yaml
name: Validate Agents

on:
  push:
    paths:
      - 'content/**'
      - '.github/workflows/validate-agents.yml'
  pull_request:
    paths:
      - 'content/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1

      - name: Install dependencies
        run: bun install

      - name: Validate agents
        run: bunx carnet validate --strict

      - name: Build agents
        run: bunx carnet build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: agents-build
          path: dist/
```

## GitLab CI

Create `.gitlab-ci.yml`:

```yaml
stages:
  - validate
  - build

validate_agents:
  stage: validate
  image: oven/bun:latest
  before_script:
    - bun install
  script:
    - bunx carnet validate --strict
  only:
    changes:
      - content/**

build_agents:
  stage: build
  image: oven/bun:latest
  before_script:
    - bun install
  script:
    - bunx carnet build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week
  only:
    changes:
      - content/**
```

## Local Development

### Pre-commit Hooks

Use [husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/okonet/lint-staged) for pre-commit validation:

```bash
# Install dependencies
bun add -D husky lint-staged

# Initialize husky
bunx husky init

# Add pre-commit hook
echo 'bunx lint-staged' > .husky/pre-commit

# Configure lint-staged in package.json
{
  "lint-staged": {
    "content/**/*.{md,yml,yaml}": [
      "carnet validate",
      "carnet build"
    ]
  }
}
```

### VS Code Tasks

Add to `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Validate Agents",
      "type": "shell",
      "command": "bunx",
      "args": ["carnet", "validate", "--strict"],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "silent",
        "focus": false,
        "panel": "shared"
      },
      "problemMatcher": []
    },
    {
      "label": "Build Agents",
      "type": "shell",
      "command": "bunx",
      "args": ["carnet", "build"],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "silent",
        "focus": false,
        "panel": "shared"
      },
      "problemMatcher": []
    }
  ]
}
```

## Docker Integration

### Dockerfile for Agent Building

```dockerfile
FROM oven/bun:latest

WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy source
COPY . .

# Build agents
RUN bunx carnet build

# Your application would use the built agents from ./dist
```

### Docker Compose

```yaml
version: '3.8'
services:
  agent-builder:
    build: .
    volumes:
      - ./dist:/app/dist
    command: bunx carnet build --watch
```

## Quality Gates

### Validation in CI

Ensure all agent content is valid before deployment:

```bash
#!/bin/bash
set -e

echo "🔍 Validating agent content..."
bunx carnet validate --strict

echo "✅ Validation passed!"

echo "🏗️  Building agents..."
bunx carnet build

echo "✅ Build completed!"
```

### Testing Agent Prompts

Add tests to ensure prompts generate correctly:

```typescript
// tests/agent-prompts.test.ts
import { loadAgent, loadManifest } from '@upstart.gg/carnet';

describe('Agent Prompts', () => {
  it('should generate valid hello-world prompt', async () => {
    const manifest = await loadManifest('./dist/manifest.json');
    const agent = await loadAgent(manifest, 'hello-world');

    const prompt = await agent.generatePrompt({
      variables: { USER_NAME: 'Test' }
    });

    expect(prompt).toContain('Hello World Agent');
    expect(prompt).toContain('Test');
  });
});
```

## Best Practices

1. **Validate on every change** - Run validation in CI for all content changes
2. **Build artifacts** - Store built agents as CI artifacts
3. **Version control** - Commit both source markdown and built JSON
4. **Pre-commit hooks** - Prevent invalid content from being committed
5. **Parallel builds** - Use matrix builds for multiple runtime tests
6. **Caching** - Cache dependencies and built artifacts in CI
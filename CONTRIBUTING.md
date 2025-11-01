# Contributing to Carnet

Thank you for your interest in contributing to Carnet! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [Submitting Changes](#submitting-changes)
- [Code Style](#code-style)
- [Documentation](#documentation)

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Create a new branch for your feature or fix
4. Make your changes
5. Test your changes thoroughly
6. Create a changeset for your changes
7. Submit a pull request

## Development Setup

### Prerequisites

- Bun 1.3+ (check `.tool-versions` for exact version)

### Installation

```bash
# Install dependencies
bun install
```

### Development Commands

```bash
# Watch mode for development
bun dev

# Run tests
bun test

# Build the project
bun build

# Lint code
bun lint

# Format code
bun format --write src

# Generate documentation
bun run docs:dev

# Generate CLI documentation
bun run docs:gen:cli
```

## Making Changes

### Branch Naming

Use descriptive branch names:
- `feature/short-description` - for new features
- `fix/short-description` - for bug fixes
- `docs/short-description` - for documentation updates
- `refactor/short-description` - for code refactoring
- `test/short-description` - for test improvements

### Commit Messages

Write clear, descriptive commit messages:

```
feat: add support for environment variable config overrides

This allows CLI options to override configuration from both files and
environment variables, enabling more flexible workflows.

- Implement mergeConfigurations() utility for proper precedence
- Update build and lint commands to use new config merging
- Add tests for config precedence handling
```

Guidelines:
- Use imperative mood ("add" not "added" or "adds")
- Keep the first line under 50 characters
- Reference issues if applicable: "Fixes #123"
- Explain *why* the change was made, not just *what* changed

### Changesets

We use [changesets](https://github.com/changesets/changesets) to manage versioning and changelog generation.

When you've made changes, create a changeset:

```bash
# Create a new changeset
bun changeset

# Follow the prompts to:
# 1. Select the packages affected
# 2. Choose the semver bump (major, minor, patch)
# 3. Write a description of your changes
```

Changesets are stored in `.changeset/` directory and should be committed with your PR.

## Testing

### Running Tests

```bash
# Run all tests
bun test

# Run specific file
bun test tests/lib/config.test.ts

# Run tests matching pattern
bun test --grep "config"
```

### Writing Tests

- Place tests in `tests/` directory matching source structure
- Use descriptive test names that explain the expected behavior
- Follow existing test patterns in the codebase
- Test both happy paths and error cases
- Use `beforeEach` to set up test fixtures

Example:

```typescript
import { describe, it, expect, beforeEach } from 'bun:test'
import { mergeConfigurations, getDefaultConfig } from '../../src/lib/config'
import type { CarnetConfig } from '../../src/lib/schemas'

describe('ConfigSystem', () => {
  let defaultConfig: CarnetConfig

  beforeEach(() => {
    defaultConfig = getDefaultConfig()
  })

  it('should merge CLI options with highest priority', () => {
    const merged = mergeConfigurations(
      { baseDir: './content' },
      undefined,
      { baseDir: './custom' }
    )
    expect(merged.baseDir).toBe('./custom')
  })
})
```

## Code Quality

### Linting and Formatting

The project uses Biome for linting and formatting:

```bash
# Check code quality
bun lint

# Format code
bun format --write src
```

Biome configuration is in `biome.json`. All code must pass linting before submission.

### TypeScript

- Use strict TypeScript mode (enforced in `tsconfig.json`)
- Avoid `any` types - use specific types instead
- Use type-only imports when appropriate: `import type { Foo } from 'bar'`
- Add JSDoc comments to public APIs

## Submitting Changes

### Before You Submit

1. **Ensure all tests pass**: `bun test`
2. **Check linting**: `bun lint`
3. **Format code**: `bun format --write src`
4. **Create a changeset**: `bun changeset`
5. **Update documentation** if needed
6. **Add tests** for new functionality

### Creating a Pull Request

1. Push your branch to your fork
2. Create a pull request against the main branch
3. Fill in the PR template with:
   - **Description**: What changes were made and why
   - **Type**: feat, fix, docs, refactor, test
   - **Testing**: How to test the changes
   - **Breaking Changes**: Any breaking changes to the API

Example PR description:

```
## Description
Make config file optional and add comprehensive CLI option support.

## Type
- [x] Feature
- [ ] Bug fix
- [ ] Documentation
- [ ] Refactoring

## Testing
- Config file is optional: `carnet build` works without carnet.config.json
- CLI options override config file: `carnet build --output ./custom` overrides config
- All existing tests pass
- New adapter tests added with 100% coverage

## Breaking Changes
None - this is purely additive functionality.
```

### PR Review Process

- At least one approval required
- All CI checks must pass
- Address feedback from reviewers
- Keep commits clean and organized

## Code Style

### General Guidelines

- 2 spaces for indentation (enforced by Biome)
- 100 character line length (soft limit)
- Single quotes for strings (unless containing single quotes)
- Semicolons at end of statements
- Trailing commas in multi-line arrays/objects

### TypeScript Style

```typescript
// Use interfaces for object shapes
interface CarnetConfig {
  baseDir: string
  output: string
}

// Use type-only imports
import type { CarnetConfig } from './schemas'

// Use const for functions that won't be reassigned
const loadConfig = async (): Promise<CarnetConfig> => {
  // implementation
}

// Use descriptive variable names
const fileConfig = await loadConfigFile(options.config)

// Add JSDoc to public functions
/**
 * Load configuration file from disk
 * @param configPath Path to the config file
 * @returns Parsed configuration object
 */
export async function loadConfigFile(configPath: string): Promise<CarnetConfig> {
  // implementation
}
```

### Import Organization

```typescript
// 1. External packages
import { describe, it, expect } from 'bun:test'
import type { Command } from 'commander'

// 2. Internal absolute imports
import { loadConfigFile } from '@lib/config'
import { colors } from '../colors'

// 3. Internal relative imports
import { parseMarkdownFile } from '../../lib/parser'
```

## Documentation

### Code Documentation

- Add JSDoc comments to all public functions and classes
- Include parameter descriptions and return type
- Add usage examples for complex functions
- Update existing documentation when changing behavior

Example:

```typescript
/**
 * Merge multiple configuration sources with proper precedence
 *
 * Precedence order (lowest to highest):
 * 1. Schema defaults
 * 2. Configuration file
 * 3. Environment variables
 * 4. CLI options
 *
 * @param fileConfig Configuration from file (optional)
 * @param envConfig Configuration from environment (optional)
 * @param cliConfig Configuration from CLI options (optional)
 * @returns Merged and validated configuration
 *
 * @example
 * const config = mergeConfigurations(
 *   { baseDir: './content' },
 *   undefined,
 *   { output: './dist' }
 * )
 */
export function mergeConfigurations(
  fileConfig?: Partial<CarnetConfig>,
  envConfig?: Partial<CarnetConfig>,
  cliConfig?: Partial<CarnetConfig>,
): CarnetConfig {
  // implementation
}
```

### README and Guides

- Keep README.md up to date
- Update CLI reference documentation when adding options
- Add migration guides for breaking changes
- Include examples for new features

## Questions?

- Check existing [documentation](./docs/)
- Review [open issues](https://github.com/upstart-gg/carnet/issues)
- Open a discussion or issue for questions

## License

By contributing to Carnet, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Carnet! 🚀

# Carnet Production Readiness - Comprehensive Analysis & Todo List

> **Date**: November 1, 2025
> **Status**: 90% Production-Ready
> **Overall Grade**: A-

Project location /Users/matt/dev/carnet

---

## Executive Summary

**Carnet** is a well-engineered, well-documented build system and content management library for AI agents defined in markdown files. The architecture is solid, test coverage is good, and documentation is exceptional. However, the **configuration system needs a critical overhaul** to unlock the project's full potential.

### Key Finding
The most impactful blocker is the **required `carnet.config.json` file**. Making the config file optional with sensible defaults and adding comprehensive CLI option support will dramatically improve usability and enable flexible, scriptable workflows.

**Critical Path to Production: ~1.5-2 weeks** (with configuration system as highest priority)

---

## Part 1: Project Assessment

### 1.1 Strengths - CLI Tool

- ✅ **Well-structured commands** - Clean Commander.js implementation with 5 commands
- ✅ **Developer-friendly** - Watch mode for iterative development
- ✅ **Excellent UX** - Colored terminal output with clear status messages
- ✅ **Fast execution** - Bun-powered for quick builds
- ✅ **Comprehensive validation** - Catches reference errors at build time
- ✅ **Good documentation** - Auto-generated CLI reference docs
- ✅ **Config file support** - Zod-validated configuration system

### 1.2 Weaknesses - CLI Tool

- ⚠️ **Config file always required** - Cannot run CLI with options-only (major limitation)
- ⚠️ **No graceful fallback** - Hard failure if `carnet.config.json` missing
- ⚠️ **Inconsistent command behavior** - `list`/`show` ignore config file, `build`/`lint` require it
- ⚠️ **Limited CLI override options** - Only `baseDir` and `output` can be overridden via CLI
- ⚠️ **Broken example config** - `examples/my-app/carnet.config.json` uses wrong property name (`content` instead of `baseDir`)
- ⚠️ **Unused CLI option** - `--strict` flag defined but never implemented
- ⚠️ **No interactive mode** - Init command could use prompts for better UX
- ⚠️ **Limited error recovery** - No suggestions when validation fails
- ⚠️ **No diff/preview** - Build command doesn't show what changed

### 1.3 Strengths - Library

- ✅ **Clean API** - Simple, intuitive `Carnet` class with clear methods
- ✅ **Type-safe** - Strict TypeScript with Zod runtime validation
- ✅ **Progressive loading** - Unique on-demand skill loading system
- ✅ **Multi-SDK support** - Adapters for Vercel AI, OpenAI, and Anthropic
- ✅ **Zero runtime overhead** - Pre-compiled manifests load instantly
- ✅ **Flexible variables** - Custom and environment variable injection
- ✅ **Well-tested** - Good unit test coverage of core functionality
- ✅ **Minimal dependencies** - Only 4 production dependencies
- ✅ **Multi-runtime** - Works with Node.js, Bun, and Deno
- ✅ **Clean separation** - Library code independent of CLI code

### 1.4 Weaknesses - Library

- ⚠️ **No caching strategy** - Repeated content loads could benefit from caching
- ⚠️ **Limited error context** - Some errors lack actionable information
- ⚠️ **No adapter tests** - Vercel AI, OpenAI, and Anthropic adapters lack test coverage
- ⚠️ **No streaming API** - All content loaded synchronously
- ⚠️ **Missing JSDoc** - Source code lacks inline documentation
- ⚠️ **No plugin system** - Can't extend with custom adapters
- ⚠️ **No validation hooks** - Can't add custom validation logic
- ⚠️ **Limited manifest introspection** - Hard to query manifest structure programmatically

---

## Part 2: Configuration System - Deep Dive

### 2.1 Current State Issues

**Issue #1: Config File Always Required**
```typescript
// src/lib/config.ts
export async function loadConfigFile(configFilePath = 'carnet.config.json'): Promise<CarnetConfig> {
  try {
    const content = await fs.readFile(configFilePath, 'utf-8')
    const config = JSON.parse(content)
    return configSchema.parse(config)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`Configuration file not found: ${configFilePath}`)  // ❌ Hard failure
    }
    throw error
  }
}
```
**Problem**: Cannot run CLI without a config file, even with CLI options provided.

**Issue #2: Inconsistent Command Behavior**
```typescript
// build.ts and lint.ts - REQUIRE config file
const config = await loadConfigFile(options.config)

// list.ts and show.ts - IGNORE config file, hardcode defaults
const contentDir = options.dir || './carnet'
```
**Problem**: Some commands respect config, others ignore it entirely.

**Issue #3: Limited CLI Override Capability**
Only 2 config properties can be overridden:
- `baseDir` (via `-d, --dir`)
- `output` (via `-o, --output`)

No CLI options for:
- `variables`
- `envPrefix`
- `include`
- `exclude`
- `app.globalInitialSkills`
- `app.globalSkills`

**Issue #4: Broken Example Config**
```json
// examples/my-app/carnet.config.json (WRONG)
{
  "content": ".",     // ❌ Schema expects "baseDir"
  "output": "./dist"
}

// tests/carnet.config.json (CORRECT)
{
  "baseDir": "./content",  // ✅ Correct property name
  "output": "./dist"
}
```
**Problem**: Example config fails validation.

**Issue #5: Unused CLI Option**
```typescript
// build.ts defines --strict but never uses it
.option('--strict', 'enable strict validation')
```
**Problem**: Flag accepted but ignored.

### 2.2 Required Precedence Model

After fixes, precedence should be:
1. **Defaults** (from schema)
2. **Config file** (`carnet.config.json`)
3. **Environment variables** (`CARNET_*` prefix)
4. **CLI options** (highest priority)

Example:
```bash
# CLI option overrides everything
carnet build --output ./build

# Env var overrides config and defaults
CARNET_OUTPUT=./build carnet build

# Config file overrides defaults
# (carnet.config.json has output: "./dist")
carnet build
# Uses "./dist" from config

# No config, uses defaults
carnet build  # (if no config.json exists)
# Uses "./dist" (default)
```

---

## Part 3: Production Readiness Todos

### 3.1 🚨 Critical (Must Fix Before Launch)

#### Configuration System (CLI)

- [ ] **Make config file optional**
  - Allow CLI to run with sensible defaults when no config file exists
  - Use schema defaults when config missing
  - File: `src/lib/config.ts` → Update `loadConfigFile()` to return defaults

- [ ] **Implement full CLI option coverage**
  - Add `--variables` for custom variables (format: `key=value`)
  - Add `--env-prefix` for environment variable filtering
  - Add `--include` for glob patterns to include
  - Add `--exclude` for glob patterns to exclude
  - Add `--global-skills` for app.globalSkills
  - Add `--global-initial-skills` for app.globalInitialSkills

- [ ] **Fix broken example config**
  - `examples/my-app/carnet.config.json`: Change `"content"` to `"baseDir"`
  - Verify it passes validation

- [ ] **Standardize command behavior**
  - Make `list` and `show` commands respect config file like `build` and `lint`
  - Or document why they don't (if intentional)

- [ ] **Remove or implement `--strict` flag**
  - Either implement strict validation in build command
  - Or remove the option definition

- [ ] **Implement proper precedence**
  - Defaults → Config file → Env vars → CLI options
  - Create utility: `mergeConfigurations()` to handle precedence

#### Library (Core Functionality)

- [ ] **Add comprehensive adapter tests**
  - Test Vercel AI SDK adapter: `tests/lib/adapters/vercel-ai.test.ts`
  - Test OpenAI SDK adapter: `tests/lib/adapters/openai.test.ts`
  - Test Anthropic SDK adapter: `tests/lib/adapters/anthropic.test.ts`
  - Aim for 100% coverage of adapter code

- [ ] **Fix package.json exports**
  - Ensure `./schema/config.schema.json` exists or remove from exports
  - If exporting, generate JSON schema from Zod schema

- [ ] **Create custom error types**
  - `CarnetError` (base class)
  - `ConfigError` (config validation failures)
  - `ParseError` (markdown parsing failures)
  - `ValidationError` (schema validation failures)
  - `BuildError` (build process failures)
  - File: `src/lib/errors.ts`

- [ ] **Add JSDoc to all public APIs**
  - `src/lib/index.ts` - Carnet class and methods
  - `src/lib/builder.ts` - Builder functions
  - `src/lib/parser.ts` - Parser functions
  - `src/lib/discovery.ts` - Discovery functions
  - `src/lib/prompt-generator.ts` - Prompt generation methods
  - `src/lib/variable-injector.ts` - Variable injection methods

#### Project Files

- [ ] **Add LICENSE file to root**
  - Copy from existing reference or create MIT license file
  - Referenced in README but missing from root

- [ ] **Add CONTRIBUTING.md to root**
  - Move/expand from `docs/contributing/index.md`
  - Include: setup instructions, development workflow, PR guidelines

- [ ] **Create SECURITY.md**
  - Vulnerability reporting policy
  - Security contact information
  - Known security considerations

- [ ] **Create CHANGELOG.md**
  - User-facing changelog (not just changesets)
  - Document major versions and breaking changes
  - Upgrade migration guides

---

### 3.2 ⚡ Important (Should Fix Soon)

#### Configuration System (CLI)

- [ ] **Add environment variable support**
  - Parse `CARNET_BASE_DIR`, `CARNET_OUTPUT`, `CARNET_VARIABLES` etc.
  - Environment vars override config file but not CLI options

- [ ] **Support multiple config formats**
  - `carnet.config.json` (default)
  - `carnet.config.js` (CommonJS)
  - `carnet.config.mjs` (ESM)
  - `carnet.config.ts` (TypeScript, requires tsx/esbuild)

- [ ] **Add config validation command**
  - `carnet validate` - Validates `carnet.config.json` and all content
  - `carnet validate --config-only` - Just validate config file
  - Useful for CI/CD pipelines

- [ ] **Generate JSON schema from Zod**
  - Create `schema/config.schema.json` from `configSchema`
  - Enables IDE autocomplete and validation
  - Tools: `zod-to-json-schema` package

#### CLI Improvements

- [ ] **Interactive init command**
  - Use `@inquirer/prompts` or similar
  - Prompt for: project name, description, content directory, output directory
  - Optionally create first agent template

- [ ] **Add build diff output**
  - Show file additions, modifications, deletions
  - Use colors for readability
  - Option: `carnet build --diff` or `--verbose`

- [ ] **Add dry-run mode**
  - `carnet build --dry-run` - shows what would be written without writing
  - Useful for CI/CD and validation

- [ ] **Better error formatting**
  - Show file:line:column for validation errors
  - Include error context (surrounding lines)
  - Suggest fixes when possible

- [ ] **Add migration helpers**
  - `carnet migrate` - Update content to new schema version
  - Useful when entity schemas change

- [ ] **Improve error recovery**
  - When validation fails, suggest next steps
  - Example: "Config property 'basDir' is unknown. Did you mean 'baseDir'?"

#### Library Improvements

- [ ] **Implement caching layer**
  - Cache loaded agents, skills, toolsets, tools
  - Add TTL option to invalidate cache after time
  - Manual cache clearing method

- [ ] **Add streaming API**
  - `streamPrompt()` - Stream prompt generation for memory efficiency
  - Useful for large agents with many skills

- [ ] **Improve error messages**
  - Add context to Zod validation errors
  - Include suggestions for fixes
  - Better error messages in builder

- [ ] **Add manifest query API**
  - `getAgentNames()`, `getSkillNames()` etc.
  - `hasAgent(name)`, `hasSkill(name)` etc.
  - `getAgentDependencies(name)` - show what agent depends on
  - Introspection methods for programmatic access

- [ ] **Add validation hooks**
  - Allow custom validation logic in config or code
  - Hook before/after validation
  - Enable custom rules beyond schema

- [ ] **Add performance benchmarks**
  - Benchmark manifest loading time
  - Benchmark prompt generation
  - Benchmark large manifests (1000+ entities)
  - Track regressions

#### Shared/Both

- [ ] **Add migration guide**
  - Document upgrade path between versions
  - Breaking changes clearly marked
  - Code examples for migrations

- [ ] **Expand troubleshooting docs**
  - Add common issues and solutions
  - FAQ for frequent questions

- [ ] **Add comparison documentation**
  - Compare with alternatives (LangChain, Semantic Kernel, etc.)
  - Feature matrix
  - When to use Carnet vs alternatives

- [ ] **Security audit**
  - Review for potential security vulnerabilities
  - Check dependencies for known issues
  - Implement security scanning in CI

---

### 3.3 💡 Nice to Have (Future Enhancements)

#### CLI - Nice to Have Features

- [ ] **Add watch mode filtering** - `carnet build --watch --filter agents/`
- [ ] **Add stats command** - `carnet stats` shows manifest size, entity counts
- [ ] **Add graph visualization** - Generate dependency graph (text or image)
- [ ] **Add search command** - Full-text search across content
- [ ] **Add template system** - Pre-built agent templates (`carnet init --template starter`)
- [ ] **Command aliases** - Shortcuts like `carnet b` for `build`
- [ ] **Shell completions** - Generate bash/zsh/fish completion scripts
- [ ] **Progress indicators** - Spinners/progress bars for long operations
- [ ] **JSON output mode** - `--json` flag for scripting and parsing
- [ ] **Color themes** - Allow customization or theme selection
- [ ] **Config init helper** - `carnet init --config-only` to just create config

#### Library - Nice to Have Features

- [ ] **Plugin system** - Extensible adapters and validators
- [ ] **Hot reloading** - Reload manifest without restarting application
- [ ] **Content versioning** - Track content changes over time
- [ ] **Remote manifests** - Load from URLs or CDN
- [ ] **Partial manifests** - Load only specific agents/skills
- [ ] **Compression support** - Gzip manifests for smaller size
- [ ] **Builder pattern** - Fluent API for configuration
- [ ] **Event system** - Emit events for lifecycle hooks (onLoad, onError, etc.)
- [ ] **Memory management** - Memory limits and content eviction
- [ ] **Lazy loading** - Defer loading until content actually needed
- [ ] **Schema versioning** - Support multiple schema versions
- [ ] **Content transformation hooks** - Transform before use

#### Shared - Nice to Have

- [ ] **Bundle size optimization** - Tree-shake unused adapters
- [ ] **ESM/CJS dual build** - Support CommonJS in addition to ESM
- [ ] **Source maps** - Include source maps in dist for debugging
- [ ] **Code coverage badges** - Add to README
- [ ] **Automated dependency updates** - Renovate or Dependabot
- [ ] **Pre-commit hooks** - Run linting/tests before commit
- [ ] **Performance dashboard** - Track metrics over time
- [ ] **Community support chat** - Discord or Slack channel
- [ ] **Video tutorials** - Screen recordings for key features
- [ ] **Blog/newsletter** - Share tips and updates

---

## Part 4: Codebase Improvements

### 4.1 CLI Codebase Improvements

#### High Priority (Configuration)

1. **Make config optional with defaults**
   - File: `src/lib/config.ts`
   - Change `loadConfigFile()` to return defaults if file missing
   - Add new function `loadConfig()` that handles precedence

2. **Add comprehensive CLI options**
   - File: `src/cli/index.ts`
   - Add options: `--variables`, `--env-prefix`, `--include`, `--exclude`, `--global-skills`
   - Support multiple values: `--variables KEY=VALUE --variables KEY2=VALUE2`

3. **Standardize config handling**
   - File: `src/cli/commands/*.ts`
   - Extract shared config loading logic
   - Create `loadConfigForCommand()` utility

#### Medium Priority (DX)

4. **Better error messages**
   - File: `src/cli/index.ts`
   - Add file:line:column to error output
   - Add suggestions for common mistakes

5. **Dry-run mode**
   - File: `src/cli/commands/build.ts`
   - Add `--dry-run` option
   - Show what would be written without writing

6. **Interactive init**
   - File: `src/cli/commands/init.ts`
   - Use `@inquirer/prompts` package
   - Prompt for project details

#### Low Priority

7. **Debug/verbose modes** - `--debug` flag with detailed logging
8. **Progress indicators** - Spinners for long operations
9. **Shell completions** - Generate completion scripts

### 4.2 Library Codebase Improvements

#### High Priority

1. **Custom error types**
   - Create: `src/lib/errors.ts`
   - Implement error hierarchy
   - Better error context and messages

2. **JSDoc everywhere**
   - File: All `.ts` files in `src/lib/`
   - Document all public functions and classes
   - Add parameter descriptions and return types

3. **Adapter tests**
   - Create: `tests/lib/adapters/vercel-ai.test.ts`
   - Create: `tests/lib/adapters/openai.test.ts`
   - Create: `tests/lib/adapters/anthropic.test.ts`
   - 100% coverage of adapter code

#### Medium Priority

4. **Caching layer**
   - File: `src/lib/index.ts` (Carnet class)
   - Add internal cache property
   - Methods: `cache.set()`, `cache.get()`, `cache.clear()`

5. **Manifest query API**
   - File: `src/lib/index.ts`
   - Add methods: `getAgentNames()`, `hasAgent(name)`, etc.
   - Enable programmatic introspection

6. **Streaming API**
   - File: `src/lib/prompt-generator.ts`
   - Add async generator: `streamPrompt()`
   - For memory-efficient streaming

#### Low Priority

7. **Plugin system** - Allow custom adapters
8. **Event system** - Emit lifecycle events
9. **Hot reloading** - Reload without restart

### 4.3 Shared Codebase Improvements

#### High Priority

1. **Add missing files** - LICENSE, CONTRIBUTING.md, SECURITY.md, CHANGELOG.md
2. **Fix package exports** - Ensure schema files exist or update exports
3. **Fix example config** - Change `content` to `baseDir`

#### Medium Priority

4. **Testing utilities** - Export helpers for testing apps using Carnet
5. **Better examples** - More real-world integration examples
6. **Source maps** - Include in dist build

#### Low Priority

7. **Bundle optimization** - Tree-shake unused code
8. **ESM/CJS dual build** - Support both module types
9. **Code coverage** - Automated coverage reporting

---

## Part 5: Documentation Improvements

### 5.1 CLI Documentation

#### High Priority

1. **Configuration guide** - How to use config file vs CLI options vs env vars
2. **CLI reference updates** - Document all new CLI options
3. **Error reference** - Catalog of common errors and solutions
4. **Migration guides** - How to upgrade config format
5. **CLI-only examples** - Show usage without config file

#### Medium Priority

6. **CI/CD integration guide** - GitHub Actions, GitLab CI, Jenkins examples
7. **Video tutorials** - Screen recordings
8. **Performance tuning** - Tips for fast builds
9. **Command cheat sheet** - Quick reference
10. **Shell integration** - Completion script docs

### 5.2 Library Documentation

#### High Priority

1. **JSDoc API reference** - Auto-generated from source
2. **Configuration API guide** - How to configure Carnet programmatically
3. **Error handling guide** - Handle different error types
4. **Adapter creation guide** - Build custom adapters
5. **Testing guide** - How to test Carnet-based apps

#### Medium Priority

6. **Architecture diagrams** - Visual system design
7. **Performance guide** - Best practices for large manifests
8. **Recipe collection** - Common patterns
9. **Migration guides** - Version upgrades
10. **Comparison table** - Feature comparison with alternatives

### 5.3 Shared Documentation

#### High Priority

1. **Getting started overhaul** - Path from zero to first agent (with/without config)
2. **Best practices** - Content organization style guide
3. **Troubleshooting expansion** - Common issues with solutions
4. **Config schema docs** - Auto-generated from Zod

#### Medium Priority

5. **Video content** - 5-minute quick start
6. **Example improvements** - Fix broken examples
7. **Case studies** - How others use Carnet
8. **Benchmark results** - Performance data
9. **Public roadmap** - Feature planning

### 5.4 Examples Improvements

#### Critical Fixes

- [ ] **Fix my-app config** - Change `content` to `baseDir`
- [ ] **Add CLI-only example** - Show usage without config file

#### High Priority

- [ ] **Next.js integration** - Full-stack App Router example
- [ ] **Express.js API** - Backend API usage
- [ ] **Testing example** - How to test Carnet apps
- [ ] **Error handling patterns** - Comprehensive error handling

#### Medium Priority

- [ ] **Claude Code integration** - Using with Claude Code
- [ ] **Multi-agent system** - Complex orchestration
- [ ] **RAG implementation** - Retrieval-augmented generation
- [ ] **Streaming example** - Real-time responses

#### Low Priority

- [ ] **Deployment examples** - Docker, serverless, Vercel
- [ ] **Monorepo setup** - Multiple packages
- [ ] **Custom adapter** - Build custom adapters
- [ ] **Advanced patterns** - Complex scenarios

---

## Part 6: Production Launch Roadmap

### Phase 1: Configuration System Overhaul (CRITICAL)
**Duration**: 2-3 days
**Blocker for launch**: YES

This is the highest priority and biggest usability issue.

#### Checklist
- [ ] Make config file optional with defaults
- [ ] Add all CLI options (--variables, --env-prefix, --include, --exclude, --global-skills)
- [ ] Fix broken example config
- [ ] Standardize command behavior
- [ ] Implement precedence (defaults → config → env → CLI)
- [ ] Remove or implement --strict flag
- [ ] Add tests for all new options
- [ ] Update CLI documentation

#### Success Criteria
- Can run `carnet build` without any config file
- `carnet build --output ./build` overrides config file
- All commands work consistently
- Examples pass validation

### Phase 2: Essential Fixes (QUALITY)
**Duration**: 3-4 days
**Blocker for launch**: YES

Core functionality completeness and quality.

#### Checklist
- [ ] Add adapter tests (100% coverage)
- [ ] Create custom error types
- [ ] Add JSDoc to all public APIs
- [ ] Fix package.json exports
- [ ] Add LICENSE, CONTRIBUTING.md, SECURITY.md files
- [ ] Fix broken example config
- [ ] Add CHANGELOG.md
- [ ] Run full test suite

#### Success Criteria
- 90%+ test coverage
- All adapters tested
- All public APIs documented
- No missing files
- All tests pass

### Phase 3: Polish & Launch (READY)
**Duration**: 2-3 days
**Blocker for launch**: NO

Final polish for launch and user success.

#### Checklist
- [ ] Create migration guides
- [ ] Add error reference documentation
- [ ] Create video tutorials
- [ ] Add performance benchmarks
- [ ] Security audit
- [ ] Final documentation review
- [ ] Create announcement/blog post
- [ ] Publish to npm (if not already)

#### Success Criteria
- All documentation complete
- Video tutorials available
- Performance benchmarks established
- Security audit passed
- Ready for announcement

---

## Summary & Recommendations

### Current Status
- **Architecture**: ⭐⭐⭐⭐⭐ Excellent
- **Code Quality**: ⭐⭐⭐⭐⭐ Excellent
- **Testing**: ⭐⭐⭐⭐☆ Good (missing adapter tests)
- **Documentation**: ⭐⭐⭐⭐⭐ Excellent
- **Configuration**: ⭐⭐⭐☆☆ Needs Work (highest priority)
- **Overall**: **A- (90% Production-Ready)**

### Critical Path Summary

**Must Fix Before Launch:**
1. ✨ **Configuration system overhaul** (make optional, add CLI options)
2. 🔒 **Adapter test coverage** (complete test suite)
3. 📝 **Add missing files** (LICENSE, CONTRIBUTING.md, SECURITY.md)
4. 🐛 **Fix example config** (content → baseDir)
5. 📖 **JSDoc all public APIs** (documentation)

**Should Fix Before Launch:**
6. 🎯 **Custom error types** (better error handling)
7. 🔧 **Config validation command** (CI/CD support)
8. 📚 **CHANGELOG.md** (user communication)
9. ⚡ **Better error messages** (user experience)
10. 🧪 **Caching layer** (performance)

**Nice to Have:**
- Interactive init with prompts
- Build diff output
- Streaming API
- Plugin system
- Video tutorials

### Effort Estimate

| Phase | Tasks | Effort | Priority |
|-------|-------|--------|----------|
| **Phase 1** | Config system overhaul | 2-3 days | CRITICAL |
| **Phase 2** | Essential fixes & quality | 3-4 days | CRITICAL |
| **Phase 3** | Polish & launch prep | 2-3 days | Important |
| **Total** | All production tasks | **7-10 days** | - |

### Launch Readiness Checklist

**Before Announcing Production-Ready:**
- [ ] Phase 1: Configuration system complete
- [ ] Phase 2: All critical items fixed
- [ ] Test suite: 90%+ coverage
- [ ] All adapters tested
- [ ] Documentation complete and reviewed
- [ ] Examples working and validated
- [ ] LICENSE and CONTRIBUTING files present
- [ ] CHANGELOG created
- [ ] Security audit passed
- [ ] Performance benchmarks established

---

## Notes for Implementation

### Key Files to Modify

**Critical Changes:**
- `src/lib/config.ts` - Make config optional, add merging logic
- `src/cli/index.ts` - Add all new CLI options
- `src/cli/commands/*.ts` - Update all commands to use new config system
- `examples/my-app/carnet.config.json` - Fix property name
- `package.json` - Verify schema export path
- Root directory - Add LICENSE, CONTRIBUTING.md, SECURITY.md

**New Files to Create:**
- `src/lib/errors.ts` - Custom error types
- `tests/lib/adapters/vercel-ai.test.ts` - Adapter tests
- `tests/lib/adapters/openai.test.ts` - Adapter tests
- `tests/lib/adapters/anthropic.test.ts` - Adapter tests
- `TODO.md` - This file (tracking document)
- `CHANGELOG.md` - User changelog
- `SECURITY.md` - Security policy
- `schema/config.schema.json` - JSON schema for IDE support

**Documentation to Expand:**
- `docs/guide/` - Add configuration guides, migration guides
- `docs/api/` - Add JSDoc-generated reference
- Root `README.md` - Clarify CLI-only usage
- `docs/troubleshooting.md` - Expand error reference

### Testing Strategy

1. **Unit tests** - Already good, add adapter tests
2. **Integration tests** - Config system, CLI options, precedence
3. **Example validation** - All examples must work as documented
4. **Manual testing** - Full workflow with and without config
5. **Performance testing** - Large manifests, build times

### Documentation Strategy

1. **Auto-generate** where possible (JSDoc, schema docs)
2. **Prioritize clarity** - Real examples over abstract explanations
3. **Multiple learning paths** - Quick start, API reference, examples
4. **Keep updated** - Update docs with each code change

---

## Questions & Clarifications

### For Matt (Project Owner)

1. **Config override precedence** - Is the precedence model I outlined correct? (Defaults → Config → Env → CLI)

ANSWER: Yes, that precedence model is exactly what we want.

2. **Multiple CLI values** - For `--variables`, should we support:
   - `--variables KEY=VALUE --variables KEY2=VALUE2` (current style)
   - Or `--variables KEY=VALUE,KEY2=VALUE2` (comma-separated)
   - Or `--variables "{KEY:VALUE,KEY2:VALUE2}"` (JSON)?

ANSWER: We should support the current style: `--variables KEY=VALUE --variables KEY2=VALUE2`.

3. **Config format support** - Beyond `.json`, should we support `.js`, `.ts`, `.mjs`?

ANSWER: No.

4. **Adapter plugin system** - Is there interest in a plugin API for custom adapters, or keep it simple?

ANSWER: Let's keep it simple for now; no plugin system needed.

5. **Streaming API** - Is streaming for large prompts a real need, or nice-to-have?

ANSWER: It's not needed at all for now.

---

## Version

- **Analyzed**: November 1, 2025
- **Analyst**: Claude Code
- **Project**: Carnet v0.1.0
- **Status**: Pre-production

---

**Last Updated**: November 1, 2025
**Next Review**: After Phase 1 completion

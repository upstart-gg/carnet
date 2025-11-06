# Unused Code Review Report

**Generated:** 2025-11-06
**Branch:** claude/review-unused-code-011CUrKCQB4XsMksTgkY6QGS
**Reviewer:** Claude Code Automated Analysis

## Executive Summary

This report identifies unused code in the Carnet codebase that can potentially be removed or needs attention. The analysis found **approximately 200-250 lines** of completely unused code across error classes, type definitions, schemas, and public methods.

### High Priority Findings
- 4 unused error classes with type guards (ConfigError, ParseError, BuildError)
- 1 critical documentation/implementation mismatch (error module not exported)
- 4 unused public methods in the Carnet class
- 2 unused type definitions
- 1 unused schema definition

---

## 1. Error Module Issues (CRITICAL)

### Location
`src/lib/errors.ts`

### Issue: Documentation/Implementation Mismatch

The error handling utilities are **documented as public API** in the following locations:
- `docs/api/error-handling.md`
- `docs/guide/vercel-ai-sdk.md`

However, **none of these error classes are exported** from the main entry point (`src/lib/index.ts`).

### Unused Error Classes

The following error classes are **defined but never thrown** anywhere in the codebase:

#### 1. `ConfigError` (lines 34-40)
```typescript
export class ConfigError extends CarnetError
```
- **Status:** Never thrown
- **Type guard:** `isConfigError()` (line 108) - Never used except in `formatError()`
- **Impact:** Dead code, cannot be reached

#### 2. `ParseError` (lines 45-61)
```typescript
export class ParseError extends CarnetError
```
- **Status:** Never thrown
- **Type guard:** `isParseError()` (line 115) - Only used in `formatError()` line 140
- **Impact:** Dead code path in formatError()

#### 3. `BuildError` (lines 87-96)
```typescript
export class BuildError extends CarnetError
```
- **Status:** Never thrown
- **Type guard:** `isBuildError()` (line 129) - Only used in `formatError()` line 158
- **Impact:** Dead code path in formatError()

**Note:** Only `ValidationError` is actually used (thrown in `src/lib/index.ts` at multiple locations).

### Unused Type Guards

These type guard functions exist but are never called in production code:

- `isConfigError()` (line 108)
- `isValidationError()` (line 122) - Documented but never used

### Not Exported but Documented

The following are used internally but **documented as public API** without being exported:

- `formatError()` (line 136) - Documented in `docs/api/error-handling.md` but not exported from `src/lib/index.ts`
- All error classes mentioned above

### Recommendation

**Option 1: Remove unused error classes**
- Remove `ConfigError`, `ParseError`, `BuildError`
- Remove their associated type guards
- Clean up `formatError()` to only handle `ValidationError`
- Update documentation to reflect actual API

**Option 2: Export error classes (if they're intended for future use)**
- Add exports to `src/lib/index.ts`
- Keep documentation as-is
- Document that they're currently only for future use

**Option 3: Use the error classes**
- Actually throw these errors in appropriate places:
  - `ConfigError` in `src/lib/config.ts`
  - `ParseError` in `src/lib/parser.ts`
  - `BuildError` in `src/lib/builder.ts`

---

## 2. Unused Public Methods in Carnet Class

### Location
`src/lib/index.ts`

### Unused Methods

#### 1. `static MANIFEST_FILENAME` (line 59)
```typescript
static MANIFEST_FILENAME = 'carnet.manifest.json'
```
- **Status:** Never referenced anywhere
- **LOC:** 1 line
- **Recommendation:** Remove or document usage

#### 2. `getDiscoveredSkills(agentName: string)` (lines 111-114)
```typescript
public getDiscoveredSkills(agentName: string): string[]
```
- **Status:** Never called in production or tests
- **Purpose:** Returns discovered skills for a session
- **LOC:** 4 lines
- **Documented:** Yes, in `docs/api/index.md` and `docs/guide/vercel-ai-sdk.md`
- **Recommendation:** Remove if truly unused, or add to docs as utility method

#### 3. `getAvailableTools(agentName: string)` (lines 116-119)
```typescript
public getAvailableTools(agentName: string): string[]
```
- **Status:** Never called in production or tests
- **Purpose:** Returns available domain tools
- **LOC:** 4 lines
- **Documented:** Yes, in `docs/api/index.md` and `docs/guide/vercel-ai-sdk.md`
- **Recommendation:** Remove if truly unused, or add usage examples

#### 4. `getSessionState(agentName: string)` (lines 131-141)
```typescript
public getSessionState(agentName: string): CarnetSessionState | null
```
- **Status:** Never called in production or tests
- **Purpose:** Inspects current session state for debugging
- **LOC:** 11 lines
- **Documented:** Yes, extensively in `docs/api/index.md` and `docs/guide/vercel-ai-sdk.md`
- **Recommendation:** This appears to be an intentional debugging API. Consider adding test coverage.

### Minimally Used Methods

#### 5. `resetSession(agentName: string)` (lines 121-123)
```typescript
public resetSession(agentName: string): void
```
- **Status:** Called once in `/home/user/carnet/tests/integration/domain-tools.test.ts:167`
- **Purpose:** Resets session state
- **LOC:** 3 lines
- **Recommendation:** Keep, but add more test coverage

---

## 3. Unused Type Definitions

### Location
`src/lib/types.ts`

#### 1. `GeneratePromptOptions` (lines 25-29)
```typescript
export interface GeneratePromptOptions {
  includeSkills?: string[]
  excludeSkills?: string[]
  variables?: Record<string, string>
}
```
- **Status:** Defined but never used
- **LOC:** 5 lines
- **Appears superseded by:** `GenerateAgentPromptOptions` (lines 38-45)
- **Recommendation:** Remove - it's been replaced by a better interface

#### 2. `SessionState` (lines 83-88)
```typescript
export interface SessionState {
  agentName: string
  discoveredSkills: readonly string[]
  loadedToolsets: readonly string[]
  exposedDomainTools: readonly string[]
}
```
- **Status:** Defined but never used
- **LOC:** 6 lines
- **Similar to:** `CarnetSessionState` (lines 74-80) which IS used
- **Difference:** Uses readonly arrays instead of Sets
- **Recommendation:** Remove unless it was intended as a public readonly variant

---

## 4. Unused Schema Definitions

### Location
`src/lib/schemas.ts`

#### 1. `agentCapabilitySchema` (lines 74-76)
```typescript
export const agentCapabilitySchema = z.enum(['createCustomAgent'])
  .describe('Capabilities that can be granted to an agent')
```
- **Status:** Defined but never referenced
- **LOC:** 3 lines
- **Purpose:** Appears to be for a planned feature that was never implemented
- **Recommendation:** Remove or implement the feature

#### 2. `agentSchemaBase` (lines 78-99)
```typescript
export const agentSchemaBase = z.object({ ... })
```
- **Status:** Only used internally to create `agentSchema` (line 107)
- **LOC:** 22 lines
- **Exported:** Yes, but only used once internally
- **Recommendation:** Consider making it not exported (internal utility)

---

## 5. Methods Only Used in Tests

These methods are exported as public API but only called in test files. Consider whether they should remain public or be marked as internal.

### PromptGenerator Class Methods

**Location:** `src/lib/prompt-generator.ts`

#### 1. `generateSkillMetadataSection()` (line 125)
- **Status:** Only used in `tests/lib/prompt-generator.test.ts`
- **Recommendation:** Consider marking as `@internal` or making private

#### 2. `generateToolsetMetadataSection()` (line 143)
- **Status:** Only used in `tests/lib/prompt-generator.test.ts`
- **Recommendation:** Consider marking as `@internal` or making private

### ToolRegistry Class Methods

**Location:** `src/lib/tool-registry.ts`

#### 1. `listToolsets()` (line 58)
```typescript
public listToolsets(): string[]
```
- **Status:** Only used in `tests/lib/tool-registry.test.ts`
- **Recommendation:** Consider if this should be public API or test-only

### VariableInjector Methods

**Location:** `src/lib/variable-injector.ts`

#### 1. `hasVariables(content: string)` (lines 63-65)
```typescript
public hasVariables(content: string): boolean
```
- **Status:** Only used in `tests/lib/variable-injector.test.ts`
- **Purpose:** Check if content contains variable placeholders
- **Recommendation:** Could be useful utility - consider documenting or removing

---

## 6. Summary Statistics

### Completely Unused Code (High Priority)
| Category | Count | Lines of Code |
|----------|-------|---------------|
| Error Classes | 3 | ~60 lines |
| Type Guards | 3 | ~15 lines |
| Type Definitions | 2 | ~11 lines |
| Schema Definitions | 1 | ~3 lines |
| Carnet Public Methods | 4 | ~20 lines |
| **Total** | **13 items** | **~109 lines** |

### Test-Only Code (Medium Priority)
| Category | Count | Lines of Code |
|----------|-------|---------------|
| PromptGenerator methods | 2 | ~40 lines |
| ToolRegistry methods | 1 | ~5 lines |
| VariableInjector methods | 1 | ~3 lines |
| **Total** | **4 items** | **~48 lines** |

### Documentation Mismatches (Critical)
| Issue | Impact |
|-------|--------|
| Error module not exported | Users cannot import documented error classes |
| Methods documented but unused | API surface appears larger than it is |

---

## 7. Recommendations by Priority

### Priority 1: Critical Issues (Do First)

1. **Fix Error Module Export Issue**
   - Either export error classes from `src/lib/index.ts` OR remove from documentation
   - Decision needed: Are these errors part of public API?

2. **Remove Unused Error Classes (if not part of API)**
   - Remove `ConfigError`, `ParseError`, `BuildError`
   - Remove their type guards: `isConfigError`, `isBuildError`
   - Simplify `formatError()` function
   - Update documentation

### Priority 2: Remove Dead Code

3. **Remove Unused Types**
   - Remove `GeneratePromptOptions` interface
   - Remove `SessionState` interface
   - Remove `agentCapabilitySchema`

4. **Review Unused Public Methods**
   - Decide on `getDiscoveredSkills`, `getAvailableTools`, `getSessionState`
   - Either remove them or add test coverage and usage examples
   - Remove `MANIFEST_FILENAME` constant

### Priority 3: Code Quality Improvements

5. **Mark Test-Only Methods as Internal**
   - Add `@internal` JSDoc tags to methods only used in tests
   - Or make them private if they shouldn't be public API

6. **Add Linting Rules**
   - Configure linter to catch unused exports
   - Add pre-commit hooks to prevent unused code

---

## 8. Specific Action Items

### Immediate Actions (Can be automated)

```typescript
// Files to modify:
// 1. src/lib/errors.ts
//    - Remove ConfigError, ParseError, BuildError
//    - Remove isConfigError, isBuildError type guards
//    - Simplify formatError()

// 2. src/lib/types.ts
//    - Remove GeneratePromptOptions (line 25-29)
//    - Remove SessionState (line 83-88)

// 3. src/lib/schemas.ts
//    - Remove agentCapabilitySchema (line 74-76)

// 4. src/lib/index.ts
//    - Remove MANIFEST_FILENAME (line 59)
//    - Consider removing getDiscoveredSkills (line 111-114)
//    - Consider removing getAvailableTools (line 116-119)
//    - Consider removing getSessionState (line 131-141)

// 5. Documentation
//    - Update docs/api/error-handling.md
//    - Update docs/api/index.md
//    - Update docs/guide/vercel-ai-sdk.md
```

### Estimated Impact

- **Lines removed:** ~150-200 lines
- **Files affected:** 7 files
- **Tests to update:** Minimal (most unused code has no tests)
- **Documentation to update:** 3 files
- **Breaking changes:** None if error classes weren't actually being used externally

---

## 9. Files Requiring Changes

### Source Code Files
1. `src/lib/errors.ts` - Remove unused error classes
2. `src/lib/types.ts` - Remove unused type definitions
3. `src/lib/schemas.ts` - Remove unused schemas
4. `src/lib/index.ts` - Remove unused methods, OR export error classes

### Documentation Files
1. `docs/api/error-handling.md` - Update to reflect actual exports
2. `docs/api/index.md` - Update method listings
3. `docs/guide/vercel-ai-sdk.md` - Update examples

### Test Files
- Minimal changes needed (most unused code lacks tests)

---

## 10. Questions for Maintainers

Before removing code, please clarify:

1. **Error Classes:** Were `ConfigError`, `ParseError`, and `BuildError` intended for future use or can they be removed?

2. **Session Methods:** Are `getDiscoveredSkills`, `getAvailableTools`, and `getSessionState` intentionally public for debugging, or can they be removed?

3. **MANIFEST_FILENAME:** Was this constant meant to be used somewhere?

4. **Test-Only Methods:** Should methods only used in tests be marked `@internal` or made private?

---

## Conclusion

This codebase is generally well-maintained, but contains approximately **~150-200 lines of unused code** that can be safely removed. The most critical issue is the **documentation/implementation mismatch** for error classes, which should be addressed first.

Removing this unused code will:
- Reduce bundle size
- Improve code maintainability
- Reduce cognitive load for new contributors
- Align documentation with implementation
- Clarify the actual public API surface

**Next Steps:**
1. Review this report with maintainers
2. Make decisions on ambiguous items (questions section)
3. Create PRs to remove confirmed unused code
4. Update documentation to match implementation
5. Add linting rules to prevent future unused code

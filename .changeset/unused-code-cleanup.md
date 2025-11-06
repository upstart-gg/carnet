---
"@upstart.gg/carnet": patch
---

Export error classes and add comprehensive error handling

This release fixes a critical documentation/implementation mismatch and improves error handling across the library:

**New Exports:**
- All error classes now properly exported: `CarnetError`, `ConfigError`, `ParseError`, `BuildError`, `ValidationError`
- Error type guards: `isCarnetError`, `isConfigError`, `isParseError`, `isBuildError`, `isValidationError`
- Error formatting utility: `formatError`

**Error Handling Improvements:**
- `ConfigError` now thrown for config loading and validation failures in `loadConfigFile()` and `mergeConfigurations()`
- `ParseError` now thrown for markdown parsing errors in `parseMarkdownFile()` and `parseToolFile()`
- `BuildError` now thrown for build validation failures including reference validation and file operations

**Testing:**
- Added comprehensive test coverage for debugging helper methods: `getDiscoveredSkills()`, `getAvailableTools()`, `getSessionState()`, `resetSession()`, and `MANIFEST_FILENAME`
- 10 new test cases ensuring session management and debugging features work correctly

**Code Quality:**
- Removed unused type definitions: `GeneratePromptOptions`, `SessionState`
- Removed unused schema: `agentCapabilitySchema`
- Updated error handling documentation with accurate usage examples

This is a **non-breaking change** - only additions to the public API surface. All existing code will continue to work unchanged.

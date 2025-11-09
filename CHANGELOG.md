# @upstart.gg/carnet

## 0.1.14

### Patch Changes

- [#41](https://github.com/upstart-gg/carnet/pull/41) [`d0ad3c9`](https://github.com/upstart-gg/carnet/commit/d0ad3c9f8e904c5f34b41582924800c32b8a0084) Thanks [@mattallty](https://github.com/mattallty)! - Fix cli fs handling

## 0.1.13

### Patch Changes

- [#39](https://github.com/upstart-gg/carnet/pull/39) [`30e5f51`](https://github.com/upstart-gg/carnet/commit/30e5f51abc601a818b9ac4a95102da040e379ad9) Thanks [@mattallty](https://github.com/mattallty)! - Fix CLI directory resolution to respect the directory where commands are invoked. All CLI commands now use the INIT_CWD environment variable (set by npm/pnpm/yarn) to correctly resolve the carnet directory relative to where the command was run, not where the package is installed. This fixes issues when running commands from subdirectories in monorepos.

## 0.1.12

### Patch Changes

- [#37](https://github.com/upstart-gg/carnet/pull/37) [`faa456a`](https://github.com/upstart-gg/carnet/commit/faa456ab1f012defcc94811e313e4358eb4c7ccb) Thanks [@mattallty](https://github.com/mattallty)! - Fix CLI directory path resolution to properly handle relative paths against process.cwd(). All CLI commands (build, lint, list, show) now use path.resolve() to ensure directory paths work correctly regardless of the current working directory.

## 0.1.11

### Patch Changes

- [#33](https://github.com/upstart-gg/carnet/pull/33) [`a9c5a47`](https://github.com/upstart-gg/carnet/commit/a9c5a47343ba9cc1ca52249a15f8afde75599bc2) Thanks [@mattallty](https://github.com/mattallty)! - Improve variable injection documentation and examples

  Enhanced documentation for the variable injection feature with clearer examples demonstrating both static (constructor-level) and dynamic (method-level) variable usage patterns. Fixed incorrect API signatures and added comprehensive JSDoc examples showing how to use getSystemPrompt() with runtime variables for dynamic prompt adaptation.

- [#35](https://github.com/upstart-gg/carnet/pull/35) [`7325f3d`](https://github.com/upstart-gg/carnet/commit/7325f3dec77145cba039bb023cb409aad5846256) Thanks [@mattallty](https://github.com/mattallty)! - Export error classes and add comprehensive error handling

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

## 0.1.10

### Patch Changes

- [#31](https://github.com/upstart-gg/carnet/pull/31) [`ad7e389`](https://github.com/upstart-gg/carnet/commit/ad7e389a1b95a94bf39cd8997254291ad53f3b7e) Thanks [@mattallty](https://github.com/mattallty)! - Update docs and fix default output dir

## 0.1.9

### Patch Changes

- [#26](https://github.com/upstart-gg/carnet/pull/26) [`291c635`](https://github.com/upstart-gg/carnet/commit/291c63589c35ddffce28dc454f178f0b70b60a1f) Thanks [@mattallty](https://github.com/mattallty)! - Docs update

- [#30](https://github.com/upstart-gg/carnet/pull/30) [`7c62f19`](https://github.com/upstart-gg/carnet/commit/7c62f198ca9054b4630c5dbd94420e00f34b43d6) Thanks [@mattallty](https://github.com/mattallty)! - feat: Simplify API using direct constructor call

## 0.1.8

### Patch Changes

- [#24](https://github.com/upstart-gg/carnet/pull/24) [`097811e`](https://github.com/upstart-gg/carnet/commit/097811e4d47be884d30bca4e5c4f71c16656ddd5) Thanks [@mattallty](https://github.com/mattallty)! - Fix prompt handling

## 0.1.7

### Patch Changes

- [#22](https://github.com/upstart-gg/carnet/pull/22) [`094c2a7`](https://github.com/upstart-gg/carnet/commit/094c2a7c735a24f15b07b5835a04f5c661a051ab) Thanks [@mattallty](https://github.com/mattallty)! - Minor change

## 0.1.6

### Patch Changes

- [#20](https://github.com/upstart-gg/carnet/pull/20) [`911bef2`](https://github.com/upstart-gg/carnet/commit/911bef22ef45b7f42761419f2537ebaef89b447c) Thanks [@mattallty](https://github.com/mattallty)! - Work on release workflow

## 0.1.5

### Patch Changes

- [#17](https://github.com/upstart-gg/carnet/pull/17) [`e30cd3d`](https://github.com/upstart-gg/carnet/commit/e30cd3dc35e6ecdd6c481f18de34f0b4c4036dce) Thanks [@mattallty](https://github.com/mattallty)! - Release with cli fixed

- [#19](https://github.com/upstart-gg/carnet/pull/19) [`6647eca`](https://github.com/upstart-gg/carnet/commit/6647ecae059e60b6e970865363dd53ba062972c0) Thanks [@mattallty](https://github.com/mattallty)! - Fix release workflow

## 0.1.4

### Patch Changes

- [`04317f9`](https://github.com/upstart-gg/carnet/commit/04317f945162f1d70b8aa36b50c9ffe8d6c08dd4) Thanks [@mattallty](https://github.com/mattallty)! - fix cli

- [#14](https://github.com/upstart-gg/carnet/pull/14) [`6b4c0c3`](https://github.com/upstart-gg/carnet/commit/6b4c0c3377eaaef5ffc026af688bfc58566c6051) Thanks [@mattallty](https://github.com/mattallty)! - Add loadSkillFile() feature

- [#14](https://github.com/upstart-gg/carnet/pull/14) [`6b4c0c3`](https://github.com/upstart-gg/carnet/commit/6b4c0c3377eaaef5ffc026af688bfc58566c6051) Thanks [@mattallty](https://github.com/mattallty)! - Rework schemas

## 0.1.3

### Patch Changes

- [#12](https://github.com/upstart-gg/carnet/pull/12) [`b5befcc`](https://github.com/upstart-gg/carnet/commit/b5befcc2e61775a5c5677387adf10d1b6d1eb75e) Thanks [@mattallty](https://github.com/mattallty)! - Test release 4

## 0.1.2

### Patch Changes

- [#8](https://github.com/upstart-gg/carnet/pull/8) [`87dca89`](https://github.com/upstart-gg/carnet/commit/87dca89d290c3a1f7d2592795848aa24d0ccc834) Thanks [@mattallty](https://github.com/mattallty)! - Fix exports of lib + dts

- [#11](https://github.com/upstart-gg/carnet/pull/11) [`5d4d33b`](https://github.com/upstart-gg/carnet/commit/5d4d33b3547c1877f45b69c0390a0249adb998f5) Thanks [@mattallty](https://github.com/mattallty)! - Fix release

## 0.1.1

### Patch Changes

- [#2](https://github.com/upstart-gg/carnet/pull/2) [`79ae758`](https://github.com/upstart-gg/carnet/commit/79ae75850edd2a2a46dbcf818fc363654c4ee8bd) Thanks [@mattallty](https://github.com/mattallty)! - Test release

---
"@upstart.gg/carnet": patch
---

Fix CLI directory path resolution to properly handle relative paths against process.cwd(). All CLI commands (build, lint, list, show) now use path.resolve() to ensure directory paths work correctly regardless of the current working directory.

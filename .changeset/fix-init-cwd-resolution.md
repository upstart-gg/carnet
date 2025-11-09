---
"@upstart.gg/carnet": patch
---

Fix CLI directory resolution to respect the directory where commands are invoked. All CLI commands now use the INIT_CWD environment variable (set by npm/pnpm/yarn) to correctly resolve the carnet directory relative to where the command was run, not where the package is installed. This fixes issues when running commands from subdirectories in monorepos.

# `carnet lint`

Lint markdown files

## Usage

```bash
carnet lint
```

## Options

| Option | Description |
|--------|-------------|
| `-v, --variables <key=value...>` | custom variables to inject (can be used multiple times) |
| `--env-prefix <prefix...>` | environment variable prefixes to allow (can be used multiple times) |
| `--include <pattern...>` | glob patterns to include (can be used multiple times) |
| `--exclude <pattern...>` | glob patterns to exclude (can be used multiple times) |
| `--global-skills <skill...>` | global skills available to all agents (can be used multiple times) |
| `--global-initial-skills <skill...>` | initial skills available to all agents at startup (can be used multiple times) |
| `-c, --config <path>` | path to the carnet config file |
| `-d, --dir <dir>` | content directory (default: ./carnet) |
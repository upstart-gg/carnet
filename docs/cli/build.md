# `carnet build`

Build markdown files into JSON artifacts

## Usage

```bash
carnet build
```

## Options

| Option | Description |
|--------|-------------|
| `-o, --output <dir>` | Directory where compiled manifests will be written. Defaults to `./dist`. |
| `-w, --watch` | Watch the content directory for changes and automatically rebuild when files are modified. Useful during development. |
| `-v, --variables <key=value...>` | Inject custom variables into the build context in `KEY=VALUE` format. Can be used multiple times. Variables are available for substitution in markdown files. |
| `--env-prefix <prefix...>` | Allow environment variables with specific prefixes to be used in markdown. For example, `--env-prefix API_` allows `$API_KEY` to be substituted. Can be used multiple times. |
| `--include <pattern...>` | Glob patterns to explicitly include markdown files. Can be used multiple times. If specified, only matching files are processed. |
| `--exclude <pattern...>` | Glob patterns to exclude from processing. Can be used multiple times. Takes precedence over include patterns. |
| `--global-skills <skill...>` | Skills to make available to all agents. These are injected into every agent's skill list. Can be used multiple times. |
| `--global-initial-skills <skill...>` | Skills that should be loaded by default when an agent starts. Applied globally to all agents. Can be used multiple times. |
| `-c, --config <path>` | Path to the carnet.config.json configuration file. If not specified, looks for `./carnet/carnet.config.json` by default. |
| `-d, --dir <dir>` | Content directory containing agents, skills, and toolsets. Defaults to `./carnet`. |
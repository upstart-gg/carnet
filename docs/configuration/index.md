# Configuration

Configure Carnet with `carnet.config.json`.

## Configuration File

Create `carnet.config.json` in your project root:

```json
{
  "baseDir": "./content",
  "output": "./dist",
  "app": {
    "globalInitialSkills": [],
    "globalSkills": []
  },
  "variables": {},
  "envPrefix": ["CARNET_", "PUBLIC_"],
  "include": [],
  "exclude": []
}
```

## Options

### baseDir
Directory containing entity markdown files.
- Default: `./content`
- Type: string

### output
Directory where manifest is written.
- Default: `./dist`
- Type: string

### app
Global agent configuration.
- `globalInitialSkills` - Skills auto-loaded for all agents
- `globalSkills` - Skills available to all agents

### variables
Template variables for content substitution.
- Type: Record<string, string>
- See [Variables](/configuration/variables) for details

### envPrefixes
Environment variable prefixes allowed for substitution.
- Default: `["CARNET_", "PUBLIC_"]`
- Type: string[]
- See [Variables](/configuration/variables) for details

### include
Glob patterns to include.
- Type: string[]
- If specified, only matching files are discovered

### exclude
Glob patterns to exclude.
- Type: string[]
- Examples: `**/draft/**`, `**/*.example.md`

## Learn More

- [Config File](/configuration/config-file) - Detailed configuration options
- [Variables](/configuration/variables) - Template variables and environment substitution
- [Configuration Patterns](/configuration/patterns) - Common configuration patterns and best practices

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

## Content Structure

Before building, you need to organize your agents, skills, toolsets, and tools in the content directory. See these guides to understand how to structure your content:

- [Agents](/configuration/content-structure/agents) - AI agents with prompts and skills
- [Skills](/configuration/content-structure/skills) - Capabilities that group tools
- [Toolsets](/configuration/content-structure/toolsets) - Collections of related tools
- [Tools](/configuration/content-structure/tools) - Individual capabilities or functions

After you've structured your content, the `carnet build` command compiles everything into a production-ready manifest. See the [Manifest Schema](/configuration/manifest-schema) for details on the compiled output.

## Learn More

- [Config File](/configuration/config-file) - Detailed configuration options
- [Variables](/configuration/variables) - Template variables and environment substitution
- [Configuration Patterns](/configuration/patterns) - Common configuration patterns and best practices

# Configuration Schema

The `carnet.config.json` configuration file defines how your Carnet project builds and processes content.

## Configuration Options

All options are optional and have sensible defaults.

### `baseDir`

- **Type:** `string`
- **Default:** `"./carnet"`
- **Description:** Path to the content directory containing agents, skills, toolsets, and tools

### `output`

- **Type:** `string`
- **Default:** `"./dist"`
- **Description:** Output directory where the compiled manifest.json will be written

### `app`

- **Type:** `AppConfig`
- **Description:** Application-level configuration for skills and capabilities

### `variables`

- **Type:** `Record<string, string>`
- **Default:** `{}`
- **Description:** Custom variables to be injected into markdown content using `{{ VARIABLE_NAME }}` syntax

### `envPrefix`

- **Type:** `string[]`
- **Default:** `["CARNET_", "PUBLIC_"]`
- **Description:** Environment variable prefixes that are allowed to be injected into content

### `include`

- **Type:** `string[]`
- **Default:** `[]`
- **Description:** Glob patterns of content files or directories to include in processing

### `exclude`

- **Type:** `string[]`
- **Default:** `[]`
- **Description:** Glob patterns of content files or directories to exclude from processing

## Example Configuration

```json
{
  "baseDir": "./content",
  "output": "./dist",
  "app": {
    "globalInitialSkills": ["common"],
    "globalSkills": ["utilities"]
  },
  "variables": {
    "COMPANY": "Acme Corp",
    "SUPPORT_EMAIL": "support@acme.com"
  },
  "envPrefix": ["CARNET_", "PUBLIC_"],
  "include": ["agents/**", "skills/**"],
  "exclude": ["**/draft/**"]
}
```
# carnet build

Build markdown files into a compiled manifest.

## Usage

```bash
carnet build [options]
```

## Options

- `-o, --output <dir>` - Output directory for manifest (default: from config)
- `-w, --watch` - Watch mode (rebuild on file changes)
- `--strict` - Strict validation (fail on warnings)

## Global Options

- `-c, --config <path>` - Config file path
- `--content <dir>` - Content directory

## Examples

Build once:
```bash
carnet build
```

Watch mode during development:
```bash
carnet build --watch
```

Custom output directory:
```bash
carnet build --output ./public/data
```

Custom config:
```bash
carnet build --config carnet.prod.json
```

Combine options:
```bash
carnet build --watch --content ./agents --output ./dist
```

## Output

The build command:
1. **Discovers** all markdown files in content directory
2. **Parses** YAML frontmatter and markdown content
3. **Validates** schemas and references
4. **Generates** `carnet.manifest.json`
5. **Writes** to output directory

The manifest contains all agents, skills, toolsets, and tools in JSON format, ready for runtime use.

## Watch Mode

In watch mode, Carnet automatically rebuilds when you:
- Create new markdown files
- Modify existing files
- Delete files

Useful during development for immediate feedback.

## Validation

The build process validates:
- **Schema validation** - All entities conform to their schemas
- **Reference validation** - All referenced skills, toolsets, tools exist
- **Naming validation** - Unique names for all entities

Build fails if any validation errors are found. Use `--strict` to fail on warnings too.

## Configuration

Build behavior is controlled by your config file:

```json
{
  "baseDir": "./content",
  "output": "./dist",
  "variables": {},
  "envPrefix": ["CARNET_"],
  "include": [],
  "exclude": []
}
```

Override with CLI options:
```bash
carnet build --content ./agents --output ./build
```

## Related Commands

- [`validate`](/cli/validate) - Validate without building
- [`list`](/cli/list) - View structure
- [`show`](/cli/show) - Show entity details

## Troubleshooting

**Build fails with unknown entity:**
- Check spelling in skill/toolset/tool references
- Ensure referenced files exist in content directory

**File changes not detected in watch mode:**
- Some editors require you to save to trigger rebuild
- Check that files are being saved to disk

**Performance issues:**
- Reduce content size
- Use `include` or `exclude` patterns in config
- Check disk I/O

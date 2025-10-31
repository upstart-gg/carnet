# carnet validate

Validate content without building.

## Usage

```bash
carnet validate
```

## Options

None (uses global options only)

## Global Options

- `-c, --config <path>` - Config file path
- `--content <dir>` - Content directory

## Examples

Validate with default config:
```bash
carnet validate
```

Validate specific directory:
```bash
carnet validate --content ./agents
```

Validate with custom config:
```bash
carnet validate --config carnet.prod.json
```

## What It Validates

The validate command checks:

1. **Schema Validation**
   - All entities have required fields
   - Field types are correct
   - No invalid data

2. **Reference Validation**
   - All referenced skills exist
   - All referenced toolsets exist
   - All referenced tools exist
   - No broken links

3. **Structure Validation**
   - Proper directory structure
   - Valid markdown format
   - Valid YAML frontmatter

## Output

Success:
```
✓ Validation successful!
```

Failure:
```
✗ Validation failed: [error details]
```

## Use Cases

- **Before deployment** - Ensure nothing is broken
- **In CI/CD** - Validate on every commit
- **Development** - Check for errors without building
- **Scripting** - Validate programmatically

## CI/CD Example

```bash
#!/bin/bash
carnet validate || exit 1
carnet build
npm run deploy
```

## Performance

Validate is faster than build because it doesn't generate output files.

Use for quick checks during development.

## Related Commands

- [`build`](/cli/build) - Build and validate
- [`list`](/cli/list) - View structure
- [`show`](/cli/show) - Show entity details

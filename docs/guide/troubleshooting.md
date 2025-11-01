# Troubleshooting

Solutions to common problems and error messages.

## Build & Validation Errors

### "Unknown skill referenced"

**Error:** Agent references a skill that doesn't exist.

**Example:**
```
Error: Skill not found: advanced-analysis
```

**Solution:**

1. Check spelling in agent's `skills` array:
```yaml
# Check for typos
skills:
  - advanced-analysis  # Typo? Did you mean advanced-analysis?
```

2. Verify the skill markdown file exists:
```bash
ls content/skills/advanced-analysis/SKILL.md
```

3. Check that skill name in file matches:
```yaml
---
name: advanced-analysis  # Must match filename location
```

### "Unknown toolset referenced"

**Error:** Skill references a toolset that doesn't exist.

**Solution:** Same as above, but for toolsets:
```bash
ls content/toolsets/my-toolset/TOOLSET.md
```

### "Unknown tool referenced"

**Error:** Toolset references a tool that doesn't exist.

**Solution:** Verify tool files exist:
```bash
ls content/tools/my-tool.md
```

## Entity Reference Errors

### "Circular dependency"

**Error:** Tools, toolsets, or skills form a circular reference.

**Example:**
```
Skill A → Toolset X → Skill A (circular!)
```

**Solution:** Restructure your hierarchy to avoid cycles:

```
✓ Correct hierarchy:
  Agent → Skill → Toolset → Tool

✗ Avoid circular references:
  Skill → Toolset → Skill (circular!)
  Tool → Toolset → Tool (backwards!)
```

### "Missing entity"

**Error:** A referenced entity (agent, skill, toolset, or tool) doesn't exist.

**Solution:**

1. Run validation to see all missing references:
```bash
carnet lint
```

2. Create the missing entity or fix the reference

3. Use list commands to verify entities exist:
```bash
carnet list --type agents
carnet list --type skills
carnet list --type toolsets
carnet list --type tools
```

## Configuration Issues

### "Content directory does not exist"

**Error:** The `baseDir` in config doesn't exist.

**Solution:**

1. Check config file:
```json
{
  "baseDir": "./content"  // Does this directory exist?
}
```

2. Create the directory:
```bash
mkdir -p content
```

3. Or update config to correct path:
```json
{
  "baseDir": "./my-content"
}
```

### Invalid config format

**Error:** The `carnet.config.json` file has syntax errors.

**Solution:**

1. Validate JSON:
```bash
jq . carnet.config.json  # Shows errors if invalid
```

2. Common issues:
   - Missing commas between properties
   - Trailing commas in arrays/objects
   - Unquoted property names
   - Invalid string escapes

### Variable not found

**Error:** Referenced variable doesn't exist or isn't available.

**Solution:**

1. Check config variables:
```json
{
  "variables": {
    "MY_VAR": "value"
  }
}
```

2. Check environment prefixes if using env vars:
```json
{
  "envPrefixes": ["CARNET_", "PUBLIC_"]
}
```

3. Verify environment variables are set:
```bash
echo $MY_VAR
# or
CARNET_MY_VAR=value carnet build
```

## Naming Issues

### Invalid entity names

**Error:** Entity name contains invalid characters.

**Valid characters:**
- Letters: a-z, A-Z
- Numbers: 0-9
- Underscores: _
- Hyphens: - (agents, skills, toolsets only, NOT tools)

**Examples:**
```yaml
---
# ✓ Valid
name: my-skill
name: my_skill
name: mySkill

# ✗ Invalid
name: my skill          # spaces not allowed
name: my-skill.v2       # periods not allowed
name: my.tool           # tools cannot have hyphens
---
```

## File Structure Issues

### "Malformed frontmatter"

**Error:** YAML frontmatter in markdown file is invalid.

**Solution:** Check the frontmatter block:

```markdown
---
name: my-agent
description: A helpful agent
---

# Content goes here
```

Requirements:
- Must start with `---` on its own line
- YAML properties with valid syntax
- Must end with `---` on its own line
- Content comes after closing `---`

### Missing required fields

**Error:** Entity is missing required metadata fields.

**Solution:** Ensure all required fields are present:

**Agent (AGENT.md):**
```yaml
---
name: string (required)
description: string (required)
initialSkills: string[] (required)
skills: string[] (required)
prompt: string (required)
---
```

**Skill (SKILL.md):**
```yaml
---
name: string (required)
description: string (required)
toolsets: string[] (required)
---
```

**Toolset (TOOLSET.md):**
```yaml
---
name: string (required)
description: string (required)
tools: string[] (required)
---
```

**Tool (tool-name.md):**
```yaml
---
name: string (required)
description: string (required)
---
```

## API/Programmatic Issues

### "Manifest file not found"

**Error:** When loading manifest with Carnet.fromManifest()

```typescript
const carnet = await Carnet.fromManifest('./dist/carnet.manifest.json')
// Error: Manifest file not found
```

**Solution:**

1. Build the manifest first:
```bash
carnet build
```

2. Verify the manifest exists:
```bash
ls -la dist/carnet.manifest.json
```

3. Check the path is correct and relative to where code runs.

### "Skill/Tool not found" (API)

**Error:** When calling API methods with non-existent entities:

```typescript
const content = carnet.getSkillContent('nonexistent')
// Error: Skill not found: nonexistent
```

**Solution:**

1. Use list methods first to discover available entities:
```typescript
const skills = carnet.listAvailableSkills('my-agent')
console.log(skills.map(s => s.name))  // See what's available
```

2. Handle errors gracefully:
```typescript
try {
  const content = carnet.getSkillContent('my-skill')
} catch (error) {
  console.error('Skill not found:', error.message)
}
```

## Getting Help

### Debug with CLI Commands

List entities to verify they exist:
```bash
carnet list --type agents
carnet list --type skills
carnet list --type toolsets
carnet list --type tools
```

Show specific entity details:
```bash
carnet show agent my-agent
carnet show skill my-skill
```

Run validation:
```bash
carnet lint
```

### Enable Debug Output

Set environment variable:
```bash
DEBUG=carnet:* carnet build
```

### Check GitHub Issues

Search for similar issues:
https://github.com/upstart-gg/carnet/issues

## See Also

- [Core Concepts](/guide/concepts) - Architecture fundamentals
- [Patterns](/guide/patterns) - Common design patterns
- [CLI Reference](/cli/) - All CLI commands
- [API Reference](/api/) - Programmatic API reference

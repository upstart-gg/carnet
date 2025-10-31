# carnet show

Display entity details.

## Usage

```bash
carnet show <type> <name>
```

## Arguments

- `<type>` - Entity type: `agent`, `skill`, `toolset`, or `tool`
- `<name>` - Entity name

## Global Options

- `-c, --config <path>` - Config file path
- `--content <dir>` - Content directory

## Examples

Show agent details:
```bash
carnet show agent coder
```

Show skill details:
```bash
carnet show skill code-generation
```

Show toolset details:
```bash
carnet show toolset code-formatter
```

Show tool details:
```bash
carnet show tool prettier
```

Show with custom config:
```bash
carnet show agent coder --config carnet.prod.json
```

## Output

The command displays:

**For Agents:**
- Name and description
- Initial skills (auto-loaded)
- Available skills (on-demand)
- Prompt (system message)
- Content preview

**For Skills:**
- Name and description
- Referenced toolsets
- Content/documentation

**For Toolsets:**
- Name and description
- Referenced tools
- Content/documentation

**For Tools:**
- Name and description
- Content/documentation

## Use Cases

- **Understanding entities** - See full details of a specific entity
- **Debugging** - Check references and connections
- **Documentation** - Share entity details
- **Development** - Review prompts and descriptions

## Example Output

```bash
$ carnet show agent coder

Agent: coder
Description: An AI assistant specialized in code generation and debugging

Initial Skills:
  - code-execution

Available Skills:
  - code-generation
  - debugging
  - testing
  - documentation

Prompt:
  You are an AI code assistant with expertise in multiple programming languages.

  Your role is to:
  1. Help write, debug, and improve code
  2. Explain programming concepts
  3. Suggest optimizations
  4. Follow best practices

  Always provide clear explanations with your code suggestions.

Content:
  # Coder Agent

  This agent specializes in software development tasks...
```

## Related Commands

- [`list`](/cli/list) - View project structure
- [`validate`](/cli/validate) - Validate content
- [`build`](/cli/build) - Build the project

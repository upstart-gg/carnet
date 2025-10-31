# carnet list

Display agents in tree format.

## Usage

```bash
carnet list [agent]
```

## Arguments

- `[agent]` - Specific agent name (optional, shows all if not provided)

## Global Options

- `-c, --config <path>` - Config file path
- `--content <dir>` - Content directory

## Examples

Show all agents:
```bash
carnet list
```

Show specific agent:
```bash
carnet list coder
```

Show with custom config:
```bash
carnet list --config carnet.prod.json
```

## Output Example

```
coder
├── code-execution
│   └── python-runner
│       ├── jupyter-kernel
│       └── script-runner
├── code-generation
│   └── code-formatter
│       ├── prettier
│       └── eslint
└── debugging
    └── debugger
        ├── breakpoint-setter
        └── variable-inspector

researcher
├── search
│   └── search-tools
│       ├── google-search
│       └── arxiv-search
└── analysis
    └── analysis-tools
        ├── text-summarizer
        └── pattern-detector
```

## Structure

The output shows:
- **Agents** - Top level
- **Skills** - Under agents
- **Toolsets** - Under skills
- **Tools** - Under toolsets

Connected with ASCII box-drawing characters:
- `├──` - Non-last item
- `└──` - Last item
- `│` - Vertical line continuing down

## Use Cases

- **Understanding structure** - See how your agents are organized
- **Debugging** - Verify skills and toolsets are properly connected
- **Documentation** - Share the hierarchy with others
- **Planning** - Design new agents based on existing structure

## Filtering

Show only a specific agent:
```bash
carnet list my-agent
```

This is useful for:
- Focused debugging
- Checking individual agent structure
- Reducing output for large projects

## Related Commands

- [`show`](/cli/show) - Show entity details
- [`validate`](/cli/validate) - Validate structure
- [`build`](/cli/build) - Build the project

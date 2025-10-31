# Node.js Programmatic Example

This example shows how to use Carnet programmatically in a Node.js application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy the built agents from the basic-cli example:
```bash
cp -r ../basic-cli/dist ./dist
```

## Usage

Run the example:
```bash
npm start
```

This will:
- Load the manifest and list available agents
- Load the hello-world agent
- Generate a prompt with template variables
- Display the results

## Code Overview

The main code in `index.js` demonstrates:

1. **Loading the manifest** - Primary entry point for discovering agents
2. **Loading an agent** - Using the manifest to load a specific agent
3. **Generating prompts** - Creating agent prompts with variable substitution

## Key Concepts

- **Manifest**: Index of all available agents with metadata
- **Agent**: Complete agent definition with all resolved dependencies
- **Prompt Generation**: Assemble markdown content with variable replacement

## Integration

To use Carnet in your own Node.js project:

```javascript
import { loadAgent, loadManifest } from '@upstart.gg/carnet';

// Load and use agents programmatically
const manifest = await loadManifest('./path/to/manifest.json');
const agent = await loadAgent(manifest, 'your-agent');
const prompt = await agent.generatePrompt({ variables: { ... } });
```
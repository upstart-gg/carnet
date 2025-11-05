# Manifest Schema

The Carnet manifest is a compiled JSON file that contains all your agents, skills, toolsets, and tools in an optimized, production-ready format.

## Overview

When you run `carnet build`, the CLI parses your markdown files and compiles them into a single `carnet.manifest.json` file. This manifest is language-agnostic and can be consumed by any application in any programming language.

## JSON Schema

Below is the complete JSON Schema for the Carnet manifest:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Carnet Manifest Schema",
  "description": "Schema of the generated Carnet manifest",
  "type": "object",
  "required": [
    "version",
    "app",
    "agents",
    "skills",
    "toolsets",
    "tools"
  ],
  "properties": {
    "version": {
      "type": "number",
      "description": "Version of the manifest schema",
      "default": 1
    },
    "app": {
      "type": "object",
      "description": "Application config",
      "required": [
        "globalInitialSkills",
        "globalSkills"
      ],
      "properties": {
        "globalInitialSkills": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Initial skills available to all agents globally, loaded at startup",
          "default": []
        },
        "globalSkills": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Skills available to all agents globally during their lifecycle, loaded on demand",
          "default": []
        }
      },
      "additionalProperties": false
    },
    "agents": {
      "type": "object",
      "description": "Full list of agents",
      "additionalProperties": {
        "type": "object",
        "description": "Agent Schema",
        "required": [
          "name",
          "description",
          "prompt"
        ],
        "properties": {
          "name": {
            "type": "string",
            "description": "The name of the agent"
          },
          "description": {
            "type": "string",
            "description": "A brief description of the agent"
          },
          "initialSkills": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "Initial skills of the agent, loaded at creation",
            "default": []
          },
          "skills": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "Skills that can be loaded on demand by the agent during its lifecycle",
            "default": []
          },
          "prompt": {
            "type": "string",
            "description": "Prompt of the agent (markdown content)"
          }
        },
        "additionalProperties": false
      }
    },
    "skills": {
      "type": "object",
      "description": "Full list of skills",
      "additionalProperties": {
        "type": "object",
        "description": "Skill Schema",
        "required": [
          "name",
          "description",
          "content"
        ],
        "properties": {
          "name": {
            "type": "string",
            "description": "The name of the skill"
          },
          "description": {
            "type": "string",
            "description": "A brief description of the skill"
          },
          "toolsets": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "Toolsets associated with the skill",
            "default": []
          },
          "content": {
            "type": "string",
            "description": "Full markdown content of the skill"
          }
        },
        "additionalProperties": false
      }
    },
    "toolsets": {
      "type": "object",
      "description": "Full list of toolsets",
      "additionalProperties": {
        "type": "object",
        "description": "Toolset Schema",
        "required": [
          "name",
          "description",
          "tools",
          "content"
        ],
        "properties": {
          "name": {
            "type": "string",
            "description": "The name of the toolset"
          },
          "description": {
            "type": "string",
            "description": "A brief description of the toolset"
          },
          "tools": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "Tools included in the toolset"
          },
          "content": {
            "type": "string",
            "description": "Full markdown content of the toolset"
          }
        },
        "additionalProperties": false
      }
    },
    "tools": {
      "type": "object",
      "description": "Full list of tools",
      "additionalProperties": {
        "type": "object",
        "description": "Tool Schema",
        "required": [
          "name",
          "description",
          "content"
        ],
        "properties": {
          "name": {
            "type": "string",
            "description": "The name of the tool"
          },
          "description": {
            "type": "string",
            "description": "A brief description of the tool"
          },
          "content": {
            "type": "string",
            "description": "Full markdown content of the tool"
          }
        },
        "additionalProperties": false
      }
    }
  },
  "additionalProperties": false
}
```

## Structure

The manifest has the following top-level properties:

- **`version`** (number): Version of the manifest schema (currently `1`)
- **`app`** (object): Global application configuration
- **`agents`** (object): Map of agent name to agent definition
- **`skills`** (object): Map of skill name to skill definition
- **`toolsets`** (object): Map of toolset name to toolset definition
- **`tools`** (object): Map of tool name to tool definition

## Usage

### Load in JavaScript/TypeScript

```typescript
import { Carnet } from '@upstart-gg/carnet'
import manifest from './carnet/carnet.manifest.json'

const carnet = new Carnet(manifest)
const agent = carnet.getAgent('my-agent')
```

### Load in Any Language

Parse the JSON file directly:

```python
import json

with open('carnet/carnet.manifest.json', 'r') as f:
    manifest = json.load(f)

agent = manifest['agents']['my-agent']
print(agent['prompt'])
```

## Example Manifest

Here's a minimal example of what a compiled manifest looks like:

```json
{
  "version": 1,
  "app": {
    "globalInitialSkills": [],
    "globalSkills": []
  },
  "agents": {
    "my-agent": {
      "name": "my-agent",
      "description": "A helpful assistant",
      "initialSkills": [],
      "skills": ["my-skill"],
      "prompt": "You are a helpful assistant..."
    }
  },
  "skills": {
    "my-skill": {
      "name": "my-skill",
      "description": "My skill description",
      "toolsets": ["my-toolset"],
      "content": "Skill documentation..."
    }
  },
  "toolsets": {
    "my-toolset": {
      "name": "my-toolset",
      "description": "My toolset description",
      "tools": ["my-tool"],
      "content": "Toolset documentation..."
    }
  },
  "tools": {
    "my-tool": {
      "name": "my-tool",
      "description": "My tool description",
      "content": "Tool documentation..."
    }
  }
}
```
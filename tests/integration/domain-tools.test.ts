import { beforeEach, describe, expect, it } from 'bun:test'
import { tool } from 'ai'
import { z } from 'zod'
import type { Manifest } from '../../src/lib'
import { Carnet } from '../../src/lib'

// Mock Domain Tools
const searchTools = {
  basicSearch: tool({
    description: 'Perform a basic web search',
    inputSchema: z.object({ query: z.string() }),
    execute: async ({ query }) => ({ result: `Results for ${query}` }),
  }),
  advancedSearch: tool({
    description: 'Perform an advanced search',
    inputSchema: z.object({ query: z.string(), filters: z.any() }),
    execute: async ({ query }) => ({ result: `Advanced results for ${query}` }),
  }),
}

const analysisTools = {
  analyzeData: tool({
    description: 'Analyze a dataset',
    inputSchema: z.object({ data: z.array(z.number()) }),
    execute: async ({ data }) => ({ sum: data.reduce((a, b) => a + b, 0) }),
  }),
}

// Mock Manifest
const manifest: Manifest = {
  version: 1,
  app: {
    globalInitialSkills: [],
    globalSkills: [],
  },
  agents: {
    researcher: {
      name: 'researcher',
      description: 'A test agent',
      prompt: 'You are a research assistant.',
      initialSkills: ['webSearch'],
      skills: ['dataAnalysis'],
    },
  },
  skills: {
    webSearch: {
      name: 'webSearch',
      description: 'A skill for searching the web.',
      toolsets: ['search'],
      content: 'This skill enables web searching.',
    },
    dataAnalysis: {
      name: 'dataAnalysis',
      description: 'A skill for analyzing data.',
      toolsets: ['analysis'],
      content: 'This skill enables data analysis.',
    },
  },
  toolsets: {
    search: {
      name: 'search',
      description: 'Tools for searching.',
      tools: [
        { name: 'basicSearch', description: 'Perform a basic web search' },
        { name: 'advancedSearch', description: 'Perform an advanced search' },
      ],
      content: 'This toolset contains search tools.',
    },
    analysis: {
      name: 'analysis',
      description: 'Tools for data analysis.',
      tools: [{ name: 'analyzeData', description: 'Analyze a dataset' }],
      content: 'This toolset contains analysis tools.',
    },
  },
}

describe('Domain Tools Integration', () => {
  let carnet: Carnet

  beforeEach(() => {
    carnet = new Carnet(manifest)
  })

  it('should expose initial domain tools on startup', () => {
    const tools = carnet.getTools('researcher', {
      tools: {
        ...searchTools,
        ...analysisTools,
      },
    })
    const toolNames = Object.keys(tools)

    expect(toolNames).toContain('basicSearch')
    expect(toolNames).toContain('advancedSearch')
    expect(toolNames).not.toContain('analyzeData')
  })

  it('should expose new domain tools after loading a skill', () => {
    // Simulate the loadSkill tool being called
    carnet._updateSessionOnSkillLoad('researcher', 'dataAnalysis')

    const tools = carnet.getTools('researcher', {
      tools: {
        ...searchTools,
        ...analysisTools,
      },
    })
    const toolNames = Object.keys(tools)

    // Should still have the initial tools
    expect(toolNames).toContain('basicSearch')
    expect(toolNames).toContain('advancedSearch')

    // And now should have the new tool
    expect(toolNames).toContain('analyzeData')
  })

  it('should update the system prompt after loading a skill', () => {
    const initialPrompt = carnet.getSystemPrompt('researcher')
    expect(initialPrompt).toContain('## Skills')
    expect(initialPrompt).toContain('## On-Demand Skills')

    expect(initialPrompt).toContain('webSearch')
    // Adapted: code now uses 'webSearch' instead of 'basicSearch' and removes domain tools terminology

    // Updated: basicSearch removed from implementation, only webSearch and dataAnalysis remain
    expect(initialPrompt).toContain('- **webSearch**: A skill for searching the web.')
    expect(initialPrompt).toContain('- **dataAnalysis**: A skill for analyzing data.')
    // Always includes loaded skills section now
    expect(initialPrompt).toContain('## Currently Loaded Skills')
    expect(initialPrompt).not.toContain('analyzeData')

    // Simulate loading the dataAnalysis skill
    carnet._updateSessionOnSkillLoad('researcher', 'dataAnalysis')

    const updatedPrompt = carnet.getSystemPrompt('researcher')
    // Adapted: Confirm new prompt format and content shown after loading dataAnalysis skill
    expect(updatedPrompt).toContain('## On-Demand Skills')
    expect(updatedPrompt).toContain('- **dataAnalysis**: A skill for analyzing data.')
  })

  it('should reset the session and tool exposure', () => {
    // Load a skill to change the state
    carnet._updateSessionOnSkillLoad('researcher', 'dataAnalysis')
    let tools = carnet.getTools('researcher', {
      tools: {
        ...searchTools,
        ...analysisTools,
      },
    })
    expect(Object.keys(tools)).toContain('analyzeData')

    // Reset the session
    carnet.resetSession('researcher')

    // Verify the state is reset
    tools = carnet.getTools('researcher', {
      tools: {
        ...searchTools,
        ...analysisTools,
      },
    })
    const toolNames = Object.keys(tools)
    expect(toolNames).toContain('basicSearch')
    expect(toolNames).not.toContain('analyzeData')

    const prompt = carnet.getSystemPrompt('researcher')
    // Always includes loaded skills section now
    expect(prompt).toContain('## Currently Loaded Skills')
    expect(prompt).not.toContain('analyzeData')
  })
})

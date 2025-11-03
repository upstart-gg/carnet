import { beforeEach, describe, expect, it } from 'bun:test'
import { Carnet } from '../../src/lib/index'
import type { Manifest } from '../../src/lib/types'

describe('Carnet - Vercel AI SDK Integration', () => {
  let carnet: Carnet
  let manifest: Manifest

  beforeEach(() => {
    manifest = {
      version: 1,
      app: {
        globalInitialSkills: [],
        globalSkills: [],
      },
      agents: {
        researcher: {
          name: 'researcher',
          description: 'A research agent',
          initialSkills: ['webSearch'],
          skills: ['dataAnalysis', 'documentSummarization'],
          prompt:
            'You are a research expert. Use your skills to find and analyze information. Available initial skills: web search. You can also load additional skills as needed.',
        },
      },
      skills: {
        webSearch: {
          name: 'webSearch',
          description: 'Search the web for information',
          toolsets: ['searchTools'],
          content: `# Web Search Skill

This skill provides tools for searching the web and retrieving information.

## Key Features:
- Full web search capabilities
- Result filtering and sorting
- Citation management

Use this skill to find current information and sources.`,
        },
        dataAnalysis: {
          name: 'dataAnalysis',
          description: 'Analyze data and generate insights',
          toolsets: ['analysisTools'],
          content: `# Data Analysis Skill

This skill provides tools for analyzing datasets and generating insights.

## Key Features:
- Statistical analysis
- Data visualization
- Pattern detection

Use this skill to understand data patterns and trends.`,
        },
        documentSummarization: {
          name: 'documentSummarization',
          description: 'Summarize and extract key information from documents',
          toolsets: [],
          content: `# Document Summarization Skill

This skill provides tools for processing and summarizing documents.

## Key Features:
- Text extraction
- Key point identification
- Abstract generation

Use this skill to quickly understand document content.`,
        },
      },
      toolsets: {
        searchTools: {
          name: 'searchTools',
          description: 'Tools for web searching',
          tools: ['search', 'advancedSearch'],
          content: `# Search Tools Toolset

Provides tools for searching the web with various options.

## Available Tools:
- search: Basic web search
- advancedSearch: Advanced search with filters`,
        },
        analysisTools: {
          name: 'analysisTools',
          description: 'Tools for data analysis',
          tools: ['statistics', 'visualization'],
          content: `# Analysis Tools Toolset

Provides tools for analyzing and visualizing data.

## Available Tools:
- statistics: Calculate statistical metrics
- visualization: Create data visualizations`,
        },
      },
      tools: {
        search: {
          name: 'search',
          description: 'Perform a basic web search',
          content: `# Search Tool

Searches the web for information.

## Usage:
\`\`\`
search(query: string): Promise<SearchResult[]>
\`\`\`

## Parameters:
- query: The search query string

## Returns:
Array of search results with URL, title, and snippet.`,
        },
        advancedSearch: {
          name: 'advancedSearch',
          description: 'Perform an advanced web search with filters',
          content: `# Advanced Search Tool

Searches the web with advanced filters and options.

## Usage:
\`\`\`
advancedSearch(query: string, options: SearchOptions): Promise<SearchResult[]>
\`\`\`

## Parameters:
- query: The search query string
- options: Filter options (domain, language, date range)

## Returns:
Array of filtered search results.`,
        },
        statistics: {
          name: 'statistics',
          description: 'Calculate statistical metrics on data',
          content: `# Statistics Tool

Calculates various statistical metrics.

## Usage:
\`\`\`
statistics(data: number[]): Promise<Stats>
\`\`\`

## Metrics:
- mean
- median
- standard deviation
- percentiles`,
        },
        visualization: {
          name: 'visualization',
          description: 'Create data visualizations',
          content: `# Visualization Tool

Creates charts and graphs from data.

## Supported Types:
- Line charts
- Bar charts
- Scatter plots
- Pie charts`,
        },
      },
    }

    carnet = new Carnet(manifest)
  })

  describe('getSystemPrompt', () => {
    it('should return a system prompt string', () => {
      const prompt = carnet.getSystemPrompt('researcher')
      expect(typeof prompt).toBe('string')
      expect(prompt.length).toBeGreaterThan(0)
    })

    it('should include agent description and prompt', () => {
      const prompt = carnet.getSystemPrompt('researcher')
      expect(prompt).toContain('You are a research expert')
      expect(prompt).toContain('web search')
    })

    it('should include initial skills by default', () => {
      const prompt = carnet.getSystemPrompt('researcher')
      expect(prompt).toContain('Web Search Skill')
      expect(prompt).toContain('webSearch')
    })

    it('should include skill catalog by default', () => {
      const prompt = carnet.getSystemPrompt('researcher')
      expect(prompt).toContain('## Available Skills')
      expect(prompt).toContain('dataAnalysis')
      expect(prompt).toContain('documentSummarization')
    })

    it('should respect includeInitialSkills option', () => {
      const promptWithSkills = carnet.getSystemPrompt('researcher', {
        includeInitialSkills: true,
      })
      const promptWithoutSkills = carnet.getSystemPrompt('researcher', {
        includeInitialSkills: false,
      })

      expect(promptWithSkills).toContain('## Initial Skills')
      expect(promptWithoutSkills).not.toContain('## Initial Skills')
    })

    it('should respect includeSkillCatalog option', () => {
      const promptWithCatalog = carnet.getSystemPrompt('researcher', {
        includeSkillCatalog: true,
      })
      const promptWithoutCatalog = carnet.getSystemPrompt('researcher', {
        includeSkillCatalog: false,
      })

      expect(promptWithCatalog).toContain('## Available Skills')
      expect(promptWithoutCatalog).not.toContain('## Available Skills')
    })

    it('should accept variables for prompt generation', () => {
      const manifest2: Manifest = {
        ...manifest,
        agents: {
          ...manifest.agents,
          researcher: {
            ...manifest.agents.researcher,
            prompt: 'You are researching {{ TOPIC }}. Use your skills wisely.',
          },
        },
      }

      const carnet2 = new Carnet(manifest2)
      const prompt = carnet2.getSystemPrompt('researcher', {
        variables: { TOPIC: 'machine learning' },
      })

      expect(prompt).toContain('machine learning')
      expect(prompt).not.toContain('{{ TOPIC }}')
    })

    it('should throw error for non-existent agent', () => {
      expect(() => carnet.getSystemPrompt('non-existent')).toThrow('Agent not found')
    })
  })

  describe('getTools', () => {
    it('should return a ToolSet object', () => {
      const tools = carnet.getTools('researcher')
      expect(typeof tools).toBe('object')
      expect(tools).not.toBeNull()
    })

    it('should include the loadSkill Carnet tool by default', () => {
      const tools = carnet.getTools('researcher')
      expect(Object.keys(tools)).toContain('loadSkill')
      // Skills are discovered via the system prompt's skill catalog
      // The factory now exposes only the loadSkill meta-tool. Domain tools are merged separately.
    })

    it('should include loadSkill meta-tool', () => {
      const tools = carnet.getTools('researcher')

      expect(Object.keys(tools)).toHaveLength(1)
      expect(Object.keys(tools)).toContain('loadSkill')
      expect(Object.keys(tools)).not.toContain('listAvailableSkills')
      expect(Object.keys(tools)).not.toContain('loadToolset')
    })

    it('should throw error for non-existent agent', () => {
      expect(() => carnet.getTools('non-existent')).toThrow('Agent not found')
    })

    it('should create tools with valid Vercel AI SDK structure', () => {
      const tools = carnet.getTools('researcher')

      // Check that each tool has the required structure
      for (const [_toolName, tool] of Object.entries(tools)) {
        expect(tool.description).toBeDefined()
        expect(typeof tool.description).toBe('string')
        // Tool should have execute method
        expect(typeof tool.execute).toBe('function')
      }
    })
  })

  describe('Vercel AI SDK compatibility', () => {
    it('should provide system prompt and tools for streamText', () => {
      const systemPrompt = carnet.getSystemPrompt('researcher')
      const tools = carnet.getTools('researcher')

      // Simulate how Vercel AI SDK would use these
      const config = {
        system: systemPrompt,
        tools: tools,
      }

      expect(config.system).toBeDefined()
      expect(config.tools).toBeDefined()
      expect(Object.keys(config.tools).length).toBeGreaterThan(0)
    })

    it('should support customizing tools for Vercel AI SDK', () => {
      // Carnet provides the loadSkill meta-tool and any domain tools passed via tools option
      const tools = carnet.getTools('researcher', {
        tools: {},
      })

      // Only loadSkill meta-tool is included (no domain tools in this example)
      expect(Object.keys(tools)).toHaveLength(1)

      // Should still work with Vercel AI SDK
      const config = {
        system: carnet.getSystemPrompt('researcher'),
        tools: tools,
      }

      expect(Object.keys(config.tools)).toHaveLength(1)
    })
  })

  describe('integration with multiple agents', () => {
    it('should handle different agents independently', () => {
      const manifest2: Manifest = {
        version: 1,
        app: {
          globalInitialSkills: [],
          globalSkills: [],
        },
        agents: {
          researcher: manifest.agents.researcher,
          writer: {
            name: 'writer',
            description: 'A writing agent',
            initialSkills: [],
            skills: ['documentSummarization'],
            prompt: 'You are a professional writer.',
          },
        },
        skills: manifest.skills,
        toolsets: manifest.toolsets,
        tools: manifest.tools,
      }

      const carnet2 = new Carnet(manifest2)

      const researcherPrompt = carnet2.getSystemPrompt('researcher')
      const writerPrompt = carnet2.getSystemPrompt('writer')

      expect(researcherPrompt).toContain('research expert')
      expect(writerPrompt).toContain('professional writer')

      const researcherTools = carnet2.getTools('researcher')
      const writerTools = carnet2.getTools('writer')

      expect(Object.keys(researcherTools).length).toBe(Object.keys(writerTools).length)
    })
  })
})

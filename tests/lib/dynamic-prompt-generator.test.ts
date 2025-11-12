import { beforeEach, describe, expect, it } from 'bun:test'
import { tool } from 'ai'
import { z } from 'zod'
import { DynamicPromptGenerator } from '../../src/lib/dynamic-prompt-generator'
import { ToolRegistry } from '../../src/lib/tool-registry'
import type { CarnetSessionState, Manifest, Skill } from '../../src/lib/types'
import { VariableInjector } from '../../src/lib/variable-injector'

describe('DynamicPromptGenerator', () => {
  let generator: DynamicPromptGenerator
  let variableInjector: VariableInjector

  const createMockTool = (description: string) =>
    tool({
      description,
      inputSchema: z.object({}),
      execute: async () => ({ ok: true }),
    })

  const _createMockSkill = (name: string, toolsets: string[] = []): Skill => ({
    name,
    description: `Description of ${name}`,
    toolsets,
    content: `Content of ${name} skill`,
  })

  const createMockSession = (overrides?: Partial<CarnetSessionState>): CarnetSessionState => ({
    agentName: 'testAgent',
    discoveredSkills: new Set(),
    loadedToolsets: new Set(),
    exposedDomainTools: new Set(),
    ...overrides,
  })

  const _createMockManifest = (skills?: Record<string, Skill>): Manifest => ({
    version: 1,
    app: {
      globalInitialSkills: [],
      globalSkills: [],
    },
    agents: {
      testAgent: {
        name: 'testAgent',
        description: 'Test agent',
        prompt: 'Test prompt',
        initialSkills: [],
        skills: [],
      },
    },
    skills: skills || {},
    toolsets: {},
  })

  beforeEach(() => {
    variableInjector = new VariableInjector()
    generator = new DynamicPromptGenerator(variableInjector)
  })

  describe('generateAvailableToolsSection', () => {
    it('should return empty string when no tools exposed', () => {
      const session = createMockSession()
      const registry = new ToolRegistry()

      const result = generator.generateAvailableToolsSection(session, registry)
      expect(result).toBe('')
    })

    it('should include exposed tool with description', () => {
      const searchTool = createMockTool('Search Google')
      const registry = new ToolRegistry()
      registry.register('search', { search: searchTool })

      const session = createMockSession({
        loadedToolsets: new Set(['search']),
        exposedDomainTools: new Set(['search']),
      })

      const result = generator.generateAvailableToolsSection(session, registry)

      expect(result).toContain('Available Domain Tools')
      expect(result).toContain('search')
      expect(result).toContain('Search Google')
    })

    it('should include multiple exposed tools', () => {
      const searchTool = createMockTool('Search')
      const analyzeTool = createMockTool('Analyze')
      const registry = new ToolRegistry()

      registry.register('search', { search: searchTool })
      registry.register('analysis', { analyze: analyzeTool })

      const session = createMockSession({
        loadedToolsets: new Set(['search', 'analysis']),
        exposedDomainTools: new Set(['search', 'analyze']),
      })

      const result = generator.generateAvailableToolsSection(session, registry)

      expect(result).toContain('search')
      expect(result).toContain('analyze')
      expect(result).toContain('Search')
      expect(result).toContain('Analyze')
    })

    it('should skip tools without descriptions', () => {
      const goodTool = createMockTool('Good description')
      const badTool = tool({
        description: '',
        inputSchema: z.object({}),
        execute: async () => ({}),
      })

      const registry = new ToolRegistry()
      registry.register('tools', { good: goodTool, bad: badTool })

      const session = createMockSession({
        loadedToolsets: new Set(['tools']),
        exposedDomainTools: new Set(['good', 'bad']),
      })

      const result = generator.generateAvailableToolsSection(session, registry)

      expect(result).toContain('good')
      expect(result).not.toContain('bad')
    })

    it('should skip tools not in registry', () => {
      const tool1 = createMockTool('Tool 1')
      const registry = new ToolRegistry()
      registry.register('available', { tool1 })

      const session = createMockSession({
        loadedToolsets: new Set(['available']),
        exposedDomainTools: new Set(['tool1', 'missing']),
      })

      const result = generator.generateAvailableToolsSection(session, registry)

      expect(result).toContain('tool1')
      // missing is filtered out
    })

    it('should return empty string if all tools filtered out', () => {
      const tool1 = tool({
        description: '', // No description
        inputSchema: z.object({}),
        execute: async () => ({}),
      })

      const registry = new ToolRegistry()
      registry.register('tools', { tool1 })

      const session = createMockSession({
        loadedToolsets: new Set(['tools']),
        exposedDomainTools: new Set(['tool1']),
      })

      const result = generator.generateAvailableToolsSection(session, registry)

      expect(result).toBe('')
    })

    it('should format section with proper markdown', () => {
      const tool1 = createMockTool('Test Tool')
      const registry = new ToolRegistry()
      registry.register('tools', { tool1 })

      const session = createMockSession({
        loadedToolsets: new Set(['tools']),
        exposedDomainTools: new Set(['tool1']),
      })

      const result = generator.generateAvailableToolsSection(session, registry)

      expect(result).toMatch(/^## Available Domain Tools/)
      expect(result).toContain('- **tool1**:')
    })

    it('should handle many exposed tools', () => {
      const tools: Record<string, ReturnType<typeof createMockTool>> = {}
      const toolNames = new Set<string>()

      for (let i = 0; i < 10; i++) {
        const name = `tool${i}`
        tools[name] = createMockTool(`Tool ${i}`)
        toolNames.add(name)
      }

      const registry = new ToolRegistry()
      registry.register('tools', tools)

      const session = createMockSession({
        loadedToolsets: new Set(['tools']),
        exposedDomainTools: toolNames,
      })

      const result = generator.generateAvailableToolsSection(session, registry)

      for (let i = 0; i < 10; i++) {
        expect(result).toContain(`tool${i}`)
      }
    })

    it('should handle special characters in descriptions', () => {
      const toolWithSpecials = createMockTool('Search for <keywords> & analyze')
      const registry = new ToolRegistry()
      registry.register('tools', { search: toolWithSpecials })

      const session = createMockSession({
        loadedToolsets: new Set(['tools']),
        exposedDomainTools: new Set(['search']),
      })

      const result = generator.generateAvailableToolsSection(session, registry)

      expect(result).toContain('search')
      expect(result).toContain('<keywords>')
      expect(result).toContain('&')
    })
  })

  describe('integration scenarios', () => {
    it('should handle progressive loading workflow', () => {
      const searchTool = createMockTool('Search')
      const analyzeTool = createMockTool('Analyze')

      const registry = new ToolRegistry()
      registry.register('search-tools', { search: searchTool })
      registry.register('analysis-tools', { analyze: analyzeTool })

      // Initial: only search skill loaded
      let session = createMockSession({
        discoveredSkills: new Set(['search']),
        loadedToolsets: new Set(['search-tools']),
        exposedDomainTools: new Set(['search']),
      })

      let toolsSection = generator.generateAvailableToolsSection(session, registry)

      expect(toolsSection).toContain('search')
      expect(toolsSection).not.toContain('analyze')

      // Later: analysis skill also loaded
      session = createMockSession({
        discoveredSkills: new Set(['search', 'analysis']),
        loadedToolsets: new Set(['search-tools', 'analysis-tools']),
        exposedDomainTools: new Set(['search', 'analyze']),
      })

      toolsSection = generator.generateAvailableToolsSection(session, registry)

      expect(toolsSection).toContain('search')
      expect(toolsSection).toContain('analyze')
    })

    it('should handle complex skill and tool setup', () => {
      const tools = {
        googleSearch: createMockTool('Search Google'),
        bingSearch: createMockTool('Search Bing'),
        analyze: createMockTool('Analyze Data'),
      }

      const registry = new ToolRegistry()
      registry.register('search', { googleSearch: tools.googleSearch })
      registry.register('index', { bingSearch: tools.bingSearch })
      registry.register('analysis', { analyze: tools.analyze })

      const session = createMockSession({
        discoveredSkills: new Set(['webSearch', 'dataAnalysis']),
        loadedToolsets: new Set(['search', 'index', 'analysis']),
        exposedDomainTools: new Set(['googleSearch', 'bingSearch', 'analyze']),
      })

      const toolsSection = generator.generateAvailableToolsSection(session, registry)

      expect(toolsSection).toContain('googleSearch')
      expect(toolsSection).toContain('bingSearch')
      expect(toolsSection).toContain('analyze')
    })
  })
})

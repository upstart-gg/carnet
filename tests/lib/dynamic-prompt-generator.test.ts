import { describe, it, expect, beforeEach } from 'bun:test'
import { tool } from 'ai'
import { z } from 'zod'
import { DynamicPromptGenerator } from '../../src/lib/dynamic-prompt-generator'
import { VariableInjector } from '../../src/lib/variable-injector'
import { ToolRegistry } from '../../src/lib/tool-registry'
import type { CarnetSessionState, Skill, Manifest } from '../../src/lib/types'

describe('DynamicPromptGenerator', () => {
  let generator: DynamicPromptGenerator
  let variableInjector: VariableInjector

  const createMockTool = (description: string) =>
    tool({
      description,
      inputSchema: z.object({}),
      execute: async () => ({ ok: true }),
    })

  const createMockSkill = (name: string, toolsets: string[] = []): Skill => ({
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

  const createMockManifest = (skills?: Record<string, Skill>): Manifest => ({
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
    tools: {},
  })

  beforeEach(() => {
    variableInjector = new VariableInjector()
    generator = new DynamicPromptGenerator(variableInjector)
  })

  describe('generateLoadedSkillsSection', () => {
    it('should return empty string when no skills loaded', () => {
      const session = createMockSession()
      const manifest = createMockManifest()

      const result = generator.generateLoadedSkillsSection(session, manifest)
      expect(result).toBe('')
    })

    it('should include single loaded skill', () => {
      const skill = createMockSkill('search', ['search-tools'])
      const session = createMockSession({
        discoveredSkills: new Set(['search']),
      })
      const manifest = createMockManifest({ search: skill })

      const result = generator.generateLoadedSkillsSection(session, manifest)

      expect(result).toContain('Currently Loaded Skills')
      expect(result).toContain('search')
      expect(result).toContain('Description of search')
    })

    it('should include multiple loaded skills', () => {
      const skills = {
        search: createMockSkill('search', []),
        analysis: createMockSkill('analysis', []),
      }
      const session = createMockSession({
        discoveredSkills: new Set(['search', 'analysis']),
      })
      const manifest = createMockManifest(skills)

      const result = generator.generateLoadedSkillsSection(session, manifest)

      expect(result).toContain('search')
      expect(result).toContain('analysis')
      expect(result).toContain('Description of search')
      expect(result).toContain('Description of analysis')
    })

    it('should skip skills not in manifest but show header with empty list', () => {
      const session = createMockSession({
        discoveredSkills: new Set(['deletedSkill']),
      })
      const manifest = createMockManifest({})

      const result = generator.generateLoadedSkillsSection(session, manifest)

      // Header is shown but no skills are listed since all are filtered out
      expect(result).toContain('Currently Loaded Skills')
      expect(result).not.toContain('deletedSkill')
    })

    it('should include skill toolsets in description', () => {
      const skill = createMockSkill('search', ['search-tools', 'index-tools'])
      const session = createMockSession({
        discoveredSkills: new Set(['search']),
      })
      const manifest = createMockManifest({ search: skill })

      const result = generator.generateLoadedSkillsSection(session, manifest)

      expect(result).toContain('search')
      expect(result).toContain('search-tools')
      expect(result).toContain('index-tools')
    })

    it('should handle skill with no toolsets', () => {
      const skill = createMockSkill('simple', [])
      const session = createMockSession({
        discoveredSkills: new Set(['simple']),
      })
      const manifest = createMockManifest({ simple: skill })

      const result = generator.generateLoadedSkillsSection(session, manifest)

      expect(result).toContain('simple')
      expect(result).toContain('Description of simple')
    })

    it('should filter out missing skills and include valid ones', () => {
      const skills = {
        search: createMockSkill('search'),
        analysis: createMockSkill('analysis'),
      }
      const session = createMockSession({
        discoveredSkills: new Set(['search', 'missing', 'analysis']),
      })
      const manifest = createMockManifest(skills)

      const result = generator.generateLoadedSkillsSection(session, manifest)

      expect(result).toContain('search')
      expect(result).toContain('analysis')
      expect(result).not.toContain('missing')
    })

    it('should format section with proper markdown', () => {
      const skill = createMockSkill('test')
      const session = createMockSession({
        discoveredSkills: new Set(['test']),
      })
      const manifest = createMockManifest({ test: skill })

      const result = generator.generateLoadedSkillsSection(session, manifest)

      expect(result).toMatch(/^## Currently Loaded Skills/)
      expect(result).toContain('- **test**:')
    })

    it('should handle many loaded skills', () => {
      const skills: Record<string, Skill> = {}
      const skillNames = new Set<string>()

      for (let i = 0; i < 10; i++) {
        const name = `skill${i}`
        skills[name] = createMockSkill(name)
        skillNames.add(name)
      }

      const session = createMockSession({ discoveredSkills: skillNames })
      const manifest = createMockManifest(skills)

      const result = generator.generateLoadedSkillsSection(session, manifest)

      for (let i = 0; i < 10; i++) {
        expect(result).toContain(`skill${i}`)
      }
    })
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
      const skills = {
        search: createMockSkill('search', ['search-tools']),
        analysis: createMockSkill('analysis', ['analysis-tools']),
      }

      const searchTool = createMockTool('Search')
      const analyzeTool = createMockTool('Analyze')

      const registry = new ToolRegistry()
      registry.register('search-tools', { search: searchTool })
      registry.register('analysis-tools', { analyze: analyzeTool })

      const manifest = createMockManifest(skills)

      // Initial: only search skill loaded
      let session = createMockSession({
        discoveredSkills: new Set(['search']),
        loadedToolsets: new Set(['search-tools']),
        exposedDomainTools: new Set(['search']),
      })

      let skillsSection = generator.generateLoadedSkillsSection(session, manifest)
      let toolsSection = generator.generateAvailableToolsSection(session, registry)

      expect(skillsSection).toContain('search')
      expect(skillsSection).not.toContain('analysis')
      expect(toolsSection).toContain('search')
      expect(toolsSection).not.toContain('analyze')

      // Later: analysis skill also loaded
      session = createMockSession({
        discoveredSkills: new Set(['search', 'analysis']),
        loadedToolsets: new Set(['search-tools', 'analysis-tools']),
        exposedDomainTools: new Set(['search', 'analyze']),
      })

      skillsSection = generator.generateLoadedSkillsSection(session, manifest)
      toolsSection = generator.generateAvailableToolsSection(session, registry)

      expect(skillsSection).toContain('search')
      expect(skillsSection).toContain('analysis')
      expect(toolsSection).toContain('search')
      expect(toolsSection).toContain('analyze')
    })

    it('should handle complex skill and tool setup', () => {
      const skills = {
        webSearch: createMockSkill('webSearch', ['search', 'index']),
        dataAnalysis: createMockSkill('dataAnalysis', ['analysis']),
      }

      const tools = {
        googleSearch: createMockTool('Search Google'),
        bingSearch: createMockTool('Search Bing'),
        analyze: createMockTool('Analyze Data'),
      }

      const registry = new ToolRegistry()
      registry.register('search', { googleSearch: tools.googleSearch })
      registry.register('index', { bingSearch: tools.bingSearch })
      registry.register('analysis', { analyze: tools.analyze })

      const manifest = createMockManifest(skills)

      const session = createMockSession({
        discoveredSkills: new Set(['webSearch', 'dataAnalysis']),
        loadedToolsets: new Set(['search', 'index', 'analysis']),
        exposedDomainTools: new Set([
          'googleSearch',
          'bingSearch',
          'analyze',
        ]),
      })

      const skillsSection = generator.generateLoadedSkillsSection(
        session,
        manifest
      )
      const toolsSection = generator.generateAvailableToolsSection(
        session,
        registry
      )

      expect(skillsSection).toContain('webSearch')
      expect(skillsSection).toContain('dataAnalysis')
      expect(toolsSection).toContain('googleSearch')
      expect(toolsSection).toContain('bingSearch')
      expect(toolsSection).toContain('analyze')
    })
  })
})

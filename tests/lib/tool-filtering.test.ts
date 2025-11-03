import { describe, it, expect, beforeEach } from 'bun:test'
import { tool } from 'ai'
import { z } from 'zod'
import { mergeToolSets } from '../../src/lib/tool-filtering'
import { ToolRegistry } from '../../src/lib/tool-registry'
import type { CarnetSessionState } from '../../src/lib/types'

describe('mergeToolSets', () => {
  let carnetTools: ReturnType<typeof createCarnetTools>
  let registry: ToolRegistry
  let session: CarnetSessionState

  const createCarnetTools = () => ({
    loadSkill: tool({
      description: 'Load a skill',
      inputSchema: z.object({ skillName: z.string() }),
      execute: async () => ({ success: true }),
    }),
  })

  const createMockTool = (description: string) =>
    tool({
      description,
      inputSchema: z.object({}),
      execute: async () => ({ ok: true }),
    })

  const createMockSession = (overrides?: Partial<CarnetSessionState>): CarnetSessionState => ({
    agentName: 'testAgent',
    discoveredSkills: new Set(),
    loadedToolsets: new Set(),
    exposedDomainTools: new Set(),
    ...overrides,
  })

  beforeEach(() => {
    carnetTools = createCarnetTools()
    registry = new ToolRegistry()
    session = createMockSession()
  })

  describe('basic merging', () => {
    it('should return carnet tools when registry is empty', () => {
      const result = mergeToolSets(carnetTools, session, registry)
      expect(Object.keys(result).sort()).toEqual([
        'loadSkill',
      ])
      expect(result.loadSkill).toBe(carnetTools.loadSkill)
    })

    it('should include domain tools when registry has matching toolsets', () => {
      const searchTool = createMockTool('Search')
      registry.register('search', { search: searchTool })

      session.loadedToolsets.add('search')

      const result = mergeToolSets(carnetTools, session, registry)

      expect(result.loadSkill).toBe(carnetTools.loadSkill)
      expect(result.search).toBe(searchTool)
      expect(Object.keys(result)).toHaveLength(2)
    })

    it('should preserve carnet tools when adding domain tools', () => {
      const searchTool = createMockTool('Search')
      const analyzeTool = createMockTool('Analyze')

      registry.register('search', { search: searchTool })
      registry.register('analysis', { analyze: analyzeTool })

      session.loadedToolsets.add('search')
      session.loadedToolsets.add('analysis')

      const result = mergeToolSets(carnetTools, session, registry)

      expect(result.loadSkill).toBe(carnetTools.loadSkill)
      expect(result.search).toBe(searchTool)
      expect(result.analyze).toBe(analyzeTool)
      expect(Object.keys(result)).toHaveLength(3)
    })
  })

  describe('handling missing toolsets', () => {
    it('should handle missing toolsets gracefully', () => {
      const searchTool = createMockTool('Search')
      registry.register('search', { search: searchTool })

      session.loadedToolsets.add('search')
      session.loadedToolsets.add('missing1')
      session.loadedToolsets.add('missing2')

      const result = mergeToolSets(carnetTools, session, registry)

      expect(result.search).toBe(searchTool)
      expect(result.loadSkill).toBe(carnetTools.loadSkill)
      expect(Object.keys(result).sort()).toEqual([
        'loadSkill',
        'search',
      ])
    })

    it('should return only carnet tools when session has no loaded toolsets', () => {
      registry.register('search', {
        search: createMockTool('Search'),
      })

      const result = mergeToolSets(carnetTools, session, registry)
      expect(Object.keys(result).sort()).toEqual([
        'loadSkill',
      ])
    })

    it('should handle session with missing toolsets in registry', () => {
      const searchTool = createMockTool('Search')
      registry.register('search', { search: searchTool })

      session.loadedToolsets.add('search')
      session.loadedToolsets.add('nonexistent')

      const result = mergeToolSets(carnetTools, session, registry)

      expect(result.search).toBe(searchTool)
      expect(Object.keys(result)).toContain('search')
    })
  })

  describe('tool name conflicts', () => {
    it('should give domain tools priority on name conflict', () => {
      const carnetExecute = tool({
        description: 'Carnet execute',
        inputSchema: z.object({}),
        execute: async () => ({ source: 'carnet' }),
      })

      const userExecute = tool({
        description: 'User execute',
        inputSchema: z.object({}),
        execute: async () => ({ source: 'user' }),
      })

      const carnetWithConflict = {
        ...carnetTools,
        execute: carnetExecute,
      }

      registry.register('tools', { execute: userExecute })
      session.loadedToolsets.add('tools')

      const result = mergeToolSets(carnetWithConflict, session, registry)

      expect(result.execute).toBe(userExecute)
      expect(result.execute.description).toBe('User execute')
    })

    it('should merge multiple toolsets with no conflicts', () => {
      const searchTool = createMockTool('Search')
      const analyzeTool = createMockTool('Analyze')
      const formatTool = createMockTool('Format')

      registry.register('search', { search: searchTool })
      registry.register('analysis', { analyze: analyzeTool })
      registry.register('utils', { format: formatTool })

      session.loadedToolsets.add('search')
      session.loadedToolsets.add('analysis')
      session.loadedToolsets.add('utils')

      const result = mergeToolSets(carnetTools, session, registry)

      expect(result.search).toBe(searchTool)
      expect(result.analyze).toBe(analyzeTool)
      expect(result.format).toBe(formatTool)
      expect(Object.keys(result)).toHaveLength(4)
    })

    it('should give last toolset priority when both have same tool', () => {
      const tool1 = createMockTool('Tool 1')
      const tool2 = createMockTool('Tool 2')

      registry.register('set1', { execute: tool1 })
      registry.register('set2', { execute: tool2 })

      session.loadedToolsets.add('set1')
      session.loadedToolsets.add('set2')

      const result = mergeToolSets(carnetTools, session, registry)

      expect(result.execute).toBe(tool2)
    })
  })

  describe('multiple toolsets', () => {
    it('should merge tools from three toolsets', () => {
      const tool1 = createMockTool('Tool 1')
      const tool2 = createMockTool('Tool 2')
      const tool3 = createMockTool('Tool 3')

      registry.register('set1', { tool1 })
      registry.register('set2', { tool2 })
      registry.register('set3', { tool3 })

      session.loadedToolsets.add('set1')
      session.loadedToolsets.add('set2')
      session.loadedToolsets.add('set3')

      const result = mergeToolSets(carnetTools, session, registry)

      expect(result.tool1).toBe(tool1)
      expect(result.tool2).toBe(tool2)
      expect(result.tool3).toBe(tool3)
      expect(Object.keys(result).sort()).toEqual([
        'loadSkill',
        'tool1',
        'tool2',
        'tool3',
      ])
    })

    it('should handle complex toolset combinations', () => {
      const searchTool = createMockTool('Search')
      const googleTool = createMockTool('Google')
      const analyzeTool = createMockTool('Analyze')
      const formatTool = createMockTool('Format')

      registry.register('search', { search: searchTool, google: googleTool })
      registry.register('analysis', { analyze: analyzeTool })
      registry.register('utils', { format: formatTool })

      session.loadedToolsets.add('search')
      session.loadedToolsets.add('analysis')
      session.loadedToolsets.add('utils')

      const result = mergeToolSets(carnetTools, session, registry)

      expect(result.search).toBe(searchTool)
      expect(result.google).toBe(googleTool)
      expect(result.analyze).toBe(analyzeTool)
      expect(result.format).toBe(formatTool)
    })
  })

  describe('edge cases', () => {
    it('should work with empty carnet tools object', () => {
      const emptyCarnetTools: Record<string, ReturnType<typeof createMockTool>> = {}
      const searchTool = createMockTool('Search')

      registry.register('search', { search: searchTool })
      session.loadedToolsets.add('search')

      const result = mergeToolSets(emptyCarnetTools, session, registry)

      expect(result.search).toBe(searchTool)
      expect(Object.keys(result)).toEqual(['search'])
    })

    it('should handle very large toolset', () => {
      const tools: Record<string, ReturnType<typeof createMockTool>> = {}
      for (let i = 0; i < 100; i++) {
        tools[`tool${i}`] = createMockTool(`Tool ${i}`)
      }

      registry.register('large', tools)
      session.loadedToolsets.add('large')

      const result = mergeToolSets(carnetTools, session, registry)

      expect(Object.keys(result)).toHaveLength(101) // 100 tools + 1 carnet meta-tool (loadSkill)
      expect(result.tool0).toBe(tools.tool0)
      expect(result.tool99).toBe(tools.tool99)
    })

    it('should preserve tool function references', () => {
      const searchTool = createMockTool('Search')
      registry.register('search', { search: searchTool })
      session.loadedToolsets.add('search')

      const result1 = mergeToolSets(carnetTools, session, registry)
      const result2 = mergeToolSets(carnetTools, session, registry)

      expect(result1.search).toBe(result2.search)
      expect(result1.search).toBe(searchTool)
    })
  })

  describe('integration scenarios', () => {
    it('should support realistic workflow', () => {
      // Initial: only search tools loaded
      const searchTool = createMockTool('Search')
      const googleTool = createMockTool('Google')
      registry.register('search', { search: searchTool, google: googleTool })
      session.loadedToolsets.add('search')

      let result = mergeToolSets(carnetTools, session, registry)
      expect(Object.keys(result).sort()).toEqual([
        'google',
        'loadSkill',
        'search',
      ])

      // Later: analysis tools also loaded
      const analyzeTool = createMockTool('Analyze')
      registry.register('analysis', { analyze: analyzeTool })
      session.loadedToolsets.add('analysis')

      result = mergeToolSets(carnetTools, session, registry)
      expect(Object.keys(result).sort()).toEqual([
        'analyze',
        'google',
        'loadSkill',
        'search',
      ])
    })

    it('should handle tool registry with many toolsets', () => {
      const toolsets = ['search', 'analysis', 'utils', 'formatting', 'io']
      const expectedTools: string[] = []

      for (const toolsetName of toolsets) {
        const tools: Record<string, ReturnType<typeof createMockTool>> = {}
        for (let i = 0; i < 3; i++) {
          const toolName = `${toolsetName}_${i}`
          tools[toolName] = createMockTool(toolName)
          expectedTools.push(toolName)
        }
        registry.register(toolsetName, tools)
        session.loadedToolsets.add(toolsetName)
      }

      const result = mergeToolSets(carnetTools, session, registry)

      expect(Object.keys(result)).toContain('loadSkill')
      expect(Object.keys(result)).not.toContain('listAvailableSkills')
      for (const toolName of expectedTools) {
        expect(Object.keys(result)).toContain(toolName)
      }
    })
  })
})

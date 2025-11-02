import { describe, it, expect, beforeEach } from 'bun:test'
import { tool } from 'ai'
import { z } from 'zod'
import { ToolRegistry } from '../../src/lib/tool-registry'

describe('ToolRegistry', () => {
  let registry: ToolRegistry

  beforeEach(() => {
    registry = new ToolRegistry()
  })

  const createMockTool = (description: string) =>
    tool({
      description,
      inputSchema: z.object({}),
      execute: async () => ({ ok: true }),
    })

  describe('register', () => {
    it('should register a toolset', () => {
      const tools = { search: createMockTool('Search') }
      registry.register('search-tools', tools)
      expect(registry.getTools('search-tools')).toEqual(tools)
    })

    it('should register multiple toolsets', () => {
      const searchTools = { search: createMockTool('Search') }
      const analysisTools = { analyze: createMockTool('Analyze') }

      registry.register('search', searchTools)
      registry.register('analysis', analysisTools)

      expect(registry.getTools('search')).toEqual(searchTools)
      expect(registry.getTools('analysis')).toEqual(analysisTools)
    })

    it('should merge tools on duplicate registration', () => {
      const tool1 = createMockTool('Tool 1')
      const tool2 = createMockTool('Tool 2')

      registry.register('tools', { tool1 })
      registry.register('tools', { tool2 })

      const result = registry.getTools('tools')!
      expect(Object.keys(result)).toHaveLength(2)
      expect(result.tool1).toBe(tool1)
      expect(result.tool2).toBe(tool2)
    })

    it('should overwrite tool with same name in merge', () => {
      const oldTool = createMockTool('Old')
      const newTool = createMockTool('New')

      registry.register('tools', { execute: oldTool })
      registry.register('tools', { execute: newTool })

      const result = registry.getTools('tools')!
      expect(result.execute).toBe(newTool)
    })

    it('should handle empty toolset registration', () => {
      registry.register('empty', {})
      const result = registry.getTools('empty')
      expect(result).toEqual({})
    })

    it('should preserve tool instances across registrations', () => {
      const tool1 = createMockTool('Tool 1')
      registry.register('tools', { tool1 })
      const retrieved = registry.getTools('tools')!.tool1
      expect(retrieved).toBe(tool1)
    })
  })

  describe('getTools', () => {
    it('should return undefined for non-existent toolset', () => {
      expect(registry.getTools('missing')).toBeUndefined()
    })

    it('should return registered toolset', () => {
      const tools = { search: createMockTool('Search') }
      registry.register('search-tools', tools)
      expect(registry.getTools('search-tools')).toEqual(tools)
    })

    it('should return tools object with correct structure', () => {
      const search = createMockTool('Search')
      const analyze = createMockTool('Analyze')

      registry.register('tools', { search, analyze })
      const result = registry.getTools('tools')!

      expect(Object.keys(result).sort()).toEqual(['analyze', 'search'].sort())
      expect(result.search).toBe(search)
      expect(result.analyze).toBe(analyze)
    })

    it('should not modify returned object after registration', () => {
      const originalTools = { search: createMockTool('Search') }
      registry.register('tools', originalTools)
      const retrieved = registry.getTools('tools')!

      expect(retrieved).toEqual(originalTools)
      expect(Object.keys(retrieved)).toEqual(Object.keys(originalTools))
    })
  })

  describe('getToolsForToolsets', () => {
    it('should return empty object for empty toolset list', () => {
      registry.register('search', { search: createMockTool('Search') })
      const result = registry.getToolsForToolsets([])
      expect(result).toEqual({})
    })

    it('should merge single toolset', () => {
      const searchTool = createMockTool('Search')
      registry.register('search', { search: searchTool })

      const result = registry.getToolsForToolsets(['search'])
      expect(result.search).toBe(searchTool)
      expect(Object.keys(result)).toEqual(['search'])
    })

    it('should merge multiple toolsets without conflicts', () => {
      const searchTool = createMockTool('Search')
      const analyzeTool = createMockTool('Analyze')

      registry.register('search', { search: searchTool })
      registry.register('analysis', { analyze: analyzeTool })

      const result = registry.getToolsForToolsets(['search', 'analysis'])
      expect(Object.keys(result).sort()).toEqual(['analyze', 'search'].sort())
      expect(result.search).toBe(searchTool)
      expect(result.analyze).toBe(analyzeTool)
    })

    it('should handle non-existent toolsets gracefully', () => {
      const searchTool = createMockTool('Search')
      registry.register('search', { search: searchTool })

      const result = registry.getToolsForToolsets([
        'search',
        'missing1',
        'missing2',
      ])
      expect(Object.keys(result)).toEqual(['search'])
      expect(result.search).toBe(searchTool)
    })

    it('should handle duplicate toolset names', () => {
      const searchTool = createMockTool('Search')
      registry.register('search', { search: searchTool })

      const result = registry.getToolsForToolsets(['search', 'search'])
      expect(Object.keys(result)).toEqual(['search'])
      expect(result.search).toBe(searchTool)
    })

    it('should give last toolset priority on name conflict', () => {
      const tool1 = createMockTool('Tool 1')
      const tool2 = createMockTool('Tool 2')

      registry.register('set1', { execute: tool1 })
      registry.register('set2', { execute: tool2 })

      const result = registry.getToolsForToolsets(['set1', 'set2'])
      expect(result.execute).toBe(tool2)
    })

    it('should merge tools from three toolsets', () => {
      const tool1 = createMockTool('Tool 1')
      const tool2 = createMockTool('Tool 2')
      const tool3 = createMockTool('Tool 3')

      registry.register('set1', { tool1 })
      registry.register('set2', { tool2 })
      registry.register('set3', { tool3 })

      const result = registry.getToolsForToolsets(['set1', 'set2', 'set3'])
      expect(Object.keys(result).sort()).toEqual(['tool1', 'tool2', 'tool3'])
      expect(result.tool1).toBe(tool1)
      expect(result.tool2).toBe(tool2)
      expect(result.tool3).toBe(tool3)
    })

    it('should work with Set iterable', () => {
      const searchTool = createMockTool('Search')
      const analyzeTool = createMockTool('Analyze')

      registry.register('search', { search: searchTool })
      registry.register('analysis', { analyze: analyzeTool })

      const toolsetSet = new Set(['search', 'analysis'])
      const result = registry.getToolsForToolsets(toolsetSet)

      expect(Object.keys(result).sort()).toEqual(['analyze', 'search'].sort())
      expect(result.search).toBe(searchTool)
      expect(result.analyze).toBe(analyzeTool)
    })
  })

  describe('listToolsets', () => {
    it('should return empty array for empty registry', () => {
      expect(registry.listToolsets()).toEqual([])
    })

    it('should list single registered toolset', () => {
      registry.register('search', { search: createMockTool('Search') })
      const result = registry.listToolsets()
      expect(result).toHaveLength(1)
      expect(result).toContain('search')
    })

    it('should list multiple registered toolsets', () => {
      registry.register('search', { search: createMockTool('Search') })
      registry.register('analysis', { analyze: createMockTool('Analyze') })
      registry.register('utils', { format: createMockTool('Format') })

      const result = registry.listToolsets()
      expect(result).toHaveLength(3)
      expect(result).toContain('search')
      expect(result).toContain('analysis')
      expect(result).toContain('utils')
    })

    it('should not include duplicate toolset names after merge', () => {
      registry.register('tools', { tool1: createMockTool('Tool 1') })
      registry.register('tools', { tool2: createMockTool('Tool 2') })

      const result = registry.listToolsets()
      expect(result).toHaveLength(1)
      expect(result).toContain('tools')
    })

    it('should return all distinct toolset names', () => {
      registry.register('a', { tool: createMockTool('A') })
      registry.register('b', { tool: createMockTool('B') })
      registry.register('c', { tool: createMockTool('C') })
      registry.register('d', { tool: createMockTool('D') })

      const result = registry.listToolsets()
      expect(result).toHaveLength(4)
      expect(new Set(result)).toEqual(new Set(['a', 'b', 'c', 'd']))
    })
  })

  describe('integration scenarios', () => {
    it('should support full registration and retrieval workflow', () => {
      // Register multiple toolsets
      const searchTool = createMockTool('Search')
      const analyzeTool = createMockTool('Analyze')
      const formatTool = createMockTool('Format')

      registry.register('search', { search: searchTool })
      registry.register('analysis', { analyze: analyzeTool })
      registry.register('utils', { format: formatTool })

      // List all toolsets
      const toolsets = registry.listToolsets()
      expect(toolsets).toHaveLength(3)

      // Get specific toolsets
      expect(registry.getTools('search')).toEqual({ search: searchTool })
      expect(registry.getTools('analysis')).toEqual({ analyze: analyzeTool })

      // Get merged tools
      const merged = registry.getToolsForToolsets(['search', 'analysis'])
      expect(Object.keys(merged).sort()).toEqual(['analyze', 'search'].sort())
    })

    it('should handle complex merge scenario with overlapping tools', () => {
      const executeV1 = createMockTool('Execute V1')
      const executeV2 = createMockTool('Execute V2')
      const search = createMockTool('Search')
      const analyze = createMockTool('Analyze')

      registry.register('set1', { execute: executeV1, search })
      registry.register('set2', { execute: executeV2, analyze })

      const result = registry.getToolsForToolsets(['set1', 'set2'])
      expect(result.execute).toBe(executeV2) // Last wins
      expect(result.search).toBe(search)
      expect(result.analyze).toBe(analyze)
    })

    it('should maintain separate toolsets after registration', () => {
      const tool1 = createMockTool('Tool 1')
      const tool2 = createMockTool('Tool 2')

      registry.register('set1', { tool: tool1 })
      registry.register('set2', { tool: tool2 })

      const set1 = registry.getTools('set1')!
      const set2 = registry.getTools('set2')!

      expect(set1.tool).toBe(tool1)
      expect(set2.tool).toBe(tool2)
      expect(set1.tool).not.toBe(set2.tool)
    })
  })
})

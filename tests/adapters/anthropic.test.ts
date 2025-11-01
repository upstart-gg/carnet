import { describe, it, expect, beforeEach } from 'bun:test'
import { CarnetAnthropicAdapter } from '../../src/adapters/anthropic'
import { Carnet } from '../../src/lib/index'
import type { Manifest } from '../../src/lib/types'

describe('CarnetAnthropicAdapter', () => {
  let carnet: Carnet
  let adapter: CarnetAnthropicAdapter
  let manifest: Manifest

  beforeEach(() => {
    manifest = {
      version: 1,
      app: {
        globalInitialSkills: [],
        globalSkills: [],
      },
      agents: {
        testAgent: {
          name: 'testAgent',
          description: 'A test agent',
          initialSkills: ['skillA'],
          skills: ['skillB'],
          prompt: 'You are a test agent with access to skills.',
        },
      },
      skills: {
        skillA: {
          name: 'skillA',
          description: 'First skill',
          toolsets: ['toolsetA'],
          content: '# Skill A\n\nThis is skill A with important instructions.',
        },
        skillB: {
          name: 'skillB',
          description: 'Second skill',
          toolsets: [],
          content: '# Skill B\n\nThis is skill B.',
        },
      },
      toolsets: {
        toolsetA: {
          name: 'toolsetA',
          description: 'Toolset A with tools',
          tools: ['toolA1'],
          content: '# Toolset A\n\nToolset instructions here.',
        },
      },
      tools: {
        toolA1: {
          name: 'toolA1',
          description: 'Tool A1',
          content: '```json\n{"type": "function"}\n```',
        },
      },
    }

    carnet = new Carnet(manifest)
    adapter = new CarnetAnthropicAdapter(carnet, 'testAgent')
  })

  describe('Constructor', () => {
    it('should create adapter instance for a valid agent', () => {
      expect(adapter).toBeDefined()
    })

    it('should accept optional options', () => {
      const adapterWithOptions = new CarnetAnthropicAdapter(carnet, 'testAgent', {
        includeSkillCatalog: false,
      })
      expect(adapterWithOptions).toBeDefined()
    })
  })

  describe('getConfig()', () => {
    it('should return config object with system and tools', () => {
      const config = adapter.getConfig()
      expect(config).toHaveProperty('system')
      expect(config).toHaveProperty('tools')
    })

    it('should return system prompt as string', () => {
      const config = adapter.getConfig()
      expect(typeof config.system).toBe('string')
      expect(config.system.length).toBeGreaterThan(0)
    })

    it('should return tools as array', () => {
      const config = adapter.getConfig()
      expect(Array.isArray(config.tools)).toBe(true)
    })

    it('should include default tools in tools array', () => {
      const config = adapter.getConfig()
      const toolNames = config.tools.map((t) => t.name)
      expect(toolNames).toContain('listAvailableSkills')
      expect(toolNames).toContain('loadSkill')
      expect(toolNames).toContain('loadToolset')
      expect(toolNames).toContain('loadTool')
    })
  })

  describe('getSystemPrompt()', () => {
    it('should return a non-empty string', () => {
      const prompt = adapter.getSystemPrompt()
      expect(typeof prompt).toBe('string')
      expect(prompt.length).toBeGreaterThan(0)
    })

    it('should include agent description in prompt', () => {
      const prompt = adapter.getSystemPrompt()
      // The prompt includes the agent description and skills, not necessarily the agent name
      expect(prompt.toLowerCase()).toContain('test agent')
    })

    it('should include skill information', () => {
      const prompt = adapter.getSystemPrompt()
      expect(prompt).toContain('skillA')
    })
  })

  describe('getTools()', () => {
    it('should return array of tools', () => {
      const tools = adapter.getTools()
      expect(Array.isArray(tools)).toBe(true)
      expect(tools.length).toBeGreaterThan(0)
    })

    it('should return tools with required properties', () => {
      const tools = adapter.getTools()
      for (const tool of tools) {
        expect(tool).toHaveProperty('name')
        expect(tool).toHaveProperty('description')
        expect(tool).toHaveProperty('input_schema')
      }
    })

    it('should return valid tool schemas', () => {
      const tools = adapter.getTools()
      for (const tool of tools) {
        expect(typeof tool.name).toBe('string')
        expect(typeof tool.description).toBe('string')
        expect(tool.input_schema).toBeDefined()
      }
    })
  })

  describe('executeToolCall()', () => {
    it('should handle listAvailableSkills tool', async () => {
      const result = await adapter.executeToolCall('listAvailableSkills', {})
      expect(result).toBeDefined()
      expect(typeof result).toBe('object')
    })

    it('should handle loadSkill tool', async () => {
      const result = await adapter.executeToolCall('loadSkill', { skillName: 'skillA' })
      expect(result).toBeDefined()
    })

    it('should handle listSkillToolsets tool', async () => {
      const result = await adapter.executeToolCall('listSkillToolsets', { skillName: 'skillA' })
      expect(result).toBeDefined()
    })

    it('should handle loadToolset tool', async () => {
      const result = await adapter.executeToolCall('loadToolset', { toolsetName: 'toolsetA' })
      expect(result).toBeDefined()
    })

    it('should handle loadTool tool', async () => {
      const result = await adapter.executeToolCall('loadTool', { toolName: 'toolA1' })
      expect(result).toBeDefined()
    })

    it('should handle unknown tool gracefully', async () => {
      const result = await adapter.executeToolCall('unknownTool', {})
      expect(result).toHaveProperty('success', false)
      expect(result).toHaveProperty('error')
    })

    it('should handle missing required parameters', async () => {
      const result = await adapter.executeToolCall('loadSkill', {})
      expect(result).toBeDefined()
    })
  })

  describe('Options handling', () => {
    it('should respect includeSkillCatalog option', () => {
      const adapterWithoutCatalog = new CarnetAnthropicAdapter(carnet, 'testAgent', {
        includeSkillCatalog: false,
      })
      const promptWithCatalog = adapter.getSystemPrompt()
      const promptWithoutCatalog = adapterWithoutCatalog.getSystemPrompt()
      // Prompts should differ when catalog inclusion changes
      expect(promptWithCatalog).not.toBe(promptWithoutCatalog)
    })

    it('should respect tools option', () => {
      const adapterWithLimitedTools = new CarnetAnthropicAdapter(carnet, 'testAgent', {
        tools: ['loadSkill'],
      })
      const tools = adapterWithLimitedTools.getTools()
      expect(tools.length).toBe(1)
      expect(tools[0].name).toBe('loadSkill')
    })

    it('should accept variable options', () => {
      const adapterWithVars = new CarnetAnthropicAdapter(carnet, 'testAgent', {
        variables: { USER_NAME: 'Alice' },
      })
      expect(adapterWithVars).toBeDefined()
    })
  })

  describe('Tool schemas', () => {
    it('should generate valid input_schema for listAvailableSkills', () => {
      const tools = adapter.getTools()
      const tool = tools.find((t) => t.name === 'listAvailableSkills')
      expect(tool).toBeDefined()
      const schema = tool?.input_schema as Record<string, unknown>
      expect(schema.type).toBe('object')
      expect(schema.properties).toBeDefined()
      expect(Array.isArray(schema.required)).toBe(true)
    })

    it('should generate valid input_schema for loadSkill with required properties', () => {
      const tools = adapter.getTools()
      const tool = tools.find((t) => t.name === 'loadSkill')
      expect(tool).toBeDefined()
      const schema = tool?.input_schema as Record<string, unknown>
      expect(schema.type).toBe('object')
      expect((schema.required as string[]).includes('skillName')).toBe(true)
      expect(schema.properties).toBeDefined()
    })

    it('should generate valid input_schema for loadToolset', () => {
      const tools = adapter.getTools()
      const tool = tools.find((t) => t.name === 'loadToolset')
      expect(tool).toBeDefined()
      const schema = tool?.input_schema as Record<string, unknown>
      expect((schema.required as string[]).includes('toolsetName')).toBe(true)
    })

    it('should generate valid input_schema for loadTool', () => {
      const tools = adapter.getTools()
      const tool = tools.find((t) => t.name === 'loadTool')
      expect(tool).toBeDefined()
      const schema = tool?.input_schema as Record<string, unknown>
      expect((schema.required as string[]).includes('toolName')).toBe(true)
    })
  })

  describe('Error handling', () => {
    it('should handle non-existent agent gracefully', () => {
      expect(() => {
        new CarnetAnthropicAdapter(carnet, 'nonExistentAgent')
      }).toThrow()
    })

    it('should handle invalid tool execution', async () => {
      const result = await adapter.executeToolCall('invalidTool', {})
      expect(result).toHaveProperty('success', false)
    })
  })
})

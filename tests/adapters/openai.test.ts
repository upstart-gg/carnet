import { describe, it, expect, beforeEach } from 'bun:test'
import { CarnetOpenAIAdapter } from '../../src/adapters/openai'
import { Carnet } from '../../src/lib/index'
import type { Manifest } from '../../src/lib/types'

describe('CarnetOpenAIAdapter', () => {
  let carnet: Carnet
  let adapter: CarnetOpenAIAdapter
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
    adapter = new CarnetOpenAIAdapter(carnet, 'testAgent')
  })

  describe('Constructor', () => {
    it('should create adapter instance for a valid agent', () => {
      expect(adapter).toBeDefined()
    })

    it('should accept optional options', () => {
      const adapterWithOptions = new CarnetOpenAIAdapter(carnet, 'testAgent', {
        includeSkillCatalog: false,
      })
      expect(adapterWithOptions).toBeDefined()
    })
  })

  describe('getConfig()', () => {
    it('should return config object with messages and tools', () => {
      const config = adapter.getConfig()
      expect(config).toHaveProperty('messages')
      expect(config).toHaveProperty('tools')
    })

    it('should return messages array with system prompt', () => {
      const config = adapter.getConfig()
      expect(Array.isArray(config.messages)).toBe(true)
      expect(config.messages.length).toBeGreaterThan(0)
      expect(config.messages[0].role).toBe('system')
      expect(typeof config.messages[0].content).toBe('string')
      expect((config.messages[0].content as string).length).toBeGreaterThan(0)
    })

    it('should return tools as array', () => {
      const config = adapter.getConfig()
      expect(Array.isArray(config.tools)).toBe(true)
    })

    it('should include default tools in tools array', () => {
      const config = adapter.getConfig()
      const toolNames = config.tools.map((t) => t.function.name)
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

    it('should return tools with OpenAI function format', () => {
      const tools = adapter.getTools()
      for (const tool of tools) {
        expect(tool).toHaveProperty('type', 'function')
        expect(tool).toHaveProperty('function')
        expect(tool.function).toHaveProperty('name')
        expect(tool.function).toHaveProperty('description')
        expect(tool.function).toHaveProperty('parameters')
      }
    })

    it('should return valid function schemas', () => {
      const tools = adapter.getTools()
      for (const tool of tools) {
        expect(typeof tool.function.name).toBe('string')
        expect(typeof tool.function.description).toBe('string')
        expect(tool.function.parameters).toBeDefined()
      }
    })
  })

  describe('executeToolCall()', () => {
    it('should handle listAvailableSkills tool', async () => {
      const result = await adapter.executeToolCall('listAvailableSkills', '{}')
      expect(result).toBeDefined()
      expect(typeof result).toBe('object')
    })

    it('should handle loadSkill tool', async () => {
      const result = await adapter.executeToolCall('loadSkill', JSON.stringify({ skillName: 'skillA' }))
      expect(result).toBeDefined()
    })

    it('should handle listSkillToolsets tool', async () => {
      const result = await adapter.executeToolCall('listSkillToolsets', JSON.stringify({ skillName: 'skillA' }))
      expect(result).toBeDefined()
    })

    it('should handle loadToolset tool', async () => {
      const result = await adapter.executeToolCall('loadToolset', JSON.stringify({ toolsetName: 'toolsetA' }))
      expect(result).toBeDefined()
    })

    it('should handle loadTool tool', async () => {
      const result = await adapter.executeToolCall('loadTool', JSON.stringify({ toolName: 'toolA1' }))
      expect(result).toBeDefined()
    })

    it('should handle unknown tool gracefully', async () => {
      const result = await adapter.executeToolCall('unknownTool', '{}')
      expect(result).toHaveProperty('success', false)
      expect(result).toHaveProperty('error')
    })

    it('should handle missing required parameters', async () => {
      const result = await adapter.executeToolCall('loadSkill', '{}')
      expect(result).toBeDefined()
    })
  })

  describe('Options handling', () => {
    it('should respect includeSkillCatalog option', () => {
      const adapterWithoutCatalog = new CarnetOpenAIAdapter(carnet, 'testAgent', {
        includeSkillCatalog: false,
      })
      const promptWithCatalog = adapter.getSystemPrompt()
      const promptWithoutCatalog = adapterWithoutCatalog.getSystemPrompt()
      expect(promptWithCatalog).not.toBe(promptWithoutCatalog)
    })

    it('should respect tools option', () => {
      const adapterWithLimitedTools = new CarnetOpenAIAdapter(carnet, 'testAgent', {
        tools: ['loadSkill'],
      })
      const tools = adapterWithLimitedTools.getTools()
      expect(tools.length).toBe(1)
      expect(tools[0].function.name).toBe('loadSkill')
    })

    it('should accept variable options', () => {
      const adapterWithVars = new CarnetOpenAIAdapter(carnet, 'testAgent', {
        variables: { USER_NAME: 'Alice' },
      })
      expect(adapterWithVars).toBeDefined()
    })
  })

  describe('Tool parameters schema', () => {
    it('should generate valid parameters for listAvailableSkills', () => {
      const tools = adapter.getTools()
      const tool = tools.find((t) => t.function.name === 'listAvailableSkills')
      expect(tool).toBeDefined()
      const params = tool?.function.parameters as Record<string, unknown>
      expect(params.type).toBe('object')
      expect(params.properties).toBeDefined()
    })

    it('should generate valid parameters for loadSkill with required properties', () => {
      const tools = adapter.getTools()
      const tool = tools.find((t) => t.function.name === 'loadSkill')
      expect(tool).toBeDefined()
      const params = tool?.function.parameters as Record<string, unknown>
      expect(params.type).toBe('object')
      expect((params.required as string[]).includes('skillName')).toBe(true)
      expect(params.properties).toBeDefined()
    })

    it('should generate valid parameters for loadToolset', () => {
      const tools = adapter.getTools()
      const tool = tools.find((t) => t.function.name === 'loadToolset')
      expect(tool).toBeDefined()
      const params = tool?.function.parameters as Record<string, unknown>
      expect((params.required as string[]).includes('toolsetName')).toBe(true)
    })

    it('should generate valid parameters for loadTool', () => {
      const tools = adapter.getTools()
      const tool = tools.find((t) => t.function.name === 'loadTool')
      expect(tool).toBeDefined()
      const params = tool?.function.parameters as Record<string, unknown>
      expect((params.required as string[]).includes('toolName')).toBe(true)
    })
  })

  describe('Error handling', () => {
    it('should handle non-existent agent gracefully', () => {
      expect(() => {
        new CarnetOpenAIAdapter(carnet, 'nonExistentAgent')
      }).toThrow()
    })

    it('should handle invalid tool execution', async () => {
      const result = await adapter.executeToolCall('invalidTool', '{}')
      expect(result).toHaveProperty('success', false)
    })
  })
})

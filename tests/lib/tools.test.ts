import { describe, it, expect, beforeEach } from 'bun:test'
import { Carnet, createCarnetTools } from '../../src/lib/index'
import type { Manifest, ToolOptions } from '../../src/lib/types'

describe('Carnet Tools - Vercel AI SDK Integration', () => {
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
        testAgent: {
          name: 'testAgent',
          description: 'A test agent',
          initialSkills: ['skillA'],
          skills: ['skillB'],
          prompt: 'You are a test agent. Use your skills to help the user.',
        },
      },
      skills: {
        skillA: {
          name: 'skillA',
          description: 'First skill',
          toolsets: ['toolsetA'],
          content: '# Skill A\n\nSkill A content',
        },
        skillB: {
          name: 'skillB',
          description: 'Second skill',
          toolsets: ['toolsetB'],
          content: '# Skill B\n\nSkill B content',
        },
      },
      toolsets: {
        toolsetA: {
          name: 'toolsetA',
          description: 'Toolset A',
          tools: ['toolA1', 'toolA2'],
          content: '# Toolset A\n\nToolset A content with instructions',
        },
        toolsetB: {
          name: 'toolsetB',
          description: 'Toolset B',
          tools: ['toolB1'],
          content: '# Toolset B\n\nToolset B content',
        },
      },
      tools: {
        toolA1: {
          name: 'toolA1',
          description: 'Tool A1 description',
          content: '# Tool A1\n\nDetailed documentation for Tool A1',
        },
        toolA2: {
          name: 'toolA2',
          description: 'Tool A2 description',
          content: '# Tool A2\n\nDetailed documentation for Tool A2',
        },
        toolB1: {
          name: 'toolB1',
          description: 'Tool B1 description',
          content: '# Tool B1\n\nDetailed documentation for Tool B1',
        },
      },
    }

    carnet = new Carnet(manifest)
  })

  describe('createCarnetTools', () => {
    it('should create all tools by default', () => {
      const tools = createCarnetTools(carnet, 'testAgent')
      expect(Object.keys(tools)).toContain('listAvailableSkills')
      expect(Object.keys(tools)).toContain('loadSkill')
      expect(Object.keys(tools)).toContain('listSkillToolsets')
      expect(Object.keys(tools)).toContain('loadToolset')
      expect(Object.keys(tools)).toContain('loadTool')
    })

    it('should create only specified tools when tools option is provided', () => {
      const tools = createCarnetTools(carnet, 'testAgent', {
        tools: ['listAvailableSkills', 'loadSkill'],
      })
      expect(Object.keys(tools)).toHaveLength(2)
      expect(Object.keys(tools)).toContain('listAvailableSkills')
      expect(Object.keys(tools)).toContain('loadSkill')
      expect(Object.keys(tools)).not.toContain('loadToolset')
    })

    it('should create empty ToolSet when tools array is empty', () => {
      const tools = createCarnetTools(carnet, 'testAgent', {
        tools: [],
      })
      expect(Object.keys(tools)).toHaveLength(0)
    })
  })

  describe('listAvailableSkills tool', () => {
    it('should list all available skills', async () => {
      const tools = createCarnetTools(carnet, 'testAgent')
      const result = await tools.listAvailableSkills.execute({})

      expect(result.success).toBe(true)
      expect(result.skills).toBeDefined()
      expect(result.skills.length).toBe(2)
      expect(result.skills[0].name).toBe('skillA')
      expect(result.skills[1].name).toBe('skillB')
    })

    it('should include skill metadata in results', async () => {
      const tools = createCarnetTools(carnet, 'testAgent')
      const result = await tools.listAvailableSkills.execute({})

      const skillA = result.skills.find((s) => s.name === 'skillA')
      expect(skillA.description).toBe('First skill')
      expect(skillA.toolsets).toEqual(['toolsetA'])
    })

    it('should return error for invalid agent', async () => {
      const tools = createCarnetTools(carnet, 'invalidAgent')
      const result = await tools.listAvailableSkills.execute({})

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('loadSkill tool', () => {
    it('should load skill content by name', async () => {
      const tools = createCarnetTools(carnet, 'testAgent')
      const result = await tools.loadSkill.execute({ skillName: 'skillA' })

      expect(result.success).toBe(true)
      expect(result.content).toContain('# Skill A')
      expect(result.metadata.name).toBe('skillA')
      expect(result.metadata.description).toBe('First skill')
    })

    it('should return error for non-existent skill', async () => {
      const tools = createCarnetTools(carnet, 'testAgent')
      const result = await tools.loadSkill.execute({ skillName: 'non-existent' })

      expect(result.success).toBe(false)
      expect(result.error).toContain('Skill not found')
      expect(result.available).toBeDefined()
    })

    it('should list available skills when skill not found', async () => {
      const tools = createCarnetTools(carnet, 'testAgent')
      const result = await tools.loadSkill.execute({ skillName: 'missing' })

      expect(result.available).toEqual(['skillA', 'skillB'])
    })
  })

  describe('listSkillToolsets tool', () => {
    it('should list toolsets for a skill', async () => {
      const tools = createCarnetTools(carnet, 'testAgent')
      const result = await tools.listSkillToolsets.execute({ skillName: 'skillA' })

      expect(result.success).toBe(true)
      expect(result.toolsets).toBeDefined()
      expect(result.toolsets.length).toBe(1)
      expect(result.toolsets[0].name).toBe('toolsetA')
      expect(result.toolsets[0].description).toBe('Toolset A')
      expect(result.toolsets[0].toolCount).toBe(2)
    })

    it('should return error for non-existent skill', async () => {
      const tools = createCarnetTools(carnet, 'testAgent')
      const result = await tools.listSkillToolsets.execute({ skillName: 'non-existent' })

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('loadToolset tool', () => {
    it('should load toolset content and tools', async () => {
      const tools = createCarnetTools(carnet, 'testAgent')
      const result = await tools.loadToolset.execute({ toolsetName: 'toolsetA' })

      expect(result.success).toBe(true)
      expect(result.content).toContain('# Toolset A')
      expect(result.availableTools).toBeDefined()
      expect(result.availableTools.length).toBe(2)
      expect(result.availableTools[0].name).toBe('toolA1')
    })

    it('should return error for non-existent toolset', async () => {
      const tools = createCarnetTools(carnet, 'testAgent')
      const result = await tools.loadToolset.execute({ toolsetName: 'non-existent' })

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('loadTool tool', () => {
    it('should load tool content and metadata', async () => {
      const tools = createCarnetTools(carnet, 'testAgent')
      const result = await tools.loadTool.execute({ toolName: 'toolA1' })

      expect(result.success).toBe(true)
      expect(result.content).toContain('# Tool A1')
      expect(result.metadata.name).toBe('toolA1')
      expect(result.metadata.description).toBe('Tool A1 description')
    })

    it('should return error for non-existent tool', async () => {
      const tools = createCarnetTools(carnet, 'testAgent')
      const result = await tools.loadTool.execute({ toolName: 'non-existent' })

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('progressive loading flow', () => {
    it('should support full progressive loading workflow', async () => {
      const tools = createCarnetTools(carnet, 'testAgent')

      // Step 1: List available skills
      const skillsList = await tools.listAvailableSkills.execute({})
      expect(skillsList.success).toBe(true)
      expect(skillsList.skills).toHaveLength(2)

      // Step 2: Load a specific skill
      const skillContent = await tools.loadSkill.execute({ skillName: 'skillA' })
      expect(skillContent.success).toBe(true)
      expect(skillContent.content).toContain('# Skill A')

      // Step 3: List toolsets in skill
      const toolsetsInSkill = await tools.listSkillToolsets.execute({ skillName: 'skillA' })
      expect(toolsetsInSkill.success).toBe(true)
      expect(toolsetsInSkill.toolsets).toHaveLength(1)

      // Step 4: Load a specific toolset
      const toolsetContent = await tools.loadToolset.execute({
        toolsetName: toolsetsInSkill.toolsets[0].name,
      })
      expect(toolsetContent.success).toBe(true)
      expect(toolsetContent.availableTools).toHaveLength(2)

      // Step 5: Load a specific tool
      const toolContent = await tools.loadTool.execute({
        toolName: toolsetContent.availableTools[0].name,
      })
      expect(toolContent.success).toBe(true)
      expect(toolContent.content).toContain('# Tool A1')
    })
  })
})

import { beforeEach, describe, expect, it } from 'bun:test'
import { tool } from 'ai'
import { z } from 'zod'
import { Carnet } from '../../src/lib/index'
import { createCarnetTools } from '../../src/lib/tools'
import type { Manifest } from '../../src/lib/types'

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
    it('should create the loadSkill meta-tool by default', () => {
      const tools = createCarnetTools(carnet, 'testAgent')
      expect(Object.keys(tools)).toContain('loadSkill')
      expect(Object.keys(tools)).toHaveLength(1)
    })

    it('should create only the loadSkill meta-tool', () => {
      const tools = createCarnetTools(carnet, 'testAgent')
      expect(Object.keys(tools)).toEqual(['loadSkill'])
      // Skills are discovered via the system prompt's skill catalog
    })

    it('should have loadSkill tool when creating tools', () => {
      const tools = createCarnetTools(carnet, 'testAgent')
      // Factory now creates only the loadSkill meta-tool
      expect(Object.keys(tools)).toHaveLength(1)
      expect(Object.keys(tools)).toContain('loadSkill')
    })
  })


  describe('loadSkill tool', () => {
    it('should load skill content by name', async () => {
      const tools = createCarnetTools(carnet, 'testAgent')
      if (!tools.loadSkill.execute) {
        throw new Error('execute function not found')
      }

      const result = await tools.loadSkill.execute(
        { skillName: 'skillA' },
        {
          toolCallId: 'test-call-id',
          messages: [],
        }
      )

      if (!result || !('success' in result)) {
        throw new Error('Expected result with success property')
      }

      expect(result.success).toBe(true)
      if (result.success && 'content' in result && 'metadata' in result && result.metadata) {
        expect(result.content).toContain('# Skill A')
        expect(result.metadata.name).toBe('skillA')
        expect(result.metadata.description).toBe('First skill')
      }
    })

    it('should return error for non-existent skill', async () => {
      const tools = createCarnetTools(carnet, 'testAgent')
      if (!tools.loadSkill.execute) {
        throw new Error('execute function not found')
      }

      const result = await tools.loadSkill.execute(
        { skillName: 'non-existent' },
        {
          toolCallId: 'test-call-id',
          messages: [],
        }
      )

      if (!result || !('success' in result)) {
        throw new Error('Expected result with success property')
      }

      expect(result.success).toBe(false)
      if (!result.success && 'error' in result) {
        expect(result.error).toContain('Skill not found')
        if ('available' in result) {
          expect(result.available).toBeDefined()
        }
      }
    })

    it('should list available skills when skill not found', async () => {
      const tools = createCarnetTools(carnet, 'testAgent')
      if (!tools.loadSkill.execute) {
        throw new Error('execute function not found')
      }

      const result = await tools.loadSkill.execute(
        { skillName: 'missing' },
        {
          toolCallId: 'test-call-id',
          messages: [],
        }
      )

      if (result && 'available' in result) {
        expect(result.available).toEqual(['skillA', 'skillB'])
      }
    })
  })

  describe('listSkillToolsets tool', () => {
    // listSkillToolsets is now available as a Carnet API method (see carnet.listSkillToolsets)
  })

  describe('progressive loading flow', () => {
    it('should support progressive loading workflow with loadSkill', async () => {
      const tools = createCarnetTools(carnet, 'testAgent')

      // Skills are discovered via the system prompt's skill catalog
      const prompt = carnet.getSystemPrompt('testAgent')
      expect(prompt).toContain('Available Skills')
      expect(prompt).toContain('skillA')
      expect(prompt).toContain('skillB')

      // Load a specific skill when needed
      if (!tools.loadSkill.execute) {
        throw new Error('loadSkill.execute not found')
      }
      const skillContent = await tools.loadSkill.execute(
        { skillName: 'skillA' },
        {
          toolCallId: 'test-call-id',
          messages: [],
        }
      )
      if (!skillContent || !('success' in skillContent)) {
        throw new Error('Expected result with success property')
      }
      expect(skillContent.success).toBe(true)
      if (skillContent.success && 'content' in skillContent) {
        expect(skillContent.content).toContain('# Skill A')
      }

      // After loading a skill, domain tools from its toolsets are available when merging domain toolsets
      const mergedTools = carnet.getTools('testAgent', {
        tools: {
          toolA1: tool({
            description: 'A',
            inputSchema: z.object({}),
            execute: async () => ({ ok: true }),
          }),
          toolA2: tool({
            description: 'A2',
            inputSchema: z.object({}),
            execute: async () => ({ ok: true }),
          }),
          toolB1: tool({
            description: 'B1',
            inputSchema: z.object({}),
            execute: async () => ({ ok: true }),
          }),
        },
      })

      // Should include domain tools merged from provided toolsets
      expect(Object.keys(mergedTools)).toContain('toolA1')
      expect(Object.keys(mergedTools)).toContain('toolA2')
    })
  })
})

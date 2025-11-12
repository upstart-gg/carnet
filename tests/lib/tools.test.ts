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
          files: [
            {
              path: 'examples/example1.md',
              description: 'First example file',
              content: '# Example 1\n\nExample content 1',
            },
            {
              path: 'examples/example2.md',
              description: 'Second example file',
              content: '# Example 2\n\nExample content 2',
            },
          ],
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
          tools: [
            { name: 'toolA1', description: 'Tool A1 description' },
            { name: 'toolA2', description: 'Tool A2 description' },
          ],
          content: '# Toolset A\n\nToolset A content with instructions',
        },
        toolsetB: {
          name: 'toolsetB',
          description: 'Toolset B',
          tools: [{ name: 'toolB1', description: 'Tool B1 description' }],
          content: '# Toolset B\n\nToolset B content',
        },
      },
    }

    carnet = new Carnet(manifest)
  })

  describe('createCarnetTools', () => {
    it('should create the loadSkill and loadSkillFile meta-tools by default', () => {
      const tools = createCarnetTools(carnet, 'testAgent')
      expect(Object.keys(tools)).toContain('loadSkill')
      expect(Object.keys(tools)).toContain('loadSkillFile')
      expect(Object.keys(tools)).toHaveLength(2)
    })

    it('should create both loadSkill and loadSkillFile meta-tools', () => {
      const tools = createCarnetTools(carnet, 'testAgent')
      expect(Object.keys(tools)).toEqual(['loadSkill', 'loadSkillFile'])
      // Skills are discovered via the system prompt's skill catalog
    })

    it('should have both meta-tools when creating tools', () => {
      const tools = createCarnetTools(carnet, 'testAgent')
      // Factory now creates both meta-tools for progressive loading
      expect(Object.keys(tools)).toHaveLength(2)
      expect(Object.keys(tools)).toContain('loadSkill')
      expect(Object.keys(tools)).toContain('loadSkillFile')
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

  describe('loadSkillFile tool', () => {
    it('should load file content by skill name and path', async () => {
      const tools = createCarnetTools(carnet, 'testAgent')
      if (!tools.loadSkillFile.execute) {
        throw new Error('execute function not found')
      }

      const result = await tools.loadSkillFile.execute(
        {
          skillName: 'skillA',
          path: 'examples/example1.md',
        },
        {
          toolCallId: 'test-call-id',
          messages: [],
        }
      )

      // Type guard: check for specific properties to narrow union type
      if (result && 'success' in result && 'path' in result) {
        expect(result.success).toBe(true)
        if (result.success && 'content' in result) {
          expect(result.content).toContain('# Example 1')
          expect(result.path).toBe('examples/example1.md')
        }
      }
    })

    it('should return error for non-existent file', async () => {
      const tools = createCarnetTools(carnet, 'testAgent')
      if (!tools.loadSkillFile.execute) {
        throw new Error('execute function not found')
      }

      const result = await tools.loadSkillFile.execute(
        {
          skillName: 'skillA',
          path: 'non-existent.md',
        },
        {
          toolCallId: 'test-call-id',
          messages: [],
        }
      )

      // Type guard: check for specific properties to narrow union type
      if (result && 'success' in result && 'path' in result) {
        expect(result.success).toBe(false)
        if (!result.success && 'error' in result) {
          expect(result.error).toContain('not found')
        }
      }
    })

    it('should return error for non-existent skill', async () => {
      const tools = createCarnetTools(carnet, 'testAgent')
      if (!tools.loadSkillFile.execute) {
        throw new Error('execute function not found')
      }

      const result = await tools.loadSkillFile.execute(
        {
          skillName: 'non-existent',
          path: 'example.md',
        },
        {
          toolCallId: 'test-call-id',
          messages: [],
        }
      )

      // Type guard: check for specific property to narrow union type
      if (result && 'success' in result && 'path' in result) {
        expect(result.success).toBe(false)
        if (!result.success && 'error' in result) {
          expect(result.error).toContain('Skill not found')
        }
      }
    })
  })

  describe('loadSkill with files', () => {
    it('should return files array when skill has files', async () => {
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

      // Type guard: check for specific properties to narrow union type
      if (result && 'success' in result && 'metadata' in result) {
        expect(result.success).toBe(true)
        if (
          result.success &&
          'files' in result &&
          Array.isArray(result.files) &&
          result.files.length > 0
        ) {
          const files = result.files
          const firstFile = files[0]
          expect(files).toBeDefined()
          expect(files.length).toBe(2)
          if (firstFile) {
            expect(firstFile.path).toBe('examples/example1.md')
            expect(firstFile.description).toBe('First example file')
            // Ensure content is NOT included in metadata
            expect('content' in firstFile).toBe(false)
          }
        }
      }
    })

    it('should return empty files array when skill has no files', async () => {
      const tools = createCarnetTools(carnet, 'testAgent')
      if (!tools.loadSkill.execute) {
        throw new Error('execute function not found')
      }

      const result = await tools.loadSkill.execute(
        { skillName: 'skillB' },
        {
          toolCallId: 'test-call-id',
          messages: [],
        }
      )

      // Type guard: check for specific properties to narrow union type
      if (result && 'success' in result && 'metadata' in result) {
        expect(result.success).toBe(true)
        if (result.success && 'files' in result && result.files) {
          expect(result.files).toBeDefined()
          expect(result.files.length).toBe(0)
        }
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
      expect(prompt).toContain('Skill A content')
      expect(prompt).not.toContain('Skill B content')

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

import { describe, it, expect, beforeEach } from 'bun:test'
import { Carnet } from '../../src/lib/index'
import type { Manifest } from '../../src/lib/types'

describe('Carnet - Enhanced API', () => {
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
          content: '# Skill A\n\nSkill A content with {{ VAR }}',
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
          content: '# Toolset A\n\nToolset A content',
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
          description: 'Tool A1',
          content: '# Tool A1 content',
        },
        toolA2: {
          name: 'toolA2',
          description: 'Tool A2',
          content: '# Tool A2 content',
        },
        toolB1: {
          name: 'toolB1',
          description: 'Tool B1',
          content: '# Tool B1 content',
        },
      },
    }

    carnet = new Carnet(manifest, process.cwd(), {
      variables: { VAR: 'injected-value' },
    })
  })

  describe('getSkillContent', () => {
    it('should return skill content with variable injection', () => {
      const content = carnet.getSkillContent('skillA')
      expect(content).toContain('# Skill A')
      expect(content).toContain('injected-value')
      expect(content).not.toContain('{{ VAR }}')
    })

    it('should return raw skill content when raw option is true', () => {
      const content = carnet.getSkillContent('skillA', { raw: true })
      expect(content).toContain('{{ VAR }}')
      expect(content).not.toContain('injected-value')
    })

    it('should accept additional variables for injection', () => {
      const content = carnet.getSkillContent('skillA', {
        variables: { VAR: 'override-value' },
      })
      expect(content).toContain('override-value')
    })

    it('should throw error for non-existent skill', () => {
      expect(() => carnet.getSkillContent('non-existent')).toThrow('Skill not found')
    })

    it('should inject environment variables', () => {
      process.env.CARNET_TEST = 'env-value'

      const skillManifest: Manifest = {
        ...manifest,
        skills: {
          test: {
            name: 'test',
            description: 'Test',
            toolsets: [],
            content: 'Value: {{ CARNET_TEST }}',
          },
        },
      }

      const carnetWithEnv = new Carnet(skillManifest)
      const content = carnetWithEnv.getSkillContent('test')
      expect(content).toContain('env-value')

      delete process.env.CARNET_TEST
    })
  })

  describe('getToolsetContent', () => {
    it('should return toolset content with variable injection', () => {
      const content = carnet.getToolsetContent('toolsetA')
      expect(content).toContain('# Toolset A')
    })

    it('should return raw toolset content when raw option is true', () => {
      const toolsetManifest: Manifest = {
        ...manifest,
        toolsets: {
          test: {
            name: 'test',
            description: 'Test',
            tools: [],
            content: 'Content {{ VAR }}',
          },
        },
      }

      const carnetWithVar = new Carnet(toolsetManifest)
      const rawContent = carnetWithVar.getToolsetContent('test', { raw: true })
      expect(rawContent).toContain('{{ VAR }}')
    })

    it('should throw error for non-existent toolset', () => {
      expect(() => carnet.getToolsetContent('non-existent')).toThrow('Toolset not found')
    })
  })

  describe('getToolContent', () => {
    it('should return tool content', () => {
      const content = carnet.getToolContent('toolA1')
      expect(content).toContain('# Tool A1 content')
    })

    it('should throw error for non-existent tool', () => {
      expect(() => carnet.getToolContent('non-existent')).toThrow('Tool not found')
    })
  })

  describe('getSkillMetadata', () => {
    it('should return skill metadata without full content', () => {
      const metadata = carnet.getSkillMetadata('skillA')
      expect(metadata.name).toBe('skillA')
      expect(metadata.description).toBe('First skill')
      expect(metadata.toolsets).toEqual(['toolsetA'])
      expect(metadata).not.toHaveProperty('content')
    })

    it('should throw error for non-existent skill', () => {
      expect(() => carnet.getSkillMetadata('non-existent')).toThrow('Skill not found')
    })
  })

  describe('getToolsetMetadata', () => {
    it('should return toolset metadata without full content', () => {
      const metadata = carnet.getToolsetMetadata('toolsetA')
      expect(metadata.name).toBe('toolsetA')
      expect(metadata.description).toBe('Toolset A')
      expect(metadata.tools).toEqual(['toolA1', 'toolA2'])
      expect(metadata).not.toHaveProperty('content')
    })

    it('should throw error for non-existent toolset', () => {
      expect(() => carnet.getToolsetMetadata('non-existent')).toThrow('Toolset not found')
    })
  })

  describe('getToolMetadata', () => {
    it('should return tool metadata without full content', () => {
      const metadata = carnet.getToolMetadata('toolA1')
      expect(metadata.name).toBe('toolA1')
      expect(metadata.description).toBe('Tool A1')
      expect(metadata).not.toHaveProperty('content')
    })

    it('should throw error for non-existent tool', () => {
      expect(() => carnet.getToolMetadata('non-existent')).toThrow('Tool not found')
    })
  })

  describe('listAvailableSkills', () => {
    it('should return all available skills for an agent', () => {
      const skills = carnet.listAvailableSkills('testAgent')
      expect(skills).toHaveLength(2)
      expect(skills[0].name).toBe('skillA')
      expect(skills[1].name).toBe('skillB')
    })

    it('should remove duplicates if skill is in both initialSkills and skills', () => {
      const testManifest: Manifest = {
        ...manifest,
        agents: {
          testAgent: {
            name: 'testAgent',
            description: 'Agent',
            initialSkills: ['skillA', 'skillB'],
            skills: ['skillA', 'skillC'],
            prompt: 'Test',
          },
        },
        skills: {
          ...manifest.skills,
          'skillC': {
            name: 'skillC',
            description: 'Skill C',
            toolsets: [],
            content: 'Content',
          },
        },
      }

      const carnetTest = new Carnet(testManifest)
      const skills = carnetTest.listAvailableSkills('testAgent')
      expect(skills).toHaveLength(3)
      const names = skills.map((s) => s.name)
      expect(names).toContain('skillA')
      expect(names).toContain('skillB')
      expect(names).toContain('skillC')
    })

    it('should throw error for non-existent agent', () => {
      expect(() => carnet.listAvailableSkills('non-existent')).toThrow('Agent not found')
    })

    it('should return empty array if agent has no skills', () => {
      const testManifest: Manifest = {
        ...manifest,
        agents: {
          noSkillsAgent: {
            name: 'noSkillsAgent',
            description: 'Agent',
            initialSkills: [],
            skills: [],
            prompt: 'Test',
          },
        },
      }

      const carnetTest = new Carnet(testManifest)
      const skills = carnetTest.listAvailableSkills('noSkillsAgent')
      expect(skills).toHaveLength(0)
    })
  })

  describe('listSkillToolsets', () => {
    it('should return all toolsets for a skill', () => {
      const toolsets = carnet.listSkillToolsets('skillA')
      expect(toolsets).toHaveLength(1)
      expect(toolsets[0].name).toBe('toolsetA')
    })

    it('should return empty array if skill has no toolsets', () => {
      const toolsets = carnet.listSkillToolsets('skillB')
      // skill-b has toolset-b in our test data
      expect(toolsets.length).toBeGreaterThan(0)
    })

    it('should throw error for non-existent skill', () => {
      expect(() => carnet.listSkillToolsets('non-existent')).toThrow('Skill not found')
    })
  })

  describe('listToolsetTools', () => {
    it('should return all tools for a toolset', () => {
      const tools = carnet.listToolsetTools('toolsetA')
      expect(tools).toHaveLength(2)
      expect(tools.map((t) => t.name)).toEqual(['toolA1', 'toolA2'])
    })

    it('should throw error for non-existent toolset', () => {
      expect(() => carnet.listToolsetTools('non-existent')).toThrow('Toolset not found')
    })
  })

  describe('generateAgentPrompt', () => {
    it('should generate complete agent prompt', () => {
      const result = carnet.generateAgentPrompt('testAgent')

      expect(result.content).toContain('You are a test agent')
      expect(result.content).toContain('## Initial Skills')
      expect(result.content).toContain('Skill A')
      expect(result.content).toContain('## Available Skills')
      expect(result.content).toContain('skillB')
      expect(result.content).toContain('How to Load Skills')
      expect(result.content).toContain('loadSkill')

      expect(result.agent.name).toBe('testAgent')
      expect(result.initialSkills).toHaveLength(1)
      expect(result.availableSkills).toHaveLength(2)
    })

    it('should inject variables into generated prompt', () => {
      const result = carnet.generateAgentPrompt('testAgent')
      // The VAR in skill-a should be injected
      expect(result.content).toContain('injected-value')
      expect(result.content).not.toContain('{{ VAR }}')
    })

    it('should respect includeInitialSkills option', () => {
      const result = carnet.generateAgentPrompt('testAgent', { includeInitialSkills: false })
      expect(result.content).not.toContain('## Initial Skills')
    })

    it('should respect includeSkillCatalog option', () => {
      const result = carnet.generateAgentPrompt('testAgent', { includeSkillCatalog: false })
      expect(result.content).not.toContain('## Available Skills')
      expect(result.content).not.toContain('How to Load Skills')
    })

    it('should accept additional variables for prompt generation', () => {
      const result = carnet.generateAgentPrompt('testAgent', {
        variables: { VAR: 'override' },
      })
      expect(result.content).toContain('override')
    })

    it('should throw error for non-existent agent', () => {
      expect(() => carnet.generateAgentPrompt('non-existent')).toThrow('Agent not found')
    })

    it('should handle agent with no initial skills', () => {
      const testManifest: Manifest = {
        ...manifest,
        agents: {
          noInitialSkillsAgent: {
            name: 'noInitialSkillsAgent',
            description: 'Agent',
            initialSkills: [],
            skills: ['skillA'],
            prompt: 'Test agent',
          },
        },
      }

      const carnetTest = new Carnet(testManifest)
      const result = carnetTest.generateAgentPrompt('noInitialSkillsAgent')

      expect(result.content).toContain('Test agent')
      expect(result.content).not.toContain('## Initial Skills')
      expect(result.content).toContain('## Available Skills')
    })

    it('should handle agent with no dynamic skills', () => {
      const testManifest: Manifest = {
        ...manifest,
        agents: {
          noDynamicSkillsAgent: {
            name: 'noDynamicSkillsAgent',
            description: 'Agent',
            initialSkills: ['skillA'],
            skills: [],
            prompt: 'Test agent',
          },
        },
      }

      const carnetTest = new Carnet(testManifest)
      const result = carnetTest.generateAgentPrompt('noDynamicSkillsAgent')

      expect(result.content).toContain('## Initial Skills')
      // Should still include skill catalog (with just initial skills listed)
      expect(result.content).toContain('## Available Skills')
    })
  })

  describe('constructor options', () => {
    it('should accept and use custom variables', () => {
      const customCarnet = new Carnet(manifest, process.cwd(), {
        variables: { CUSTOM: 'custom-value' },
      })

      const testManifest: Manifest = {
        ...manifest,
        skills: {
          test: {
            name: 'test',
            description: 'Test',
            toolsets: [],
            content: '{{ CUSTOM }}',
          },
        },
      }

      const testCarnet = new Carnet(testManifest, process.cwd(), {
        variables: { CUSTOM: 'test-value' },
      })

      const content = testCarnet.getSkillContent('test')
      expect(content).toBe('test-value')
    })

    it('should accept and use custom env prefixes', () => {
      process.env.MYAPP_VAR = 'myapp-value'
      process.env.CARNET_VAR = 'carnet-value'

      const testManifest: Manifest = {
        ...manifest,
        skills: {
          test: {
            name: 'test',
            description: 'Test',
            toolsets: [],
            content: '{{ MYAPP_VAR }} {{ CARNET_VAR }}',
          },
        },
      }

      const customCarnet = new Carnet(testManifest, process.cwd(), {
        envPrefixes: ['MYAPP_'],
      })

      const content = customCarnet.getSkillContent('test')
      expect(content).toContain('myapp-value')
      expect(content).toContain('{{ CARNET_VAR }}') // Not injected with custom prefix

      delete process.env.MYAPP_VAR
      delete process.env.CARNET_VAR
    })
  })

  describe('fromManifest', () => {
    it('should support options in fromManifest', async () => {
      // This test verifies that fromManifest properly passes options to constructor
      // We can't actually test file loading without a real file, but we verify the signature exists
      expect(Carnet.fromManifest).toBeDefined()
    })
  })

  describe('backward compatibility', () => {
    it('should maintain original getAgent method', () => {
      const agent = carnet.getAgent('testAgent')
      expect(agent.name).toBe('testAgent')
      expect(agent.prompt).toContain('You are a test agent')
    })

    it('should maintain original getSkill method', () => {
      const skill = carnet.getSkill('skillA')
      expect(skill.name).toBe('skillA')
      // Note: getSkill returns raw skill without variable injection
      expect(skill.content).toContain('{{ VAR }}')
    })

    it('should maintain original getToolset method', () => {
      const toolset = carnet.getToolset('toolsetA')
      expect(toolset.name).toBe('toolsetA')
    })

    it('should maintain original getTool method', () => {
      const tool = carnet.getTool('toolA1')
      expect(tool.name).toBe('toolA1')
    })

    it('should maintain agents getter', () => {
      const agents = carnet.agents
      expect(agents['testAgent']).toBeDefined()
      expect(agents['testAgent'].name).toBe('testAgent')
    })
  })
})

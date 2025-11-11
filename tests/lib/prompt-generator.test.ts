import { beforeEach, describe, expect, it } from 'bun:test'
import { PromptGenerator } from '../../src/lib/prompt-generator'
import type { Agent, Skill, SkillMetadata } from '../../src/lib/types'
import { VariableInjector } from '../../src/lib/variable-injector'

describe('PromptGenerator', () => {
  let generator: PromptGenerator
  let injector: VariableInjector

  beforeEach(() => {
    injector = new VariableInjector()
    generator = new PromptGenerator(injector)
  })

  describe('generateAgentPrompt', () => {
    it('should generate agent prompt with initial skills and skill catalog', () => {
      const agent: Agent = {
        name: 'test-agent',
        description: 'Test agent',
        initialSkills: ['skill1'],
        skills: ['skill2'],
        prompt: 'You are a test agent.',
      }

      const initialSkills: Skill[] = [
        {
          name: 'skill1',
          description: 'First skill',
          toolsets: ['toolset1'],
          content: '# Skill 1\n\nThis is skill 1 content.',
        },
      ]

      const availableSkills: SkillMetadata[] = [
        { name: 'skill1', description: 'First skill', toolsets: ['toolset1'] },
        { name: 'skill2', description: 'Second skill', toolsets: ['toolset2'] },
      ]

      const result = generator.generateAgentPrompt(agent, initialSkills, availableSkills)

      expect(result.content).toContain('You are a test agent.')
      expect(result.content).toContain('## Skills')
      expect(result.content).toContain('# Skill 1')
      expect(result.content).toContain('This is skill 1 content.')
      expect(result.content).toContain('## On-Demand Skills')
      expect(result.content).toContain('skill2')
      expect(result.content).toContain('How to Load Skills')
      expect(result.agent).toEqual(agent)
      expect(result.initialSkills).toEqual(initialSkills)
      expect(result.availableSkills).toEqual(availableSkills)
    })

    it('should inject variables into agent prompt', () => {
      const injectorWithVars = new VariableInjector({
        variables: { APP_NAME: 'MyApp' },
      })
      const genWithVars = new PromptGenerator(injectorWithVars)

      const agent: Agent = {
        name: 'test-agent',
        description: 'Test agent',
        initialSkills: [],
        skills: [],
        prompt: 'Welcome to {{ APP_NAME }}',
      }

      const result = genWithVars.generateAgentPrompt(agent, [], [])
      expect(result.content).toContain('Welcome to MyApp')
    })

    it('should inject variables into initial skills content', () => {
      const injectorWithVars = new VariableInjector({
        variables: { SKILL_VERSION: '2.0' },
      })
      const genWithVars = new PromptGenerator(injectorWithVars)

      const agent: Agent = {
        name: 'test-agent',
        description: 'Test agent',
        initialSkills: ['skill1'],
        skills: [],
        prompt: 'Test prompt',
      }

      const initialSkills: Skill[] = [
        {
          name: 'skill1',
          description: 'Skill with variable',
          toolsets: [],
          content: 'Version: {{ SKILL_VERSION }}',
        },
      ]

      const result = genWithVars.generateAgentPrompt(agent, initialSkills, [], {
        variables: { SKILL_VERSION: '3.0' },
      })

      expect(result.content).toContain('Version: 3.0')
    })

    it('should not include initial skills section when no initial skills', () => {
      const agent: Agent = {
        name: 'test-agent',
        description: 'Test agent',
        initialSkills: [],
        skills: [],
        prompt: 'Test prompt',
      }

      const result = generator.generateAgentPrompt(agent, [], [])
      expect(result.content).not.toContain('## Initial Skills')
    })

    it('should not include skill catalog section when no available skills', () => {
      const agent: Agent = {
        name: 'test-agent',
        description: 'Test agent',
        initialSkills: [],
        skills: [],
        prompt: 'Test prompt',
      }

      const result = generator.generateAgentPrompt(agent, [], [])
      expect(result.content).not.toContain('## Available Skills (On-Demand)')
      expect(result.content).not.toContain('How to Load Skills')
    })
  })

  describe('generateSkillMetadataSection', () => {
    it('should generate skill metadata section', () => {
      const skillMetadata: SkillMetadata = {
        name: 'memory-skill',
        description: 'Manage memory operations',
        toolsets: ['memory-toolset'],
      }

      const toolsetMetadata = [
        {
          name: 'memory-toolset',
          description: 'Memory tools',
          tools: [
            { name: 'read', description: 'Read memory' },
            { name: 'write', description: 'Write memory' },
          ],
        },
      ]

      const section = generator.generateSkillMetadataSection(skillMetadata, toolsetMetadata)

      expect(section).toContain('## Skill: memory-skill')
      expect(section).toContain('Manage memory operations')
      expect(section).toContain('### Associated Toolsets')
      expect(section).toContain('memory-toolset')
    })

    it('should handle skills without toolsets', () => {
      const skillMetadata: SkillMetadata = {
        name: 'simple-skill',
        description: 'Simple skill',
        toolsets: [],
      }

      const section = generator.generateSkillMetadataSection(skillMetadata, [])

      expect(section).toContain('## Skill: simple-skill')
      expect(section).toContain('Simple skill')
      expect(section).not.toContain('### Associated Toolsets')
    })
  })

  describe('generateToolsetMetadataSection', () => {
    it('should generate toolset metadata section', () => {
      const toolsetMetadata = {
        name: 'memory',
        description: 'Memory management tools',
        tools: [
          { name: 'read', description: 'Read memory' },
          { name: 'write', description: 'Write memory' },
        ],
      }

      const toolMetadata = [
        { name: 'read', description: 'Read memory' },
        { name: 'write', description: 'Write memory' },
      ]

      const section = generator.generateToolsetMetadataSection(toolsetMetadata, toolMetadata)

      expect(section).toContain('## Toolset: memory')
      expect(section).toContain('Memory management tools')
      expect(section).toContain('### Tools in this Toolset')
      expect(section).toContain('read')
      expect(section).toContain('write')
    })

    it('should handle toolsets without tools', () => {
      const toolsetMetadata = {
        name: 'empty-toolset',
        description: 'Empty toolset',
        tools: [],
      }

      const section = generator.generateToolsetMetadataSection(toolsetMetadata, [])

      expect(section).toContain('## Toolset: empty-toolset')
      expect(section).not.toContain('### Tools in this Toolset')
    })
  })

  describe('generateSkillLoadingInstructions', () => {
    it('should include correct tool references only (loadSkill)', () => {
      const agent: Agent = {
        name: 'test-agent',
        description: 'Test agent',
        initialSkills: [],
        skills: ['skill1'],
        prompt: 'Test prompt',
      }

      const availableSkills: SkillMetadata[] = [
        { name: 'skill1', description: 'First skill', toolsets: ['toolset1'] },
      ]

      const result = generator.generateAgentPrompt(agent, [], availableSkills)

      // Check for correct tools
      expect(result.content).toContain('`loadSkill(')

      // Ensure listAvailableSkills is NOT mentioned (it's redundant with the catalog)
      expect(result.content).not.toContain('listAvailableSkills')

      // Ensure non-existent tools are NOT mentioned
      expect(result.content).not.toContain('loadToolset')
      expect(result.content).not.toContain('loadTool')
    })

    it('should explain that toolsets and tools are auto-loaded with skills', () => {
      const agent: Agent = {
        name: 'test-agent',
        description: 'Test agent',
        initialSkills: [],
        skills: ['skill1'],
        prompt: 'Test prompt',
      }

      const availableSkills: SkillMetadata[] = [
        { name: 'skill1', description: 'First skill', toolsets: ['toolset1'] },
      ]

      const result = generator.generateAgentPrompt(agent, [], availableSkills)

      // Check for correct explanation
      expect(result.content).toContain('automatically loaded')
      expect(result.content).toContain(
        'tools associated to skills are automatically available once the skill is loaded'
      )
    })
  })

  describe('integration', () => {
    it('should generate complete agent prompt with all sections', () => {
      const agent: Agent = {
        name: 'coder',
        description: 'Code generation agent',
        initialSkills: ['typescript'],
        skills: ['react', 'testing'],
        prompt: `You are a senior TypeScript developer.
Your role is to write clean, efficient, and well-tested code.`,
      }

      const initialSkills: Skill[] = [
        {
          name: 'typescript',
          description: 'TypeScript coding skills',
          toolsets: ['type-system'],
          content: `# TypeScript Fundamentals

- Use strict mode
- Prefer immutability
- Use type inference`,
        },
      ]

      const availableSkills: SkillMetadata[] = [
        { name: 'typescript', description: 'TypeScript coding skills', toolsets: ['type-system'] },
        { name: 'react', description: 'React framework expertise', toolsets: ['components'] },
        {
          name: 'testing',
          description: 'Testing best practices',
          toolsets: ['unit', 'integration'],
        },
      ]

      const result = generator.generateAgentPrompt(agent, initialSkills, availableSkills)

      // Check all major sections are present
      expect(result.content).toContain('You are a senior TypeScript developer')
      expect(result.content).toContain('## Skills')
      expect(result.content).toContain('# TypeScript Fundamentals')
      expect(result.content).toContain('## On-Demand Skills')
      expect(result.content).toContain('react')
      expect(result.content).toContain('testing')
      expect(result.content).toContain('## How to Load Skills')
      expect(result.content).toContain('loadSkill')

      // Verify structure
      expect(result.agent.name).toBe('coder')
      expect(result.initialSkills).toHaveLength(1)
      expect(result.availableSkills).toHaveLength(3)
    })
  })
})

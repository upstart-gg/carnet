import { describe, expect, it } from 'bun:test'
import { agentSchema, skillSchema, toolSchema, toolsetSchema } from '@lib/schemas'

describe('agentSchema', () => {
  it('validates a correct agent object', () => {
    const data = {
      name: 'agent-x',
      description: 'desc',
      initialSkills: ['foo'],
      skills: ['bar'],
      prompt: 'You are an agent',
    }
    expect(() => agentSchema.parse(data)).not.toThrow()
  })

  it('fails on missing required fields', () => {
    const data = { name: 'agent-x' }
    expect(() => agentSchema.parse(data)).toThrow()
  })
})

describe('skillSchema', () => {
  it('validates a correct skill object', () => {
    const data = {
      name: 'skill-x',
      description: 'desc',
      toolsets: ['foo'],
      content: 'markdown',
    }
    expect(() => skillSchema.parse(data)).not.toThrow()
  })
})

describe('toolsetSchema', () => {
  it('validates a correct toolset object', () => {
    const data = {
      name: 'toolset-x',
      description: 'desc',
      tools: ['foo'],
      content: 'markdown',
    }
    expect(() => toolsetSchema.parse(data)).not.toThrow()
  })
})

describe('toolSchema', () => {
  it('validates a correct tool object', () => {
    const data = {
      name: 'tool-x',
      description: 'A test tool',
      content: 'markdown',
    }
    expect(() => toolSchema.parse(data)).not.toThrow()
  })
})

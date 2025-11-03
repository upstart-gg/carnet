import { describe, expect, it } from 'bun:test'
import { agentSchema, skillSchema, toolSchema, toolsetSchema } from '@lib/schemas'

describe('agentSchema', () => {
  it('validates a correct agent object', () => {
    const data = {
      name: 'agentX',
      description: 'desc',
      initialSkills: ['foo'],
      skills: ['bar'],
      content: 'You are an agent',
    }
    expect(() => agentSchema.parse(data)).not.toThrow()
  })

  it('fails on missing required fields', () => {
    const data = { name: 'agentX' }
    expect(() => agentSchema.parse(data)).toThrow()
  })
})

describe('skillSchema', () => {
  it('validates a correct skill object', () => {
    const data = {
      name: 'skillX',
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
      name: 'toolsetX',
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
      name: 'toolX',
      description: 'A test tool',
      content: 'markdown',
    }
    expect(() => toolSchema.parse(data)).not.toThrow()
  })
})

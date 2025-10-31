import { describe, expect, it } from 'bun:test'
import path from 'node:path'
import { parseMarkdownFile, parseToolFile } from '../../src/lib/parser'
import { agentSchema } from '../../src/lib/schemas'

describe('parseMarkdownFile', () => {
  it('parses valid agent frontmatter and content', async () => {
    const file = path.join(__dirname, '../fixtures/agent-valid.md')
    const agent = await parseMarkdownFile(file, agentSchema)
    expect(agent.name).toBe('test-agent')
    expect(agent.description).toBe('A test agent')
    expect(agent.initialSkills).toEqual(['foo'])
    expect(agent.skills).toEqual(['bar'])
    expect(agent.content).toContain('# Test Agent')
  })
})

describe('parseToolFile', () => {
  it('parses tool file content and name', async () => {
    const file = path.join(__dirname, '../fixtures/tool-foo.md')
    const tool = await parseToolFile(file)
    expect(tool.name).toBe('tool-foo')
    expect(tool.description).toBe('A test tool for foo operations')
    expect(tool.content).toContain('Tool Foo Body')
  })
})

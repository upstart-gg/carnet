import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { execSync } from 'node:child_process'
import { existsSync, promises as fs } from 'node:fs'
import path from 'node:path'

describe('CLI Integration', () => {
  const cli = `node ${path.resolve(__dirname, '..', 'dist', 'cli', 'index.js')}`
  const outputDir = path.join(__dirname, 'cli-output')
  const tempDir = path.join(__dirname, 'temp-project')

  beforeEach(async () => {
    // Clean up any existing output
    try {
      await fs.rm(outputDir, { recursive: true, force: true })
    } catch {}
    try {
      await fs.rm(tempDir, { recursive: true, force: true })
    } catch {}
  })

  afterEach(async () => {
    // Clean up after each test
    try {
      await fs.rm(outputDir, { recursive: true, force: true })
    } catch {}
    try {
      await fs.rm(tempDir, { recursive: true, force: true })
    } catch {}
  })

  describe('build command', () => {
    it('builds successfully with fixtures', async () => {
      execSync(`${cli} build --content tests/fixtures --output ${outputDir}`, { stdio: 'inherit' })
      const manifestPath = path.join(outputDir, 'manifest.json')
      expect(existsSync(manifestPath)).toBe(true)

      // Check manifest content
      const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'))
      expect(manifest.agents).toHaveLength(1)
      expect(manifest.agents[0].name).toBe('test-agent')
      expect(manifest.stats.totalAgents).toBe(1)
      expect(manifest.stats.totalSkills).toBe(2)
      expect(manifest.stats.totalToolsets).toBe(1)
      expect(manifest.stats.totalTools).toBe(1)
    })

    it('creates agent JSON files', async () => {
      execSync(`${cli} build --content tests/fixtures --output ${outputDir}`, { stdio: 'inherit' })
      const agentPath = path.join(outputDir, 'agents', 'test-agent.json')
      expect(existsSync(agentPath)).toBe(true)

      const agent = JSON.parse(await fs.readFile(agentPath, 'utf-8'))
      expect(agent.agent.name).toBe('test-agent')
      expect(agent.resolvedSkills).toHaveProperty('foo')
      expect(agent.resolvedSkills).toHaveProperty('bar')
      expect(agent.resolvedToolsets).toHaveProperty('foo')
      expect(agent.resolvedTools).toHaveProperty('tool-foo')
    })

    it('fails with invalid content directory', () => {
      expect(() => {
        execSync(`${cli} build --content nonexistent --output ${outputDir}`, { stdio: 'inherit' })
      }).toThrow()
    })
  })

  describe('validate command', () => {
    it('validates successfully with valid fixtures', () => {
      const output = execSync(`${cli} validate --content tests/fixtures`, { stdio: 'inherit' })
      expect(output.toString()).toContain('Validation successful!')
    })

    it('fails with invalid content directory', () => {
      expect(() => {
        execSync(`${cli} validate --content nonexistent`, { stdio: 'inherit' })
      }).toThrow()
    })

    it('validates with strict mode', () => {
      const output = execSync(`${cli} validate --content tests/fixtures --strict`, {
        stdio: 'inherit',
      })
      expect(output.toString()).toContain('Validation successful!')
    })
  })

  describe('init command', () => {
    it('creates project structure', async () => {
      execSync(`${cli} init ${tempDir}`, { stdio: 'inherit' })

      expect(existsSync(path.join(tempDir, 'agents'))).toBe(true)
      expect(existsSync(path.join(tempDir, 'skills'))).toBe(true)
      expect(existsSync(path.join(tempDir, 'toolsets'))).toBe(true)
    })

    it('works with default directory', async () => {
      const cwd = process.cwd()
      try {
        await fs.mkdir(tempDir, { recursive: true })
        process.chdir(tempDir)
        execSync(`${cli} init`)

        expect(existsSync('agents')).toBe(true)
        expect(existsSync('skills')).toBe(true)
        expect(existsSync('toolsets')).toBe(true)
      } finally {
        process.chdir(cwd)
      }
    })
  })

  describe('list command', () => {
    it('lists agents', () => {
      const output = execSync(`${cli} list agents --content tests/fixtures`, { stdio: 'inherit' })
      const outputStr = output.toString()
      expect(outputStr).toContain('Agents:')
      expect(outputStr).toContain('test-agent')
    })

    it('lists skills', () => {
      const output = execSync(`${cli} list skills --content tests/fixtures`, { stdio: 'inherit' })
      const outputStr = output.toString()
      expect(outputStr).toContain('Skills:')
      expect(outputStr).toContain('foo')
      expect(outputStr).toContain('bar')
    })

    it('lists toolsets', () => {
      const output = execSync(`${cli} list toolsets --content tests/fixtures`, { stdio: 'inherit' })
      const outputStr = output.toString()
      expect(outputStr).toContain('Toolsets:')
      expect(outputStr).toContain('foo')
    })

    it('fails with invalid type', () => {
      expect(() => {
        execSync(`${cli} list invalid-type --content tests/fixtures`, { stdio: 'inherit' })
      }).toThrow()
    })
  })

  describe('show command', () => {
    it('shows agent details', () => {
      const output = execSync(`${cli} show agent test-agent --content tests/fixtures`, {
        stdio: 'inherit',
      })
      const outputStr = output.toString()
      expect(outputStr).toContain('"name": "test-agent"')
      expect(outputStr).toContain('"description": "A test agent"')
    })

    it('shows skill details', () => {
      const output = execSync(`${cli} show skill foo --content tests/fixtures`, {
        stdio: 'inherit',
      })
      const outputStr = output.toString()
      expect(outputStr).toContain('"name": "foo"')
      expect(outputStr).toContain('"description": "test skill"')
    })

    it('shows toolset details', () => {
      const output = execSync(`${cli} show toolset foo --content tests/fixtures`, {
        stdio: 'inherit',
      })
      const outputStr = output.toString()
      expect(outputStr).toContain('"name": "foo"')
      expect(outputStr).toContain('"description": "test toolset"')
    })

    it('fails with non-existent entity', () => {
      expect(() => {
        execSync(`${cli} show agent nonexistent --content tests/fixtures`, { stdio: 'inherit' })
      }).toThrow()
    })
  })

  describe('new command', () => {
    it('creates new agent', async () => {
      execSync(`${cli} init ${tempDir}`, { stdio: 'inherit' })
      execSync(`${cli} new agent test-new-agent`, { cwd: tempDir, stdio: 'inherit' })

      const agentPath = path.join(tempDir, 'agents', 'test-new-agent', 'AGENT.md')
      expect(existsSync(agentPath)).toBe(true)

      const content = await fs.readFile(agentPath, 'utf-8')
      expect(content).toContain('name: test-new-agent')
    })

    it('creates new skill', async () => {
      execSync(`${cli} init ${tempDir}`, { stdio: 'inherit' })
      execSync(`${cli} new skill test-skill --category shared`, { cwd: tempDir, stdio: 'inherit' })

      const skillPath = path.join(tempDir, 'skills', 'shared', 'test-skill', 'SKILL.md')
      expect(existsSync(skillPath)).toBe(true)

      const content = await fs.readFile(skillPath, 'utf-8')
      expect(content).toContain('name: test-skill')
    })

    it('creates new toolset', async () => {
      execSync(`${cli} init ${tempDir}`, { stdio: 'inherit' })
      execSync(`${cli} new toolset test-toolset`, { cwd: tempDir, stdio: 'inherit' })

      const toolsetPath = path.join(tempDir, 'toolsets', 'test-toolset', 'TOOLSET.md')
      expect(existsSync(toolsetPath)).toBe(true)

      const content = await fs.readFile(toolsetPath, 'utf-8')
      expect(content).toContain('name: test-toolset')
    })

    it('creates new tool', async () => {
      execSync(`${cli} init ${tempDir}`, { stdio: 'inherit' })
      execSync(`${cli} new toolset test-toolset`, { cwd: tempDir, stdio: 'inherit' })
      execSync(`${cli} new tool test-toolset test-tool`, { cwd: tempDir, stdio: 'inherit' })

      const toolPath = path.join(tempDir, 'toolsets', 'test-toolset', 'test-tool.md')
      expect(existsSync(toolPath)).toBe(true)

      const content = await fs.readFile(toolPath, 'utf-8')
      expect(content).toContain('# test-tool')
    })
  })

  describe('prompt command', () => {
    it('generates prompt for agent', async () => {
      // First build the project
      execSync(`${cli} build --content tests/fixtures --output ${outputDir} `, { stdio: 'inherit' })

      const output = execSync(`${cli} prompt test-agent --output-dir ${outputDir}`, {
        stdio: 'inherit',
      })
      const outputStr = output.toString()
      expect(outputStr).toContain('# Test Agent')
      expect(outputStr).toContain('This is a test agent with {{ TEST_VAR }}.')
    })

    it('generates prompt with variables', async () => {
      execSync(`${cli} build --content tests/fixtures --output ${outputDir}`)

      const output = execSync(
        `${cli} prompt test-agent --output-dir ${outputDir} --var TEST_VAR=test_value`,
        { stdio: 'inherit' }
      )
      const outputStr = output.toString()
      expect(outputStr).toContain('test_value')
    })

    it('writes prompt to file', async () => {
      execSync(`${cli} build --content tests/fixtures --output ${outputDir}`, { stdio: 'inherit' })

      const promptFile = path.join(outputDir, 'prompt.md')
      execSync(`${cli} prompt test-agent --output-dir ${outputDir} --output ${promptFile}`, {
        stdio: 'inherit',
      })

      expect(existsSync(promptFile)).toBe(true)
      const content = await fs.readFile(promptFile, 'utf-8')
      expect(content).toContain('# Test Agent')
    })
  })

  describe('graph command', () => {
    it('generates graph for all agents', () => {
      const output = execSync(`${cli} graph --content tests/fixtures`, { stdio: 'inherit' })
      const outputStr = output.toString()
      expect(outputStr).toContain('graph TD')
      expect(outputStr).toContain('test-agent')
    })

    it('generates graph for specific agent', () => {
      const output = execSync(`${cli} graph test-agent --content tests/fixtures`)
      const outputStr = output.toString()
      expect(outputStr).toContain('graph TD')
      expect(outputStr).toContain('subgraph test-agent')
    })
  })

  describe('generate-types command', () => {
    it('generates TypeScript types', async () => {
      execSync(`${cli} build --content tests/fixtures --output ${outputDir}`, { stdio: 'inherit' })

      execSync(`${cli} generate-types --output ${outputDir}`, { stdio: 'inherit' })

      const typesPath = path.join(outputDir, 'types.ts')
      expect(existsSync(typesPath)).toBe(true)

      const content = await fs.readFile(typesPath, 'utf-8')
      expect(content).toContain('export type AgentName = "test-agent"')
      expect(content).toContain('export interface GeneratePromptOptions')
    })
  })

  describe('error handling', () => {
    it('shows help with --help', () => {
      const output = execSync(`${cli} --help`, { stdio: 'inherit' })
      const outputStr = output.toString()
      expect(outputStr).toContain('Usage: carnet <command>')
      expect(outputStr).toContain('Commands:')
    })

    it('shows help with no command', () => {
      const output = execSync(`${cli}`, { stdio: 'inherit' })
      const outputStr = output.toString()
      expect(outputStr).toContain('Usage: carnet <command>')
    })

    it('fails with unknown command', () => {
      expect(() => {
        execSync(`${cli} unknown-command`, { stdio: 'inherit' })
      }).toThrow()
    })
  })
})

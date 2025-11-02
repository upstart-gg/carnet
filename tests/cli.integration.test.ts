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
      execSync(`${cli} build --dir tests/fixtures --output ${outputDir}`, { stdio: 'inherit' })
      const manifestPath = path.join(outputDir, 'manifest.json')
      expect(existsSync(manifestPath)).toBe(true)

      // Check manifest content
      const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'))
      expect(manifest.agents).toHaveProperty('test-agent')
      expect(manifest.agents['test-agent'].name).toBe('test-agent')
      expect(manifest.skills).toHaveProperty('foo')
      expect(manifest.skills).toHaveProperty('bar')
      expect(manifest.toolsets).toHaveProperty('foo')
    })

    it('fails with invalid content directory', () => {
      expect(() => {
        execSync(`${cli} build --dir nonexistent --output ${outputDir}`, { stdio: 'inherit' })
      }).toThrow()
    })
  })

  describe('lint command', () => {
    it('lints successfully with valid fixtures', () => {
      const output = execSync(`${cli} lint --dir tests/fixtures`)
      const outputStr = output.toString()
      expect(outputStr).toBeTruthy()
    })

    it('fails with invalid content directory', () => {
      expect(() => {
        execSync(`${cli} lint --dir nonexistent`)
      }).toThrow()
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
        execSync(`${cli} init --dir .`, { cwd: tempDir })

        expect(existsSync('agents')).toBe(true)
        expect(existsSync('skills')).toBe(true)
        expect(existsSync('toolsets')).toBe(true)
      } finally {
        process.chdir(cwd)
      }
    })
  })

  describe('list command', () => {
    it('lists all agents in tree format', () => {
      const output = execSync(`${cli} list --dir tests/fixtures`)
      const outputStr = output.toString()
      expect(outputStr).toContain('test-agent')
      expect(outputStr).toContain('bar')
    })

    it('lists specific agent with alias ls', () => {
      const output = execSync(`${cli} ls test-agent --dir tests/fixtures`)
      const outputStr = output.toString()
      expect(outputStr).toContain('test-agent')
      expect(outputStr).toContain('bar')
    })

    it('shows tree structure with skills and toolsets', () => {
      const output = execSync(`${cli} list test-agent --dir tests/fixtures`)
      const outputStr = output.toString()
      // Should contain tree characters and the agent/skill/toolset names
      expect(outputStr).toContain('test-agent')
      expect(outputStr).toContain('bar')
    })
  })

  describe('show command', () => {
    it('shows agent details', () => {
      const output = execSync(`${cli} show agent test-agent --dir tests/fixtures`)
      const outputStr = output.toString()
      expect(outputStr).toContain('"name": "test-agent"')
      expect(outputStr).toContain('"description": "A test agent"')
    })

    it('shows skill details', () => {
      const output = execSync(`${cli} show skill foo --dir tests/fixtures`)
      const outputStr = output.toString()
      expect(outputStr).toContain('"name": "foo"')
      expect(outputStr).toContain('"description": "test skill"')
    })

    it('shows toolset details', () => {
      const output = execSync(`${cli} show toolset foo --dir tests/fixtures`)
      const outputStr = output.toString()
      expect(outputStr).toContain('"name": "foo"')
      expect(outputStr).toContain('"description": "test toolset"')
    })

    it('fails with non-existent entity', () => {
      expect(() => {
        execSync(`${cli} show agent nonexistent --dir tests/fixtures`)
      }).toThrow()
    })
  })

  describe('error handling', () => {
    it('shows help with --help', () => {
      const output = execSync(`${cli} --help`)
      const outputStr = output.toString()
      expect(outputStr).toContain('Usage: carnet')
      expect(outputStr).toContain('Commands:')
    })

    it('fails with unknown command', () => {
      expect(() => {
        execSync(`${cli} unknown-command`)
      }).toThrow()
    })
  })
})

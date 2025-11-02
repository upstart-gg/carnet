import { describe, expect, it } from 'bun:test'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { build } from '@lib/builder'

describe('builder', () => {
  const fixtures = path.join(__dirname, '../fixtures')
  const outputDir = path.join(__dirname, '../output-test')

  it('builds agent artifacts and manifest', async () => {
    await build({ output: outputDir, app: { globalInitialSkills: [], globalSkills: [] }, variables: {}, envPrefix: [], include: [], exclude: [] }, fixtures)
    const manifestPath = path.join(outputDir, 'manifest.json')
    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'))
    expect(manifest.agents).toBeDefined()
    expect(manifest.agents['test-agent']).toBeDefined()
    expect(manifest.agents['test-agent'].name).toBe('test-agent')
    expect(manifest.skills).toBeDefined()
    expect(manifest.toolsets).toBeDefined()
    expect(manifest.tools).toBeDefined()
  })
})

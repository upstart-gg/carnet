import { describe, expect, it } from 'bun:test'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { build } from '@lib/builder'

describe('builder', () => {
  const fixtures = path.join(__dirname, '../fixtures')
  const outputDir = path.join(__dirname, '../output-test')

  it('builds agent artifacts and manifest', async () => {
    await build({ contentDir: fixtures, outputDir })
    const manifestPath = path.join(outputDir, 'manifest.json')
    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'))
    expect(Array.isArray(manifest.agents)).toBe(true)
    expect(manifest.agents.length).toBeGreaterThan(0)
    // Use the manifest's relative path for the agent file
    const agentFile = path.join(outputDir, manifest.agents[0].path)
    const agentData = JSON.parse(await fs.readFile(agentFile, 'utf8'))
    expect(agentData.agent).toBeDefined()
    expect(agentData.resolvedSkills).toBeDefined()
    expect(agentData.resolvedToolsets).toBeDefined()
    expect(agentData.resolvedTools).toBeDefined()
  })
})

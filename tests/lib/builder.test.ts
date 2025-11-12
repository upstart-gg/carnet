import { describe, expect, it } from 'bun:test'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { build } from '@lib/builder'

describe('builder', () => {
  const fixtures = path.join(__dirname, '../fixtures')

  it('builds agent artifacts and manifest', async () => {
    await build(
      {
        app: { globalInitialSkills: [], globalSkills: [] },
        variables: {},
        envPrefix: [],
        include: [],
        exclude: [],
      },
      fixtures
    )
    const manifestPath = path.join(fixtures, 'carnet.manifest.json')
    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'))
    expect(manifest.agents).toBeDefined()
    expect(manifest.agents['test-agent']).toBeDefined()
    expect(manifest.agents['test-agent'].name).toBe('test-agent')
    expect(manifest.skills).toBeDefined()
    expect(manifest.toolsets).toBeDefined()
  })

  it('builds nested skills with file references', async () => {
    await build(
      {
        app: { globalInitialSkills: [], globalSkills: [] },
        variables: {},
        envPrefix: [],
        include: [],
        exclude: [],
      },
      fixtures
    )
    const manifestPath = path.join(fixtures, 'carnet.manifest.json')
    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'))

    // Check that nested skill is built
    expect(manifest.skills['nested-test-skill']).toBeDefined()
    expect(manifest.skills['nested-test-skill'].name).toBe('nested-test-skill')

    // Check that files are embedded with content
    const skill = manifest.skills['nested-test-skill']
    expect(skill.files).toBeDefined()
    expect(skill.files).toHaveLength(2)

    // Check first file
    expect(skill.files[0].path).toBe('examples/example1.md')
    expect(skill.files[0].description).toBe('First example file in nested skill')
    expect(skill.files[0].content).toBeDefined()
    expect(skill.files[0].content).toContain('Example 1')

    // Check second file
    expect(skill.files[1].path).toBe('examples/example2.md')
    expect(skill.files[1].description).toBe('Second example file in nested skill')
    expect(skill.files[1].content).toBeDefined()
    expect(skill.files[1].content).toContain('Example 2')
  })
})

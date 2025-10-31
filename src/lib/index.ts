import { existsSync, promises as fs } from 'node:fs'
import { manifestSchema } from './schemas'
import type { Manifest } from './types'

export * from './types'

export class Carnet {
  protected manifest: Manifest
  protected cwd: string

  static MANIFEST_FILENAME = 'carnet.manifest.json'

  constructor(manifest: Manifest, cwd: string = process.cwd()) {
    this.manifest = this.validateManifest(manifest)
    this.cwd = cwd
  }

  static async fromFile(manifestPath: string, cwd?: string): Promise<Carnet> {
    if (!existsSync(manifestPath)) {
      throw new Error(`Manifest file not found: ${manifestPath}`)
    }
    const content = await fs.readFile(manifestPath, 'utf-8')
    const manifest = JSON.parse(content)
    return new Carnet(manifest, cwd)
  }

  private validateManifest(manifest: unknown): Manifest {
    const parsed = manifestSchema.safeParse(manifest)
    if (!parsed.success) {
      throw new Error(`Invalid manifest: ${parsed.error.message}`)
    }
    return parsed.data
  }

  get agents(): Manifest['agents'] {
    return this.manifest.agents
  }

  getAgent(name: string) {
    return this.manifest.agents[name]
  }

  getSkill(name: string) {
    return this.manifest.skills[name]
  }

  getToolset(name: string) {
    return this.manifest.toolsets[name]
  }

  getTool(name: string) {
    return this.manifest.tools[name]
  }
}

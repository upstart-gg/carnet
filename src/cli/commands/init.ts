import { promises as fs } from 'node:fs'
import path from 'node:path'
import { colors } from '../colors'

export const initCommand = {
  name: 'init',
  description: 'Initialize a new Carnet project',
  async run(dirOrOptions?: string | { dir?: string }) {
    let dir = '.'
    if (typeof dirOrOptions === 'string') {
      dir = dirOrOptions
    } else if (dirOrOptions?.dir) {
      dir = dirOrOptions.dir
    }

    console.log(colors.info(`Initializing Carnet project in ${path.resolve(dir)}...`))
    await fs.mkdir(path.join(dir, 'agents'), { recursive: true })
    await fs.mkdir(path.join(dir, 'skills'), { recursive: true })
    await fs.mkdir(path.join(dir, 'toolsets'), { recursive: true })
    console.log(colors.success('Project initialized successfully!'))
  },
}

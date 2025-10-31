import { promises as fs } from 'node:fs'
import { type CarnetConfig, configSchema } from './schemas'

export async function loadConfigFile(configFilePath = 'carnet.config.json'): Promise<CarnetConfig> {
  try {
    const content = await fs.readFile(configFilePath, 'utf-8')
    const config = JSON.parse(content)
    return configSchema.parse(config)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`Configuration file not found: ${configFilePath}`)
    }
    throw error
  }
}

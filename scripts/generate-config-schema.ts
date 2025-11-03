import { promises as fs } from 'node:fs'
import { z } from 'zod'
import { configSchema } from '../src/lib/schemas'

/**
 * Generate JSON schema for carnet configuration from Zod schema
 * This script generates schema/config.schema.json
 */
async function generateConfigSchema() {
  try {
    // Ensure schema directory exists
    await fs.mkdir('./schema', { recursive: true })

    const jsonSchema = z.toJSONSchema(configSchema)

    if (!jsonSchema || typeof jsonSchema !== 'object' || Object.keys(jsonSchema).length === 0) {
      throw new Error('Failed to generate JSON schema from Zod schema')
    }

    // Add metadata
    const schemaWithMetadata = {
      // $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'Carnet Configuration Schema',
      description: 'Schema for carnet.config.json configuration files',
      version: '1.0.0',
      ...jsonSchema,
    }

    // Write to file
    await fs.writeFile(
      './dist/config.schema.json',
      `${JSON.stringify(schemaWithMetadata, null, 2)}\n`
    )

    console.log('✓ Generated dist/config.schema.json')
  } catch (error) {
    console.error('✗ Failed to generate config schema:', error)
    process.exit(1)
  }
}

generateConfigSchema()

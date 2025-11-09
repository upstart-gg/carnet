import { promises as fs } from 'node:fs'
import matter from 'gray-matter'
import type { z } from 'zod'
import { ParseError } from './errors'
import { toolSchema } from './schemas'

export async function parseMarkdownFile<T extends z.ZodTypeAny>(
  filePath: string,
  schema: T
): Promise<z.infer<T>> {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const { data, content } = matter(fileContent)

    const result = schema.safeParse({ ...data, content })

    if (!result.success) {
      throw new ParseError(`Invalid frontmatter: ${result.error.message}`, filePath, undefined, {
        validationError: result.error.message,
      })
    }

    return result.data
  } catch (error) {
    if (error instanceof ParseError) {
      throw error
    }
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new ParseError('File not found', filePath, undefined, { error: 'ENOENT' })
    }
    throw new ParseError(
      `Failed to read or parse file: ${error instanceof Error ? error.message : String(error)}`,
      filePath
    )
  }
}

export async function parseToolFile(
  filePath: string
): Promise<{ name: string; description: string; content: string }> {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const { data, content } = matter(fileContent)

    const result = toolSchema.safeParse({ ...data, content })

    if (!result.success) {
      throw new ParseError(
        `Invalid frontmatter in tool file: ${result.error.message}`,
        filePath,
        undefined,
        { validationError: result.error.message }
      )
    }

    return result.data
  } catch (error) {
    if (error instanceof ParseError) {
      throw error
    }
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new ParseError('Tool file not found', filePath, undefined, { error: 'ENOENT' })
    }
    throw new ParseError(
      `Failed to read or parse tool file: ${error instanceof Error ? error.message : String(error)}`,
      filePath
    )
  }
}

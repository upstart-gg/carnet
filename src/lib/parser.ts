import { promises as fs } from 'node:fs'
import matter from 'gray-matter'
import type { z } from 'zod'
import { toolSchema } from './schemas'

export async function parseMarkdownFile<T extends z.ZodTypeAny>(
  filePath: string,
  schema: T
): Promise<z.infer<T>> {
  const fileContent = await fs.readFile(filePath, 'utf-8')
  const { data, content } = matter(fileContent)

  const result = schema.safeParse({ ...data, content })

  if (!result.success) {
    throw new Error(`Invalid frontmatter in ${filePath}: ${result.error.message}`)
  }

  return result.data
}

export async function parseToolFile(
  filePath: string
): Promise<{ name: string; description: string; content: string }> {
  const fileContent = await fs.readFile(filePath, 'utf-8')
  const { data, content } = matter(fileContent)

  const result = toolSchema.safeParse({ ...data, content })

  if (!result.success) {
    throw new Error(`Invalid frontmatter in tool file ${filePath}: ${result.error.message}`)
  }

  return result.data
}

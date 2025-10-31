import { promises as fs } from 'node:fs'
import { glob } from 'node:fs/promises'
import path from 'node:path'

async function* findFiles(pattern: string, cwd: string): AsyncGenerator<string> {
  for await (const file of glob(pattern, { cwd })) {
    yield path.resolve(cwd, file)
  }
}

export function discoverAgents(contentDir: string): AsyncIterable<string> {
  return findFiles('agents/**/AGENT.md', contentDir)
}

export function discoverSkills(contentDir: string): AsyncIterable<string> {
  return findFiles('skills/**/SKILL.md', contentDir)
}

export function discoverToolsets(contentDir: string): AsyncIterable<string> {
  return findFiles('toolsets/**/TOOLSET.md', contentDir)
}

export async function* discoverTools(toolsetDir: string): AsyncGenerator<string> {
  for await (const dirent of await fs.opendir(toolsetDir)) {
    if (dirent.isFile() && dirent.name.endsWith('.md') && dirent.name !== 'TOOLSET.md') {
      yield path.join(toolsetDir, dirent.name)
    }
  }
}

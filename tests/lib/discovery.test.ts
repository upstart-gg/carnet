import { describe, expect, it } from 'bun:test'
import path from 'node:path'
import { discoverAgents } from '@lib/discovery'

async function toArray<T>(asyncIterator: AsyncIterable<T>): Promise<T[]> {
  const arr = []
  for await (const i of asyncIterator) arr.push(i)
  return arr
}

describe('discovery', () => {
  const fixtures = path.join(__dirname, '../fixtures')

  it('finds agent files', async () => {
    const agents = await toArray(discoverAgents(fixtures))
    expect(Array.isArray(agents)).toBe(true)
    expect(agents.some((f) => f.endsWith('AGENT.md'))).toBe(true)
  })
})

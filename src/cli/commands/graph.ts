import type { z } from 'zod'
import { discoverAgents, discoverSkills, discoverToolsets } from '../../lib/discovery'
import { parseMarkdownFile } from '../../lib/parser'
import { agentSchema, skillSchema, toolsetSchema } from '../../lib/schemas'
import type { Agent, Skill, Toolset } from '../../lib/types'

async function collect<T>(iterator: AsyncIterable<string>, schema: z.ZodType<T>): Promise<T[]> {
  const results: T[] = []
  for await (const file of iterator) {
    results.push(await parseMarkdownFile(file, schema))
  }
  return results
}

export const graphCommand = {
  name: 'graph',
  description: 'Visualize dependency graph',
  async run(agentNameOrOptions?: string | { content?: string }, options?: { content?: string }) {
    let agentName: string | undefined
    let contentDir: string

    if (typeof agentNameOrOptions === 'string') {
      agentName = agentNameOrOptions
      contentDir = options?.content || './content'
    } else {
      agentName = undefined
      contentDir = agentNameOrOptions?.content || './content'
    }
    const agents = await collect<Agent>(discoverAgents(contentDir), agentSchema)
    const skills = await collect<Skill>(discoverSkills(contentDir), skillSchema)
    const toolsets = await collect<Toolset>(discoverToolsets(contentDir), toolsetSchema)

    console.log('graph TD')

    if (agentName) {
      const agent = agents.find((a) => a.name === agentName)
      if (agent) {
        generateGraph(agent, skills, toolsets)
      }
    } else {
      for (const agent of agents) {
        generateGraph(agent, skills, toolsets)
      }
    }
  },
}

function generateGraph(agent: Agent, skills: Skill[], _toolsets: Toolset[]) {
  console.log(`  subgraph ${agent.name}`)
  console.log(`    A_${agent.name}[Agent: ${agent.name}]`)
  agent.skills.forEach((skillName) => {
    console.log(`    A_${agent.name} --> S_${skillName}`)
    const skill = skills.find((s) => s.name === skillName)
    if (skill) {
      skill.toolsets.forEach((toolsetName) => {
        console.log(`    S_${skillName} --> T_${toolsetName}`)
      })
    }
  })
  console.log('  end')
}

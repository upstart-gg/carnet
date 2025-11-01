import type { Command } from 'commander'
import type { z } from 'zod'
import { loadConfigFile } from '../../lib/config'
import { discoverAgents, discoverSkills, discoverToolsets } from '../../lib/discovery'
import { parseMarkdownFile } from '../../lib/parser'
import { agentSchema, skillSchema, toolsetSchema } from '../../lib/schemas'
import type { Agent, Skill, Toolset } from '../../lib/types'

export function registerListCommand(program: Command) {
  program
    .command('list [agent]')
    .alias('ls')
    .description('List agents with their skills and toolsets in tree format')
    .option('--depth <level>', 'limit tree depth (1 for agents only, 2 for agents + skills, 3+ for full tree)', '3')
    .action(async (agent, options) => {
      const globalOptions = program.opts()
      await runListCommand(agent, {
        ...globalOptions,
        ...options,
      })
    })
}

async function runListCommand(
  agentName: string | undefined,
  options: { dir?: string; depth?: string; config?: string }
) {
  const config = await loadConfigFile(options.config)
  const contentDir = options.dir || config.baseDir
  const maxDepth = Math.max(1, parseInt(options.depth || '3', 10))
  const agents = await collect<Agent>(discoverAgents(contentDir), agentSchema)
  const skills = await collect<Skill>(discoverSkills(contentDir), skillSchema)
  const toolsets = await collect<Toolset>(discoverToolsets(contentDir), toolsetSchema)

  if (agentName) {
    const agent = agents.find((a) => a.name === agentName)
    if (agent) {
      generateTree(agent, skills, toolsets, maxDepth)
    }
  } else {
    for (const agent of agents) {
      generateTree(agent, skills, toolsets, maxDepth)
    }
  }
}

async function collect<T>(iterator: AsyncIterable<string>, schema: z.ZodType<T>): Promise<T[]> {
  const results: T[] = []
  for await (const file of iterator) {
    results.push(await parseMarkdownFile(file, schema))
  }
  return results
}

function generateTree(agent: Agent, skills: Skill[], _toolsets: Toolset[], maxDepth: number = 3) {
  console.log(`${agent.name}`)

  // Depth 1: only show agent name
  if (maxDepth < 2) {
    return
  }

  const skillsList = agent.skills
  skillsList.forEach((skillName, index) => {
    const isLast = index === skillsList.length - 1
    const prefix = isLast ? '└── ' : '├── '
    console.log(`${prefix}${skillName}`)

    // Depth 2: only show skills
    if (maxDepth < 3) {
      return
    }

    const skill = skills.find((s) => s.name === skillName)
    if (skill && skill.toolsets.length > 0) {
      const toolsetsList = skill.toolsets
      toolsetsList.forEach((toolsetName, toolIndex) => {
        const isToolsetLast = toolIndex === toolsetsList.length - 1
        const childPrefix = isLast ? '    ' : '│   '
        const toolPrefix = isToolsetLast ? '└── ' : '├── '
        console.log(`${childPrefix}${toolPrefix}${toolsetName}`)
      })
    }
  })
}

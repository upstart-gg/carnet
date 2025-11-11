import path from 'node:path'
import type { Command } from 'commander'
import type { z } from 'zod'
import { loadConfigFile } from '../../lib/config'
import { discoverAgents, discoverSkills, discoverToolsets } from '../../lib/discovery'
import { parseMarkdownFile } from '../../lib/parser'
import { agentSchema, skillSchema, toolsetSchema } from '../../lib/schemas'
import type { Agent, Skill, Toolset } from '../../lib/types'

export function registerListCommand(program: Command): void {
  program
    .command('list [agent]')
    .alias('ls')
    .description('List agents with their skills and toolsets in tree format')
    .option(
      '--depth <level>',
      'limit tree depth (1 for agents only, 2 for agents + skills, 3+ for full tree)',
      '3'
    )
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
  options: { dir?: string; depth?: string }
) {
  const cwd = process.env.INIT_CWD ?? process.env.PWD ?? process.cwd()
  const carnetDir = path.resolve(cwd, options.dir || './carnet')
  await loadConfigFile(carnetDir)
  const maxDepth = Math.max(1, parseInt(options.depth || '3', 10))
  const agents = await collect<Agent>(discoverAgents(carnetDir), agentSchema)
  const skills = await collect<Skill>(discoverSkills(carnetDir), skillSchema)
  const toolsets = await collect<Toolset>(discoverToolsets(carnetDir), toolsetSchema)

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

function generateTree(agent: Agent, skills: Skill[], toolsets: Toolset[], maxDepth: number = 3) {
  // Display agent name with description
  console.log(`${agent.name}`)
  if (agent.description) {
    console.log(`  ${agent.description}`)
  }

  // Depth 1: only show agent name
  if (maxDepth < 2) {
    return
  }

  // Display Initial Skills section
  if (agent.initialSkills && agent.initialSkills.length > 0) {
    console.log('├── Initial Skills')
    agent.initialSkills.forEach((skillName, index) => {
      const isLastInitialSkill =
        index === agent.initialSkills.length - 1 && agent.skills.length === 0
      displaySkill(skillName, skills, toolsets, isLastInitialSkill, '│   ', maxDepth)
    })
  }

  // Display Skills section
  if (agent.skills && agent.skills.length > 0) {
    console.log('└── Skills')
    agent.skills.forEach((skillName, index) => {
      const isLastSkill = index === agent.skills.length - 1
      displaySkill(skillName, skills, toolsets, isLastSkill, '    ', maxDepth)
    })
  }
}

function displaySkill(
  skillName: string,
  skills: Skill[],
  toolsets: Toolset[],
  isLast: boolean,
  parentPrefix: string,
  maxDepth: number
) {
  const prefix = isLast ? '└── ' : '├── '
  const skill = skills.find((s) => s.name === skillName)

  if (skill) {
    console.log(`${parentPrefix}${prefix}${skill.name} (skill)`)
    if (skill.description) {
      console.log(`${parentPrefix}${isLast ? '    ' : '│   '}    ${skill.description}`)
    }

    // Depth 2: only show skills
    if (maxDepth < 3) {
      return
    }

    // Display toolsets within this skill
    if (skill.toolsets && skill.toolsets.length > 0) {
      skill.toolsets.forEach((toolsetName, toolsetIndex) => {
        const isLastToolset = toolsetIndex === skill.toolsets.length - 1
        const childPrefix = isLast ? '    ' : '│   '
        displayToolset(
          toolsetName,
          toolsets,
          isLastToolset,
          `${parentPrefix}${childPrefix}`,
          maxDepth
        )
      })
    }
  } else {
    // Skill not found, just display the name
    console.log(`${parentPrefix}${prefix}${skillName} (skill) [not found]`)
  }
}

function displayToolset(
  toolsetName: string,
  toolsets: Toolset[],
  isLast: boolean,
  parentPrefix: string,
  maxDepth: number
) {
  const prefix = isLast ? '└── ' : '├── '
  const toolset = toolsets.find((t) => t.name === toolsetName)

  if (toolset) {
    console.log(`${parentPrefix}${prefix}${toolset.name} (toolset)`)
    if (toolset.description) {
      console.log(`${parentPrefix}${isLast ? '    ' : '│   '}    ${toolset.description}`)
    }

    // Depth 3: only show toolsets
    if (maxDepth < 4) {
      return
    }

    // Display tools within this toolset
    if (toolset.tools && toolset.tools.length > 0) {
      toolset.tools.forEach((tool, toolIndex) => {
        const isLastTool = toolIndex === toolset.tools.length - 1
        const childPrefix = isLast ? '    ' : '│   '
        displayTool(tool.name, tool.description, isLastTool, `${parentPrefix}${childPrefix}`)
      })
    }
  } else {
    // Toolset not found, just display the name
    console.log(`${parentPrefix}${prefix}${toolsetName} (toolset) [not found]`)
  }
}

function displayTool(
  toolName: string,
  toolDescription: string,
  isLast: boolean,
  parentPrefix: string
) {
  const prefix = isLast ? '└── ' : '├── '
  console.log(`${parentPrefix}${prefix}${toolName} - ${toolDescription} (tool)`)
}

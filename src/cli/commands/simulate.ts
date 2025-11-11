import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { select } from '@inquirer/prompts'
import type { Carnet } from '@lib/index'
import { manifestSchema } from '@lib/schemas'
import type { Manifest } from '@lib/types'
import type { Command } from 'commander'
import { colors } from '../colors'

export function registerSimulateCommand(program: Command): void {
  program
    .command('simulate [agent]')
    .description('Simulate agent behavior with interactive skill loading')
    .option('-d, --dir <dir>', 'Carnet project directory containing content (default: ./carnet)')
    .option('-o, --output <dir>', 'output directory containing manifest (default: .carnet)')
    .action(async (agent, options) => {
      const globalOptions = program.opts()
      await runSimulateCommand(agent, {
        ...globalOptions,
        ...options,
      })
    })
}

async function runSimulateCommand(
  agentName: string | undefined,
  options: { dir?: string; output?: string }
) {
  const cwd = process.env.INIT_CWD ?? process.env.PWD ?? process.cwd()
  const carnetDir = path.resolve(cwd, options.dir || './carnet')

  try {
    // Load manifest
    const manifestPath = path.join(carnetDir, 'carnet.manifest.json')
    console.log(colors.info(`Loading manifest from ${manifestPath}...\n`))

    const manifestContent = await readFile(manifestPath, 'utf-8')
    const manifestData = JSON.parse(manifestContent)
    const parsed = manifestSchema.safeParse(manifestData)

    if (!parsed.success) {
      console.error(colors.error('Invalid manifest format:'))
      console.error(colors.error(parsed.error.message))
      process.exit(1)
    }

    const manifest: Manifest = parsed.data

    // Create Carnet instance
    const Carnet = (await import('@lib/index')).Carnet
    const carnet = new Carnet(manifest)

    // Select agent
    let selectedAgent = agentName
    if (!selectedAgent) {
      const agentNames = Object.keys(manifest.agents)
      if (agentNames.length === 0) {
        console.error(colors.error('No agents found in manifest'))
        process.exit(1)
      }

      selectedAgent = await select({
        message: 'Select an agent to simulate:',
        choices: agentNames.map((name) => ({
          name,
          value: name,
          description: manifest.agents[name]?.description,
        })),
      })
    }

    const agent = manifest.agents[selectedAgent]
    if (!agent) {
      console.error(colors.error(`Agent "${selectedAgent}" not found in manifest`))
      process.exit(1)
    }

    console.log(colors.success(`\n✓ Selected agent: ${colors.bold(selectedAgent)}`))
    if (agent.description) {
      console.log(colors.dimmed(`  ${agent.description}`))
    }

    // Start simulation loop
    await runSimulation(carnet, selectedAgent, manifest)
  } catch (error) {
    console.error(colors.error(`Failed to load manifest: ${(error as Error).message}`))
    console.error(
      colors.dimmed(
        '\nTip: Run "carnet build" first to generate the manifest, or check the output directory path.'
      )
    )
    process.exit(1)
  }
}

async function runSimulation(carnet: Carnet, agentName: string, manifest: Manifest) {
  let running = true

  while (running) {
    console.log(`\n${colors.bold('─'.repeat(80))}`)

    const action = await select({
      message: 'What would you like to do?',
      choices: [
        { name: 'Show system prompt', value: 'prompt' },
        { name: 'Show session state', value: 'state' },
        { name: 'Load a skill', value: 'loadSkill' },
        { name: 'Show available skills', value: 'skills' },
        { name: 'Show exposed tools', value: 'tools' },
        { name: 'Reset session', value: 'reset' },
        { name: 'Exit', value: 'exit' },
      ],
    })

    console.log('')

    switch (action) {
      case 'prompt':
        await showSystemPrompt(carnet, agentName)
        break
      case 'state':
        await showSessionState(carnet, agentName)
        break
      case 'loadSkill':
        await loadSkill(carnet, agentName, manifest)
        break
      case 'skills':
        await showAvailableSkills(carnet, agentName, manifest)
        break
      case 'tools':
        await showExposedTools(carnet, agentName)
        break
      case 'reset':
        carnet.resetSession(agentName)
        console.log(colors.success('✓ Session reset to initial state'))
        break
      case 'exit':
        running = false
        console.log(colors.info('Goodbye!'))
        break
    }
  }
}

async function showSystemPrompt(carnet: Carnet, agentName: string) {
  console.log(colors.bold('System Prompt:'))
  console.log(colors.bold('─'.repeat(80)))

  const prompt = carnet.getSystemPrompt(agentName)
  console.log(prompt)

  console.log(colors.bold('─'.repeat(80)))
  console.log(colors.dimmed(`\nPrompt length: ${prompt.length} characters`))
  console.log(colors.dimmed(`Approximate tokens: ${Math.ceil(prompt.length / 4)}`))
}

async function showSessionState(carnet: Carnet, agentName: string) {
  const session = carnet.getSessionState(agentName)

  if (!session) {
    console.log(colors.warning('No active session found'))
    return
  }

  console.log(colors.bold('Session State:'))
  console.log(colors.bold('─'.repeat(80)))

  console.log(`${colors.info('Agent:')} ${session.agentName}`)
  console.log(
    `${colors.info('Discovered Skills:')} ${
      session.discoveredSkills.size > 0 ? Array.from(session.discoveredSkills).join(', ') : '(none)'
    }`
  )
  console.log(
    `${colors.info('Loaded Toolsets:')} ${
      session.loadedToolsets.size > 0 ? Array.from(session.loadedToolsets).join(', ') : '(none)'
    }`
  )
  console.log(
    `${colors.info('Exposed Tools:')} ${
      session.exposedDomainTools.size > 0
        ? Array.from(session.exposedDomainTools).join(', ')
        : '(none)'
    }`
  )

  // Show diagnostics if available
  const diagnostics = carnet.getToolFilteringDiagnostics(agentName)
  if (diagnostics) {
    console.log(`\n${colors.bold('Tool Filtering Diagnostics:')}`)
    console.log(
      `${colors.info('Requested Domain Tools:')} ${
        diagnostics.exposedTools.length > 0 ? diagnostics.exposedTools.join(', ') : '(none)'
      }`
    )
    console.log(
      `${colors.info('Filtered Tools:')} ${
        diagnostics.filteredOutTools.length > 0 ? diagnostics.filteredOutTools.join(', ') : '(none)'
      }`
    )
  }

  console.log(colors.bold('─'.repeat(80)))
}

async function loadSkill(carnet: Carnet, agentName: string, manifest: Manifest) {
  // biome-ignore lint/style/noNonNullAssertion: assumed to exist since agentName is selected earlier
  const agent = manifest.agents[agentName]!
  const session = carnet.getSessionState(agentName)

  // Get available skills (not yet loaded)
  const availableSkills = agent.skills.filter((skill) => !session?.discoveredSkills.has(skill))

  if (availableSkills.length === 0) {
    console.log(colors.warning('All skills have already been loaded!'))
    return
  }

  const skillName = await select({
    message: 'Select a skill to load:',
    choices: availableSkills.map((name) => {
      const skill = manifest.skills[name]
      return {
        name,
        value: name,
        description: skill?.description || '',
      }
    }),
  })

  console.log(colors.info(`\nLoading skill: ${colors.bold(skillName)}...`))

  // Get the skill content (simulating what the loadSkill tool would return)
  const skill = manifest.skills[skillName]
  if (!skill) {
    console.log(colors.error(`Skill "${skillName}" not found in manifest`))
    return
  }

  // Show skill content
  console.log(colors.bold('\nSkill Content:'))
  console.log(colors.bold('─'.repeat(80)))
  console.log(skill.content)
  console.log(colors.bold('─'.repeat(80)))

  // Show associated toolsets
  if (skill.toolsets && skill.toolsets.length > 0) {
    console.log(colors.info(`\nAssociated toolsets: ${skill.toolsets.join(', ')}`))

    // Show tools that will be exposed
    const newTools: string[] = []
    for (const toolsetName of skill.toolsets) {
      const toolset = manifest.toolsets[toolsetName]
      if (toolset?.tools) {
        newTools.push(...toolset.tools.map((tool) => tool.name))
      }
    }
    if (newTools.length > 0) {
      console.log(colors.success(`Tools being exposed: ${newTools.join(', ')}`))
    }
  }

  // Update session (simulate the skill loading)
  carnet._updateSessionOnSkillLoad(agentName, skillName)

  console.log(colors.success(`\n✓ Skill "${skillName}" loaded successfully!`))
  console.log(colors.dimmed('The system prompt and available tools have been updated.'))
}

async function showAvailableSkills(carnet: Carnet, agentName: string, manifest: Manifest) {
  // biome-ignore lint/style/noNonNullAssertion: assumed to exist since agentName is selected earlier
  const agent = manifest.agents[agentName]!
  const session = carnet.getSessionState(agentName)

  console.log(colors.bold('Available Skills:'))
  console.log(colors.bold('─'.repeat(80)))

  // Show initial skills
  if (agent.initialSkills && agent.initialSkills.length > 0) {
    console.log(colors.info('\nInitial Skills (loaded at startup):'))
    for (const skillName of agent.initialSkills) {
      const skill = manifest.skills[skillName]
      console.log(`  ${colors.success('✓')} ${skillName}`)
      if (skill?.description) {
        console.log(`     ${colors.dimmed(skill.description)}`)
      }
    }
  }

  // Show on-demand skills
  if (agent.skills && agent.skills.length > 0) {
    console.log(colors.info('\nOn-Demand Skills:'))
    for (const skillName of agent.skills) {
      const skill = manifest.skills[skillName]
      const isLoaded = session?.discoveredSkills.has(skillName)
      const status = isLoaded ? colors.success('✓ loaded') : colors.dimmed('○ not loaded')
      console.log(`  ${status} ${skillName}`)
      if (skill?.description) {
        console.log(`     ${colors.dimmed(skill.description)}`)
      }
    }
  }

  console.log(colors.bold('─'.repeat(80)))
}

async function showExposedTools(carnet: Carnet, agentName: string) {
  const session = carnet.getSessionState(agentName)

  console.log(colors.bold('Exposed Domain Tools:'))
  console.log(colors.bold('─'.repeat(80)))

  if (!session || session.exposedDomainTools.size === 0) {
    console.log(colors.dimmed('No domain tools are currently exposed.'))
    console.log(colors.dimmed('Load skills to expose their associated tools.'))
  } else {
    const tools = Array.from(session.exposedDomainTools)
    console.log(colors.info(`\n${tools.length} tool(s) currently exposed:\n`))
    for (const tool of tools) {
      console.log(`  ${colors.success('•')} ${tool}`)
    }
  }

  console.log(colors.bold('─'.repeat(80)))

  // Always show meta-tools (available regardless of skills)
  console.log(colors.bold('\nMeta-Tools (always available):'))
  console.log(`  ${colors.info('•')} loadSkill - Load a skill by name`)
  console.log(`  ${colors.info('•')} loadSkillFile - Load a specific file from a skill`)
  console.log(colors.bold('─'.repeat(80)))
}

import { loadAgent, loadManifest } from '@upstart.gg/carnet'

async function main() {
  console.log('🚀 Loading Carnet agents...\n')

  try {
    // Load the manifest (primary entry point)
    const manifest = await loadManifest('./dist/manifest.json')
    console.log(`📋 Found ${manifest.agents.length} agents:`)
    manifest.agents.forEach((agent) => {
      console.log(`  - ${agent.name}: ${agent.description}`)
    })
    console.log()

    // Load a specific agent
    const agent = await loadAgent(manifest, 'hello-world')
    console.log(`🤖 Loaded agent: ${agent.name}`)
    console.log(`📝 Description: ${agent.description}`)
    console.log(`🛠️  Initial skills: ${agent.initialSkills.join(', ')}`)
    console.log()

    // Generate a prompt with variables
    const prompt = await agent.generatePrompt({
      variables: {
        USER_NAME: 'Alice',
        CURRENT_TIME: new Date().toLocaleTimeString(),
      },
    })

    console.log('📄 Generated prompt:')
    console.log('='.repeat(50))
    console.log(prompt)
    console.log('='.repeat(50))
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

main()

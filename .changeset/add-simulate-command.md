---
'@upstart.gg/carnet': minor
---

Add interactive `simulate` CLI command for testing agent behavior

- New `carnet simulate` command allows users to interactively test how their agents work
- Users can select agents, load skills dynamically, and see how the system prompt evolves
- Shows session state, exposed tools, and skill catalog in real-time
- Helps users understand Carnet's progressive skill loading without actual integration
- Adds `@inquirer/prompts` dependency for interactive CLI prompts

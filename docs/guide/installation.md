# Installation

Carnet supports multiple installation methods depending on how you plan to use it.

## Global Installation (Recommended for CLI)

Install Carnet globally to use the CLI from any directory:

```bash
# npm
npm install -g @upstart-gg/carnet

# bun
bun add -g @upstart-gg/carnet

# pnpm
pnpm add -g @upstart-gg/carnet
```

After installation, verify it works:

```bash
carnet --version
```

## Local Installation (For Projects)

Install Carnet in your project for programmatic use:

```bash
# npm
npm install @upstart-gg/carnet

# bun
bun add @upstart-gg/carnet

# pnpm
pnpm add @upstart-gg/carnet
```

## Use Without Installing

Run Carnet commands without any installation using your package manager:

```bash
# npm
npx @upstart-gg/carnet init my-agents

# bun
bunx @upstart-gg/carnet init my-agents

# pnpm
pnpm dlx @upstart-gg/carnet init my-agents
```

This is useful for one-off commands or trying Carnet before committing to installation.

## System Requirements

- **Node.js**: 22.0.0 or later
- **Bun**: 1.0.0 or later (optional, for better performance)
- **Deno**: 2.0.0 or later (optional)

## Verification

Verify your installation:

```bash
carnet init verify-installation
cd verify-installation
carnet build
carnet validate
```

If all commands run successfully, you're ready to go!

## Next Steps

After installation, head to the [Quick Start](/guide/quick-start) guide to create your first agent.

## Troubleshooting

### Command not found

If you see `command not found: carnet`, make sure:

- **Global install**: The installation completed without errors
- **Local install**: Use `npx carnet` or `bunx carnet`
- **NPM users**: Your npm global bin directory is in your PATH

### Version mismatch

If you need a specific version:

```bash
npm install -g @upstart-gg/carnet@0.1.0
```

### Permission denied

On Unix systems, you might need to:

```bash
sudo npm install -g @upstart-gg/carnet
```

Still having issues? [Open an issue on GitHub](https://github.com/upstart-gg/carnet/issues).

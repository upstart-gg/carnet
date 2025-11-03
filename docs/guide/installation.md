# Installation

Carnet supports multiple installation methods depending on how you plan to use it.

## Global Installation (Recommended for CLI)

Install Carnet globally to use the CLI from any directory:

:::tabs key:pm
== npm
```bash
npm install -g @upstart-gg/carnet
```

== bun
```bash
bun add -g @upstart-gg/carnet
```

== pnpm
```bash
pnpm add -g @upstart-gg/carnet
```

== yarn
```bash
yarn global add @upstart-gg/carnet
```
:::


## Local Installation (For programmatic use)

Install Carnet in your project for programmatic use with Vercel AI SDK.
"Packages "ai" and "zod" are peer dependencies required by Carnet.

:::tabs key:pm
== npm
```bash
npm install @upstart-gg/carnet ai zod
```

== bun
```bash
bun add @upstart-gg/carnet ai zod
```

== pnpm
```bash
pnpm add @upstart-gg/carnet ai zod
```

== yarn
```bash
yarn add @upstart-gg/carnet ai zod
```
:::

## System Requirements

Carnet can be used with various JavaScript runtimes. Ensure you have one of the following installed:
- **Node.js**: 22.0.0 or later
- **Bun**: 1.0.0 or later (optional, for better performance)
- **Deno**: 2.0.0 or later (optional)

## Next Steps

After installation, head to the [Quick Start](/guide/quick-start) guide to create your first agent.


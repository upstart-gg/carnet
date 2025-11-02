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

After installation, verify it works:

```bash
carnet --version
```

## Local Installation (For Projects)

Install Carnet in your project for programmatic use with Vercel AI SDK:

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

Then install your preferred language model provider:

```bash
npm install @ai-sdk/openai    # OpenAI provider
# or
npm install @ai-sdk/anthropic # Anthropic provider
# or another Vercel AI SDK compatible provider
```

## Use Without Installing

Run Carnet commands without any installation using your package manager:

:::tabs key:pm
== npm
```bash
npx @upstart-gg/carnet init my-agents
```

== bun
```bash
bunx @upstart-gg/carnet init my-agents
```

== pnpm
```bash
pnpm dlx @upstart-gg/carnet init my-agents
```

== yarn
```bash
yarn dlx @upstart-gg/carnet init my-agents
```
:::

This is useful for one-off commands or trying Carnet before committing to installation.

## System Requirements

Carnet can be used with various JavaScript runtimes. Ensure you have one of the following installed:
- **Node.js**: 22.0.0 or later
- **Bun**: 1.0.0 or later (optional, for better performance)
- **Deno**: 2.0.0 or later (optional)

## Next Steps

After installation, head to the [Quick Start](/guide/quick-start) guide to create your first agent.


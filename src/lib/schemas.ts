import { z } from 'zod'

export const appConfigSchema = z
  .object({
    globalInitialSkills: z
      .array(z.string())
      .default([])
      .describe('Initial skills available to all agents globally, loaded at startup'),
    globalSkills: z
      .array(z.string())
      .default([])
      .describe('Skills available to all agents globally during their lifecycle, loaded on demand'),
  })
  .default({
    globalInitialSkills: [],
    globalSkills: [],
  })
  .describe('Application config')

export const configSchema = z.object({
  app: appConfigSchema,
  baseDir: z.string().default('./carnet').describe('Path to the content directory'),
  output: z.string().default('./dist').describe('Path to the output directory'),
  variables: z
    .record(z.string(), z.string())
    .default({})
    .describe('Custom variables to be injected into prompts'),
  envPrefix: z
    .string()
    .array()
    .default(['CARNET_', 'PUBLIC_'])
    .describe('Environment variable prefixes allowed to be injected into prompts'),
  include: z
    .array(z.string())
    .default([])
    .describe('Globs of content files or directories to include in processing'),
  exclude: z
    .array(z.string())
    .default([])
    .describe('Globs of content files or directories to exclude from processing'),
})

export type CarnetConfig = z.infer<typeof configSchema>

export const agentCapabilitySchema = z
  .enum(['createCustomAgent'])
  .describe('Capabilities that can be granted to an agent')

export const agentSchema = z
  .object({
    name: z.string().min(1).describe('The name of the agent'),
    description: z.string().min(1).describe('A brief description of the agent'),
    initialSkills: z
      .array(z.string())
      .default([])
      .describe('Initial skills of the agent, loaded at creation'),
    skills: z
      .array(z.string())
      .default([])
      .describe('Skills that can be loaded on demand by the agent during its lifecycle'),
    prompt: z.string().describe('Prompt of the agent (markdown content)'),
  })
  .describe('Agent Schema')

export const skillSchema = z
  .object({
    name: z.string().min(1).describe('The name of the skill'),
    description: z.string().min(1).describe('A brief description of the skill'),
    toolsets: z.array(z.string()).default([]).describe('Toolsets associated with the skill'),
    content: z.string().describe('Full markdown content of the skill'),
  })
  .describe('Skill Schema')

export const toolsetSchema = z
  .object({
    name: z.string().min(1).describe('The name of the toolset'),
    description: z.string().min(1).describe('A brief description of the toolset'),
    tools: z.array(z.string()).describe('Tools included in the toolset'),
    content: z.string().describe('Full markdown content of the toolset'),
  })
  .describe('Toolset Schema')

export const toolSchema = z
  .object({
    name: z.string().min(1).describe('The name of the tool'),
    description: z.string().min(1).describe('A brief description of the tool'),
    content: z.string().describe('Full markdown content of the tool'),
  })
  .describe('Tool Schema')

export const manifestSchema = z
  .object({
    version: z.number().default(1).describe('Version of the manifest schema'),
    app: appConfigSchema,
    agents: z.record(agentSchema.shape.name, agentSchema).describe('Full list of agents'),
    skills: z.record(skillSchema.shape.name, skillSchema).describe('Full list of skills'),
    toolsets: z.record(toolsetSchema.shape.name, toolsetSchema).describe('Full list of toolsets'),
    tools: z.record(toolSchema.shape.name, toolSchema).describe('Full list of tools'),
  })
  .describe('Schema of the generated Carnet manifest')

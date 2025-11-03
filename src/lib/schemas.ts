import * as z from 'zod'

export const appConfigSchema: z.ZodDefault<
  z.ZodObject<
    {
      globalInitialSkills: z.ZodDefault<z.ZodArray<z.ZodString>>
      globalSkills: z.ZodDefault<z.ZodArray<z.ZodString>>
    },
    z.core.$strip
  >
> = z
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

export const configSchema: z.ZodObject<{
  app: z.ZodOptional<
    z.ZodDefault<
      z.ZodObject<
        {
          globalInitialSkills: z.ZodDefault<z.ZodArray<z.ZodString>>
          globalSkills: z.ZodDefault<z.ZodArray<z.ZodString>>
        },
        z.core.$strip
      >
    >
  >
  output: z.ZodOptional<z.ZodDefault<z.ZodString>>
  variables: z.ZodOptional<z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodString>>>
  envPrefix: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString>>>
  include: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString>>>
  exclude: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString>>>
}> = z.object({
  schema: z.string().optional().describe('Schema url/path'),
  app: appConfigSchema.optional(),
  output: z.string().default('./dist').describe('Path to the output directory').optional(),
  variables: z
    .record(z.string(), z.string())
    .default({})
    .optional()
    .describe('Custom variables to be injected into prompts'),
  envPrefix: z
    .string()
    .array()
    .default(['CARNET_', 'PUBLIC_'])
    .optional()
    .describe('Environment variable prefixes allowed to be injected into prompts'),
  include: z
    .array(z.string())
    .default([])
    .optional()
    .describe('Globs of content files or directories to include in processing'),
  exclude: z
    .array(z.string())
    .default([])
    .optional()
    .describe('Globs of content files or directories to exclude from processing'),
})

export type CarnetConfig = z.infer<typeof configSchema>

export const agentCapabilitySchema: z.ZodEnum<{
  createCustomAgent: 'createCustomAgent'
}> = z.enum(['createCustomAgent']).describe('Capabilities that can be granted to an agent')

export const agentSchemaBase: z.ZodObject<{
  name: z.ZodString
  description: z.ZodString
  initialSkills: z.ZodDefault<z.ZodArray<z.ZodString>>
  skills: z.ZodDefault<z.ZodArray<z.ZodString>>
  content: z.ZodString
}> = z
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
    content: z.string().describe('Full markdown content of the agent (becomes the prompt)'),
  })
  .passthrough()
  .describe('Agent Schema')

export const agentSchema: z.ZodType<{
  name: string
  description: string
  initialSkills: string[]
  skills: string[]
  prompt: string
}> = agentSchemaBase.transform((data) => ({
  name: data.name,
  description: data.description,
  initialSkills: data.initialSkills,
  skills: data.skills,
  prompt: data.content,
}))

/**
 * Schema for agents in manifests (with prompt instead of content)
 */
export const agentManifestSchema: z.ZodObject<{
  name: z.ZodString
  description: z.ZodString
  initialSkills: z.ZodDefault<z.ZodArray<z.ZodString>>
  skills: z.ZodDefault<z.ZodArray<z.ZodString>>
  prompt: z.ZodString
}> = z
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
    prompt: z.string().describe('Prompt of the agent'),
  })
  .describe('Agent Schema (for Manifest)')

/**
 * Schema for file references in skill frontmatter
 */
export const skillFileReferenceSchema: z.ZodObject<{
  path: z.ZodString
  description: z.ZodString
  content: z.ZodString
}> = z
  .object({
    path: z.string().min(1).describe('Path relative to skill root directory (no ./ prefix)'),
    description: z
      .string()
      .min(1)
      .describe('Description to help LLM decide when to load this file'),
    content: z.string().describe('File content embedded at build time'),
  })
  .describe('Skill File Reference Schema')

export const skillSchema: z.ZodObject<{
  name: z.ZodString
  description: z.ZodString
  toolsets: z.ZodDefault<z.ZodArray<z.ZodString>>
  files: z.ZodOptional<z.ZodDefault<z.ZodArray<typeof skillFileReferenceSchema>>>
  content: z.ZodString
}> = z
  .object({
    name: z.string().min(1).describe('The name of the skill'),
    description: z.string().min(1).describe('A brief description of the skill'),
    toolsets: z.array(z.string()).default([]).describe('Toolsets associated with the skill'),
    files: z
      .array(skillFileReferenceSchema)
      .default([])
      .optional()
      .describe('File references available for on-demand loading'),
    content: z.string().describe('Full markdown content of the skill'),
  })
  .describe('Skill Schema')

export const toolsetSchema: z.ZodObject<{
  name: z.ZodString
  description: z.ZodString
  tools: z.ZodArray<z.ZodString>
  content: z.ZodString
}> = z
  .object({
    name: z.string().min(1).describe('The name of the toolset'),
    description: z.string().min(1).describe('A brief description of the toolset'),
    tools: z.array(z.string()).describe('Tools included in the toolset'),
    content: z.string().describe('Full markdown content of the toolset'),
  })
  .describe('Toolset Schema')

export const toolSchema: z.ZodObject<{
  name: z.ZodString
  description: z.ZodString
  content: z.ZodString
}> = z
  .object({
    name: z
      .string()
      // Should match a valid function name pattern
      .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/)
      .describe('The name of the tool'),
    description: z.string().min(1).describe('A brief description of the tool'),
    content: z.string().describe('Full markdown content of the tool'),
  })
  .describe('Tool Schema')

export const manifestSchema: z.ZodObject<{
  version: z.ZodDefault<z.ZodNumber>
  app: z.ZodDefault<
    z.ZodObject<
      {
        globalInitialSkills: z.ZodDefault<z.ZodArray<z.ZodString>>
        globalSkills: z.ZodDefault<z.ZodArray<z.ZodString>>
      },
      z.core.$strip
    >
  >
  agents: z.ZodRecord<
    z.ZodString,
    typeof agentManifestSchema
  >
  skills: z.ZodRecord<
    z.ZodString,
    z.ZodObject<
      {
        name: z.ZodString
        description: z.ZodString
        toolsets: z.ZodDefault<z.ZodArray<z.ZodString>>
        files: z.ZodOptional<z.ZodDefault<z.ZodArray<typeof skillFileReferenceSchema>>>
        content: z.ZodString
      },
      z.core.$strip
    >
  >
  toolsets: z.ZodRecord<
    z.ZodString,
    z.ZodObject<
      {
        name: z.ZodString
        description: z.ZodString
        tools: z.ZodArray<z.ZodString>
        content: z.ZodString
      },
      z.core.$strip
    >
  >
  tools: z.ZodRecord<
    z.ZodString,
    z.ZodObject<
      {
        name: z.ZodString
        description: z.ZodString
        content: z.ZodString
      },
      z.core.$strip
    >
  >
}> = z
  .object({
    version: z.number().default(1).describe('Version of the manifest schema'),
    app: appConfigSchema,
    agents: z.record(agentManifestSchema.shape.name, agentManifestSchema).describe('Full list of agents'),
    skills: z
      .record(
        skillSchema.shape.name,
        z
          .object({
            name: z.string().min(1),
            description: z.string().min(1),
            toolsets: z.array(z.string()).default([]),
            files: z.array(skillFileReferenceSchema).default([]).optional(),
            content: z.string(),
          })
          .describe('Skill with file references')
      )
      .describe('Full list of skills'),
    toolsets: z.record(toolsetSchema.shape.name, toolsetSchema).describe('Full list of toolsets'),
    tools: z.record(toolSchema.shape.name, toolSchema).describe('Full list of tools'),
  })
  .describe('Schema of the generated Carnet manifest')

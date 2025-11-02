import type { Tool } from 'ai'

// A DomainToolSet is a collection of executable tools, keyed by name.
export type DomainToolSet = Record<string, Tool>

/**
 * Manages the registration and retrieval of domain toolsets.
 *
 * Domain tools are the user's own executable functions, which are
 * progressively exposed to the agent as it discovers new skills.
 */
export class ToolRegistry {
  private registry: Map<string, DomainToolSet> = new Map()

  /**
   * Registers a toolset for a given name.
   * If a toolset with the same name already exists, the new tools
   * will be merged with the existing ones.
   *
   * @param toolsetName The name of the toolset (e.g., 'search-tools').
   * @param tools An object containing the Vercel AI tools.
   */
  public register(toolsetName: string, tools: DomainToolSet): void {
    const existingTools = this.registry.get(toolsetName) || {}
    const mergedTools = { ...existingTools, ...tools }
    this.registry.set(toolsetName, mergedTools)
  }

  /**
   * Retrieves a toolset by its name.
   *
   * @param toolsetName The name of the toolset to retrieve.
   * @returns The toolset if found, otherwise undefined.
   */
  public getTools(toolsetName: string): DomainToolSet | undefined {
    return this.registry.get(toolsetName)
  }

  /**
   * Retrieves all tools from a list of toolset names.
   *
   * @param toolsetNames An array of toolset names.
   * @returns A merged ToolSet containing all tools from the requested toolsets.
   */
  public getToolsForToolsets(toolsetNames: Iterable<string>): DomainToolSet {
    const merged: DomainToolSet = {}
    for (const toolsetName of toolsetNames) {
      const tools = this.getTools(toolsetName)
      if (tools) {
        Object.assign(merged, tools)
      }
    }
    return merged
  }

  /**
   * Lists the names of all registered toolsets.
   *
   * @returns An array of toolset names.
   */
  public listToolsets(): string[] {
    return Array.from(this.registry.keys())
  }
}

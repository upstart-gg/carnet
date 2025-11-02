import type { ToolSet } from 'ai'
import type { CarnetSessionState, DomainToolSet } from './types'

/**
 * Merges the base Carnet tools with the domain tools that should be
 * exposed based on the current session state and available toolsets.
 *
 * @param carnetTools The five meta-tools for progressive discovery.
 * @param session The current session state.
 * @param availableToolsets All available domain toolsets keyed by name.
 * @returns A merged ToolSet containing both Carnet and exposed domain tools.
 */
export function mergeToolSets(
  carnetTools: ToolSet,
  session: CarnetSessionState,
  availableToolsets: Record<string, DomainToolSet> = {}
): ToolSet {
  // Get domain tools from loaded toolsets
  const domainTools: ToolSet = {}

  for (const toolsetName of session.loadedToolsets) {
    const toolset = availableToolsets[toolsetName]
    if (toolset) {
      Object.assign(domainTools, toolset)
    }
  }

  return { ...carnetTools, ...domainTools }
}

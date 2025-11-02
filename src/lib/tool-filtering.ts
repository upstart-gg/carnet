import type { ToolSet } from 'ai'
import { ToolRegistry } from './tool-registry'
import type { CarnetSessionState } from './types'

/**
 * Merges the base Carnet tools with the domain tools that should be
 * exposed based on the current session state and available toolsets.
 *
 * @param carnetTools The five meta-tools for progressive discovery.
 * @param session The current session state.
 * @param toolRegistry Registry containing all available domain toolsets keyed by name.
 * @returns A merged ToolSet containing both Carnet and exposed domain tools.
 */
export function mergeToolSets(
  carnetTools: ToolSet,
  session: CarnetSessionState,
  toolRegistry: ToolRegistry = new ToolRegistry()
): ToolSet {
  // Get domain tools from loaded toolsets
  const domainTools = toolRegistry.getToolsForToolsets(session.loadedToolsets)
  return { ...carnetTools, ...domainTools }
}

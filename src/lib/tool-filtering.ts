import type { ToolSet } from 'ai'
import type { ToolRegistry } from './tool-registry'
import type { CarnetSessionState } from './types'

/**
 * Merges the base Carnet tools with the domain tools that have been
 * exposed in the current session.
 *
 * @param carnetTools The five meta-tools for progressive discovery.
 * @param session The current session state.
 * @param registry The registry containing all registered domain tools.
 * @returns A merged ToolSet containing both Carnet and exposed domain tools.
 */
export function mergeToolSets(
  carnetTools: ToolSet,
  session: CarnetSessionState,
  registry: ToolRegistry
): ToolSet {
  const domainTools = registry.getToolsForToolsets(session.loadedToolsets)
  return { ...carnetTools, ...domainTools }
}

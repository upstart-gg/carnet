import type { Carnet } from '@lib/index'
import type { CarnetToolName } from './types'

export abstract class CarnetAdapter<Tool = unknown> {
  protected agentName: string
  protected carnet: Carnet

  constructor(carnet: Carnet, agentName: string) {
    this.carnet = carnet
    this.agentName = agentName
  }
  /**
   * Return the tools map from the provided *user tools* + *Carnet tools*
   * Filter *user tools* that should not be shown upon startup
   */
  abstract getTools<MyTools extends Record<string, unknown>>(
    myTools: MyTools
  ): MyTools & Record<CarnetToolName, Tool>
  /**
   * Get the system prompt for the agent
   */
  abstract getSystemPrompt(options?: { raw?: boolean }): string
}

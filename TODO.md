# Carnet Architectural Redesign: Domain Tools Integration

> A comprehensive plan for integrating domain tools with progressive skill discovery in Carnet
> **Date**: November 2, 2025
> **Status**: 📋 Planning Phase
> **Target**: v2.0 Release

---

## Vision

### Current State Problem
Carnet is a **progressive documentation loading system**. It helps LLMs Agents discover skills, toolsets, and tools through markdown documentation, but:

- **All content is documentation only** - No executable domain tools
- **Tools are static** - Only 5 meta-tools for loading documentation
- **System prompts are static** - Don't reflect discovered capabilities
- **No progressive tool exposure** - Tools can't become available as skills are discovered

### Desired Future State
Carnet becomes a **progressive discovery framework** that:

- **Manages both documentation AND executable tools** - Skills describe capabilities, toolsets describe tool groups, tools are actual executables
- **Makes tools dynamic** - Domain tools automatically exposed when relevant skills are loaded
- **Tracks session state** - Knows which skills discovered, which tools available
- **Updates prompts dynamically** - System prompt reflects current agent capabilities
- **Simple registration API** - Clean way to register domain tools
- **Backward compatible** - Existing code continues to work

### Goals
1. ✅ Separate concerns: Domain tools (user's code) vs Carnet tools (progressive discovery)
2. ✅ Enable intelligent tool exposure: Show tools only when relevant
3. ✅ Support progressive capability growth: More tools as agent learns skills
4. ✅ Maintain context efficiency: Avoid overwhelming prompts
5. ✅ Provide clean developer UX: Simple registration and usage

---

## Part 1: Core Concepts

### Two Types of Tools

#### Domain Tools 🛠️
**What:** Actual executable tools from the user's application
- Examples: `search()`, `analyzeCode()`, `generateImage()`, `fetchData()`
- Implementation: Vercel AI SDK `tool()` function with execute handlers
- Who provides: The user, via `registerDomainToolset()`
- When available: Initially none, progressively exposed as skills are discovered
- Lifecycle: Registered before agent use, exposed dynamically

#### Carnet Tools 🔍
**What:** Meta-tools that enable progressive discovery of skills and documentation
- `listAvailableSkills` - List all skills in the agent's catalog
- `loadSkill` - Load full documentation for a skill
- `listSkillToolsets` - List toolsets associated with a skill
- `loadToolset` - Load toolset instructions and available tools
- `loadTool` - Load specific tool documentation
- Who provides: Carnet automatically
- When available: Always (from the start)
- Lifecycle: Static, never change

### Content Hierarchy

```
Agent
├── Initial Skills (in system prompt by default)
│   └── Skill "webSearch"
│       ├── Description: "Search the web effectively"
│       ├── Documentation: Full markdown content
│       ├── Toolsets: ["search-tools", "filter-tools"]
│       └── Domain Tools: [NOT in prompt, registered separately]
│
├── On-Demand Skills (discovered via loadSkill)
│   └── Skill "dataAnalysis"
│       └── [same structure as above]
│
└── Toolsets (discovered via loadToolset)
    ├── "search-tools"
    │   ├── Description: "Core search capabilities"
    │   ├── Documentation: Full markdown content
    │   ├── Tools: ["basicSearch", "advancedSearch", "filterResults"]
    │   └── Domain Tools: [Exposed ONLY when skill "webSearch" is loaded]
    │
    └── "data-analysis-tools"
        └── [same structure]
```

### Tool Exposure Rules

**When are domain tools exposed?**

1. **At initialization (agent startup):**
   - Carnet meta-tools available (5 progressive loading tools) ✅ Always
   - **Initial skills' domain tools auto-exposed** ✅ Immediately available
   - For each initial skill:
     - Toolsets referenced by that skill are identified
     - Domain tools registered for those toolsets are exposed
   - Example: If "webSearch" is an initial skill with toolsets ["search-tools", "filter-tools"], then `basicSearch`, `advancedSearch`, and `filterResults` are immediately available

2. **After AI calls `loadSkill('dataAnalysis')`:**
   - System identifies that dataAnalysis has toolsets: ["statistical-analysis", "visualization"]
   - Internal session state updates: `discoveredSkills.add('dataAnalysis')`
   - On next `getTools()` call, include domain tools from those toolsets
   - Domain tools for "statistical-analysis" become available
   - Domain tools for "visualization" become available

3. **After AI calls `loadToolset('search-tools')`:**
   - Toolset instructions include info about available tools
   - Domain tools already exposed (from skill loading in step 1 or 2)
   - Tools can now be used with full context from toolset documentation

---

## Part 2: API Changes

### `getSystemPrompt(agentName, options?): string`

#### Current Behavior
Returns a static string with:
- Agent base prompt
- Initial skills full content
- Available skills catalog
- Progressive loading instructions

#### New Behavior
Returns a **dynamic** string with:
- Agent base prompt
- Initial skills full content
- Available skills catalog
- **[NEW] Currently Loaded Skills section** - Lists skills discovered via loadSkill
- **[NEW] Available Domain Tools section** - Lists domain tools from discovered skills
- **[NEW] Dynamic Loading Instructions** - Explains both skill and tool usage
- Progressive loading instructions

#### API Signature
```typescript
interface GetSystemPromptOptions {
  includeInitialSkills?: boolean      // Default: true
  includeSkillCatalog?: boolean       // Default: true
  includeLoadedSkills?: boolean       // Default: true [NEW]
  includeAvailableTools?: boolean     // Default: true [NEW]
  variables?: Record<string, string>  // Variable injection
}

getSystemPrompt(
  agentName: string,
  options?: GetSystemPromptOptions
): string
```

#### Example Output
```markdown
# Research Assistant

You are an expert researcher with access to powerful tools.

## Initial Skills

You have immediate access to these skills:

### Skill: Web Search
Search the internet for information...
[Full webSearch skill content]

## Available Skills Catalog

You can discover and load these skills as needed:
- dataAnalysis (toolsets: statistical-analysis, visualization)
- documentProcessing (toolsets: text-extraction, summarization)
- ...

## Currently Loaded Skills

Skills you have discovered during this session:
- webSearch (toolsets: search-tools, filter-tools)

### Available Domain Tools

From loaded skills:
- **basicSearch** - Perform basic web search
- **advancedSearch** - Advanced search with filters
- **filterResults** - Filter search results

## How to Discover More

Use the `loadSkill` tool to discover more capabilities...
[Instructions for progressive loading]
```

### `getTools(agentName, options?): ToolSet`

#### Current Behavior
Returns static ToolSet with 5 Carnet meta-tools only.

#### New Behavior
Returns **dynamic** ToolSet with:
- 5 Carnet meta-tools (always)
- Domain tools from discovered skills (changes per session)

```typescript
{
  // Carnet meta-tools (always present)
  listAvailableSkills: ...,
  loadSkill: ...,
  listSkillToolsets: ...,
  loadToolset: ...,
  loadTool: ...,

  // Domain tools (dynamically added based on discovered skills)
  basicSearch: ...,        // Added after loadSkill('webSearch')
  advancedSearch: ...,     // Added after loadSkill('webSearch')
  filterResults: ...,      // Added after loadSkill('webSearch')

  // More domain tools from other discovered skills
  // ...
}
```

#### Important Behavior Changes

1. **Stateful:** `getTools()` now returns different results based on session state
2. **Auto-updates:** When `loadSkill`/`loadToolset` is called, state updates
3. **Next call:** The next `getTools()` call includes newly discovered tools
4. **Filtering:** Optional `tools` parameter to limit exposed tools

#### Multi-Turn Conversation Pattern

```typescript
// Setup: Assuming "webSearch" is an initial skill with toolsets ["search-tools", "filter-tools"]
carnet.registerDomainToolset('search-tools', { basicSearch, advancedSearch, filterResults })
carnet.registerDomainToolset('filter-tools', { filterByDate, filterByDomain })

// Turn 1: Initial tools (at startup)
const tools1 = carnet.getTools('agent')
// Returns: [5 Carnet meta-tools] + [basicSearch, advancedSearch, filterResults, filterByDate, filterByDomain]
// Because webSearch is an initial skill with those toolsets

const result1 = await streamText({
  model: openai('gpt-4'),
  system: carnet.getSystemPrompt('agent'),
  tools: tools1,
  messages: [{ role: 'user', content: 'Search for recent AI papers' }]
})

// Turn 2: After AI calls loadSkill('dataAnalysis')
const tools2 = carnet.getTools('agent')
// Returns: [5 Carnet meta-tools] + [previous tools] + [analyzeStatistics, visualizeData]
// Because dataAnalysis is now loaded with toolsets ["statistical-analysis", "visualization"]

const result2 = await streamText({
  model: openai('gpt-4'),
  system: carnet.getSystemPrompt('agent'),  // Also updated to include dataAnalysis
  tools: tools2,  // Now includes additional tools from dataAnalysis
  messages: [...]
})
```

### New Public Methods

#### `registerDomainToolset(toolsetName: string, tools: ToolSet): void`

Register domain tools for a toolset.

```typescript
carnet.registerDomainToolset('search-tools', {
  basicSearch: tool({
    description: 'Perform basic web search',
    parameters: z.object({ query: z.string() }),
    execute: async ({ query }) => { ... }
  }),
  advancedSearch: tool({...}),
  filterResults: tool({...})
})
```

**Behavior:**
- Stores tools in internal registry
- Does NOT expose immediately
- Tools become available when corresponding skill discovered
- Can be called multiple times (registers additional tools)

#### `getDiscoveredSkills(agentName: string): string[]`

Get list of skills discovered so far.

```typescript
const discovered = carnet.getDiscoveredSkills('researcher')
// Returns: ['webSearch', 'dataAnalysis']
```

#### `getAvailableTools(agentName: string): string[]`

Get list of domain tools currently exposed.

```typescript
const available = carnet.getAvailableTools('researcher')
// Returns: ['basicSearch', 'advancedSearch', 'filterResults', ...]
```

#### `resetSession(agentName: string): void`

Clear discovered skills and reset tool exposure.

```typescript
carnet.resetSession('researcher')
// Clears state - getTools() returns only meta-tools again
```

---

## Part 3: User Workflow

### Step 1: Write Markdown Files

```
project/
├── skills/
│   ├── webSearch/
│   │   ├── SKILL.md          # Skill documentation
│   │   └── schema.json       # Metadata (toolsets, etc)
│   └── dataAnalysis/
│       ├── SKILL.md
│       └── schema.json
│
├── toolsets/
│   ├── search-tools/
│   │   ├── TOOLSET.md        # Toolset documentation
│   │   └── schema.json       # Metadata (tools list)
│   └── analysis-tools/
│       ├── TOOLSET.md
│       └── schema.json
│
└── tools/
    ├── basicSearch/
    │   └── TOOL.md           # Tool documentation
    └── analyzeCode/
        └── TOOL.md
```

### Step 2: Build Manifest

```bash
carnet build
# Generates: dist/carnet.manifest.json
# Contains: All skill, toolset, and tool documentation
```

### Step 3: Implement Domain Tools (User's Code)

```typescript
// src/tools/search-tools.ts
import { tool } from 'ai'
import { z } from 'zod'

export const basicSearch = tool({
  description: 'Perform basic web search',
  parameters: z.object({
    query: z.string().describe('Search query')
  }),
  execute: async ({ query }) => {
    // User's actual implementation
    const results = await yourSearchAPI.search(query)
    return JSON.stringify(results)
  }
})

export const advancedSearch = tool({
  description: 'Advanced search with filters',
  parameters: z.object({
    query: z.string(),
    filters: z.record(z.string())
  }),
  execute: async ({ query, filters }) => {
    // User's actual implementation
    return JSON.stringify(await yourSearchAPI.advancedSearch(query, filters))
  }
})
```

### Step 4: Register Domain Tools with Carnet

```typescript
// src/agent.ts
import { Carnet } from '@upstart.gg/carnet'
import * as searchTools from './tools/search-tools'
import * as analysisTools from './tools/analysis-tools'

const carnet = await Carnet.fromManifest('./dist/carnet.manifest.json')

// Register domain tools
carnet.registerDomainToolset('search-tools', searchTools)
carnet.registerDomainToolset('analysis-tools', analysisTools)
```

### Step 5: Use in LLM Application

```typescript
// src/agent.ts
const result = await streamText({
  model: openai('gpt-4'),
  system: carnet.getSystemPrompt('researcher', {
    includeInitialSkills: true,
    includeSkillCatalog: true,
    variables: { DOMAIN: 'academic research' }
  }),
  tools: carnet.getTools('researcher'),
  messages: [
    {
      role: 'user',
      content: 'Find recent papers on AI safety and analyze them'
    }
  ]
})

// Process results
for await (const chunk of result.textStream) {
  process.stdout.write(chunk)
}
```

**What happens:**
1. Initial prompt includes webSearch skill + search-tools tool descriptions
2. LLM loads skill documentation using `loadSkill('webSearch')`
3. Carnet automatically exposes search-tools domain tools
4. LLM can now call `basicSearch()` and `advancedSearch()`
5. Results are processed and used in the agent's reasoning

---

## Part 4: Implementation Plan

### Phase 1: State Management (Week 1)

#### Task 1.1: Create Session State Type
- **File:** `/src/lib/types.ts`
- **Add:**
  ```typescript
  export interface CarnetSessionState {
    agentName: string
    discoveredSkills: Set<string>
    loadedToolsets: Set<string>
    exposedDomainTools: Set<string>
  }
  ```
- **Tests:** Unit tests for state creation and updates
- **Effort:** 1 day

#### Task 1.2: Create Tool Registry
- **File:** `/src/lib/tool-registry.ts` (new)
- **Add:**
  ```typescript
  export class ToolRegistry {
    private registry: Map<string, ToolSet>

    register(toolsetName: string, tools: ToolSet): void
    getTools(toolsetName: string): ToolSet | undefined
    listToolsets(): string[]
  }
  ```
- **Tests:** Registration, retrieval, merging logic
- **Effort:** 1 day

#### Task 1.3: Add Session Management to Carnet Class
- **File:** `/src/lib/index.ts`
- **Add:**
  - `private sessions: Map<string, CarnetSessionState>`
  - `registerDomainToolset(toolsetName: string, tools: ToolSet): void`
  - `getDiscoveredSkills(agentName: string): string[]`
  - `getAvailableTools(agentName: string): string[]`
  - `resetSession(agentName: string): void`
  - `private getOrCreateSession(agentName: string): CarnetSessionState`
- **Tests:** Session CRUD operations
- **Effort:** 1 day

### Phase 2: Dynamic Tool Exposure (Week 2)

#### Task 2.1: Modify loadSkill Tool
- **File:** `/src/lib/tools.ts`
- **Change:** When `loadSkill` succeeds, trigger state update
  ```typescript
  execute: async ({ skillName }) => {
    const skill = ...  // Load skill

    // [NEW] Trigger state update
    session.discoveredSkills.add(skillName)

    // [NEW] Auto-expose toolsets
    for (const toolsetName of skill.toolsets) {
      session.loadedToolsets.add(toolsetName)
    }

    return { success: true, content: skill.content, ... }
  }
  ```
- **Tests:** State updates on skill load
- **Effort:** 1 day

#### Task 2.2: Create Tool Filtering Function
- **File:** `/src/lib/tool-filtering.ts` (new)
- **Add:**
  ```typescript
  export function mergeToolSets(
    carnetTools: ToolSet,
    session: CarnetSessionState,
    registry: ToolRegistry
  ): ToolSet {
    const merged = { ...carnetTools }

    // Add domain tools from discovered skills
    for (const toolsetName of session.loadedToolsets) {
      const domainTools = registry.getTools(toolsetName)
      if (domainTools) {
        Object.assign(merged, domainTools)
      }
    }

    return merged
  }
  ```
- **Tests:** Tool merging, duplicate handling, filtering
- **Effort:** 1 day

#### Task 2.3: Make getTools() Dynamic
- **File:** `/src/lib/index.ts`
- **Change:**
  ```typescript
  getTools(agentName: string, options?: GetToolsOptions): ToolSet {
    const carnetTools = createCarnetTools(this, agentName)
    const session = this.getOrCreateSession(agentName)

    let merged = mergeToolSets(carnetTools, session, this.toolRegistry)

    // [NEW] Apply optional filtering
    if (options?.tools) {
      merged = Object.fromEntries(
        Object.entries(merged).filter(([name]) =>
          options.tools!.includes(name)
        )
      )
    }

    return merged
  }
  ```
- **Tests:** Tool merging, filtering, state-based changes
- **Effort:** 1 day

### Phase 3: Dynamic System Prompt (Week 3)

#### Task 3.1: Create Dynamic Prompt Generator
- **File:** `/src/lib/dynamic-prompt-generator.ts` (new)
- **Add:**
  ```typescript
  export class DynamicPromptGenerator extends PromptGenerator {
    generateLoadedSkillsSection(
      session: CarnetSessionState,
      manifest: Manifest
    ): string

    generateAvailableToolsSection(
      session: CarnetSessionState,
      registry: ToolRegistry
    ): string
  }
  ```
- **Tests:** Section generation, formatting
- **Effort:** 1 day

#### Task 3.2: Modify getSystemPrompt()
- **File:** `/src/lib/index.ts`
- **Change:**
  ```typescript
  getSystemPrompt(agentName: string, options?: GetSystemPromptOptions): string {
    const session = this.getOrCreateSession(agentName)
    const dynamicGenerator = new DynamicPromptGenerator(...)

    // [NEW] Build dynamic sections
    const sections = [
      agentPrompt,
      this.includeInitialSkills ? generateInitialSkillsSection(...) : '',
      this.includeSkillCatalog ? generateSkillCatalogSection(...) : '',
      // [NEW] Add dynamic sections
      options.includeLoadedSkills ?
        dynamicGenerator.generateLoadedSkillsSection(session, manifest) : '',
      options.includeAvailableTools ?
        dynamicGenerator.generateAvailableToolsSection(session, registry) : '',
      generateLoadingInstructions(...)
    ]

    return sections.filter(Boolean).join('\n\n')
  }
  ```
- **Tests:** Dynamic sections, option flags
- **Effort:** 1 day

### Phase 4: Testing & Documentation (Week 4)

#### Task 4.1: Integration Tests
- **File:** `/tests/integration/domain-tools.test.ts`
- **Tests:**
  - Tool exposure after skill loading
  - Multi-turn conversations with dynamic tools
  - State persistence and reset
  - Prompt updates based on loaded skills
- **Effort:** 2 days

#### Task 4.2: Update Documentation
- **Files:**
  - `/docs/guide/using-with-llms.md` - Add domain tools section
  - `/docs/api/carnet.md` - Document new public methods
  - `/docs/patterns/tool-registration.md` - New patterns guide
  - `/docs/patterns/multi-turn-with-dynamic-tools.md` - Multi-turn patterns
- **Effort:** 2 days

#### Task 4.3: Create Examples
- **Directory:** `/examples/`
- **Examples:**
  - `domain-tools-basic.ts` - Simple tool registration
  - `domain-tools-multi-skill.ts` - Multiple skills and toolsets
  - `domain-tools-multi-turn.ts` - Multi-turn conversation
- **Effort:** 2 days

### Phase 5: Backward Compatibility Layer (Week 5)

#### Task 5.1: Deprecation Warnings
- **File:** `/src/lib/index.ts`
- **Add:** Deprecation warnings for unchanged usage patterns
- **Effort:** 1 day

#### Task 5.2: Migration Guide
- **File:** `/docs/migration/v2-migration-guide.md`
- **Content:**
  - What changed and why
  - How to add domain tools to existing code
  - Backward compatibility notes
  - Step-by-step migration checklist
- **Effort:** 1 day

---

## Part 5: Technical Design Details

### State Management Architecture

```
Carnet Instance
├── sessions: Map<agentName, CarnetSessionState>
│   └── CarnetSessionState
│       ├── agentName: string
│       ├── discoveredSkills: Set<string>
│       ├── loadedToolsets: Set<string>
│       └── exposedDomainTools: Set<string>
│
├── toolRegistry: ToolRegistry
│   └── Map<toolsetName, ToolSet>
│
└── manifest: Manifest
    ├── agents: Agent[]
    ├── skills: Skill[]
    ├── toolsets: Toolset[]
    └── tools: Tool[]
```

### Tool Exposure Timeline

```
Time 0 (Agent Creation - Startup)
  Session created for agent
  agent.initialSkills = ['webSearch']  // from manifest

  For each initialSkill:
    - Find its toolsets: webSearch -> ["search-tools", "filter-tools"]
    - Add to session.loadedToolsets
    - Mark as discoveredSkills

  session.discoveredSkills = ['webSearch']
  session.loadedToolsets = ['search-tools', 'filter-tools']

Time 1 (getTools() called at startup)
  mergeToolSets checks:
    - For each toolset in session.loadedToolsets
    - Get domain tools from registry
    - Merge with Carnet meta-tools

  Returns:
    [5 meta-tools: listAvailableSkills, loadSkill, etc.]
    + [search-tools domain tools: basicSearch, advancedSearch, filterResults]
    + [filter-tools domain tools: filterByDate, filterByDomain]

Time 2 (LLM calls loadSkill('dataAnalysis'))
  loadSkill tool execute handler:
    - Finds dataAnalysis skill
    - Identifies its toolsets: ["statistical-analysis", "visualization"]
    - Updates session.discoveredSkills.add('dataAnalysis')
    - Updates session.loadedToolsets.add('statistical-analysis', 'visualization')
    - Returns skill content + metadata

Time 3 (Next getTools() call)
  mergeToolSets checks all toolsets in session.loadedToolsets:
    - 'search-tools' -> [basicSearch, advancedSearch, filterResults]
    - 'filter-tools' -> [filterByDate, filterByDomain]
    - 'statistical-analysis' -> [analyzeStatistics, etc]
    - 'visualization' -> [visualizeData, etc]

  Returns: [5 meta-tools] + [all accumulated domain tools]

Time 4 (LLM calls analyzeStatistics())
  Actual analysis is executed
  Results returned to LLM
```

### Prompt Evolution

```
Initial Prompt
├── Agent base prompt
├── Initial skills content
├── Skill catalog
└── Loading instructions

After loadSkill('webSearch') with dynamic prompt
├── Agent base prompt
├── Initial skills content
├── Skill catalog
├── [NEW] Currently Loaded Skills:
│   └── webSearch (with tool descriptions)
├── [NEW] Available Tools:
│   ├── basicSearch
│   ├── advancedSearch
│   └── filterResults
└── Loading instructions
```

---

## Part 6: Design Decisions

### Decision 1: Tool Exposure Timing

**Question:** When exactly should domain tools become available?

**Chosen:** After `loadSkill` is called and internal state updates

**Rationale:**
- Automatic, no extra work for user
- Matches progressive discovery philosophy
- Minimal context overhead
- Requires calling `getTools()` again in multi-turn (acceptable)

---

### Decision 2: Registration Timing

**Question:** When should domain tools be registered?

**Chosen:** Before creating first session (immediately after loading manifest)

**Rationale:**
- Simplest for most use cases
- Single registration phase upfront
- No per-session overhead

---

### Decision 3: Multi-Turn Tool Updates

**Question:** How to handle tool updates during streaming?

**Chosen:** Call `getTools()` before each turn

**Rationale:**
- Explicit is better than implicit
- Matches existing patterns
- Vercel AI SDK expects static ToolSet
- Clear in code when tools might change

---

### Decision 4: Prompt Updates

**Question:** Should system prompt update between turns?

**Chosen:** Yes, call `getSystemPrompt()` before each turn

**Rationale:**
- Reflects current agent capabilities
- Helps LLM understand what's available
- More informative prompts
- Small overhead for significant benefit

---

### Decision 5: Error Handling

**Question:** What if domain tools not registered for discovered skill?

**Chosen:** Proceed silently without exposing tools

**Rationale:**
- Skills can exist without tools
- Flexible architecture
- Log warning for debugging if needed
- Follows "fail gracefully" principle

---

## Part 7: Backward Compatibility

### No Breaking Changes for Basic Usage

```typescript
// This still works exactly the same
const carnet = await Carnet.fromManifest('./manifest.json')
const prompt = carnet.getSystemPrompt('agent')
const tools = carnet.getTools('agent')

// Behavior: Same as v1 (no domain tools)
```

### Opt-In New Features

```typescript
// Users can opt-in to domain tools
carnet.registerDomainToolset('search-tools', searchTools)

// Behavior: Automatic tool exposure on skill loading
```

### Migration Checklist (For Users)

- [ ] Review tool registration requirements
- [ ] Move domain tools to `registerDomainToolset()` calls
- [ ] Test multi-turn conversations with dynamic tools
- [ ] Update system prompt generation if using custom options
- [ ] Verify no naming conflicts between domain tools
- [ ] Update agent prompts to mention available domain tools

---

## Part 8: Success Criteria

### Definition of Done

#### Phase 1: State Management
- [ ] `CarnetSessionState` type created and tested
- [ ] `ToolRegistry` class implemented with 100% test coverage
- [ ] Session management added to Carnet class
- [ ] All state mutation methods work correctly
- [ ] No regressions in existing tests

#### Phase 2: Dynamic Tool Exposure
- [ ] `loadSkill` triggers state updates
- [ ] Tool filtering function merges toolsets correctly
- [ ] `getTools()` returns different results based on state
- [ ] Multi-turn conversations work with dynamic tools
- [ ] No duplicate tool names in merged toolsets

#### Phase 3: Dynamic System Prompts
- [ ] `DynamicPromptGenerator` creates sections correctly
- [ ] `getSystemPrompt()` includes loaded skills section
- [ ] `getSystemPrompt()` includes available tools section
- [ ] Option flags work (`includeLoadedSkills`, `includeAvailableTools`)
- [ ] Prompts are clear and actionable

#### Phase 4: Testing & Documentation
- [ ] Integration tests for complete workflows
- [ ] All documentation updated with examples
- [ ] Examples compile and run
- [ ] No broken links or references
- [ ] API reference is complete

#### Phase 5: Backward Compatibility
- [ ] Existing code runs without changes
- [ ] v1 examples still work
- [ ] Migration guide is clear
- [ ] Deprecation warnings are helpful

### Performance Criteria

- [ ] No regression in `getTools()` performance (< 5% overhead)
- [ ] No regression in `getSystemPrompt()` performance (< 5% overhead)
- [ ] Session state operations are O(1) or O(log n)
- [ ] Large manifests (1000+ entities) still perform well

### Test Coverage

- [ ] Unit tests: > 85% coverage on new code
- [ ] Integration tests: All major workflows covered
- [ ] Adapter tests: Vercel AI, OpenAI, Anthropic (existing)
- [ ] All edge cases documented and tested

---

## Part 9: Risk Mitigation

### Risk 1: Performance Degradation

**Risk:** Tool filtering and merging could be slow

**Mitigation:**
- Use `Map` and `Set` for O(1) lookups
- Cache merged toolsets
- Profile performance early
- Add performance tests

### Risk 2: Naming Conflicts

**Risk:** Two toolsets register tools with same name

**Mitigation:**
- Document recommendation: use namespaced names
- Option for user to handle conflicts in registration
- Log warnings when conflicts detected
- Consider namespace support if needed

### Risk 3: Breaking Change to Session Model

**Risk:** Adding session state could break some usage patterns

**Mitigation:**
- Sessions are automatic and invisible
- No breaking changes to public API
- Existing code continues to work
- Document upgrade path clearly

### Risk 4: Test Coverage Gaps

**Risk:** New code paths not properly tested

**Mitigation:**
- Write tests before implementation (TDD)
- Require >85% coverage for new code
- Test both happy path and error cases
- Integration tests for complete workflows

---

## Summary

### What's Changing

| Aspect | Before | After |
|--------|--------|-------|
| Tool Types | Only Carnet meta-tools | Carnet meta-tools + domain tools |
| Tool Availability | Static | Dynamic based on skill discovery |
| System Prompt | Static | Dynamic based on session state |
| Tool Exposure | N/A | Automatic when skill loaded |
| User API | `getSystemPrompt()`, `getTools()` | + `registerDomainToolset()`, `getDiscoveredSkills()`, `getAvailableTools()` |
| Session State | None | Tracked per agent |

### Key Benefits

1. **Progressive Tool Discovery** - Tools appear as relevant skills are discovered
2. **Context Efficiency** - Only relevant tools are exposed at any time
3. **Better Prompts** - System prompts reflect current capabilities
4. **Clean Registration** - Simple API for adding domain tools
5. **Session Tracking** - Know what skills agent has discovered

### Implementation Timeline

- **Phase 1 (Week 1):** State management foundation
- **Phase 2 (Week 2):** Dynamic tool exposure
- **Phase 3 (Week 3):** Dynamic prompts
- **Phase 4 (Week 4):** Testing & documentation
- **Phase 5 (Week 5):** Backward compatibility & migration guide

**Total Effort:** 4-5 weeks for full implementation

### Next Steps

1. ✅ Finalize design (in progress - this document)
2. ⏭️ Gather feedback and clarifications
3. ⏭️ Create detailed task tickets
4. ⏭️ Begin Phase 1 implementation
5. ⏭️ Review and iterate based on learnings

---

## Appendix: Open Questions

### Question 1: Tool Namespacing

**Issue:** What if multiple toolsets have tools with same name?

**Options:**
- A: Last registration wins (override)
- B: Throw error on conflict
- C: Namespace by toolset (toolset/tool format)

**Recommendation:** Option A with warnings logged; Option C as escape hatch

---

### Question 2: Async Tool Registration

**Issue:** Should tool registration support async operations?

**Options:**
- A: Sync only (current approach)
- B: Support async registration
- C: Support async with promise-based API

**Recommendation:** A (sync only) - tools are already static Vercel AI objects

---

### Question 3: Tool Lifecycle Hooks

**Issue:** Should we support callbacks when tools are exposed/removed?

**Options:**
- A: No hooks - keep it simple
- B: Callback on skill load: `onSkillLoaded(skillName, exposedTools)`
- C: Event emitter pattern

**Recommendation:** A (no hooks) - can be added in v2.1 if needed

---

**Version:** 1.0 (Initial Planning)
**Last Updated:** November 2, 2025
**Status:** 📋 Ready for Review
**Target Release:** v2.0

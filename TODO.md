# 📋 Carnet – Potential Improvements

This document lists upcoming improvements and refinements for Carnet’s API, architecture, and documentation.

## 🧩 Carnet Runtime Flow (current state)

### Explanation
- **Initialization:** Carnet loads the manifest and builds internal registries for agents, skills, and toolsets.
- **Prompt generation:** `getSystemPrompt()` merges metadata and variables to produce the LLM system prompt.
- **Tool creation:** `getTools()` internally invokes a factory to expose progressive built‑in tools and dynamically merged domain tools.
- **Progressive exposure:** When a skill is loaded, its toolsets become available; corresponding domain tools appear automatically.
- **Session state:** `getAvailableTools()` and internal maps reflect what an agent can currently access.

---

## 1. `getTools()` Simplification
**What:** Reduce the number of built‑in tools returned by default (`minimal` vs `full`).  
**Why:** Developers often only need `listAvailableSkills` and `loadSkill`. Exposing all five internal tools adds noise.  
**Reasoning:** Aligns with principle of least surprise and minimal API surface.  
**Plan:**
- **Files to update:**
	- `/Users/matt/dev/carnet/src/lib/tools.ts`: remove definitions for unused built‑in tools (`unloadSkill`, `refreshToolRegistry`, `getSkillManifest`). Keep only `listAvailableSkills` and `loadSkill`. Lines ~40–70.
	- `/Users/matt/dev/carnet/docs/api/index.md`: update `getTools()` section to mention only two built‑in tools (`listAvailableSkills`, `loadSkill`). Lines ~55–80.
	- `/Users/matt/dev/carnet/tests/lib/tools.test.ts`: remove test cases validating removed tools; keep validation for the two existing ones. Lines ~20–60.
	- `/Users/matt/dev/carnet/tests/integration/domain-tools.test.ts`: ensure that the expectations align with two methods. Lines ~30–90.
	- `/Users/matt/dev/carnet/README.md`: reflect updated API usage examples to show minimal set (`listAvailableSkills`, `loadSkill`) only.

**Step details:**
1. Remove obsolete exports and tool creation logic in `src/lib/tools.ts`.
2. Update docs to simplify examples and remove mentions of `{ defaultSet: 'minimal' | 'full' }`.
3. Delete or adjust tests referencing deprecated tools.
4. Run `bun test` afterwards to ensure full coverage remains.

---

## 4. Strengthen Documentation Clarity
**What:** Add conceptual guides for tool lifecycle and schema-driven design.  
**Why:** Current docs hide dynamic discovery details, confusing to new users.  
**Reasoning:** Visibility drives adoption and correct usage.  
**Plan:**
- Diagram: Agent ➜ Skills ➜ Toolsets ➜ Tools.
- Update `/docs/api/index.md` examples with schema introspection references.
- Integrate with `Quick Start` and `Progressive Loading` pages.

---

## 5. Internal Architecture Cleanup
**What:** Fully internalize `ToolRegistry` and `createCarnetTools()` APIs.  
**Why:** Prevent misuse and duplicates in public imports.  
**Reasoning:** Simplifies surface API; ensures users depend only on `carnet.getTools()`.
**Plan:**
- Mark with `@internal` (done).
- Remove accidental re‑exports in any barrel files.
- Add unit test coverage for internal plumbing.

---

### Author’s notes
This list will evolve as Carnet’s architecture stabilizes around declarative composition and AI SDK interoperability.
PRs addressing partial tasks or documentation drafts are encouraged.

---



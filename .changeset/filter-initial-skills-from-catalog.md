---
"@upstart.gg/carnet": patch
---

Fix skill catalog to exclude initial skills that are already loaded. The `generateSkillCatalogSection()` now filters out initial skills from the "On-Demand Skills" catalog, preventing redundant listings since initial skills are automatically loaded when the agent starts.

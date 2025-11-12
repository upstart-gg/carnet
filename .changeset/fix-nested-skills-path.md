---
"@upstart.gg/carnet": patch
---

Fix file path resolution for nested skills. The `files` property in `SKILL.md` files now works correctly when skills are located in nested directories (e.g., `skills/nested/dir/my-skill/`). Previously, file references would fail with "file not found" errors because the builder was incorrectly constructing paths using only the skill name instead of the full nested path.

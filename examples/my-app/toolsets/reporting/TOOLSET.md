---
name: reporting
description: Tools for communicating task status and results back to main agent
tools:
  - reportCompletion
  - reportFailure
---

# Reporting Tools

Tools for communicating task status back to the main agent when work is delegated.

## Overview

Sub-agents (Coder, Designer, Data Architect) use reporting tools to communicate task outcomes to the main agent. Use these when you complete delegated work or encounter blockers.

## When to Report

### Report Completion
- Task completed successfully
- All deliverables created and validated
- Ready for next phase of work

### Report Failure
- Encountered blockers you cannot resolve
- Missing dependencies or information
- Task is impossible with current constraints
- Need main agent to intervene

## Best Practices

### Before Reporting Completion
- Verify your work is complete
- Run validation (lint, tests, etc.)
- Document decisions in memory
- Ensure deliverables are ready

### Before Reporting Failure
- Provide clear explanation of the blocker
- List what you've tried
- Specify what's needed to unblock
- Update memory with known issues

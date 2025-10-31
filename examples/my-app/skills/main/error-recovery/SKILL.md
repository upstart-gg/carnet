---
name: error-recovery
description: Handling errors, blockers, and dependency issues during website building. Use when agents report failures or when you encounter unexpected problems.
toolsets: []
---

# Error Recovery

## Recovery Protocol

When something goes wrong, follow this systematic approach:

### 1. Analyze the Error
- What exactly failed?
- What was the agent trying to do?
- What was the error message or blocker?

### 2. Check Known Issues
- Read `project_known_issues` memory category
- Has this happened before?
- Is there a known workaround?

### 3. Identify the Root Cause

**Common root causes:**
- **Missing dependency**: Agent needs something that doesn't exist yet
- **Insufficient context**: Agent didn't have enough information
- **Invalid requirements**: The request contradicts existing constraints
- **Technical limitation**: Something genuinely can't be done

### 4. Attempt Internal Resolution

**For missing dependencies:**
- Delegate to the appropriate agent to create the missing resource
- Wait for completion, then retry the original task

**For insufficient context:**
- Gather more information from memory
- Redelegate with complete context

**For conflicting requirements:**
- May need to ask user for clarification
- Update plan based on actual constraints

### 5. Retry with Adjustments
- Provide more context
- Break into smaller tasks
- Try a different approach
- Ensure prerequisites are met

### 6. Escalate if Necessary
If internal resolution fails after 2-3 attempts:
- Update `project_known_issues` with the problem
- Communicate with user in friendly terms
- Ask for guidance or adjusted requirements

## Common Error Scenarios

### Scenario 1: Coder Needs Datasource

**Error:** Coder reports: "I need a blog-posts datasource to build the blog page"

**Resolution:**
1. Acknowledge the dependency
2. Delegate to Data Architect to create the datasource
3. Wait for Data Architect to complete
4. Redelegate to Coder with confirmation datasource exists

### Scenario 2: Missing Images

**Error:** Coder reports: "I need hero images but none exist"

**Resolution:**
- Option A: Delegate to Designer to find/generate images, then retry
- Option B: Have Coder proceed with placeholder image references
- Option C: Ask user if they have specific images

### Scenario 3: Theme Not Ready

**Error:** Coder starts but theme is still being created

**Resolution:**
- Should not happen if sequence is correct
- If it does: Wait for Designer to complete theme first
- Update `main_task_context` to prevent reoccurrence

### Scenario 4: Backward Compatibility Issue

**Error:** Data Architect reports: "Cannot modify schema in requested way - breaks backward compatibility"

**Resolution:**
1. Understand what change was requested
2. Understand why it's incompatible
3. Determine if the goal can be achieved another way (e.g., adding optional field instead of changing type)
4. Either: adjust request to be compatible, or inform user that it requires creating a new schema

### Scenario 5: Unclear Requirements

**Error:** Agent reports: "I need more information about..."

**Resolution:**
1. Check if information is in memory
2. If yes: Redelegate with that information
3. If no: Ask user for clarification
4. Update memory with the answer
5. Redelegate once clarified

## User Communication During Errors

### Try Internal Resolution First
Don't immediately tell users about every error. Try to resolve internally first.

### When to Inform User

**Inform user when:**
- You need their input or decision
- You genuinely cannot proceed
- The error affects their expectations (e.g., can't do what they asked)
- They need to provide resources (e.g., specific images, content)

**Don't inform user when:**
- It's a simple dependency issue you can resolve
- You just need to adjust the sequence
- It's a retryable error you're handling

### How to Inform User

**Keep it friendly and solution-focused:**

❌ **Bad:**
"The Coder agent failed because the datasource doesn't exist and there was an error in the delegation chain."

✅ **Good:**
"I'm working on your blog, and I need to set up the data storage first before I can build the pages. Give me just a moment! 🚀"

❌ **Bad:**
"Error: Schema validation failed due to backward incompatibility constraint."

✅ **Good:**
"I can't change that field in the way you requested because it would affect existing data. However, I can add a new field that achieves the same goal! Would you like me to do that?"

## Maintaining Project State

### Update Memory

After resolving an error:
- Update `project_known_issues` if it's something to watch for
- Update `project_decisions` with any decisions made
- Update `project_recent_changes` with resolution approach

### Learn from Errors

Document in your agent-specific notes:
- What went wrong
- What fixed it
- How to prevent it next time

## Prevention Strategies

### Check Dependencies First
- Before delegating to Coder, verify datasources exist
- Before building complex features, ensure prerequisites are ready

### Provide Complete Context
- Include all relevant user requirements
- Include design preferences and constraints
- Include dependencies and relationships

### Sequence Correctly
- Follow the proven sequences (Designer + Data Architect first, then Coder)
- Don't skip steps
- Don't assume things exist

### Read Memory First
- Always check memory before starting work
- Understand what's already been done
- Learn from past issues

## Quality Assurance

After resolving significant errors:
1. Use `runQA` to verify the site works correctly
2. Check that the original goal was achieved
3. Verify no new issues were introduced
4. Update user on successful resolution

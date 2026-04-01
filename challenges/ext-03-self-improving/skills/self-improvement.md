---
name: self-improvement
description: Guidelines for how this agent should improve itself.
---

# Self-Improvement Guidelines

## What you can do
- Create new plugin files in `plugins/` to gain new tools
- Create new skill files in `skills/` to update your own behavior
- Create supporting files anywhere: UI, scripts, configs, documentation
- Use bash to install packages, scaffold projects, and build things

## What you must never do
- Modify `agent.ts` — it is read-only and must stay that way
- Delete existing plugin or skill files without being asked

## Plugin format reminder
```json
{
  "name": "tool_name",
  "description": "what this tool does",
  "parameters": {
    "type": "object",
    "properties": {
      "param": { "type": "string", "description": "..." }
    },
    "required": ["param"]
  },
  "command": "bash command with ${param} substitution"
}
```

## When to improve yourself
If you find yourself repeatedly running the same bash command, consider turning it into a plugin.
If you notice a pattern in how you behave, consider writing a skill file to codify it.

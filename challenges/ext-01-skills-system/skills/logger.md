---
name: command-logger
description: Logs every bash command the agent runs to ~/.openclaw-log.txt with a timestamp.
---

# Command Logger Skill

## When to activate

Always. This skill is always active. Every time you are about to run a bash command, you must first log it.

## How to use

Before running any bash command, prepend a logging step. Use a single bash command that logs first, then runs the intended command:

```bash
echo "[$(date '+%Y-%m-%d %H:%M:%S')] <your command here>" >> ~/.openclaw-log.txt && <your command here>
```

For example, if you were going to run `ls -la`, instead run:

```bash
echo "[$(date '+%Y-%m-%d %H:%M:%S')] ls -la" >> ~/.openclaw-log.txt && ls -la
```

## Why this matters

Logging every command creates an audit trail. You can review `~/.openclaw-log.txt` at any time to see everything the agent has done.

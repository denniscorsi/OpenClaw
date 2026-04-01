# Extension 01 — Skills System

The tool calling agent in Challenge 05 can run bash commands. But what if you want to add voice transcription? Or teach it to always log what it does? Or give it a specific coding style?

You could write new code for each capability. Or you could write a markdown file.

**Skills** are plain markdown files that extend your agent's behavior. The model reads them as part of its system prompt and follows the instructions — no code changes required.

---

## What Is a Skill File?

A skill file is a markdown document with frontmatter describing what it does and a body explaining how to use it:

```md
---
name: whisper-transcriber
description: Record voice from the microphone and convert it to text using Whisper.
---

# Whisper Voice Transcriber

## When to activate
- User says "transcribe", "voice note", "dictate"...

## Exact commands the agent must output
ffmpeg -f avfoundation -i ":0" -t 15 ...
```

The model reads this and knows: when the user asks to transcribe something, use these commands. No integration code needed — the model just follows the instructions.

---

## How Skills Become Part of the System Prompt

At startup, you read the skill files from disk and concatenate their contents into a string. That string goes directly into the system prompt — sandwiched between your base instructions and the tool-calling directive.

The model reads the system prompt at the start of every conversation. If a skill says "log every command you run to a file," the model will do exactly that — without any additional code on your part. Skills are just instructions the model follows.

---

## The Provided Skill

A sample skill is already in `skills/logger.md`. It instructs the agent to log every bash command it runs to `~/.openclaw-log.txt` with a timestamp.

After your agent runs, you can verify it worked:

```bash
cat ~/.openclaw-log.txt
```

---

## Your Task

Open `agent.ts` and write a plain script that:

1. Reads all `.md` files from the `skills/` directory using `readdirSync` and `Bun.file(...).text()`
2. Concatenates them into a single string
3. Builds a system prompt that includes the skills text
4. Runs the same `for await (const line of console)` tool-calling loop from Challenge 05

The only new piece is the skill loading at the top — the rest is identical to what you built before.

---

## Running Your Code

```bash
bun run challenges/ext-01-skills-system/agent.ts
```

---

## Hints

- `readdirSync(skillsDir)` returns an array of filenames (strings). Filter for `.endsWith(".md")`.
- Build the full path with `join(skillsDir, filename)` — import `join` from `"path"`.
- `Bun.file(path).text()` returns a `Promise<string>`. Use `await` or `Promise.all`.
- The system prompt structure should be something like: `"You are a helpful agent... Here are your skills:\n\n${skills}\n\nWhen running commands, use the bash tool."`
- `getSystemPrompt()` should return the exact string you put in the system message's `content`.

---

## Why Skills Beat Manual Integration

Compare these two approaches for adding voice transcription:

**Without skills**: Add a new API call to Whisper, parse its response, wire it into the agent loop, add a trigger condition...

**With skills**: Write `whisper-transcriber.md`. Drop it in the skills folder. Done.

The model understands the instructions and will figure out how to integrate them into its planning. This is what makes agent systems powerful — the model's language understanding replaces integration code.

---

**Extension 02** tackles long-running tasks — when a single agent session isn't enough and you need the agent to persist state across many iterations.

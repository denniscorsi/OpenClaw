# OpenClaw

Build your own AI agent from scratch — starting from a single terminal command, ending with a working tool-calling agent in only 20 lines of JavaScript!

---

## What You're Building

An AI agent is a program that:

1. Takes a goal in plain English
2. Asks an LLM what to do next
3. Does it (runs a command, reads a file, calls an API)
4. Feeds the result back to the LLM
5. Repeats until the goal is complete

That's it. No magic. The sophistication comes from the loop, the message history, and the tools you give it.

By the end of this workshop you'll understand exactly how tools like Claude Code and Cursor work under the hood — because you'll have built the same architecture yourself.

---

## Prerequisites

- A terminal (macOS)
- Basic JavaScript/TypeScript familiarity
- No AI experience needed

---

## How This Works

Each challenge lives in the `challenges/` folder. Work through them in order — they're numbered. Early challenges are **terminal-only**: paste a command, observe the output, move on. Later challenges have **code stubs** you fill in and **tests** you run to verify your work.

```
challenges/
├── 00-setup/              Start here — get your API key and install Bun
├── 01-curl-basics/        Talk to an AI from your terminal
├── 02-pipe-and-execute/   Extract and run AI-generated commands automatically
├── 03-js-agent/           Move everything into JavaScript
├── 04-while-loop-agent/   Add memory and retry logic
├── 05-tool-calling/       Use a cleaner, safer command protocol  ← core ends here
│
├── ext-01-skills-system/  Extension 01 — extend with markdown skill files
├── ext-02-ralph-loop/     Extension 02 — build a long-running agent
└── ext-03-self-improving/ Extension 03 — give the agent the ability to extend itself
```

Open the `README.md` inside each folder to get started.

---

## Running Your Code

Each challenge from 03 onward has an `agent.ts` you run directly:

```bash
bun run challenges/03-js-agent/agent.ts
bun run challenges/04-while-loop-agent/agent.ts
# ...and so on
```

If you're stuck, each challenge has a `solution/` folder you can peek at.

---

## The Arc

Here's the story of what you're building, challenge by challenge:

**Challenge 00 — Setup**
Get your OpenRouter API key and install Bun. OpenRouter gives you access to Claude, GPT-4, and other models through a single OpenAI-compatible API.

**Challenge 01 — Curl Basics**
Make your first AI API call from the terminal. Understand the raw HTTP request and response structure — what goes in, what comes back, and where the actual text lives in the JSON.

**Challenge 02 — Pipe and Execute**
Extract the AI's response with `jq` and pipe it straight to `bash`. One command: ask the AI what to do, extract it, run it. You've built a natural language interface for your computer.

**Challenge 03 — JavaScript Agent**
Bash is low-level. Move into JavaScript (Bun) so you have real data structures and error handling. Translate the curl command into a `fetch` call. Execute results with `Bun.$`.

**Challenge 04 — While Loop Agent**
One request isn't enough. Add a `while` loop and a persistent `messages` array. Now the agent remembers what happened, retries when commands fail, and keeps trying until it succeeds.

**Challenge 05 — Tool Calling**
The LLM now signals explicitly when it wants to run a command (via `tool_calls`) vs. when it's done (via `content`). This is cleaner and more reliable than parsing raw strings. It's also how every production AI agent works.

---

## Extensions

These go beyond the core workshop. Tackle them if you want to explore further.

**Extension 01 — Skills System**
Write a markdown file. Drop it in a folder. Your agent gains a new capability — no code changes. Skills are plain-English instructions the model reads and follows. Add voice transcription, logging, or anything else by writing a `.md` file.

**Extension 02 — The Ralph Loop**
Long tasks break agents. Context windows fill up, the model loses track, quality degrades. The solution: reload the goal and progress from files on every iteration. Use git commits as checkpoints. The agent can now work for hours without context rot.

**Extension 03 — Self-Improving Agent**
Skills let the agent behave differently. Plugins let it gain genuinely new tools — defined as JSON files with bash command templates. Both reload on every turn, so the agent can create a new capability during one response and use it immediately in the next. The core loop in `agent.ts` is made read-only, so all growth happens through new files.

---

## What's OpenClaw?

OpenClaw is a minimal open-source AI agent built on these same principles — a Bun-native coding agent you can run locally, extend with skills, and modify freely. This workshop walks you through building the core of it from scratch so you understand every line.

The goal is that you never have to treat these systems as black boxes again.

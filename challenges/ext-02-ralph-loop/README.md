# Extension 02 — The Ralph Loop

Every agent we've built so far has a fundamental limit: the context window. If you give the agent a task that takes 50 steps, the message history grows with every step. Eventually, the model's attention degrades — it "forgets" early instructions, repeats itself, or loses track of the goal. This is called **context rot**.

The Ralph Loop solves this by using files and git as the agent's external memory, instead of the message history alone.

---

## The Idea

Instead of keeping everything in memory, the agent:

1. **Reads** its goal and progress from files at the start of each iteration
2. **Acts** on one step of the task
3. **Writes** what it did to a progress file and commits to git
4. **Loops** — on the next iteration, it reloads fresh context

Each iteration starts with a clean, small context. The model never sees thousands of old messages — just the goal and a concise progress log. It can work for hours without degrading.

---

## The Files

**`PROMPT.md`** — The unchanging goal. Written once by you, never modified by the agent.

**`PROGRESS.md`** — A running log of what the agent has done so far. Updated by the agent after each iteration.

The agent reads both at the start of each loop, builds a system prompt from them, runs a single agent step (with tool calling), then saves progress and loops.

---

## Your Task

Open `agent.ts` and write a `for` loop (up to 10 iterations) that:

1. Reads `PROMPT.md` and `PROGRESS.md` from disk at the start of each iteration
   - Use `Bun.file(PROMPT_FILE).text()` for the goal
   - Use `.catch(() => "")` on `PROGRESS_FILE` in case it doesn't exist yet
2. Builds a system prompt from both files
3. Runs one full tool-calling agent step (the same `while (true)` loop from Challenge 05)
   - Start fresh each iteration: `messages = [systemPrompt, "Continue working on the goal."]`
4. Appends a timestamped entry to `PROGRESS.md` and commits with git
   - Read the file, concatenate, write back
   - `git -C ${import.meta.dir} add PROGRESS.md` then commit
   - Swallow git errors with `.catch(() => {})`
5. If the response contains `[DONE]`, print "Task complete!" and break

Use `import.meta.dir` to build absolute paths to `PROMPT.md` and `PROGRESS.md`.

---

## Running Your Code

```bash
bun run challenges/ext-02-ralph-loop/agent.ts
```

Watch `PROGRESS.md` grow. After 2–3 iterations the agent should complete the task and emit `[DONE]`. Check `output.txt` to see the result.

---

## Hints

- `import.meta.dir` gives you the absolute path to the directory containing the current file. Use it to build paths to `PROMPT.md` and `PROGRESS.md`.
- `Bun.file(path).text()` is the cleanest way to read files. Wrap it in try/catch for PROGRESS.md in case it doesn't exist.
- For `saveProgress`, use `Bun.write` to append — or read the file, concatenate, then write.
- For the git commit: `await Bun.$\`git add PROGRESS.md && git commit -m "progress: ..."\`.catch(() => {})`  — swallow git errors (e.g., if git isn't configured) so the loop doesn't crash.
- The system prompt for each iteration should include both the goal and the progress log so the model knows where it left off.

---

## Why "Ralph Loop"?

It's named after the idea that agents need to "ralph" (restart fresh) periodically to stay coherent, rather than accumulating stale context indefinitely. Clear state, clear thinking.

---

**Extension 03** goes further — giving the agent the ability to extend its own toolset by creating new files, with the core loop permanently protected.

# Extension 03 — Self-Improving Agent

Every agent we've built so far is static. Its capabilities are fixed at startup. Skills let it *behave* differently, but they can't give it genuinely new tools — a markdown file can't make an HTTP request.

This challenge gives the agent the ability to extend its own toolset by creating files. It can write new plugin definitions, new skill files, build a web UI, set up a development environment — anything that can be expressed as files on disk. The only rule: **the core loop in `agent.ts` is untouchable**.

---

## Two Kinds of Extensions

Your agent already supports two extension points:

**Skills** (`skills/*.md`) — plain English instructions. The model reads them and changes its behavior. Great for things like "always log commands" or "prefer Python over bash."

**Plugins** (`plugins/*.json`) — actual new tools. Each plugin defines a tool the model can call, backed by a bash command that runs when the tool is invoked.

Both reload on every turn. The agent creates a file during one response, and on the very next message that capability is available — no restart.

---

## The Plugin Format

A plugin is a single JSON file:

```json
{
  "name": "get_weather",
  "description": "Get current weather for a city",
  "parameters": {
    "type": "object",
    "properties": {
      "city": { "type": "string", "description": "The city name" }
    },
    "required": ["city"]
  },
  "command": "curl -s 'wttr.in/${city}?format=3'"
}
```

Four fields:
- `name` — what the model calls the tool
- `description` — what the model uses to decide when to call it
- `parameters` — JSON Schema for the arguments
- `command` — a bash command, with `${param}` placeholders substituted at call time

The agent creates this file with a bash command. On the next turn, it has a `get_weather` tool.

A working example is in `plugins/get-time.json`. Read it before you start.

---

## The Protected Core

Once your `agent.ts` is working, make it read-only:

```bash
chmod 444 challenges/08-self-improving/agent.ts
```

Now the agent literally cannot modify the file. If it tries, the bash command will fail. All improvements must come through new files. This is the constraint that makes self-improvement tractable — the core stays stable and trustworthy, while capabilities grow indefinitely around it.

---

## Your Task

Open `agent.ts`. The structure is similar to Challenge 06, but with two new pieces:

**1. Plugin loading** — inside the `for await` loop (so it runs on every turn), read all `.json` files from `PLUGINS_DIR`. Parse each one and build a tool definition from its `name`, `description`, and `parameters` fields.

**2. Tool dispatch** — when `message.tool_calls` fires, check whether it's a `bash` call (handle as before) or a plugin tool. For plugin tools, find the matching definition, substitute `${param}` values in its `command` string, and run it with `Bun.$`.

**3. System prompt** — rebuild it on every turn from the current skills and plugins. Tell the model about the plugin format and that `agent.ts` is read-only.

Also move skill loading inside the loop so new skills are picked up on every turn too.

---

## Running Your Code

```bash
bun run challenges/ext-03-self-improving/agent.ts
```

Try these prompts once it's running:

- `"What tools do you currently have?"` — see the starting state
- `"Create a plugin that lists running processes"` — watch it write a JSON file
- `"What tools do you have now?"` — the new tool should appear
- `"Create a simple HTML dashboard at ui/index.html that shows your activity"` — go further
- `"Improve yourself however you think is most useful"` — let it decide

---

## Hints

- `readdirSync(PLUGINS_DIR).filter(f => f.endsWith(".json"))` lists the plugin files. Wrap in try/catch in case the directory is empty.
- `JSON.parse(await Bun.file(path).text())` reads and parses each plugin.
- For substitution: `def.command.replace(/\$\{(\w+)\}/g, (_, k) => args[k] ?? "")` replaces `${city}` with `args.city`.
- Update `messages[0]` with the fresh system prompt on each turn (or push it if the array is empty).
- The `tools` array passed to the API should be `[BASH_TOOL, ...pluginTools]` — rebuilt each turn.

---

**Congratulations** — you've built an agent that can grow its own capabilities. This is the last challenge, but it's also a beginning: an agent that improves itself doesn't have a natural stopping point.

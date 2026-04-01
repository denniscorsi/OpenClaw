# Challenge 05 — Tool Calling

The while loop agent in Challenge 04 works, but it has a fundamental problem: the model returns a raw bash command as a plain string. What if the model adds a markdown code fence? What if it explains itself before the command? What if it wants to give a final answer without running anything?

Tool calling solves this by giving the model a structured way to signal "I want to run this command" vs. "I'm done and here's my answer."

---

## How Tool Calling Works

When you include a `tools` array in your API request, the model can respond in one of two ways:

**Option A — Tool call** (model wants to run something):
```json
{
  "role": "assistant",
  "content": null,
  "tool_calls": [{
    "id": "call_abc123",
    "type": "function",
    "function": {
      "name": "bash",
      "arguments": "{\"command\": \"ls -la\"}"
    }
  }]
}
```

**Option B — Final answer** (model is done):
```json
{
  "role": "assistant",
  "content": "I've listed the files. Here's what I found..."
}
```

Your job is to check which one came back, act accordingly, and loop.

---

## Key Differences from Challenge 04

- No try/catch — errors are returned as strings from a helper function, not thrown
- `role: "tool"` is a new message type that carries the command's output back to the model
- `tool_call_id` must match the `id` from the tool call — the model uses this to track which result belongs to which request
- The loop breaks on a final **content** response, not on successful command execution

---

## Your Task

Open `agent.ts` and write a `for await (const line of console)` loop — same structure as Challenge 04, but this time use the tool calling protocol instead of raw bash strings.

The outer loop is identical: read a line, push it to messages, enter a `while (true)`. The difference is inside: instead of executing the model's response directly, check `message.tool_calls`. If it's set, the model wants to run a command — execute it with `Bun.$` and push the result back as a `role: "tool"` message. If there's no `tool_calls`, the model is done — print `message.content` and break.

A `BASH_TOOL` definition is already at the top of `agent.ts`. Pass it in every API request as `tools: [BASH_TOOL]`.

---

## Running Your Code

```bash
bun run challenges/05-tool-calling/agent.ts
```

---

## Anatomy of a Tool Response

When you push a tool result back to messages, it looks like this:

```js
messages.push({
  role: "tool",
  tool_call_id: toolCall.id,  // must match the id from tool_calls[0]
  content: result,            // the stdout/error string
});
```

The model reads this as "here's what happened when I ran that command." Without `tool_call_id`, the model can't match the result to its request.

---

## Hints

- The system prompt matters more than you'd think. Tell the model it's running **locally on the user's Mac** with full access to their display and filesystem, and that it should always attempt tasks rather than explain why they might not work. Without this, models get overly cautious.
- `Bun.$\`sh -c ${command}\`.text()` returns a promise that resolves to a string. Append `.catch((e) => e.stderr || e.message)` to handle errors without throwing.
- `JSON.parse(toolCall.function.arguments)` gives you the structured arguments object — `const { command } = JSON.parse(...)`.
- The tool result message needs all three fields: `role: "tool"`, `tool_call_id: toolCall.id`, and `content: result`.

---

**That's the core workshop.** If you want to go further, check out the extensions — starting with Extension 01: Skills System.

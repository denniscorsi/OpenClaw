# Challenge 03 — JavaScript Agent

In Challenge 02, you piped `curl` through `jq` into `bash`. It worked — but it's brittle. You can't build data structures, handle errors, or do anything sophisticated in a single pipeline.

This challenge moves everything into JavaScript. You'll translate what you built in bash into a single Bun script.

---

## The Three Tools

You used three things in Challenge 02:

| Bash | JavaScript |
|------|------------|
| `curl` | `fetch` |
| `jq -r '.choices[0].message.content'` | `response.json()` then navigate the object |
| `\| bash` | `Bun.$` |

### `fetch`

`fetch` is the standard JavaScript way to make HTTP requests. It works like `curl`:

```js
const response = await fetch("https://example.com/api", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ key: "value" })
});
```

`fetch` is async, so you `await` it. The result is a `Response` object — call `.json()` on it to parse the body (just like `jq` did, but now you have a real JavaScript object).

### `Bun.$`

`Bun.$` is Bun's built-in shell API. It runs shell commands from JavaScript:

```js
await Bun.$`echo hello`;
await Bun.$`sh -c ${someVariable}`;
```

The backtick syntax is a tagged template literal. Bun handles escaping automatically.

---

## Your Task

Open `agent.ts` and write a script that:

1. Sends a request to the OpenRouter API asking for a bash command to take a screenshot
2. Parses the response and extracts the command from `data.choices[0].message.content`
3. Prints the command to the console
4. Executes it with `Bun.$`

The API URL, headers, and body structure are the same as in Challenge 02 — you're just writing it in JavaScript now instead of bash.

---

## Running Your Code

```bash
bun run challenges/03-js-agent/agent.ts
```

A screenshot should appear. If you see the command printed and the script exits cleanly, you're done.

> **Note**: macOS may prompt you for your password, or ask you to grant screen recording permission to your terminal app (or VS Code if you're running the terminal from there). That's expected — `screencapture` needs permission to record your screen. Grant it and run the script again.

> **Also note**: it's very possible the model returns a slightly malformed command that errors. That's fine — models aren't perfectly reliable and we can't control exactly what they output. If that happens, just run the script again and you'll likely get a clean command. We'll handle this properly in Challenge 04 by adding a retry loop.

---

## Hints

- The `Authorization` header should be: `` `Bearer ${process.env.OPENROUTER_API_KEY}` `` — Bun loads your `.env` file automatically.
- Don't forget `"reasoning": { "exclude": true }` in the request body alongside `"model"` and `"messages"`.
- `await response.json()` gives you the parsed object. From there it's just regular property access: `data.choices[0].message.content`.
- If the script runs but nothing visible happens, add `console.log(cmd)` before the `Bun.$` call to see what command was generated.

---

**Next**: Challenge 04 adds a `while` loop and a messages array so the agent can retry on failure and remember what happened across turns.

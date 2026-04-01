# Challenge 04 — While Loop Agent

In Challenge 03, the agent made one API call and ran the result. But what happens when the command fails? Or when the model returns something slightly malformed? The script just crashes.

This challenge adds two things: **memory** (a messages array that grows with every turn) and **retry logic** (a while loop that feeds errors back to the model until it gets it right).

---

## Messages Are Memory

Every time you call the API, you send the entire conversation history. The model has no memory of its own — it only knows what you pass in the `messages` array.

This means you can build up context across multiple turns:

```js
const messages = [
  { role: "system", content: "..." },      // your instructions
  { role: "user", content: "..." },        // what the user asked
  { role: "assistant", content: "..." },   // what the model said
  { role: "user", content: "..." },        // the next user message
];
```

If a command fails, you push the error into `messages` as a user message. The model reads it on the next loop iteration and tries a different approach.

---

## Reading from the Console

Bun lets you read user input line by line with `for await`:

```js
for await (const line of console) {
  // line is whatever the user typed and hit enter
}
```

This keeps the script running, waiting for input. Each line the user types triggers one iteration.

---

## Your Task

Open `agent.ts` and write a script that:

1. Creates a `messages` array with a system prompt telling the model to return only raw bash commands
2. Starts a `for await (const line of console)` loop to read user input
3. On each line, pushes the user's input to `messages` and starts a `while (true)` loop
4. Inside the while loop: calls the API with the full messages array, gets the response, pushes it to messages, and tries to execute it with `Bun.$`
5. If execution succeeds — `break` out of the while loop
6. If execution fails — push the error back as a `{ role: "user" }` message and let the loop try again

---

## Running Your Code

```bash
bun run challenges/04-while-loop-agent/agent.ts
```

Type an instruction and hit enter. The agent should execute a command, retrying automatically if it fails. Type another instruction — notice it still has context from the previous turn.

If you get stuck, check the `solution/` folder.

---

## Hints

- The system prompt should be firm: return only the raw bash command, no markdown, no explanation, no backticks.
- `data.choices[0].message` is the full message object — push that to `messages`, not just the content string.
- `error.message` inside the catch block gives you the error text to push back.
- The `for await` loop and the `while (true)` loop are nested — the while loop lives inside the for loop.

---

**Next**: Challenge 05 replaces raw bash strings with structured tool calls — a cleaner protocol where the model explicitly signals when it wants to run a command vs. when it's giving a final answer.

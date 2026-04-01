# Challenge 02 — Pipe and Execute

In Challenge 01 you got the model's response as raw JSON. You had to read the `content` field yourself. In this challenge, you'll extract it automatically and execute it — all in one command.

This challenge is **terminal-only**. Paste the commands and observe what happens.

---

## What is a Pipe?

The `|` character in bash is called a **pipe**. It takes the output of one command and feeds it as input to the next command.

```bash
echo "hello world" | wc -w
# Output: 2
```

Here `echo "hello world"` prints the string, and the pipe sends it to `wc` — a tool that **c**ounts **w**ords, lines, and characters. The `-w` flag means "count words only".

The point isn't `wc` specifically — it's the pipe. The output of one command becomes the input of the next. You can chain as many as you like.

---

## What is jq?

`jq` is a command-line JSON processor. It lets you extract specific fields from JSON output.

Install it if you don't have it:

```bash
brew install jq
```

In jq, you write a **filter** to describe which part of the JSON you want. The simplest filter is just a field name prefixed with a dot — `.name` means "give me the `name` field from the top-level object."

Try it:

```bash
echo '{"name": "claude"}' | jq '.name'
# Output: "claude"
```

`echo` prints the JSON string, the pipe sends it to `jq`, and `.name` extracts the value at that key. Notice the output has quotes around it — that's because jq outputs valid JSON by default, and `"claude"` is a JSON string.

That's where the `-r` flag comes in. `-r` means **raw output** — it strips the JSON quotes and gives you a plain string:

```bash
echo '{"name": "claude"}' | jq -r '.name'
# Output: claude
```

That distinction matters when you pipe the output to bash. `"screencapture screenshot.png"` (with quotes) is not a valid shell command — `screencapture screenshot.png` (without) is.

---

## Step 1 — Inspect the Full Response

Before extracting a specific field, use `jq '.'` to pretty-print the full response so you can see its structure clearly:

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -d '{"model": "openrouter/free",
       "reasoning": {"exclude": true},
       "messages": [{
         "role": "user",
         "content": "Return only mac bash command to take a screenshot. Output raw string only"
        }]
      }' \
| jq '.'
```

You should see a nicely formatted JSON response. Find the `choices` array and look inside `choices[0].message` — you're looking for the field that contains the actual command text.

---

## Step 2 — Extract the Content

You know from Step 1 where the command lives in the JSON. Now modify the command above to pipe into `jq -r` and extract just that string, so the output is the plain command — not the full JSON blob.

Check your work — your output should look something like:

```
screencapture screenshot.png
```

---

## Step 3 — Execute It

Now extend your command from Step 2 with one more pipe to actually run the command.

> **Hint**: the `bash` command will run whatever command is piped into it.

A screenshot file should appear in your current directory.

> **Note**: macOS may prompt you for your password, or ask you to grant screen recording permission to your terminal app. That's expected — grant it and run the command again.

**You just built a natural language interface for your computer.**

If you get stuck, check the `solution/` folder.

---

## Safety Note

Piping AI output directly to `bash` is powerful — and dangerous if you're not careful. The model could return a command you don't want to run.

In production AI systems, you always want to:

1. Show the user what's about to run before executing it
2. Sandbox execution where possible
3. Validate commands before running them

---

## Bonus

Change the prompt and try different tasks:

- `"Return only a mac bash command to open a new Finder window"`
- `"Return only a mac bash command to play a system sound"`
- `"Return only a mac bash command to show disk usage for the home directory"`

---

**Next**: Challenge 03 moves this into JavaScript (Bun) so you can add real data structures, error handling, and proper orchestration.

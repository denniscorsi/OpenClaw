# Challenge 01 — Curl Basics

Before writing any JavaScript, let's talk directly to the AI API at the lowest level possible: a raw HTTP request from the command line.

This challenge is **terminal-only**. Build the command step by step, run each version, and observe what changes.

---

## What is curl?

`curl` is a command-line tool for making HTTP requests. Every time your browser loads a page or an app fetches data, it's doing the same thing curl does — sending an HTTP request to a URL and getting a response back. curl just lets you do it manually, from the terminal.

---

## Step 1 — Hit the Endpoint

The OpenRouter chat API lives at this URL:

```
https://openrouter.ai/api/v1/chat/completions
```

Start by making a bare request to it:

```bash
curl https://openrouter.ai/api/v1/chat/completions
```

You'll get:

```json
{ "error": { "message": "Not Found", "code": 404 } }
```

That 404 isn't because the URL is wrong — it's because curl made a **GET** request by default, and this endpoint only accepts **POST**. The API is rejecting the method, not the URL.

---

## Step 2 — Make it a POST

The `-d` flag attaches a body to the request and, as a side effect, switches the method to POST. Send an empty body for now:

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -d '{}'
```

Different error this time:

```json
{ "error": { "message": "No cookie auth credentials found", "code": 401 } }
```

The method is now correct. The API can see the request — it just doesn't know who's making it.

> The `\` at the end of each line lets you split a long command across multiple lines. The shell treats it as one continuous command.

---

## Step 3 — Add Authentication

APIs use headers to carry metadata about a request. The `-H` flag in curl adds a header. OpenRouter uses `Bearer` auth — you pass your key in the `Authorization` header:

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -d '{"model": "openrouter/free",
       "reasoning": {"exclude": true}}'
```

The body now has two fields:

- **`model`** — which AI model to use. `"openrouter/free"` is a special OpenRouter ID that automatically routes to whichever capable free model is available at the time. You could swap this for `"anthropic/claude-sonnet-4-5"` or `"openai/gpt-4o"` if you had credits.

- **`reasoning`** — some free models are _reasoning models_ that think step-by-step internally before responding. By default they include that reasoning chain in the response, which can come back as a `null` content field and break our code. Setting `{"exclude": true}` tells the API to strip the reasoning out and give us just the final answer.

Another new error:

```json
{ "error": { "message": "Input required: specify \"prompt\" or \"messages\"", "code": 400 } }
```

You're now authenticated and the method is correct — the API just needs to know what to actually say to the model.

---

## Step 4 — Add a Message

The `messages` field is an array of message objects. Each one has a `role` and `content`.

`role` tells the model who is speaking — `"user"` means this is a message from the human:

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -d '{"model": "openrouter/free",
       "reasoning": {"exclude": true}, "messages": [{"role": "user", "content": "Say hello."}]}'
```

Run this. You should get a real response back from the model — a large JSON blob. You did it!

---

## Step 5 — Find the Reply

The response is noisy. Buried inside it is the model's actual reply. Here's the structure, simplified:

```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you today?" // The content is nondeterministic, so won't match this exactly
      }
    }
  ]
}
```

The text you care about is at `choices[0].message.content`. The model's reply is labeled with `role: "assistant"` — mirroring the `role: "user"` you sent.

---

## Step 6 — Ask for Something Useful

Now that you understand the structure, ask the model for a bash command. Tell it to return only the raw command:

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -d '{"model": "openrouter/free",
       "reasoning": {"exclude": true},
       "messages": [{
         "role": "user",
         "content": "Return only a mac bash command to take a screenshot. Output raw string only."
        }]
      }'
```

Find `choices[0].message.content` in the response. That's a bash command the model just wrote. In Challenge 02, you'll extract it automatically and run it.

---

## Reflection Questions

1. Why does the API require an `Authorization` header? What would happen if it didn't?
2. What does the `messages` field being an **array** suggest about how conversations work?
3. Why is the response wrapped in `"choices"` (an array) rather than just returning the message directly?

---

## Bonus

Change the `"content"` to ask for something different:

- `"Return only a mac bash command to list the 5 largest files in my home directory"`
- `"Return only a mac bash command to show my current IP address"`

**Next**: Challenge 02 shows you how to extract that content automatically and pipe it straight to bash — no copy-paste required.

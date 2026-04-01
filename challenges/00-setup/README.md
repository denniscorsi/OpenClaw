# Challenge 00 — Setup

Before writing any code, you need two things: a Bun runtime and an OpenRouter API key. This challenge walks you through both.

---

## Step 1 — Install Bun

Bun is the JavaScript runtime used throughout this workshop. It has built-in TypeScript support, a fast shell API, and a test runner — no extra tools needed.

```bash
curl -fsSL https://bun.sh/install | bash
```

Verify it worked:

```bash
bun --version
```

You should see a version number like `1.x.x`. If you don't you may need to simply close and reopen your terminal.

---

## Step 2 — Get an OpenRouter API Key

OpenRouter gives you access to many AI models (Claude, GPT-4, Gemini, and more) through a single API that follows the OpenAI format.

1. Go to [openrouter.ai](https://openrouter.ai) and create a free account.
2. On the main page click "Get API Key"
3. In the popup click "Create API Key"
4. Now click "Create"
5. Give it a name (e.g. `openclaw-workshop`) and click "Create".
6. Copy the key — it starts with `sk-or-v1-...`

> **Credits are optional.** OpenRouter has free models — you do not need to add payment details to complete this workshop. See below.

---

## Free Models vs. Paid Models

OpenRouter offers free models — no credit card needed. The challenges use the model ID `openrouter/free`, which is OpenRouter's own router that automatically picks from whatever free models are currently available. This means it will always work even as individual free models are added or removed.

**Free tier limitations:**
- 20 requests per minute
- 200 requests per day
- Free models can occasionally be slow or unavailable during high demand
- Not all free models support tool calling (used from Challenge 05 onward) — if you hit issues in later challenges, see the note below

**If `openrouter/free` doesn't support tool calling for your request**, you can browse [openrouter.ai/models](https://openrouter.ai/models?supported_parameters=tools) and filter by "Free" and "Tools" to find a specific free model that supports it. Then swap the `MODEL` constant at the top of the relevant `agent.ts` file.

200 requests per day is more than enough to complete all the challenges — a full run-through typically uses around 20–40 requests.

**If you'd rather not deal with free tier limitations**, you can add a small amount of credits to your OpenRouter account — a few dollars will cover the entire workshop many times over. Then change the `MODEL` constant at the top of any `agent.ts` file to a paid model like `anthropic/claude-sonnet-4-5`.

---

## Step 3 — Set Up Your Environment File

In the root of this repo, copy the example env file:

```bash
cp .env.example .env
```

Open `.env` and replace `your_key_here` with your actual key:

```
OPENROUTER_API_KEY=sk-or-v1-...your-key-here...
```

> **Important**: Never commit `.env` to git. It's already in `.gitignore`, but double-check before pushing anything.

Bun automatically loads `.env` files — but your regular terminal session does not. For the `curl` commands in Challenges 01 and 02, you need to export the key into your shell manually:

```bash
export OPENROUTER_API_KEY=sk-or-v1-...your-key-here...
```

You'll need to run this once each time you open a new terminal window. Alternatively, add it to your shell profile (`~/.zshrc` or `~/.bashrc`) so it's always available:

```bash
echo 'export OPENROUTER_API_KEY=sk-or-v1-...your-key-here...' >> ~/.zshrc
source ~/.zshrc
```

From Challenge 03 onward, Bun handles this automatically from your `.env` file — no manual export needed.

---

## Step 4 — Verify Everything Works

Run the following command to confirm your key is set up correctly:

```bash
curl https://openrouter.ai/api/v1/auth/key \
  -H "Authorization: Bearer $OPENROUTER_API_KEY"
```

You should see something like this:

```json
{
  "data": {
    "label": "openclaw-workshop",
    "usage": 0,
    "limit": null,
    "is_free_tier": true,
    "rate_limit": { "requests": 20, "interval": "10s" }
  }
}
```

If you see your key's label and `"is_free_tier": true`, you're ready. Move on to Challenge 01.

**If you see this instead:**

```json
{"error":{"message":"Missing Authentication header","code":401}}
```

Your key isn't being picked up. Check that you ran the `export` command from Step 3 in this same terminal window, and that the key value is correct.

**Other errors:**
- `curl: (6) Could not resolve host` — check your internet connection.

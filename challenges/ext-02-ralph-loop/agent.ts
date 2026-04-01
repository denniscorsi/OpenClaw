import { join } from "path";

const MODEL = "openrouter/free";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const PROMPT_FILE = join(import.meta.dir, "PROMPT.md");
const PROGRESS_FILE = join(import.meta.dir, "PROGRESS.md");

const BASH_TOOL_DEFINITION = {
  type: "function",
  function: {
    name: "bash",
    description: "Run a bash command on the local machine",
    parameters: {
      type: "object",
      properties: {
        command: { type: "string", description: "The bash command to execute" },
      },
      required: ["command"],
    },
  },
};

// TODO: Loop up to 10 times. On each iteration:
//
//   1. Read PROMPT.md and PROGRESS.md from disk
//      - Use Bun.file(PROMPT_FILE).text() for the goal
//      - Use Bun.file(PROGRESS_FILE).text().catch(() => "") for progress (handle missing file)
//
//   2. Build a system prompt that includes both the goal and the progress
//      Tell the model to include [DONE] in its response when the goal is complete
//
//   3. Run one tool-calling agent step (same while loop as Challenge 05)
//      Start with: messages = [{ role: "system", content: systemPrompt }, { role: "user", content: "Continue working on the goal." }]
//
//   4. Append a timestamped entry to PROGRESS.md and commit with git
//      - Read the file, append `\n## ${new Date().toLocaleString()}\n${response}\n`, write it back
//      - git -C ${import.meta.dir} add PROGRESS.md
//      - git -C ${import.meta.dir} commit -m "progress: ..."
//      - Swallow git errors with .catch(() => {})
//
//   5. If the response contains "[DONE]", print "Task complete!" and break

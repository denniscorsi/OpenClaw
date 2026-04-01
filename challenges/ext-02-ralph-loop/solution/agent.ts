import { join } from "path";

const PROMPT_FILE = join(import.meta.dir, "..", "PROMPT.md");
const PROGRESS_FILE = join(import.meta.dir, "..", "PROGRESS.md");

const BASH_TOOL = {
  type: "function",
  function: {
    name: "bash",
    description: "Run a bash command on the local machine",
    parameters: {
      type: "object",
      properties: { command: { type: "string", description: "The bash command to execute" } },
      required: ["command"]
    }
  }
};

for (let i = 0; i < 10; i++) {
  const goal = await Bun.file(PROMPT_FILE).text();
  const progress = await Bun.file(PROGRESS_FILE)
    .text()
    .catch(() => "");

  const systemPrompt = `You are an autonomous bash agent running locally on the user's Mac. You have full access to their filesystem and all installed tools. Always use the bash tool to attempt tasks — never explain why something might not work, just try it.\n\nYour goal:\n\n${goal}\n\nProgress so far:\n${progress || "None yet."}\n\nOnly include [DONE] in your response when the goal is fully and verifiably complete.`;

  const messages: any[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: "Continue working on the goal." }
  ];

  console.log(`\n--- Iteration ${i + 1} ---`);

  let response = "";
  let toolCalls = 0;
  const steps: string[] = [];

  while (true) {
    const data = await (
      await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` },
        body: JSON.stringify({
          model: "anthropic/claude-sonnet-4-5",
          reasoning: { exclude: true },
          messages,
          tools: [BASH_TOOL]
        })
      })
    ).json();

    if (!data.choices) {
      console.error("API error:", JSON.stringify(data));
      break;
    }

    const message = data.choices[0].message;

    if (message.tool_calls) {
      messages.push(message);
      const toolCall = message.tool_calls[0];
      const { command } = JSON.parse(toolCall.function.arguments);
      console.log(`> Running: ${command}`);
      const result = await Bun.$`sh -c ${command}`.text().catch((e: any) => e.stderr || e.message);
      messages.push({ role: "tool", tool_call_id: toolCall.id, content: result });
      steps.push(`$ ${command}\n${result.trim().slice(0, 300)}`);
      if (++toolCalls >= 3) {
        response = `Steps completed this iteration:\n\n${steps.join("\n\n")}`;
        break;
      }
    } else {
      messages.push(message);
      response = message.content ?? "";
      console.log(response);
      break;
    }
  }

  const existing = await Bun.file(PROGRESS_FILE)
    .text()
    .catch(() => "# Progress Log\n");
  await Bun.write(PROGRESS_FILE, existing + `\n## ${new Date().toLocaleString()}\n${response}\n`);
  await Bun.$`git -C ${import.meta.dir}/.. add PROGRESS.md`.catch(() => {});
  await Bun.$`git -C ${import.meta.dir}/.. commit -m ${"progress: " + response.slice(0, 50).replace(/\n/g, " ")}`.catch(
    () => {}
  );

  if (response.includes("[DONE]")) {
    console.log("\nTask complete!");
    break;
  }

  console.log(`Iteration ${i + 1} complete. Continuing...`);
}

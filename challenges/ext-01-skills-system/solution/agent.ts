import { readdirSync } from "fs";
import { join } from "path";

const BASH_TOOL = {
  type: "function",
  function: {
    name: "bash",
    description: "Run a bash command on the local machine",
    parameters: {
      type: "object",
      properties: { command: { type: "string", description: "The bash command to execute" } },
      required: ["command"],
    },
  },
};

const skillFiles = readdirSync(join(import.meta.dir, "../skills")).filter((f) => f.endsWith(".md"));
const skills = (await Promise.all(skillFiles.map((f) => Bun.file(join(import.meta.dir, "../skills", f)).text()))).join("\n\n");

const messages: any[] = [
  {
    role: "system",
    content: `You are a bash agent running locally on the user's Mac. You have full access to their display, filesystem, and all installed tools. Always use the bash tool to attempt tasks — never explain why something might not work, just try it. Here are your available skills:\n\n${skills}\n\nWhen you are done, give a brief plain text summary of what you did.`,
  },
];

for await (const line of console) {
  messages.push({ role: "user", content: line });

  while (true) {
    const data = await (
      await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` },
        body: JSON.stringify({
          model: "openrouter/free",
          reasoning: { exclude: true },
          messages,
          tools: [BASH_TOOL],
        }),
      })
    ).json();

    if (!data.choices) { console.error("API error:", JSON.stringify(data)); break; }

    const message = data.choices[0].message;

    if (message.tool_calls) {
      messages.push(message);
      const toolCall = message.tool_calls[0];
      const { command } = JSON.parse(toolCall.function.arguments);
      console.log(`> Running: ${command}`);
      const result = await Bun.$`sh -c ${command}`.text().catch((e: any) => e.stderr || e.message);
      messages.push({ role: "tool", tool_call_id: toolCall.id, content: result });
    } else {
      messages.push(message);
      console.log(message.content);
      break;
    }
  }
}

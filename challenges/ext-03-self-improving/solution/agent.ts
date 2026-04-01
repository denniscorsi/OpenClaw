import { readdirSync } from "fs";
import { join } from "path";

const MODEL = "openrouter/free";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const SKILLS_DIR = join(import.meta.dir, "..", "skills");
const PLUGINS_DIR = join(import.meta.dir, "..", "plugins");

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

const messages: any[] = [];

for await (const line of console) {
  // Reload skills on every turn so newly created skill files are picked up immediately
  const skillFiles = readdirSync(SKILLS_DIR).filter((f) => f.endsWith(".md"));
  const skills = (
    await Promise.all(skillFiles.map((f) => Bun.file(join(SKILLS_DIR, f)).text()))
  ).join("\n\n");

  // Reload plugins on every turn so newly created plugin files are available immediately
  const pluginFiles = readdirSync(PLUGINS_DIR).filter((f) => f.endsWith(".json"));
  const pluginDefs = await Promise.all(
    pluginFiles.map(async (f) => JSON.parse(await Bun.file(join(PLUGINS_DIR, f)).text()))
  );
  const pluginTools = pluginDefs.map((def) => ({
    type: "function",
    function: { name: def.name, description: def.description, parameters: def.parameters },
  }));

  const systemPrompt = [
    "You are a self-improving bash agent running locally on the user's Mac. You have full access to their display, filesystem, and all installed tools. Always use the bash tool to attempt tasks — never explain why something might not work, just try it.",
    skills && `\nSkills:\n\n${skills}`,
    pluginDefs.length > 0 &&
      `\nPlugin tools available: ${pluginDefs.map((d) => d.name).join(", ")}`,
    "\nTo gain new tools, create .json files in the plugins/ directory with this format:",
    '{ "name": "tool_name", "description": "...", "parameters": { "type": "object", "properties": { "arg": { "type": "string" } }, "required": ["arg"] }, "command": "bash command with ${arg} substitution" }',
    "\nTo update your behavior, create .md skill files in the skills/ directory.",
    "\nYou can also create any other files: UI, build scripts, configs, documentation.",
    "\nagent.ts is read-only — never attempt to modify it. All improvements happen through new files.",
  ]
    .filter(Boolean)
    .join("\n");

  if (messages.length === 0) {
    messages.push({ role: "system", content: systemPrompt });
  } else {
    messages[0] = { role: "system", content: systemPrompt };
  }

  messages.push({ role: "user", content: line });

  const tools = [BASH_TOOL, ...pluginTools];

  while (true) {
    const data = await (
      await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model: MODEL, reasoning: { exclude: true }, messages, tools }),
      })
    ).json();

    const message = data.choices[0].message;

    if (message.tool_calls) {
      messages.push(message);
      const toolCall = message.tool_calls[0];
      const args = JSON.parse(toolCall.function.arguments);
      let result: string;

      if (toolCall.function.name === "bash") {
        console.log(`> bash: ${args.command}`);
        result = await Bun.$`sh -c ${args.command}`.text().catch((e: any) => e.stderr || e.message);
      } else {
        const def = pluginDefs.find((d) => d.name === toolCall.function.name);
        if (def) {
          const cmd = def.command.replace(/\$\{(\w+)\}/g, (_: any, k: string) => args[k] ?? "");
          console.log(`> ${toolCall.function.name}: ${cmd}`);
          result = await Bun.$`sh -c ${cmd}`.text().catch((e: any) => e.stderr || e.message);
        } else {
          result = `Unknown tool: ${toolCall.function.name}`;
        }
      }

      messages.push({ role: "tool", tool_call_id: toolCall.id, content: result });
    } else {
      messages.push(message);
      console.log(message.content);
      break;
    }
  }
}

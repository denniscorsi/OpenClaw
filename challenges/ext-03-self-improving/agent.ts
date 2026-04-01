import { readdirSync } from "fs";
import { join } from "path";

const MODEL = "openrouter/free";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const SKILLS_DIR = join(import.meta.dir, "skills");
const PLUGINS_DIR = join(import.meta.dir, "plugins");

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

// TODO: Start a `for await (const line of console)` loop
//
//   TODO: Reload skills — read all .md files from SKILLS_DIR and concatenate them
//         (same as Challenge 06, but inside the loop so new skills load each turn)
//
//   TODO: Reload plugins — read all .json files from PLUGINS_DIR:
//         - Parse each as { name, description, parameters, command }
//         - Build a pluginTools array of tool definitions (type, function.name, .description, .parameters)
//         - Keep pluginDefs around for dispatch later
//
//   TODO: Build a system prompt from the current skills and plugin names.
//         Include the plugin JSON format so the model knows how to create new ones.
//         Include that agent.ts is read-only and must never be modified.
//
//   TODO: Update messages[0] with the fresh system prompt each turn
//         (push it if messages is empty, replace it otherwise)
//
//   TODO: Push the user's line to messages
//
//   TODO: Build the tools array: [BASH_TOOL, ...pluginTools]
//
//   TODO: while (true) tool-calling loop:
//     TODO: POST to API with messages and tools
//     TODO: Get message = data.choices[0].message
//     TODO: if (message.tool_calls):
//             - Push message to messages
//             - Parse args from message.tool_calls[0].function.arguments
//             - if toolCall.function.name === "bash":
//                 run with Bun.$ and capture result
//               else:
//                 find the matching pluginDef by name
//                 substitute ${param} in def.command: def.command.replace(/\$\{(\w+)\}/g, (_, k) => args[k] ?? "")
//                 run the substituted command with Bun.$
//             - Push { role: "tool", tool_call_id, content: result }
//           else:
//             - Push message, print content, break

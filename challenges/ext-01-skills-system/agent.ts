import { readdirSync } from "fs";
import { join } from "path";

const MODEL = "openrouter/free";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const SKILLS_DIR = join(import.meta.dir, "skills");

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

// TODO: Read all .md files from SKILLS_DIR
//       Use readdirSync(SKILLS_DIR).filter(f => f.endsWith(".md"))
//       Read each with Bun.file(join(SKILLS_DIR, filename)).text()
//       Concatenate them into a single string

// TODO: Create a messages array with a system prompt that includes the skills text
//       Something like: "You are a helpful agent... Here are your available skills:\n\n${skills}\n\n..."

// TODO: Start a `for await (const line of console)` loop
//   TODO: Same tool-calling while loop as Challenge 05

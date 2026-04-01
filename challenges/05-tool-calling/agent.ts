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

// TODO: Create a messages array with a system prompt
//       Tell the model it's running locally on the user's Mac with full bash access

// TODO: Start a `for await (const line of console)` loop to read user input
//   TODO: Push { role: "user", content: line } to messages
//   TODO: Start a while (true) loop
//     TODO: POST to the API with messages, tools: [BASH_TOOL], and reasoning: { exclude: true }
//     TODO: Get message = data.choices[0].message
//     TODO: if (message.tool_calls):
//             - Push message to messages
//             - Parse command: const { command } = JSON.parse(message.tool_calls[0].function.arguments)
//             - Run it: await Bun.$`sh -c ${command}`.text().catch((e) => e.stderr || e.message)
//             - Push { role: "tool", tool_call_id: toolCall.id, content: result } to messages
//           else:
//             - Push message to messages
//             - Print message.content
//             - break

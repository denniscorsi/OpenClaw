// TODO: Create a messages array with a system prompt
//       Tell the model to return only raw mac bash commands — no markdown, no backticks

// TODO: Start a `for await (const line of console)` loop to read user input

//   TODO: Push the user's input to messages as a { role: "user" } message

//   TODO: Start a while (true) loop
//     TODO: POST to the API with the full messages array
//           (same fetch call as challenge 03, but pass messages instead of a single prompt)
//           include reasoning: { exclude: true } in the body
//     TODO: Get message = data.choices[0].message
//     TODO: Push message to messages
//     TODO: try: execute message.content with Bun.$`sh -c ${...}` and break on success
//     TODO: catch: push the error back as { role: "user", content: `Command failed: ${error.message}` }

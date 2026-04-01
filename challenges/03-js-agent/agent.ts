// TODO: Make a POST request to https://openrouter.ai/api/v1/chat/completions
//       with the Authorization header, and a JSON body containing:
//         - model: "openrouter/free"
//         - reasoning: { exclude: true }
//         - messages: an array with one user message asking for a mac bash
//           command to take a screenshot (raw string only, no markdown)

// TODO: Parse the response JSON and extract the command from
//       data.choices[0].message.content

// TODO: Print the command to the console

// TODO: Execute it with Bun.$`sh -c ${cmd}`

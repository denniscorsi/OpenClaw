const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` },
  body: JSON.stringify({
    model: "openrouter/free",
    reasoning: { exclude: true },
    messages: [
      {
        role: "user",
        content: "Return only a mac bash command to take a screenshot. Output raw string only, no markdown.",
      },
    ],
  }),
});

const data = await response.json();
const cmd = data.choices[0].message.content;

console.log(`> Running: ${cmd}`);
await Bun.$`sh -c ${cmd}`;

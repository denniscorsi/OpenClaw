const messages: { role: string; content: string }[] = [
  { role: "system", content: "Return only mac bash commands. No backticks. Output raw string only." },
];

for await (const line of console) {
  messages.push({ role: "user", content: line });

  while (true) {
    const data = await (
      await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` },
        body: JSON.stringify({ model: "openrouter/free", reasoning: { exclude: true }, messages }),
      })
    ).json();

    const message = data.choices[0].message;
    messages.push(message);

    try {
      await Bun.$`sh -c ${message.content}`;
      console.log("✓", message.content);
      break;
    } catch (error: any) {
      messages.push({ role: "user", content: `Command failed: ${error.message}` });
      console.log(`✗ Failed: ${message.content}. Retrying...`);
    }
  }
}

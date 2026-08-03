import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const chatResponse = async (req, res) => {
  try {
    const { message } = req.body;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are an AI Travel Assistant.

You help users with:
- Hotel booking
- Cab booking
- Bike rental
- Emergency SOS
- Travel planning
- Tourist attractions
- Budget travel
- Safety tips

Give short, friendly and helpful answers.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply = completion.choices[0].message.content;

    res.json({
      reply,
    });
  } catch (error) {
    console.error("Groq Error:", error);

    res.status(500).json({
      reply: "Sorry, AI assistant is unavailable right now.",
    });
  }
};

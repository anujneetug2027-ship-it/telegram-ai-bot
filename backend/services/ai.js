import axios from "axios";

const client = axios.create({
  baseURL: "https://openrouter.ai/api/v1",
  headers: {
    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "HTTP-Referer": process.env.SITE_URL, // optional but recommended
    "X-Title": process.env.SITE_NAME,     // optional
    "Content-Type": "application/json"
  },
  timeout: 30000
});

export async function getAIReply(userText) {
  const res = await client.post("/chat/completions", {
    model: "meta-llama/llama-4-maverick:free",
    messages: [
      { role: "system", content: "You are a helpful, concise assistant." },
      { role: "user", content: userText }
    ]
  });

  return res.data?.choices?.[0]?.message?.content || "Sorry, I couldn't reply.";
}

import axios from "axios";

export async function getAIReply(userText) {
  const res = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "meta-llama/llama-4-maverick:free",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: userText }
      ]
    },
    {
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.SITE_URL,
        "X-Title": process.env.SITE_NAME,
        "Content-Type": "application/json"
      }
    }
  );

  return res.data.choices[0].message.content;
}

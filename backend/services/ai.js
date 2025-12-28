import axios from "axios";

export async function getAIReply(userText) {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3.3-70b-instruct:free",
        messages: [
          {
            role: "system",
            content: "You are a helpful, concise AI assistant."
          },
          {
            role: "user",
            content: userText
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.SITE_URL || "https://example.com",
          "X-Title": process.env.SITE_NAME || "Telegram AI Bot"
        },
        timeout: 30000
      }
    );

    return response.data.choices[0].message.content;

  } catch (err) {
    console.error(
      "OpenRouter error:",
      err.response?.status,
      err.response?.data || err.message
    );
    return "⚠️ AI service is temporarily unavailable.";
  }
}

import { GoogleGenAI } from "@google/genai";

// Reads GEMINI_API_KEY automatically from env
const ai = new GoogleGenAI({});

export async function askAI(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    return response.text;
  } catch (error) {
    console.error("Gemini AI error:", error);
    return "⚠️ AI service is temporarily unavailable.";
  }
}

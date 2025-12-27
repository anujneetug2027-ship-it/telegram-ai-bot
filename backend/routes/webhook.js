import express from "express";
import axios from "axios";
import TelegramUser from "../models/User.js";
import { getAIReply } from "../services/ai.js";

const router = express.Router();

const TG_API = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`;

router.post("/", async (req, res) => {
  try {
    const message = req.body?.message;
    if (!message?.text) return res.sendStatus(200);

    const chatId = message.chat.id;
    const telegramId = String(message.from.id);
    const text = message.text.trim();

    // Find or create user
    let user = await TelegramUser.findOne({ telegramId });
    if (!user) {
      user = await TelegramUser.create({ telegramId });
    }

    // If user has no name yet → save first reply as name
    if (!user.name && text !== "/start") {
      user.name = text;
      await user.save();

      await axios.post(`${TG_API}/sendMessage`, {
        chat_id: chatId,
        text: `Nice to meet you, ${user.name} 😊`
      });

      return res.sendStatus(200);
    }

    // /start command
    if (text === "/start") {
      if (!user.name) {
        await axios.post(`${TG_API}/sendMessage`, {
          chat_id: chatId,
          text: "Hi 👋 I am a chatbot.\nHow may I call you?"
        });
      } else {
        await axios.post(`${TG_API}/sendMessage`, {
          chat_id: chatId,
          text: `Welcome back, ${user.name} 👋`
        });
      }
      return res.sendStatus(200);
    }

    // Build AI context (THIS IS THE KEY PART)
    let userContext;

    if (!user.name) {
      userContext = `
The user has not provided their name yet.
At the end of your reply, politely ask:
"By the way, how may I call you?"
`;
    } else {
      userContext = `
The user's name is ${user.name}.
Greet the user naturally using their name.
`;
    }

    // Get AI reply
    const aiReply = await getAIReply(text, userContext);

    await axios.post(`${TG_API}/sendMessage`, {
      chat_id: chatId,
      text: aiReply
    });

    return res.sendStatus(200);

  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.sendStatus(200);
  }
});

export default router;

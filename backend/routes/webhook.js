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

    // 1️⃣ Find or create user
    let user = await TelegramUser.findOne({ telegramId });

    if (!user) {
      user = await TelegramUser.create({
        telegramId,
        isWaitingForName: true
      });

      await axios.post(`${TG_API}/sendMessage`, {
        chat_id: chatId,
        text: "Hi 👋 I am a chatbot.\nHow may I call you?"
      });

      return res.sendStatus(200);
    }

    // 2️⃣ If bot is waiting for name
    if (user.isWaitingForName) {
      // basic name validation
      if (text.length < 2 || text.length > 30) {
        await axios.post(`${TG_API}/sendMessage`, {
          chat_id: chatId,
          text: "Please tell me a valid name 🙂"
        });
        return res.sendStatus(200);
      }

      user.name = text;
      user.isWaitingForName = false;
      await user.save();

      await axios.post(`${TG_API}/sendMessage`, {
        chat_id: chatId,
        text: `Nice to meet you, ${user.name} 😊`
      });

      return res.sendStatus(200);
    }

    // 3️⃣ /start for existing users
    if (text === "/start") {
      await axios.post(`${TG_API}/sendMessage`, {
        chat_id: chatId,
        text: `Welcome back, ${user.name} 👋`
      });
      return res.sendStatus(200);
    }

    // 4️⃣ Normal AI chat
    const userContext = `
The user's name is ${user.name}.
Greet the user naturally using their name.
`;

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

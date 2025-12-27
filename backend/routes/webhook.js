import express from "express";
import axios from "axios";
import User from "../models/User.js";
import { getAIReply } from "../services/ai.js";

const router = express.Router();

const TG_API = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`;

router.post("/", async (req, res) => {
  try {
    const message = req.body?.message;
    if (!message?.text) return res.sendStatus(200);

    const chatId = message.chat.id;
    const text = message.text.trim();
    const telegramId = String(message.from.id);

    // Save user (ID only)
    await User.findOneAndUpdate(
      { telegramId },
      {},
      { upsert: true, setDefaultsOnInsert: true }
    );

    // Commands
    if (text === "/start") {
      await axios.post(`${TG_API}/sendMessage`, {
        chat_id: chatId,
        text: "👋 Hi! Send me any message and I’ll reply with AI."
      });
      return res.sendStatus(200);
    }

    // Typing indicator
    await axios.post(`${TG_API}/sendChatAction`, {
      chat_id: chatId,
      action: "typing"
    });

    // AI reply
    const reply = await getAIReply(text);

    await axios.post(`${TG_API}/sendMessage`, {
      chat_id: chatId,
      text: reply
    });

    return res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.sendStatus(200);
  }
});

export default router;

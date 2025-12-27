
import express from "express";
import axios from "axios";
import User from "../models/user.js";
import { askAI } from "../services/ai.js";

const router = express.Router();
const TELEGRAM_API = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`;

router.post("/", async (req, res) => {
  const msg = req.body.message;
  if (!msg || !msg.text) return res.sendStatus(200);

  const chatId = msg.chat.id.toString();
  const text = msg.text.trim();

  let user = await User.findOne({ telegramId: chatId });

  // New user → ask name
  if (!user) {
    await User.create({ telegramId: chatId });
    await sendMessage(chatId, "👋 Hi! What should I call you?");
    return res.sendStatus(200);
  }

  // Name not saved yet
  if (!user.name) {
    user.name = text;
    await user.save();
    await sendMessage(chatId, `Nice to meet you, ${user.name} 😊`);
    return res.sendStatus(200);
  }

  // Normal AI chat
  const reply = await askAI(
    `The user's name is ${user.name}. Reply politely.\nUser: ${text}`
  );

  await sendMessage(chatId, reply);
  res.sendStatus(200);
});

async function sendMessage(chatId, text) {
  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: chatId,
    text
  });
}

export default router;

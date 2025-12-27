# telegram-ai-bot
Backend
# Telegram AI Bot (OpenRouter + Llama-4)

## Features
- Telegram webhook bot
- AI replies via OpenRouter (Llama-4 Maverick free)
- MongoDB stores only unique Telegram user IDs
- Ready for Render deployment

## Setup
1. Clone repo
2. `npm install`
3. Create `.env` (see example)
4. `npm start`

## Deploy (Render)
- Create Web Service
- Build: `npm install`
- Start: `npm start`
- Add env vars

## Set Webhook
https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=https://YOUR_RENDER_URL/webhook

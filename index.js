// ============================================
// ربات تلگرام روی Cloudflare Workers
// ============================================

export default {
  async fetch(request, env, ctx) {
    // فقط درخواست‌های POST از تلگرام رو قبول کن
    if (request.method !== "POST") {
      return new Response("Bot is running ✅", { status: 200 });
    }

    try {
      const update = await request.json();
      const BOT_TOKEN = env.BOT_TOKEN;

      if (!BOT_TOKEN) {
        return new Response("BOT_TOKEN not set", { status: 500 });
      }

      // هندل کردن پیام‌ها
      if (update.message) {
        const chatId = update.message.chat.id;
        const text = update.message.text || "";
        const userName = update.message.from.first_name || "دوست عزیز";

        if (text.startsWith("/start")) {
          await sendMessage(
            BOT_TOKEN,
            chatId,
            `سلام ${userName}! 👋\n\n` +
            `به ربات من خوش اومدی.\n` +
            `دستور /help رو بزن تا راهنما رو ببینی.`
          );
        } else if (text.startsWith("/help")) {
          await sendMessage(
            BOT_TOKEN,
            chatId,
            `📋 دستورات موجود:\n\n` +
            `/start - شروع کار با ربات\n` +
            `/help - نمایش این راهنما\n` +
            `/points - مشاهده امتیاز (به‌زودی)`
          );
        } else {
          await sendMessage(
            BOT_TOKEN,
            chatId,
            `متوجه نشدم 🤔\nدستور /help رو بزن.`
          );
        }
      }

      return new Response("OK", { status: 200 });
    } catch (error) {
      console.error("Error:", error);
      return new Response("Error", { status: 500 });
    }
  }
};

// ============================================
// تابع ارسال پیام به تلگرام
// ============================================
async function sendMessage(token, chatId, text) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text
    })
  });
}

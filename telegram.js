const TelegramBot = require("node-telegram-bot-api");
const Promise = require("bluebird");
Promise.config({
  cancellation: true
});

// replace the value below with the Telegram token you receive from @BotFather
const token = "826898658:AAHqMbj9GYSNNvSoh1jRsBIA9Q99mX7feKM";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  // bot.sendMessage(chatId, resp);
  bot.sendMessage(msg.chat.id, "Vui lòng chọn danh mục?", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Development",
            callback_data: "development"
          },
          {
            text: "Music",
            callback_data: "music"
          },
          {
            text: "Cute monkeys",
            callback_data: "cute-monkeys"
          }
        ]
      ]
    }
  });
});

bot.onText(/\/redis (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"
  bot.sendMessage(chatId, "msg");
});

bot.on("callback_query", callbackQuery => {
  const message = callbackQuery.message;
  console.log("TCL: callbackQuery", callbackQuery);
  bot.sendMessage(message.chat.id, "Bạn đã chọn " + callbackQuery.data);
});
// Listen for any kind of message. There are different kinds of
// messages.
bot.on("message", msg => {
  bot.onText(/\/redis (.+)/, (msg, match) => {
    console.log("TCL: msg", msg);
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message
    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"
    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, "msg");
  });
  const chatId = msg.chat.id;
  const username = msg.from.first_name;
  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, "Hello: " + username);
});

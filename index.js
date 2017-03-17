require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');
const uuid = require('uuid/v4');
const sleeboard = require('./sleeboard.js');

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.AMHARIC_BOT_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

bot.getMe().then(function(err, result){
  console.log(err, result)
  })
// Matches "/echo [whatever]"
bot.onText(/\/help/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, 'inside any chat just type @AmharicBot mukera');
});


bot.on("inline_query", (query) => {
  var searchTerm = query.query.trim();
  var answer = sleeboard.getAmharic(searchTerm)
  var result = answer.map(item => {
      if(item.result.length > 52){
        
      }
      return {
        type: "article",
        id: uuid(),
        title: item.result,
        description: searchTerm + item.chars,
        input_message_content: {
          message_text: item.result
        }
      }
    }) 
  bot.answerInlineQuery(query.id, result);
});
bot.on('polling_error', (error) => {
  console.log(error.code); 
});

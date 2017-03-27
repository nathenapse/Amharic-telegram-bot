require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');
const uuid = require('uuid/v4');
const sleeboard = require('./sleeboard.js');
const pg = require('pg');
var config = {
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  max: process.env.PGPOOL,
  idleTimeoutMillis: process.env.PGTIMEOUT,
};

var pool = new pg.Pool(config);

//this initializes a connection pool
//it will keep idle connections open for a 30 seconds
//and set a limit of maximum 10 idle clients

// to run a query we can acquire a client from the pool,
// run a query on the client, and then return the client to the pool
// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.AMHARIC_BOT_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

bot.getMe().then(function(err, result){
  console.log(err, result)
})

// Add a data collection command
bot.onText(/\/collect/, (msg, match) => {
  
  pool.connect(function(err, client, done) {
    if(err) {
      return
    }
    client.query('INSERT INTO users (id, collect) VALUES ($1, $2);', [msg.chat.id, true], function(err, result) {
      done(err);

      if(err) {
        return;
      }
    });
  });
  bot.sendMessage(msg.chat.id, 'Thank you for allowing @AmharicBot to collect your data. Your Privacy is our Priority.');
});

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
  var chatId = query.from.id;
  var answer = sleeboard.getAmharic(searchTerm)
  var term = searchTerm;

  // Check Telegram text display limit for description to that the user looks at what they are typeing
  // not the starting text 
  if(searchTerm.length > 90){
    term = ".."+ searchTerm.slice(-90);
  }

  var result = answer.map(item => {
      var itemResult = item.result;
      // Check Telegram text display limit for title to that the user looks at what they are typeing
      // not the starting text 
      if(item.result.length > 48){
        itemResult = ".."+item.result.slice(-52);
      }
      // Check Telegram inline bot return limit
      if(item.result.length > 256) {
        itemResult = "!!! CHARACTER LIMIT EXCEEDED !!!"
      }

      return {
        type: "article",
        id: uuid(),
        title: itemResult,
        description: term + item.chars,
        input_message_content: {
          message_text: item.result
        }
      }
    }) 

  pool.connect(function(err, client, done) {
    if(err) {
      return;
    }
    // Add user to the list of users how use our bot
    client.query('INSERT INTO users VALUES ($1::int);', [query.from.id], function(err, result) {
      // Check if the user is a contributor if so add users userid to the data
      client.query('SELECT id FROM users WHERE id=$1 AND collect=$2;', [chatId, true], (err, result) => {

        var user = '';
        // user found add it to the data collection
        if(result && result.rows.length > 0 && result.rows[0].id){
          user = result.rows[0].id
        }
        // add the query the user sent and the answer they got to the data.
        client.query('INSERT INTO data ("user", "query", "options") VALUES ($1::int,$2,$3);', [user, searchTerm, answer[0]], (err, result) => {
          done(err);
          if(err) {
            return;
          }
        });
      });
    });
  });


  bot.answerInlineQuery(query.id, result);
});

bot.on('polling_error', (error) => {
  console.log(error.code); 
});

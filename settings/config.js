require("dotenv").config();

module.exports = {
    PREFIX: process.env.PREFIX || "!", // the prefix for your bot
    OWNER: process.env.OWNER || "nanotect_", // the owner of the bot
    
    CHANNEL: process.env.CHANNEL || ["nanotect_"], // the channel you want to join
    USERNAME: process.env.USERNAME || "YOUR_USERNAME", // the username of your bot
    OAUTH: process.env.OAUTH || "YOUR_OAUTH", // the oauth of your bot

    MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/harmony", // the mongo uri
    YOUTUBE_API: process.env.YOUTUBE_API || "YOUR_API_KEY", // the youtube api key
}
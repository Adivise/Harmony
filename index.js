const twitch = require("tmi.js");
const { Collection } = require("@discordjs/collection");
const config = require("./settings/config.js");

let options = {
  connection: {
    reconnect: true,
    secure: true
  },
  identity: {
    username: config.USERNAME,
    password: config.OAUTH,
  },
  channels: [config.CHANNEL],
};

console.log(`[INFO] Connecting to Twitch`);

process.on('unhandledRejection', error => console.log(error));
process.on('uncaughtException', error => console.log(error));

const client = new twitch.client(options);

client.config = require("./settings/config.js");
client.owner = config.OWNER;
client.ytapi = config.YOUTUBE_API;

["aliases", "commands"].forEach(x => client[x] = new Collection());
["loadDatabases", "loadMusics", "loadCommands", "loadEvents"].forEach(x => require(`./handlers/${x}`)(client));

client.connect();
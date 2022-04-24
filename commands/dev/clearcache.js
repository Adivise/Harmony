const fs = require("fs");

module.exports = {
    ownerOnly: true,
    config: {
        name: "clearcache",
        aliases: ["cc"],
    }, /// Delete all mp3 files from cache
    run: async (client, channel, tags, args) => {
        const files = fs.readdirSync("./cache/");
        for (const file of files) {
            fs.unlinkSync(`./cache/${file}`);
        }
        client.say(channel, `@${tags.username}, 🚮 Cache has been | Cleared!`);
    }
}
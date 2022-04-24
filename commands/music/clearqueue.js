const Database = require("../../settings/models/Track.js");

module.exports = {
    config: {
        name: "clearqueue",
        aliases: ["cq"],
    },
    run: async (client, channel, tags, args) => {
        /// Clear song in database, but only have last song
        const database = await Database.find({});
        if (database.length === 1) {
            return client.say(channel, `@${tags.username}, there is no song in queue!`);
        }
        
        for (let i = 1; i < database.length; i++) {
            database[i].remove();
        }
        client.say(channel, `@${tags.username}, 📝 Queue has been | Cleared!`);
    }
}
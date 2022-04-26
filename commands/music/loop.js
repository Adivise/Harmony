const Database = require("../../settings/models/Track.js");

module.exports = {
    ownerOnly: true,
    config: {
        name: "loop",
        aliases: ["repeat"],
    }, 
    run: async (client, channel, tags, args) => {
        const database = await Database.find({});

        if (database[0].loopable === true) {
            database[0].loopable = false;
            database[0].save();
            return client.say(channel, `@${tags.username}, 🔁 Loop has been | Disabled!`);
        } else {
            database[0].loopable = true;
            database[0].save();
            return client.say(channel, `@${tags.username}, 🔁 Loop has been | Enabled!`);
        } 
    }
}
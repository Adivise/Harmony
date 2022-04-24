const Database = require('../../settings/models/Track.js');

module.exports = {
    ownerOnly: true,
    config: {
        name: "cleardatabase",
        aliases: ["cd"],
    }, /// Use on bot bug request song!
    run: async (client, channel, tags, args) => {
        const database = await Database.find({});
        for (let i = 0; i < database.length; i++) {
            database[i].remove();
        }
        client.say(channel, `@${tags.username}, 📅 Database has been | Cleared!`);
    }
}
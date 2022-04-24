const Database = require("../../settings/models/Track.js");

module.exports = {
    config: {
        name: "stop",
    },
    run: async (client, channel, tags, args) => {
        const database = await Database.find({});
        if (database.length === 0) {
            return client.say(channel, `@${tags.username}, there is no song in queue!`);
        }
        for (let i = 0; i < database.length; i++) {
            database[i].remove();
        }

        await client.say(channel, `@${tags.username}, 🎵 Song has been | Stopped!`);

        await sleep(1500);
        process.kill(process.pid);
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
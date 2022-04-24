const Enable = require('../../settings/models/Enable.js');

module.exports = {
    ownerOnly: true,
    config: {
        name: "cmdenable",
        aliases: ["ce"],
    }, 
    run: async (client, channel, tags, args) => {
        const database = await Enable.find({});

        if (database[0].enabled === true) {
            database[0].enabled = false;
            database[0].save();
            return client.say(channel, `@${tags.username}, 🎁 Command has been | Disabled!`);
        } else {
            database[0].enabled = true;
            database[0].save();
            return client.say(channel, `@${tags.username}, 🎁 Commands has been | Enabled!`);
        } 
    }
}
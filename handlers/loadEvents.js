const { readdirSync } = require("fs")

module.exports = async (client, message) => {
    const load = dirs => {    
        const events = readdirSync(`./events/${dirs}/`).filter(d => d.endsWith('.js'));
        for (let file of events) {
            const evt = require(`../events/${dirs}/${file}`);
            let eName = file.split('.')[0];
            client.on(eName, evt.bind(null, client));
        }
    };
    ['client'].forEach(x => load(x));
    console.log(`[INFO] Loading events`);
};
const Database = require("../settings/models/Track.js");
const player = require('play-sound')(opts = {
	player: "cmdmp3",
});
const fs = require("fs");
const ytsr = require("youtube-sr").default;
const config = require("../settings/config.js");

module.exports = async (client) => {

    /// Function time remaining to next song
    client.nextSong = async function(time) {
        /// wait time
        await sleep(time);
        /// Delete first song
        await Database.deleteOne({});
        /// Get next song
        await client.playNext();
    }

    /// Function to play next song
    client.playNext = async function() {
        const song = await Database.find({});

        /// Check song return when no song
        if (song.length === 0) {
            console.log("[INFO] No songs in queue");
            client.say(config.CHANNEL, "No songs in queue");
            return;
        }

        /// Update first song
        await Database.updateOne({ playable: true });

        const url = song[0].url;

        const songInfo = await ytsr.searchOne(url);

        if (fs.existsSync(`./cache/${songInfo.id}.mp3`)) {
                client.nextSong(songInfo.duration);
                player.play(`./cache/${songInfo.id}.mp3`);

                client.say(config.CHANNEL, `Starting playing: ${songInfo.title} - ${songInfo.channel.name} [${songInfo.durationFormatted}] - Requested by: ${song[0].requester}`);
                return;
        }

        /// Get queue song
        await client.nextSong(songInfo.duration);
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
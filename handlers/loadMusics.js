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
        /// Wait time
        await sleep(time);
        /// Delete first song
        await Database.deleteOne({});
        /// Play next song
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

        const songInfo = await ytsr.getVideo(url);

        if (fs.existsSync(`./cache/${songInfo.id}.mp3`)) {
                /// Run handler nextSong
                client.nextSong(songInfo.duration);
                /// Play song
                player.play(`./cache/${songInfo.id}.mp3`);
                // Send msg to channel
                client.say(config.CHANNEL, `Starting playing: ${songInfo.title} - ${songInfo.channel.name} [${songInfo.durationFormatted}] - Requested by: @${song[0].requester}`);
                return;
        } else {
            /// When can't find mp3 = skipNext
            await client.skipNext();
        }
    }

    /// Function to skip when can't find mp3
    client.skipNext = async function() {
        await Database.deleteOne({});

        await client.playNext();
    }

    /// Function to skip song
    client.skipSong = async function() {
        await Database.deleteOne({});
    }

    await sleep(1500);
    await client.playNext();
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
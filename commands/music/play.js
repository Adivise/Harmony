const player = require('play-sound')(opts = {
	player: "cmdmp3",
});
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const YouTubeAPI = require("simple-youtube-api");
const ytsr = require("youtube-sr").default;
const fs = require("fs");
const Database = require("../../settings/models/Track.js");
const Enable = require("../../settings/models/Enable.js");

module.exports = {
    config: {
        name: "play",
        aliases: ["pplay", "p"],
    },
    run: async (client, channel, tags, args) => {
        // 
        const youtube = new YouTubeAPI(client.ytapi);
        /// Check if bot is enable command
        const enable = await Enable.find({});
        if (enable[0].enabled === false) {
            client.say(channel, `@${tags.username}, The command is Disabled! 🚫`);
            return;
        }

        const url = args[0]; // https://youtu.be/2pYaIr-4pfA
        if (!url) return client.say(channel, `@${tags.username}, Please provide a song to play!`);
     //   if (!url.includes("https://youtu.be/") && !url.includes("https://www.youtube.com/watch?v=")) return client.say(channel, `@${tags.username}, Please provide a youtube link!`);
        
        const videoPattern = /^(https?:\/\/)?(www\.)?(m\.|music\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
        const urlValid = videoPattern.test(args[0]);

        const search = args.join(" ");

        /// Limit song in queue per user
        const database = await Database.find({ user_id: tags.username }).countDocuments();
        if (database >= 5) {
            client.say(channel, `@${tags.username}, You have reached the limit of 5 songs in queue!`);
            return;
        }

        if (urlValid) {
            try {
                /// get the stream
                const dl = ytdl(url, {
                    filter: 'audioonly',
                    highWaterMark: 1 << 25,
                    
                });
        
                /// get the info
                const songInfo = await ytsr.getVideo(url);
                
                // Duration limit is 15 minutes
                if (songInfo.duration > 900000) {
                    client.say(channel, `Song duration is too long (max 15 minutes)`);
                    return;
                }
        
                const databased = new Database({
                    requester: tags.username,
                    song_data: songInfo,
                    playable: false,
                    url: url,
                });
        
                await databased.save();
        
                /// Already have file
                if (fs.existsSync(`./cache/${songInfo.id}.mp3`)) {
                    console.log(`[DEBUG] ${songInfo.id} already exists`);
                    /// Find database
                    const database = await Database.find({});
        
                    if (database[0].playable === true) { // True = Only Save the song in queue
                        console.log(`[DEBUG] Author: ${tags.username} Started, Queued Song: ${songInfo.title} - ${songInfo.channel.name} [${songInfo.durationFormatted}]`);
                        client.say(channel, `⏭ Queued: ${songInfo.title} - ${songInfo.channel.name} [${songInfo.durationFormatted}]`);
                        return;
                    } else { // False = Play the song
                        // nextSong
                        client.nextSong(songInfo.duration);
                        /// Find and play the file
                        player.play(`./cache/${songInfo.id}.mp3`);
                        /// Save database
                        database[0].playable = true;
                        database[0].save();
                        /// Send msg to channel
                        client.say(channel, `💿 Starting playing: ${songInfo.title} - ${songInfo.channel.name} [${songInfo.durationFormatted}] - Requested by: @${tags.username}`);
                    }
                } else { /// Download the file
                    client.say(channel, `Getting track | [${songInfo.title}] please wait...`);
                    console.log(`[DEBUG] Author: ${tags.username} Started, Queued Song: ${songInfo.title} - ${songInfo.channel.name} [${songInfo.durationFormatted}]`);
        
                    await ffmpeg(dl)
                        .audioBitrate(128)
                        .format('mp3')
                        .on('error', function(err) {
                            console.log('An error occurred: ' + err.message);
                        })
                        .on('end', async function() {
                            console.log('[INFO] Finished downloading');
                            const database = await Database.find({});
        
                            if (database[0].playable === true) { // True = Only Save the song in queue
                                client.say(channel, `⏭ Queued: ${songInfo.title} - ${songInfo.channel.name} [${songInfo.durationFormatted}]`);
                                return;
                            } else { // False = Play the song
                                // nextSong
                                client.nextSong(songInfo.duration);
                                /// Find and play the file
                                player.play(`./cache/${songInfo.id}.mp3`);
                                /// Save database
                                database[0].playable = true;
                                database[0].save();
                                /// Send msg to channel
                                client.say(channel, `💿 Starting playing: ${songInfo.title} - ${songInfo.channel.name} [${songInfo.durationFormatted}] - Requested by: @${tags.username}`);
                            }
                        })
                        .save(`./cache/${songInfo.id}.mp3`);
                    }
            } catch (error) {
                console.log(error);
                client.say(channel, `@${tags.username}, I can't find any results for that!`);
                return;
            }
        } else {
            try {
         //   console.log(search)
            const results = await youtube.searchVideos(search, 1, { part: "id" });

            if (!results.length) {
                client.say(channel, `@${tags.username}, I can't find any results for that!`);
                return;
            }
    
            /// get the stream
            const dl = ytdl(results[0].url, {
                filter: 'audioonly',
                highWaterMark: 1 << 25,
                
            });
    
            /// get the info
            const songInfo = await ytsr.getVideo(results[0].url);
            
            // Duration limit is 15 minutes
            if (songInfo.duration > 900000) {
                client.say(channel, `Song duration is too long (max 15 minutes)`);
                return;
            }
    
            const databased = new Database({
                requester: tags.username,
                song_data: songInfo,
                playable: false,
                url: results[0].url,
            });
    
            await databased.save();
    
            /// Already have file
            if (fs.existsSync(`./cache/${songInfo.id}.mp3`)) {
                console.log(`[DEBUG] ${songInfo.id} already exists`);
                /// Find database
                const database = await Database.find({});
    
                if (database[0].playable === true) { // True = Only Save the song in queue
                    console.log(`[DEBUG] Author: ${tags.username} Started, Queued Song: ${songInfo.title} - ${songInfo.channel.name} [${songInfo.durationFormatted}]`);
                    client.say(channel, `⏭ Queued: ${songInfo.title} - ${songInfo.channel.name} [${songInfo.durationFormatted}]`);
                    return;
                } else { // False = Play the song
                    // nextSong
                    client.nextSong(songInfo.duration);
                    /// Find and play the file
                    player.play(`./cache/${songInfo.id}.mp3`);
                    /// Save database
                    database[0].playable = true;
                    database[0].save();
                    /// Send msg to channel
                    client.say(channel, `💿 Starting playing: ${songInfo.title} - ${songInfo.channel.name} [${songInfo.durationFormatted}] - Requested by: @${tags.username}`);
                }
            } else { /// Download the file
                client.say(channel, `Getting track | [${songInfo.title}] please wait...`);
                console.log(`[DEBUG] Author: ${tags.username} Started, Queued Song: ${songInfo.title} - ${songInfo.channel.name} [${songInfo.durationFormatted}]`);
    
                await ffmpeg(dl)
                    .audioBitrate(128)
                    .format('mp3')
                    .on('error', function(err) {
                        console.log('An error occurred: ' + err.message);
                    })
                    .on('end', async function() {
                        console.log('[INFO] Finished downloading');
                        const database = await Database.find({});
    
                        if (database[0].playable === true) { // True = Only Save the song in queue
                            client.say(channel, `⏭ Queued: ${songInfo.title} - ${songInfo.channel.name} [${songInfo.durationFormatted}]`);
                            return;
                        } else { // False = Play the song
                            // nextSong
                            client.nextSong(songInfo.duration);
                            /// Find and play the file
                            player.play(`./cache/${songInfo.id}.mp3`);
                            /// Save database
                            database[0].playable = true;
                            database[0].save();
                            /// Send msg to channel
                            client.say(channel, `💿 Starting playing: ${songInfo.title} - ${songInfo.channel.name} [${songInfo.durationFormatted}] - Requested by: @${tags.username}`);
                        }
                    })
                    .save(`./cache/${songInfo.id}.mp3`);
                }
            } catch (error) {
                console.log(error);
                client.say(channel, `@${tags.username}, I can't find any results for that!`);
                return;
            }
        }
    }
}
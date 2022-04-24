const mongoose = require("mongoose");

const CreateTrack = new mongoose.Schema({
    requester: String,
    song_data: Array,
    url: String,
    playable: Boolean,
});

module.exports = mongoose.model("Tracks", CreateTrack);
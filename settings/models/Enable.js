const mongoose = require("mongoose");

const CreateEnable = new mongoose.Schema({
    enabled: Boolean,
});

module.exports = mongoose.model("Enable", CreateEnable);
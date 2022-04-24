const mongoose = require('mongoose');
const { MONGO_URI } = require('../settings/config.js');
const Database = require('../settings/models/Enable.js');

module.exports = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("[INFO] Connected to MongoDB!");

        const database = await Database.find({});
        if (database.length === 0) {
            const enable = new Database({
                enabled: true,
            });
            await enable.save();
        } else {
            //
        }

    } catch (error) {
        console.log(error);
    }
} 
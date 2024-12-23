const mongoose = require('mongoose');

const configurationSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    morning_rate: { type: Number, required: true },
    evening_rate: { type: Number, required: true },
    meter: {type:String, required:false, unique: true}
});

const Configuration = mongoose.model('Configuration', configurationSchema);

module.exports = Configuration;

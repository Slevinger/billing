const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: String,
    meter_number: { type: String, unique: true },
    discountPercentage: { type: Number },  // Discount percentage for this meter
    rates: {
        morningRate: { type: Number },  // Rate during the morning
        eveningRate: { type: Number },  // Rate during the evening
    },
});

module.exports = mongoose.model('Customer', customerSchema);

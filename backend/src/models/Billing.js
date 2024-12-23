const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
    meter_number: { type: String, required: true },
    date: { type: String, required: true },
    hour: { type: String, required: true },
    consumption: { type: Number, required: true },
    rateApplied: { type: Number, required: true },
    discountApplied: { type: Number, required: true },
    finalAmount: { type: Number, required: true },
    processedDate: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Billing', billingSchema);

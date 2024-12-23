const mongoose = require('mongoose');

const priceAdjustmentSchema = new mongoose.Schema({
    meter: { type: String, required: false },  // Optional: Specific meter
    discount: { type: Number, required: true }, // Discount percentage
    reason: {
        type: mongoose.Schema.Types.Mixed,  // Storing callback function logic
        required: true
    }
});

module.exports = mongoose.model('PriceAdjustment', priceAdjustmentSchema);

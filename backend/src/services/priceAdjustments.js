const PriceAdjustment = require('../models/PriceAdjustment'); // PriceAdjustment model

// Apply price adjustments to a row of invoice data (including customer discounts)
const applyPriceAdjustments = async (row, totalCostAfterCustomerDiscount) => {
    const { meter_number } = row;

    // Find applicable price adjustments (for all meters or specific meter)
    const applicableAdjustments = await PriceAdjustment.find({
        $or: [
            { meter: { $exists: false } }, // Apply to all meters
            { meter: meter_number }        // Apply to this specific meter
        ]
    });

    let discountApplied = 0;
    let finalAmount = totalCostAfterCustomerDiscount; // Start with the adjusted total cost after the customer discount

    // Loop through each applicable price adjustment
    for (const adjustment of applicableAdjustments) {
        // Check if the reason function evaluates to true for this row
        if (adjustment.reason(row)) {
            // Apply the discount from the price adjustment
            const discountAmount = (finalAmount * adjustment.discount) / 100;
            discountApplied += discountAmount;
            finalAmount -= discountAmount;

            console.log(`Applying ${adjustment.discount}% discount for meter: ${meter_number}`);
        }
    }

    // Update the row with the calculated discount and final amount
    row.discountApplied = discountApplied;
    row.finalAmount = finalAmount;

    return row; // Return the modified row
};

module.exports = { applyPriceAdjustments };

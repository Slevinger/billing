const moment = require('moment');

// Calculate billing data for each row
const calculateBilling = (row) => {
    const { meter_number, date, hour, consumption_kwh } = row;

    // Get rate based on time
    const rate = getRate(hour);
    const totalCost = consumption_kwh * rate;

    // Apply discount (example logic)
    const discount = totalCost * 0.1; // Example discount
    const finalAmount = totalCost - discount;

    // Return the billing entry
    return {
        meter_number: meter_number,
        date,
        hour,
        consumption: consumption_kwh,
        rateApplied: rate,
        discountApplied: discount,
        finalAmount,
        processedDate: new Date(),
    };
};

// Helper function to get rate based on the time of day
const getRate = (hour) => {
    const time = moment(hour, 'HH:mm').hour();
    return time >= 10 && time < 18 ? 0.1 : 0.2; // Morning rate is 0.1, evening is 0.2
};

module.exports = { calculateBilling };

const { parseInvoice } = require('../utils/csvParser');  // Import invoice parser
const File = require('../models/File');
const Billing = require('../models/Billing');
const Customer = require('../models/Customer');  // To get customer data (rates, discount)
const moment = require('moment');

const processFile = async (fileId) => {
    try {
        // Fetch the file from DB
        const file = await File.findById(fileId);

        // Ensure file content is in the expected format
        const fileContent = file.fileContent.toString('utf8');  // Convert buffer to string (if needed)

        // Parse the invoice content
        const data = parseInvoice(fileContent);  // Parsed data should be an array

        if (!Array.isArray(data)) {
            throw new Error('Parsed data is not iterable!');
        }

        const results = [];

        // Process each invoice row
        for (const row of data) {
            // Fetch customer by meter number
            const customer = await Customer.findOne({ meter_number: row.meter_number.trim() });

            if (!customer) {
                console.error(`Customer not found for meter number ${row.meter_number}`);
                continue; // Skip this row if customer is not found
            }

            // Get rate based on hour of the day
            const rate = getRate(row.hour, customer);

            // Apply the discount based on the customer (meter) discount
            const discount = (rate * row.consumptionKwh * (customer.discountPercentage||1)) / 100;
            const finalAmount = (rate * row.consumptionKwh) - discount;

            // Store the processed invoice data
            results.push({
                meter_number: row.meter_number,
                consumption: row.consumptionKwh,
                date: row.date,
                hour: row.hour,
                rateApplied: rate,
                discountApplied: discount,
                finalAmount: finalAmount,
            });
        }

        // Save processed data to the Billing collection
        await Billing.insertMany(results);  // Bulk insert for better performance

        // Update file status to 'Completed'
        await File.findByIdAndUpdate(fileId, { status: 'Completed' });
        console.log('File processed successfully.');
    } catch (error) {
        console.error('Error processing file:', error);
        await File.findByIdAndUpdate(fileId, { status: 'Failed' });
    }
};

// Helper function to get rate based on hour and customer (meter) details
const getRate = (hour, customer) => {
    const time = moment(hour, 'HH:mm').hour();

    // First, check if customer has a rate set
    if (customer && customer.rates) {
        // If customer has a rate, use that
        if (time >= 6 && time < 18) {
            return customer.rates.morningRate || process.env.DEFAULT_MORNING_RATE;
        } else {
            return customer.rates.eveningRate || process.env.DEFAULT_EVENING_RATE;
        }
    }

    // If no rate is set for the customer, fallback to default rates from environment variables
    console.log(`Using default rates for meter ${customer.meter_number} (Morning Rate: ${process.env.DEFAULT_MORNING_RATE}, Evening Rate: ${process.env.DEFAULT_EVENING_RATE})`);

    if (time >= 6 && time < 18) {
        return process.env.DEFAULT_MORNING_RATE;  // Default morning rate from environment variables
    } else {
        return process.env.DEFAULT_EVENING_RATE;  // Default evening rate from environment variables
    }
};

module.exports = { processFile };

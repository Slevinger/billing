const Customer = require('../models/Customer');
const Billing = require('../models/Billing');
const Papa = require('papaparse');

const moment = require('moment');

const processInvoices = async (invoices) => {
    try {
        for (const invoice of invoices) {
            console.log(`Processing invoice: ${invoice.fileName}`);

            // Parse the file content
            const parsedData = parseInvoice(invoice.fileContent);

            // Fetch the customer using meter_number
            const customer = await Customer.findOne({ meter_number: parsedData.meter_number });
            if (!customer) {
                console.error(`Customer not found for meter number: ${parsedData.meter_number}`);
                continue;
            }

            // Apply billing logic
            const isMorning = moment(`${parsedData.date} ${parsedData.hour}`, 'YYYY-MM-DD HH:mm').hour() >= 10;
            const rate = isMorning ? customer.rateMorning : customer.rateEvening;

            await Billing.create({
                meter_number: customer.meter_number,
                totalConsumption: parsedData.consumptionKwh,
                rateApplied: rate,
                discountApplied: (parsedData.consumptionKwh * rate * customer.discountPercentage) / 100,
                finalAmount: parsedData.consumptionKwh * rate,
            });

            console.log(`Completed processing invoice: ${invoice.fileName}`);
        }

        console.log('All invoices processed successfully.');
    } catch (error) {
        console.error('Error processing invoices:', error);
    }
};

// Actual invoice parser for CSV files
const parseInvoice = (fileContent) => {
    console.log('Parsing invoice content...');

    // Parse CSV content (assuming the content is a string in CSV format)
    const parsedData = Papa.parse(fileContent, {
        header: true, // Use the first row as column headers
        skipEmptyLines: true, // Skip empty lines
    });

    // Check for parsing errors
    if (parsedData.errors.length > 0) {
        console.error('Error parsing CSV:', parsedData.errors);
        throw new Error('Failed to parse CSV data');
    }

    // Assuming the CSV contains rows with meter_number, consumptionKwh, date, and hour
    const invoices = parsedData.data.map((row) => ({
        meter_number: row.meter_number,  // Column names from CSV
        consumptionKwh: parseFloat(row.consumptionKwh),  // Ensure the consumption is a number
        date: row.date,
        hour: row.hour,
    }));

    console.log('Parsed invoices:', invoices);

    return invoices;  // Return the array of parsed invoices
};

module.exports = { parseInvoice };


module.exports = processInvoices;

const Papa = require('papaparse');

// Actual invoice parser for CSV files
const parseInvoice = (fileContent) => {
    console.log('Parsing invoice content...');

    // Parse CSV content (assuming the content is a string in CSV format)
    const parsedData = Papa.parse(fileContent, {
        header: true, // Use the first row as column headers
        skipEmptyLines: true, // Skip empty lines
    });

    // Check if data is valid and iterable
    if (!Array.isArray(parsedData.data)) {
        console.error('Parsed data is not an array:', parsedData.data);
        throw new Error('Parsed data is not iterable!');
    }

    // Map the parsed data to the invoice format
    const invoices = parsedData.data.map((row) => ({
        meter_number: row.meter_number,
        consumptionKwh: parseFloat(row.consumption_kwh), // Ensure it's a number
        date: row.date,
        hour: row.hour,
    }));

    console.log('Parsed invoices:', invoices);

    return invoices; // Return the parsed invoices as an array
};

module.exports = { parseInvoice };

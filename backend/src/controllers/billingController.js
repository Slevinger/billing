const Billing = require('../models/Billing'); // Import the Billing model

// Fetch all billing entries
const getAllBilling = async (req, res, next) => {
    try {
        const billingEntries = await Billing.find(); // Fetch all billing data
        res.status(200).json(billingEntries);
    } catch (error) {
        next(error); // Pass error to the error handler middleware
    }
};

// Fetch billing entries by meter number
const getBillingBymeter_number = async (req, res, next) => {
    try {
        const { meter_number } = req.params;
        const billingEntries = await Billing.find({ meter_number }); // Find billing entries by meter number
        if (!billingEntries.length) {
            return res.status(404).json({ message: `No billing entries found for meter ${meter_number}` });
        }
        res.status(200).json(billingEntries);
    } catch (error) {
        next(error); // Pass error to the error handler middleware
    }
};

// Fetch billing entries within a date range
const getBillingByDateRange = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Please provide both startDate and endDate' });
        }

        const billingEntries = await Billing.find({
            processedDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
        });

        if (!billingEntries.length) {
            return res.status(404).json({ message: `No billing entries found for the specified date range` });
        }

        res.status(200).json(billingEntries);
    } catch (error) {
        next(error); // Pass error to the error handler middleware
    }
};

module.exports = {
    getAllBilling,
    getBillingBymeter_number,
    getBillingByDateRange,
};

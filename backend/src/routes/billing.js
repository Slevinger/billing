const express = require('express');
const { getAllBilling, getBillingBymeter_number, getBillingByDateRange } = require('../controllers/billingController'); // Import the billing controllers functions

const router = express.Router();

// Fetch all billing data
router.get('/', getAllBilling);

// Fetch billing data by meter number
router.get('/:meter_number', getBillingBymeter_number);

// Fetch billing data within a date range
router.get('/range', getBillingByDateRange);

module.exports = router;

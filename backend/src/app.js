const express = require('express');
const cors = require('cors');  // Enable Cross-Origin Resource Sharing
const bodyParser = require('body-parser');
const fileRoutes = require('./routes/files');  // Import file routes
const billingRoutes = require('./routes/billing');  // Import billing routes
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());  // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Setup Routes
app.use('/api/files', fileRoutes);
app.use('/api/billing', billingRoutes);

module.exports = app;

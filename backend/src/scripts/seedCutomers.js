const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Customer = require('../models/Customer');  // Import your Customer model

const MONGODB_URI = 'mongodb://localhost:27017/electricity-billing';  // Update as needed

const seedCustomersFromCSV = () => {
    const customers = [];

    // Read the CSV file
    fs.createReadStream('customers.csv')  // Ensure the path is correct
        .pipe(csv())  // Pipe the file content to csv-parser
        .on('data', (row) => {
            // Validate that the meter_number is not null or empty
            if (!row.meter_number || row.meter_number.trim() === '') {
                console.error('Skipping customer with invalid meter_number:', row);
                return;  // Skip this row if meter_number is invalid or empty
            }

            customers.push({
                customer_id: row.customer_id,
                name: row.name,
                meter_number: row.meter_number,  // Use the appropriate column name
                discount_percentage: parseFloat(row.discount_percentage),
                rates: {
                    morningRate: 0.10,  // Default morning rate if not in the CSV
                    eveningRate: 0.12,  // Default evening rate if not in the CSV
                },
            });
        })
        .on('end', async () => {
            console.log('CSV file processed successfully.');

            try {
                // Connect to MongoDB
                await mongoose.connect(MONGODB_URI, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                });

                console.log('Connected to MongoDB!');

                // Clear existing customers from the collection
                await Customer.deleteMany({});
                console.log('Existing customers cleared.');

                // Insert the parsed customer data into the database
                await Customer.insertMany(customers);
                console.log('Customers seeded successfully!');
            } catch (err) {
                console.error('Error inserting customers into MongoDB:', err.message);
            } finally {
                // Close the connection
                mongoose.connection.close();
            }
        })
        .on('error', (err) => {
            console.error('Error reading the CSV file:', err);
        });
};

// Execute the function to seed data
seedCustomersFromCSV();

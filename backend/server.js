const app = require('./src/app');  // Import Express app
const mongoose = require('mongoose');  // Import Mongoose for MongoDB

// MongoDB connection URI (adjust if needed)
const MONGODB_URI = 'mongodb://localhost:27017/electricity-billing';  // Local MongoDB URI

// Define the port
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        // Once MongoDB is connected, start the Express server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        // Handle MongoDB connection errors
        console.error('MongoDB connection error:', err);
    });

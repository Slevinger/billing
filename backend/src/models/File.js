const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    fileName: { type: String, required: true },
    contentType: { type: String, required: true },
    size: { type: Number, required: true },
    fileContent: { type: Buffer, required: true },  // Store the file directly in MongoDB
    status: { type: String, default: 'Processing' }, // Processing status: 'Processing', 'Completed', or 'Failed'
});

module.exports = mongoose.model('File', fileSchema);

const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    fileName: { type: String, required: true },
    contentType: { type: String, required: true },
    size: { type: Number, required: true },
    fileContent: { type: Buffer, required: true }, // Store the file directly in MongoDB
    uploadDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Invoice', invoiceSchema);

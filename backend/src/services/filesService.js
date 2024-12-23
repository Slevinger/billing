const File = require('../models/File'); // Import the File model

// Save file to MongoDB
const saveFileToDb = async (file) => {
    const fileDocument = new File({
        fileName: file.originalname,
        contentType: file.mimetype,
        size: file.size,
        fileContent: file.buffer,
        status: 'Processing', // Initially set the status to 'Processing'
    });

    return await fileDocument.save(); // Save the file to MongoDB
};

// Update processing status in DB (track the status of the file)
const updateProcessingStatus = async (fileId, status) => {
    await File.findByIdAndUpdate(fileId, { status, processedDate: new Date() });
};

module.exports = {
    saveFileToDb,
    updateProcessingStatus,
};

const express = require('express');
const multer = require('multer');
const { processFile } = require('../services/fileProcessor'); // Process the file after upload
const { saveFileToDb, updateProcessingStatus } = require('../services/filesService');

const router = express.Router();
const upload = multer(); // In-memory storage for files

router.get('/status/:fileId', async (req, res) => {
    try {
        const file = await File.findById(req.params.fileId);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }
        res.status(200).json(file);  // Return the file with its status
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving file status', error });
    }
});

// File upload route
router.post('/upload', upload.array('files'), async (req, res, next) => {
    try {
        const files = req.files;
        const responses = [];

        // Save files to DB and start processing asynchronously
        for (const file of files) {
            const storedFile = await saveFileToDb(file); // Save the file to MongoDB
            updateProcessingStatus(storedFile._id, 'Processing'); // Update status to 'Processing'
            responses.push(storedFile);

            // Process the file in the background
            processFile(storedFile._id); // Process the file asynchronously
        }

        res.status(200).json({ message: 'Files are being processed.' });
    } catch (error) {
        next(error);
    }
});

// Get the processing status of a file
router.get('/status/:fileId', async (req, res, next) => {
    try {
        const fileStatus = await File.findById(req.params.fileId);
        res.status(200).json(fileStatus);
    } catch (error) {
        next(error);
    }
});

module.exports = router;

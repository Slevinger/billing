import React, { useState } from 'react';
import axios from 'axios';
import FileStatus from './FileStatus'; // For displaying the status of uploaded files

const FileUpload = () => {
    const [files, setFiles] = useState(null);
    const [message, setMessage] = useState('');
    const [fileIds, setFileIds] = useState([]);

    // Handle file selection
    const handleFileSelection = (event) => {
        setFiles(event.target.files);
    };

    // Handle file upload
    const handleFileUpload = async () => {
        if (!files) {
            setMessage('Please select files to upload.');
            return;
        }

        const formData = new FormData();
        Array.from(files).forEach((file) => formData.append('files', file));

        setMessage('Uploading files...');

        try {
            const response = await axios.post('http://localhost:3000/api/files/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const data = response.data;
            setMessage(data.message);  // Show the response message
            setFileIds(data.files.map((file) => file._id));  // Store file IDs for status tracking
        } catch (error) {
            setMessage('Failed to upload files. Please try again.');
        }
    };

    return (
        <div>
            <h3>Upload Files</h3>
            <input type="file" multiple onChange={handleFileSelection} />
            <button onClick={handleFileUpload}>Upload Files</button>
            <p>{message}</p>

            {fileIds.length > 0 && (
                <div>
                    <h4>File Status</h4>
                    {fileIds.map((fileId) => (
                        <FileStatus key={fileId} fileId={fileId} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileUpload;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FileStatus = ({ fileId }) => {
    const [status, setStatus] = useState('Processing...');
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/files/status/${fileId}`);
                setStatus(response.data.status);
            } catch (error) {
                setError('Error fetching status.');
            }
        };

        const interval = setInterval(checkStatus, 3000); // Check every 3 seconds

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [fileId]);

    return (
        <div>
            <p>Status: {status}</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default FileStatus;

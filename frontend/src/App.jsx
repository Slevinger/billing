import React from 'react';
import FileUpload from './components/FileUpload';
import BillingData from './components/BillingData';

const App = () => {
    return (
        <div>
            <h1>Electricity Billing System</h1>
            <FileUpload /> {/* Upload files */}
            <BillingData meter_number="4444444444" /> {/* Display billing data for a specific meter */}
        </div>
    );
};

export default App;

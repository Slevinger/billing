import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BillingData = ({ meter_number }) => {
    const [billingData, setBillingData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBillingData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/billing/${meter_number}`);
                setBillingData(response.data);
            } catch (error) {
                setError('Failed to fetch billing data.');
            }
        };

        fetchBillingData();
    }, [meter_number]);

    return (
        <div>
            <h3>Billing Data for Meter: {meter_number}</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <table>
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Consumption (kWh)</th>
                    <th>Rate Applied</th>
                    <th>Discount Applied</th>
                    <th>Final Amount</th>
                </tr>
                </thead>
                <tbody>
                {billingData.map((entry) => (
                    <tr key={entry._id}>
                        <td>{entry.date}</td>
                        <td>{entry.consumption}</td>
                        <td>{entry.rateApplied}</td>
                        <td>{entry.discountApplied}</td>
                        <td>{entry.finalAmount}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default BillingData;

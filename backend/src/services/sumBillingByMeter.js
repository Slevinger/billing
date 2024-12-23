const sumBillingDataByMeter = async (meterNumber) => {
    try {
        const result = await Billing.aggregate([
            {
                // Match the documents where meterNumber matches the query parameter
                $match: {
                    meterNumber: meterNumber,  // Filter by meterNumber
                }
            },
            {
                // Group by meterNumber
                $group: {
                    _id: '$meterNumber',  // Group by meterNumber
                    totalAmount: { $sum: '$finalAmount' },  // Sum up the finalAmount for the meter
                    totalConsumption: { $sum: '$consumption' },  // Sum up the consumption for the meter
                }
            }
        ]);

        console.log('Aggregated Billing Data for Meter:', result);
        return result;
    } catch (err) {
        console.error('Error summing billing data by meter:', err);
        throw err;  // Rethrow error to handle in the route
    }
};
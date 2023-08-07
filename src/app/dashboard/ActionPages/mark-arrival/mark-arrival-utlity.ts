
/**
 * Retrieves loading sheet details for a specific trip and vehicle.
 * @param {number} companyCode - The company code.
 * @param {string} tripId - The ID of the trip.
 * @param {string} vehicleNo - The vehicle number.
 * @param {any} operationService - The operation service object for API calls.
 * @returns {Promise<any>} - A Promise resolving to the loading sheet details.
 */
export async function tripTransactionDetail(
    companyCode, tripId, operationService
) {
    const reqBody = {
        companyCode: companyCode,
        type: "operation",
        collection: "trip_transaction_history",
        query: {
            tripId: tripId
        }
    };
    try {
        const res = await operationService.operationPost("common/getOne", reqBody).toPromise();
        return res.data.db.data.trip_transaction_history;
    } catch (error) {
        console.error('Error occurred during the API call:', error);
    }
}

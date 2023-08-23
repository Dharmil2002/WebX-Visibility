/**
 * Retrieves loading sheet details for a specific trip and vehicle.
 * @param {number} companyCode - The company code.
 * @param {string} docketNo - ThedocketNo.
 * @param {any} operationService - The operation service object for API calls.
 * @returns {Promise<any>} - A Promise resolving to the loading sheet details.
 */
export async function getDocketFromApiDetail(
    companyCode,docketNo, operationService
) {
    const reqBody = {
        companyCode: companyCode,
        collectionName: "cnote_tracking",
        filter: {
            dktNo:docketNo
        }
    };
    try {
        const res = await operationService.operationMongoPost("generic/get", reqBody).toPromise();
        return res.data;
    } catch (error) {
        console.error('Error occurred during the API call:', error);
    }
}
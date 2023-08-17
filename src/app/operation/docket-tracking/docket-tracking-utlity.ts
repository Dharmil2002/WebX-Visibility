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
        type: "operation",
        collection: "cnote_trackingv4",
        query: {
            dktNo:docketNo
        }
    };
    try {
        const res = await operationService.operationPost("common/getOne", reqBody).toPromise();
        return res.data.db.data.cnote_trackingv4;
    } catch (error) {
        console.error('Error occurred during the API call:', error);
    }
}
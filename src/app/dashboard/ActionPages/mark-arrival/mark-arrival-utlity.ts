import { runningNumber } from "src/app/Utility/date/date-utils";

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
        collectionName: "trip_transaction_history",
        filter: {
            tripID: tripId
        }
    };
    try {
        const res = await operationService.operationMongoPost("generic/get", reqBody).toPromise();
        return res.data;
    } catch (error) {
        console.error('Error occurred during the API call:', error);
    }
}
/**
* Updates tracking information for a docket.
* @param {string} companyCode - The company code.
* @param {any} operationService - The operation service object for API calls.
* @param {Object} data - The data containing docket information.
* @returns {Promise<any>} - A Promise resolving to the API response.
*/
export async function updateTracking(companyCode, operationService, docketDetails) {
    try {
        const dockData = {
            tripId: docketDetails?.tripId || '',
            dktNo: docketDetails?.dktNo || '',
            vehNo: docketDetails?.vehNo || '',
            route: docketDetails?.route || '',
            event: "Vehicle Arrival at " + " " + localStorage.getItem('Branch'),
            orgn: docketDetails?.orgn || '',
            loc: localStorage.getItem('Branch') || '',
            dest: docketDetails?.dest || '',
            lsno: docketDetails?.lsno || '',
            mfno: docketDetails?.mfno || '',
            unload: false,
            dlSt: '',
            dlTm: '',
            evnCd: '',
            upBy: localStorage.getItem('Username') || '',
            upDt: new Date().toUTCString(),
        };

        const req = {
            companyCode: companyCode,
            collectionName: 'cnote_tracking',
            data: dockData
        };

        const res = await operationService.operationMongoPost('generic/create', req).toPromise();
        return res;
    } catch (error) {
        console.error('Error updating docket status:', error);
        return null;
    }
}

/**
 * Retrieves loading sheet details for a specific docket.
 * @param {string} companyCode - The company code.
 * @param {any} operationService - The operation service object for API calls.
 * @param {string} docketNo - The docket number.
 * @returns {Promise<any>} - A Promise resolving to the docket details.
 */
export async function getDocketFromApiDetail(companyCode, operationService, tripId) {
    const reqBody = {
        companyCode: companyCode,
        collectionName: 'cnote_tracking',
        filter: {
            tripId: tripId,
            unload:false
        }
    };

    try {
        const res = await operationService.operationMongoPost('generic/get', reqBody).toPromise();
        const docketDetails = res.data.filter((x) => x.unload === false);
        return docketDetails;
    } catch (error) {
        console.error('Error retrieving docket details:', error);
        throw error; // Rethrow the error for higher-level error handling if needed.
    }
}
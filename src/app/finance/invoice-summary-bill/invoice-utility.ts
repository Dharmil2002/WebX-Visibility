/**
 * Adds an invoice detail to the database.
 *
 * @param {object} masterService - The master service used to make API requests.
 * @param {object} data - The data representing the invoice detail to be added.
 * @returns {Promise} - A promise that resolves to the response from the API.
 */
export async function addInvoiceDetail(masterService, data) {
    try {
        // Prepare the request data
        const reqData = {
            companyCode: localStorage.getItem("companyCode"),
            collectionName: "invoiceDetail",
            data: data,
        };

        // Send a POST request to create the invoice detail
        const res = await masterService.masterPost("generic/create", reqData).toPromise();

        // Return the response
        return res;
    } catch (error) {
        // Handle any errors that occur during the request
        console.error("An error occurred while adding the invoice detail:", error);
        throw error; // Re-throw the error for handling at a higher level
    }
}
/**
* Adds an invoice detail to the database.
*
* @param {object} masterService - The master service used to make API requests.
* @param {object} data - The data representing the invoice detail to be added.
* @returns {Promise} - A promise that resolves to the response from the API.
*/
export async function UpdateDetail(masterService, data) {
    const prqIds = data.prqNo.split(', ');

    // Prepare the request data and store the promises in an array
    const updatePromises = prqIds.map(async (prqId) => {
        const req = {
            companyCode: localStorage.getItem("companyCode"),
            collectionName: "prq_detail",
            filter: {
                _id: prqId, // Use the current PRQ ID in the filter
            },
            update: {
                invoiceNo: data.invoiceNo, // Use the invoice number you want to update,
                status: "4"
            }
        };

        try {
            // Send a POST request to update the individual record
            return await masterService.masterPut("generic/update", req).toPromise();
        } catch (error) {
            console.error(`Error updating record with PRQ ID ${prqId}: ${error.message}`);
        }
    });

    try {
        // Wait for all the update operations to complete before returning
        const results = await Promise.all(updatePromises);
        return results;
    } catch (error) {
        console.error(`Error updating records: ${error.message}`);
    }
}




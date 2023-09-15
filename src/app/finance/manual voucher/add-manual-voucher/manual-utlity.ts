/**
 * Adds an invoice detail to the database.
 *
 * @param {object} masterService - The master service used to make API requests.
 * @param {object} data - The data representing the invoice detail to be added.
 * @returns {Promise} - A promise that resolves to the response from the API.
 */
export async function addVoucherDetail(masterService, data) {
    try {
        // Prepare the request data
        const reqData = {
            companyCode: localStorage.getItem("companyCode"),
            collectionName: "voucher_detail",
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

export async function updateVoucher(masterService,data) {
    const reqBody = {
        "companyCode": localStorage.getItem('companyCode'),
        "collectionName": "voucher_detail",
        "filter": { _id: data.voucherNo},
        "update": data
    }
    const res = await masterService.masterPut("generic/update", reqBody).toPromise();
    return res
}

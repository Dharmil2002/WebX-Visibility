const companyCode = localStorage.getItem("companyCode");
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
            companyCode: companyCode,
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
/* get customer Detail */
export async function getApiCustomerDetail(masterService, data) {
    const req = {
        companyCode: companyCode,
        collectionName: "customer_detail",
        filter: {
            "customerName": data.columnData?.billingparty || ""
        }
    };
    try {
        const resInvoice = await masterService.masterPost("generic/get", req).toPromise();
        return resInvoice;
    }
    catch (error) {
        console.error(`Error getting records: ${error.message}`);
    }
}
/*  end */

/* get customer Detail */
export async function getApiCompanyDetail(masterService) {
    const req = {
        companyCode: companyCode,
        collectionName: "company_master",
        filter: {
            "companyCode": companyCode
        }
    };
    try {
        const resCompany = await masterService.masterPost("generic/get", req).toPromise();
        return resCompany;
    }
    catch (error) {
        console.error(`Error getting records: ${error.message}`);
    }
}
/* end */

/*get location api Detail*/
export async function getLocationApiDetail(masterService) {

    const req = {
        companyCode: companyCode,
        collectionName: "location_detail"
        
    }
    try {
        const resLoc = await masterService.masterPost("generic/get", req).toPromise();
        return resLoc.data;
    }
    catch (error) {
        console.error(`Error getting records: ${error.message}`);
    }
}

/*End*/

/*get location api Detail*/
export async function getPrqApiDetail(masterService, billingParty) {
    const req = {
        companyCode: companyCode,
        collectionName: "prq_detail",
        filter: {
            "billingParty": billingParty
        }
    }
    try {
        const resPrq = await masterService.masterPost("generic/get", req).toPromise();
        return resPrq.data.filter((x) => !x.invoiceNo);
    }
    catch (error) {
        console.error(`Error getting records: ${error.message}`);
    }
}
/*End*/

/*Filtering the shipment invoice Data*/
export async function getInvoiceDetail(prqDetail,locDetail) {

    const newArray = prqDetail.map((element, index) => {
        // Filter locDetail based on element.prqBranch
        const matchingLocDetail = locDetail.find((x) => x.locCode === element.prqBranch);
    
        return {
            stateName: matchingLocDetail ? matchingLocDetail.locState : "",
            cnoteCount: index + 1,
            countSelected: 0,
            subTotalAmount: 0,
            gstCharged: 0,
            totalBillingAmount: element?.contractAmt || ""
        };
    });
    
    // Group the newArray by stateName
    const groupedByState = newArray.reduce((result, item) => {
        if (!result[item.stateName]) {
            result[item.stateName] = [];
        }
        result[item.stateName].push(item);
        return result;
    }, {});
    
    const result = Object.values(groupedByState).flatMap(arr => arr);
    return result;
   
}
/* End */


import { firstValueFrom } from "rxjs";

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
            "customerCode": data?.billingParty[0].split("-")[0].trim() || ""
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
        filter: {companyCode:companyCode}
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
        const resLoc:any = await firstValueFrom(masterService.masterPost("generic/get", req));
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
/*get location api Detail*/
export async function getThcDetail(masterService, billingParty) {
    const req = {
        companyCode: companyCode,
        collectionName: "trip_detail",
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
export async function getInvoiceDetail(locDetail, shipment) {
    // Create a map to store the state-wise invoice details
    const stateInvoiceMap = new Map();

    // Iterate through prqDetail
    for (const element of shipment) {
        // Find the matching location detail
        const matchingLocDetail = locDetail.find((loc) => loc.locCode === element.origin);

        let totalChargedWeight = 0;
        let totalgstAmount=0;
        let subTotalAmount=0;
        // Filter shipment for the current prqNo
        const prqWiseShipment = shipment.filter((shipmentItem) => shipmentItem.prqNo === element.prqNo);

        // Loop through prqWiseShipment and calculate totalChargedWeight
        for (const shipmentItem of prqWiseShipment) {
            totalgstAmount += parseFloat(shipmentItem.gstAmount);
            subTotalAmount += parseFloat(shipmentItem.totalAmount);
            for (const invoice of shipmentItem.invoiceDetails) {
                totalChargedWeight += parseFloat(invoice.chargedWeight);
              
            }
        }

        // Create or update the state-wise invoice details
        const stateName = matchingLocDetail ? matchingLocDetail.locState : "";
        if (!stateInvoiceMap.has(stateName)) {
            stateInvoiceMap.set(stateName, {
                stateName,
                cnoteCount: 1,
                countSelected: 0,
                subTotalAmount: subTotalAmount,
                gstCharged: totalgstAmount,
                totalBillingAmount: totalChargedWeight
            });
        } else {
            const stateInvoice = stateInvoiceMap.get(stateName);
            stateInvoice.cnoteCount += 1;
            stateInvoice.totalBillingAmount += totalChargedWeight;
        }
    }

    // Convert the map values to an array
    const result = Array.from(stateInvoiceMap.values());

    return result;
}

/* End */

export async function shipmentDetail(masterService) {
    const req = {
        companyCode: companyCode,
        collectionName: "docket_temp",
        filter: {}
    }
    try {
        const res = await masterService.masterPost("generic/get", req).toPromise();
        return res.data;
    }
    catch (error) {
        console.error(`Error getting records: ${error.message}`);
    }
}


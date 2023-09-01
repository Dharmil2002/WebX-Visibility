import { formatDate } from "src/app/Utility/date/date-utils";

export async function getGeneric(masterService, collectionName) {
    let req = {
        "companyCode": localStorage.getItem("companyCode"),
        "filter": {},
        "collectionName": collectionName
    }
    const res = await masterService.masterPost('generic/get', req).toPromise();
    return res.data
}
/**
 * Transforms an array of data into a mapped array following a specific structure.
 * @param {Array} data - The input array containing data to be transformed.
 * @returns {Array} - The transformed array with mapped values.
 */
export async function rakeFieldMapping(data,jobDetail) {
    // Check if the input data is an array
    if (!Array.isArray(data)) {
        return [];
    }

    // Create a new array by mapping each element in the input data array
    const rakeArray = data.map((element, index) => {
        // Extract entry date or use current date as default
        const entryDate = element?.entryDate || new Date();

        // Extract the first container detail or create an empty object
        const status = element.hasOwnProperty("status") ? element.status : '';
        const statusMessage =
            status === 0
                ? "Handed over to Liner"
                : status === 1
                    ? "Handed over to Billing Party"
                    : "Kept it at Current Location";
        // Construct and return the mapped object for the current element
        return {
            SlNo: index + 1,
            RakeNo: element?.rakeId || "",
            RakeEntryDate: formatDate(entryDate, 'dd/MM/yyyy HH:mm'),
            TrainName: element?.trainName || "",
            TrainNo: element?.trainNo || "",
            RRNo: element?.rrNo || "",
            ContainerNo: "",
            FromCity: element?.fromCity || "",
            ToCity: element?.toCity || "",
            IsEmpty: "",
            Weight: element.containorDetail.reduce((sum, detail) => sum + (detail.weight || 0), 0),
            BillingParty: element.containorDetail.map(detail => detail.billingParty) || "",
            CNNo: element.containorDetail
                .filter(detail => "CNNo" in detail)
                .map(detail => detail.CNNo),
            JobNo: element.containorDetail
                .filter(detail => "jobNo" in detail)
                .map(detail => detail.jobNo) || "",
            CurrentStatus: "Vehicle At "+localStorage.getItem("Branch"),
            Action:statusMessage
            
        };
    });

    // Return the final mapped array
    return rakeArray;
}


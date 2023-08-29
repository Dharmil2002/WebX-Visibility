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
export async function rakeFieldMapping(data) {
    // Check if the input data is an array
    if (!Array.isArray(data)) {
        return [];
    }

    // Create a new array by mapping each element in the input data array
    const rakeArray = data.map((element, index) => {
        // Extract entry date or use current date as default
        const entryDate = element?.entryDate || new Date();

        // Extract the first container detail or create an empty object
        const containerDetail = element?.containorDetail[0] || {};

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
            Weight: containerDetail.weight || "",
            BillingParty: containerDetail.billingParty || "",
            CNNo: "",
            JobNo: containerDetail.jobNo || "",
            CurrentStatus: ""
        };
    });

    // Return the final mapped array
    return rakeArray;
}


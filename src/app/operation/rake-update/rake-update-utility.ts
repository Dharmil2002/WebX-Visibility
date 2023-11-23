import { formatDate } from "src/app/Utility/date/date-utils";

export async function getGeneric(masterService, collectionName) {
    let req = {
        "companyCode": localStorage.getItem("companyCode"),
        "filter": {},
        "collectionName": collectionName
    }
    const res = await masterService.masterPost('generic/get', req).toPromise();
    const sortedData = res.data.sort((a, b) => {
        const dateA: Date | any = new Date(a.entryDate);
        const dateB: Date | any = new Date(b.entryDate);
  
        // Compare the date objects
        return dateB - dateA; // Sort in descending order
      });
    return sortedData
}
/**
 * Transforms an array of data into a mapped array following a specific structure.
 * @param {Array} data - The input array containing data to be transformed.
 * @returns {Array} - The transformed array with mapped values.
 */
export async function rakeFieldMapping(data) {
    
    // ... (previous code)

    const rakeArray = data.map((element, index) => {
        // Extract the first container detail or create an empty object
        const status = element.hasOwnProperty("status") ? element.status : '';
        const statusMessage =
            status === 0
                ? "Handover to Liner"
                : status === 1
                    ? "Handover to Billing Party"
                    : "Kept it at Current Location";
        const entryDate = element?.entryDate || new Date();
        const rrDate = element?.rrDate || new Date();
        // Extract the first container detail or create an empty object
        const uniqueCNNoSet = new Set();
        const uniqueJobNoSet = new Set();
        const uniqueBillingPartySet = new Set();

        // Filter and map unique CNNo, JobNo, and BillingParty values
        element.containorDetail.forEach(detail => {
            if ("cnNo" in detail && !uniqueCNNoSet.has(detail.cnNo.toLowerCase())) {
                uniqueCNNoSet.add(detail.cnNo);
            }

            if ("jobNo" in detail && !uniqueJobNoSet.has(detail.jobNo)) {
                uniqueJobNoSet.add(detail.jobNo);
            }

            if ("billingParty" in detail && !uniqueBillingPartySet.has(detail.billingParty)) {
                uniqueBillingPartySet.add(detail.billingParty);
            }
        });
        //   const jobCount=element.rakeDetails.find((x)=>x.)
         // Calculate the sum of contCnt
            let sumOfContCnt = element.containorDetail.reduce((sum, item) => sum + (item.contCnt || 0), 0);
        // Construct and return the mapped object for the current element
        return {
            SlNo: index + 1,
            RakeNo: element?.rakeId || "",
            RakeEntryDate: formatDate(entryDate, 'dd/MM/yyyy HH:mm'),
            oRakeEntryDate:entryDate,
            FNRNO: element?.fnrNo || "",
            RRDate: formatDate(rrDate, 'dd/MM/yyyy HH:mm'),
            RRNo: element?.rrNo || "",
            ContainerNo:sumOfContCnt,
            FromToCity: element.fromCity +"-"+element?.toCity,
            IsEmpty: "",
            containorDetail: element?.containorDetail||[],
            branch: element?.branch || "",
            Weight: element.containorDetail.reduce((sum, detail) => sum + (detail.weight || 0), 0),
            BillingParty: Array.from(uniqueBillingPartySet).length,
            CNNo: Array.from(uniqueCNNoSet).length, // Count of unique CNNo values
            JobNo: Array.from(uniqueJobNoSet).length, // Count of unique jobNo values
            CurrentStatus: "At " + localStorage.getItem("Branch"),
            actions: ["Diverted For Export","Delivered","Updated"]
        };
    });
    return rakeArray;
    // ... (remaining code)
}



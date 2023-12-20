import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";

export async function getJobregisterReportDetail(masterServices) {
    // Prepare the request body with company code and collection name
    const reqBody = {
        companyCode: localStorage.getItem('companyCode'),
        collectionName: "job_detail",
        filter: {}
    }
    
    // Fetch job details from the API for "job_detail" collection
    const res = await masterServices.masterMongoPost("generic/get", reqBody).toPromise();
    // Update collection name for additional data
    reqBody.collectionName = "cha_detail"
    // Fetch data for "cha_detail" collection
    const resChaEntry = await masterServices.masterMongoPost("generic/get", reqBody).toPromise();
    // Update collection name for another set of data
    reqBody.collectionName = "docket_temp"
    // Fetch data for "docket_temp" collection
    const resDocketTemp = await masterServices.masterMongoPost("generic/get", reqBody).toPromise();
    // Initialize an array to store modified job data
    let jobList = [];
    // Process each element in the response data
    res.data.map((element, index) => {

        // Find corresponding entry in "cha_detail" using job ID
        const chaDet = resChaEntry.data ? resChaEntry.data.find((entry) => entry.jobNo === element?.jobId) : null;

        // Find corresponding entry in "docket_temp" using job ID
        const docDet = resDocketTemp.data ? resDocketTemp.data.find((entry) => entry.jobNo === element?.jobId) : null;

        // Initialize variables for calculations and data extraction
        let totalCHAamt = 0;
        let containerNo = 0;

        // Calculate total amount from "cha_detail" if available
        if (chaDet) {
            totalCHAamt = chaDet.containorDetail.reduce((total, amt) => total + parseFloat(amt.totalAmt), 0);
        }

        // Extract container details from "docket_temp" if available
        if (docDet) {
            containerNo = docDet.containerDetail.map((num) => parseFloat(num.containerNumber), 0);
        }

        // Create a modified job data object
        let jobData = {
            "srNo": element.srNo = index + 1,
            "jobNo": element?.jobId || '',
            "jobDate": formatDocketDate(element?.jobDate || new Date()),
            "ojobDate": element?.jobDate || new Date(),
            "jobType": element?.jobType == "I" ? "Import" : element?.jobType == "E" ? "Export" : "",
            "billingParty": element?.billingParty || '',
            "pkgs": element?.noOfPkg || "",
            "vehicleSize": element?.vehicleSize || "",
            "transportedBy": element?.transportedBy || "",
            "status": element?.status === "0" ? "Awaiting CHA Entry" : element.status === "1" ? "Awaiting Rake Entry" : "Awaiting Advance Payment",
            "createdOn": formatDocketDate(element?.entryDate || new Date()),
            "entryDate": element?.entryDate || new Date(),
            "totalChaAmt": totalCHAamt,
            "Action": element?.status === "0" ? "CHA Entry" : element.status === "1" ? "Rake Entry" : "CHA Entry",
            "bookingFrom": element?.fromCity || "",
            "toCity": element?.toCity || "",
            "weight": element?.weight || "",
            "transportMode": element?.transportMode || "",
            "chargWt": element?.weight || "",
            "poNumber": element?.poNumber || "",
            "containerNumber": element?.nOOFCONT || 0,
            "totalNoofcontainer": element.blChallan ? element.blChallan.length : 0,
            "cNoteNumber": element.containorDetails && Array.isArray(element.containorDetails) && element.containorDetails.length > 0
                ? element.containorDetails.map(detail => detail.cnoteNo).join(',')
                : "",
            "cNoteDate": formatDocketDate(element.containorDetails && element.containorDetails.length > 0 ? element.containorDetails[0].dktDt : ""),
            "jobLocation": element?.jobLocation || "",
            "noof20ftStd": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "20 ft Standard") : 0,
            "noof40ftStd": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "40 ft Standard") : 0,
            "noof40ftHC": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "40 ft High Cube") : 0,
            "noof45ftHC": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "45 ft High Cube") : 0,
            "noof20ftRf": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "20 ft Reefer") : 0,
            "noof40ftRf": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "40 ft Reefer") : 0,
            "noof40ftHCR": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "40 ft High Cube Reefer") : 0,
            "noof20ftOT": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "20 ft Open Top") : 0,
            "noof40ftOT": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "40 ft Open Top") : 0,
            "noof20ftFR": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "20 ft Flat Rack") : 0,
            "noof40ftFR": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "40 ft Flat Rack") : 0,
            "noof20ftPf": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "20 ft Platform") : 0,
            "noof40ftPf": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "40 ft Platform") : 0,
            "noof20ftTk": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "20 ft Tank") : 0,
            "noof20ftSO": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "20 ft Side Open") : 0,
            "noof40ftSO": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "40 ft Side Open") : 0,
            "noof20ftI": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "20 ft Insulated") : 0,
            "noof20ftH": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "20 ft Hardtop") : 0,
            "noof40ftH": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "40 ft Hardtop") : 0,
            "noof20ftV": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "20 ft Ventilated") : 0,
            "noof20ftT": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "20 ft Tunnel") : 0,
            "noof40ftT": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "40 ft Tunnel") : 0,
            "noofBul": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "Bulktainers") : 0,
            "noofSB": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "Swap Bodies") : 0,
        }
        // Push the modified job data to the array
        jobList.push(jobData)
    });

    // Return the array of modified job data
    return jobList
}

function countContainers(blChallan, containerType) {
    return blChallan.reduce((count, item) => {
        // Check if the container type matches the specified type
        if (item.containerType === containerType) {
            return count + 1;
        }
        return count;
    }, 0);
}
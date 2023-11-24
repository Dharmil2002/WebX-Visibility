import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";

export async function getJobDetailFromApi(masterServices) {
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
        let totalNoofcontainer = 0;

        // Calculate total amount from "cha_detail" if available
        if (chaDet) {
            totalCHAamt = chaDet.containorDetail.reduce((total, amt) => total + parseFloat(amt.totalAmt), 0);
        }

        // Extract container details from "docket_temp" if available
        if (docDet) {
            containerNo = docDet.containerDetail.map((num) => parseFloat(num.containerNumber), 0);

            // Calculate the total number of unique container types
            const containerTypes = new Set(docDet.containerDetail.map((num) => num.containerType));
            totalNoofcontainer = containerTypes.size;
        }

        // Create a modified job data object
        let jobData = {
            "srNo": element.srNo = index + 1,
            "jobNo": element?.jobId || '',
            "jobDate": formatDocketDate(element?.jobDate || new Date()),
            "ojobDate": element?.jobDate || new Date(),
            "jobType": element?.jobType == "I" ? "Import" : element?.jobType == "E" ? "Export" : "",
            "billingParty": element?.billingParty || '',
             "fromToCity": element?.fromCity + "-" + element?.toCity,
             "jobLocation": element?.jobLocation || "",
            "pkgs": element?.noOfPkg || "",
            // "weight": element?.noOfPkg || "",
            "vehicleSize": element?.vehicleSize || "",
            "transportedBy": element?.transportedBy || "",
             "statusCode": element?.status || "",
            "createdOn": formatDocketDate(element?.entryDate || new Date()),
            "entryDate": element?.entryDate || new Date(),
            "totalChaAmt": totalCHAamt,
            //"chaDate": formatDocketDate(chaEntry?.entryDate || new Date()) || "",
            "bookingFrom": element?.fromCity || "",
            "toCity": element?.toCity || "",
            "weight": element?.weight || "",
            "transportMode": element?.transportMode || "",
            "chargWt": element?.weight || "",
            "poNumber": element?.poNumber || "",
            "containerNumber": containerNo,
            "totalNoofcontainer": totalNoofcontainer,
            // "cNoteNumber": element?.cnoteNo?.name || "",
            "cNoteNumber": element.containorDetails && element.containorDetails.length > 0 ? element.containorDetails[0].cnoteNo : "",
            "cNoteDate": element.containorDetails && element.containorDetails.length > 0 ? element.containorDetails[0].cnoteDate : "",
            // "cNoteDate": formatDocketDate(element?.cnoteNo?.cnoteDate || new Date()),
           // "jobLocation": element?.jobLocation || "",
            "status": element.status == "0"
                && (element.hasOwnProperty("containorDetails") && element.containorDetails.length < 1)
                ? "Update job"
                : element?.status == "0"
                    ? "Awaiting CHA Entry"
                    : element?.status == "1"
                        ? "Awaiting Rake Entry"
                        : "",
            "Action": element.hasOwnProperty("containorDetails") && element?.status === "0" && element.containorDetails.length < 1
                ? "Update"
                : element?.status === "0"
                    ? "CHA Entry"
                    : element?.status === "1"
                        ? "Rake Entry"
                        : "CHA Entry"
        }
        // Push the modified job data to the array
        jobList.push(jobData)
    });

    // Return the array of modified job data
    return jobList
}


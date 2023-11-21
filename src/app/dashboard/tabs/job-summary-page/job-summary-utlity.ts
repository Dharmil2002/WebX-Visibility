import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";

export async function getJobDetailFromApi(masterServices) {

    const reqBody = {
        companyCode: localStorage.getItem('companyCode'),
        collectionName: "job_detail",
        filter: {}
    }
    const res = await masterServices.masterMongoPost("generic/get", reqBody).toPromise();
    reqBody.collectionName = "cha_detail"
    const resChaEntry = await masterServices.masterMongoPost("generic/get", reqBody).toPromise();
    let jobList = [];

    res.data.map((element, index) => {
        // Check if resChaEntry.data exists, and if it does, find an entry where jobNo matches element?.jobId
        const chaEntry = resChaEntry.data
            ? resChaEntry.data.find((entry) => entry.jobNo === element?.jobId)
            : null;

        // Initialize totalCHAamt to 0
        let totalCHAamt = 0;

        // If a matching chaEntry was found, calculate the total amount
        if (chaEntry) {
            totalCHAamt = chaEntry.containorDetail.reduce((total, amt) => total + parseFloat(amt.totalAmt), 0);
        }

        // Now, totalCHAamt contains the calculated total amount or 0 if no match was found

        let jobData = {
            "srNo": element.srNo = index + 1,
            "jobNo": element?.jobId || '',
            "jobDate": formatDocketDate(element?.jobDate || new Date()),
            "jobType": element?.jobType == "I" ? "Import" : element?.jobType == "E" ? "Export" : "",
            "billingParty": element?.billingParty || '',
            "fromToCity": element?.fromCity + "-" + element?.toCity,
            "jobLocation": element?.jobLocation || "",
            "pkgs": element?.noOfPkg || "",
            "weight": element?.noOfPkg || "",
            "vehicleSize": element?.vehicleSize || "",
            "transportedBy": element?.transportedBy || "",
            "statusCode": element?.status || "",
            "status": element?.status === "0" ? "Awaiting CHA Entry" : element.status === "1" ? "Awaiting Rake Entry" : "Awaiting Advance Payment",
            "createdOn": formatDocketDate(element?.entryDate || new Date()),
            "entryDate": element?.entryDate || new Date(),
            "totalChaAmt": totalCHAamt,
            "chaDate":formatDocketDate(chaEntry?.entryDate || new Date())||"",
            "Action": element?.status === "0" ? "CHA Entry" : element.status === "1" ? "Rake Entry" : "CHA Entry"
        }
        jobList.push(jobData)
        // You need to return the modified element
    });

    return jobList
}


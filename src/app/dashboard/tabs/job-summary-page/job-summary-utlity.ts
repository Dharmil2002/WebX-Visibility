import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";

export async function getJobDetailFromApi(masterServices) {

    const reqBody = {
        companyCode: localStorage.getItem('companyCode'),
        collectionName: "job_detail",
        filter: {}
    }
    const res = await masterServices.masterMongoPost("generic/get", reqBody).toPromise();
    let jobList = [];
   
    res.data.map((element, index) => {
    
        let jobData = {
            "srNo": element.srNo = index + 1,
            "jobNo": element?.jobId || '',
            "jobDate": formatDocketDate(element?.jobDate || new Date()),
            "jobType": element?.jobType=="I"?"Import":element?.jobType=="E"?"Export":"",
            "billingParty": element?.billingParty || '',
            "fromToCity": element?.fromCity + "-" + element?.toCity,
            "jobLocation":element?.jobLocation||"",
            "pkgs":element?.noOfPkg||"",
            "weight":element?.noOfPkg||"",
            "vehicleSize":element?.vehicleSize||"",
            "transportedBy":element?.transportedBy||"",
            "status": element?.status === "0" ? "Awaiting CHA Entry" : element.status === "1" ? "Awaiting Rake Entry" : "Awaiting Advance Payment",
            "createdOn":formatDocketDate(element?.entryDate || new Date()),
            "entryDate":element?.entryDate || new Date(),
            "Action": element?.status === "0" ? "CHA Entry" : element.status === "1" ? "Rake Entry" : "Advance Payment"
        }
        jobList.push(jobData)
        // You need to return the modified element
    });

    return jobList
}


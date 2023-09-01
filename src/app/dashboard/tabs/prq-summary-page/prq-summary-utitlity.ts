import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";

export async function getPrqDetailFromApi(masterServices) {
    const reqBody = {
        companyCode: localStorage.getItem('companyCode'),
        collectionName: "prq_detail",
        filter: {}
    }
    const res = await masterServices.masterMongoPost("generic/get", reqBody).toPromise();
    let prqList = [];

    res.data.map((element, index) => {
        let pqrData = {
            "srNo": element.srNo = index + 1,
            "prqNo": element?.prqId || '',
            "vehicleSize": element?.vehicleSize || '',
            "billingParty": element?.billingParty || '',
            "fromToCity": element?.fromCity + "-" + element?.toCity,
            "fromCity":element?.fromCity||"",
            "contactNo": element?.contactNo || '',
            "toCity":element?.toCity||"",
            "transMode":element?.transMode||"",
            "vehicleNo":element?.vehicleNo||"",
            "prqBranch":element?.prqBranch||"",
            "pickUpDate": formatDocketDate(element?.pickUpTime || new Date()),
            "pickupDate":element?.pickUpTime|| new Date(),
            "status": element?.status === "0" ? "Awaiting Confirmation" : element.status === "1" ? "Awaiting Assign Vehicle" : "Awaiting For Docket",
            "Action": element?.status === "0" ? "Confirm" : element.status === "1" ? "Assign Vehicle" : "Create Docket"
        }
        prqList.push(pqrData)
        // You need to return the modified element
    });

    return prqList
}


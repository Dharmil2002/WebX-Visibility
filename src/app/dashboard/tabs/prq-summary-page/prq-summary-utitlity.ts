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
        let statusText;

        switch (element?.status) {
            case 0:
                statusText = "Confirmation";
                break;
            case 1:
            case 2:
                statusText = "Vehicle Assignment";
                break;
            default:
                statusText = "Rejection";
        }

        let pqrData = {
            "srNo": element.srNo = index + 1,
            "prqNo": element?.prqId || '',
            "vehicleSize": element?.vehicleSize || '',
            "billingParty": element?.billingParty || '',
            "fromToCity": element?.fromCity + "-" + element?.toCity,
            "pickUpDate": formatDocketDate(element?.pickupDate || new Date()),
            "status": element?.status === "0" ? "Confirmation" : element.status === "1" ? "Assign Vehicle" : "Awaiting For Docket",
            "Action": element?.status === "0" ? "Confirmation" : element.status === "1" ? "Assign Vehicle" : "Create Docket"
        }
        prqList.push(pqrData)
        // You need to return the modified element
    });

    return prqList
}


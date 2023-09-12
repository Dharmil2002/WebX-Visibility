import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";

export async function getPrqDetailFromApi(masterServices) {
    const reqBody = {
        companyCode: localStorage.getItem('companyCode'),
        collectionName: "prq_detail",
        filter: {}
    }
    const res = await masterServices.masterMongoPost("generic/get", reqBody).toPromise();
    const prqData = res.data.filter((x) => x.status.trim() !== "3")
    let prqList = [];

    prqData.map((element, index) => {
        let pqrData = {
            "srNo": element.srNo = index + 1,
            "prqNo": element?.prqId || '',
            "vehicleSize": element?.vehicleSize || '',
            "billingParty": element?.billingParty || '',
            "fromToCity": element?.fromCity + "-" + element?.toCity,
            "fromCity": element?.fromCity || "",
            "contactNo": element?.contactNo || '',
            "toCity": element?.toCity || "",
            "transMode": element?.transMode || "",
            "vehicleNo": element?.vehicleNo || "",
            "prqBranch": element?.prqBranch || "",
            "pickUpDate": formatDocketDate(element?.pickUpTime || new Date()),
            "pickupDate": element?.pickUpTime || new Date(),
            "status": element?.status === "0" ? "Awaiting Confirmation" : element.status === "1" ? "Awaiting Assign Vehicle" : "Awaiting For Docket",
            "actions": element?.status === "0" ? ["Confirm", "Reject", "Modify"] : element.status === "1" ? ["Assign Vehicle"] : ["Create Docket"],
            "createdDate": formatDocketDate(element?.entryDate || new Date())
        }
        prqList.push(pqrData)
        // You need to return the modified element
    });
    // Assuming 'res' is an array of objects with 'entryDate' property as string date format
    const sortedData = prqList.sort((a, b) => {
        const dateA: Date | any = new Date(a.pickupDate);
        const dateB: Date | any = new Date(b.pickupDate);

        // Compare the date objects
        return dateB - dateA; // Sort in descending order
    });


    return sortedData
}


import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";
export async function getPrqDetailFromApi(masterServices) {
    const branch = localStorage.getItem("Branch");
    const reqBody = {
        companyCode: localStorage.getItem('companyCode'),
        collectionName: "prq_detail",
        filter: {}
    }
    const res = await masterServices.masterMongoPost("generic/get", reqBody).toPromise();
    const prqData = res.data.filter((x) => x.status.trim() !== "4" && x.status.trim() !== "5" && x.prqBranch==branch)
    let prqList = [];

    prqData.map((element, index) => {
        let pqrData = {
            "srNo": element.srNo = index + 1,
            "prqNo": element?.prqNo || '',
            "vehicleSize": element?.vehicleSize||"",
            "size":element.vehicleSize?element.vehicleSize+" "+"MT" : element.containerSize?element.containerSize+" "+"MT":"",
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
            "status": element?.status === "0" ? "Awaiting Confirmation" : element.status === "1" ? "Awaiting Assign Vehicle" :element.status=="2"?"Awaiting For Docket":element.status=="3"?"Ready For THC":"THC Generated",
            "actions": element?.status === "0" ? ["Confirm", "Reject", "Modify"] : element.status === "1" ? ["Assign Vehicle"] :element.status=="2"?["Add Docket"]:element.status=="3"?["Add Docket","Create THC"]:[""],
            "containerSize":element?.containerSize||"",
            "typeContainer":element?.typeContainer||"",
            "pAddress":element?.pAddress||"",
            "payType":element?.payType||"",
            "contractAmt":element?.contractAmt||"",
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

    const prqDetail={
        tableData:sortedData,
        allPrqDetail:res.data

    }
    return prqDetail
}


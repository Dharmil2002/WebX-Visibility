import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";
import { calculateTotalField } from "../unbilled-prq/unbilled-utlity";
const branch=localStorage.getItem("Branch") 
export function renameKeys(originalObject, keyNameMapping) {
    const modifiedObject = {};

    for (const oldKey in originalObject) {
        if (originalObject.hasOwnProperty(oldKey)) {
            const newKey = keyNameMapping[oldKey] || oldKey;
            modifiedObject[newKey] = originalObject[oldKey];
        }
    }

    return modifiedObject;
}

export async function vendorDetailFromApi(masterService) {
    const reqBody = {
        companyCode: localStorage.getItem("companyCode"),
        collectionName: "vendor_detail",
        filter: {}
    }
    const res = await masterService.masterMongoPost("generic/get", reqBody).toPromise();
    const filteredData = res.data.filter(x => x.vendorLocation.includes(branch));
    return filteredData;

}
export async function addRakeEntry(data, masterService) {
    
    const reqBody = {
        companyCode: localStorage.getItem("companyCode"),
        collectionName: "rake_detail",
        data: data
    }
    const res = await masterService.masterMongoPost("generic/create", reqBody).toPromise();
    return res

}
export async function genericGet(masterService, collectionName) {
    let req = {
        "companyCode": localStorage.getItem("companyCode"),
        "filter": {},
        "collectionName": collectionName
    }

    const res = await masterService.masterPost('generic/get', req).toPromise();
    return res.data;
}

export async function filterDocketDetail(data) {
    
    let docketList = [];
    data.forEach(element => {
        const actualWeights = element.invoiceDetails.map((item) => calculateTotalField([item], 'actualWeight')).reduce((acc, weight) => acc + weight, 0);
        const noofPkts = element.invoiceDetails.map((item) => calculateTotalField([item], 'noofPkts')).reduce((acc, pkg) => acc + pkg, 0);
        let docketDetails = {
            cnNo: element?.docketNumber || "",
            cnDate: formatDocketDate(element?.docketDate || new Date()),
            docketDate: element?.docketDate||new Date(),
            noOfPkg: noofPkts || 0,
            weight: actualWeights || 0,
            fCity: element?.fromCity,
            tCity: element?.toCity,
            billingParty: element?.billingParty || "",
            containerDetail:element.hasOwnProperty("containerDetail")?element.containerDetail:['']
        }
        docketList.push(docketDetails);
    });
    return docketList
}
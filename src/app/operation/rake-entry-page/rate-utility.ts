import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";
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
        let docketDetails = {
            CNNo: element?.docketNumber || "",
            CNDate: formatDocketDate(element?.docketDate || new Date()),
            pkgs: element?.totalChargedNoOfpkg || 0,
            weight: element?.actualwt || 0,
            fromToCity: element?.fromCity + "-" + element?.toCity,
            billingParty: element?.billingParty || ""
        }
        docketList.push(docketDetails);
    });
    return docketList
}
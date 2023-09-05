import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";
import { geoDataServices } from "../error-handing/outbox-utility";

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
    return res.data

}
export async function addRakeEntry(data, masterService, retryAndDownloadService, geoLocationService) {

    const reqBody = {
        companyCode: localStorage.getItem("companyCode"),
        collectionName: "rake_detail",
        data: data
    }
    const maxRetries = 3;
    try {
        const getlocation = await geoDataServices(geoLocationService);
        const res = await retryAndDownloadService.retryWithDownload(
            masterService,
            "generic/1s",
            reqBody,
            maxRetries,
            "RakeEntry",
            getlocation
        );
        return res

    }
    catch (err) {
        console.log(err);
    }

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
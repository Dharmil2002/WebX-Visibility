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

export async function vendorDetailFromApi(masterService){
    const reqBody={
        companyCode:localStorage.getItem("companyCode"),
        collectionName:"vendor_detail",
        filter:{}
    }
    const res= await masterService.masterMongoPost("generic/get",reqBody).toPromise();
    return res.data

}
export async function addRakeEntry(data,masterService){
    const reqBody={
        companyCode:localStorage.getItem("companyCode"),
        collectionName:"rake_detail",
        data:data
    }
    const res= await masterService.masterMongoPost("generic/create",reqBody).toPromise();
    return res.data

}


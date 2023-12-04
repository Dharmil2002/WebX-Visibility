
export async function GetTHCListFromApi(masterService) {
    const reqBody = {
        companyCode: localStorage.getItem('companyCode'),
        collectionName: "thc_detail",
        filter: {}
    }
    try {
        const res = await masterService.masterMongoPost("generic/get", reqBody).toPromise();
        const result = res?.data;
        return result.sort((a, b) => a.vendorName.localeCompare(b.vendorName));

    } catch (error) {
        console.error("An error occurred:", error);
        return null;
    }
}






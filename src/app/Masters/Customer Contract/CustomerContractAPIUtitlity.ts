export async function customerFromApi(masterService) {
    const branch = localStorage.getItem("Branch");
    const reqBody = {
        companyCode: localStorage.getItem('companyCode'),
        collectionName: "customer_detail",
        filter: {}
    }
    try {
        const res = await masterService.masterMongoPost("generic/get", reqBody).toPromise();
        const result = res?.data.filter((x) => x.customerLocations.includes(branch)).map(x => ({ value: x.customerCode, name: x.customerName, pinCode: x.PinCode, mobile: x.customer_mobile })) ?? null;
        return result.sort((a, b) => a.name.localeCompare(b.name)); // Sort in ascending order by locCode;
    } catch (error) {
        console.error("An error occurred:", error);
        return null;
    }
}

export async function productdetailFromApi(masterService) {
    let req = {
        "companyCode": localStorage.getItem('companyCode'),
        "collectionName": "product_detail",
        "filter": {}
    }
    const res = await masterService.masterPost("generic/get", req).toPromise()
    if (res) {
        const data = res?.data
            .map(x => ({
                value: x.ProductID, name: x.ProductName
            }))
            .filter(x => x != null)
            .sort((a, b) => a.value.localeCompare(b.value));

        return data
    }
}

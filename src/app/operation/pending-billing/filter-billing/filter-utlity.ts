export async function stateFromApi(masterService) {
    const reqBody = {
        companyCode: localStorage.getItem('companyCode'),
        collectionName: "state_detail",
        filter:{}
    }
    try {
        const res = await masterService.masterMongoPost("generic/get",reqBody).toPromise();
        const filterMap = res?.data?.map(x => ({ value: x.stateCode, name: x.stateName, city: x.locCity })) ?? null;
        return filterMap.sort((a, b) => a.name.localeCompare(b.name)); // Sort in ascending order by locCode;
    } catch (error) {
        console.error("An error occurred:", error);
        return null;
    }
}

export async function customerFromApi(masterService) {
    const reqBody = {
        companyCode: localStorage.getItem('companyCode'),
        collectionName: "customer_detail",
        filter:{}
    }
    try {
        const res = await masterService.masterMongoPost("generic/get",reqBody).toPromise();
        const filterMap = res?.data?.map(x => ({ value: x.customerCode, name: x.customerName })) ?? null;
        return filterMap.sort((a, b) => a.name.localeCompare(b.name)); // Sort in ascending order by locCode;
    } catch (error) {
        console.error("An error occurred:", error);
        return null;
    }
}


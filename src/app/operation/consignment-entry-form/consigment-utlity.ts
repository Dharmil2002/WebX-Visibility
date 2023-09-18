export async function updatePrq(operationService, data) {
    const reqBody =
    {
        companyCode: localStorage.getItem("companyCode"),
        collectionName: "prq_detail",
        filter: {
            _id: data.prqId// Use the current PRQ ID in the filter
        },
        update: {
            status: "3"
        }
    }
    const res = await operationService.operationPut("generic/update", reqBody).toPromise();
    return res
}
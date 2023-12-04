
export async function GetTHCListFromApi(masterService) {
    const reqBody = {
        companyCode: localStorage.getItem('companyCode'),
        collectionName: "thc_detail",
        filter: {}
    }
    try {
        const res = await masterService.masterMongoPost("generic/get", reqBody).toPromise();
        //  const result = res?.data;
        const SortData = res?.data.sort((a, b) => a.vendorName.localeCompare(b.vendorName));
        const result = SortData.map((x, index) => ({
            SrNo: index + 1,
            Vendor: x.vendorName,
            THCamount: x.contAmt,
            AdvancePending: x.advAmt,
            BalanceUnbilled: x.balAmt

        })) ?? null;
        return result

    } catch (error) {
        console.error("An error occurred:", error);
        return null;
    }
}






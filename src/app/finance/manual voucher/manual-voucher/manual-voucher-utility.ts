
export async function manualvoucharDetail(masterService) {
    const req = {
        companyCode: localStorage.getItem('companyCode'),
        collectionName: "voucher_trans",
        filter: {}
    }
    const res = await masterService.masterPost("generic/get", req).toPromise();
    return res.data; // Filter items where invoiceNo is empty (falsy)
}

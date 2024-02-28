
export async function manualvoucharDetail(masterService) {
    const req = {
        companyCode: localStorage.getItem('companyCode'),
        collectionName: "voucher_trans",
        filter: { bRC: localStorage.getItem('Branch') }
    }
    if (localStorage.getItem('Branch') == 'HQTR') {
        delete req.filter.bRC;
    }
    const res = await masterService.masterPost("generic/get", req).toPromise();
    return res.data; // Filter items where invoiceNo is empty (falsy)
}

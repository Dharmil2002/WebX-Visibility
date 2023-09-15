
export async function manualvoucharDetail(masterService){
    const req={
        companyCode:localStorage.getItem('companyCode'),
        collectionName: "voucher_detail",
        filter: {}
    }
    const res =await masterService.masterPost("generic/get",req).toPromise();
    return res.data; // Filter items where invoiceNo is empty (falsy)
}

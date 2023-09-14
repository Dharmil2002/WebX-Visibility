export async function manualvoucharDetail(masterService){
    const res =await masterService.getJsonFileDetails("manualVoucher").toPromise();
    return res.data
}

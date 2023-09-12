export async function invoiceBilling(masterService){
    const res =await masterService.getJsonFileDetails("invoice").toPromise();
    return res.data
}

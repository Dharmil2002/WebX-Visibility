export async function pendingbilling(masterService){
    const res =await masterService.getJsonFileDetails("pending").toPromise();
    return res.data
}

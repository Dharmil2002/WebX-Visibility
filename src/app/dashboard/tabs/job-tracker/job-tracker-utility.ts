export async function jobtrackingDetail(masterService){
    const res =await masterService.getJsonFileDetails("jobtracker").toPromise();
    return res.data
}

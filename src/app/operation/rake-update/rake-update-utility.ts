export async function rakeUpdateDetail(masterService){
    const res =await masterService.getJsonFileDetails("rakeUpdate").toPromise();
    return res.data
}
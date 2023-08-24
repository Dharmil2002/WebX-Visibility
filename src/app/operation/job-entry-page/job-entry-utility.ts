export async function addJobDetail(jobDetail,masterService){
    const reqBody={
        companyCode:localStorage.getItem('companyCode'),
        collectionName:"job_detail",
        data:jobDetail
    }
    const res=await masterService.masterMongoPost("generic/create",reqBody).toPromise();
    return res
}
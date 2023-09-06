
export async function chaJobDetail(chaDetail,masterService){
    const reqBody={
        companyCode:localStorage.getItem('companyCode'),
        collectionName:"cha_detail",
        data:chaDetail
    }
    const res=await masterService.masterMongoPost("generic/create",reqBody).toPromise();
    return res
}

export async function updateJobStatus(jobData,masterService) {
    const reqBody = {
        "companyCode": localStorage.getItem('companyCode'),
        "collectionName": "job_detail",
        "filter": {jobId: jobData.jobNo},
        "update": {
          "status":"1",
        }
      }
      const res= await masterService.masterMongoPut("generic/update", reqBody).toPromise();
      return res
}


import { geoDataServices } from "../error-handing/outbox-utility";

export async function chaJobDetail(chaDetail,masterService,retryAndDownloadService,geoLocationService){
    const reqBody={
        companyCode:localStorage.getItem('companyCode'),
        collectionName:"cha_detaidl",
        data:chaDetail
    }
    const maxRetries = 3;
    try {
        const getlocation = await geoDataServices(geoLocationService);
        const res = await retryAndDownloadService.retryWithDownload(
            masterService,
            "generic/create",
            reqBody,
            maxRetries,
            "ChaEntry",
            getlocation
        );
        return res
    } catch (error) {

    }
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


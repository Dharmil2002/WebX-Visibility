import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { calculateTotalField } from "src/app/operation/unbilled-prq/unbilled-utlity";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class JobEntryService {
  exportType={
   export:[{name:"Container",value:"container"}],
   import:[{name:"Bulk",value:"Bulk"},{name:"LCL",value:"LCL"}]
  }
  constructor(
    private operation: OperationService
      ) { }
      async processShipmentListJob(shipmentList, orgBranch) {
        return shipmentList.map((x) => {
          if (x.origin === orgBranch || (x.destination==orgBranch && x.status=="2")) {
                const actualWeights = x.invoiceDetails.map((item) => calculateTotalField([item], 'actualWeight')).reduce((acc, weight) => acc + weight, 0);
                const noofPkts = x.invoiceDetails.map((item) => calculateTotalField([item], 'noofPkts')).reduce((acc, pkg) => acc + pkg, 0);
                x.cnoteNo = x.docketNumber;
                x.cnoteDate = formatDocketDate(x.docketDate || new Date());
                x.actualWeight = actualWeights;
                x.noOfpkg = noofPkts;
                x.ftCity = `${x.fromCity}-${x.toCity}`;
                x.invoiceAmount = x.totalAmount;
                x.loadedWeight=actualWeights;
                x.invoiceCount = x.invoiceDetails.length || 0;
                x.actions= ["Edit", "Remove"]
                return x;
            }
            return null;
        }).filter((x) => x !== null);
    }
      async getJobDetail(){
        const req = {
          "companyCode": localStorage.getItem("companyCode"),
          "filter": {},
          "collectionName": "job_detail"
      }

      const res = await this.operation.operationMongoPost('generic/get', req).toPromise();
      return res.data.filter((x)=>x.jobLocation == localStorage.getItem("Branch"));
      }
      async updateJob(data, status) {
        const reqBody = {
          companyCode: localStorage.getItem("companyCode"),
          collectionName: "job_detail",
          filter: {
            jobId: data?.jobId || data?.jobId || "", // Use the current PRQ ID in the filter
          },
          update: {
            status: status
          }
        };
        const res = await this.operation.operationPut("generic/update", reqBody).toPromise();
        return res;
      }
      async getjobDetailsByJob(jobId){
        const req = {
          "companyCode": localStorage.getItem("companyCode"),
          "filter": {jobId:jobId},
          "collectionName": "job_detail"
      }

      const res = await firstValueFrom(this.operation.operationMongoPost('generic/get', req));
      return res.data[0];
      }
      setLoadingState(isLoading, context) {
        context.tableLoad = context.isLoad = isLoading;
      }
    
      alertDuplicateContNo() {
        Swal.fire({
          icon: "info",
          title: "Information",
          text: "Please avoid duplicate entering contNo.",
          showConfirmButton: true,
        });
      }
    
      delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
    
      resetFormValidators(form) {
        Object.keys(form.controls).forEach(key => {
          const control = form.get(key);
          control.clearValidators();
          control.updateValueAndValidity();
        });
      }
      getExportType(exportType){
       return  this.exportType[exportType]
      }
      async updateJobDetails(data,jobId) {
        const reqBody = {
          companyCode: localStorage.getItem("companyCode"),
          collectionName: "job_detail",
          filter: {
            jobId: jobId // Use the current PRQ ID in the filter
          },
          update: data
        };
        const res = await this.operation.operationPut("generic/update", reqBody).toPromise();
        return res;
      }
}
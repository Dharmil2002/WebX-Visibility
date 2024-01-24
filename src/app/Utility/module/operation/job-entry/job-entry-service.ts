import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { StorageService } from "src/app/core/service/storage.service";
import { calculateTotalField } from "src/app/operation/unbilled-prq/unbilled-utlity";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class JobEntryService {
  exportType = {
    export: [{ name: "Container", value: "container" }],
    import: [{ name: "Bulk", value: "Bulk" }, { name: "LCL", value: "LCL" }]
  }
  statusMapping = {
    "1_false": "Update job",
    "1_true": "Awaiting CHA Entry",
    "2": "Awaiting Rake Entry",
    "3": "Rake Generated",
    "default": ""
  };
  actionMapping = {
    "1_false": "Update",
    "1_true": "CHA Entry",
    "2": "Rake Entry",
    "default": ""
  };

  constructor(
    private operation: OperationService,
    private storage: StorageService
  ) { }
  async processShipmentListJob(shipmentList, orgBranch) {
    return shipmentList.map((x) => {
      if (x.origin === orgBranch || (x.destination == orgBranch && x.status == "2")) {
        const actualWeights = x.invoiceDetails.map((item) => calculateTotalField([item], 'actualWeight')).reduce((acc, weight) => acc + weight, 0);
        const noofPkts = x.invoiceDetails.map((item) => calculateTotalField([item], 'noofPkts')).reduce((acc, pkg) => acc + pkg, 0);
        x.cnoteNo = x.docketNumber;
        x.cnoteDate = formatDocketDate(x.docketDate || new Date());
        x.actualWeight = actualWeights;
        x.noOfpkg = noofPkts;
        x.ftCity = `${x.fromCity}-${x.toCity}`;
        x.invoiceAmount = x.totalAmount;
        x.loadedWeight = actualWeights;
        x.invoiceCount = x.invoiceDetails.length || 0;
        x.actions = ["Edit", "Remove"]
        return x;
      }
      return null;
    }).filter((x) => x !== null);
  }
  async getJobDetail() {
    const req = {
      "companyCode": localStorage.getItem("companyCode"),
      "filter": {},
      "collectionName": "job_detail"
    }

    const res = await this.operation.operationMongoPost('generic/get', req).toPromise();
    return res.data.filter((x) => x.jobLocation == localStorage.getItem("Branch"));
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
  async getjobDetailsByJob(jobId) {
    
    // Function to create request object
    const createRequest = (collectionName) => ({
      companyCode:this.storage.companyCode,
      filter: { jID: jobId },
      collectionName,
    });
  
    try {
      // Get job header details
      const reqHeader = createRequest("job_header");
      const resHeader = await firstValueFrom(this.operation.operationMongoPost('generic/get', reqHeader));
  
      // // Get job details
      // const reqDetails = createRequest("job_details");
      // const resDetails = await firstValueFrom(this.operation.operationMongoPost('generic/get', reqDetails));
       //get challan Detail
      const reqChallan = createRequest("job_challans");
      const resChallan = await firstValueFrom(this.operation.operationMongoPost('generic/get', reqChallan));
  

      return {
        jobHeader: resHeader.data[0],
      //  jobDetails: resDetails.data,
        jobChallan:resChallan.data
      };
    } catch (error) {
      // Handle or throw the error based on your error handling strategy
      throw error;
    }
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
  getExportType(exportType) {
    return this.exportType[exportType]
  }
  async updateJobDetails(data,filter,collectionName) {
    const reqBody = {
      companyCode: localStorage.getItem("companyCode"),
      collectionName:collectionName,
      filter: filter,
      update: data
    };
    const res = await firstValueFrom(this.operation.operationPut("generic/update", reqBody));
    return res;
  }
  async addDeleteJobDetails(data, filter, collectionName) {
    // Use destructuring for better readability
    const companyCode = localStorage.getItem("companyCode");

    // Consolidate repeated code into a single object
    const commonRequest = {
      companyCode,
      collectionName,
    };

    // Delete job details
    const reqDelete = {
      ...commonRequest,
      filter,
    };

    try {
      let resDelete=0;
      const resGet= await firstValueFrom(this.operation.operationMongoPost("generic/get", reqDelete));
      if(resGet.data.length>0){
       resDelete = await firstValueFrom(this.operation.operationMongoRemove("generic/removeAll", reqDelete));
      }
      else{
        resDelete=1;
      }
      // Check if the delete operation was successful before adding new details
      if (resDelete) {
        // Add job details
        const reqBody = {
          ...commonRequest,
          data,
        };
        const resAdd = await firstValueFrom(this.operation.operationMongoPost("generic/create", reqBody));
        return resAdd;
      }
    } catch (error) {
      // Error handling for the entire operation
      throw error; // Re-throw the error if you need to handle it further up the call stack
    }

  }
  jobFieldMapping(data, containerType) {
    const jobMapping = {
      _id: "",
      cID: this.storage.companyCode,
      docNo: "",
      jID: "",
      jDT: data.formData.jobDate || new Date("1-01-1710"),
      lOC: this.storage.branch,
      wT: data.formData.weight,
      bPARTY: data.formData?.billingParty?.value,
      bPARTYNM: data.formData?.billingParty?.name,
      mOBNO: data.formData.mobileNo,
      dESTCN: data.formData.DestCountry || "",
      fCT: data.formData.fromCity || "",
      tCT: data.formData.toCity || "",
      jTYP: data.formData.jobType || "",
      jTYPNM: data.formData.jobTypeName || "",
      tBY: data.formData.transportedBy || "",
      tBYNM: data.formData.transportedByName || "",
      pKGS: data.jobDetails.reduce((acc, pkg) => acc + pkg.noOfpkg, 0),
      cNTS: data.jobDetails.length,
      tMODE: data.formData.transportMode?.value || "",
      tMODENM: data.formData.transportMode?.name || "",
      pONO: data.formData.poNumber || "",
      eTYP: data.formData.exportType || "",
      eTYPNM: data.formData.exportTypeName || "",
      sTS: 1,
      sTSNM: "Generated",
      cNL: false,
      cNLDT: new Date(),
      cNBY: "",
      cNRES: "",
      eNTDT: new Date(),
      eNTLOC: this.storage.branch,
      eNTBY: this.storage.userName,
    }
    let jobDetails = [];
    if(data.jobDetails.length>0){
    data.jobDetails.forEach(element => {
      const containerCode = containerType.find((x) => x.name == element?.containerType)?.value || "";
      let jobDetail = {
        _id: "",
        cID: this.storage.companyCode,
        jID: "",
        jDT: data.formData.jobDate,
        dKTNO: element?.cnoteNo || "",
        dKTDT: element?.cnoteDate || new Date("1-01-1710"),
        cNTYP: containerCode || "",
        cNTYPNM: element?.containerType || "",
        cNNO: element?.contNo || "",
        pKGS: element?.noOfpkg || 0,
        wT: element?.loadedWeight || 0,
        eNTDT: new Date(),
        eNTLOC: this.storage.branch,
        eNTBY: this.storage.userName
      }
      jobDetails.push(jobDetail);
    });
  }
    let blChallan = [];
    if(data.blChallan.length>0){
      
    data.blChallan.forEach(element => {
      const containerCode = containerType.find((x) => x.name == element?.containerType)?.value || "";
      let Challan = {
        _id: "",
        cID: this.storage.companyCode,
        jID: "",
        jDT: data.formData.jobDate,
        jTYP: data.formData.jobType,
        jTYPNM: data.formData.jobType.jobTypeName,
        iNVNO: element?.invNum || "",
        iNVDT: element?.invDate || "",
        sBNO: element?.sbNum || "",
        sBDT: element?.osb || "",
        pOD: element?.pod || "",
        cOD: element?.cod || "",
        bLNO:element?.blNum || "",
        bLDT:element?.oblDate || "",
        bENO:element?.beNum || "",
        bEDT:element?.obeDate || "",
        cNTYP: containerCode || "",
        cNTYPNM: element?.containerType || "",
        cNNO: element?.containerNum || "",
        eNTDT: new Date(),
        eNTLOC: this.storage.branch,
        eNTBY: this.storage.userName

      }
      blChallan.push(Challan);
    });
  }
    const req = {
      jobData: jobMapping,
      jobDetails: jobDetails,
      blChallan: blChallan
    }
    return req;
  }
  async addJobDetail(jobDetail, financialYear) {
    // Prepare the request body with company code, collection name, and job detail data.
    let reqBody = {
      companyCode: localStorage.getItem("companyCode"),
      collectionName: "job_header",
      docType: "JOB",
      branch: this.storage.branch,
      finYear: financialYear,
      data: jobDetail,
      party: jobDetail.jobData.bPARTYNM.toUpperCase()
    };
    // Send a POST request to create the job detail in the MongoDB collection.
    const res = await firstValueFrom(this.operation.operationPost("operation/Job/create", reqBody));
    // Return the response from the server.
    return res;
  }
  /*here the function which is use in Job summary page*/
  async getJobDetails() {
    const jobFilter = { cID: this.storage.companyCode, lOC: this.storage.branch };
    const jobHeaders = await this.fetchFromMongo("job_header", jobFilter);
    const jobNumbers = jobHeaders.map(header => header.jID);

    // Fetch cha headers
    const chaHeadersFilter = { cID: this.storage.companyCode,jID: { D$in: jobNumbers }};
    const chaHeaders = await this.fetchFromMongo("cha_headers", chaHeadersFilter);
    const chaNumbers = chaHeaders.map(header => header.cHAID);
    // Fetch cha details
    const chaDetailsFilter = { cID: this.storage.companyCode, cHAID: { D$in: chaNumbers }};
    const chaDetails = await this.fetchFromMongo("cha_details", chaDetailsFilter);

    let jobSummary = [];
    if (jobHeaders) {
      jobHeaders.forEach(element => {
        let chaNumbers = chaHeaders.find((x) => x.jID == element.jID);
        let chaDetail = chaNumbers?chaDetails.find((x) => x.cHAID == chaNumbers.cHAID):"";
        let sTSKey = element?.sTS == 1 ? `${element?.sTS}_${element.cNTS == 0 ? false : true}` : `${element?.sTS}`;
        let job = {
          createdOn: formatDocketDate(element?.eNTDT || new Date()),
          jobNo: element?.jID || "",
          jobDate: formatDocketDate(element?.jDT || new Date()),
          oJDT: element?.jDT,
          jobType: element?.jTYPNM || "",
          jTYP: element?.jTYP || "",
          billingParty: `${element?.bPARTY}-${element?.bPARTYNM}`,
          bPARTY: element?.bPARTY || "",
          bPARTYNM: element?.bPARTYNM || "",
          fromToCity: `${element?.fCT}-${element?.tCT}` || "",
          jobLocation: element?.lOC || "",
          fCT: element?.fCT || "",
          tCT: element?.tCT || "",
          tBY: element?.tBY || "",
          tBYNM: element?.tBYNM || "",
          pkgs: element?.pKGS || 0,
          eNTDT: element?.eNTDT || new Date(),
          totalChaAmt:chaDetail?chaDetail.tOTAMT:"",
          chaDate:chaDetail?formatDocketDate(chaDetail.eNTDT):'',
          status: this.statusMapping[sTSKey] || this.statusMapping["default"],
          sTS:element?.sTS,
          Action: this.actionMapping[sTSKey] || this.actionMapping["default"]
        }
        jobSummary.push(job);
      });
    }
    return jobSummary.reverse();
  }
  /*End*/
  async fetchFromMongo(collectionName: string, filter: any): Promise<any> {
    const request = {
      companyCode: this.storage.companyCode,
      collectionName,
      filter
    };
    const response = await firstValueFrom(this.operation.operationMongoPost('generic/get', request));
    return response.data;
  }

}
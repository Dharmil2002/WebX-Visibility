import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";
import { Collections, OperationActions } from "src/app/config/myconstants";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { StorageService } from "src/app/core/service/storage.service";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class RakeEntryService { 
  constructor(
    private operations: OperationService,
    private storage: StorageService
  ) { }
  async processRakeListJob(rakeList) {
    return rakeList.map((x) => {
      x.cnNo = x.hasOwnProperty("cnNo") ? x.cnNo : "",
        x.cnDate = x.hasOwnProperty("cnDate") ? x.cnDate : "",
        x.jobNo = x.hasOwnProperty("jobNo") ? x.jobNo : "",
        x.jobDate = x.hasOwnProperty("jobDate") ? x.jobDate : "",
        x.noOfPkg = x?.pkgs || "";
      x.fCity = x?.fromToCity.split("-")[0] || "";
      x.tCity = x?.fromToCity.split("-")[1] || "";
      x.weight = x?.weight || 0;
      x.billingParty = x?.billingParty || "";
      x.actions = ["Edit", "Remove"]
      return x;
    }).filter((x) => x !== null);
  }
  async addRakeContainer(data) {
    const reqBody = {
      companyCode: this.storage.companyCode,
      collectionName: 'rake_container_details',
      data: data
    }
    const res = this.operations.operationPost('generic/create', reqBody).toPromise();
    return res;
  }
  async updateRakeContainer(data, filter,collectionName) {
    
    const requestBody = {
      companyCode: this.storage.companyCode,
      collectionName:collectionName,
      filter: filter,
      update: data
    };
  
    try {
      const response = await firstValueFrom(this.operations.operationMongoPut('generic/update', requestBody));
      return response;
    } catch (error) {
      Swal.fire("Error!", "Failed to update rake container details.", "error");
    }
  }
  
  async addRakeDetails(data) {  
    const thisYear = new Date().getFullYear();
    const financialYear = `${thisYear.toString().slice(-2)}${(thisYear + 1).toString().slice(-2)}`;
    const req = {
      companyCode: this.storage.companyCode,
      collectionName: Collections.rake_headers,
      docType: "RAKE",
      branch: this.storage.branch,
      finYear: financialYear,
      data: data
    }
    const res = await firstValueFrom(this.operations.operationPost(OperationActions.createRake, req));
    return res
  }
  async fieldMapping(data) {
    const rake = {
      _id: "",
      docNo: "",
      rAKEID: "",
      jID: data?.jobNo || "",
      tMODE: data?.transportMode || "",
      tMODENM: data?.transportModeName || "",
      dEST: data?.destination.value || "",
      vENDTYP: data?.vendorType || "",
      vENDTYPNM: data?.vendorTypeName || "",
      vNDCD: data?.vendorName.value || "",
      vNDNM: data?.vendorName.name || "",
      fCT: data?.fromCity.value || "",
      tCT: data?.toCity.value || "",
      vIA: data?.via || "",
      nFC: data?.NFC || "",
      dOCTYP: data?.documentType || "",
      dOCTYPNM: data?.documentTypeName || "",
      lTYP: data?.loadType || "",
      lTYPNM: data?.loadTypeName || "",
      mTYPNM: data?.movementTypeName || "",
      mTYP: data?.movementType || "",
      fNRNO: data?.fnrNo || "",
      lOC: this.storage?.branch || "",
      aCTIVE: data?.isActive || false,
      eNTLOC: this.storage.branch,
      eNTBY: this.storage.companyCode,
      eNTDT: new Date(),
      sTS: 1,
      oSTSN: "Generated",
      cID: this.storage.companyCode
    }
    let container = [];
    if (data.containerDetail.length > 0) {
      data.containerDetail.forEach(element => {
        let rakeContainer = {
          _id: "",
          cID: this.storage.companyCode,
          dKTNO: element?.cnNo || "",
          dktDT: element?.cnDateDateUtc || "",
          cNTS: element?.contCnt || "",
          rAKEID: "",
          pKGS: element?.noOfPkg || "",
          wT: element?.weight || "",
          fCT: element?.fCity || "",
          tCT: element?.tCity || "",
          bPARTY: element?.billingPartyCode || "",
          bPARTYNM: element?.billingParty || "",
          eNTLOC: this.storage.branch,
          eNTBY: this.storage.companyCode,
          eNTDT: new Date(),
        }
        container.push(rakeContainer);
      });
    }
    let rakeInvoiceList = [];
    data.invoiceDetail.forEach(element => {
      let rakeInvoice = {
        _id: "",
        cID: this.storage.companyCode,
        rAKEID: "",
        iNVNO: element?.invNum || "",
        iNVDT: element?.oinvDate || "",
        iNVAMT: element?.invAmt || "",
        eNTBY: this.storage.userName,
        eNTLOC: this.storage.branch,
        eNTDT: new Date()
      }
      rakeInvoiceList.push(rakeInvoice);
    });
    let rakeDetails = [];
    data.rakeDetail.forEach(element => {
      let rakeData = {
        _id: "",
        cID: this.storage.companyCode,
        rAKEID: "",
        rRNo: element?.rrNo || "",
        rRDate: element?.orrDate || new Date(),
        eNTBY: this.storage.userName,
        eNTDT: new Date(),
        eNTLOC: this.storage.branch
      }
      rakeDetails.push(rakeData);
    });
    const reqData = {
      rakeHeaders: rake,
      rakeContainers: container,
      rakeInvoices: rakeInvoiceList,
      rakeDetails: rakeDetails,
    }
    return reqData;
  }

  async fetchData(collection, filter) {
    const req = {
      companyCode: this.storage.companyCode,
      collectionName: collection,
      filter: filter
    };
    return await firstValueFrom(this.operations.operationPost('generic/get', req));
  }
  async getRakeDetail() {
    // Fetch rake headers
    const rakeHeadersRes = await this.fetchData(Collections.rake_headers, { cID: this.storage.companyCode,sTS:1,'D$or': [
      { lOC: this.storage.branch },
      { dEST: this.storage.branch }
  ] });
    const rakeNo = rakeHeadersRes.data.map(x => x.rAKEID);
    // Define a common filter for subsequent requests
    const rakeFilter = { rAKEID: { D$in: rakeNo } };
    // Fetch rake details, invoices, and details using the common function
    const resRd = await this.fetchData('rake_details', rakeFilter);
   // const resInvs = await this.fetchData('rake_invoices', rakeFilter);
    const resContainers = await this.fetchData('rake_containers', rakeFilter); // Note: This seems redundant, as it's the same as resInvs
    let RakeDetails = [];
    rakeHeadersRes.data.forEach(element => {
      // Ensure resContainers and resRd are arrays before proceeding
      const containersData = Array.isArray(resContainers?.data) ? resContainers.data : [];
      const rrData = Array.isArray(resRd?.data) ? resRd.data : [];
    
      const filteredContainers = containersData.filter(item => item.rAKEID === element?.rAKEID);
      const rrDetails = rrData.filter(x => x.rAKEID === element?.rAKEID);
    
      const rrContainers = filteredContainers.reduce((sum, item) => sum + (item.cNTS ?? 0), 0);
      const weight = filteredContainers.reduce((sum, item) => sum + (item.wT ?? 0), 0);
    
      const uniqueBillingParties = new Set();
      const uniquecnNos = new Set();
      let billingPartys = new Map<string,{}>();
      let docketList = new Map<string,{}>();
      filteredContainers.forEach(item => {
        if (item.bPARTY) {
          uniqueBillingParties.add(item.bPARTY)
          billingPartys.set(item.bPARTY,{code:item.bPARTY,name:item.bPARTYNM});
        };
        if (item.dKTNO) {
          uniquecnNos.add(item.dKTNO)
          docketList.set(item.dKTNO,{code:item.bPARTYNM,name:item.dKTNO});
        };
      });
    
      const jsonRake = {
        RakeNo: element?.rAKEID ?? '',
        RakeEntryDate: formatDocketDate(element?.eNTDT ?? ''),
        RRNo: rrDetails.length,
        ContainerNo: rrContainers,
        FromToCity: `${element?.fCT ?? ''}-${element?.tCT ?? ''}`,
        Weight: weight,
        BillingParty: uniqueBillingParties.size,
        billingPartyDetails: Array.from(billingPartys),
        CurrentStatus: "At " + localStorage.getItem("Branch"),
        CNNo: uniquecnNos.size,
        cnNos: Array.from(docketList),
        entryDate: element?.eNTDT ?? '',
        actions: element.dEST==this.storage.branch?"Updated":""
      }
      RakeDetails.push(jsonRake);
    });
     return RakeDetails.reverse();
  }
  
}

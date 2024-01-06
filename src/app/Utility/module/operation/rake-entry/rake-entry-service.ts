import { Injectable } from "@angular/core";
import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { StorageService } from "src/app/core/service/storage.service";
import { calculateTotalField } from "src/app/operation/unbilled-prq/unbilled-utlity";

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
  async fieldMapping(data) {
    debugger
    const rake = {
      _id: "",
      docNo: "",
      rAKEID: "",
      jID: data?.jobNo || "",
      tMODE: data?.transportMode || "",
      tMODENM: data?.transportModeName || "",
      dEST: data?.destination || "",
      vENDTYP: data?.vendorType || "",
      vENDTYPNM: data?.vendorTypeName || "",
      vNDCD: data?.vendorTypeCode || "",
      vNDNM: data?.vendorTypeName || "",
      fCT: data?.fromCity.value || "",
      tCT: data?.toCity.value || "",
      vIA: data?.via || "",
      dOCTYP: data?.documentType || "",
      dOCTYPNM: data?.documentTypeName || "",
      lTYP: data?.loadType || "",
      lTYPNM: data?.loadTypeName || "",
      mTYPNM: data?.movementTypeName || "",
      mTYP: data?.mTYP || "",
      nFC: data?.NFC || "",
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
    if(data.container.length>0){
    data.container.forEach(element => {
      let rakeContainer = {
        _id: "",
        dKTNO: element?.cnNo || "",
        dktDT: element?.cnDate || "",
        cNTS: element?.contCnt || "",
        rAKEID: "",
        pKGS: element?.noOfPkg || "",
        wT: element?.weight || "",
        fCT: element?.fCity || "",
        tCT: element?.tCity || "",
        bPARTY: element?.billingParty?.value || "",
        bPARTYNM: element?.billingParty?.name || "",
        eNTLOC: this.storage.branch,
        eNTBY: this.storage.companyCode,
        eNTDT: new Date(),
        mODDT: new Date(),
        mODLOC: this.storage.branch,
        mODBY: this.storage.userName
      }
      container.push(rakeContainer);
    });
  }
    let rakeInvoiceList = [];
    data.rakeInvoice.forEach(element => {
      let rakeInvoice = {
        _id: "",
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
    data.rakeDetails.forEach(element => {
      let rakeData = {
        _id: "",
        rAKEID: "",
        rRNo:element?.rrNo||"",
        rRDate:element?.orrDate||new Date(),
        eNTBY:this.storage.userName,
        eNTDT:new Date(),
        eNTLOC:this.storage.branch
      }
     rakeDetails.push(rakeData);
    });
    const reqData={
      rakeHeaders:rake,
      rakeInvoices:rakeInvoiceList,
      rakeDetails:rakeDetails,
    }
    return reqData;
  }
}
import { Injectable } from "@angular/core";
import moment from "moment";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
@Injectable({
  providedIn: "root",
})
export class ManifestRegService {
  constructor(
    private masterServices: MasterService,
    private storage: StorageService
  ) {}

  async getManifestRegisterReportDetails(data) {

    let matchQuery = {   
         
      ...(data.mFNO ? { mFNO: { D$in: data.ManifestArray } }:
      {D$and: [
        { mFDT: { D$gte: data.startValue } }, 
        { mFDT: { D$lte: data.endValue } },      
        ...(data.mFNO ? [{ mFNO: { D$in: data.ManifestArray } }] : []),
        //...[{ oRGN : { D$in: data.branch } }]
        ...(data.branch != "HQTR" ? [{oRGN : {D$in : data.branch}}] : [{}])
      ]}
      ),
    };

    let jonFilters = [];
    const reqBody = {
      companyCode: this.storage.companyCode,
      reportName: "ManifestRegister",
      filters: {
        filter: {
          ...matchQuery,
        }
      }
    }
        debugger;
    const res = await firstValueFrom(
      this.masterServices.masterMongoPost("generic/getReportData", reqBody)
    );
    const details = res.data.data.map((item) => ({
      ...item,
      // dRSDT : item.dRSDT ? moment(item.dRSDT).format("DD MMM YY HH:MM") : "",
      // mODDT : item.mODDT ? moment(item.mODDT).format("DD MMM YY HH:MM") : "",
      // uPDT : item.uPDT ? moment(item.uPDT).format("DD MMM YY HH:MM") : "",
      // dT : item.dT ? moment(item.dT).format("DD MMM YY HH:MM") : "",
      // partyType: item.eXMT ? "Registered" : "UnRegistered",
      // dOCTYP: item?.dOCTYP || "Transaction",
    }));
    return { 
      data: details,
      grid: res.data.grid
    };
  }
}

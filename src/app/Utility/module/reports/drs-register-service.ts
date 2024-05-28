import { Injectable } from "@angular/core";
import moment from "moment";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
@Injectable({
  providedIn: "root",
})
export class DrsService {
  constructor(
    private masterServices: MasterService,
    private storage: StorageService
  ) {}

  async getdrsReportDetail(data) {
    let matchQuery = {   
         
      ...(data.drsNo != "" ? { dRSNO: { D$in: data.DRSArray } }:
      {D$and: [
        { dRSDT: { D$gte: data.startValue } }, // Convert start date to ISO format
        { dRSDT: { D$lte: data.endValue } }, // Bill date less than or equal to end date        
        ...(data.drsNo != "" ? [{ dRSNO: { D$in: data.DRSArray } }] : []),        
        ...(data.status && data.status != "" && data.status != 5
          ? [{ oPSST: { D$eq: data.status } }]
          : []),        
        ...(data.rtype =="Individual" ? [{ lOC : { D$in : data.branch } }] : [{}]),
        // ...[{ lOC: { D$in: data.branch } }],
      ]}
      ),
    };

    let jonFilters = [];
    const reqBody = {
      companyCode: this.storage.companyCode,
      reportName: "DrsRegister",
      filters: {
        filter: {
          ...matchQuery,
        }
      }
    }
        
    const res = await firstValueFrom(
      this.masterServices.masterMongoPost("generic/getReportData", reqBody)
    );
    const details = res.data.data.map((item) => ({
      ...item,
      // dRSDT : item.dRSDT ? moment(item.dRSDT).format("DD MMM YY HH:MM") : "",
      // mODDT : item.mODDT ? moment(item.mODDT).format("DD MMM YY HH:MM") : "",
      // uPDT : item.uPDT ? moment(item.uPDT).format("DD MMM YY HH:MM") : "",
      // dT : item.dT ? moment(item.dT).format("DD MMM YY HH:MM") : "",
      partyType: item.eXMT ? "Registered" : "UnRegistered",
      dOCTYP: item?.dOCTYP || "Transaction",
    }));

    return { 
      data: details,
      grid: res.data.grid
    };
  }
}

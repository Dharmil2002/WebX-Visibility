import { Injectable } from "@angular/core";
import moment from "moment";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
@Injectable({
  providedIn: "root",
})
export class VendorTdsPaymentService {
  constructor(
    private masterServices: MasterService,
    private storage: StorageService
  ) {}


  async getVendorTdsPayReportDetail(data) {
    const vendorNames = data.vendrnm ? data.vendrnm.map(x => x.vCD) || [] : [];
    let matchQuery = {   
      //...(data.tpsNo != "" ? { tPSNO: { D$in: data.TdsnoArray } }:
        ...(data.TdsnoArray && data.TdsnoArray.length > 0
          ? { tPSNO: { D$in: data.TdsnoArray } }
          : data.vouchernoArray && data.vouchernoArray.length > 0
          ? { vNO: { D$in: data.vouchernoArray } }
          : {}),
        ...(!((data.TdsnoArray && data.TdsnoArray.length > 0) || (data.vouchernoArray && data.vouchernoArray.length > 0))
      ?{D$and: [
        { tPSDATE: { D$gte: data.startValue } },
        { tPSDATE: { D$lte: data.endValue } }, 
        ...(data.rtype =="Individual" ? [{ eNTLOC : { D$in : data.branch } }] : [{}]),
         ...(data.vendrnm.length > 0  ? [{ D$expr: { D$in: ["D$vND.cD", vendorNames] } }]
        : []),              
      ]}
      : {})
    };

    const reqBody = {
      companyCode: this.storage.companyCode,
      reportName: "VendorTDSPaymentRegister",
      filters: {
        filter: {
          ...matchQuery,
        }
      }
    }

    const res = await firstValueFrom(
      this.masterServices.masterMongoPost("generic/getReportData", reqBody)
    );

    return { 
      data:  res.data.data,
      grid: res.data.grid
    };
  }  
}

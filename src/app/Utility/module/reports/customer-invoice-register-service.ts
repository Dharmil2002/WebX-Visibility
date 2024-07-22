import { Injectable } from "@angular/core";
import moment from "moment";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
@Injectable({
  providedIn: "root",
})
export class CustInvoiceRegService {
  constructor(
    private masterServices: MasterService,
    private storage: StorageService
  ) { }

  async getcustInvRegReportDetail(data) {
    ;
    let matchQuery = {
      ...(data.docNo != "" ? { bILLNO: { D$eq: data.docNo } } :
        {
          D$and: [
            { bGNDT: { D$gte: data.startValue } }, // Convert start date to ISO format
            { bGNDT: { D$lte: data.endValue } }, // Bill date less than or equal to end date
            {
              D$or: [{ cNL: false }, { cNL: { D$exists: false } }],
            },
            ...(data.docNo != "" ? [{ bILLNO: { D$eq: data.docNo } }] : []),
            ...(data.state && data.state.length > 0
              ? [{ D$expr: { D$in: ["$gEN.sT", data.state] } }]
              : []),
            ...(data.status && data.status != ""
              ? [{ bSTS: { D$eq: data.status } }]
              : []),
            ...(data.cust && data.cust.length > 0
              ? [{ D$expr: { D$eq: ["$cUST.nM", data.cust] } }]
              : []),
            ...(data.sac && data.sac.length > 0
              ? [{ D$expr: { D$in: ["$voucher_trans_details.sCOD", data.sac] } }]
              : []),
            // ...[{ bLOC: { D$in: data.branch } }],
            ...(data.individual == "Y" ? [{ bLOC: { D$in: data.branch } }] : [{}]),
          ]
        }
      ),
    };

    const reqBody = {
      companyCode: this.storage.companyCode,
      reportName: "CustomerInvoiceRegister",
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
      sDTM: item.sDTM ? moment(item.sDTM).local().format("DD MMM YYYY HH:mm") : "",
      bGNDT: item.bGNDT ? moment(item.bGNDT).local().format("DD MMM YYYY HH:mm") : "",
      aDT: item.aDT ? moment(item.aDT).local().format("DD MMM YYYY HH:mm") : "",
      eNTDT: item.eNTDT ? moment(item.eNTDT).local().format("DD MMM YYYY HH:mm") : "",
      partyType: item.eXMT ? "Registered" : "UnRegistered",
      dOCTYP: item?.dOCTYP || "Transaction",
    }));

    return {
      data: details,
      grid: res.data.grid
    };
  }
}
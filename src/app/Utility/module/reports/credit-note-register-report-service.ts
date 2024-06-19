import { Injectable } from "@angular/core";
import moment from "moment";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
@Injectable({
  providedIn: "root",
})
export class CreditNoteRegisterReportService {
  constructor(
    private masterServices: MasterService,
    private storage: StorageService
  ) {}

  async getcustomerGstRegisterReportDetail(data) {
    debugger;
    let matchQuery = {
      ... {tYP:{D$eq:'C'}},
      ...(data.DocNos && data.DocNos.length > 0
        ? { nTNO: { D$in: data.DocNos } }
        : data.VoucherNos && data.VoucherNos.length > 0
        ? { vNO: { D$in: data.VoucherNos } }
        : {}),
      ...(!((data.DocNos && data.DocNos.length > 0) || (data.VoucherNos && data.VoucherNos.length > 0))
      ?{D$and: [
        { nTDT: { D$gte: data.startValue } },
        { nTDT: { D$lte: data.endValue } },
        ...(data.individual =="Y" ? [{ eNTLOC : { D$in : data.branch } }] : [{}]),
        ...(data.status != "All"
          ? [{ sTS: { D$eq: data.status } }] : []
        ),
        ...(data.custData && data.custData.length > 0
          ? [{ D$expr: { D$in: ["$pARTY.cD", data.custData.map(c => c.cCD)] } }]
          : []),
      ]}
      : {})
    };
    // let matchQuery = {
    //   ...{tYP:{D$eq:"C"}},
    //   ...(data.docNo != "" ? { nTNO: { D$eq: data.docNo } }:
        
    //   {D$and: [
    //     { nTDT: { D$gte: data.startValue } }, // Convert start date to ISO format
    //     { nTDT: { D$lte: data.endValue } }, // Bill date less than or equal to end date
    //     // {
    //     //   D$or: [{ cNL: false }, { cNL: { D$exists: false } }],
    //     // },
        
    //     // ...(data.docNo != "" ? [{ bILLNO: { D$eq: data.docNo } }] : []),
    //     // ...(data.state && data.state.length > 0
    //     //   ? [{ D$expr: { D$in: ["$gEN.sT", data.state] } }]
    //     //   : []),
    //     // ...(data.status && data.status != ""
    //     //   ? [{ bSTS: { D$eq: data.status } }]
    //     //   : []),
    //     ...(data.custData && data.custData.length > 0
    //       ? [{ D$expr: { D$in: ["$pARTY.cD", data.custData.map(c => c.cCD)] } }]
    //       : []),
    //     // ...(data.sac && data.sac.length > 0
    //     //   ? [{ D$expr: { D$in: ["$voucher_trans_details.sCOD", data.sac] } }]
    //     //   : []),
    //     ...[{ lOC: { D$in: data.branch } }],
    //     ...(data.individual =="Y" ? [{ lOC : { D$in : data.branch } }] : [{}]),
    //   ]}
    //   ),
    // };

    let jonFilters = [];

    const reqBody = {
      companyCode: this.storage.companyCode,
      reportName: "CreditNoteRegister",
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
      sDTM : item.sDTM ? moment(item.sDTM).format("DD MMM YY HH:MM") : "",
      partyType: item.eXMT ? "Registered" : "UnRegistered",
      dOCTYP: item?.dOCTYP || "Transaction",
    }));


    return {
      data: details,
      grid: res.data.grid
    };
  }
}
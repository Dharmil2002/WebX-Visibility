import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
@Injectable({
  providedIn: "root",
})
export class GCNFlowRegService {
  constructor(
    private masterServices: MasterService,
    private storage: StorageService
  ) { }

  // async getGCNRegisterReportDetails(data) {
  //   debugger;
  //         const loc = data.fromloc ? data.fromloc.map(x => x.locCD) || [] : [];
  //         const payBasis = data.payment ? data.payment.map(x => x.payNM) || [] : [];
  //         const tranMode = data.transitmode ? data.transitmode.map(x => x.tranNM) || [] : [];

  //         let matchQuery = {
  //           'D$and': [
  //             { dKTDT: { 'D$gte': data.startDate } }, // Convert start date to ISO format
  //             { dKTDT: { 'D$lte': data.endDate } }, // prq date less than or equal to end date
  //             ...(loc.length > 0 ? [{ oRGN: { 'D$in': loc } }] : []), // From Location condition
  //             ...(payBasis.length > 0 ? [{ pAYTYPNM: { 'D$in': payBasis } }] : []),
  //             ...(data.ReportType ? [{ ReportType: { D$in: data.ReportType } }] : []),
  //             {
  //               'D$or': [
  //                 ...(tranMode.length > 0 ? [{ tRNMODNM: { 'D$in': tranMode } }] : []),
  //                 ...(data.loadtype ? [{ loadtype: { D$in: data.loadtype } }] : []),
  //               ]
  //             }
  //           ]
  //         };

  //         const buildRequestBody = (isLTL) => ({
  //           companyCode: this.storage.companyCode,
  //           reportName: isLTL? "THCRegisterLTL" : "THCRegister",
  //           filters: {
  //             filter: isLTL? matchQuery(true) : matchQuery(false)
  //           }
  //   });
  //   const res = await firstValueFrom(this.masterServices.masterMongoPost("generic/getReportData", buildRequestBody(false)));
  //   const resLTL = await firstValueFrom(this.masterServices.masterMongoPost("generic/getReportData", buildRequestBody(true)));
  //   const formatDetails = (data, isLTL) => data.map(item => ({
  //           ...item,
  //           THCDT: item.THCDT ? moment(item.THCDT).format("DD MMM YY HH:MM") : "",
  //           THCUpdateDate: item.THCUpdateDate ? moment(item.THCUpdateDate).format("DD MMM YY HH:MM") : "",
  //           Dateandtime: item.Dateandtime ? moment(item.Dateandtime).format("DD MMM YY HH:MM") : "",
  //           UnloadedPkg : !isLTL && item.THCStatus === (1) ? 0: item.UnloadedPkg,
  //           UnloadedWeight : !isLTL && item.THCStatus === (1) ? 0: item.UnloadedWeight,
  //           TotalGCNUnloded : !isLTL && item.THCStatus === (1) ? 0: item.TotalGCNUnloded,
  //           THCStatus: item.THCStatus === 1 || (isLTL && item.THCStatus === 2) ? "Generated" :
  //                      item.THCStatus === 3 ? "Updated" :
  //                      item.THCStatus === (isLTL ? 4 : 2) ? "Closed" : "Cancelled"
  //   }));
  //   const combinedTransportDataArray = [...formatDetails(res.data.data, false), ...formatDetails(resLTL.data.data, true)];
  //   return {data: combinedTransportDataArray,grid: res.data.grid};
  // }

  async getGCNRegisterReportDetails(data) {
    const loads = data.loadtype
    const loc = data.fromloc ? data.fromloc.map(x => x.locCD) || [] : [];
    const payBasis = data.payment ? data.payment.map(x => x.payNM) || [] : [];
    const tranMode = data.transitmode ? data.transitmode.map(x => x.tranNM) || [] : [];

    // let matchQuery = () => ({
    //   'D$and': [
    //     { dKTDT: { 'D$gte': data.startDate } }, // Convert start date to ISO format
    //     { dKTDT: { 'D$lte': data.endDate } }, // prq date less than or equal to end date
    //     ...(loc.length > 0 ? [{ oRGN: { 'D$in': loc } }] : []), // From Location condition
    //     ...(payBasis.length > 0 ? [{ pAYTYPNM: { 'D$in': payBasis } }] : []),
    //     ...(data.ReportType ? [{ ReportType: { D$in: data.ReportType } }] : []),
    //     {
    //       'D$or': [
    //         ...(tranMode.length > 0 ? [{ tRNMODNM: { 'D$in': tranMode } }] : []),
    //       ]
    //     }
    //   ]
    // });
    const branch = this.storage.branch;
    let matchQuery = {
      ...(
        {
          D$and: [
            { dKTDT: { D$gte: data.startDate } }, // Convert start date to ISO format
            { dKTDT: { D$lte: data.endDate } }, // Bill date less than or equal to end date
            ...(loc.length > 0 ? [{ oRGN: { 'D$in': loc } }] : []), // From Location condition
            ...(payBasis.length > 0 ? [{ pAYTYPNM: { 'D$in': payBasis } }] : []),
            {
              ...(tranMode.length > 0 ? { D$or: [{ tRNMODNM: { 'D$in': tranMode } }] } : [])
            },
            ...(data.ReportType == "Individual" ? [{ oRGN: { D$eq: this.storage.branch } }] : [{}]),
          ]
        }
      ),
    };

    // const buildRequestBody = (isLTL) => ({
    //   companyCode: this.storage.companyCode,
    //   reportName: "dockets-flow-ltl",
    //   filters: {
    //     filter: matchQuery()
    //   }
    // });
    const flowTypeMatch = true;
    const buildRequestBody = {
      companyCode: this.storage.companyCode,
      reportName: "dockets-flow-ltl",
      filters: {
        filter: {
          ...matchQuery, // Call the function to get the query object
        },
        joinFilters: [
          {
            "collectionName": "mf_headers",
            "filter": {
              ...(flowTypeMatch ? { 'D$eq': ["$Dmf_details.mFNO", "docNo"] } : {}),
            }
          },
          {
            "collectionName": "thc_summary",
            "filter": {
              ...(flowTypeMatch ? { 'D$eq': ["$Dmf_headers.tHC", "docNo"] } : {}),
            }
          },

        ]
      }
    }


    const buildRequestBodyftl = {
      companyCode: this.storage.companyCode,
      reportName: "dockets-flow-ftl",
      filters: {
        filter: {
          ...matchQuery, // Call the function to get the query object
        }
      }
    }

    if (data.loadtype != "FTL" && data.loadtype != "LTL" && data.loadtype != "BOTH") {
      if (data.loadtype.filter(item => item.selected).length == 0 || data.loadtype == null) {
        data.loadtype = 'BOTH'
      }
    }
    if (data.loadtype == 'FTL') {
      const res = await firstValueFrom(this.masterServices.masterMongoPost("generic/getReportData", buildRequestBodyftl));
      return { data: res.data.data, grid: res.data.grid };
    }
    if (data.loadtype == 'LTL') {
      const resLTL = await firstValueFrom(this.masterServices.masterMongoPost("generic/getReportData", buildRequestBody));
      return { data: resLTL.data.data, grid: resLTL.data.grid };
    }
    if (data.loadtype == 'BOTH') {
      const resLTL = await firstValueFrom(this.masterServices.masterMongoPost("generic/getReportData", buildRequestBody));
      //return { data: resLTL.data.data, grid: resLTL.data.grid };
      const res = await firstValueFrom(this.masterServices.masterMongoPost("generic/getReportData", buildRequestBodyftl));
      const combinedTransportDataArray = [...res.data.data, ...resLTL.data.data];
      return { data: combinedTransportDataArray, grid: res.data.grid };
    }
  }
}

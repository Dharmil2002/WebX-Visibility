import { Injectable } from "@angular/core";
import moment from "moment";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
@Injectable({
     providedIn: "root",
})

export class SalesRegisterService {

     constructor(
          private masterServices: MasterService,
          private storage: StorageService,
     ) { }

     async getsalesRegisterReportDetail(start, end, loct, toloc, payment, bookingtype, cnote, customer, mode, flowType, status) {
 
          const loc = loct ? loct.map(x => x.locCD) || [] : [];
          const location = toloc ? toloc.map(x => x.locCD) || [] : [];
          const paymentBasis = payment ? payment.map(x => x.payNm) || [] : [];
          const bookingType = bookingtype ? bookingtype.map(x => x.bkNm) || [] : [];
          const cust = customer ? customer.map(x => x.custCD) || [] : [];
          const transitMode = mode ? mode.map(x => x.mdCD) || [] : [];

          const flowTypeMatch = flowType === "O" ? [2] : flowType == "I" ? [3, 4] : undefined;

          const stsFin = status == "true" ? ["$isBILLED", true]
               : status == "false" ? ["$isBILLED", false] : "";

          const stsOps = status == 3 ? ["$sTS", 3]
               : status == 5 ? ["$sTS", 5] : "";

          const locFlow = flowType == "I" ? ["$dEST", this.storage.branch] : ["$oRGN", this.storage.branch]

          const filter = {

               'D$and': [
                    { dKTDT: { 'D$gte': start } }, // Convert start date to ISO format
                    { dKTDT: { 'D$lte': end } }, // Bill date less than or equal to end date      
                    {
                         'D$or': [{ cNL: false }, { cNL: { D$exists: false } }],
                    },
                    ...(loc.length > 0 ? [{ D$expr: { D$in: ["$oRGN", loc] } }] : []), // Location code condition
                    ...(location.length > 0 ? [{ D$expr: { D$in: ["$dEST", location] } }] : []), // Location code condition
                    ...(paymentBasis.length > 0 ? [{ D$expr: { D$in: ["$pAYTYPNM", paymentBasis] } }] : []), // Location code condition
                    ...(bookingType.length > 0 ? [{ D$expr: { D$in: ["$dELTYN", bookingType] } }] : []), // Location code condition
                    ...(cnote != "" ? [{ dKTNO: { 'D$eq': cnote } }] : []),
                    ...(cust.length > 0 ? [{ D$expr: { D$in: ["$bPARTY", cust] } }] : []), // Location code condition
                    ...(transitMode.length > 0 ? [{ D$expr: { D$in: ["$tRNMOD", transitMode] } }] : []), // Location code condition     

               ]
          }


          const reqBodyftl = {
               companyCode: this.storage.companyCode,
               reportName: "SalesRegisterAdvanceFTL",
               filters: {
                    filter: {
                         ...filter,

                    },
                    joinFilters: [
                         {
                              "collectionName": "docket_ops_det",
                              "filter": {
                                   ...(flowTypeMatch ? { 'D$in': ["$sTS", flowTypeMatch] } : {}),
                              }
                         },
                         {
                              "collectionName": "docket_ops_det",
                              "filter": {
                                   ...(locFlow ? { 'D$eq': locFlow } : {})
                              }
                         },
                         {
                              "collectionName": "docket_fin_det",
                              "filter": {
                                   ...(stsFin ? { D$eq: stsFin } : {})
                              }
                         },
                         {
                              "collectionName": "docket_fin_det",
                              "filter": {
                                   ...(stsOps ? { D$eq: stsOps } : {})
                              }
                         },
                    ]
               }
          }

          const resftl = await firstValueFrom(this.masterServices.masterMongoPost("generic/getReportData", reqBodyftl));
          // console.log(resftl.data);

          const reqBodyltl = {
               companyCode: this.storage.companyCode,
               reportName: "SalesRegisterAdvanceLTL",
               filters: {
                    filter: {
                         ...filter,
                    },
                    joinFilters: [
                         {
                              "collectionName": "docket_ops_det_ltl",
                              "filter": {
                                   ...(flowTypeMatch ? { 'D$in': ["$sTS", flowTypeMatch] } : {}),
                              }
                         },
                         {
                              "collectionName": "docket_ops_det_ltl",
                              "filter": {
                                   ...(locFlow ? { D$eq: locFlow } : {})
                              }
                         },
                         {
                              "collectionName": "docket_fin_det_ltl",
                              "filter": {
                                   ...(stsFin ? { D$eq: stsFin } : {})
                              }
                         },
                         {
                              "collectionName": "docket_fin_det_ltl",
                              "filter": {
                                   ...(stsOps ? { D$eq: stsOps } : {})
                              }
                         }

                    ]

               }
          }
          const resLtl = await firstValueFrom(this.masterServices.masterMongoPost("generic/getReportData", reqBodyltl));
          // console.log(resLtl.data);

          const data = [...resftl.data.data, ...resLtl.data.data]

          //  console.log(data);
          const details = data.map((item) => ({
               ...item,
               GCNDt: item.GCNDt ? moment(item.GCNDt).format("DD MMM YYYY") : "",
               EDD: item.EDD ? moment(item.EDD).format("DD MMM YYYY") : "",
               cNOTEDITDT: item.cNOTEDITDT ? moment(item.cNOTEDITDT).format("DD MMM YYYY") : "",
               invDt: item.invDt ? moment(item.invDt).format("DD MMM YYYY") : "",
               Time: item.Time ? moment(item.Time).format("HH:mm") : "",
               subTtl: item.subTtl ? item.subTtl.toFixed(2) : 0,
               gSTAmnt: item.gSTAmnt ? item.gSTAmnt.toFixed(2) : 0,
          }));

          const getDistinctByProperty = <T, K extends keyof T>(array: T[], key: K): T[] => {
               const seen = new Set();
               return array.filter(item => {
                    const value = item[key];
                    if (seen.has(value)) {
                         return false;
                    } else {
                         seen.add(value);
                         return true;
                    }
               });
          };
          return {
               data: getDistinctByProperty(details, 'GCNNo'),
               grid: resLtl.data.grid
          };
     }
}
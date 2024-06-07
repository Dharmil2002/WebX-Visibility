import { Injectable } from "@angular/core";
import moment from "moment";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
import { StateService } from "../masters/state/state.service";
@Injectable({
     providedIn: "root",
})

export class SalesRegisterService {

     constructor(
          private masterServices: MasterService,
          private storage: StorageService,
          private objStateService: StateService
     ) { }
   

     async getsalesRegisterReportDetail(start, end, loct, toloc, payment, bookingtype, cnote, customer, mode, flowType, status) {
          const loc = loct ? loct.map(x => x.locCD) || [] : [];
          const location = toloc ? toloc.map(x => x.locCD) || [] : [];
          const paymentBasis = payment ? payment.map(x => x.payNm) || [] : [];
          const bookingType = bookingtype ? bookingtype.map(x => x.bkNm) || [] : [];
          const cust = customer ? customer.map(x => x.custCD) || [] : [];
          const transitMode = mode ? mode.map(x => x.mdCD) || [] : [];
          const flowTypeMatch = flowType === "O" ? [2] : flowType == "I" ? [3, 4] : undefined;
          const stsFin =
               status == "true" ?
                    ["$docket_fin_det.isBILLED", true]
                    : status == "false" ? ["$docket_fin_det.isBILLED", false] : "";
          const stsOps = status == 3 ?
               ["$docket_ops_det.sTS", 3]
               : status == 5 ? ["$docket_ops_det.sTS", 5] : "";
          const locFlow = flowType == "I" ? ["$docket_ops_det.dEST", this.storage.branch] : ["$docket_ops_det.oRGN", this.storage.branch]
          let matchflowType = {}
          if (flowTypeMatch) {
               matchflowType = {
                    D$expr: {
                         "D$and": [
                              { D$in: ["$docket_ops_det.sTS", flowTypeMatch] },
                              { D$eq: locFlow }
                         ]
                    }
               }
          }
          let matchFin = {}
          let matchOps = {}
          if (stsFin) {
               matchFin = {
                    D$expr: {
                         D$eq: stsFin
                    }
               }
          }
          if (stsOps) {
               matchOps = {
                    D$expr: {
                         D$eq: stsOps
                    }
               }
          }
          let stsFinLTL =
               status == "true" ?
                    ["$docket_fin_det_ltl.isBILLED", true]
                    : status == "false" ? ["$docket_fin_det_ltl.isBILLED", false] : "";
          let stsOpsLTL = status == 3 ?
               ["$docket_ops_det_ltl.sTS", 3]
               : status == 5 ? ["$docket_ops_det_ltl.sTS", 5] : "";
          let locFlowLTL = flowType == "I" ? ["$docket_ops_det_ltl.dEST", this.storage.branch] : ["$docket_ops_det_ltl.oRGN", this.storage.branch]
          let matchflowTypeLTL = {}
          if (flowTypeMatch) {
               matchflowTypeLTL = {
                    D$expr: {
                         "D$and": [
                              { D$in: ["$docket_ops_det_ltl.sTS", flowTypeMatch] },
                              { D$eq: locFlowLTL }
                         ]
                    }
               }
          }
          let matchFinLTL = {}
          let matchOpsLTL = {}
          if (stsFinLTL) {
               matchFinLTL = {
                    D$expr: {
                         D$eq: stsFinLTL
                    }
               }
          }
          if (stsOpsLTL) {
               matchOpsLTL = {
                    D$expr: {
                         D$eq: stsOpsLTL
                    }
               }
          }
          let filterLTL = {
               filter: {
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
                         // ...(flowTypeMatch ? [matchflowTypeLTL] : []),
                         // ...(stsFinLTL ? [matchFinLTL] : []),
                         // ...(stsOpsLTL ? [matchOpsLTL] : []),
                    ]
               }, "joinFilters": [
                    locFlowLTL ? {
                         "collectionName": "docket_ops_det_ltl",
                         "filter": {
                              D$expr: {
                                   "D$and": [
                                        { D$in: ["$docket_ops_det_ltl.sTS", flowTypeMatch] },
                                        { D$eq: locFlowLTL }
                                   ]
                              }
                         }
                    } : null,
                    stsFinLTL ? {
                         "collectionName": "docket_fin_det_ltl",
                         "filter": {
                              D$expr: {
                                   D$eq: stsFinLTL
                              }
                         }
                    } : null,
                    stsOpsLTL ? {
                         "collectionName": "docket_fin_det_ltl",
                         "filter": {
                              D$expr: {
                                   D$eq: stsOpsLTL
                              }
                         }
                    } : null,

               ]
          }
          let filterFTL = {
               "filter": {
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
               },
               "joinFilters": [
                    {
                         "collectionName": "docket_ops_det",
                         "filter": {
                              D$expr: {
                                   "D$and": [
                                        { D$in: ["$docket_ops_det.sTS", flowTypeMatch] },
                                        { D$eq: locFlow }
                                   ]
                              }
                         }
                    },
                    stsFin ? {
                         "collectionName": "docket_fin_det",
                         "filter": {
                              D$expr: {
                                   D$eq: stsFin
                              }
                         }
                    } : null,
                    stsOps ? {
                         "collectionName": "docket_fin_det",
                         "filter": {
                              D$expr: {
                                   D$eq: stsOps
                              }
                         }
                    } : null,

               ]
          }

          const reqBodyftl = {
               companyCode: this.storage.companyCode,
               reportName: "SalesRegisterAdvanceFTL",
               filters: {
                    filter: {
                         ...filterFTL,

                    }
               }
          }

          const resftl = await firstValueFrom(this.masterServices.masterMongoPost("generic/getReportData", reqBodyftl));
          console.log(resftl.data);

          const reqBodyltl = {
               companyCode: this.storage.companyCode,
               reportName: "SalesRegisterAdvanceLTL",
               filters: {
                    filter: {
                         ...filterLTL,
                    }
               }
          }
          const resLtl = await firstValueFrom(this.masterServices.masterMongoPost("generic/getReportData", reqBodyltl));
          console.log(resLtl.data);

          const data = [...resftl.data.data, ...resLtl.data.data]

          console.log(data);
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

          return {
               data: details,
               grid: resLtl.data.grid
          };;
     }
}
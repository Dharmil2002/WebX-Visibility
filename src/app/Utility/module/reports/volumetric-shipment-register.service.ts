import { Injectable } from "@angular/core";
import moment from "moment";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
@Injectable({
     providedIn: "root",
})
export class VolumetricShipmentReportService {
     constructor(
          private masterServices: MasterService,
          private storage: StorageService
     ) { }

     // async getVolumetricShipmentDetail(data,mode) {
     //      const isEmptyDocNo = data.docNoArray.every(value => value === "");
     //      let matchQuery
     //      if (isEmptyDocNo) {
     //           matchQuery = {
     //                'D$and': [
     //                     { dKTDT: { 'D$gte': data.startDate } },
     //                     { dKTDT: { 'D$lte': data.endDate } },
     //                     {
     //                          'D$or': [{ cNL: false }, { cNL: { D$exists: false } }],
     //                     },
     //                     ...([{ oRGN: { 'D$in': data.branch } }]),
     //                     ...(data.customer.length > 0 ? [{ 'bPARTY': { 'D$in': data.customer } }] : []),
     //                ]
     //           };
     //      }
     //      if (!isEmptyDocNo) {
     //           matchQuery = {
     //                'dKTNO': { 'D$in': data.docNoArray }
     //           };
     //      }

     //      const collectionName = mode === 'FTL' ? 'dockets' : 'dockets_ltl';
     //      const from = mode === 'FTL' ? 'docket_invoices' : 'docket_invoices_ltl';

     //      const reqBody = {
     //           companyCode: this.storage.companyCode,
     //           collectionName: collectionName,
     //           filters:
     //                [
     //                     {
     //                          D$match: matchQuery,
     //                     },
     //                     {
     //                          D$lookup: {
     //                               from:from,
     //                               localField: "dKTNO",
     //                               foreignField: "dKTNO",
     //                               as: "docket_invoices"
     //                          }
     //                     },
     //                     {
     //                          D$unwind: {
     //                               path: "$docket_invoices",
     //                               preserveNullAndEmptyArrays: true
     //                          }
     //                     },
     //                     {
     //                          D$project: {
     //                               dktNo: {
     //                                    D$ifNull: ["$dKTNO", ""]
     //                               },
     //                               dktDt: {
     //                                    D$dateToString: {
     //                                         format: "%Y-%m-%d",
     //                                         date: "$dKTDT",
     //                                    },
     //                               },
     //                               invNo: {
     //                                    D$ifNull: ["$docket_invoices.iNVNO", ""]
     //                               },
     //                               invDt: {
     //                                    D$dateToString: {
     //                                         format: "%Y-%m-%d",
     //                                         date: "$docket_invoices.eNTDT",
     //                                    },
     //                               },
     //                               packT: {
     //                                    D$ifNull: ["$pKGTYN", ""]
     //                               },
     //                               volum: {
     //                                    D$ifNull: ["", ""]
     //                               },
     //                               CFTRa: {
     //                                    D$ifNull: ["$cFTRATO", ""]
     //                               },
     //                               len: {
     //                                    D$ifNull: ["", ""]
     //                               },
     //                               bth: {
     //                                    D$ifNull: ["", ""]
     //                               },
     //                               ht: {
     //                                    D$ifNull: ["", ""]
     //                               },
     //                               pkg: {
     //                                    D$ifNull: ["$pKGS", ""]
     //                               },
     //                               cbw: {
     //                                    D$ifNull: ["", ""]
     //                               },
     //                               cpkg: {
     //                                    D$ifNull: ["", ""]
     //                               },
     //                               actw: {
     //                                    D$ifNull: ["$aCTWT", ""]
     //                               },
     //                               chw: {
     //                                    D$ifNull: ["$cHRWT", ""]
     //                               },
     //                               org: {
     //                                    D$ifNull: ["$oRGN", ""]
     //                               },
     //                               dst: {
     //                                    D$ifNull: ["$dEST", ""]
     //                               },
     //                               fcy: {
     //                                    D$ifNull: ["$fCT", ""]
     //                               },
     //                               tcy: {
     //                                    D$ifNull: ["$tCT", ""]
     //                               },
     //                               pyb: {
     //                                    D$ifNull: ["$pAYTYPNM", ""]
     //                               },
     //                               trm: {
     //                                    D$ifNull: ["$tRNMODNM", ""]
     //                               },
     //                               bkt: {
     //                                    D$ifNull: ["$dKTNO", ""]
     //                               },
     //                               bpc: {
     //                                    D$ifNull: ["$bPARTY", ""]
     //                               },
     //                               bpn: {
     //                                    D$ifNull: ["$bPARTYNM", ""]
     //                               },
     //                               cnc: {
     //                                    D$ifNull: ["$cSGNCD", ""]
     //                               },
     //                               cnn: {
     //                                    D$ifNull: ["$cSGNNM", ""]
     //                               },
     //                               cnec: {
     //                                    D$ifNull: ["$cSGECD", ""]
     //                               },
     //                               cnen: {
     //                                    D$ifNull: ["$cSGENM", ""]
     //                               },
     //                               ctn: {
     //                                    D$ifNull: ["", ""]
     //                               },
     //                          }
     //                     }
     //                ]
     //      }

     //      const res = await firstValueFrom(this.masterServices.masterMongoPost("generic/query", reqBody));
     //      return res.data;
     // }

     async getVolumetricShipmentDetail(data) {
          const isEmptyDocNo = data.docNoArray.every(value => value === "");
          let matchQuery
          if (isEmptyDocNo) {
               matchQuery = {
                    'D$and': [
                         { dKTDT: { 'D$gte': data.startDate } },
                         { dKTDT: { 'D$lte': data.endDate } },
                         {
                              'D$or': [{ cNL: false }, { cNL: { D$exists: false } }],
                         },
                         ...(data.mode === "LTL" ? [{ iSVOL: true }] : []),
                         ...([{ oRGN: { 'D$in': data.branch } }]),
                         ...(data.customer.length > 0 ? [{ 'bPARTY': { 'D$in': data.customer } }] : []),
                    ]
               };
          }
          if (!isEmptyDocNo) {
               matchQuery = {
                    'dKTNO': { 'D$in': data.docNoArray }
               };
          }
          const reportName = data.mode === 'FTL' ? 'VolumetricShipmentRegister' : 'VolumetricShipmentRegisterltl';

          const reqBody = {
               companyCode: this.storage.companyCode,
               reportName: reportName,
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
               dktDt: item.dktDt ? moment(item.dktDt).format("DD MMM YYYY") : "",
               invDt: item.invDt ? moment(item.invDt).format("DD MMM YYYY") : ""
          }));
          return {
               data: details,
               grid: res.data.grid
          };
     }
}
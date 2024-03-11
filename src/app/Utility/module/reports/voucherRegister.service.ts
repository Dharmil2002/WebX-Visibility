import { Injectable } from "@angular/core";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
import { firstValueFrom } from "rxjs";
import moment from "moment";
@Injectable({
     providedIn: "root",
})
export class voucherRegService {
     constructor(
          private masterServices: MasterService,
          private storage: StorageService
     ) { }

     async getvoucherRegReportDetail(data) {
          const voucherAmt = data.vouchamt ? data.vouchamt.split("-") : "";
          // const isEmptyDocNo = data.vNoArray.every(value => value === "") && data.docNoArray.every(value => value === "")
          const isEmptyDocNo = (data.vNoArray.length === 1 && data.vNoArray[0].length === 0) && (data.docNoArray.length === 1 && data.docNoArray[0].length === 0);
          let matchQuery
          if (isEmptyDocNo) {
               matchQuery = {
                    'D$and': [
                         { tTDT: { 'D$gte': data.startDate } }, // Convert start date to ISO format
                         { tTDT: { 'D$lte': data.endDate } }, // date less than or equal to end date
                         {
                              'D$or': [{ cNL: false }, { cNL: { D$exists: false } }],
                         },
                         ...(data.voucherTpData.length > 0 ? [{ vTYP: { 'D$in': data.voucherTpData } }] : []),
                         ...(data.tranTpData.length > 0 ? [{ tTYP: { 'D$in': data.tranTpData } }] : []),
                         ...(data.partyTpData.length > 0 ? [{ pRE: { 'D$in': data.partyTpData } }] : []),
                         ...(data.partyNmData.length > 0 ? [{ pCODE: { 'D$in': data.partyNmData } }] : []),
                         ...([{ bRC: { 'D$in': data.branch } }]), //branch condition
                         ...(data.cheqNo != "" ? [{ rNO: { 'D$eq': parseInt(data.cheqNo) } }] : []), //chequeNo condition
                         ...(data.vouchamt !== '' ? [{ nNETP: { 'D$gte': parseInt(voucherAmt[0]) } }, { nNETP: { 'D$lte': parseInt(voucherAmt[1]) } }] : []),
                    ],
               };
          }
          if (!isEmptyDocNo) {
               // matchQuery = {
               //      'vNO': { 'D$in': data.vNoArray },
               //      'vTNO': { 'D$in': data.docNoArray },
               // };
               matchQuery = {

                    'D$or': [
                         // Match documents where vNO is in the provided vNoArray
                         { 'vNO': { 'D$in': data.vNoArray } },

                         // Match documents where vTNO is in the provided docNoArray
                         { 'vTNO': { 'D$in': data.docNoArray } }
                    ]
               };
          }

          // const reqBody = {
          //      companyCode: this.storage.companyCode,
          //      collectionName: "acc_trans_2425",
          //      filters:
          //           [
          //                {
          //                     D$match: matchQuery,
          //                },
          //                {
          //                     D$addFields: {
          //                          account: {
          //                               D$concat: [
          //                                    {
          //                                         D$toString: "$aCCCD",
          //                                    },
          //                                    " : ",
          //                                    "$aCCNM",
          //                               ],
          //                          },
          //                          party: {
          //                               D$concat: [
          //                                    {
          //                                         D$toString: "$pARTYCD",
          //                                    },
          //                                    " : ",
          //                                    "$pARTYNM",
          //                               ],
          //                          }
          //                     }
          //                },
          //                {
          //                     D$group: {
          //                          _id: "$vNO",
          //                          vNO: {
          //                               D$first: "$vNO",
          //                          },
          //                          vDt: {
          //                               D$first: "$vDT",
          //                          },
          //                          vTp: {
          //                               D$first: "$vTYPNM",
          //                          },
          //                          accLoc: {
          //                               D$first: "$lOC",
          //                          },
          //                          accCdDes: {
          //                               D$first: "$account",
          //                          },
          //                          DA: {
          //                               D$first: "$dR",
          //                          },
          //                          CA: {
          //                               D$first: "$cR",
          //                          },
          //                          Narr: {
          //                               D$first: "$nRT",
          //                          },
          //                          PT: {
          //                               D$first: "$pARTYTY",
          //                          },
          //                          PCN: {
          //                               D$first: "$party",
          //                          },
          //                          TT: {
          //                               D$first: "$tTYPNM",
          //                          },
          //                          // DocNo: {},
          //                          // CUNo: {},
          //                          // CUDate: {},
          //                          EB: {
          //                               D$first: "$eNTBY",
          //                          },
          //                          EDT: {
          //                               D$first: "$eNTDT",
          //                          },
          //                          EL: {
          //                               D$first: "$eNTLOC",
          //                          },
          //                     },
          //                },

          //           ]
          // };

          const reqBody = {
               companyCode: this.storage.companyCode,
               collectionName: "voucher_trans",
               filters:
                    [
                         {
                              D$match: matchQuery,
                         },
                         {
                              D$addFields: {
                                   pCdNM: {
                                        D$concat: [
                                             {
                                                  D$toString: "$pCODE",
                                             },
                                             " : ",
                                             "$pNAME",
                                        ],
                                   },
                                   accCdNM: {
                                        D$concat: [
                                             {
                                                  D$toString: "$vTranDet.aCOD",
                                             },
                                             " : ",
                                             "$vTranDet.aNM",
                                        ],
                                   }
                              },
                         },
                         {
                              "D$lookup": {
                                   "from": "voucher_trans_details",
                                   "let": { "vNO": "$vNO" },
                                   "pipeline": [
                                        {
                                             "D$match": {
                                                  "D$and": [
                                                       { "D$expr": { "D$eq": ["$vNO", "$$vNO"] } },
                                                       { "cNL": { "D$in": [false, null] } }
                                                  ]
                                             }
                                        }
                                   ],
                                   "as": "vTranDet"
                              }
                         },
                         {
                              "D$unwind": { "path": "$vTranDet", "preserveNullAndEmptyArrays": true }
                         },
                         {
                              "D$project": {
                                   "vNO": { "D$ifNull": ["$vNO", ""] },
                                   "vDt": { "D$ifNull": ["$tTDT", ""] },
                                   "vTp": { "D$ifNull": ["$vTYPNM", ""] },
                                   "accLoc": { "D$ifNull": ["$lOC", ""] },
                                   "accCdDes": { "D$concat": [{ "D$ifNull": ["$vTranDet.aCOD", ""] }, " - ", { "D$ifNull": ["$vTranDet.aNM", ""] }] },
                                   // "accCdDes":{ "D$ifNull": ["$accCdNM", ""] },
                                   "DA": { "D$ifNull": ["$vTranDet.dBTAMT", ""] },
                                   "CA": { "D$ifNull": ["$vTranDet.cDAMT", ""] },
                                   "Narr": { "D$ifNull": ["$vTranDet.nAR", ""] },
                                   "PT": { "D$ifNull": ["$pRE", ""] },
                                   // "PCN": { "D$concat": [{ "D$ifNull": ["$pCODE", ""] }, " : ", { "D$ifNull": ["$pNAME", ""] }] },
                                   "PCN": { "D$ifNull": ["$pCdNM", ""] },
                                   "TT": { "D$ifNull": ["$tTYPNM", ""] },
                                   "DocNo": { "D$ifNull": ["$vTNO", ""] },
                                   "CUNo": {
                                        "D$cond": {
                                             "if": { "D$eq": ["$pMD", 'Cheque'] },
                                             "then": "$rNO",
                                             "else": ""
                                        }
                                   },
                                   "CUDate": { "D$ifNull": ["$dT", ""] },
                                   "EB": { "D$ifNull": ["$eNTBY", ""] },
                                   "EDT": { "D$ifNull": ["$eNTDT", ""] },
                                   "EL": { "D$ifNull": ["$eNTLOC", ""] },
                                   "vamount": { "D$ifNull": ["$nNETP", ""] }
                              }
                         }
                    ]
          }

          const res = await firstValueFrom(this.masterServices.masterMongoPost("generic/query", reqBody));
          // Format the date using moment
          res.data.forEach(item => {
               item.vDt = item.vDt ? moment(item.vDt).format('YYYY-MM-DD') : "";
               item.EDT = item.EDT ? moment(item.EDT).format('YYYY-MM-DD') : "";
               item.CUDate = item.CUDate ? moment(item.CUDate).format('YYYY-MM-DD') : ""
          });
          return res.data;

     }
}
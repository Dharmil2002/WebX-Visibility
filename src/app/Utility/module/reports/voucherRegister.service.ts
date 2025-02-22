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

          const reqBody = {
               companyCode: this.storage.companyCode,
               collectionName: "voucher_trans",
               filters:
                    [
                         {
                              D$match: matchQuery,
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
                              "D$addFields": {
                                   "pCdNM": {
                                        "D$cond": {
                                             "if": { "D$ne": ["$pCODE", ""] },
                                             "then": { "D$concat": [{ "D$toString": "$pCODE" }, " : ", "$pNAME"] },
                                             "else": ""
                                        }
                                   },
                                   "accCdNM": {
                                        "D$cond": {
                                             "if": { "D$ne": ["$vTranDet.aCOD", ""] },
                                             "then": { "D$concat": [{ "D$toString": "$vTranDet.aCOD" }, " : ", { "D$toString": "$vTranDet.aNM" }] },
                                             "else": ""
                                        }
                                   }
                              }
                         },
                         {
                              "D$project": {
                                   "vNO": { "D$ifNull": ["$vNO", ""] },
                                   "vDt": { "D$ifNull": ["$tTDT", ""] },
                                   "vTp": { "D$ifNull": ["$vTYPNM", ""] },
                                   "accLoc": { "D$ifNull": ["$lOC", ""] },
                                   "accCdDes": { "D$ifNull": ["$accCdNM", ""] },
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
               item.vDt = item.vDt ? moment(item.vDt).format('DD MMM YY') : "";
               item.EDT = item.EDT ? moment(item.EDT).format('DD MMM YY') : "";
               item.CUDate = item.CUDate ? moment(item.CUDate).format('DD MMM YY') : ""
          });
          return res.data;

     }
}
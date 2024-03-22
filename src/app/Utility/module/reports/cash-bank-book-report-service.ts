import { Injectable } from '@angular/core';
import moment from 'moment';
import { firstValueFrom } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';
@Injectable({
     providedIn: 'root'
})
export class CashBankBookReportService {

     constructor(private masterService: MasterService,
          private storage: StorageService,) { }

     async getCashBankBook(detail) {
          let filter = {
               vNO: { D$in: detail.data.vNO },
          }
          if (detail.data.acCode.length > 0) {
               filter['aCCCD'] = { D$in: detail.data.acCode }
          }

          // if (data.endAmt) {
          //      filter = { D$or: [{ cR: { D$gt: parseFloat(data.startAmt), D$lt: parseFloat(data.endAmt) } }, { dR: { D$gt: parseFloat(data.startAmt), D$lt: parseFloat(data.endAmt) } }] }
          // }
          // Build the match query based on provided conditions       
          // let matchQuery = {
          //      'D$and': [
          //           { vDT: { 'D$gte': data.startValue } }, // Convert start date to ISO format
          //           { vDT: { 'D$lte': data.endValue } },
          //           {
          //                'D$or': [{ cNL: false }, { cNL: { D$exists: false } }],
          //           },
          //           filter,
          //           // ...([{ lOC: { 'D$in': data.branch } }]), //branch condition
          //           ...(data.accountCode.length > 0 ? [{ aCCCD: { 'D$in': data.accountCode } }] : []), // account code condition
          //      ],
          // };

          const reqBody = {
               companyCode: this.storage.companyCode,
               collectionName: "acc_trans_2425",
               filters: [
                    {
                         D$match: filter,
                    },
                    {
                         D$lookup: {
                              from: "account_detail",
                              let: {
                                   aCCD: "$aCCD"
                              },
                              pipeline: [
                                   {
                                        D$match: {
                                             D$and: [
                                                  {
                                                       D$expr: {
                                                            D$eq: ["$aCCCD", "$$aCCD"],
                                                       },
                                                  },
                                             ],
                                        },
                                   },
                              ],
                              as: "accountdetail",
                         }
                    },
                    {
                         D$addFields: {
                              // transTypeADF: "$tTYPNM",
                              party: {
                                   D$concat: [
                                        {
                                             D$toString: "$pARTYCD",
                                        },
                                        "-",
                                        "$pARTYNM",
                                   ]
                              },
                              ledger: {
                                   D$concat: [
                                        {
                                             D$toString: "$aCCCD",
                                        },
                                        " : ",
                                        "$aCCNM",
                                   ]
                              },
                              // ledger: {
                              //      D$cond: {
                              //           if: { D$in: [detail.data.accountCode, "$accountdetail.gRPCD"] },
                              //           then: { D$concat: [{ D$toString: "$aCCCD" }, " : ", "$aCCNM"] },
                              //           else: ""
                              //      }
                              // },
                              // ledger: {
                              //      "D$cond": {
                              //           "if": {
                              //                "D$eq": ["$accountdetail.gRPCD", "AST003"]
                              //           },
                              //           "then": {
                              //                "D$concat": [
                              //                     {
                              //                          "$toString": "$aCCCD"
                              //                     },
                              //                     " : ",
                              //                     "$aCCNM"
                              //                ]
                              //           },
                              //           "else": ""
                              //      }
                              // }
                         }
                    },
                    {
                         D$lookup: {
                              from: "voucher_trans",
                              let: {
                                   vNO: "$vNO"
                              },
                              pipeline: [
                                   {
                                        D$match: {
                                             D$and: [
                                                  {
                                                       D$expr: {
                                                            D$eq: ["$vNO", "$$vNO"],
                                                       },
                                                  },
                                             ],
                                        },
                                   },
                              ],
                              as: "vouchdetails",
                         }
                    },
                    {
                         D$addFields: {
                              "pMD": { D$arrayElemAt: ["$vouchdetails.pMD", 0] },
                              "rNO": { D$arrayElemAt: ["$vouchdetails.rNO", 0] },
                              "dT": { D$arrayElemAt: ["$vouchdetails.dT", 0] }
                         }
                    },
                    {
                         D$addFields: {
                              // referenceNo: {
                              //      D$cond: {
                              //           if: {
                              //                D$eq: [
                              //                     "$pMD",
                              //                     "Cheque",
                              //                ],
                              //           },
                              //           then: {
                              //                D$concat: [
                              //                     { D$toString: "$rNO" },
                              //                     ":",
                              //                     { D$toString: "$dT" }
                              //                ],
                              //           },
                              //           else: ""
                              //      },
                              // },
                              referenceNo: {
                                   D$cond: {
                                        if: {
                                             D$in: [
                                                  "$pMD",
                                                  ["Cheque", "RTGS", "NEFT", "IMPS"],
                                             ],
                                        },
                                        then: {
                                             D$concat: [
                                                  { D$toString: "$rNO" },
                                                  ":",
                                                  { D$toString: "$dT" }
                                             ],
                                        },
                                        else: ""
                                   },
                              }

                         },
                    },
                    //json for CSVHeader
                    {
                         "D$project": {
                              "vDate": { "D$ifNull": ["$vDT", ""] },
                              "transType": { "D$ifNull": ["$tTYPNM", ""] },
                              "vno": { "D$ifNull": ["$vNO", ""] },
                              "party": { "D$ifNull": ["$party", ""] },
                              "legderAcc": { "D$ifNull": ["$ledger", ""] },
                              "debit": { "D$ifNull": ["$dR", ""] },
                              "credit": { "D$ifNull": ["$cR", ""] },
                              // "bal": { "D$ifNull": [0, ""] },
                              "bal": {
                                   "D$sum": {
                                        "D$subtract": ["$cR", "$dR"]
                                   }
                              },
                              "refNo": { "D$ifNull": ["$referenceNo", ""] },
                              // "refNo": { "D$ifNull": ["$refNo", ""] },
                              "rNO": { "D$ifNull": ["$rNO", "",], },
                              "dT": { "D$ifNull": ["$dT", "",], },
                              "doc": { "D$ifNull": ["$docNo", ""] },
                              "nar": { "D$ifNull": ["$nRT", ""] },
                              "loc": { "D$ifNull": ["$lOC", ""] },
                              "pMD": { "D$ifNull": ["$pMD", ""] }
                         }
                    }
               ]
          }
          // Check if startAmt and endAmt exist
          if (detail.data.startAmt && detail.data.endAmt) {
               // Create a new filter object with D$or property
               const orFilter = {
                    D$or: [
                         { cR: { D$gt: parseFloat(detail.data.startAmt), D$lt: parseFloat(detail.data.endAmt) } },
                         { dR: { D$gt: parseFloat(detail.data.startAmt), D$lt: parseFloat(detail.data.endAmt) } }
                    ]
               };
               // Merge the orFilter with the existing filter
               reqBody.filters[0].D$match = { ...reqBody.filters[0].D$match, ...orFilter };
          }
          const res = await firstValueFrom(this.masterService.masterMongoPost("generic/query", reqBody));
          if (res.data && res.data.length > 0) {
               let reportData: any[] = [];
               // reportData = res.data;
               // Conversion using map
               reportData = res.data.map((item) => {
                    return {
                         ...item,
                         debit: parseFloat(parseFloat(item.debit).toFixed(2)),
                         credit: parseFloat(parseFloat(item.credit).toFixed(2)),
                         bal: parseFloat(parseFloat(item.bal).toFixed(2)),
                         vDate: item.vDate ? moment(item.vDate).format('DD-MM-YYYY') : "",
                         refNo: item.rNO ? `${item.pMD} ${item.rNO}, dated ${moment(item.dT).format("DD-MM-YYYY")}` : ""
                    }
               });

               // Conversion back to floats using forEach
               const total = reportData.reduce((accumulator, item) => {

                    // // Format date
                    // item.vDate = item.vDate ? moment(item.vDate).format('DD-MM-YYYY') : "";

                    // // Generate reference number if available
                    // if (item.rNO) {
                    //      item.refNo = `Cheque ${item.rNO}, dated ${moment(item.dT).format("DD-MM-YYYY")}`;
                    // }

                    // Update the totals
                    accumulator.totalDebit += item.debit ? parseFloat(item.debit) : 0.00;
                    accumulator.totalCredit += item.credit ? parseFloat(item.credit) : 0.00;
                    accumulator.totalBalance += item.bal ? parseFloat(item.bal) : 0.00;

                    return accumulator;
               }, { totalDebit: 0, totalCredit: 0, totalBalance: 0, });

               // Add opening balance row
               const firstRow = {
                    "vDate": "",
                    "transType": "",
                    "vno": "",
                    "party": "",
                    "legderAcc": "Opening Balance :",
                    "debit": 0.00,
                    "credit": 0.00,
                    "bal": 0.00,
                    "refNo": "",
                    "doc": "",
                    "nar": "",
                    "loc": "",
               };
               reportData.unshift(firstRow);

               // // Add total row
               const lastRow = {
                    "vDate": "",
                    "transType": "",
                    "vno": "",
                    "party": "",
                    "legderAcc": "Total :",
                    "debit": parseFloat(total.totalDebit.toFixed(2)),
                    "credit": parseFloat(total.totalCredit.toFixed(2)),
                    "bal": parseFloat(total.totalBalance.toFixed(2)),
                    "refNo": "",
                    "doc": "",
                    "nar": "",
                    "loc": "",
               };
               reportData.push(lastRow);

               return reportData;
          }
     }


     async getDetailCashBankBook(data) {
          // let filter = {}
          // if (data.endAmt) {
          //      filter = { D$or: [{ cR: { D$gt: parseFloat(data.startAmt), D$lt: parseFloat(data.endAmt) } }, { dR: { D$gt: parseFloat(data.startAmt), D$lt: parseFloat(data.endAmt) } }] }
          // }
          let matchQuery = {
               'D$and': [
                    { vDT: { 'D$gte': data.startValue } }, // Convert start date to ISO format
                    { vDT: { 'D$lte': data.endValue } },
                    { 'D$or': [{ cNL: false }, { cNL: { D$exists: false } }] },
                    // filter,
                    ...(data.Individual == "Y" ? [{ lOC: { 'D$in': [data.branch] } }] : []),
                    ...(data.accountCode.length > 0 ? [{ aCCCD: { 'D$in': data.accountCode } }] : [])
               ]
          };

          const reqBody = {
               companyCode: this.storage.companyCode,
               collectionName: "acc_trans_2425",
               filters: [
                    { D$match: matchQuery },
                    data.reportType == "D" ? {
                         D$addFields: {
                              month: {
                                   D$switch: {
                                        "branches": [
                                             { "case": { "D$eq": [{ "D$month": "$vDT" }, 1] }, "then": "January" },
                                             { "case": { "D$eq": [{ "D$month": "$vDT" }, 2] }, "then": "February" },
                                             { "case": { "D$eq": [{ "D$month": "$vDT" }, 3] }, "then": "March" },
                                             { "case": { "D$eq": [{ "D$month": "$vDT" }, 4] }, "then": "April" },
                                             { "case": { "D$eq": [{ "D$month": "$vDT" }, 5] }, "then": "May" },
                                             { "case": { "D$eq": [{ "D$month": "$vDT" }, 6] }, "then": "June" },
                                             { "case": { "D$eq": [{ "D$month": "$vDT" }, 7] }, "then": "July" },
                                             { "case": { "D$eq": [{ "D$month": "$vDT" }, 8] }, "then": "August" },
                                             { "case": { "D$eq": [{ "D$month": "$vDT" }, 9] }, "then": "September" },
                                             { "case": { "D$eq": [{ "D$month": "$vDT" }, 10] }, "then": "October" },
                                             { "case": { "D$eq": [{ "D$month": "$vDT" }, 11] }, "then": "November" },
                                             { "case": { "D$eq": [{ "D$month": "$vDT" }, 12] }, "then": "December" }
                                        ],
                                        "default": ""
                                   }
                              },
                              bal: { D$subtract: ["$cR", "$dR"] }
                         }
                    } : {},
                    {
                         D$group: {
                              "_id": data.reportType == "D" ? "$month" : "$lOC",
                              "dr": { "D$sum": "$dR" },
                              "cr": { "D$sum": "$cR" },
                              "vNO": { "D$push": "$vNO" },
                              "bal": { "D$sum": "$bal" }
                         }
                    },
                    {
                         D$project: {
                              "_id": 0,
                              "month": "$_id",
                              "dr": 1,
                              "cr": 1,
                              "vNO": 1,
                              "bal": 1
                         }
                    }
               ]
          };
          try {
               reqBody.filters = reqBody.filters.filter(obj => Object.keys(obj).length !== 0);
               const res = await firstValueFrom(this.masterService.masterMongoPost("generic/query", reqBody));
               if (res.data && res.data.length > 0) {
                    let reportData = res.data;
                    const total = res.data.reduce((accumulator, item) => {
                         accumulator.totalMonDebit += item.dr ? parseFloat(item.dr) : 0;
                         accumulator.totalMonCredit += item.cr ? parseFloat(item.cr) : 0;
                         accumulator.totalMonBal += item.bal ? parseFloat(item.bal) : 0;
                         return accumulator;
                    }, { totalMonDebit: 0, totalMonCredit: 0, totalMonBal: 0 });
                    reportData.forEach(element => {
                         element.bal = element.bal?.toFixed(2) || 0.00;
                         element.dr = element.dr?.toFixed(2) || 0.00;
                         element.cr = element.cr?.toFixed(2) || 0.00;
                    });
                    if (data.reportType == "D") {
                         // Add opening balance row
                         const firstRow = {
                              "month": "Opening Balance :",
                              "dr": 0.00,
                              "cr": 0.00,
                              "bal": 0.00
                         };
                         reportData.unshift(firstRow);
                    }
                    else {
                         reportData.forEach(element => {
                              element.openingBalance = 0.00
                         });
                    }
                    const monTotalLastRow = {
                         "month": "Total :",
                         "dr": total.totalMonDebit.toFixed(2),
                         "cr": total.totalMonCredit.toFixed(2),
                         "bal": total.totalMonBal.toFixed(2),
                         "openingBalance": 0.00
                    };
                    reportData.push(monTotalLastRow);

                    return reportData;
               }
          } catch (error) {
               console.error("Error:", error);
               throw error;
          }
     }

}
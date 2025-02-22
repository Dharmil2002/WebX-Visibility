import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
import * as XLSX from 'xlsx';
@Injectable({
     providedIn: "root",
})
export class CustOutstandingService {
     constructor(
          private masterServices: MasterService,
          private storage: StorageService
     ) { }
     getISODateOrNull(date) {
          if (isNaN(date.getTime())) {
               return ''; // Return empty string if date is invalid
          } else {
               return date.toISOString(); // Convert to ISO format if date is valid
          }
     }
     async getcustomerOutstandingReportDetail(ASonDateValue, start, end, loct, cust, gstST, reportbasis, custGrp) {
          const loc = loct ? loct.map(x => x.locCD) || [] : [];
          const cus = cust ? cust.map(x => x.custCD) || [] : [];
          const gstState = gstST ? gstST.map(x => x.gstNM) || [] : [];
          const custgrp = custGrp ? custGrp.map(x => x.cgpCD) || [] : [];
          let ASonDateValueValid = true;
          let dtmrequest = {}
          if (ASonDateValue == "Invalid Date") {
               ASonDateValueValid = false;
               dtmrequest = { D$lte: this.getISODateOrNull(end) }
          }
          else {
               dtmrequest = { D$lte: this.getISODateOrNull(ASonDateValue) }
          }

          let matchQuery = {
               'D$and': [
                    // {
                    //      bILLNO: "BLMUMBHIND2425000001",
                    // },
                    { bGNDT: { 'D$gte': start } }, // Convert start date to ISO format
                    { bGNDT: { 'D$lte': end } }, // Bill date less than or equal to end date      
                    {
                         'D$or': [{ cNL: false }, { cNL: { D$exists: false } }],
                    },
                    ...(reportbasis ? [{ 'bSTS': parseInt(reportbasis) }] : []),
                    ...(loc.length > 0 ? [{ bLOC: { 'D$in': loc } }] : []), // Location condition
                    ...(cus.length > 0 ? [{ 'D$expr': { 'D$in': ['$cUST.cD', cus] } }] : []), // customer condition
                    ...(gstState.length > 0 ? [{ 'D$expr': { 'D$in': ['$cUST.sT', gstState] } }] : []), // GST State condition
                    ...(custgrp.length > 0 ? [{ 'D$expr': { 'D$in': ['$cUST.cGCD', custgrp] } }] : []), // customer Group condition
               ]
          };

          const reqBody = {
               companyCode: this.storage.companyCode,
               collectionName: "cust_bill_headers",
               filters:
                    [
                         {
                              D$match: matchQuery,
                         },

                         {
                              D$addFields: {
                                   customer: {
                                        D$concat: [
                                             {
                                                  D$toString: "$cUST.cD",
                                             },
                                             " : ",
                                             "$cUST.nM",
                                        ],
                                   },
                                   custGrp: {
                                        D$concat: [
                                             {
                                                  D$toString: "$cUST.cGCD",
                                             },
                                             " : ",
                                             "$cUST.cGNM",
                                        ],
                                   },
                                   age: {
                                        D$floor: {
                                             D$divide: [
                                                  {
                                                       D$subtract: [
                                                            new Date(),
                                                            "$bGNDT",
                                                       ],
                                                  },
                                                  86400000,
                                             ],
                                        },
                                   },
                              },
                         },
                         {
                              D$lookup: {
                                   from: "cust_bill_collection",
                                   let: {
                                        bILLNO: "$bILLNO"
                                   },
                                   pipeline: [
                                        {
                                             D$match: {
                                                  D$and: [
                                                       {
                                                            D$expr: {
                                                                 D$eq: ["$bILLNO", "$$bILLNO"],
                                                            },
                                                       },
                                                       // {
                                                       //      dTM: { D$lte: ASonDateValue }
                                                       // },
                                                       {
                                                            dTM: dtmrequest
                                                       },
                                                       {
                                                            cNL: {
                                                                 D$in: [false, null],
                                                            },
                                                       },
                                                  ],
                                             },
                                        },
                                   ],
                                   as: "coll",
                              },
                         },
                         {
                              D$lookup: {
                                   from: "cd_note_header",
                                   let: {
                                        bILLNO: "$bILLNO"
                                   },
                                   pipeline: [
                                        {
                                             D$match: {
                                                  D$and: [
                                                       {
                                                            D$expr: {
                                                                 D$eq: ["$bILLNO", "$$bILLNO"],
                                                            },
                                                       },
                                                       {
                                                            cNL: {
                                                                 D$in: [false, null],
                                                            },
                                                       },
                                                  ],
                                             },
                                        },
                                   ],
                                   as: "creditnote",
                              },
                         },
                         {
                              D$project:
                              {
                                   customer: 1,
                                   custGrp: 1,
                                   bLOC: 1,
                                   aMT: 1,
                                   bSTS: 1,
                                   age: 1,
                                   unsubmittedAmt: {
                                        D$cond: {
                                             if: {
                                                  D$eq: ["$bSTS", 1],
                                             },
                                             then: "$aMT",
                                             else: 0,
                                        },
                                   },
                                   submittedAmt: {
                                        D$cond: {
                                             if: {
                                                  D$eq: ["$bSTS", 3],
                                             },
                                             then: "$aMT",
                                             else: 0,
                                        },
                                   },
                                   // collectedAmt: {
                                   //      D$sum: "$cOL.aMT",
                                   // },
                                   collectedAmt: {
                                        D$sum: "$cOL.aMT",
                                   },
                                   creditNoteAmt: {
                                        D$sum: "$creditnote.aMT",
                                   },
                              },
                         },
                         {
                              D$addFields: {
                                   pendingAmt: {
                                        D$max: [
                                             0,
                                             {
                                                  // D$subtract: ["$aMT", "$collectedAmt"],
                                                  D$subtract: [
                                                       {
                                                            D$subtract: ["$aMT", "$collectedAmt"]
                                                       },
                                                       "$creditNoteAmt"
                                                  ]
                                             },
                                        ],
                                   },
                              },
                         },
                         {
                              D$group: {
                                   _id: "$customer",
                                   cust: {
                                        D$first: "$customer",
                                   },
                                   custGrp: {
                                        D$first: "$custGrp",
                                   },
                                   loc: {
                                        D$first: "$bLOC",
                                   },
                                   openingBal: {
                                        D$sum: 0,
                                   },
                                   billAmt: {
                                        D$sum: "$aMT",
                                   },
                                   unsubmittedAmt: {
                                        D$sum: "$unsubmittedAmt",
                                   },
                                   submittedAmt: {
                                        D$sum: "$submittedAmt",
                                   },
                                   collectedAmt: {
                                        D$sum: "$collectedAmt",
                                   },
                                   creditNoteAmt: {
                                        D$sum: "$creditNoteAmt",
                                   },
                                   "0-15": {
                                        D$sum: {
                                             D$cond: {
                                                  if: {
                                                       D$lte: ["$age", 15],
                                                  },
                                                  then: "$pendingAmt",
                                                  else: 0,
                                             },
                                        },
                                   },
                                   "16-30": {
                                        D$sum: {
                                             D$cond: {
                                                  if: {
                                                       D$and: [
                                                            {
                                                                 D$gt: ["$age", 16],
                                                            },
                                                            {
                                                                 D$lte: ["$age", 30],
                                                            },
                                                       ],
                                                  },
                                                  then: "$pendingAmt",
                                                  else: 0,
                                             },
                                        },
                                   },
                                   "31-45": {
                                        D$sum: {
                                             D$cond: {
                                                  if: {
                                                       D$and: [
                                                            {
                                                                 D$gt: ["$age", 30],
                                                            },
                                                            {
                                                                 D$lte: ["$age", 45],
                                                            },
                                                       ],
                                                  },
                                                  then: "$pendingAmt",
                                                  else: 0,
                                             },
                                        },
                                   },
                                   "46-60": {
                                        D$sum: {
                                             D$cond: {
                                                  if: {
                                                       D$and: [
                                                            {
                                                                 D$gt: ["$age", 46],
                                                            },
                                                            {
                                                                 D$lte: ["$age", 60],
                                                            },
                                                       ],
                                                  },
                                                  then: "$pendingAmt",
                                                  else: 0,
                                             },
                                        },
                                   },
                                   "61-75": {
                                        D$sum: {
                                             D$cond: {
                                                  if: {
                                                       D$and: [
                                                            {
                                                                 D$gt: ["$age", 61],
                                                            },
                                                            {
                                                                 D$lte: ["$age", 75],
                                                            },
                                                       ],
                                                  },
                                                  then: "$pendingAmt",
                                                  else: 0,
                                             },
                                        },
                                   },
                                   "75-90": {
                                        D$sum: {
                                             D$cond: {
                                                  if: {
                                                       D$and: [
                                                            {
                                                                 D$gt: ["$age", 75],
                                                            },
                                                            {
                                                                 D$lte: ["$age", 90],
                                                            },
                                                       ],
                                                  },
                                                  then: "$pendingAmt",
                                                  else: 0,
                                             },
                                        },
                                   },
                                   "91-120": {
                                        D$sum: {
                                             D$cond: {
                                                  if: {
                                                       D$and: [
                                                            {
                                                                 D$gt: ["$age", 91],
                                                            },
                                                            {
                                                                 D$lte: ["$age", 120],
                                                            },
                                                       ],
                                                  },
                                                  then: "$pendingAmt",
                                                  else: 0,
                                             },
                                        },
                                   },
                                   "120-180": {
                                        D$sum: {
                                             D$cond: {
                                                  if: {
                                                       D$and: [
                                                            {
                                                                 D$gt: ["$age", 120],
                                                            },
                                                            {
                                                                 D$lte: ["$age", 180],
                                                            },
                                                       ],
                                                  },
                                                  then: "$pendingAmt",
                                                  else: 0,
                                             },
                                        },
                                   },
                                   "180-365": {
                                        D$sum: {
                                             D$cond: {
                                                  if: {
                                                       D$and: [
                                                            {
                                                                 D$gt: ["$age", 180],
                                                            },
                                                            {
                                                                 D$lte: ["$age", 365],
                                                            },
                                                       ],
                                                  },
                                                  then: "$pendingAmt",
                                                  else: 0,
                                             },
                                        },
                                   },
                                   ">365": {
                                        D$sum: {
                                             D$cond: {
                                                  if: {
                                                       D$gte: ["$age", 365],
                                                  },
                                                  then: "$pendingAmt",
                                                  else: 0,
                                             },
                                        },
                                   },
                                   TotalPending: {
                                        D$sum: "$pendingAmt",
                                   },
                                   ManualVoucherAmount: {
                                        D$sum: 0,
                                   },
                                   OnAccountBalance: {
                                        D$sum: 0,
                                   },
                                   LedgerBalance: {
                                        D$sum: 0,
                                   },
                              },
                         }
                    ]
          };
          const res = await firstValueFrom(this.masterServices.masterMongoPost("generic/query", reqBody));
          return res.data;
     }
}

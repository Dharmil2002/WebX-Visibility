import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
import * as XLSX from 'xlsx';
@Injectable({
  providedIn: "root",
})
export class VendorWiseOutService {
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
  async getvendorWiseOutReportDetail(msme = false, ASonDateValue, start, end, locations, vendors, reportbasis) {
    // Extract vendor names and status names from the request object
    const vendorNames = vendors ? vendors.map(x => x.vNM) || [] : [];
    const locCodes = locations ? locations.map(x => x.locCode) || [] : [];
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
        { bDT: { 'D$gte': start } }, // Convert start date to ISO format
        { bDT: { 'D$lte': end } }, // Bill date less than or equal to end date
        {
          'D$or': [{ cNL: false }, { cNL: { D$exists: false } }],
        },

        ...(vendorNames.length > 0 ? [{ D$expr: { D$in: ["$vND.nM", vendorNames] } }] : []), // Vendor names condition
        ...(locCodes.length > 0 ? [{ D$expr: { D$in: ["$eNTLOC", locCodes] } }] : []), // Location code condition
        ...(reportbasis ? [{ 'bSTAT': parseInt(reportbasis) }] : [])
      ],
    };

    const reqBody = {
      companyCode: this.storage.companyCode,
      collectionName: "vend_bill_summary",
      filters:
        [
          {
            D$match: matchQuery,
          },
          {
            D$addFields: {
              vendor: {
                D$concat: [
                  {
                    D$toString: "$vND.cD",
                  },
                  " : ",
                  "$vND.nM",
                ],
              },
              age: {
                D$floor: {
                  D$divide: [
                    {
                      D$subtract: [
                        new Date(),
                        "$bDT",
                      ],
                    },
                    86400000,
                  ],
                },
              }
            },
          },
          {
            D$lookup: {
              from: "vend_bill_payment",
              let: {
                docNo: "$docNo",
              },
              pipeline: [
                {
                  D$match: {
                    D$and: [
                      {
                        D$expr: {
                          D$eq: ["$bILLNO", "$$docNo"],
                        },
                      },
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
              as: "billpay",
            },
          },
          {
            D$lookup: {
              from: "cd_note_header",
              let: {
                docNo: "$docNo",
              },
              pipeline: [
                {
                  D$match: {
                    D$and: [
                      {
                        D$expr: {
                          D$eq: ["$bILLNO", "$$docNo"],
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
              as: "debitnote",
            },
          },
          {
            D$lookup: {
              from: "vendor_detail",
              let: {
                vendorCode: "$vND.cD",
              },
              pipeline: [
                {
                  D$match: {
                    D$and: [
                      {
                        D$expr: {
                          D$eq: [
                            "$vendorCode",
                            "$$vendorCode",
                          ],
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
              as: "vendorDetals",
            },
          },
          {
            D$unwind: {
              path: "$vendorDetals",
              preserveNullAndEmptyArrays: false,
            },
          },
          {
            D$match: {
              D$expr: {
                D$eq: ["$vendorDetals.msmeRegistered", msme]
              }
            }
          },
          {
            D$project: {
              vendor: 1,
              iSMSRG: "$vendorDetals.msmeRegistered",
              eNTLOC: 1,
              bALAMT: 1,
              bSTAT: 1,
              age: 1,
              finalized: {
                D$cond: {
                  if: {
                    D$ne: ["$bSTAT", 1],
                  },
                  then: "$bALAMT",
                  else: 0,
                },
              },
              unFinalized: {
                D$cond: {
                  if: {
                    D$eq: ["$bSTAT", 1],
                  },
                  then: "$bALAMT",
                  else: 0,
                },
              },
              paidAmount: {
               D$sum: "$billpay.aMT",
                // D$sum: {
                //   D$subtract: ["$bALAMT", "$bALPBAMT"]
                // }
              },
              debitNoteAmt: {
                D$sum: "$debitnote.aMT",
           },
            },
          },
          {
            D$addFields: {
              pendingAmt: {
                D$max: [
                  0,
                  {
                    //D$subtract: ["$bALAMT", "$paidAmount"],
                    D$subtract: [
                      {
                           D$subtract: ["$bALAMT", "$paidAmount"]
                      },
                      "$debitNoteAmt"
                 ]
                  },
                ],
              },
            },
          },
          {
            D$group: {
              _id: "$vendor",
              vendor: {
                D$first: "$vendor",
              },
              msme: {
                D$first: "$iSMSRG",
              },
              loc: {
                D$first: "$eNTLOC",
              },
              openingBal: {
                D$sum: 0,
              },
              totalBillAmt: {
                D$sum: "$bALAMT",
              },
              debitNoteAmt: {
                D$sum: "$debitNoteAmt",
              },
              paidAmt: {
                D$sum: "$paidAmount",
              },
              finalized: {
                D$sum: "$finalized",
              },
              unFinalized: {
                D$sum: "$unFinalized",
              },
              "0-30": {
                D$sum: {
                  DOMRectList$cond: {
                    if: {
                      D$lte: ["$age", 30],
                    },
                    then: "$pendingAmt",
                    else: 0,
                  },
                },
              },
              "31-60": {
                D$sum: {
                  D$cond: {
                    if: {
                      D$and: [
                        {
                          D$gt: ["$age", 31],
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
              "61-90": {
                D$sum: {
                  D$cond: {
                    if: {
                      D$and: [
                        {
                          D$gt: ["$age", 61],
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
              "121-150": {
                D$sum: {
                  D$cond: {
                    if: {
                      D$and: [
                        {
                          D$gt: ["$age", 121],
                        },
                        {
                          D$lte: ["$age", 150],
                        },
                      ],
                    },
                    then: "$pendingAmt",
                    else: 0,
                  },
                },
              },
              "151-180": {
                D$sum: {
                  D$cond: {
                    if: {
                      D$and: [
                        {
                          D$gt: ["$age", 151],
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
              ">180": {
                D$sum: {
                  D$cond: {
                    if: {
                      D$gte: ["$age", 180],
                    },
                    then: "$pendingAmt",
                    else: 0,
                  },
                },
              },
              totalPayable: {
                D$sum: "$pendingAmt",
              },
              onAccountAmt: {
                D$sum: 0,
              },
              manualVoucher: {
                D$sum: 0,
              },
              jVAmt: {
                D$sum: 0,
              },
              paidAdvanceAmount: {
                D$sum: 0,
              },
              ledgerBalance: {
                D$sum: 0,
              },
            },
          },
        ]
    };
    const res = await firstValueFrom(this.masterServices.masterMongoPost("generic/query", reqBody));
    return res.data;
  }
}



// async getvendorWiseOutReportDetail(start, end, locations, vendors, reportbasis) {
//      // Extract vendor names and status names from the request object
//      const vendorNames = vendors ? vendors.map(x => x.vCD) || [] : [];
//      const locCodes = locations ? locations.map(x => x.locCode) || [] : [];

//      // Build the match query based on provided conditions
//      let matchQuery = {
//           'D$and': [
//                { bDT: { 'D$gte': start } }, // Convert start date to ISO format
//                { bDT: { 'D$lte': end } }, // Bill date less than or equal to end date
//                {
//                     'D$or': [{ cNL: false }, { cNL: { D$exists: false } }],
//                },
//                ...(vendorNames.length > 0 ? [{ 'vND.nM': { 'D$in': vendorNames } }] : []), // Vendor names condition
//                ...(locCodes.length > 0 ? [{ eNTLOC: { 'D$in': locCodes } }] : []), // Location code condition
//                ...(reportbasis ? [{ 'bSTAT': parseInt(reportbasis) }] : []),
//           ],
//      };

//      const reqBody = {
//           companyCode: this.storage.companyCode,
//           collectionName: "vend_bill_summary",
//           filters: [
//                {
//                     D$match: matchQuery,
//                },
//                {
//                     D$addFields: {
//                          vendor: { D$concat: [{ D$toString: '$vND.cD' }, ' : ', '$vND.nM'] },
//                          age: {
//                               D$floor: {
//                                    D$divide: [
//                                         { D$subtract: [new Date(), "$bDT"] },
//                                         //31536000000, // Number of milliseconds in a year
//                                         86400000 // Number of milliseconds in a day
//                                    ]
//                               }
//                          },
//                          paidAmount: { D$subtract: ["$bALAMT", "$bALPBAMT"] }
//                     }
//                },
//                {
//                     D$group: {
//                          _id: "$vendor", // replace with the field you are grouping by
//                          vendor: { D$first: "$vendor" },
//                          loc: { D$first: "$eNTLOC" },
//                          openingBal: { D$sum: 0 }, // replace with the desired value if necessary
//                          totalBillAmt: { D$sum: '$bALAMT' },
//                          paidAmt: { D$sum: '$paidAmount' },
//                          finalized: { D$sum: { D$cond: { if: { D$ne: ['$bSTAT', 1] }, then: '$bALAMT', else: 0 } } },
//                          unFinalized: { D$sum: { D$cond: { if: { D$eq: ['$bSTAT', 1] }, then: '$bALAMT', else: 0 } } },
//                          '0-30': { D$sum: { D$cond: { if: { D$lte: ['$age', 30] }, then: '$bALAMT', else: 0 } } },
//                          '31-60': { D$sum: { D$cond: { if: { D$and: [{ D$gt: ['$age', 30] }, { D$lte: ['$age', 60] }] }, then: '$bALAMT', else: 0 } } },
//                          '61-90': { D$sum: { D$cond: { if: { D$and: [{ D$gt: ['$age', 60] }, { D$lte: ['$age', 90] }] }, then: '$bALAMT', else: 0 } } },
//                          '91-120': { D$sum: { D$cond: { if: { D$and: [{ D$gt: ['$age', 90] }, { D$lte: ['$age', 120] }] }, then: '$bALAMT', else: 0 } } },
//                          '121-150': { D$sum: { D$cond: { if: { D$and: [{ D$gt: ['$age', 120] }, { D$lte: ['$age', 150] }] }, then: '$bALAMT', else: 0 } } },
//                          '151-180': { D$sum: { D$cond: { if: { D$and: [{ D$gt: ['$age', 150] }, { D$lte: ['$age', 180] }] }, then: '$bALAMT', else: 0 } } },
//                          '>180': { D$sum: { D$cond: { if: { D$gte: ['$age', 180] }, then: '$bALAMT', else: 0 } } },
//                          totalPayable: { D$sum: '$bALAMT' },
//                          onAccountAmt: { D$sum: 0 }, // replace with the desired value if necessary
//                          manualVoucher: { D$first: '' }, // replace with the desired value if necessary
//                          jVAmt: { D$sum: 0 }, // replace with the desired value if necessary
//                          paidAdvanceAmount: { D$sum: '$aDVAMT' },
//                          ledgerBalance: { D$sum: 0 } // replace with the desired value if necessary
//                     }
//                }
//           ]
//      };

//      const res = await firstValueFrom(this.masterServices.masterMongoPost("generic/query", reqBody));
//      return res.data;
// }

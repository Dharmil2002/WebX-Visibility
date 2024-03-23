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
     async getvendorWiseOutReportDetail(ASonDateValue, start, end, locations, vendors, reportbasis) {
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

                    ...(vendorNames.length > 0 ? [{ 'vND.nM': { 'D$in': vendorNames } }] : []), // Vendor names condition
                    ...(locCodes.length > 0 ? [{ eNTLOC: { 'D$in': locCodes } }] : []), // Location code condition
                    ...(reportbasis ? [{ 'bSTAT': parseInt(reportbasis) }] : []),
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
                              D$project:
                              {
                                   vendor: 1,
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
                                   },
                              },
                         },
                         {
                              D$addFields: {
                                   pendingAmt: {
                                        D$max: [
                                             0,
                                             {
                                                  D$subtract: ["$bALAMT", "$paidAmount"],
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
                                   loc: {
                                        D$first: "$eNTLOC",
                                   },
                                   openingBal: {
                                        D$sum: 0,
                                   },
                                   totalBillAmt: {
                                        D$sum: "$bALAMT",
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
                                             D$cond: {
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
                         }
                    ]
          };
          const res = await firstValueFrom(this.masterServices.masterMongoPost("generic/query", reqBody));
          return res.data;
     }
}

export function exportAsExcelFile(json: any[], excelFileName: string, customHeaders: Record<string, string>): void {
     // Remove the _id field from each row in the JSON data
     const cleanedJson = json.map(row => {
          delete row._id;
          return row;
     });

     // Convert the JSON data to an Excel worksheet using XLSX.utils.json_to_sheet.
     const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(cleanedJson);
     // Get the keys (headers) from the first row of the JSON data.
     const headerKeys = Object.keys(cleanedJson[0]);
     // Iterate through the header keys and replace the default headers with custom headers.
     for (let i = 0; i < headerKeys.length; i++) {
          const headerKey = headerKeys[i];
          if (headerKey && customHeaders[headerKey]) {
               worksheet[XLSX.utils.encode_col(i) + '1'] = { t: 's', v: customHeaders[headerKey] };
          }
     }
     // Format the headers in the worksheet.
     for (const key in worksheet) {
          if (Object.prototype.hasOwnProperty.call(worksheet, key)) {
               // Check if the key corresponds to a header cell (e.g., A1, B1, etc.).
               const reg = /^[A-Z]+1$/;
               if (reg.test(key)) {
                    // Set the format of the header cells to '0.00'.
                    worksheet[key].z = '0.00';
               }
          }
     }
     // Create a workbook containing the worksheet.
     const workbook: XLSX.WorkBook = { Sheets: { 'Vendor_Wise_Outstanding_Report': worksheet }, SheetNames: ['Vendor_Wise_Outstanding_Report'] };
     // Write the workbook to an Excel file with the specified filename.
     XLSX.writeFile(workbook, `${excelFileName}.xlsx`);
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
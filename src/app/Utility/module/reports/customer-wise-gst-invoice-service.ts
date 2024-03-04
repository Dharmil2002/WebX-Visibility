import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
import * as XLSX from 'xlsx';
import { PayBasisdetailFromApi } from "src/app/Masters/Customer Contract/CustomerContractAPIUtitlity";
import moment from "moment";
@Injectable({
     providedIn: "root",
})
export class CustGSTInvoiceService {
     constructor(
          private masterServices: MasterService,
          private storage: StorageService
     ) { }
     //startValue, endValue, docNoArray, stateData, customerName
     async getcustomerGstRegisterReportDetail(data) {

          // Check if the array contains only empty strings
          const isEmptyDocNo = data.docNoArray.every(value => value === "");
          let matchQuery

          // Add date range conditions if docNo are not present
          if (isEmptyDocNo) {
               matchQuery = {
                    'D$and': [
                         { bGNDT: { 'D$gte': data.startDate } }, // Convert start date to ISO format
                         { bGNDT: { 'D$lte': data.endDate } }, // Bill date less than or equal to end date       
                         ...(data.customerName.length > 0 ? [{ 'D$expr': { 'D$in': ['$cUST.cD', data.customerName] } }] : []), // State names condition
                         ...(data.stateData.length > 0 ? [{ 'D$expr': { 'D$in': ['$cUST.sT', data.stateData] } }] : []), // State names condition              
                    ],
               };
          }

          // Add docNo condition if docNoArray is present
          if (!isEmptyDocNo) {
               matchQuery = {
                    'docNo': { 'D$in': data.docNoArray }
               };
          }

          const reqBody = {
               companyCode: this.storage.companyCode,
               collectionName: "cust_bill_headers",
               filters: [
                    {
                         D$match: matchQuery
                    },
                    {
                         D$addFields: {
                              Party: {
                                   D$concat: [
                                        {
                                             D$toString: "$cUST.cD",
                                        },
                                        " : ",
                                        "$cUST.nM",
                                   ],
                              },

                         },
                    },
                    {
                         D$lookup: {
                              from: "cust_bill_details",
                              let: {
                                   bILLNO: "$bILLNO"
                              },
                              pipeline: [
                                   {
                                        D$match: {
                                             D$and: [
                                                  {
                                                       D$expr: {
                                                            D$eq: ["$bILLNO", "$$bILLNO"]
                                                       }
                                                  },
                                                  {
                                                       cNL: {
                                                            D$in: [false, null]
                                                       }
                                                  }
                                             ]
                                        }
                                   }
                              ],
                              as: "billDetails"
                         }
                    },
                    {
                         D$lookup: {
                              from: "docket_invoices",
                              let: {
                                   dKTNO: { D$arrayElemAt: ["$billDetails.dKTNO", 0] } // Assuming there is only one element in the array
                              },
                              pipeline: [
                                   {
                                        D$match: {
                                             D$and: [
                                                  {
                                                       D$expr: {
                                                            D$eq: ["$dKTNO", "$$dKTNO"]
                                                       }
                                                  }
                                             ]
                                        }
                                   }
                              ],
                              as: "docketInvoices"
                         }
                    },
                    {
                         D$project: {
                              _id: 0, // Exclude the _id field
                              BILLNO: "$bILLNO",
                              BILLDT: "$bGNDT",
                              DocumentType: "",
                              BILLSTATUS: "$bSTSNM",
                              BillGenState: "$cUST.sT",
                              BillBanch: "$bLOC",
                              Generation_GSTNO: "$gEN.gSTIN",
                              Party: "$Party",
                              PartyType: {
                                   D$cond: {
                                        if: {
                                             D$eq: ["$cUST.gSTIN", ""]
                                        },
                                        then: "UnRegistered",
                                        else: "Registered"
                                   }
                              },
                              BillToState: "$cUST.sT",
                              PartyGSTN: "$cUST.gSTIN",
                              BillSubAt: "$bLOC",
                              BusinessType: "$bUSVRT",
                              Total_Taxable_Value: "$dKTTOT",
                              SAC: "",
                              GSTRATE: {
                                   D$cond: {
                                        if: {
                                             D$ne: ["$gST.rATE", null]
                                        },
                                        then: "$gST.rATE",
                                        else: "0.00"
                                   }
                              },
                              GSTTotal: {
                                   D$cond: {
                                        if: {
                                             D$ne: ["$gST.aMT", null]
                                        },
                                        then: "$gST.aMT",
                                        else: "0.00"
                                   }
                              },
                              RCM: "",
                              IGST: "$gST.iGST",
                              CGST: "$gST.cGST",
                              SGSTUGST: "$gST.sGST",
                              CNAMT: "",
                              Discount: "$dAMT",
                              TotalInvoice_Value: {
                                   D$cond: {
                                        if: {
                                             D$ne: ["$aMT", null]
                                        },
                                        then: "$aMT",
                                        else: "0.00"
                                   }
                              },
                              TDSRate: "",
                              TDSAmount: "",
                              TDSSec: "",
                              ReasonForIssue: "",
                              InvoiceNo: { D$arrayElemAt: ["$docketInvoices.iNVNO", 0] },
                              Manualno: { D$arrayElemAt: ["$docketInvoices.iNVNO", 0] },
                              Currency: "$CURR",
                              ExchangeRate: "",
                              CurrencyAmount: "",
                              GstExempted: {
                                   D$cond: {
                                        if: {
                                             D$eq: ["$eXMT", true]
                                        },
                                        then: "Yes",
                                        else: "No"
                                   }
                              },
                              PayBasis: "$pAYBAS",
                              Narration: "",
                              UserId: "$eNTBY",
                              ExemptionCategory: "",
                              IrnNo: "",
                         }
                    }

               ]
          };

          try {
               // Fetch data from MongoDB
               const res = await firstValueFrom(this.masterServices.masterMongoPost("generic/query", reqBody));

               // Fetch pay basis details
               let paybasis = await PayBasisdetailFromApi(this.masterServices, 'PAYTYP');

               // Process data using Promise.all and map
               const modifiedData = await Promise.all(res.data.map(async (item) => {
                    // Find the matching pay basis
                    const payBasisMatch = paybasis.find(pb => pb.value === item?.PayBasis);
                    const payBasisName = payBasisMatch?.name || '';

                    // Return the modified item
                    return {
                         ...item,
                         PayBasis: payBasisName,
                         BILLDT: moment(item.BILLDT).format('YYYY-MM-DD'),
                         ExchangeRate: "1",
                         CurrencyAmount: "0",
                         TDSRate: "0",
                         TDSAmount: "0.00",
                         CNAMT: "0",
                         DocumentType: "General Bill", // Set a specific value for DocumentType
                    };
               }));

               return modifiedData;
          } catch (error) {
               console.error("Error in processing data:", error);
               // Handle or throw the error based on your use case
          }


     }
}

export function exportAsExcelFile(json: any[], excelFileName: string, customHeaders: Record<string, string>): void {
     const cleanedjson = json.map(row => {
          delete row._id;
          return row;
     })
     // Convert the JSON data to an Excel worksheet using XLSX.utils.json_to_sheet.
     const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(cleanedjson);
     // Get the keys (headers) from the first row of the JSON data.
     const headerKeys = Object.keys(cleanedjson[0]);
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
     const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
     // Write the workbook to an Excel file with the specified filename.
     XLSX.writeFile(workbook, `${excelFileName}.xlsx`);
}
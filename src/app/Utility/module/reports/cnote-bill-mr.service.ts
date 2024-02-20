import { firstValueFrom } from "rxjs";

import { Injectable } from "@angular/core";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
import { formatDocketDate } from "../../commonFunction/arrayCommonFunction/uniqArray";
import * as XLSX from 'xlsx';
import moment from "moment";
@Injectable({
     providedIn: "root",
})

export class CnoteBillMRService {
     constructor(
          private masterServices: MasterService,
          private storage: StorageService
     ) { }

     async getCNoteBillMRReportDetail(start, end, fromloc, toloc, payment, transitmode, businessType, movType, bookingType, customer, billAt, docketArray) {
          
          const loc = fromloc ? fromloc.map(x => x.locCD) || [] : [];
          const Toloc = toloc ? toloc.map(x => x.locCD) || [] : [];
          const payBasis = payment ? payment.map(x => x.payNM) || [] : [];
          const tranMode = transitmode ? transitmode.map(x => x.tranNM) || [] : [];
          const movement = movType ? movType.map(x => x.movNM) || [] : [];
          const booking = bookingType ? bookingType.map(x => x.bookNM) || [] : [];
          const cust = customer ? customer.map(x => x.custNM) || [] : [];
          const billLoc = billAt ? billAt.map(x => x.billCD) || [] : [];

          let matchQuery = {
               'D$and': [
                    { dKTDT: { 'D$gte': start } }, // Convert start date to ISO format
                    { dKTDT: { 'D$lte': end } }, // prq date less than or equal to end date
                    {
                         'D$or': [{ cNL: false }, { cNL: { D$exists: false } }],
                    },
                    ...(docketArray.length > 0 ? [{ dKTNO: { 'D$in': docketArray } }] : []), // PRQNo condition
                    ...(loc.length > 0 ? [{ oRGN: { 'D$in': loc } }] : []), // From Location condition
                    ...(Toloc.length > 0 ? [{ dEST: { 'D$in': Toloc } }] : []), // To Location condition
                    ...(payBasis.length > 0 ? [{ pAYTYPNM: { 'D$in': payBasis } }] : []), // Payment Basis condition
                    ...(tranMode.length > 0 ? [{ tRNMODNM: { 'D$in': tranMode } }] : []), // Transit Mode condition
                    // ...(businessType.length > 0 ? [{ bUSVRT: { 'D$in': businessType } }] : []), // Business Type condition
                    ...(movement.length > 0 ? [{ mODNM: { 'D$in': movement } }] : []), // Movement Type condition
                    ...(booking.length > 0 ? [{ dELTYN: { 'D$in': booking } }] : []), // Booking Type condition
                    ...(cust.length > 0 ? [{ bPARTYNM: { 'D$in': cust } }] : []), // Customer condition
                    ...(billLoc.length > 0 ? [{ oRGN: { 'D$in': billLoc } }] : []), // Bill At condition
               ]
          };

          const reqBody = {
               companyCode: this.storage.companyCode,
               collectionName: "dockets",
               filters: [
                    {
                         D$match: matchQuery,
                    },
                    {
                         "D$lookup": {
                              "from": "cust_bill_details",
                              "let": { "dKTNO": "$dKTNO" },
                              "pipeline": [
                                   {
                                        "D$match": {
                                             "D$and": [
                                                  { "D$expr": { "D$eq": ["$dKTNO", "$$dKTNO"] } },
                                                  { "cNL": { "D$in": [false, null] } }
                                             ]
                                        }
                                   }
                              ],
                              "as": "custbilldetail"
                         }
                    },
                    {
                         "D$unwind": { "path": "$custbilldetail", "preserveNullAndEmptyArrays": true }
                    },
                    {
                         "D$lookup": {
                              "from": "cust_bill_headers",
                              "let": { "bILLNO": "$custbilldetail.bILLNO" },
                              "pipeline": [
                                   {
                                        "D$match": {
                                             "D$and": [
                                                  { "D$expr": { "D$eq": ["$bILLNO", "$$bILLNO"] } },
                                                  { "cNL": { "D$in": [false, null] } }
                                             ]
                                        }
                                   }
                              ],
                              "as": "custbillheader"
                         }
                    },
                    {
                         "D$unwind": { "path": "$custbillheader", "preserveNullAndEmptyArrays": true }
                    },
                    {
                         "D$lookup": {
                              "from": "cust_bill_collection",
                              "let": { "bILLNO": "$custbillheader.bILLNO" },
                              "pipeline": [
                                   {
                                        "D$match": {
                                             "D$and": [
                                                  { "D$expr": { "D$eq": ["$bILLNO", "$$bILLNO"] } },
                                                  { "cNL": { "D$in": [false, null] } }
                                             ]
                                        }
                                   }
                              ],
                              "as": "custbillcollection"
                         }
                    },
                    {
                         "D$unwind": { "path": "$custbillcollection", "preserveNullAndEmptyArrays": true }
                    },
                    {
                         "D$lookup": {
                              "from": "cust_contract",
                              "let": { "bPARTYNM": "$bPARTY" },
                              "pipeline": [
                                   {
                                        "D$match": {
                                             "D$and": [
                                                  { "D$expr": { "D$eq": ["$cUSTNM", "$$bPARTYNM"] } },
                                                  { "cNL": { "D$in": [false, null] } }
                                             ]
                                        }
                                   }
                              ],
                              "as": "custcontract"
                         }
                    },
                    {
                         "D$unwind": { "path": "$custcontract", "preserveNullAndEmptyArrays": true }
                    },
                    {
                         "D$lookup": {
                              "from": "docket_invoices",
                              "let": { "dKTNO": "$dKTNO" },
                              "pipeline": [
                                   {
                                        "D$match": {
                                             "D$and": [
                                                  { "D$expr": { "D$eq": ["$dKTNO", "$$dKTNO"] } },
                                                  { "cNL": { "D$in": [false, null] } }
                                             ]
                                        }
                                   }
                              ],
                              "as": "docketinvoice"
                         }
                    },
                    {
                         "D$unwind": { "path": "$docketinvoice", "preserveNullAndEmptyArrays": true }
                    },
                    {
                         "D$project": {
                              "mANUALBILLNO": { "D$ifNull": ["$custbilldetail.bILLNO", ""] },
                              "bILLGENAT": { "D$ifNull": ["$custbillheader.bLOC", ""] },
                              "bILLDT": { "D$ifNull": ["$custbillheader.bGNDT", ""] },
                              "bILSUBAT": { "D$ifNull": ["$custbillheader.sUB.lOC", ""] },
                              "bILLSUBDT": { "D$ifNull": ["$custbillheader.sUB.dTM", ""] },
                              "bILLcOLLECTAT": { "D$ifNull": ["$custbillheader.cOL.lOC", ""] },
                              "bILLCOLLECTDT": { "D$ifNull": ["$custbillheader.sUB.dTM", ""] },
                              "bILLAMT": { "D$ifNull": ["$custbillheader.aMT", ""] },
                              "bILLPENAMT": { "D$ifNull": ["$custbillheader.cOL.bALAMT", ""] },
                              "bILLPAR": { "D$ifNull": ["$bPARTYNM", ""] },
                              "bILLST": { "D$ifNull": ["$custbillheader.bSTSNM", ""] },
                              "bILLNO": { "D$ifNull": ["$custbilldetail.bILLNO", ""] },
                              "mRNO": { "D$ifNull": ["$custbillcollection.mRNO", ""] },
                              "mANUALMRNO": { "D$ifNull": ["$custbillcollection.mRNO", ""] },
                              "mRDT": { "D$ifNull": ["$custbillcollection.dTM", ""] },
                              "mRCLOSEDT": "",
                              "mRENTRYDT": { "D$ifNull": ["$custbillcollection.eNTDT", ""] },
                              "mRGENAT": { "D$ifNull": ["$custbillcollection.lOC", ""] },
                              "mRAMT": { "D$ifNull": ["$custbillcollection.aMT", ""] },
                              "mRNETAMT": { "D$ifNull": ["$custbillcollection.aMT", ""] },
                              "mRSTAT": "",
                              "dEMCHAR": "",
                              "cNOTENO": { "D$ifNull": ["$dKTNO", ""] },
                              "cNOTEDT": { "D$ifNull": ["$dKTDT", ""] },
                              "tIME": { "D$ifNull": ["$dKTDT", ""] },
                              "eDD": "",
                              "bOOKBRANCH": { "D$ifNull": ["$oRGN", ""] },
                              "dELIBRANCH": { "D$ifNull": ["$dEST", ""] },
                              "pAYTYPE": { "D$ifNull": ["$pAYTYPNM", ""] },
                              "bUSTYPE": { "D$ifNull": ["$custbillheader.bUSVRT", ""] },
                              "pROD": "",
                              "cONID": { "D$ifNull": ["$custcontract.cONID", ""] },
                              "cONTPARTY": { "D$ifNull": ["$custcontract.cUSTNM", ""] },
                              "sERTYPE": "FTL",
                              "vEHNO": { "D$ifNull": ["$vEHNO", ""] },
                              "bILLPARTYNM": { "D$ifNull": ["$bPARTYNM", ""] },
                              "bACODE": "",
                              "eEDD": "",
                              "lASTEDITBY": { "D$ifNull": ["$mODBY", ""] },
                              "cNOTEEDITDT": { "D$ifNull": ["$eNTDT", ""] },
                              "cUSTREFNO": "",
                              "mOVTYPE": { "D$ifNull": ["$mODNM", ""] },
                              "tRANMODE": { "D$ifNull": ["$tRNMODNM", ""] },
                              "sTAT": { "D$ifNull": ["$dEST", ""] },
                              "lOADTPE": "FTL",
                              "rEM": "",
                              "bILLAT": { "D$ifNull": ["$custbillheader.bLOC", ""] },
                              "pINCODE": "",
                              "lOCALCNOTE": "",
                              "fROMZN": "",
                              "tOZN": "",
                              "oDA": "",
                              "fROMCITY": { "D$ifNull": ["$fCT", ""] },
                              "tOCITY": { "D$ifNull": ["$tCT", ""] },
                              "dRIVNM": "",
                              "pKGS": { "D$ifNull": ["$pKGS", ""] },
                              "aCTWT": { "D$ifNull": ["$aCTWT", ""] },
                              "cHARWT": { "D$ifNull": ["$cHRWT", ""] },
                              "sPEINSTRUCT": "",
                              "pKGTPE": "Carton Box",
                              "cUBICWT": { "D$ifNull": ["$cFTWT", ""] },
                              "cHRPKG": { "D$ifNull": ["$pKGS", ""] },
                              "cHARGKM": "",
                              "iNVNO": { "D$ifNull": ["$docketinvoice.iNVNO", ""] },
                              "iNVDT": { "D$ifNull": ["$docketinvoice.eNTDT", ""] },
                              "dELVALUE": { "D$ifNull": ["$docketinvoice.iNVAMT", ""] },
                              "lEN": "",
                              "bRTH": "",
                              "hGT": "",
                              "cONTENT": "",
                              "bATCHNO": "",
                              "pARTNO": "",
                              "pARTDESC": "",
                              "pARTQUAN": "",
                              "fUELRTTPE": "",
                              "fOVRTTPE": "",
                              "cFTRATIO": "",
                              "tTCFT": "",
                              "sEROPTEDFOR": "",
                              "fSCCHARRT": "",
                              "fOV": "",
                              "mULDELIV": "",
                              "mULPICKUP": "",
                              "rISKTPE": { "D$ifNull": ["$rSKTYN", ""] },
                              "cOD/DOD": "",
                              "dACC": "",
                              "dEF": "",
                              "pOLNO": "",
                              "pOLDT": "",
                              "wTTPE": "",
                              "dEFAULTCARDRT": "",
                              "fUELPERRT": "",
                              "CONID": "",
                              "sUBTOT": { "D$ifNull": ["$custbilldetail.sUBTOT", ""] },
                              "dOCTOT": { "D$ifNull": ["$tOTAMT", ""] },
                              "gSTAMT": { "D$ifNull": ["$gSTAMT", ""] },
                              "fRTRT": { "D$ifNull": ["$fRTRT", ""] },
                              "fRTTPE": { "D$ifNull": ["$fRTRTYN", ""] },
                              "fRIGHTCHAR": { "D$ifNull": ["$fRTAMT", ""] },
                              "oTHERCHAR": { "D$ifNull": ["$oTHAMT", ""] },
                              "gREENTAX": "",
                              "dROPCHAR": "",
                              "dOCCHAR": "",
                              "wARECHAR": "",
                              "dEDUC": "",
                              "hOLISERVCHAR": "",
                              "fOVCHAR": "",
                              "cOD/DODCHAR": "",
                              "aPPCHAR": "",
                              "oDACHAR": "",
                              "fUELCHAR": "",
                              "mULPICKUPCHAR": "",
                              "uNLOADCHAR": "",
                              "mULTIDELCHAR": "",
                              "lOADCHAR": "",
                              "gSTRT": { "D$ifNull": ["$custbillheader.gST.rATE", ""] },
                              "gSTCHAR": { "D$ifNull": ["$custbillheader.gST.aMT", ""] },
                              "vATRT": "",
                              "vATAMT": '',
                              "cALAMITYRT": "",
                              "cALAMITYAMT": "",
                              "aDVAMT": "",
                              "aDVREMARK": "",
                              "dPHRT": "",
                              "dPHAMT": "",
                              "dISCRT": "",
                              "dISCAMT": ""
                         }
                    }
               ]
          };
          const res = await firstValueFrom(this.masterServices.masterMongoPost("generic/query", reqBody));
          // const uniqueResults = res.data.reduce((acc, curr) => {
          //      if (!acc.some(item => item.cNOTENO === curr.cNOTENO)) {
          //           acc.push(curr);
          //      }
          //      return acc;
          // }, []);
          const uniqueResults = res.data.reduce((acc, curr) => {
               const existingItem = acc.find(item => item.cNOTENO === curr.cNOTENO);
               if (existingItem) {
                    existingItem.iNVNO += `, ${curr.iNVNO}`;
                    existingItem.mANUALBILLNO += `, ${curr.mANUALBILLNO}`;
               } else {
                    acc.push(curr);
               }
               return acc;
          }, []);
          uniqueResults.forEach(item => {
               item.bILLDT = item.bILLDT ? moment(item.bILLDT).format('YYYY-MM-DD') : "";
               item.bILLSUBDT = item.bILLSUBDT ? moment(item.bILLSUBDT).format('YYYY-MM-DD') : "";
               item.bILLCOLLECTDT = item.bILLCOLLECTDT ? moment(item.bILLCOLLECTDT).format('YYYY-MM-DD') : "";
               item.cNOTEDT = item.cNOTEDT ? moment(item.cNOTEDT).format('YYYY-MM-DD') : "";
               item.tIME = item.tIME ? moment(item.tIME).format('HH:mm') : "";
               item.mRDT = item.mRDT ? moment(item.mRDT).format('YYYY-MM-DD') : "";
               item.cNOTEEDITDT = item.cNOTEEDITDT ? moment(item.cNOTEEDITDT).format('YYYY-MM-DD') : "";
               item.iNVDT = item.iNVDT ? moment(item.iNVDT).format('YYYY-MM-DD') : "";
          });
          return uniqueResults;
     }
}

// This function exports data to an Excel file using the XLSX library.
export function exportAsExcelFile(json: any[], excelFileName: string, customHeaders: Record<string, string>): void {
     // // Remove the _id field from each row in the JSON data
     const cleanedJson = json.map(row => {
          delete row._id;
          return row;
     });
     // Convert the JSON data to an Excel worksheet using XLSX.utils.json_to_sheet.
     const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(cleanedJson);
     // Get the keys (headers) from the first row of the cleanedJson data.
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
     const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
     // Write the workbook to an Excel file with the specified filename.
     XLSX.writeFile(workbook, `${excelFileName}.xlsx`);
}

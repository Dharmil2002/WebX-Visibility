import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
import { formatDocketDate } from "../../commonFunction/arrayCommonFunction/uniqArray";
import * as XLSX from 'xlsx';
import { StateService } from "../masters/state/state.service";
@Injectable({
     providedIn: "root",
})
export class VendorGSTInvoiceService {
     constructor(
          private masterServices: MasterService,
          private storage: StorageService,
          private objStateService: StateService
     ) { }

     async getvendorGstRegisterReportDetail(start, end, docNo) {
          const startValue = start;
          const endValue = end;
          const reqBody = {
               companyCode: this.storage.companyCode,
               collectionName: "vend_bill_summary",
               filter: {
                    cID: this.storage.companyCode,
               }
          }

          // Check if the array contains only empty strings
          const isEmptyDocNo = docNo.every(value => value === "");

          // Add date range conditions if docNo are not present
          if (isEmptyDocNo) {
               reqBody.filter["D$and"] = [
                    {
                         "bDT": {
                              "D$gte": startValue,
                         },
                    },

                    {
                         "bDT": {
                              "D$lte": endValue,
                         },
                    }
               ];
          }

          // Add docNo condition if docNoArray is present
          if (!isEmptyDocNo) {
               reqBody.filter["docNo"] = {
                    "D$in": docNo,
               };
          }

          const res = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));

          let vengstinvList = [];

          await Promise.all(res.data.map(async (element) => {

               const billGenState = await this.objStateService.fetchStateByFilterId(element?.sT, "ST");
               const partyState = await this.objStateService.fetchStateByFilterId(element?.vND.sT, "ST");

               let vengstinvData = {
                    "SAC": element.gST.sACNM,
                    "DocumentType": element?.docNo || '',
                    "GSTRATE": element?.gST.rATE || 0,
                    "TDS_Rate": element.tDS.rATE || 0,
                    "TDS_Amount": element.tDS.aMT || 0.00,
                    "BILLNO": element?.docNo || '',
                    "BILLDT": formatDocketDate(element?.bDT || ''),
                    "BILLSTATUS": element?.bSTATNM || '',
                    "BillBanch": element?.eNTLOC || '',
                    "BillGenState": billGenState[0]?.STNM,
                    "Generation_GSTNO": element?.gSTIN || '',
                    "Bill_Sub_At": element?.eNTLOC || '',
                    "TCS_Rate": element?.tDS.rATE || 0,
                    "TCS_Amount": element?.tDS.aMT || 0.00,
                    "MANUALBILLNO": element?.docNo || '',
                    "Party": `${element?.vND.cD || ''} : ${element?.vND.nM || ''}`,
                    "PartyType": element?.vND.gSTREG ? "Registered" : "UnRegistered",
                    "Bill_To_State": partyState[0]?.STNM,
                    "Party_GSTN": element?.vND.gSTIN || '',
                    "BusinessType": "",
                    "Total_Taxable_Value": element?.tHCAMT || 0.00,
                    "RCM": "",
                    "IGST": element?.gST.iGST || 0,
                    "CGST": element?.gST.cGST || 0,
                    "SGST_UGST": element?.gST.sGST || 0,
                    "Total_Invoice_Value": element?.bALAMT || 0.00,
                    "TDS Ledger ": element?.tDS.sEC || '',
                    "TDS Section Description ": element?.tDS.sECD || "",
                    "REMARK": "",
                    "ReceiverName": "",
                    "ApplicableTax": "",
                    "ECommerceGSTIN": "",
                    "VENDORBILLDT": formatDocketDate(element?.bDT || ''),
                    "Currency": "INR",
                    "ExchangeRt": "",
                    "CurrencyAmt": "",
                    "PayBasis": "",
                    "Narration": "",
                    "UserId": element?.eNTBY || '',
                    "GSTExemptionCat": "",
                    "IrnNo": "",
                    "InvNetValue": element?.bALAMT || 0.00,
               }
               vengstinvList.push(vengstinvData)
          }));

          return vengstinvList;
     }
}

export function convertToCSV(data: any[], headers: { [key: string]: string }): string {
     const replaceCommaAndWhitespace = (value: any): string => {
          // Check if value is null or undefined before calling toString
          if (value == null) {
               return '';
          }
          // Replace commas with another character or an empty string
          return value.toString().replace(/,/g, '');
     };

     // Generate header row using custom headers
     const header = '\uFEFF' + Object.keys(headers).map(key => replaceCommaAndWhitespace(headers[key])).join(',') + '\n';

     // Generate data rows using custom headers
     const rows = data.map(row =>
          Object.keys(headers).map(key => replaceCommaAndWhitespace(row[key])).join(',') + '\n'
     );

     return header + rows.join('');
}

export function exportAsExcelFile(json: any[], excelFileName: string, customHeaders: Record<string, string>): void {
     // Convert the JSON data to an Excel worksheet using XLSX.utils.json_to_sheet.
     const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
     // Get the keys (headers) from the first row of the JSON data.
     const headerKeys = Object.keys(json[0]);
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
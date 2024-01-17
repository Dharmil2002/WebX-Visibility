import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
import { formatDocketDate } from "../../commonFunction/arrayCommonFunction/uniqArray";
import * as XLSX from 'xlsx';
@Injectable({
     providedIn: "root",
})
export class VendorGSTInvoiceService {
     constructor(
          private masterServices: MasterService,
          private storage: StorageService
     ) { }

     async getvendorGstRegisterReportDetail() {
          const reqBody = {
               companyCode: this.storage.companyCode,
               collectionName: "vend_bill_summary",
               filter: {}
          }
          const res = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));

          let vengstinvList = [];

          res.data.map((element) => {
               
               let vengstinvData = {
                    "oentrydt": element.eNTDT,
                    "SAC":element.gST.sACNM,
                    "DocumentType": element?.docNo || '',
                    "GSTRATE":element.gST.rATE||'',
                    "TDS_Rate":element.tDS.rATE||'',
                    "TDS_Amount":element.tDS.aMT||'',
                    "BILLNO":element?.docNo||'',
                    "BILLDT":formatDocketDate(element?.bDT||''),
                    "BILLSTATUS":element?.bSTATNM||'',
                    "BillBanch":element?.eNTLOC||'',  
                    "BillGenState":element?.eNTLOC||'', 
                    "Generation_GSTNO":element?.gST.iGST||'',
                    "Bill_Sub_At":element?.eNTLOC||'',  
                    "TCS_Rate":element?.tDS.rATE||'',
                    "TCS_Amount":element?.tDS.aMT||'',
                    "MANUALBILLNO":element?.docNo||'',
                    "Party": `${element?.vND.cD || ''} : ${element?.vND.nM || ''}`,
                    "PartyType": "",
                    "Bill_To_State": "",
                    "Party_GSTN": "",
                    "BusinessType": "",
                    "Total_Taxable_Value": "",
                    "RCM": "",
                    "IGST": "",
                    "CGST": "",
                    "SGST_UGST": "",
                    "Total_Invoice_Value": "",
                    "TDS Ledger ": "",
                    "TDS Section Description ": "",
                    "REMARK": "",
                    "ReceiverName": "",
                    "ApplicableTax": "",
                    "ECommerceGSTIN": "",
                    "VENDORBILLDT": "",
                    "Currency": "",
                    "ExchangeRt": "",
                    "CurrencyAmt": "",
                    "PayBasis": "",
                    "Narration": "",
                    "UserId": "",
                    "GSTExemptionCat": "",
                    "IrnNo": "",
                    "InvNetValue": "",
               }
               vengstinvList.push(vengstinvData)
          })
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
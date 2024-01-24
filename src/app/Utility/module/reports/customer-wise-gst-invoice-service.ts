import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
import { formatDocketDate } from "../../commonFunction/arrayCommonFunction/uniqArray";
import * as XLSX from 'xlsx';
@Injectable({
     providedIn: "root",
})
export class CustGSTInvoiceService {
     constructor(
          private masterServices: MasterService,
          private storage: StorageService
     ) { }

     async getcustomerGstRegisterReportDetail(start, end) {
          const startValue = start;
          const endValue = end;
          const reqBody = {
               companyCode: this.storage.companyCode,
               collectionName: "cust_bill_headers",
               filter: {
                    cID: this.storage.companyCode,
                    "D$and": [
                         {
                              "bGNDT": {
                                   "D$gte": startValue
                              }
                         },
                         {
                              "bGNDT": {
                                   "D$lte": endValue
                              }
                         }
                    ]
               }
          }
          const res = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
          reqBody.collectionName = "cust_bill_details"
          const rescustdetail = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
          reqBody.collectionName = "docket_invoices"
          const resdocketinv = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));

          let custstinvList = [];

          res.data.map((element) => {

               const custdetailDet = rescustdetail.data ? rescustdetail.data.find((entry) => entry.bILLNO === element?.bILLNO) : null;
               const docketinvDet = resdocketinv.data ? resdocketinv.data.find((entry) => entry.dKTNO === custdetailDet?.dKTNO) : null;
               let iGST = 0;
               let cGST = 0;
               let invoiceNo = 0;
               let invAmt = 0;
               if (custdetailDet) {
                    iGST = custdetailDet.iGST;
                    cGST = custdetailDet.cGST;
               }
               if (docketinvDet) {
                    invoiceNo = docketinvDet.iNVNO;
                    invAmt = docketinvDet.iNVAMT
               }
               let custgstinvData = {
                    "BILLNO": element?.bILLNO || '',
                    "BILLDT": formatDocketDate(element?.bGNDT || ''),
                    "DocumentType": '',
                    "BILLSTATUS": element?.bSTSNM || '',
                    "BillGenState": element?.cUST.sT || '',
                    "BillBanch": element?.bLOC || '',
                    "GSTRATE": element?.gST.rATE || '',
                    "PayBasis": element?.pAYBAS || '',
                    "Generation_GSTNO": element?.gST.iGST || '',
                    "BillSubAt": element?.bLOC || '',
                    "GSTTotal": element?.gST.aMT || '',
                    "IGST": iGST,
                    "CGST": cGST,
                    "Currency": element?.CURR || '',
                    "CurrencyAmount": element?.aMT || '',
                    "Party": `${element?.cUST.cD || ''} : ${element?.cUST.nM || ''}`,
                    "PartyType": "",
                    "BillToState": element?.cUST.sT || '',
                    "PartyGSTN": element?.cUST.gSTIN || '',
                    "BusinessType": element?.bUSVRT || '',
                    "Total_Taxable_Value": "",
                    "SAC": "",
                    "RCM": "",
                    "SGSTUGST": "",
                    "CNAMT": "",
                    "TotalInvoice_Value": invAmt || 0.00,
                    "TDSRate": "",
                    "TDSAmount": "",
                    "TDSSec": "",
                    "ReasonForIssue": "",
                    "InvoiceNo": invoiceNo || '',
                    "Manualno": invoiceNo || '',
                    "ExchangeRate": "",
                    "GstExempted": "",
                    "Narration": "",
                    "UserId": "",
                    "ExemptionCategory": "",
                    "IrnNo": "",
               }
               custstinvList.push(custgstinvData)
          })
          return custstinvList;
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
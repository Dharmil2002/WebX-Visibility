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

     async getcustomerOutstandingReportDetail() {
          const reqBody = {
               companyCode: this.storage.companyCode,
               collectionName: "cust_bill_headers",
               filter: {}
          }
          const res = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
          reqBody.collectionName = "cust_bill_collection"
          const rescustBill = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));

          let custoutstandList = [];

          res.data.map((element) => {

               const custBillDet = rescustBill.data ? rescustBill.data.find((entry) => entry.bILLNO === element?.bILLNO) : null;
               let Amount = 0;
               if (custBillDet) {
                    Amount = custBillDet.aMT;
               }

               let custoutData = {
                    "oloc": element.bLOC,
                    "obGNDT": element.bGNDT,
                    "custCode": element.cUST.cD || '',
                    "cust": element.cUST.nM || '',
                    "openingBal": element.aMT || '',
                    "billAmt": element.aMT || '',
                    "unsubmittedAmt": element.aMT || '',
                    "submittedAmt": element.aMT || '',
                    "collectionAmt": Amount,
                    "TotalPending":'',
                    "ManualVoucherAmount":'',
                    "OnAccountBalance":'',
                    "LedgerBalance":'',
                    "0-15": "",
                    "16-30": "",
                    "31-45": "",
                    "46-60": "",
                    "61-75": "",
                    "75-90": "",
                    "91-120": "",
                    "120-180": "",
                    "180-365": "",
                    "Above 365": "",
               }
               custoutstandList.push(custoutData)
          })
          return custoutstandList;
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
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

     async getvendorWiseOutReportDetail(start, end) {
          const startValue = start;
          const endValue = end;
          const reqBody = {
               companyCode: this.storage.companyCode,
               collectionName: "vend_bill_summary",
               filter: {
                    cID: this.storage.companyCode,
                    "D$and": [
                         {
                              "bDT": {
                                   "D$gte": startValue
                              }
                         },
                         {
                              "bDT": {
                                   "D$lte": endValue
                              }
                         }
                    ]
               }
          }
          const res = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
          reqBody.collectionName = "vend_bill_payment"
          const resvoucher = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));

          let venoutList = [];

          res.data.map((element, index) => {
               const voucherDet = resvoucher.data ? resvoucher.data.find((entry) => entry.bILLNO === element?.docNo) : null;
               let voucher = 0;
               let accountAmt = 0;
               if (voucherDet) {
                    voucher = voucherDet.vUCHNO;
                    accountAmt = voucherDet.bILLAMT;
               }
               `${element?.vND.cD || ''} : ${element?.vND.nM || ''}`
               let venoutData = {
                    "lOC": element.eNTLOC,
                    "srNo": index + 1,
                    // "vendorCD": element?.vND.cD || '',
                    // "vendor": element?.vND.nM || '',
                    "vendor": `${element?.vND.cD || ''} : ${element?.vND.nM || ''}`,
                    "openingBal": element?.tHCAMT || '',
                    "totalBillAmtFrom010423To111223": '',
                    "paidAmtFrom010423To111223": "",
                    "finalized": "",
                    "unFinalized": "",
                    "0-30": "",
                    "31-60": "",
                    "61-90": "",
                    "91-120": "",
                    "121-150": "",
                    "151-180": "",
                    ">180": "",
                    "totalPayable": element?.gST.aMT || '',
                    "onAccountAmt": accountAmt,
                    "manualVoucher": voucher,
                    "jVAmt": "",
                    "paidAdvanceAmount": element?.aDVAMT || '',
                    "ledgerBalance": ""
               }
               venoutList.push(venoutData)
          });
          return venoutList;
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
     const workbook: XLSX.WorkBook = { Sheets: { 'Vendor_Wise_Outstanding_Report': worksheet }, SheetNames: ['Vendor_Wise_Outstanding_Report'] };
     // Write the workbook to an Excel file with the specified filename.
     XLSX.writeFile(workbook, `${excelFileName}.xlsx`);
}

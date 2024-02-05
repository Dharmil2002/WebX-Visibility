import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
import { formatDocketDate } from "../../commonFunction/arrayCommonFunction/uniqArray";
import * as XLSX from 'xlsx';
import { PayBasisdetailFromApi } from "src/app/Masters/Customer Contract/CustomerContractAPIUtitlity";
@Injectable({
     providedIn: "root",
})
export class CustGSTInvoiceService {
     constructor(
          private masterServices: MasterService,
          private storage: StorageService
     ) { }

     async getcustomerGstRegisterReportDetail(start, end, docNo) {
          const startValue = start;
          const endValue = end;
          const reqBody = {
               companyCode: this.storage.companyCode,
               collectionName: "cust_bill_headers",
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
                         "bGNDT": {
                              "D$gte": startValue,
                         },
                    },

                    {
                         "bGNDT": {
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
          reqBody.collectionName = "cust_bill_details"
          const rescustdetail = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
          reqBody.collectionName = "docket_invoices"
          const resdocketinv = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));

          let custstinvList = [];

          await Promise.all(res.data.map(async (element) => {

               const isGSTINPresent = element?.cUST.gSTIN;
               let paybasis = await PayBasisdetailFromApi(this.masterServices, 'PAYTYP');
               paybasis = paybasis.find(x => x.value === element?.pAYBAS)

               const custdetailDet = rescustdetail.data ? rescustdetail.data.find((entry) => entry.bILLNO === element?.bILLNO) : null;
               const docketinvDet = resdocketinv.data ? resdocketinv.data.find((entry) => entry.dKTNO === custdetailDet?.dKTNO) : null;

               let invoiceNo = 0;

               if (docketinvDet) {
                    invoiceNo = docketinvDet.iNVNO;
                    //invAmt = docketinvDet.iNVAMT
               }
               let custgstinvData = {
                    "BILLNO": element?.bILLNO || '',
                    "BILLDT": formatDocketDate(element?.bGNDT || ''),
                    "DocumentType": 'General Bill',
                    "BILLSTATUS": element?.bSTSNM || '',
                    "BillGenState": element?.cUST.sT || '',
                    "BillBanch": element?.bLOC || '',
                    "Generation_GSTNO": element?.gEN.gSTIN || '',
                    "Party": `${element?.cUST.cD || ''} : ${element?.cUST.nM || ''}`,
                    "PartyType": isGSTINPresent ? 'Registered' : 'UnRegistered',
                    "BillToState": element?.cUST.sT || '',
                    "PartyGSTN": element?.cUST.gSTIN || '',
                    "BillSubAt": element?.bLOC || '',
                    "BusinessType": element?.bUSVRT || '',
                    "Total_Taxable_Value": element?.dKTTOT || 0.00,
                    "SAC": "",
                    "GSTRATE": element?.gST.rATE || 0,
                    "GSTTotal": element?.gST.aMT || 0.00,
                    "RCM": "",
                    "IGST": element?.gST.iGST || 0,
                    "CGST": element?.gST.cGST || 0,
                    "SGSTUGST": element?.gST.sGST || 0,
                    "CNAMT": 0,
                    "Discount": element?.dAMT || 0,
                    "TotalInvoice_Value": element?.aMT || 0.00,
                    "TDSRate": 0,
                    "TDSAmount": 0.00,
                    "TDSSec": "",
                    "ReasonForIssue": "",
                    "InvoiceNo": invoiceNo || '',
                    "Manualno": invoiceNo || '',
                    "Currency": element?.CURR || '',
                    "ExchangeRate": 1,
                    "CurrencyAmount": 0,
                    "GstExempted": element.eXMT ? 'Yes' : 'No',
                    "PayBasis": paybasis?.name || '',
                    "Narration": "",
                    "UserId": element?.eNTBY || '',
                    "ExemptionCategory": "",
                    "IrnNo": "",
               }
               custstinvList.push(custgstinvData)
          }));

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
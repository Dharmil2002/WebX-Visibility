import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
import { formatDocketDate } from "../../commonFunction/arrayCommonFunction/uniqArray";
import * as XLSX from 'xlsx';
@Injectable({
     providedIn: "root",
})
export class UnbillRegisterService {
     constructor(
          private masterServices: MasterService,
          private storage: StorageService
     ) { }
     async getunbillRegisterReportDetail(start,end) {
          const startValue = start;
          const endValue = end;
          const reqBody = {
               companyCode: this.storage.companyCode,
               collectionName: "dockets",
               filter: {
                    cID: this.storage.companyCode,
                    "D$and": [
                         {
                              "dKTDT": {
                                   "D$gte": startValue
                              }
                         },
                         {
                              "dKTDT": {
                                   "D$lte": endValue
                              }
                         }
                    ]
               }
          }
          const res = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
          reqBody.collectionName = "job_details"
          const resjobDet = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
          reqBody.collectionName = "cha_headers"
          const rescha = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
          let unbillList = [];
          res.data.map((element) => {

               const custcontractDet = resjobDet.data ? resjobDet.data.find((entry) => entry.dKTNO === element?.docNo) : null;
               const chaDet = rescha.data ? rescha.data.find((entry) => entry.jID === custcontractDet?.jID) : null;
               let CHANo = 0;
               if (chaDet) {
                    CHANo = chaDet.cHAID
               }

               let unbillData = { 
                    "DocketNo": element?.docNo || '',
                    "DocketDate": formatDocketDate(element?.dKTDT || ''),
                    "Origin": element?.oRGN || "",
                    "Destination": element?.dEST || '',
                    "CurrentLocation": element?.eNTLOC || '',
                    "PayBasis": element?.pAYTYPNM || '',
                    "TransportMode": element?.tRNMODNM || '',
                    "ConsignorName": element?.cSGNNM || "",
                    "ConsigneeName": element?.cSGENM || '',
                    "BillingPartyName": element?.bPARTY || '',
                    "PkgsNo": element?.pKGS || '',
                    "ActualWeight": element?.aCTWT || '',
                    "ChargeWeight": element?.cHRWT || '',
                    "FRTRate": element?.fRTRT || '',
                    "DocketStatus": element?.oSTSN || '',
                    "PackagingType": element?.pKGTY || '',
                    "PickupDelivery": element?.pADD || '',
                    "JobNumber": element?.jOBNO || '',
                    "SubTotal": element?.tOTAMT || '',
                    "DocketTotal": element?.tOTAMT || '',
                    "FRTType": element?.fRTRTYN || '',
                    "ADD": "",
                    "EDD": "",
                    "ArrivedDate": "",
                    "BookingType": "FTL",
                    "BillingPartyCode": element?.bPARTY || '',
                    "FreightCharges": element.fRTAMT || 0.00,
                    "RegionalOffice": "",
                    "OriginZone": "",
                    "DestinationZone": "",
                    "Length": "0.00",
                    "Breadth": "0.00",
                    "Height": "0.00",
                    "TotalCFT": "0.00",
                    "CFTRatio": "0.00",
                    "PFMNo": "",
                    "PFMDate": "",
                    "PFMEntryDate": "",
                    "PFMEeneratedBranch": "",
                    "PFMGeneratedBY": "",
                    "PFMReceivedDate": "",
                    "PFMAcknowlegedBranch": "",
                    "PFMAcknowlegedBY": "",
                    "PFMStatus": "",
                    "CHANumber": CHANo || ''
               }
               unbillList.push(unbillData)
          })
          return unbillList
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
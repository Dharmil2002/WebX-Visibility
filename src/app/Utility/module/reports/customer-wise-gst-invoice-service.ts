import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
import { formatDocketDate } from "../../commonFunction/arrayCommonFunction/uniqArray";
@Injectable({
     providedIn: "root",
})
export class CustGSTInvoiceService {
     constructor(
          private masterServices: MasterService,
          private storage: StorageService
     ) { }

     async getcustomerGstRegisterReportDetail() {
          const reqBody = {
               companyCode: this.storage.companyCode,
               collectionName: "Cust_bills_headers",
               filter: {}
          }
          const res = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));

          let custstinvList = [];

          res.data.map((element) => {

               let custgstinvData = {
                    "obGNDT":element.bGNDT,
                    "BILLNO":element?.bILLNO||'',
                    "BILLDT":formatDocketDate(element?.bGNDT||''),
                    "BILLSTATUS":element?.bSTSNM||'',
                    "BillBanch":element?.bLOC||'',
                    "GSTRATE":element?.gST.rATE||'',
                    "PayBasis":element?.pAYBAS||'',
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
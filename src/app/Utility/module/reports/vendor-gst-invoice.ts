import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
import { formatDocketDate } from "../../commonFunction/arrayCommonFunction/uniqArray";
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
                    "MANUALBILLNO":element?.docNo||''
                   
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
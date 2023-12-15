import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
@Injectable({
     providedIn: "root",
})
export class VendorWiseOutService {
     constructor(
          private masterServices: MasterService,
          private storage: StorageService
     ) { }

     async getvendorWiseOutReportDetail() {
          const reqBody = {
               companyCode: this.storage.companyCode,
               collectionName: "vend_bill_summary",
               filter: {}
          }
          const res = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
        
          let venoutList = [];

          res.data.map((element, index) => {
               
               let venoutData = {
                    "lOC":element.lOC,
                    "obDT":element.bDT,
                    "srNo": element.srNo = index + 1,
                    "Vendor":element.vND.nM||''
               }
               venoutList.push(venoutData)
          })
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
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

               let venoutData = {
                    "lOC": element.eNTLOC,
                    "obDT": element.bDT,
                    "srNo": element.srNo = index + 1,
                    "vendorCD": element?.vND.cD || '',
                    "vendor": element?.vND.nM || '',
                    "openingBal": element?.tHCAMT || '',
                    "manualVoucher": voucher,
                    "paidAdvanceAmount": element?.aDVAMT || '',
                    "totalPayable": element?.gST.aMT || '',
                    "onAccountAmt": accountAmt
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
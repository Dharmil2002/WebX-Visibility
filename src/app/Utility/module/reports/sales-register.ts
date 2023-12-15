import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
import { formatDocketDate } from "../../commonFunction/arrayCommonFunction/uniqArray";
@Injectable({
     providedIn: "root",
})
export class SalesRegisterService {
     constructor(
          private masterServices: MasterService,
          private storage: StorageService
     ) { }

     async getsalesRegisterReportDetail() {
          const reqBody = {
               companyCode: this.storage.companyCode,
               collectionName: "dockets",
               filter: {}
          }
          const res = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
          
          let salesList = [];
          res.data.map((element) => {
               let salesData = {
                    "ocNOTEDT": element?.dKTDT,
                    "cNOTENO": element?.docNo || '',
                    "cNOTEDT": formatDocketDate(element?.dKTDT || ''),
                    "pAYTY": element?.pAYTYPNM || '',
                    "vEHNO": element?.vEHNO || '',
                    "bILLPARTYNM": element?.bPARTY || '',
                    "mOVTY": element?.mODNM || '',
                    "tRANMODE": element?.tRNMODNM || '',
                    "sTAT": element?.oSTSN || '',
                    "fROMCITY": element?.fCT || '',
                    "tOCITY": element?.tCT || "",
                    "VendorName": element?.vNDNM || '',
                    "NoofPkgs": element?.pKGS || '',
                    "ActualWeight": element?.aCTWT || '',
                    "ChargedWeight": element?.cHRWT || '',
                    "PackagingType": element?.pKGTY || '',
                    "GSTAmount": element?.gSTAMT || '',
                    "RiskType": element?.rSKTYN || '',
                    "EntryDate": formatDocketDate(element?.eNTDT || ''),
                    "EntryBy": element?.eNTBY || '',
                    "ConsignorId": element?.cSGNCD || '',
                    "ConsignorName": element?.cSGNNM || '',
                    "ConsignorMobileNo": element?.cSGNPH || '',
                    "ConsigneeId": element?.cSGECD || '',
                    "ConsigneeName": element?.cSGENM || '',
                    "ConsigneeMobileNo": element?.cSGEPH || '',
                    "JobNumber": element?.jOBNO || '',
                    "Weight": element?.wTIN || '',
                    "origin": element?.oRGN || '',
                    "destin": element?.dEST || '',
                    "booktp": element?.dELTYN || ""


               }
               salesList.push(salesData)
          })
          return salesList
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
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
     async getunbillRegisterReportDetail(start, end) {
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


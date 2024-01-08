import { firstValueFrom } from "rxjs";

import { Injectable } from "@angular/core";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
import { formatDocketDate } from "../../commonFunction/arrayCommonFunction/uniqArray";
@Injectable({
     providedIn: "root",
})
export class CnwGstService {
     constructor(
          private masterServices: MasterService,
          private storage: StorageService
     ) { }

     // async getCNoteGSTregisterReportDetail() {
     //      const reqBody = {
     //           companyCode: this.storage.companyCode,
     //           collectionName: "docket_temp",
     //           filter: {}
     //      }
     //      const res = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
     //      return res.data
     // }

     // async getCNoteGSTregisterReportDetail() {
     //      const reqBody = {
     //           companyCode: this.storage.companyCode,
     //           collectionName: "docket_temp",
     //           filter: {}
     //      }
     //      const res = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
     //      let cnotegstList = [];
     //      res.data.map((element) => {
     //           let jobgstData = {
     //                "docketNumber": element?.docketNumber || "",
     //                "odocketDate": element.docketDate,
     //                "docketDate": formatDocketDate(element?.docketDate || ""),
     //                "billingParty": element?.billingParty || "",
     //                "movementType": element?.movementType || "",
     //                "payType": element?.payType || "",
     //                "origin": element?.origin || "",
     //                "destination": element?.destination,
     //                "fromCity": element?.fromCity || "",
     //                "toCity": element?.toCity || "",
     //                "prqNo": element?.prqNo || "",
     //                "transMode": element?.transMode || "",
     //                "vendorType": element?.vendorType || "",
     //                "vendorName": element?.vendorName || "",
     //                "pAddress": element?.pAddress || "",
     //                "dAddress": element?.deliveryAddress || "",
     //                "prLrNo": element?.pr_lr_no || "",
     //                "pck_type": element?.packaging_type || "",
     //                "wt_in": element?.weight_in || "",
     //                "gpChDel": element?.gp_ch_del || "",
     //                "risk": element?.risk || "",
     //                "deltype": element?.delivery_type || "",
     //                "issuingFrom": element?.issuing_from || "",
     //                "vehicleNo": element?.vehicleNo || "",
     //                "consignorName": element?.consignorName || "",
     //                "consignorCntNo": element?.ccontactNumber || "",
     //                "consigneeName": element?.consigneeName || "",
     //                "consigneeCntNo": element?.cncontactNumber || "",
     //                "ewayBill": element.invoiceDetails && element.invoiceDetails.length > 0 ? element.invoiceDetails[0].ewayBillNo : "",
     //                "expDt": formatDocketDate(element.invoiceDetails && element.invoiceDetails.length > 0 ? element.invoiceDetails[0].expiryDate : ""),
     //                "invoiceNo": element.invoiceDetails && element.invoiceDetails.length > 0 ? element.invoiceDetails[0].invoiceNo : "",
     //                "invoiceAmt": element.invoiceDetails && element.invoiceDetails.length > 0 ? element.invoiceDetails[0].invoiceAmount : "",
     //                "NoofPck": element.invoiceDetails && element.invoiceDetails.length > 0 ? element.invoiceDetails[0].noofPkts : "",
     //                "materialNm": element.invoiceDetails && element.invoiceDetails.length > 0 ? element.invoiceDetails[0].materialName : "",
     //                "actualWt": element.invoiceDetails && element.invoiceDetails.length > 0 ? element.invoiceDetails[0].actualWeight : "",
     //                "charWt": element.invoiceDetails && element.invoiceDetails.length > 0 ? element.invoiceDetails[0].chargedWeight : "",
     //                "freightRt": element?.freight_rate || "",
     //                "freightRtTp": element?.freightRatetype || "",
     //                "freightAmt": element?.freight_amount || "",
     //                "otherAmt": element?.otherAmount || "",
     //                "grossAmt": element?.grossAmount || "",
     //                "rcm": element?.rcm || "",
     //                "gstAmt": element?.gstAmount || "",
     //                "gstcharAmt": element?.gstChargedAmount || "",
     //                "TotAmt": element?.totalAmount || ""
     //           }
     //           cnotegstList.push(jobgstData)
     //      })
     //      return cnotegstList
     // }
     async getCNoteGSTregisterReportDetail() {
          const reqBody = {
               companyCode: this.storage.companyCode,
               collectionName: "dockets",
               filter: {}
          }
          const res = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
          reqBody.collectionName = "job_details"
          const resjob = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
          reqBody.collectionName = "cha_headers"
          const rescha = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
          reqBody.collectionName = "cha_details"
          const reschaDet = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
          let cnotegstList = [];
          res.data.map((element) => {

               const jobDet = resjob.data ? resjob.data.find((entry) => entry.jID === element?.jOBNO) : null;
               const chaDet = rescha.data ? rescha.data.find((entry) => entry.jID === element?.jOBNO) : null;
               const chaDetail = reschaDet.data ? reschaDet.data.find((entry) => entry.cHAID === chaDet?.cHAID) : null;
               let jobid = 0;
               let jobDate = 0;
               let cHAID = 0;
               let chanum = 0;
               let chadate = 0;
               let chaAmt = 0;
               if (jobDet) {
                    jobid = jobDet.jID;
                    jobDate = jobDet.jDT;
               }
               if (chaDet) {
                    cHAID = chaDet.cHAID;
               }
               if (chaDetail) {
                    chanum = chaDetail.cHAID;
                    chadate = chaDetail.eNTDT;
                    chaAmt = chaDetail.tOTAMT;
               }

               let jobgstData = {
                    "docketNumber": element?.docNo || "",
                    "odocketDate": element.dKTDT,
                    "docketDate": element?.dKTDT ? new Date(element.dKTDT).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '-') : "",
                    "time": element.dKTDT ? new Date(element.dKTDT).toLocaleTimeString('en-US', { hour12: false }) : "", // Extract time from dKTDT
                    "edd": "",
                    "bbrnch": element?.eNTLOC || '',
                    "dbranch": element?.dEST || '',
                    "payty": element?.pAYTYPNM || '',
                    "busity": "",
                    "prod": "",
                    "contID": "",
                    "conpar": element?.bPARTY || '',
                    "sertp": 'FTL',
                    "vehno": element?.vEHNO || "",
                    "billparnm": element?.bPARTY || '',
                    "bacode": "",
                    "lastmodby": element?.eNTBY || '',
                    "cnotemoddt": formatDocketDate(element?.eNTDT || ''),
                    "cusrefno": "",
                    "movty": element?.mODNM || '',
                    "tranmode": element?.tRNMODNM || '',
                    "status": element?.oSTSN || '',
                    "loadty": element?.loadty || '',
                    "subtot": element?.tOTAMT || '',
                    "doctot": element?.tOTAMT || '',
                    "gstrt": "",
                    "gstamt": element?.gSTAMT || "",
                    "frtrt": element?.fRTRT || '',
                    "frttp": element?.fRTRTYN || '',
                    "frichar": element?.fRTAMT || '',
                    "otherchar": "",
                    "greentax": "",
                    "dropchar": "",
                    "docchar": "",
                    "warchar": "",
                    "deduc": "",
                    "unloadchar": "",
                    "holiserchar": "",
                    "focchar": "",
                    "codchar": "",
                    "appchar": "",
                    "odachar": "",
                    "fuelchar": "",
                    "loadchar": "",
                    "gstchar": "",
                    "advremark": "",
                    "dphrt": "",
                    "dphamt": "",
                    "disrt": "",
                    "discamt": "",
                    "jobno": jobid,
                    // "jobdt": jobDate,
                    "jobdt": formatDocketDate(jobDate || ''),
                    "chano": chanum,
                    // "chadt": chadate,
                    "chadt": formatDocketDate(chadate || ''),
                    "chaamt": chaAmt,
                    "tCT": element?.tCT || '',
                    "fCT": element?.fCT || "",
                    "oRGN": element?.oRGN || '',
                    "dEST": element?.dEST || '',
                    "cSGNNM": element?.cSGNNM,
               }
               cnotegstList.push(jobgstData)
          })
          return cnotegstList
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


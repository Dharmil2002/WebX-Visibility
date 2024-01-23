import { firstValueFrom } from "rxjs";

import { Injectable } from "@angular/core";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
import { formatDocketDate } from "../../commonFunction/arrayCommonFunction/uniqArray";
import * as XLSX from 'xlsx';
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
     async getCNoteGSTregisterReportDetail(start, end) {
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
          const resjob = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
          reqBody.collectionName = "cha_headers"
          const rescha = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
          reqBody.collectionName = "cha_details"
          const reschaDet = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
          reqBody.collectionName = "docket_fin_det"
          const resdocfin = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
          reqBody.collectionName = "cust_contract"
          const rescuscontract = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));

          let docketCharges = [];
          resdocfin.data.forEach(element => {
               if (element.cHG.length > 0) {
                    element.cHG.forEach(chg => {
                         const docketCharge = {
                              dKTNO: element?.dKTNO || "",
                              [chg.cHGNM]: chg?.aMT || 0.00
                         }
                         docketCharges.push(docketCharge);
                    });
               }
          });

          let cnotegstList = [];
          res.data.map((element) => {
               const relevantCharges = docketCharges.filter(charge => charge.dKTNO === element?.dKTNO);
               const jobDet = resjob.data ? resjob.data.find((entry) => entry.jID === element?.jOBNO) : null;
               const chaDet = rescha.data ? rescha.data.find((entry) => entry.jID === element?.jOBNO) : null;
               const chaDetail = reschaDet.data ? reschaDet.data.find((entry) => entry.cHAID === chaDet?.cHAID) : null;
               const custcontractDet = rescuscontract.data ? rescuscontract.data.find((entry) => entry.cUSTID === element?.bPARTY) : null;
               let jobid = 0;
               let jobDate = 0;
               let cHAID = 0;
               let chanum = 0;
               let chadate = 0;
               let chaAmt = 0;
               let contID = 0;
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
               if (custcontractDet) {
                    contID = custcontractDet.cONID
               }
               const gstrt = (element?.gSTAMT || 0) / (element?.fRTRT || 1) + '%';
               let jobgstData = {
                    "docketNumber": element?.docNo || "",
                    "docketDate": element?.dKTDT ? new Date(element.dKTDT).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '-') : "",
                    "time": element.dKTDT ? new Date(element.dKTDT).toLocaleTimeString('en-US', { hour12: false }) : "", // Extract time from dKTDT
                    "edd": element.dKTDT ? (() => {
                         const cNOTEDate = new Date(element.dKTDT);
                         cNOTEDate.setDate(cNOTEDate.getDate() + 1);
                         return cNOTEDate.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '-');
                    })() : "",
                    "bbrnch": element?.eNTLOC || '',
                    "dbranch": element?.dEST || '',
                    "payty": element?.pAYTYPNM || '',
                    "busity": "FTL", //  filter
                    "prod": element?.tRNMODNM || '',
                    "contID": contID || '',
                    "conpar": element?.bPARTYNM || '',
                    "sertp": 'FTL',
                    "vehno": element?.vEHNO || "",
                    "billparnm": element?.bPARTYNM || '',
                    "bacode": "",
                    "lastmodby": element?.eNTBY || '',
                    "cnotemoddt": formatDocketDate(element?.eNTDT || ''),
                    "cusrefno": "",
                    "movty": element?.mODNM || '',
                    "tranmode": element?.tRNMODNM || '',
                    "status": element?.oSTSN || '',
                    "loadty": 'FTL' || '',
                    "subtot": element?.tOTAMT || '',
                    "doctot": element?.tOTAMT || '',
                    "gstrt": gstrt, //  filter
                    "gstamt": element?.gSTAMT || "",
                    "frtrt": element?.fRTRT || '',
                    "frttp": element?.fRTRTYN || '',
                    "frichar": element?.fRTAMT || '',
                    "otherchar": element?.oTHAMT || '',
                    "greentax": "0.00",
                    "dropchar": "0.00",
                    "docchar": "0.00",
                    "warchar": "0.00",
                    "deduc": "0.00",
                    "unloadchar": "0.00",
                    "holiserchar": "0.00",
                    "focchar": "0.00",
                    "codchar": "0.00",
                    "appchar": "0.00",
                    "odachar": "0.00",
                    "fuelchar": "0.00",
                    "loadchar": '0.00',
                    "gstchar": "0.00",
                    "advremark": "",
                    "dphrt": "",
                    "dphamt": "",
                    "disrt": "",
                    "discamt": "",
                    "jobno": jobid || '',
                    "jobdt": formatDocketDate(jobDate || ''),
                    "chano": chanum || '',
                    "chadt": formatDocketDate(chadate || ''),
                    "chaamt": chaAmt || '',
                    "tCT": element?.tCT || '',
                    "fCT": element?.fCT || "",
                    "oRGN": element?.oRGN || '',
                    "dEST": element?.dEST || '',
                    "cSGNNM": element?.cSGNNM,
               }
               const loadingCharge = relevantCharges.find(charge => charge.hasOwnProperty("Loading"));
               const UnloadingCharge = relevantCharges.find(charge => charge.hasOwnProperty("Unloading"));

               if (loadingCharge) {
                    jobgstData.loadchar = loadingCharge.Loading !== undefined ? Number(loadingCharge.Loading).toFixed(2) : "0.00";
                    jobgstData.unloadchar = UnloadingCharge.Unloading !== undefined ? Number(UnloadingCharge.Unloading).toFixed(2) : "0.00";

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


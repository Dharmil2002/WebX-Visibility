import { firstValueFrom } from "rxjs";

import { Injectable } from "@angular/core";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
import { formatDocketDate } from "../../commonFunction/arrayCommonFunction/uniqArray";
import * as XLSX from 'xlsx';
@Injectable({
     providedIn: "root",
})
export class CnoteBillMRService {
     constructor(
          private masterServices: MasterService,
          private storage: StorageService
     ) { }

     async getCNoteBillMRReportDetail() {
          const reqBody = {
               companyCode: this.storage.companyCode,
               collectionName: "cust_bill_details",
               filter: {}
          }
          const res = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
          reqBody.collectionName = "cust_bill_headers"
          const rescustBillHeaders = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
          reqBody.collectionName = "cust_bill_collection"
          const rescustbillcoll = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
          reqBody.collectionName = "dockets"
          const resDocketTemp = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
          reqBody.collectionName = "docket_invoices"
          const resdocinv = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
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

          let cnotebillList = [];
          res.data.map((element) => {
               // Filter docketCharges based on matching dKTNO
               const relevantCharges = docketCharges.filter(charge => charge.dKTNO === element?.dKTNO);
               const custBillHeaderDet = rescustBillHeaders.data ? rescustBillHeaders.data.find((entry) => entry.bILLNO === element?.bILLNO) : null;
               const custbillcollDet = rescustbillcoll.data ? rescustbillcoll.data.find((entry) => entry.bILLNO === element?.bILLNO) : null;
               const docDet = resDocketTemp.data ? resDocketTemp.data.find((entry) => entry.docNo === element?.dKTNO) : null;
               const docinvDet = resdocinv.data ? resdocinv.data.find((entry) => entry.dKTNO === docDet?.docNo) : null;
               const custcontractDet = rescuscontract.data ? rescuscontract.data.find((entry) => entry.cUSTID === docDet?.bPARTY) : null;
               let pAYBAS = 0;
               let billGenDt = 0;
               let subLoc = 0;
               let subDt = 0;
               let billColAt = 0;
               let billAmt = 0;
               let billcollDt = 0;
               let billParty = 0;
               let billStatus = 0;
               let mrNo = 0;
               let deliveryType = 0;
               let businessType = 0;
               let vehNo = 0;
               let billPartyNM = 0;
               let docketeditDt = 0;
               let moveType = 0;
               let TransMode = 0;
               let DocketDt = 0;
               let toCity = 0;
               let fromCity = 0;
               let actualWeight = 0;
               let packs = 0;
               let chargedWeight = 0;
               let cubicWeight = 0;
               let invNo = 0;
               let invDt = 0;
               let len = 0;
               let breadth = 0;
               let height = 0;
               let riskType = 0;
               let gstAmt = 0;
               let FRTRt = 0;
               let FRTRtType = 0;
               let otherChar = 0;
               let freigthAmt = 0;
               let billGenLoc = 0;
               let GSTrate = 0;
               let GSTChar = 0;
               let contId = 0;
               let contParty = 0;
               let decvalue = 0;
               if (custBillHeaderDet) {
                    billGenDt = custBillHeaderDet.bGNDT;
                    subLoc = custBillHeaderDet.sUB.lOC;
                    subDt = custBillHeaderDet.sUB.dTM;
                    billParty = custBillHeaderDet.cUST.nM
                    billStatus = custBillHeaderDet.bSTSNM
                    businessType = custBillHeaderDet.bUSVRT
                    billGenLoc = custBillHeaderDet.gEN.lOC
                    GSTrate = custBillHeaderDet.gST.rATE
                    GSTChar = custBillHeaderDet.gST.aMT
               }
               if (custbillcollDet) {
                    billAmt = custbillcollDet.aMT
                    billcollDt = custbillcollDet.dTM
                    billColAt = custbillcollDet.lOC;
                    mrNo = custbillcollDet.mRNO
               }
               if (docDet) {
                    deliveryType = docDet.dELTYN
                    pAYBAS = docDet.pAYTYPNM
                    vehNo = docDet.vEHNO
                    billPartyNM = docDet.bPARTYNM
                    docketeditDt = docDet.eNTDT
                    moveType = docDet.mODNM
                    TransMode = docDet.tRNMODNM
                    DocketDt = docDet.dKTDT
                    fromCity = docDet.fCT
                    toCity = docDet.tCT
                    actualWeight = docDet.aCTWT
                    packs = docDet.pKGS
                    chargedWeight = docDet.cHRWT
                    cubicWeight = docDet.cFTWT
                    riskType = docDet.rSKTYN
                    gstAmt = docDet.gSTAMT
                    FRTRt = docDet.fRTRT
                    FRTRtType = docDet.fRTRTYN
                    otherChar = docDet.oTHAMT
                    freigthAmt = docDet.fRTAMT
               }
               if (docinvDet) {
                    invNo = docinvDet.iNVNO
                    invDt = docinvDet.eNTDT
                    len = docinvDet.vOL.l
                    breadth = docinvDet.vOL.b
                    height = docinvDet.vOL.h
                    decvalue = docinvDet.iNVAMT
               }
               if (custcontractDet) {
                    contId = custcontractDet.cONID
                    contParty = custcontractDet.cUSTNM
               }
               let cnotebillData = {
                    "oeNTDT": element?.eNTDT,
                    "bOOKINGTPE": deliveryType,
                    "dEST": element?.dEST,
                    "oRGN": element?.oRGN,
                    "mANUALBILLNO": element?.bILLNO || '',
                    "bILLGENAT": billGenLoc,
                    "bILLDT": formatDocketDate(billGenDt || ''),
                    "bILSUBAT": subLoc,
                    "bILLSUBDT": formatDocketDate(subDt || ''),
                    "bILLcOLLECTAT": billColAt || '',
                    "bILLCOLLECTDT": formatDocketDate(billcollDt || ''),
                    "bILLAMT": billAmt || '0.00',
                    "bILLPAR": billParty || '',
                    "bILLPENAMT": "0.00",
                    "bILLST": billStatus || '',
                    "bILLNO": element?.bILLNO || '',
                    "mRNO": mrNo || '',
                    "mANUALMRNO": mrNo || '',
                    "mRDT": formatDocketDate(billcollDt || ''),
                    "mRCLOSEDT": "",
                    "mRENTRYDT": "",
                    "mRGENAT": "",
                    "mRAMT": "0.00",
                    "mRNETAMT": "0.00",
                    "mRSTAT": "",
                    "dEMCHAR": "0.00",
                    "cNOTENO": element?.dKTNO || "",
                    "cNOTEDT": DocketDt ? new Date(DocketDt).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '-') : "",
                    "tIME": DocketDt ? new Date(DocketDt).toLocaleTimeString('en-US', { hour12: false }) : "", // Extract time from dKTDT
                    "eDD": DocketDt ? (() => {
                         const cNOTEDate = new Date(DocketDt);
                         cNOTEDate.setDate(cNOTEDate.getDate() + 1);
                         return cNOTEDate.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '-');
                    })() : "",
                    "bOOKBRANCH": element?.oRGN || "",
                    "dELIBRANCH": element?.dEST || "",
                    "pAYTYPE": pAYBAS || '',
                    "bUSTYPE": businessType || '',
                    "pROD": "Road",
                    "cONID": contId || '',
                    "cONTPARTY": contParty || '',
                    "sERTYPE": "FTL",
                    "vEHNO": vehNo || '',
                    "bILLPARTYNM": billPartyNM || '',
                    "bACODE": "",
                    "eEDD": "",
                    "lASTEDITBY": element?.eNTBY || '',
                    "cNOTEEDITDT": formatDocketDate(docketeditDt || ''),
                    "cUSTREFNO": "",
                    "mOVTYPE": moveType||'',
                    "tRANMODE": TransMode||'',
                    // "sTAT": element?.bSTSNM || '',
                    "sTAT": "Stock avaiable @ " + element?.dEST,
                    "lOADTPE": "FTL",
                    "rEM": "",
                    "bILLAT": element?.eNTLOC || '',
                    "pINCODE": "",
                    "lOCALCNOTE": "",
                    "fROMZN": "",
                    "tOZN": "",
                    "oDA": "",
                    "fROMCITY": fromCity || '',
                    "tOCITY": toCity || '',
                    "pKGS": packs,
                    "aCTWT": actualWeight,
                    "cHARWT": chargedWeight,
                    "sPEINSTRUCT": "",
                    "pKGTPE": "Carton Box",
                    "cUBICWT": cubicWeight,
                    "cHRPKG": packs,
                    "cHARGKM": "0.00",
                    "iNVNO": invNo||'',
                    "iNVDT": formatDocketDate(invDt || ''),
                    "dELVALUE": decvalue,
                    "lEN": len,
                    "bRTH": breadth,
                    "hGT": height,
                    "cONTENT": "",
                    "bATCHNO": "",
                    "pARTNO": "",
                    "pARTDESC": "",
                    "pARTQUAN": "0",
                    "fUELRTTPE": "",
                    "fOVRTTPE": "",
                    "cFTRATIO": "0.00",
                    "tTCFT": "0.00",
                    "sEROPTEDFOR": "0.00",
                    "fSCCHARRT": "",
                    "fOV": "",
                    "mULDELIV": "",
                    "mULPICKUP": "",
                    "rISKTPE": riskType || '',
                    "cOD/DOD": "",
                    "dACC": "",
                    "dEF": "",
                    "pOLNO": "",
                    "pOLDT": "",
                    "wTTPE": "",
                    "dEFAULTCARDRT": "0.00",
                    "fUELPERRT": "0.00",
                    "sUBTOT": element?.sUBTOT || '0.00',
                    "dOCTOT": element?.dKTTOT || '0.00',
                    "gSTAMT": gstAmt || '0.00',
                    "fRTRT": FRTRt || '0.00',
                    "fRTTPE": FRTRtType || '',
                    "fRIGHTCHAR": freigthAmt || '0.00',
                    "oTHERCHAR": otherChar || '00.00',
                    "gREENTAX": '0.00',
                    "dROPCHAR": '0.00',
                    "dOCCHAR": '0.00',
                    "wARECHAR": '0.00',
                    "dEDUC": '0.00',
                    "hOLISERVCHAR": '0.00',
                    "fOVCHAR": '0.00',
                    "cOD/DODCHAR": '0.00',
                    "aPPCHAR": '0.00',
                    "oDACHAR": '0.00',
                    "fUELCHAR": '0.00',
                    "mULPICKUPCHAR": '0.00',
                    "uNLOADCHAR": '0.00',
                    "mULTIDELCHAR": '0.00',
                    "lOADCHAR": '0.00',
                    "gSTRT": GSTrate,
                    "gSTCHAR": GSTChar,
                    "vATRT": "0.00",
                    "vATAMT": "0.00",
                    "cALAMITYRT": "0.00",
                    "cALAMITYAMT": "0.0",
                    "aDVAMT": "0.00",
                    "aDVREMARK": "",
                    "dPHRT": "0.00",
                    "dPHAMT": "0.00",
                    "dISCRT": "0.00",
                    "dISCAMT": "0.00"
               }
               const loadingCharge = relevantCharges.find(charge => charge.hasOwnProperty("Loading"));
               const UnloadingCharge = relevantCharges.find(charge => charge.hasOwnProperty("Unloading"));

               if (loadingCharge) {
                    cnotebillData.lOADCHAR = loadingCharge.Loading !== undefined ? Number(loadingCharge.Loading).toFixed(2) : "0.00";
                    cnotebillData.uNLOADCHAR = UnloadingCharge.Unloading !== undefined ? Number(UnloadingCharge.Unloading).toFixed(2) : "0.00";

               }
               cnotebillList.push(cnotebillData);
          })
          return cnotebillList
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

// This function exports data to an Excel file using the XLSX library.
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

import { firstValueFrom } from "rxjs";

import { Injectable } from "@angular/core";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
import { formatDocketDate } from "../../commonFunction/arrayCommonFunction/uniqArray";
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
               collectionName: "Cust_bills_details",
               filter: {}
          }
          const res = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
          reqBody.collectionName = "dockets"
          const resDocketTemp = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
          reqBody.collectionName = "docket_invoices"
          const resdocinv = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));

          let cnotebillList = [];
          res.data.map((element) => {
               console.log("element", element);

               /*dockets collection*/
               // const docDet = resDocketTemp.data ? resDocketTemp.data.find((entry) => entry.docNo === element?.dKTNO) : null;
               const docDet = resDocketTemp.data.find((entry) => entry.docNo = 'CNDELBDTD2324000005');
               // console.log("docDet", docDet);
               // let pAYBAS = 0;
               // if (docDet) {
               //      pAYBAS = docDet.map(num => num.pAYTYP);
               // }

               /*invoiceDetail collection*/
               // const invDet = resdocinv.data ? resdocinv.data.find((entry) => entry.dKTNO === element?.dKTNO) : null;
               const invDet = resdocinv.data.find((entry) => entry.docNo = 'CNDELBDTD2324000005');
               //let inv = 0;
               // if (invDet) {
               //      inv = invDet.map(num => num.iNVNO);
               // }

               let cnotebillData = {
                    "oeNTDT": element?.eNTDT,
                    "bOOKINGTPE": docDet.dELTYN,
                    "dEST": element?.dEST,
                    "oRGN": element?.oRGN,
                    "mANUALBILLNO": "",
                    "bILLGENAT": "",
                    "bILLDT": "",
                    "bILSUBAT": "",
                    "bILLSUBDT": "",
                    "bILLcOLLECTAT": "",
                    "bILLCOLLECTDT": "",
                    "bILLAMT": "",
                    "bILLPENAMT": "",
                    "bILLPAR": "",
                    "bILLST": "",
                    "bILLNO": element?.bILLNO || "",
                    "mRNO": "",
                    "mANUALMRNO": "",
                    "mRDT": "",
                    "mRCLOSEDT": "",
                    "mRENTRYDT": "",
                    "mRGENAT": "",
                    "mRAMT": "",
                    "mRNETAMT": "",
                    "mRSTAT": "",
                    "dEMCHAR": "",
                    "cNOTENO": element?.dKTNO || "",
                    "cNOTEDT": formatDocketDate(element?.dKTDT || ""),
                    "tIME":"",
                    "eDD":"",
                    "bOOKBRANCH":"",
                    "dELIBRANCH":"",
                    "pAYTYPE": docDet.pAYTYPNM,
                    "bUSTYPE": "",
                    "pROD": "",
                    "cONID": "",
                    "cONTPARTY": "",
                    "sERTYPE": "",
                    "vEHNO": "",
                    "bILLPARTYNM": docDet.bPARTYNM,
                    "bACODE": "",
                    "eEDD": "",
                    "lASTEDITBY": "",
                    "cNOTEEDITDT": "",
                    "cUSTREFNO": "",
                    "mOVTYPE": docDet.mODNM,
                    "tRANMODE": docDet.tRNMODNM,
                    "sTAT": "",
                    "lOADTPE": "",
                    "rEM": "",
                    "bILLAT": "",
                    "pINCODE": "",
                    "lOCALCNOTE": "",
                    "fROMZN": "",
                    "tOZN": "",
                    "oDA": "",
                    "fROMCITY": docDet?.fCT,
                    "tOCITY": docDet?.tCT,
                    "dRIVNM": "",
                    "pKGS": "",
                    "aCTWT": docDet?.aCTWT,
                    "cHARWT": docDet?.cHRWT,
                    "sPEINSTRUCT": "",
                    "pKGTPE": "",
                    "cUBICWT": "",
                    "cHRPKG": "",
                    "cHARGKM": "",
                    "iNVNO": invDet.iNVNO,
                    "iNVDT": "",
                    "dELVALUE": "",
                    "lEN": invDet.vOL.l,
                    "bRTH": invDet.vOL.b,
                    "hGT": invDet.vOL.h,
                    "cONTENT": "",
                    "bATCHNO": "",
                    "pARTNO": "",
                    "pARTDESC": "",
                    "pARTQUAN": "",
                    "fUELRTTPE": "",
                    "fOVRTTPE": "",
                    "cFTRATIO": "",
                    "tTCFT": "",
                    "sEROPTEDFOR": "",
                    "fSCCHARRT": "",
                    "fOV": "",
                    "mULDELIV": "",
                    "mULPICKUP": "",
                    "rISKTPE": "",
                    "cOD/DOD": "",
                    "dACC": "",
                    "dEF": "",
                    "pOLNO": "",
                    "pOLDT": "",
                    "wTTPE": "",
                    "dEFAULTCARDRT": "",
                    "fUELPERRT": "",
                    "CONID": "",
                    "sUBTOT": "",
                    "dOCTOT": "",
                    "gSTAMT": "",
                    "fRTRT": "",
                    "fRTTPE": "",
                    "fRIGHTCHAR": "",
                    "oTHERCHAR": "",
                    "gREENTAX": "",
                    "dROPCHAR": "",
                    "dOCCHAR": "",
                    "wARECHAR": "",
                    "dEDUC": "",
                    "hOLISERVCHAR": "",
                    "fOVCHAR": "",
                    "cOD/DODCHAR": "",
                    "aPPCHAR": "",
                    "oDACHAR": "",
                    "fUELCHAR": "",
                    "mULPICKUPCHAR": "",
                    "uNLOADCHAR": "",
                    "mULTIDELCHAR": "",
                    "lOADCHAR": "",
                    "gSTRT": "",
                    "gSTCHAR": "",
                    "vATRT": "",
                    "vATAMT": "",
                    "cALAMITYRT": "",
                    "cALAMITYAMT": "",
                    "aDVAMT": "",
                    "aDVREMARK": "",
                    "dPHRT": "",
                    "dPHAMT": "",
                    "dISCRT": "",
                    "dISCAMT": ""
               }
               cnotebillList.push(cnotebillData)
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

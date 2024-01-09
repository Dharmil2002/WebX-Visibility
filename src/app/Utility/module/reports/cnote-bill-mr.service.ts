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

          let cnotebillList = [];
          res.data.map((element) => {

               const custBillHeaderDet = rescustBillHeaders.data ? rescustBillHeaders.data.find((entry) => entry.bILLNO === element?.bILLNO) : null;
               const custbillcollDet = rescustbillcoll.data ? rescustbillcoll.data.find((entry) => entry.bILLNO === element?.bILLNO) : null;
               const docDet = resDocketTemp.data ? resDocketTemp.data.find((entry) => entry.docNo === element?.dKTNO) : null;
               const docinvDet = resdocinv.data ? resdocinv.data.find((entry) => entry.dKTNO === docDet?.docNo) : null;
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
               if (custBillHeaderDet) {
                    billGenDt = custBillHeaderDet.bGNDT;
                    subLoc = custBillHeaderDet.sUB.lOC;
                    subDt = custBillHeaderDet.sUB.dTM;
                    billParty = custBillHeaderDet.cUST.nM
                    billStatus = custBillHeaderDet.bSTSNM
                    businessType = custBillHeaderDet.bUSVRT
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
                    FRTRtType = docDet.fRTRTY
                    otherChar = docDet.oTHAMT
                    freigthAmt = docDet.fRTAMT
               }
               if (docinvDet) {
                    invNo = docinvDet.iNVNO
                    invDt = docinvDet.eNTDT
                    len = docinvDet.vOL.l
                    breadth = docinvDet.vOL.b
                    height = docinvDet.vOL.h
               }

               let cnotebillData = {
                    "oeNTDT": element?.eNTDT,
                    "bOOKINGTPE": deliveryType,
                    "dEST": element?.dEST,
                    "oRGN": element?.oRGN,
                    "mANUALBILLNO": element?.bILLNO || '',
                    "bILLGENAT": element?.eNTLOC || '',
                    "bILLDT": formatDocketDate(billGenDt || ''),
                    "bILSUBAT": subLoc,
                    "bILLSUBDT": formatDocketDate(subDt || ''),
                    "bILLcOLLECTAT": billColAt,
                    "bILLCOLLECTDT": formatDocketDate(billcollDt || ''),
                    "bILLAMT": billAmt,
                    "bILLPAR": billParty,
                    "bILLST": billStatus,
                    "bILLNO": element?.bILLNO || '',
                    "mRNO": mrNo,
                    "mANUALMRNO": mrNo,
                    "mRDT": formatDocketDate(billcollDt || ''),
                    "mRCLOSEDT": "",
                    "mRENTRYDT": "",
                    "mRGENAT": "",
                    "mRAMT": "",
                    "mRNETAMT": "",
                    "mRSTAT": "",
                    "dEMCHAR": "",
                    "cNOTENO": element?.dKTNO || "",
                    // "cNOTEDT": formatDocketDate(element?.dKTDT || ""),
                    "cNOTEDT": DocketDt ? new Date(DocketDt).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '-') : "",
                    "tIME": DocketDt ? new Date(DocketDt).toLocaleTimeString('en-US', { hour12: false }) : "", // Extract time from dKTDT
                    "eDD": "",
                    "bOOKBRANCH": element?.oRGN || "",
                    "dELIBRANCH": element?.dEST || "",
                    "pAYTYPE": pAYBAS,
                    "bUSTYPE": businessType,
                    "pROD": "Road",
                    "cONID": "",
                    "cONTPARTY": "",
                    "sERTYPE": "FTL",
                    "vEHNO": vehNo,
                    "bILLPARTYNM": billPartyNM,
                    "bACODE": "",
                    "eEDD": "",
                    "lASTEDITBY": element?.eNTBY || '',
                    "cNOTEEDITDT": formatDocketDate(docketeditDt || ''),
                    "cUSTREFNO": "",
                    "mOVTYPE": moveType,
                    "tRANMODE": TransMode,
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
                    "fROMCITY": fromCity,
                    "tOCITY": toCity,
                    // "dRIVNM": "",
                    "pKGS": packs,
                    "aCTWT": actualWeight,
                    "cHARWT": chargedWeight,
                    "sPEINSTRUCT": "",
                    "pKGTPE": "Carton Box",
                    "cUBICWT": cubicWeight,
                    "cHRPKG": "",
                    "cHARGKM": "",
                    "iNVNO": invNo,
                    "iNVDT": formatDocketDate(invDt || ''),
                    "dELVALUE": "",
                    "lEN": len,
                    "bRTH": breadth,
                    "hGT": height,
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
                    "rISKTPE": riskType,
                    "cOD/DOD": "",
                    "dACC": "",
                    "dEF": "",
                    "pOLNO": "",
                    "pOLDT": "",
                    "wTTPE": "",
                    "dEFAULTCARDRT": "",
                    "fUELPERRT": "",
                    "CONID": "",
                    "sUBTOT": element?.sUBTOT || '',
                    "dOCTOT": element?.dKTTOT || '',
                    "gSTAMT": gstAmt,
                    "fRTRT": FRTRt,
                    "fRTTPE": FRTRtType,
                    "fRIGHTCHAR": freigthAmt,
                    "oTHERCHAR": otherChar,
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
                    "gSTRT": element?.gSTRT || '',
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

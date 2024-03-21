import { Injectable } from "@angular/core";
import moment from "moment";
import { firstValueFrom } from "rxjs";
import { DocketEvents, DocketStatus, getEnumName } from "src/app/Models/docStatus";
import { ConvertToNumber } from "src/app/Utility/commonFunction/common";
import { financialYear } from "src/app/Utility/date/date-utils";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { StorageService } from "src/app/core/service/storage.service";

@Injectable({
  providedIn: "root",
})
export class LoadingSheetService {
  constructor(
    private operationService: OperationService,
    private storage: StorageService
  ) { }

  async getDocketsForLoadingSheet(nextLocs: string[]) {
    const req = {
      companyCode: this.storage.companyCode,
      collectionName: "docket_ops_det_ltl",
      filter: {
        'D$and': [
          { cLOC: this.storage.branch },
          { dEST: { 'D$in': nextLocs } },
          { dEST: { 'D$ne': this.storage.branch } },
          { sTS: { 'D$in': [DocketStatus.Booked, DocketStatus.In_Transhipment_Stock] } },
          { 'D$or': [{ lSNO: { "D$exists": false } }, { lSNO: "" }] },
        ]
      }
    };
    return await firstValueFrom(this.operationService.operationMongoPost("generic/get", req));
  }
  async tripFieldMapping(data, tabledata) {
    const route = data?.Route.split(":")[1].split("-");
    
    let tripSummary = {
      "_id": "",
      "cID": this.storage.companyCode,
      "docNo": "",
      "tHCDT": new Date(),
      "lOC": this.storage.branch,
      "oRGN": this.storage.branch,
      "dEST": route[route.length - 1],      
      // "fCT": "",
      // "tCT": "",
      "rUTCD": data?.Route.split(":")[0] || "",
      "rUTNM": data?.Route.split(":")[1] || "",
      "vEHNO": data?.vehicle.value || "",
      "vTYP": data?.vehicleTypeCode || "",
      "vTYPNM": data?.vehicleType || "",
      "tMODE":data?.transMode||"",
      "tMODENM":data?.transModeName||"",
      // "vND": {
      //   "tY":"",
      //   "tYNM":"",
      //   "cD":"",
      //   "nM":"",
      //   "pAN":""
      // },
      "oPSST": 0,
      "oPSSTNM": "",
      "fINST": 0,
      "fINSTNM": "",
      "cONTAMT": 0,
      "aDVPENAMT": 0,
      "aDVAMT": 0,
      "cHG": {
        "cTAMT": 0,
        "oAMT": 0,
        "lOADING": 0,
        "uNLOADING": 0,
        "eNROUTE": 0,
        "mISC": 0,
        "tOTAMT": 0,
      },
      "aDV": {
        "aAMT": 0,
        "pCASH": 0,
        "pBANK": 0,
        "pFUEL": 0,
        "pCARD": 0,
        "tOTAMT": 0
      },
      "bALAMT": 0,
      "aDPAYAT": "",
      "bLPAYAT": "",
      "iSBILLED": false,
      "bILLNO": "",
      // "dRV": {
      //   "nM": "",
      //   "mNO":"",
      //   "lNO": "",
      //   "lEDT":""
      // },
      "cAP": {
        "wT": ConvertToNumber(data?.Capacity || 0, 2),
        "vOL": ConvertToNumber(data?.CapacityVolumeCFT || 0, 2),
        "vWT": 0
      },
      "uTI": {
        "wT": ConvertToNumber(data?.WeightUtilization || 0, 2),
        "vOL": ConvertToNumber(data?.VolumeUtilization || 0, 2),
        "vWT": 0
      },
      "lOADED": {
        "wT": ConvertToNumber(data?.LoadaddedKg || 0, 2),
        "vOL": ConvertToNumber(data?.VolumeaddedCFT || 0, 2),
        "vWT": 0
      },
      "dPT": {
        "sCHDT": null,
        "eXPDT": null,
        "aCTDT": null,
        "oDOMT": 0
      },
      "aRR": {
        "sCHDT": null,
        "eXPDT": null,
        "aCTDT": null,
        "sEALNO": "",
        "kM": 0,
        "aCRBY": "",
        "aRBY": ""
      },
      "sCHDIST": 0,
      "aCTDIST": 0,
      "gPSDIST": 0,
      "cNL": false,
      "eNTDT": new Date(),
      "eNTLOC": this.storage.branch,
      "eNTBY": this.storage.userName
    }

    let tripMovement = [];
   
    let lsHeader = []
    let lsDetail = []
    let dktList = [];
    let evnData = [];
    if (tabledata.length > 0) {
      tabledata.forEach(element => {
        const lsHeaderJson =
        {
          "_id": "",
          "cID": this.storage.companyCode,
          "docNo": "",
          "lSNO": "",
          "lSDT": new Date(),
          "rUTCD": data?.Route.split(":")[0] || "",
          "rUTNM": data?.Route.split(":")[1] || "",
          "lEG": element?.leg || "",
          "lOC": this.storage.branch,
          "mFNO": "",
          "vEHNO": data?.vehicle.value || "",
          "tOTDKT": element?.count || "",
          "fLOC": element?.leg.split("-")[0] || "",
          "tLOC": element?.leg.split("-")[1] || "",
          "nXTLOC": "",
          "pKGS": parseInt(element?.packages) || 0,
          "wT": ConvertToNumber(element?.weightKg || 0, 2),
          "vCFT": ConvertToNumber(element?.volumeCFT || 0, 2),
          "wUTL": ConvertToNumber(data?.WeightUtilization || 0, 2),
          "vUTL": 0,
          "eNTBY": this.storage.userName,
          "eNTLOC": this.storage.branch,
          "eNTDT": new Date()
        }
        lsHeader.push(lsHeaderJson);
      });
      tabledata.forEach(element => {
        if (element.items.length > 0) {
          let i = 0;
          element.items.filter((x) => x.isSelected == true).forEach(ls => {
            let json = {
              "_id": "",
              "lSNO": "",
              "lDT": new Date(),
              "lEG": element?.leg || "",
              "cID": this.storage.companyCode,
              "dKTNO": ls?.dKTNO || "",
              "sFX": ls?.sFX || 0,
              "lOC":element?.curLoc || "",
              "bLOC": ls?.oRGN || "",
              "dLOC": ls?.dEST || "",
              "pKGS": ls?.pKGS || 0,
              "wT": ls?.aCTWT || 0,
              "vCFT": element?.volumeCFT || "",
              "eNTBY": this.storage.userName,
              "eNTDT": new Date(),
              "eNTLOC": this.storage.branch,
            }
            let evnJson = {
              _id: ``,
              cID: this.storage.companyCode,
              dKTNO: ls?.dKTNO || "",
              sFX: 0,
              cNO: null,
              lOC: this.storage.branch,
              eVNID: DocketEvents.Loading_Sheet_Generation,
              eVNDES: getEnumName(DocketEvents, DocketEvents.Loading_Sheet_Generation)?.replace(/_/g, " "),
              eVNDT: new Date(),
              eVNSRC: 'Loading Sheet',
              dOCTY: 'LS',
              dOCNO: '',
              sTS: DocketStatus.Awaiting_Loading,
              sTSNM: DocketStatus[DocketStatus.Awaiting_Loading].replace(/_/g, " "),
              oPSSTS: ``,
              eNTDT: new Date(),
              eNTLOC: this.storage.branch,
              eNTBY: this.storage.userName,
            };
            evnData.push(evnJson);
            lsDetail.push(json);
            dktList.push(ls?.dKTNO);
          });
        }
      })
    }
    return {
      tripSummary: tripSummary,
      tripMovement: tripMovement,
      lsHeader: lsHeader,
      lsDetail: lsDetail,
      dktList: dktList,
      evnData: evnData
    }
  }


  async updatetripFieldMapping(data, tabledata) {
    let tripSummary = {
      "cLOC": this.storage.branch,
      "cAP": {
        "wT": ConvertToNumber(data?.Capacity || 0, 2),
        "vOL": ConvertToNumber(data?.CapacityVolumeCFT || 0, 2),
        "vWT": 0
      },
      "uTI": {
        "wT": ConvertToNumber(data?.WeightUtilization || 0, 2),
        "vOL": ConvertToNumber(data?.VolumeUtilization || 0, 2),
        "vWT": 0
      },
      "lOADED": {
        "wT": ConvertToNumber(data?.LoadaddedKg || 0, 2),
        "vOL": ConvertToNumber(data?.VolumeaddedCFT || 0, 2),
        "vWT": 0
      },
      "mODDT": new Date(),
      "mODLOC": this.storage.branch,
      "mODBY": this.storage.userName
    }
    let tripMovement = []
    if (tabledata.length > 0) {
      tabledata.forEach((element, index) => {
        let tripMovementJson = {
          "_id": `${this.storage.companyCode}-${index}-${data?.TripID}`,
          "tHC": data?.TripID || "",
          "cID": this.storage.companyCode,
          "fLOC": element?.orgLoc || "",
          "tLOC": element?.destLoc || "",
          "lOAD": {
            "dKTS": element?.count || 0,
            "pKGS": element?.packages || 0,
            "wT": element?.weightKg || 0,
            "vOL": element?.volumeCFT || 0,
            "vWT": 0,
            "sEALNO": "",
            "rMK": ""
          },
          "cAP": {
            "wT": data?.Capacity || 0,
            "vOL": data?.VolumeaddedCFT || 0,
            "vWT": 0
          },
          "uTI": {
            "wT": data?.WeightUtilization,
            "vOL": data?.VolumeUtilization,
            "vWT": 0
          },
          "dPT": {
            "sCHDT": null,
            "eXPDT": null,
            "aCTDT": null,
            "gPSDT": null,
            "oDOMT": 0
          },
          "aRR": {
            "sCHDT": null,
            "eXPDT": null,
            "aCTDT": null,
            "gPSDT": null,
            "oDOMT": 0
          },
          "uNLOAD": {
            "dKTS": 0,
            "pKGS": 0,
            "wT": 0,
            "vOL": 0,
            "vWT": 0,
            "sEALNO": "",
            "rMK": "",
            "sEALRES": ""
          },
          "sCHDIST": 0,
          "aCTDIST": 0,
          "gPSDIST": 0,
          "eNTDT": new Date(),
          "eNTLOC": this.storage.branch,
          "eNTBY": this.storage.userName
        }
        tripMovement.push(tripMovementJson);
      });
    }
    let lsHeader = []
    let lsDetail = []
    let dktList = [];
    let evnData = [];
    if (tabledata.length > 0) {
      tabledata.forEach(element => {
        const lsHeaderJson =
        {
          "_id": "",
          "cID": this.storage.companyCode,
          "docNo": "",
          "lSNO": "",
          "lSDT": new Date(),
          "rUTCD": data?.Route.split(":")[0] || "",
          "rUTNM": data?.Route.split(":")[1] || "",
          "lEG": element?.leg || "",
          "lOC": this.storage.branch,
          "mFNO": "",
          "vEHNO": data?.vehicle.value || "",
          "tOTDKT": element?.count || "",
          "fLOC": element?.orgLoc || "",
          "tLOC": element?.destLoc || "",
          "nXTLOC": "",
          "pKGS": parseInt(element?.packages) || 0,
          "wT": ConvertToNumber(element?.weightKg || 0, 2),
          "vCFT": ConvertToNumber(element?.volumeCFT || 0, 2),
          "wUTL": ConvertToNumber(data?.WeightUtilization || 0, 2),
          "vUTL": 0,
          "eNTBY": this.storage.userName,
          "eNTLOC": this.storage.branch,
          "eNTDT": new Date()
        }
        lsHeader.push(lsHeaderJson);
      });
      tabledata.forEach(element => {
        if (element.items.length > 0) {
          element.items.filter((x) => x.isSelected == true).forEach(ls => {
            let json = {
              "_id": "",
              "lSNO": "",
              "lDT": new Date(),
              "lEG": element?.leg || "",
              "cID": this.storage.companyCode,
              "dKTNO": ls?.dKTNO || "",
              "sFX": ls?.sFX || 0,
              "bLOC": ls?.oRGN || "",
              "dLOC": ls?.dEST || "",
              "pKGS": ls?.pKGS || 0,
              "wT": ls?.aCTWT || 0,
              "vCFT": element?.volumeCFT || "",
              "eNTBY": this.storage.userName,
              "eNTDT": new Date(),
              "eNTLOC": this.storage.branch,
            }
            let evnJson = {
              _id: ``,
              cID: this.storage.companyCode,
              dKTNO: ls?.dKTNO || "",
              sFX: 0,
              cNO: null,
              lOC: this.storage.branch,
              eVNID: DocketEvents.Loading_Sheet_Generation,
              eVNDES:getEnumName(DocketEvents, DocketEvents.Loading_Sheet_Generation)?.replace(/_/g, " "),
              eVNDT: new Date(),
              eVNSRC: 'Loading Sheet',
              dOCTY: '',
              dOCNO: '',
              sTS: DocketStatus.Awaiting_Loading,
              sTSNM: DocketStatus[DocketStatus.Awaiting_Loading].replace(/_/g, " "),
              oPSSTS: ``,
              eNTDT: new Date(),
              eNTLOC: this.storage.branch,
              eNTBY: this.storage.userName,
            };
            evnData.push(evnJson);
            lsDetail.push(json);
            dktList.push(ls?.dKTNO);
          });

        }
      })
    }

    return {
      tripSummary: tripSummary,
      tripMovement: tripMovement,
      lsHeader: lsHeader,
      lsDetail: lsDetail,
      dktList: dktList,
      evnData: evnData,
      thcNo: data?.tripID
    }
  }
  async departVehicle(data) {
    let tripSummary = {
      "_id": "",
      "cID": this.storage.companyCode,
      "docNo": "",
      "tHCDT": new Date(),
      "cLOC": this.storage.branch,
      "dEST": data?.Route.split(":")[1].split("-")[1],
      "rUTCD": data?.Route.split(":")[0] || "",
      "rUTNM": data?.Route.split(":")[1] || "",
      "vEHNO": data?.vehicle.value || "",
      "vTYP": data?.vehicleTypeCode || "",
      "vTYPNM": data?.vehicleType || "",
      "vND": {
        "tY": "",
        "tYNM": "",
        "cD": "",
        "nM": "",
        "pAN": ""
      },
      "oPSST": 0,
      "oPSSTNM": "",
      "fINST": 0,
      "fINSTNM": "",
      "cONTAMT": 0,
      "aDVPENAMT": 0,
      "aDVAMT": 0,
      "cHG": {
        "cTAMT": 0,
        "oAMT": 0,
        "lOADING": 0,
        "uNLOADING": 0,
        "eNROUTE": 0,
        "mISC": 0,
        "tOTAMT": 0,
      },
      "aDV": {
        "aAMT": 0,
        "pCASH": 0,
        "pBANK": 0,
        "pFUEL": 0,
        "pCARD": 0,
        "tOTAMT": 0
      },
      "bALAMT": 0,
      "aDPAYAT": "",
      "bLPAYAT": "",
      "tMODE": "",
      "tMODENM": "",
      "iSBILLED": false,
      "bILLNO": "",
      "dRV": {
        "nM": "",
        "mNO": "",
        "lNO": "",
        "lEDT": null
      },
      "cAP": {
        "wT": ConvertToNumber(data?.Capacity || 0, 2),
        "vOL": ConvertToNumber(data?.CapacityVolumeCFT || 0, 2),
        "vWT": 0
      },
      "uTI": {
        "wT": ConvertToNumber(data?.WeightUtilization || 0, 2),
        "vOL": ConvertToNumber(data?.VolumeUtilization || 0, 2),
        "vWT": 0
      },
      "lOADED": {
        "wT": ConvertToNumber(data?.LoadaddedKg || 0, 2),
        "vOL": ConvertToNumber(data?.VolumeaddedCFT || 0, 2),
        "vWT": 0
      },
      "dPT": {
        "sCHDT": null,
        "eXPDT": null,
        "aCTDT": null,
        "oDOMT": 0
      },
      "aRR": {
        "sCHDT": null,
        "eXPDT": null,
        "aCTDT": null,
        "sEALNO": "",
        "kM": "",
        "aCRBY": "",
        "aRBY": ""
      },
      "sCHDIST": 0,
      "aCTDIST": 0,
      "gPSDIST": 0,
      "cNL": false,
      "eNTDT": new Date(),
      "eNTLOC": this.storage.branch,
      "eNTBY": this.storage.userName
    }
    let tripMovement =
    {
      "_id": "",
      "tHC": "",
      "cID": this.storage.companyCode,
      "fLOC": this.storage.branch,
      "tLOC": data?.Route.split(":")[1].split("-")[1],
      "lOAD": {
        "dKTS": 0,
        "pKGS": 0,
        "wT": 0,
        "vOL": 0,
        "vWT": 0,
        "sEALNO": "",
        "rMK": ""
      },
      "cAP": {
        "wT": data?.Capacity || 0,
        "vOL": data?.VolumeaddedCFT || 0,
        "vWT": 0
      },
      "uTI": {
        "wT": data?.WeightUtilization,
        "vOL": data?.VolumeUtilization,
        "vWT": 0
      },
      "dPT": {
        "sCHDT": null,
        "eXPDT": null,
        "aCTDT": null,
        "gPSDT": null,
        "oDOMT": 0
      },
      "aRR": {
        "sCHDT": null,
        "eXPDT": null,
        "aCTDT": null,
        "gPSDT": null,
        "oDOMT": 0
      },
      "uNLOAD": {
        "dKTS": 0,
        "pKGS": 0,
        "wT": 0,
        "vOL": 0,
        "vWT": 0,
        "sEALNO": "",
        "rMK": "",
        "sEALRES": ""
      },
      "sCHDIST": 0,
      "aCTDIST": 0,
      "gPSDIST": 0,
      "eNTDT": new Date(),
      "eNTLOC": this.storage.branch,
      "eNTBY": this.storage.userName
    }
    return { thcSummary: tripSummary, thcMovement: tripMovement }
  }
  async departUpdate(data) {
    let tripSummary = {
      "cLOC": this.storage.branch,
      "dEST": data?.Route.split(":")[1].split("-")[1],
      "rUTCD": data?.Route.split(":")[0] || "",
      "rUTNM": data?.Route.split(":")[1] || "",
      "vEHNO": data?.vehicle.value || "",
      "vTYP": data?.vehicleTypeCode || "",
      "vTYPNM": data?.vehicleType || "",
      "cAP": {
        "wT": ConvertToNumber(data?.Capacity || 0, 2),
        "vOL": ConvertToNumber(data?.CapacityVolumeCFT || 0, 2),
        "vWT": 0
      },
      "uTI": {
        "wT": ConvertToNumber(data?.WeightUtilization || 0, 2),
        "vOL": ConvertToNumber(data?.VolumeUtilization || 0, 2),
        "vWT": 0
      },
      "lOADED": {
        "wT": ConvertToNumber(data?.LoadaddedKg || 0, 2),
        "vOL": ConvertToNumber(data?.VolumeaddedCFT || 0, 2),
        "vWT": 0
      },
      "mODDT": new Date(),
      "mODLOC": this.storage.branch,
      "mODBY": this.storage.userName
    }
    const reqThc = {
      companyCode: this.storage.companyCode,
      collectionName: "thc_summary_ltl",
      filter: { tHC: data.tripID, rUTCD: data.Route.split(":")[0] },
      update: tripSummary
    }
    await firstValueFrom(this.operationService.operationMongoPut("generic/update", reqThc));
    const reqDepart = {
      companyCode: this.storage.companyCode,
      collectionName: "trip_Route_Schedule",
      filter: { tHC: data.tripID, rUTCD: data.Route.split(":")[0] },
      update: {
        sTS: 3,
        sTSNM: "Menifest Generated"
      }
    }
    await firstValueFrom(this.operationService.operationMongoPut("generic/update", reqDepart));
    return true;
  }
  async createLoadingSheet(data) {
    const req = {
      companyCode: this.storage.companyCode,
      docType: "LS",
      branch: this.storage.branch,
      finYear: financialYear,
      timeZone: this.storage.timeZone,
      data: data
    }
    const res = await firstValueFrom(this.operationService.operationMongoPost("operation/ls/ltl/create", req));
    return res;
  }
  async updateLoadingSheet(data) {
    const req = {
      companyCode: this.storage.companyCode,
      docType: "LS",
      branch: this.storage.branch,
      finYear: financialYear,
      data: data
    }
    const res = await firstValueFrom(this.operationService.operationMongoPost("operation/ls/ltl/update", req));
    return res;
  }
  async depart(data) {
    const req = {
      companyCode: this.storage.companyCode,
      docType: "TH",
      branch: this.storage.branch,
      finYear: financialYear,
      data: data
    }
    const res = await firstValueFrom(this.operationService.operationMongoPost("operation/ls/ltl/depart", req));
    return res;
  }


}
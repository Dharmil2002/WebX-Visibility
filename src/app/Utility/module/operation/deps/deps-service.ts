import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { StorageService } from "src/app/core/service/storage.service";
import { ConvertToNumber } from "src/app/Utility/commonFunction/common";
import { financialYear } from "src/app/Utility/date/date-utils";
import { depsStatus } from "src/app/Models/docStatus";
import convert from 'convert-units';
import moment from "moment";
import { OperationActions } from "src/app/config/myconstants";

@Injectable({
    providedIn: "root",
})
export class DepsService {

    menfiestData: any;
    constructor(
        private storage: StorageService,
        private operationService: OperationService
    ) { }

    fieldMappingDeps(docketsList, otherDetails) {
        const docketsDetails = Array.isArray(docketsList) ? docketsList : [docketsList];
        let depsHeader = []
        let depsDetails = []
        if (docketsDetails && docketsDetails.length > 0) {
            docketsDetails.forEach((dk) => {
                const depsHeaderJson =
                {
                    "cID": this.storage.companyCode,
                    "dEPSNO": "",
                    "dEPSDT": new Date(),
                    "rASNTO": this.storage.userName,
                    "rASNDT": new Date(),
                    "rASLOC": this.storage.branch,
                    "dKTNO": dk.dKTNO,
                    "mFNO": dk.mFNO,
                    "tHC": dk.tHCNO,
                    "tHCDT": dk.tHCDT,
                    "sTS": depsStatus.Generated,
                    "sTSNM": depsStatus[depsStatus.Generated],
                    "sFX": dk.sFX,
                    "lOC": this.storage.branch,
                    "aRR": {
                        "pKGS": dk.pKGS,
                        "wT": dk.wT
                    },
                    "dMG": {
                        "pKGS": otherDetails.depsType == "D" ? ConvertToNumber(otherDetails?.depsPkgs || 0) : 0,
                        "wT": otherDetails.depsType == "D" ? ConvertToNumber(otherDetails?.depsWt || 0) : 0,
                        "rES": otherDetails.depsType == "D" ? otherDetails?.depsRes || "" : "",
                        "rMK": otherDetails.depsType == "D" ? otherDetails?.rMK || "" : 0
                    },
                    "pF": {
                        "pKGS": otherDetails.depsType == "P" ? ConvertToNumber(otherDetails?.depsPkgs || 0) : 0,
                        "wT": otherDetails.depsType == "P" ? ConvertToNumber(otherDetails?.depsWt || 0) : 0,
                        "rES": otherDetails.depsType == "P" ? otherDetails?.depsRes || "" : "",
                        "rMK": otherDetails.depsType == "P" ? otherDetails?.rMK || "" : ""
                    },
                    "sHORT": {
                        "pKGS": otherDetails.depsType == "S" ? ConvertToNumber(otherDetails?.depsPkgs || 0) : 0,
                        "wT": otherDetails.depsType == "S" ? ConvertToNumber(otherDetails?.depsWt || 0) : 0,
                        "rES": otherDetails.depsType == "S" ? otherDetails?.depsRes : "",
                        "rMK": otherDetails.depsType == "S" ? otherDetails?.rMK : ""
                    },
                    "dEPSUPT": {
                        "iSUPT": false,
                        "bY": "",
                        "dT": null
                    },
                    "cAN": {
                        "iSCAN": false,
                        "bY": "",
                        "dT": null
                    },
                    "dEPTYP": otherDetails?.depsType || "",
                    "dEPTYPNM": otherDetails?.depsTypeName || "",
                    "cLOSE": {
                        "iSCLOSE": false,
                        "bY": "",
                        "dT": null
                    },
                    "rUTTYP": "",
                    "dEPIMG": "",
                    "eXEC": {
                        "pKGS": otherDetails.depsType == "E" ? ConvertToNumber(otherDetails?.depsPkgs || 0) : 0,
                        "wT": otherDetails.depsType == "E" ? ConvertToNumber(otherDetails?.depsWt || 0) : 0,
                        "rES": otherDetails.depsType == "E" ? otherDetails?.depsRes || "" : 0,
                        "rMK": otherDetails.depsType == "E" ? otherDetails?.rMK || "" : ""
                    },
                    "lOSSVAL": 0,
                    "eNTBY": this.storage.userName,
                    "eNTDT": new Date(),
                    "eNTLOC": this.storage.branch

                }
                depsHeader.push(depsHeaderJson)
                const depsDetailsJson =
                {
                    "cID": this.storage.companyCode,
                    "dEPSNO": "",
                    "dKTNO": dk.dKTNO,
                    "sFX": dk.sFX,
                    "dEPSDT": new Date(),
                    "rASNTO": this.storage.userName,
                    "rASNDT": new Date(),
                    "rASLOC": this.storage.branch,
                    "rMK": otherDetails?.rMK || "",
                    "lST": {
                        "rASNTO": this.storage.userName,
                        "rASNDT": new Date()
                    },
                    "sTS": depsStatus.Generated,
                    "sTSNM": depsStatus[depsStatus.Generated],
                    "dOC": "",
                    "eNTBY": this.storage.userName,
                    "eNTDT": new Date(),
                    "eNTLOC": this.storage.branch
                }
                depsDetails.push(depsDetailsJson);
            })
        }
        return { depsHeader, depsDetails }
    }

    fieldArrivalDeps(docketsList) {
        const docketsDetails = Array.isArray(docketsList) ? docketsList : [docketsList];
        let depsHeader = []
        let depsDetails = []
        if (docketsDetails && docketsDetails.length > 0) {
            docketsDetails.forEach((dk) => {
                if (dk.isDeps) {
                    const depsHeaderJson =
                    {
                        "cID": this.storage.companyCode,
                        "dEPSNO": "",
                        "dEPSDT": new Date(),
                        "rASNTO": this.storage.userName,
                        "rASNDT": new Date(),
                        "rASLOC": this.storage.branch,
                        "dKTNO": dk.extraDetails.dKTNO,
                        "mFNO": dk.extraDetails.mFNO,
                        "tHC": dk.extraDetails.tHCNO,
                        "tHCDT": dk.extraDetails.tHCDT,
                        "sFX": dk.extraDetails.sFX,
                        "lOC": this.storage.branch,
                        "aRR": {
                            "pKGS": dk.extraDetails.pKGS,
                            "wT": dk.extraDetails.wT
                        },
                        "dMG": {
                            "pKGS": dk.depsType == "D" ? ConvertToNumber(dk?.depsPkgs || 0) : 0,
                            "wT": dk.depsType == "D" ? ConvertToNumber(dk?.depsWt || 0) : 0,
                            "rES": dk.depsType == "D" ? dk?.depsRes || "" : "",
                            "rMK": dk.depsType == "D" ? dk?.rMK || "" : 0
                        },
                        "pF": {
                            "pKGS": dk.depsType == "P" ? ConvertToNumber(dk?.depsPkgs || 0) : 0,
                            "wT": dk.depsType == "P" ? ConvertToNumber(dk?.depsWt || 0) : 0,
                            "rES": dk.depsType == "P" ? dk?.depsRes || "" : "",
                            "rMK": dk.depsType == "P" ? dk?.rMK || "" : ""
                        },
                        "sHORT": {
                            "pKGS": dk.depsType == "S" ? ConvertToNumber(dk?.depsPkgs || 0) : 0,
                            "wT": dk.depsType == "S" ? ConvertToNumber(dk?.depsWt || 0) : 0,
                            "rES": dk.depsType == "S" ? dk?.depsRes : "",
                            "rMK": dk.depsType == "S" ? dk?.rMK : ""
                        },
                        "dEPSUPT": {
                            "iSUPT": false,
                            "bY": "",
                            "dT": null
                        },
                        "cAN": {
                            "iSCAN": false,
                            "bY": "",
                            "dT": null
                        },
                        "dEPTYP": dk?.depsType || "",
                        "dEPTYPNM": dk?.depsTypeName || "",
                        "cLOSE": {
                            "iSCLOSE": false,
                            "bY": "",
                            "dT": null
                        },
                        "sTS": depsStatus.Generated,
                        "sTSNM": depsStatus[depsStatus.Generated],
                        "rUTTYP": "",
                        "dEPIMG": "",
                        "eXEC": {
                            "pKGS": dk.depsType == "E" ? ConvertToNumber(dk?.depsPkgs || 0) : 0,
                            "wT": dk.depsType == "E" ? ConvertToNumber(dk?.depsWt || 0) : 0,
                            "rES": dk.depsType == "E" ? dk?.depsRes || "" : 0,
                            "rMK": dk.depsType == "E" ? dk?.rMK || "" : ""
                        },
                        "lOSSVAL": 0,
                        "eNTBY": this.storage.userName,
                        "eNTDT": new Date(),
                        "eNTLOC": this.storage.branch

                    }
                    depsHeader.push(depsHeaderJson)
                    const depsDetailsJson =
                    {
                        "cID": this.storage.companyCode,
                        "dEPSNO": "",
                        "dKTNO": dk.dKTNO,
                        "sFX": dk.sFX,
                        "dEPSDT": new Date(),
                        "rASNTO": this.storage.userName,
                        "rASNDT": new Date(),
                        "rASLOC": this.storage.branch,
                        "rMK": dk?.rMK || "",
                        "lST": {
                            "rASNTO": this.storage.userName,
                            "rASNDT": new Date()
                        },
                        "sTS": depsStatus.Generated,
                        "sTSNM": depsStatus[depsStatus.Generated],
                        "dOC": "",
                        "eNTBY": this.storage.userName,
                        "eNTDT": new Date(),
                        "eNTLOC": this.storage.branch
                    }
                    depsDetails.push(depsDetailsJson);
                }
            })
        }
        if(depsHeader.length>0 && depsDetails.length>0){
        return { depsHeader, depsDetails }
        }
        else{
            return null
        }
    }
    async getDepsOne(filter) {
        const req = {
            companyCode: this.storage.companyCode,
            collectionName: "deps_headers",
            filter: filter
        }
        const res = await firstValueFrom(this.operationService.operationMongoPost("generic/getOne", req));
        return Object.keys(res.data).length > 0 ? res.data : null;
    }
    async getDepsAllData(filter){
        const req = {
            companyCode: this.storage.companyCode,
            collectionName: "deps_headers",
            filter: filter
        }
        const res = await firstValueFrom(this.operationService.operationMongoPost("generic/get", req));
        return res.data.length > 0 ? res.data :[];
    }
    async bindData(data) {
        let deps = [];
        if (data && data.length > 0) {
            for (const element of data) {
                let depsJson = {
                    "dEPSNO": element.dEPSNO,
                    "dEPSDT": element.dEPSDT,
                    "dKTNO": element.dKTNO,
                    "pKGS": null,
                    "sTS":element.sTS,
                    "dEPIMG": element.dEPIMG,
                    "Reason": null,
                    "actions":['']
                };
                // Extract and filter data from dMG, pF, sHORT, eXEC
                let dataKeys = ["dMG", "pF", "sHORT", "eXEC"];
                for (const key of dataKeys) {
                    for (const key of dataKeys) {
                        if ((element[key] && element[key].pKGS) || (element[key] && element[key].rMK)) {
                            depsJson.pKGS = element[key].pKGS;
                            depsJson.Reason = element[key].rMK;
                            break; // Break out of the loop once the values are found
                        }
                    }
                    
                }
                    deps.push(depsJson);
            }
        }
        return deps;
    }
    
    async createDeps(data) {
        try {
            const req = {
                companyCode: this.storage.companyCode,
                branch: this.storage.branch,
                userName: this.storage.userName,
                docType: "DE",
                finYear: financialYear,
                timeZone: this.storage.timeZone,
                data: data
            }
            const res = await firstValueFrom(this.operationService.operationPost(OperationActions.createDeps, req));
            return res
        }
        catch (err) {
            return null;
        }
    }
}
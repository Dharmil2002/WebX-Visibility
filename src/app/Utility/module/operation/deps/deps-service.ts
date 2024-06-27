import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { StorageService } from "src/app/core/service/storage.service";
import { ConvertToNumber } from "src/app/Utility/commonFunction/common";
import { financialYear } from "src/app/Utility/date/date-utils";
import { depsStatus } from "src/app/Models/docStatus";
import convert from 'convert-units';
import moment from "moment";
import { Collections, OperationActions } from "src/app/config/myconstants";
import { debug } from "console";

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
        debugger
        const docketsDetails = Array.isArray(docketsList) ? docketsList : [docketsList];
        let depsHeader = []
        let depsDetails = []
        let depsdMG = []
        let depsdMGDet = []
        let depsExtra = []
        let depsExtraDet = []
        let depspF = []
        let depspFDet=[]
        let depsShort = []
        let depsShortDetails = []
        if (docketsDetails && docketsDetails.length > 0) {
            docketsDetails.forEach((dk) => {
                if (dk.isDeps) {
                    const createDepsHeaderJson = (typeSpecificData) => ({
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
                        ...typeSpecificData,
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
                        "cLOSE": {
                            "iSCLOSE": false,
                            "bY": "",
                            "dT": null
                        },
                        "sTS": depsStatus.Generated,
                        "sTSNM": depsStatus[depsStatus.Generated],
                        "rUTTYP": "",
                        "eXEC": {
                            "pKGS": 0,
                            "wT": 0,
                            "rES": 0,
                            "rMK": ""
                        },
                        "lOSSVAL": 0,
                        "eNTBY": this.storage.userName,
                        "eNTDT": new Date(),
                        "eNTLOC": this.storage.branch
                    });
            
                    const createDepsDetailsJson = (remarks) => ({
                        "cID": this.storage.companyCode,
                        "dEPSNO": "",
                        "dKTNO": dk.extraDetails.dKTNO,
                        "sFX": dk.extraDetails.sFX,
                        "dEPSDT": new Date(),
                        "rASNTO": this.storage.userName,
                        "rASNDT": new Date(),
                        "rASLOC": this.storage.branch,
                        "rMK":remarks || "",
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
                    });
            
                    dk.depsType.forEach((type) => {
                        let typeSpecificData;
                        switch (type.value) {
                            case "D":
                                typeSpecificData = {
                                    "dEPTYP": "D",
                                    "dEPTYPNM": "Damage",
                                    "dEPIMG":dk?.extra?.demageUpload||"",
                                    "dMG": {
                                        "pKGS": ConvertToNumber(dk?.extra?.demagePkgs || 0),
                                        "wT": ConvertToNumber(dk?.depsWt || 0),
                                        "rES":dk?.extra?.demageReason?.name || "",
                                        "rMK":dk?.extra?.demageRemarks || ""
                                    },
                                    "pF": {
                                        "pKGS": 0,
                                        "wT": 0,
                                        "rES": "",
                                        "rMK": ""
                                    },
                                    "sHORT": {
                                        "pKGS": 0,
                                        "wT": 0,
                                        "rES": "",
                                        "rMK": ""
                                    }
                                };
                                depsdMG.push(createDepsHeaderJson(typeSpecificData));
                                depsdMGDet.push(createDepsDetailsJson(dk?.extra?.demageRemarks));
                                break;
                            case "S":
                                typeSpecificData = {
                                    "dEPTYP": "S",
                                    "dEPTYPNM": "Shortage",
                                    "dEPIMG":dk?.extra?.shortUpload||"",
                                    "dMG": {
                                        "pKGS": 0,
                                        "wT": 0,
                                        "rES": "",
                                        "rMK": ""
                                    },
                                    "pF": {
                                        "pKGS": 0,
                                        "wT": 0,
                                        "rES": "",
                                        "rMK": ""
                                    },
                                    "sHORT": {
                                        "pKGS": ConvertToNumber(dk?.extra?.shortPkgs|| 0),
                                        "wT": ConvertToNumber(dk?.depsWt || 0),
                                        "rES":dk?.extra?.shortReason.name,
                                        "rMK":dk?.extra?.shortRemarks
                                    }
                                };
                                depsShort.push(createDepsHeaderJson(typeSpecificData));
                                depsShortDetails.push(createDepsDetailsJson(dk?.extra?.shortRemarks));
                                break;
                            case "P":
                                typeSpecificData = {
                                    "dEPTYP": "P",
                                    "dEPTYPNM": "Pilferage",
                                    "dEPIMG":dk?.extra?.pilferageUpload||"",
                                    "dMG": {
                                        "pKGS": 0,
                                        "wT": 0,
                                        "rES": "",
                                        "rMK": ""
                                    },
                                    "pF": {
                                        "pKGS": ConvertToNumber(dk?.extra?.pilferagePkgs || 0),
                                        "wT": ConvertToNumber(dk?.depsWt || 0),
                                        "rES":dk?.extra?.pilferageReason?.name||"",
                                        "rMK":dk?.extra?.pilferageRemarks||""
                                    },
                                    "sHORT": {
                                        "pKGS": 0,
                                        "wT": 0,
                                        "rES": "",
                                        "rMK": ""
                                    }
                                };
                                depspF.push(createDepsHeaderJson(typeSpecificData));
                                depspFDet.push(createDepsDetailsJson(dk?.extra?.pilferageRemarks||""));
                                break;
                        }
                    });
                }
            });
            
        }
         depsHeader=[...depsdMG,...depsExtra,...depspF,...depsShort]
         depsDetails=[...depsdMGDet,...depsExtraDet,...depsShortDetails,...depspFDet]
        if (depsHeader.length > 0 && depsDetails.length > 0) {
            return { depsHeader, depsDetails }
        }
        else {
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
    async getDepsAllData(filter) {
        const req = {
            companyCode: this.storage.companyCode,
            collectionName: "deps_headers",
            filters: [
                {
                    D$match: filter
                }, {
                    D$lookup: {
                        from: "deps_details",
                        localField: "dEPSNO",
                        foreignField: "dEPSNO",
                        as: "deps_details"
                    }
                }, {
                    D$project: {
                        "_id": 1,
                        "cID": 1,
                        "dEPSNO": 1,
                        "dEPSDT": 1,
                        "rASNTO": 1,
                        "rASNDT": 1,
                        "rASLOC": 1,
                        "dKTNO": 1,
                        "mFNO": 1,
                        "tHC": 1,
                        "tHCDT": 1,
                        "sFX": 1,
                        "lOC": 1,
                        "aRR": 1,
                        "dMG": 1,
                        "pF": 1,
                        "sHORT": 1,
                        "dEPSUPT": 1,
                        "cAN": 1,
                        "dEPTYP": 1,
                        "dEPTYPNM": 1,
                        "cLOSE": 1,
                        "rUTTYP": 1,
                        "dEPIMG": 1,
                        "eXEC": 1,
                        "lOSSVAL": 1,
                        "eNTBY": 1,
                        "eNTDT": 1,
                        "eNTLOC": 1,
                        "docNo": 1,
                        "sTS": 1,
                        "sTSNM": 1,
                        "lSDDEPS": { D$last: "$deps_details" }
                    }
                }
            ]
        }
        const res = await firstValueFrom(this.operationService.operationMongoPost("generic/query", req));
        return res.data.length > 0 ? res.data : [];
    }
    async getDepsCount(filter) {
        const req =
        {
            companyCode: this.storage.companyCode,
            collectionName: "deps_details",
            filters: [
                {
                    D$match: filter
                },
                {
                    D$group: {
                        _id: "$dEPSNO",
                        count: { D$sum: 1 }
                    }
                }
            ]
        }
        const res = await firstValueFrom(this.operationService.operationMongoPost("generic/query", req));
        return res.data.length > 0 ? res.data : [];
    }
    async bindData(data) {
        let deps = [];
        let sTS = [1, 2]
        if (data && data.length > 0) {
            for (const element of data) {
                let reason = await this.getValuesIfKeyExists(element, ['sHORT', 'eXEC', 'pF', 'dMG'], 'rES');
                let depsJson = {
                    "dEPSNO": element.dEPSNO,
                    "dEPSDT": element.dEPSDT,
                    "dKTNO": element.dKTNO,
                    "pKGS": null,
                    "sTS": element.sTS,
                    "pod": element?.dEPIMG,
                    "rES": reason,
                    "extra": element,
                    "actions": [sTS.includes(element.sTS) ? 'Update' : ""]
                };
                // Extract and filter data from dMG, pF, sHORT, eXEC
                let dataKeys = ["dMG", "pF", "sHORT", "eXEC"];
                for (const key of dataKeys) {
                    for (const key of dataKeys) {
                        if ((element[key] && element[key].pKGS) || (element[key] && element[key].rMK)) {
                            depsJson.pKGS = element[key].pKGS;
                            break; // Break out of the loop once the values are found
                        }
                    }

                }
                deps.push(depsJson);
            }
        }
        return deps;
    }
    getValuesIfKeyExists(data: any, keysToCheck: string[], keyOfInterest: string): any {
        let result = {};
        let res = ""
        keysToCheck.forEach(key => {
            if (data[key] && data[key][keyOfInterest] !== undefined) {
                result[key] = data[key];
                if (data[key][keyOfInterest]) {
                    res = data[key][keyOfInterest];
                }
            }
        });
        return res;
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
    async depsUpdateOne(depsFilter, data, tableName) {
        debugger
        const req = {
            companyCode: this.storage.companyCode,
            collectionName: tableName,
            filter: depsFilter,
            update: data
        }

        const res = await firstValueFrom(this.operationService.operationMongoPut("generic/update", req));
        return res
    }
    async depsUpdate(data, status) {
        /*first i prepare a request filter that use that filter on two api body first is for getting allDeps Data then update deps headers*/
        const filter = {
            cID: this.storage.companyCode,
            dEPSNO: data.dEPSNO,
            dKTNO: data.dKTNO,
            sFX: data.suffix,
        }
        const depCount = await this.getDepsCount(filter);
        await this.depsUpdateOne(filter, status, 'deps_headers');
        /*End*/
        /*below filter is for the for geting a deps id which is use to update a req add in Deps Details*/
        const depsData = await this.getDepsId(filter)
        /*End */
        const req = {
            companyCode: this.storage.companyCode,
            collectionName: "deps_details",
            data: {
                "_id": `${this.storage.companyCode}-${data.dEPSNO}-${data.dKTNO}-${data.suffix}-${parseInt(depCount[0]?.count || 0) + 1}`,
                "cID": this.storage.companyCode,
                "dEPSNO": data.dEPSNO,
                "dKTNO": data.dKTNO,
                "sFX": data.suffix,
                "dEPSDT": depsData?.dEPSDT || new Date(),
                "rASNTO": this.storage.userName,
                "rASNDT": new Date(),
                "rASLOC": this.storage.branch,
                "rMK": data?.rMK || "",
                "lST": {
                    "rASNTO": depsData?.rASNTO || "",
                    "rASNDT": depsData?.rASNDT || "",
                },
                "sTS": status?.sTS,
                "sTSNM": status?.sTSNM,
                "dOC": data?.dOC || "",
                "eNTBY": this.storage.userName,
                "eNTDT": new Date(),
                "eNTLOC": this.storage.branch
            }
        }
        await firstValueFrom(this.operationService.operationMongoPost("generic/create", req));
        return true

    }
    async getDepsId(query) {
        try {
            const req = { companyCode: this.storage.companyCode, collectionName: "deps_details", filter: query, sorting: { dEPSNO: -1 } };
            const response = await firstValueFrom(this.operationService.operationMongoPost("generic/findLastOne", req));
            return response?.data;
        } catch (error) {
            console.error("Error fetching Deps list:", error);
            throw error;
        }
    }
}
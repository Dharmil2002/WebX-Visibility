import { ElementRef, Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { DocketEvents, DocketStatus, DrsStatus, getEnumName, runSheetAction } from "src/app/Models/docStatus";
import { ConvertToNumber } from "src/app/Utility/commonFunction/common";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { StorageService } from "src/app/core/service/storage.service";
import { financialYear } from "src/app/Utility/date/date-utils";
import moment from "moment";
@Injectable({
    providedIn: "root",
})

export class RunSheetService {
    uniqueShipments: Set<number> = new Set();
    constructor(
        private operations: OperationService,
        private storage: StorageService
    ) { }

    /*below method is for the getting data and displayed in runSheet Dashboard*/
    async getRunSheetData(filter) {

        let matchQuery = filter
        const reqBody = {
            companyCode: this.storage.companyCode,
            collectionName: "docket_ops_det_ltl",
            filters: [
                {
                    D$match: matchQuery,
                },

                {
                    "D$lookup": {
                        from: "dockets_ltl",
                        localField: "dKTNO",
                        foreignField: "dKTNO",
                        as: "dockets"
                    }
                },
                { "D$unwind": "$dockets" },
                {
                    "D$lookup": {
                        from: "cluster_detail",
                        let: { docketsPin: "$dockets.cSGN.pIN" }, // Single value from dockets
                        pipeline: [
                            {
                                "D$match": {
                                    "D$expr": {
                                        "D$in": ["$$docketsPin", "$pincode"] // Check if the single value is in the `pincode` array
                                    }
                                }
                            }
                        ],
                        as: "cluster"
                    }
                },
                {
                    "D$unwind": {
                        path: "$cluster",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    "D$group": {
                        _id: "$cluster.clusterCode",
                        cluster: {
                            "D$addToSet": {
                                "D$concat": ['$cluster.clusterCode', ' - ', '$cluster.clusterName'],
                            },
                        },
                        dKTNO: { "D$sum": 1 },
                        pKGS: { "D$sum": '$pKGS' },
                        cHRWT: { "D$sum": '$cHRWT' },
                        aCTWT: { "D$sum": '$aCTWT' },
                        cFTTOT: { "D$sum": '$cFTTOT' },
                        dktList: {
                            "D$push": {
                                dKTNO: "$dKTNO",
                                partyCode: "$dockets.cSGN.cD",
                                partyName: "$dockets.cSGN.nM",
                                address: "$dockets.cSGN.aDD",
                                pinCode: "$dockets.cSGN.pIN",
                                city: "$dockets.cSGN.cT",
                                oRGN: "$oRGN",
                                cLOC: "$cLOC",
                                dEST: "$dEST",
                                aCTWT: "$aCTWT",
                                sFX: "$sFX",
                                cHRWT: "$cHRWT",
                                pKGS: "$pKGS",
                                sTS: "$sTS",
                                sTSNM: "$sTSNM",
                                cluster: "$cluster.clusterCode",
                                cFTTOT: "$cFTTOT",

                            }
                        }
                    }
                },
                {
                    "D$match": {
                        _id: { "D$ne": null }  // This stage filters the documents to only those where _id is null
                    }
                }

            ]
        }
        // Send request and handle response
        const res = await firstValueFrom(this.operations.operationMongoPost("generic/query", reqBody));
        return res.data;
    }
    /*End*/
    /*below method is for the getting data and Runsheet Managment Dashboard */
    async getRunSheetManagementData(filter) {
        
        const reqBody = {
            companyCode: this.storage.companyCode,
            collectionName: "drs_headers",
            filter: filter
        }
        // Send request and handle response
        const res = await firstValueFrom(this.operations.operationMongoPost("generic/get", reqBody));
        return res.data;
    }
    /*End*/
    /*below is fieldMapping for the runsheetManagement*/
    async getRunSheetManagementFieldMapping(data) {
        if (data.length > 0) {
            return data.map((item) => {
                return {
                    RunSheet: item?.dRSNO || "",
                    vehicleNo: item?.vEHNO || "",
                    Cluster: `${item?.cLUCD}-${item?.cLUNM}` || '',
                    Shipments: item?.lOAD.dKTS || 0,
                    Packages: item?.lOAD.pKGS || 0,
                    WeightKg: item?.lOAD.wT || 0,
                    VolumeCFT: item.lOAD.vOL || 0,
                    Status: item.oPSSTNM || "",
                    Action: runSheetAction[item.oPSST].replace("_", " "),
                    ...item
                }
            })
        }
        else {
            return []
        }
    }
    /*End*/
    /*below method is for the field mapping which type of data want in runsheet Dashboard field*/
    async fieldMappingRunSheet(data) {
        return data.map((item) => {
            return {
                "Cluster": item?.cluster[0] || '',
                "DeliveryShipments": item?.dKTNO || 0,
                "TotalWeight": item?.aCTWT || 0,
                "PickupRequests": 0,
                "CFT": item?.cFTTOT || 0,
                "Action": "Create Run Sheet",
                ...item
            }
        })
    }
    /*End*/
    /*below method is for the field mapping*/
    async shipmentFieldMapping(data) {
        return data.map((item) => {
            return {
                ...item,
                "documentId": item?.dKTNO || "",
                "type": "Delivery",
                "customer": `${item?.partyCode || ""}-${item?.partyName || ""}`,
                "address": item?.address || "",
                "pincode": item?.pinCode || "",
                "packages": item?.pKGS || 0,
                "weight": item?.cHRWT || 0,
                "volume": item?.cFTTOT || 0
            }
        });
    }
    /*End*/
    /*below method is for the field mapping to Create runSheet*/
    async drsFieldMapping(data, tableData) {
        
        const req = {
            companyCode: this.storage.companyCode,
            collectionName: "vendor_detail",
            filter: { vendorName: data?.Vendor || "" }
        }
        const res = await firstValueFrom(this.operations.operationPost("generic/getOne", req));
        const vendor = res.data ? res.data : ""
        const dkt = tableData.filter((x) => x.isSelected);
        const pkg = dkt.reduce((a, b) => a + b.pKGS, 0);
        const wt = dkt.reduce((a, b) => a + b.cHRWT, 0);
        const vol = dkt.reduce((a, b) => a + b.cFTTOT, 0);
        const runSheetheader = {
            "_id": "",
            "cID": this.storage.companyCode,
            "dRSNO": "",
            "dRSDT": new Date(),
            "dELTYP":data.deliveryType,
            "dELTYPNM":data.deliveryTypeName,
            "lOC": this.storage.branch,
            "cLUCD": data?.Cluster.split('-')[0] || "",
            "cLUNM": data?.Cluster.split('-')[1] || "",
            "vEHNO": data.Vehicle?.value || data?.Vehicle || "",
            "vEHTYP": data?.VehType || "",
            "vND": {
                "cD": vendor ? vendor.vendorCode : "V8888",
                "nM": data?.Vendor || "",
                "tYP": vendor ? vendor.vendorType : "4",
                "tYPNM": data?.VenType || "",
                "pAN": data?.vendPan || "",
            },
            "dRV": {
                "nM": data?.driverNm || "",
                "mNO": data?.driverMobile || "",
                "lNO": data?.lsNo || "",
                "lEDT": data?.lcExpireDate || "",
            },
            "lOAD": {
                "dKTS": dkt.length,
                "pKGS": parseInt(pkg),
                "wT": ConvertToNumber(wt || 0, 3),
                "vOL": ConvertToNumber(vol || 0, 3),
                "vWT": 0,
            },
            "cAP": {
                "wT": ConvertToNumber(data?.CapacityKg || 0, 3),
                "vOL": ConvertToNumber(data?.CapVol || 0, 3),
                "vWT": 0
            },
            "uTI": {
                "wT": ConvertToNumber(data?.WeightUti || 0, 3),
                "vOL": ConvertToNumber(data?.VolUti || 0, 3),
                "vWT": 0
            },
            "dEPT": {
                "dT": null,
                "gPSDT": null,
                "oDOMT": 0
            },
            "cLOS": {
                "dT": null,
                "gPSDT": null,
                "oDOMT": 0
            },
            "pLNDIST": 0,
            "aCTDIST": 0,
            "gPSDIST": 0,
            "oPSST": DrsStatus.Generated,
            "oPSSTNM": DrsStatus[DrsStatus.Generated],
            "fINST": 0,
            "fINSTNM": "",
            "cONTRACT": "",
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
            "cNL": false,
            "cAN": {
                "dT": null,
                "bY": "",
                "rES": "",
                "lOC": ""
            },
            "eNTBY": this.storage.userName,
            "eNTDT": new Date(),
            "eNTLOC": this.storage.branch
        }
        if (dkt.length > 0) {
            const runSheetDetails = dkt.map(element => {
                const runSheetjson = {
                    "_id": "",
                    "cID": this.storage.companyCode,
                    "dRSNO": "",
                    "dRSDT": new Date(),
                    "dKTNO": element.dKTNO,
                    "sFX": element.sFX,
                    "lOC": this.storage.branch,
                    "oRGN": element.oRGN,
                    "dEST": element.dEST,
                    "pKGS": parseInt(element?.pKGS || 0),
                    "vOL": ConvertToNumber(element?.cFTTOT || 0, 3),
                    "wT": ConvertToNumber(element?.aCTWT || 0, 3),
                    "dPKGS": 0,
                    "dVOL": 0,
                    "dWT": 0,
                    "cNE": {
                        "cd": element?.partyCode || "",
                        "nM": element?.partyName || "",
                        "aDD": element?.address || "",
                        "cT": element?.city || "",
                        "pIN": element?.pinCode || ""
                    },
                    "pLN": {
                        "rNK": "",
                        "dIST": "",
                        "eTD": ""
                    },
                    "aCT": {
                        "rNK": "",
                        "dIST": ""
                    },
                    "iSDEL": false,
                    "dLSTS": 1,
                    "dLSTSNM": "",
                    "dDT": null,
                    "dLTYP": 1,
                    "dLTYPNM": "",
                    "dLRES": "",
                    "dLREL": "",
                    "dLPER": "",
                    "pOD": "",
                    "cLSDT": null,
                    "eNTDT": new Date(),
                    "eNTLOC": this.storage.branch,
                    "eNTBY": this.storage.userName,
                }
                return runSheetjson;
            });
            const evnData = dkt.map(element => {
                const eventJson = {
                    _id: ``,
                    cID: this.storage.companyCode,
                    dKTNO: element?.dKTNO || "",
                    sFX: element.sFX,
                    cNO: null,
                    lOC: this.storage.branch,
                    eVNID: DocketEvents.DRS_Generation,
                    eVNDES: getEnumName(DocketEvents, DocketEvents.DRS_Generation)?.replace(/_/g, " "),
                    eVNDT: new Date(),
                    eVNSRC: 'Create RunSheet',
                    dOCTY: 'DRS',
                    dOCNO: '',
                    sTS: DocketStatus.Awaiting_Delivery,
                    sTSNM: DocketStatus[DocketStatus.Awaiting_Delivery].replace(/_/g, " "),
                    oPSSTS: ``,
                    eNTDT: new Date(),
                    eNTLOC: this.storage.branch,
                    eNTBY: this.storage.userName,
                }
                return eventJson;
            });
            return {
                runSheetheader,
                runSheetDetails,
                evnData
            }
        }
    }
    /*End*/
    /*below method is for Shipment*/
    async drsShipmentDetails(filter = {}) {
        const req = {
            companyCode: this.storage.companyCode,
            collectionName: "drs_details",
            filter: filter
        }
        const res = await firstValueFrom(this.operations.operationPost("generic/get", req));
        return res.data.length > 0 ? res.data : [];
    }
    /*End*/
    /*below method is for Update RunSheet*/
    async FieldMappingRunSheetdkts(data) {
        if (data.length > 0) {
            return data.map((item) => {
                return {
                    ...item,
                    "shipment": item?.dKTNO || "",
                    "sFX": item?.sFX||0,
                    "oRGN": item?.oRGN || "",
                    "dEST": item?.dEST || "",
                    "packages": item?.pKGS || 0,
                    "loaded": 0,
                    "pending": item?.pKGS,
                    "cFTTOT": item?.cFTTOT || 0,
                    "aCTWT": item?.aCTWT || 0,
                    "cNE": `${item?.partyCode || ""}-${item?.partyName || ""}`,
                    "address": item?.address || "",
                    "pinCode": item?.pinCode || "",
                    "city": item?.city || "",
                    "cluster": item?.cluster || "",
                    "isSelected": false
                }
            })
        }

    }
    /*End*/
    /*below method is for Shipment*/
    async drsShipmetPkgs(filter = {}) {
        const req = {
            companyCode: this.storage.companyCode,
            collectionName: "docket_pkgs_ltl",
            filter: filter
        }
        const res = await firstValueFrom(this.operations.operationPost("generic/get", req));
        return res.data.length > 0 ? res.data : [];
    }
    /*End*/
    /*Below method is for the field mapping to add runSheet*/
    async addRunSheet(data) {
        const req = {
            companyCode: this.storage.companyCode,
            docType: "DRS",
            collectionName: "drs_headers",
            branch: this.storage.branch,
            finYear: financialYear,
            timeZone: this.storage.timeZone,
            data: data
        }
        const res = await firstValueFrom(this.operations.operationMongoPost("operation/drs/create", req));
        return res.data;
    }
    /*End*/
    /*update shipment code for scaning*/
    handlePackageUpdate(scanValue: string, data: any, csv: any[], cdr: any): any {
        const loadPackage = data.find((x: any) => x.pKGSNO.trim() === scanValue);
        if (!loadPackage) {
            return {
                status: false,
                icon: "error",
                title: "Not Allow to Unload Package",
                text: "This package does not belong to the current branch.",
                showConfirmButton: true,
            };
            //showError("Not Allow to Unload Package", "This package does not belong to the current branch.");
            //return;
        }
        if (loadPackage.ScanFlag) {
            return {
                status: false,
                icon: "error",
                title: "Already Scanned",
                text: "Your Package ID is already scanned.",
                showConfirmButton: true,
            };
            //showError("Already Scanned", "Your Package ID is already scanned.");
            //return;
        }
        const element = csv.find((e: any) => e.shipment === loadPackage.dKTNO);

        if (!element || (element.hasOwnProperty('loaded') && element.packages <= element.loaded)) {
            return {
                status: false,
                icon: "error",
                title: "Invalid Operation",
                text: "Cannot perform the operation. Packages must be greater than loaded.",
                showConfirmButton: true,
            };
            //showError("Invalid Operation", "Cannot perform the operation. Packages must be greater than loaded.");
            //return;
        }
        if (!this.uniqueShipments.has(element.Shipment)) {
            this.uniqueShipments.add(element.Shipment);
        }

        element.pending--;
        element.loaded = (element.loaded || 0) + 1;
        loadPackage.ScanFlag = true;

        //below the Process for The get All count of loaded Packages

        const totalloadedPackages = csv.reduce((total: number, e: any) => {
            return total + (e.loaded || 0);
        }, 0);

        //End

        const event = {
            status: true,
            shipment: this.uniqueShipments.size,
            Package: totalloadedPackages
        };

        // Call kpiData function
        cdr.detectChanges();

        return event;
    }
    /*End*/
    /*below the method is for field mapping Update RunSheet*/
    async UpdateRunSheet(formData, shipmentdata, scanPackage) {
        if(shipmentdata.length>0){
        const evnData = shipmentdata.map(element => {
            const eventJson = {
                _id:`${this?.storage.companyCode}-${formData?.Runsheet}-${element?.dKTNO}-${element.sFX}-${DocketEvents.DRS_Upload}-${moment(new Date()).format('YYYYMMDDHHmmss')}`,
                cID: this.storage.companyCode,
                dKTNO: element?.dKTNO || "",
                sFX: element.sFX,
                cNO: null,
                lOC: this.storage.branch,
                eVNID: DocketEvents.DRS_Upload,
                eVNDES: getEnumName(DocketEvents, DocketEvents.DRS_Upload)?.replace(/_/g, " "),
                eVNDT: new Date(),
                eVNSRC: 'Create RunSheet',
                dOCTY: 'DRS',
                dOCNO:formData?.Runsheet||"",
                sTS: DocketStatus.Out_For_Delivery,
                sTSNM: DocketStatus[DocketStatus.Out_For_Delivery].replace(/_/g, " "),
                oPSSTS:`Out For Delivery with DRS ${formData?.Runsheet} from ${this.storage.branch} since ${moment(new Date()).tz(this.storage.timeZone).format("DD MMM YYYY @ hh:mm A")}`,
                eNTDT: new Date(),
                eNTLOC: this.storage.branch,
                eNTBY: this.storage.userName,
            }
            return eventJson;
        });
        formData.mODBY = this.storage.userName;
        formData.mODDT = new Date();
        formData.mODLOC = this.storage.branch;
        const req = {
            companyCode: this.storage.companyCode,
            branch: this.storage.branch,
            data: {
                 timeZone: this.storage.timeZone,
                 formData: formData,
                 shipmentdata: shipmentdata,
                 scanPackage: scanPackage,
                 evnData:evnData
                 }
        }
        const res = await firstValueFrom(this.operations.operationMongoPost("operation/drs/update",req));
        return res.data;
    }

    }



    /*End*/

}
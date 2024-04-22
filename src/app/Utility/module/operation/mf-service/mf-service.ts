import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { StorageService } from "src/app/core/service/storage.service";
import { ConvertToNumber } from "src/app/Utility/commonFunction/common";
import { financialYear } from "src/app/Utility/date/date-utils";
import { DocketEvents, DocketStatus, getEnumName } from "src/app/Models/docStatus";
import moment from "moment";

@Injectable({
    providedIn: "root",
})
export class ManifestService {
    menfiestData: any;
    constructor(
        private storage: StorageService,
        private operationService: OperationService
    ) { }
    async getFieldMapping(details, header, formField, pkgs) {
        const lsNo = { lSNO: formField?.LoadingSheet || "", rUTCD: formField.route.split(":")[0].trim(), count: parseInt(formField.count) }
        const mfHeader = {
            "_id": "",
            "cID": this.storage.companyCode,
            "mFDT": new Date(),
            "oRGN": formField.Leg?.split("-")[0].trim() || "",
            "dEST": formField.Leg?.split("-")[1].trim() || "",
            "rUTCD": formField.route.split(":")[0].trim() || "",
            "rUTNM": formField.route.split(":")[1].trim() || "",
            "leg": formField?.Leg || 0,
            "dKTS": formField?.Shipments || 0,
            "pKGS": parseInt(formField?.Packages) || 0,
            "wT": ConvertToNumber(header[0]?.WeightKg || 0, 3) || 0,
            "vOL": ConvertToNumber(header[0]?.VolumeCFT || 0, 3) || 0,
            "tHC": formField?.tripId || 0,
            "iSARR": false,
            "eNTDT": new Date(),
            "eNTLOC": this.storage.branch,
            "eNTBY": this.storage.userName,
            "docNo": ""
        }

        //collectionName:"mf_details_ltl"
        const envData = [];
        const mfDetails = details.map((element, index) => {
            try {
                const mfJson = {
                    "_id": "",
                    "cID": this.storage.companyCode,
                    "mFNO": "",
                    "dKTNO": element?.Shipment || "",
                    "sFX": element?.Suffix || 0,
                    "oRGN": element?.Origin || "",
                    "dEST": element?.Destination || "",
                    "pKGS": parseInt(element?.Packages) || 0,
                    "vOL": ConvertToNumber(element?.cft, 3) || 0,
                    "wT": ConvertToNumber(element?.weight, 3) || 0,
                    "cWT": ConvertToNumber(element?.cWeight, 3) || 0,
                    "lDPKG": ConvertToNumber(element?.loaded, 3) || 0,
                    "lDVOL": ConvertToNumber(element?.cft, 3) || 0,
                    "lDWT": ConvertToNumber(element?.weight, 3) || 0,
                    "lDCWT": ConvertToNumber(element?.weight, 3) || 0,
                    "iSARR": false,
                    "eNTDT": new Date(),
                    "eNTLOC": this.storage.branch,
                    "eNTBY": this.storage.userName
                };
                let evnJson = {
                    _id: ``,
                    cID: this.storage.companyCode,
                    dKTNO: element?.Shipment || "",
                    sFX: element?.Suffix || 0,
                    lOC: this.storage.branch,
                    eVNID: DocketEvents.Menifest_Generation,
                    eVNDES: getEnumName(DocketEvents, DocketEvents.Menifest_Generation)?.replace(/_/g, " "),
                    eVNDT: new Date(),
                    eVNSRC: 'Manifest Generated',
                    dOCTY: 'MF',
                    dOCNO: '',
                    sTS: DocketStatus.Loaded,
                    sTSNM: DocketStatus[DocketStatus.Loaded],
                    oPSSTS: ``,
                    eNTDT: new Date(),
                    eNTLOC: this.storage.branch,
                    eNTBY: this.storage.userName,
                };
                envData.push(evnJson);
                return mfJson;
            } catch (error) {
                return null; // Example error handling
            }
        });
        const mfLoadedPackages = pkgs.map((x) => {
            /*CollectionName:mf_pkgs_details*/
            const mfPkgJson = {
                "_id": "",
                "cID": this.storage.companyCode,
                "mFNO": "",
                "dKTNO": x?.dKTNO || "",
                "sFX": x?.sFX || 0,
                "pKGSNO": x?.pKGSNO || "",
                "iSARR": false,
                "eNTDT": new Date(),
                "eNTLOC": this.storage.branch,
                "eNTBY": this.storage.userName
            }
            return mfPkgJson
        })

        // Optionally, filter out any nulls if errors occurred
        const filteredMfDetails = mfDetails.filter(detail => detail !== null);
        return { mfHeader, filteredMfDetails, mfLoadedPackages, envData, lsNo }

    }
    async mapFieldsWithoutScanning(details, header, formField,isScan,notSelectedData) {
        const lsNo = { lSNO: formField?.LoadingSheet || "", rUTCD: formField.route.split(":")[0].trim(), count: parseInt(formField.count) }
       
        //collectionName:"mf_details_ltl"
        const envData = [];
        const mfDetails = details.map((d) => {
            try {
                const mfJson = {
                    "_id": "",
                    "cID": this.storage.companyCode,
                    "mFNO": "",
                    "dKTNO": d?.Shipment || "",
                    "sFX": d?.Suffix || 0,
                    "oRGN": d?.Origin || "",
                    "dEST": d?.Destination || "",
                    "pKGS": parseInt(d?.Packages) || 0,
                    "vOL": ConvertToNumber(d?.cft, 3) || 0,
                    "wT": ConvertToNumber(d?.weight, 3) || 0,
                    "cWT": ConvertToNumber(d?.cWeight, 3) || 0,
                    "lDPKG": ConvertToNumber(d?.loadedPkg, 3) || 0,
                    "lDVOL": ConvertToNumber(d?.cft, 3) || 0,
                    "lDWT": ConvertToNumber(d?.loadedWT, 3) || 0,
                    "lDCWT": ConvertToNumber(d?.loadedCWT, 3) || 0,
                    "iSARR": false,
                    "eNTDT": new Date(),
                    "eNTLOC": this.storage.branch,
                    "eNTBY": this.storage.userName
                };
                let evnJson = {
                    _id: ``,
                    cID: this.storage.companyCode,
                    dKTNO: d?.Shipment || "",
                    sFX: d?.Suffix || 0,
                    lOC: this.storage.branch,
                    eVNID: DocketEvents.Menifest_Generation,
                    eVNDES: getEnumName(DocketEvents, DocketEvents.Menifest_Generation)?.replace(/_/g, " "),
                    eVNDT: new Date(),
                    eVNSRC: 'Manifest Generated',
                    dOCTY: 'MF',
                    dOCNO: '',
                    sTS: DocketStatus.Loaded,
                    sTSNM: DocketStatus[DocketStatus.Loaded],
                    oPSSTS: ``,
                    eNTDT: new Date(),
                    eNTLOC: this.storage.branch,
                    eNTBY: this.storage.userName,
                };
                envData.push(evnJson);
                return mfJson;
            } catch (error) {
                return null; // Example error handling
            }
        });
        const filteredMfDetails = mfDetails.filter(detail => detail !== null);
        const sfxDockets = details.filter((x) => x.pendPkg > 0);
        
        let sfxDocketsData = []
        let isSuffex = false;
        const sfxEnvData = [];
        if (sfxDockets.length > 0) {
            sfxDocketsData = sfxDockets.map((d) => {

                // Parsing and incrementing the suffix safely
                const nextSuffix = Number(d.Suffix) + 1;
                if (isNaN(nextSuffix)) {
                    throw new Error("Invalid Suffix value: " + d.Suffix);
                }

                // Generating a timestamp with moment.js for consistent formatting
                const currentTime = moment().tz(this.storage.timeZone).format("DD MMM YYYY @ hh:mm A");
                const entryTimestamp = new Date();

                // Constructing the new docket JSON object
                const newDocket = {
                    "_id": `${this.storage.companyCode}-${d.Shipment}-${nextSuffix}`,
                    "cID": this.storage.companyCode,
                    "dKTNO": d.Shipment,
                    "sFX": nextSuffix,
                    "cLOC": this.storage.branch,
                    "oRGN": d.Origin,
                    "dEST": d.Destination,
                    "aCTWT": ConvertToNumber(d.pendWt, 3),
                    "cHRWT": ConvertToNumber(d.pendCwt, 3),
                    "tOTCWT": ConvertToNumber(d.pendWt, 3),
                    "tOTWT": ConvertToNumber(d.pendWt, 3),
                    "tOTPKG": parseInt(d.pendPkg) || 0,
                    "pKGS": parseInt(d.pendPkg) || 0,
                    "cFTTOT": ConvertToNumber(d.pendCft, 3),
                    "vEHNO": "",
                    "sTS": DocketStatus.Booked,
                    "sTSNM": DocketStatus[DocketStatus.Booked],
                    "sTSTM": entryTimestamp,
                    "oPSSTS": `Booked at ${this.storage.branch} on ${currentTime}`,
                    "iSDEL": false,
                    "eNTDT": entryTimestamp,
                    "eNTLOC": this.storage.branch,
                    "eNTBY": this.storage.userName
                };
                let sfxData = {
                    _id: `${this.storage.companyCode}-${d.Shipment}-${nextSuffix}-${DocketEvents.Booking}-${moment(new Date()).format('YYYYMMDDHHmmss')}`,
                    cID: this.storage.companyCode,
                    dKTNO: d?.Shipment || "",
                    sFX: d?.Suffix || 0,
                    lOC: this.storage.branch,
                    eVNID: DocketEvents.Booking,
                    eVNDES: getEnumName(DocketEvents, DocketEvents.Booking),
                    eVNDT: new Date(),
                    eVNSRC: 'Booking',
                    dOCTY: 'CN',
                    dOCNO: d?.Shipment || "",
                    sTS: DocketStatus.Booked,
                    sTSNM: DocketStatus[DocketStatus.Booked],
                    oPSSTS: `Booked at ${this.storage.branch} on ${currentTime}`,
                    eNTDT: new Date(),
                    eNTLOC: this.storage.branch,
                    eNTBY: this.storage.userName,
                };
                sfxEnvData.push(sfxData);
                return newDocket;
            });
            isSuffex = true;
        }

        
        const mfHeader = {
            "_id": "",
            "cID": this.storage.companyCode,
            "mFDT": new Date(),
            "oRGN": formField.Leg?.split("-")[0].trim() || "",
            "dEST": formField.Leg?.split("-")[1].trim() || "",
            "rUTCD": formField.route.split(":")[0].trim() || "",
            "rUTNM": formField.route.split(":")[1].trim() || "",
            "leg": formField?.Leg || 0,
            "dKTS": formField?.Shipments || 0,
            "pKGS": parseInt(formField?.Packages) || 0,
            "wT": ConvertToNumber(header[0]?.WeightKg || 0, 3) || 0,
            "vOL": ConvertToNumber(header[0]?.VolumeCFT || 0, 3) || 0,
            "tHC": formField?.tripId || 0,
            "iSARR": false,
            "eNTDT": new Date(),
            "eNTLOC": this.storage.branch,
            "eNTBY": this.storage.userName,
            "docNo": ""
        }

        await this.updateDocketDetails(notSelectedData);
        return { mfHeader, filteredMfDetails, envData, lsNo, sfxDocketsData, isSuffex, sfxEnvData,isScan }
    }
    async createMfDetails(data) {
        const req = {
            companyCode: this.storage.companyCode,
            docType: "MF",
            branch: this.storage.branch,
            finYear: financialYear,
            timeZone: this.storage.timeZone,
            data: data
        }
        const res = await firstValueFrom(this.operationService.operationMongoPost("operation/mf/ltl/create", req));
        return res.data;
    }
    async updateDocketDetails(notSelectedData){
        if(notSelectedData && notSelectedData.length > 0){
         const dockets = notSelectedData.map((d) => `${d.Shipment}-${d.Suffix}`)
            const dktOps = {
                "cLOC": this.storage.branch,
                "tHC": "",
                "lSNO":"",
                "sTS": DocketStatus.Booked,
                "sTSNM": DocketStatus[DocketStatus.Booked].replace(/_/g, " "),
                "sTSTM": new Date(),
                "oPSSTS":`Booked at ${this.storage.branch} on${moment(new Date()).tz(this.storage.timeZone).format("DD MMM YYYY @ hh:mm A")}.`,
                "mODDT": new Date(),
                "mODLOC": this.storage.branch,
                "mODBY": this.storage.userName
            }
            const reqOps = {
                companyCode: this.storage.companyCode,
                collectionName: "docket_ops_det_ltl",
                filter: { "D$expr": { "D$in": [{ "D$concat": ["$dKTNO", "-", { "D$toString": "$sFX" }] }, dockets] } },
                update: dktOps
            }
            await firstValueFrom(this.operationService.operationMongoPut("generic/updateAll", reqOps));
            const eventJson = notSelectedData.map(dkt => {
                const evn = {
                    "_id": `${this.storage.companyCode}-${dkt.Shipment}-${dkt.Suffix}-${DocketEvents.Arrival}- ${moment(new Date()).format("DD MMM YYYY @ hh:mm A")}`, // Safely accessing the ID
                    "cID": this.storage.companyCode,
                    "dKTNO": dkt.Shipment,
                    "sFX":dkt.Suffix,
                    "lOC": this.storage.branch,
                    "eVNID": DocketEvents.Booking,
                    "eVNDES": getEnumName(DocketEvents, DocketEvents.Booking),
                    "eVNDT": new Date(),
                    "eVNSRC": "Booking",
                    "dOCTY": "CN",
                    "dOCNO": dkt.Shipment || "",
                    "sTS": DocketStatus.Booked,
                    "sTSNM": DocketStatus[DocketStatus.Booked],
                    "oPSSTS": `Booked at ${this.storage.branch} on${moment(new Date()).tz(this.storage.timeZone).format("DD MMM YYYY @ hh:mm A")}.`,
                    "eNTDT": new Date(),
                    "eNTLOC": this.storage.branch,
                    "eNTBY": this.storage.userName
                }
                return evn
            });
            const reqEvent = {
                companyCode: this.storage.companyCode,
                collectionName: "docket_events_ltl",
                data: eventJson
            }
            await firstValueFrom(this.operationService.operationMongoPost("generic/create", reqEvent));
            
        }
    }
}
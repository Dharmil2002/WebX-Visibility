import { Injectable } from "@angular/core";
import moment from "moment";
import { firstValueFrom } from "rxjs";
import { DocketEvents, DocketStatus, getEnumName } from "src/app/Models/docStatus";
import { getNextLocation } from "src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction";
import { ConvertToDate, sumProperty } from "src/app/Utility/commonFunction/common";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { StorageService } from "src/app/core/service/storage.service";
import Swal from "sweetalert2";
@Injectable({
    providedIn: "root",
})
export class ArrivalVehicleService {
    constructor(
        private operation: OperationService,
        private storage: StorageService
    ) { }
    /*below function is use in many places so Please change in wisely beacause it affect would be in many module*/
    async getThcWiseMeniFest(filter) {
        let matchQuery = filter
        const reqBody = {
            companyCode: this.storage.companyCode,
            collectionName: "mf_headers_ltl",
            filters: [
                {
                    D$match: matchQuery,
                },
                 {
                    "D$lookup": {
                        "from": "mf_headers_ltl",
                        "let": { "docNumber": "$docNo" }, // Renamed for clarity
                        "pipeline": [
                            {
                                "D$match": {
                                    "D$expr": {
                                        "D$eq": ["$docNo", "$$docNumber"] // Correct comparison between lookup collection and current doc
                                    }
                                }
                            }
                        ],
                        "as": "mfHeader"
                    }
                },
                {
                    "D$unwind": { "path": "$mfHeader", "preserveNullAndEmptyArrays": true }
                },
                {
                    "D$lookup": {
                        "from": "mf_details_ltl",
                        "let": { "mFNumber": "$mfHeader.docNo" }, // Use the correct variable from mfHeader
                        "pipeline": [
                            {
                                "D$match": {
                                    "D$expr": {
                                        "D$eq": ["$mFNO", "$$mFNumber"] // Correct comparison between mf_details_ltl and mfHeader
                                    }
                                }
                            }
                        ],
                        "as": "md"
                    }
                },
                {
                    "D$unwind": { "path": "$md", "preserveNullAndEmptyArrays": false }
                },
                {
                    "D$project": {
                        "docNo": 1,
                        "mFNO": "$mfHeader.docNo",
                        "dKTNO": "$md.dKTNO",
                        "tHCNO": "$mfHeader.tHC",
                        "pKGS": "$md.pKGS",
                        "sFX": "$md.sFX",
                        "dkt": "$mfHeader.dKTS",
                        "lEG": "$mfHeader.leg",
                        "oRG": "$mfHeader.oRGN",
                        "dEST": "$mfHeader.dEST",
                        "wT": "$md.wT",
                        "vOL": "$md.vOL",
                        "iSARR": "$mfHeader.iSARR",
                        "rUTCD": "$mfHeader.rUTCD",
                        "rUTNM": "$mfHeader.rUTNM",
                        "mFDT": {
                            "D$ifNull": ["$mfHeader.mFDT", "$mfHeader.eNTDT"]
                        }
                    }
                }
            ]
        }
        // Send request and handle response
        const res = await firstValueFrom(this.operation.operationMongoPost("generic/query", reqBody));
        return res.data;
    }
    /*End*/
    /*below code is for to Check Seal No*/
    async getCheckOnce(filter) {
        const req = {
            companyCode: this.storage.companyCode,
            collectionName: "thc_movement_ltl",
            filter: filter
        }
        const res = await firstValueFrom(this.operation.operationMongoPost("generic/getOne", req));
        return res.data;
    }
    /*End*/

    /*Below function is for register entry of mark Arrival*/
    async fieldMappingMarkArrival(trip, data, dktList) {
        let legID =  `${this.storage.companyCode}-${trip.TripID}-${trip.cLOC}-${trip.nXTLOC}`;
        var lagData = await this.getCheckOnce({
            "_id": legID,
        });
        if(!lagData && lagData?._id != legID)
            return;
        
        let eventJson = dktList;
        const arrivalData = {
            aRR: {
                "sCHDT": null,
                "eXPDT": ConvertToDate(data?.ETA || data?.ArrivalTime),
                "aCTDT": ConvertToDate(data?.ArrivalTime || new Date()),
                "oDOMT": 0,
                "aRBY": this.storage.userName
            },
            uNLOAD: {
                "dKTS": 0,
                "pKGS": 0,
                "wT": 0,
                "vOL": 0,
                "vWT": 0,
                "sEALNO": data?.Sealno || "",
                "sEALSTS": data?.SealStatus || "",
                "lTRES": data?.LateReason || "",
                "rES": data.Reason || "",
                "pOD": data.Upload || "",
            },
            mODDT: new Date(),
            mODLOC: this.storage.branch,
            mODBY: this.storage.userName
        }
        const mfData = {
            iSARR: true
        }
        if (dktList.length > 0) {
            eventJson = dktList.map(element => {
                const evn = {
                    "_id": `${this.storage.companyCode}-${element?.dKTNO}-${element?.docNo}-${element?.sFX}-${DocketEvents.Arrival}-${moment(new Date()).format("DD MMM YYYY @ hh:mm A")}`, // Safely accessing the ID
                    "cID": this.storage.companyCode,
                    "dKTNO": element?.dKTNO || "",
                    "sFX": 0,
                    "lOC": this.storage.branch,
                    "eVNID": DocketEvents.Arrival,
                    "eVNDES": getEnumName(DocketEvents, DocketEvents.Arrival),
                    "eVNDT": new Date(),
                    "eVNSRC": "Vehicle Arrived",
                    "dOCTY": "TH",
                    "dOCNO": data?.TripID || "",
                    "sTS": DocketStatus.Arrived,
                    "sTSNM": DocketStatus[DocketStatus.Arrived],
                    "oPSSTS":`Arrived at ${this.storage.branch} on ${moment(new Date()).tz(this.storage.timeZone).format("DD MMM YYYY @ hh:mm A")}.`,
                    "eNTDT": new Date(),
                    "eNTLOC": this.storage.branch,
                    "eNTBY": this.storage.userName
                }
                return evn
            });

            const updateThc = {
                companyCode: this.storage.companyCode,
                collectionName: "thc_summary_ltl",
                filter: { docNo: data?.TripID },
                update: arrivalData.aRR
            }
            await firstValueFrom(this.operation.operationMongoPut("generic/update", updateThc));

            const updateMovement = {
                companyCode: this.storage.companyCode,
                collectionName: "thc_movement_ltl",
                filter: { _id: legID },
                update: arrivalData
            }
            await firstValueFrom(this.operation.operationMongoPut("generic/update", updateMovement));

            const mfNo = dktList.map((x) => x.docNo);
            const updateMfHeader = {
                companyCode: this.storage.companyCode,
                collectionName: "mf_headers_ltl",
                filter: { docNo: { "D$in": mfNo } },
                update: mfData
            }
            await firstValueFrom(this.operation.operationMongoPut("generic/update", updateMfHeader));
            const updateMfDetails = {
                companyCode: this.storage.companyCode,
                collectionName: "mf_details_ltl",
                filter: { mFNO: { "D$in": mfNo } },
                update: mfData
            }
            await firstValueFrom(this.operation.operationMongoPut("generic/updateAll", updateMfDetails));
            const addEvnt = {
                companyCode: this.storage.companyCode,
                collectionName: "docket_events_ltl",
                data: eventJson
            }
            await firstValueFrom(this.operation.operationPost("generic/create", addEvnt));
            const dkt = dktList.map((x) => `${x.dKTNO}-${x.sFX}`);
            if (dkt.length > 0) {
                const reqDktOpsArrived = {
                    companyCode: this.storage.companyCode,
                    collectionName: "docket_ops_det_ltl",
                    filter: { "D$expr": { "D$in": [{ "D$concat": ["$dKTNO", "-", { "D$toString": "$sFX" }] }, dkt] } },
                    update: {
                        "sTS": DocketStatus.Arrived,
                        "sTSNM": DocketStatus[DocketStatus.Arrived],
                        "oPSSTS": `Arrived at ${this.storage.branch} on ${moment(new Date()).tz(this.storage.timeZone).format("DD MMM YYYY @ hh:mm A")}.`,
                        "mODBY": this.storage.userName,
                        "mODDT": new Date(),
                        "mODLOC": this.storage.branch
                    }
                }
                await firstValueFrom(this.operation.operationMongoPut("generic/updateAll", reqDktOpsArrived));
            }


        }

        return true
    }
    /*End*/
    async fieldMappingArrivalScan(data, dktList, scanDkt) {
        
        let legID =  `${this.storage.companyCode}-${data.TripID}-${data.cLOC}-${data.nXTLOC}`;
        var lagData = await this.getCheckOnce({
            "_id": legID,
        });
        if(!lagData && lagData?._id != legID)
            return;

        let eventJson = dktList;
        const dktCount = dktList.length;
        const unloadPackage = sumProperty(dktList, 'Packages');
        const unloadWeightKg = sumProperty(dktList, 'WeightKg');
        const volumeCFT = sumProperty(dktList, 'VolumeCFT');
        const next = getNextLocation(data.Route.split(":")[1].split("-"), this.storage.branch);

        const legUnloadData = {
            uNLOAD: {
                dKTS: dktCount,
                pKGS: unloadPackage,
                wT: unloadWeightKg,
                vOL: volumeCFT,
                vWT: 0, // Assuming this is to be calculated or filled in later
            }
        }
        const ls = {
            cLOC: this.storage.branch
        }
        const req = {
            companyCode: this.storage.companyCode,
            collectionName: "thc_movement_ltl",
            filter: { _id: legID },
            update: legUnloadData
        }
        await firstValueFrom(this.operation.operationMongoPut("generic/update", req));


        const destDocket = dktList.filter((x) => x.Destination == this.storage.branch);
        const transDocket = dktList.filter((x) => x.Destination != this.storage.branch);

        if (destDocket.length > 0) {
            const dockets = destDocket.map((d) => `${d.Shipment}-${d.Suffix}`)
            const dktOps = {
                "cLOC": this.storage.branch,
                "tHC": "",
                "sTS": DocketStatus.In_Delivery_Stock,
                "sTSNM": DocketStatus[DocketStatus.In_Delivery_Stock].replace(/_/g, " "),
                "sTSTM": new Date(),
                "oPSSTS": `In stock at ${this.storage.branch} and available for delivery since ${moment(new Date()).tz(this.storage.timeZone).format("DD MMM YYYY @ hh:mm A")}`,
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
            await firstValueFrom(this.operation.operationMongoPut("generic/updateAll", reqOps));
            const eventJson = dktList.map(dkt => {
                const evn = {
                    "_id": `${this.storage.companyCode}-${dkt.Shipment}-${dkt.Suffix}-${DocketEvents.Arrival_Scan}- ${moment(new Date()).format("DD MMM YYYY @ hh:mm A")}`, // Safely accessing the ID
                    "cID": this.storage.companyCode,
                    "dKTNO": dkt.Shipment,
                    "sFX": 0,
                    "lOC": this.storage.branch,
                    "eVNID": DocketEvents.Arrival_Scan,
                    "eVNDES": getEnumName(DocketEvents, DocketEvents.Arrival_Scan).replace(/_/g, " "),
                    "eVNDT": new Date(),
                    "eVNSRC": "Arrival Scan",
                    "dOCTY": "TH",
                    "dOCNO": data?.TripID || "",
                    "sTS": DocketStatus.In_Delivery_Stock,
                    "sTSNM": DocketStatus[DocketStatus.In_Delivery_Stock].replace(/_/g, " "),
                    "oPSSTS": `In stock at ${this.storage.branch} and available for delivery since ${moment(new Date()).tz(this.storage.timeZone).format("DD MMM YYYY @ hh:mm A")}`,
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
            await firstValueFrom(this.operation.operationMongoPost("generic/create", reqEvent));
        }
        if (transDocket.length > 0) {
            const dockets = transDocket.map((d) => `${d.Shipment}-${d.Suffix}`)
            const dktOps = {
                "cLOC": this.storage.branch,
                "tHC": "",
                "sTS": DocketStatus.In_Transhipment_Stock,
                "sTSNM": DocketStatus[DocketStatus.In_Transhipment_Stock].replace(/_/g, " "),
                "sTSTM": new Date(),
                "oPSSTS": `In stock at ${this.storage.branch} and available for loadingsheet since ${moment(new Date()).tz(this.storage.timeZone).format("DD MMM YYYY @ hh:mm A")}`,
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
            await firstValueFrom(this.operation.operationMongoPut("generic/updateAll", reqOps));
            const eventJson = dktList.map(dkt => {
                const evn = {
                    "_id": `${this.storage.companyCode}-${dkt.Shipment}-${dkt.Suffix}-${DocketEvents.Arrival_Scan}- ${moment(new Date()).format("DD MMM YYYY @ hh:mm A")}`, // Safely accessing the ID
                    "cID": this.storage.companyCode,
                    "dKTNO": dkt.Shipment,
                    "sFX": 0,
                    "lOC": this.storage.branch,
                    "eVNID": DocketEvents.Arrival_Scan,
                    "eVNDES": getEnumName(DocketEvents, DocketEvents.Arrival_Scan).replace(/_/g, " "),
                    "eVNDT": new Date(),
                    "eVNSRC": "Arrival Scan",
                    "dOCTY": "TH",
                    "dOCNO": data?.TripID || "",
                    "sTS": DocketStatus.In_Transhipment_Stock,
                    "sTSNM": DocketStatus[DocketStatus.In_Transhipment_Stock].replace(/_/g, " "),
                    "oPSSTS": `In stock at ${this.storage.branch} and available for loadingsheet since ${moment(new Date()).tz(this.storage.timeZone).format("DD MMM YYYY @ hh:mm A")}`,
                    "eNTDT": new Date(),
                    "eNTLOC": this.storage.branch,
                    "eNTBY": this.storage.userName
                };
                return evn
            });
            const reqEvent = {
                companyCode: this.storage.companyCode,
                collectionName: "docket_events_ltl",
                data: eventJson
            }
            await firstValueFrom(this.operation.operationMongoPost("generic/create", reqEvent));
        }

        const reqPkg = {
            companyCode: this.storage.companyCode,
            collectionName: "docket_pkgs_ltl",
            filter: { pKGSNO: { "D$in": scanDkt } },
            update: ls
        }
        await firstValueFrom(this.operation.operationMongoPut("generic/updateAll", reqPkg));
        const reqMF = {
            companyCode: this.storage.companyCode,
            collectionName: "mf_pkgs_details",
            filter: { pKGSNO: { "D$in": scanDkt } },
            update: { cLOC: this.storage.branch, iSARR: true }
        }
        await firstValueFrom(this.operation.operationMongoPut("generic/updateAll", reqMF));
        const mfNo = dktList.map((x) => x.mfNo);
        const reqMf = {
            companyCode: this.storage.companyCode,
            collectionName: "mf_headers_ltl",
            filter: { mFNO: { "D$in": mfNo } },
            update: { iSDEL: true }
        }
        await firstValueFrom(this.operation.operationMongoPut("generic/updateAll", reqMf));
        const reqMfDet = {
            companyCode: this.storage.companyCode,
            collectionName: "mf_details_ltl",
            filter: { mFNO: { "D$in": mfNo } },
            update: { iSDEL: true }
        }
        await firstValueFrom(this.operation.operationMongoPut("generic/updateAll", reqMfDet));
        if (next) {
            const tripStatus = {
                cLOC: this.storage.branch,
                nXTLOC: next,
                sTS: 6,// Assuming this is the status code for "In Transit",
                sTSNM: "Picked Up"
            }
            const reqTrip = {
                companyCode: this.storage.companyCode,
                collectionName: "trip_Route_Schedule",
                filter: { tHC: data.TripID },
                update: tripStatus
            }
            await firstValueFrom(this.operation.operationMongoPut("generic/update", reqTrip));
            Swal.fire({
                icon: "success",
                title: "Successful",
                text: `Vehicle arrived successfully`,//
                showConfirmButton: true,
            })
        }
        else {

            const thcSummary = {
                oPSST: 2,
                oPSSTNM: "Closed"
            }
    
            const reqTHC = {
                companyCode: this.storage.companyCode,
                collectionName: "thc_summary_ltl",
                filter: { docNo: legID },
                update: thcSummary
            }
            await firstValueFrom(this.operation.operationMongoPut("generic/update", reqTHC));

            const tripStatus = {
                cLOC: data.Route.split(":")[1].split("-")[0],
                nXTLOC: "",
                vEHNO: "",
                tHC: "",
                lSNO:"",
                mFNO:"",
                sTS: 7,// Assuming this is the status code for "In Transit",
                sTSNM: "Route Updated"
            }
            const reqTrip = {
                companyCode: this.storage.companyCode,
                collectionName: "trip_Route_Schedule",
                filter: { tHC: data.TripID },
                update: tripStatus
            }

            await firstValueFrom(this.operation.operationMongoPut("generic/update", reqTrip));
            const reqVehicle = {
                companyCode: this.storage.companyCode,
                collectionName: "vehicle_status",
                filter: { vehNo: data.VehicleNo },
                update: { currentLocation: this.storage.branch, tripId: "", route: "",status: "Available" }
            }
            
            await firstValueFrom(this.operation.operationMongoPut("generic/update", reqVehicle));
            Swal.fire({
                icon: "info",
                title: "Trip is close",
                text: "Trip is close at" + this.storage.branch,
                showConfirmButton: true,
            });
        }
        return true
    }
}
import { Injectable } from "@angular/core";
import { get } from "lodash";
import moment from "moment";
import { firstValueFrom } from "rxjs";
import { DocketEvents, DocketStatus, ThcStatus, getEnumName } from "src/app/Models/docStatus";
import { chunkArray, getNextLocation } from "src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction";
import { ConvertToDate, ConvertToNumber, sumProperty } from "src/app/Utility/commonFunction/common";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { StorageService } from "src/app/core/service/storage.service";
import Swal from "sweetalert2";
import convert from 'convert-units';
import { GenericActions } from "src/app/config/myconstants";
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
                      "let": {
                        "docNumber": "$docNo"
                      },
                      "pipeline": [
                        {
                          "D$match": {
                            "D$expr": {
                              "D$eq": ["$docNo", "$$docNumber"]
                            }
                          }
                        }
                      ],
                      "as": "mfHeader"
                    }
                  },
                  {
                    "D$unwind": {
                      "path": "$mfHeader",
                      "preserveNullAndEmptyArrays": true
                    }
                  },
                  {
                    "D$lookup": {
                      "from": "mf_details_ltl",
                      "let": {
                        "mFNumber": "$mfHeader.docNo"
                      },
                      "pipeline": [
                        {
                          "D$match": {
                            "D$expr": {
                              "D$eq": ["$mFNO", "$$mFNumber"]
                            }
                          }
                        }
                      ],
                      "as": "md"
                    }
                  },
                  {
                    "D$unwind": {
                      "path": "$md",
                      "preserveNullAndEmptyArrays": false
                    }
                  },
                  {
                    "D$lookup": {
                      "from": "thc_summary_ltl",
                      "localField": "tHC",
                      "foreignField": "tHC",
                      "as": "thdDetails"
                    }
                  },
                  {
                    "D$unwind": {
                      "path": "$thdDetails",
                      "preserveNullAndEmptyArrays": true
                    }
                  },
                  {
                    "D$project": {
                      "docNo": 1,
                      "mFNO": {
                        "D$ifNull": ["$mfHeader.docNo", null]
                      },
                      "dKTNO": { "D$ifNull": ["$md.dKTNO", null] },
                      "tHCNO": { "D$ifNull": ["$mfHeader.tHC", null] },
                      "tHCDT": {
                        "D$ifNull": ["$thdDetails.tHCDT", null]
                      },
                      "pKGS": { "D$ifNull": ["$md.lDPKG", null] },
                      "sFX": { "D$ifNull": ["$md.sFX", null] },
                      "dkt": { "D$ifNull": ["$mfHeader.dKTS", null] },
                      "lEG": { "D$ifNull": ["$mfHeader.leg", null] },
                      "lORGN": { "D$ifNull": ["$mfHeader.oRGN", null] },
                      "lDEST": { "D$ifNull": ["$mfHeader.dEST", null] },
                      "oRG": { "D$ifNull": ["$md.oRGN", null] },
                      "dEST": { "D$ifNull": ["$md.dEST", null] },
                      "wT": { "D$ifNull": ["$md.lDWT", null] },
                      "cWT": { "D$ifNull": ["$md.lDCWT", null] },
                      "vOL": { "D$ifNull": ["$md.lDVOL", null] },
                      "iSARR": {
                        "D$ifNull": ["$mfHeader.iSARR", null]
                      },
                      "rUTCD": {
                        "D$ifNull": ["$mfHeader.rUTCD", null]
                      },
                      "rUTNM": {
                        "D$ifNull": ["$mfHeader.rUTNM", null]
                      },
                      "mFDT": {
                        "D$ifNull": [
                          "$mfHeader.mFDT",
                          "$mfHeader.eNTDT"
                        ]
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
        let legID = `${this.storage.companyCode}-${trip.TripID}-${trip.cLOC}-${trip.nXTLOC}`;
        var lagData = await this.getCheckOnce({
            "_id": legID,
        });
        if (!lagData && lagData?._id != legID)
            return;

        let eventJson = dktList;

        const arrivalData = {
            aRR: {
                "sCHDT": null,
                "eXPDT": ConvertToDate(data?.ETA || data?.ArrivalTime),
                "aCTDT": ConvertToDate(data?.ArrivalTime || new Date()),
                "oDOMT": 0,
                "sEALNO": data?.Sealno || "",
                "sEALSTS": data?.SealStatus || "",
                "lTRES": data?.LateReason || "",
                "rES": data.Reason || "",
                "pOD": data?.pod || "",
                "aRBY": this.storage.userName
            },
            uNLOAD: {
                "dKTS": 0,
                "pKGS": 0,
                "wT": 0,
                "vOL": 0,
                "vWT": 0
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
                    "oPSSTS": `Arrived at ${this.storage.branch} on ${moment(new Date()).tz(this.storage.timeZone).format("DD MMM YYYY @ hh:mm A")}.`,
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
                update: {aRR: arrivalData.aRR}
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
                        //"aRRDT":new Date(),
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
    /*below code is for the Scaning*/
    async fieldMappingArrivalScan(data, dktList, scanDkt) {

        let legID = `${this.storage.companyCode}-${data.TripID}-${data.cLOC}-${data.nXTLOC}`;
        var lagData = await this.getCheckOnce({
            "_id": legID,
        });
        if (!lagData && lagData?._id != legID)
            return;

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
            cLOC: this.storage.branch,
            lSNO: "",
            mFNO: "",
            tHC: ""
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
                "lSNO": "",
                "mFNO": "",
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
                "lSNO": "",
                "mFNO": "",
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
        const pkgsno = scanDkt.map((x) => x.pKGSNO);
        if (pkgsno && pkgsno.length > 0) {
            const reqPkg = {
                companyCode: this.storage.companyCode,
                collectionName: "docket_pkgs_ltl",
                filter: { pKGSNO: { "D$in": pkgsno } },
                update: ls
            }
            await firstValueFrom(this.operation.operationMongoPut("generic/updateAll", reqPkg));
            const reqMF = {
                companyCode: this.storage.companyCode,
                collectionName: "mf_pkgs_details",
                filter: { pKGSNO: { "D$in": pkgsno } },
                update: { cLOC: this.storage.branch, iSARR: true }
            }
            await firstValueFrom(this.operation.operationMongoPut("generic/updateAll", reqMF));
        }
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
                oPSST: ThcStatus.Arrived,
                oPSSTNM: ThcStatus[ThcStatus.Arrived],
            }
            const reqTHC = {
                companyCode: this.storage.companyCode,
                collectionName: "thc_summary_ltl",
                filter: { tHC: data.TripID },
                update: thcSummary
            }
            await firstValueFrom(this.operation.operationMongoPut("generic/update", reqTHC));

            // const tripStatus = {
            //     cLOC: data.Route.split(":")[1].split("-")[0],
            //     nXTLOC: "",
            //     vEHNO: "",
            //     tHC: "",
            //     lSNO: "",
            //     mFNO: "",
            //     sTS: 7,// Assuming this is the status code for "In Transit",
            //     sTSNM: "Route Updated"
            // }
            // const reqTrip = {
            //     companyCode: this.storage.companyCode,
            //     collectionName: "trip_Route_Schedule",
            //     filter: { tHC: data.TripID },
            //     update: tripStatus
            // }

            // await firstValueFrom(this.operation.operationMongoPut("generic/update", reqTrip));
            await this.deleteTrip({cID:this.storage.companyCode,tHC: data.TripID})
            const reqVehicle = {
                companyCode: this.storage.companyCode,
                collectionName: "vehicle_status",
                filter: { vehNo: data.VehicleNo },
                update: { currentLocation: this.storage.branch, tripId: "", route: "", status: "Available" }
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
    /*End*/
    /*below code is for the withoutScan*/
    async fieldMappingWithoutScanArrival(data, dktList, notSelectedData, scanDkt, isScan) {
        let legID = `${this.storage.companyCode}-${data.TripID}-${data.cLOC}-${data.nXTLOC}`;
        let lagData = await this.getCheckOnce({
            "_id": legID,
        });
        if (!lagData && lagData?._id != legID)
            return;
        const dktCount = dktList.length;
        const unloadPackage = sumProperty(dktList, 'unloadedPkg');
        const unloadWeightKg = sumProperty(dktList, 'unloadedWT');
        const unloadctWeight = sumProperty(dktList, 'unloadctWeight');
        const next = getNextLocation(data.Route.split(":")[1].split("-"), this.storage.branch);
        const getInvoice = await this.gettingLastSuffix(dktList);
        let lDVOL = 0;
        if (getInvoice && getInvoice.length > 0) {
            let height = getInvoice.reduce((a, b) => a + b.vOL.h, 0);
            let length = getInvoice.reduce((a, b) => a + b.vOL.l, 0);
            let breadth = getInvoice.reduce((a, b) => a + b.vOL.b, 0);
            let pkgs = unloadPackage;
            lDVOL = convert(height).from('cm').to('ft') *
                convert(length).from('cm').to('ft') *
                convert(breadth).from('cm').to('ft') * parseInt(pkgs);
        }
        const legUnloadData = {
            uNLOAD: {
                dKTS: dktCount,
                pKGS: unloadPackage,
                wT: unloadWeightKg,
                cWT: unloadctWeight,
                vOL: parseFloat(lDVOL.toFixed(2)),
                vWT: 0, // Assuming this is to be calculated or filled in later
            }
        }
        const ls = {
            cLOC: this.storage.branch,
            lSNO: "",
            mFNO: "",
            tHC: ""
        }
        const req = {
            companyCode: this.storage.companyCode,
            collectionName: "thc_movement_ltl",
            filter: { _id: legID },
            update: legUnloadData
        }
        await firstValueFrom(this.operation.operationMongoPut("generic/update", req));

        if (dktList && dktList.length > 0) {
            const destDocket = dktList.filter((x) => x.Destination == this.storage.branch);
            const transDocket = dktList.filter((x) => x.Destination != this.storage.branch);
            /*below code execute for the update In delivery stock Update*/
            if (destDocket.length > 0) {
                let eventJson = [];
                const stsMessage = `In stock at ${this.storage.branch} and available for delivery since ${moment(new Date()).tz(this.storage.timeZone).format("DD MMM YYYY @ hh:mm A")}`
                const batchOperations = this.processDockets(destDocket, getInvoice, { code: DocketStatus.In_Delivery_Stock, name: DocketStatus[DocketStatus.In_Delivery_Stock].replace(/_/g, " ") }, stsMessage);
                // Bulk update database with the new costs
                await this.updateBulk(batchOperations);
                eventJson = destDocket.map(dkt => {
                    const evn = {
                        "_id": `${this.storage.companyCode}-${dkt.Shipment}-${dkt.Suffix}-${DocketEvents.Arrival_Scan}- ${moment(new Date()).format("DD MMM YYYY @ hh:mm A")}`, // Safely accessing the ID
                        "cID": this.storage.companyCode,
                        "dKTNO": dkt.Shipment,
                        "sFX": dkt.Suffix,
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
            /* End */
            /* below code is for the transhiment stock */
            let eventJson = [];
            if (transDocket.length > 0) {
                const stsMessage = `In stock at ${this.storage.branch} and available for loadingsheet since ${moment(new Date()).tz(this.storage.timeZone).format("DD MMM YYYY @ hh:mm A")}`
                const batchOperations = this.processDockets(transDocket, getInvoice, { code: DocketStatus.In_Transhipment_Stock, name: DocketStatus[DocketStatus.In_Transhipment_Stock].replace(/_/g, " ") }, stsMessage);
                // Bulk update database with the new costs
                await this.updateBulk(batchOperations);
                eventJson = transDocket.map(dkt => {
                    const evn = {
                        "_id": `${this.storage.companyCode}-${dkt.Shipment}-${dkt.Suffix}-${DocketEvents.Arrival_Scan}- ${moment(new Date()).format("DD MMM YYYY @ hh:mm A")}`, // Safely accessing the ID
                        "cID": this.storage.companyCode,
                        "dKTNO": dkt.Shipment,
                        "sFX": dkt.Suffix,
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
            /* End */
            if (isScan) {
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
            }
            const pkgsno = scanDkt.map((x) => x.pKGSNO);
            if (pkgsno && pkgsno.length > 0) {
                const reqPkg = {
                    companyCode: this.storage.companyCode,
                    collectionName: "docket_pkgs_ltl",
                    filter: { pKGSNO: { "D$in": pkgsno } },
                    update: ls
                }
                await firstValueFrom(this.operation.operationMongoPut("generic/updateAll", reqPkg));
                const reqMF = {
                    companyCode: this.storage.companyCode,
                    collectionName: "mf_pkgs_details",
                    filter: { pKGSNO: { "D$in": pkgsno } },
                    update: { cLOC: this.storage.branch, iSARR: true }
                }
                await firstValueFrom(this.operation.operationMongoPut("generic/updateAll", reqMF));
            }
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
            const sfxDockets = dktList.filter((x) => x.pendPkg != 0 && x.pendWt != 0);
            let sfxDocketsData = []
            let isSuffex = false;
            const sfxEnvData = [];
            if (sfxDockets.length > 0) {
                const suffixData = await this.gettingLastSuffix(sfxDockets);
                sfxDocketsData = sfxDockets.map(docket => {
                    // Parsing and incrementing the suffix safely
                    const dktOps = suffixData.find(x => x.dKTNO == docket.Shipment);
                    if (!dktOps) {
                        throw new Error("No Data Found");
                    }
                    const nextSuffix = Number(dktOps.Suffix) + 1;
                    if (isNaN(nextSuffix)) {
                        throw new Error("Invalid Suffix value: " + docket.Suffix);
                    }

                    // Generating a timestamp with moment.js for consistent formatting
                    const currentTime = moment().tz('Asia/Kolkata').format("DD MMM YYYY @ hh:mm A");
                    const entryTimestamp = new Date();

                    // Constructing the new docket JSON object
                    const newDocket = {
                        "_id": `${this.storage.companyCode}-${docket.Shipment}-${nextSuffix}`,
                        "cID": this.storage.companyCode,
                        "dKTNO": docket.Shipment,
                        "sFX": nextSuffix,
                        "cLOC": docket.Origin,
                        "oRGN": docket.Origin,
                        "dEST": docket.Destination,
                        "aCTWT": ConvertToNumber(docket.pendWt, 3),
                        "cHRWT": ConvertToNumber(docket.pendCwt, 3),
                        "tOTCWT": ConvertToNumber(docket.pendWt, 3),
                        "tOTWT": ConvertToNumber(docket.pendWt, 3),
                        "tOTPKG": parseInt(docket.pendPkg) || 0,
                        "pKGS": parseInt(docket.pendPkg) || 0,
                        "cFTTOT": ConvertToNumber(docket.pendCft, 3),
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
                        _id: `${this.storage.companyCode}-${docket.Shipment}-${nextSuffix}-${DocketEvents.Booking}-${moment(new Date()).format('YYYYMMDDHHmmss')}`,
                        cID: this.storage.companyCode,
                        dKTNO: docket?.Shipment || "",
                        sFX: docket?.Suffix || 0,
                        lOC: docket.Origin,
                        eVNID: DocketEvents.Booking,
                        eVNDES: getEnumName(DocketEvents, DocketEvents.Booking),
                        eVNDT: new Date(),
                        eVNSRC: 'Booking',
                        dOCTY: 'CN',
                        dOCNO: docket?.Shipment || "",
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
            if (isSuffex) {
                await this.getArrivalBasesdocket(sfxDocketsData, sfxEnvData);
            }
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
                    oPSST: ThcStatus.Arrived,
                    oPSSTNM: ThcStatus[ThcStatus.Arrived],
                }
                const reqTHC = {
                    companyCode: this.storage.companyCode,
                    collectionName: "thc_summary_ltl",
                    filter: { tHC: data.TripID },
                    update: thcSummary
                }
                await firstValueFrom(this.operation.operationMongoPut("generic/update", reqTHC));

                // const tripStatus = {
                //     cLOC: data.Route.split(":")[1].split("-")[0],
                //     nXTLOC: "",
                //     vEHNO: "",
                //     tHC: "",
                //     lSNO: "",
                //     mFNO: "",
                //     sTS: 7,// Assuming this is the status code for "In Transit",
                //     sTSNM: "Route Updated"
                // }
                // const reqTrip = {
                //     companyCode: this.storage.companyCode,
                //     collectionName: "trip_Route_Schedule",
                //     filter: { tHC: data.TripID },
                //     update: tripStatus
                // }
              //  await firstValueFrom(this.operation.operationMongoPut("generic/update", reqTrip));
              await this.deleteTrip({cID:this.storage.companyCode,tHC:data.TripID})
                const reqVehicle = {
                    companyCode: this.storage.companyCode,
                    collectionName: "vehicle_status",
                    filter: { vehNo: data.VehicleNo },
                    update: { currentLocation: this.storage.branch, tripId: "", route: "", status: "Available" }
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
        else {
            await this.updateNotStockUpdate(notSelectedData, isScan, scanDkt, ls);
            return true
        }
    }
    /*End*/
    /* Note: All three functions below have a cascading effect because they are used in fieldMappingWithoutScanArrival.
      Please review their usage carefully before making any changes. */

    /*below code is linked with the fieldMappingWithoutScanArrival function*/
    async getArrivalBasesdocket(sfxData, sfxEnvData) {
        const reqInv = {
            companyCode: this.storage.companyCode,
            collectionName: "dockets_ltl",
            filters: [
                {
                    D$match: {
                        dKTNO: {
                            D$in: sfxData.map((sfx) => sfx.dKTNO)
                        }
                    }
                },
                {
                    D$lookup: {
                        from: "docket_invoices_ltl",
                        localField: "docNo",
                        foreignField: "dKTNO",
                        as: "dktInvoice"
                    }
                },
                {
                    D$unwind: {
                        path: "$dktInvoice",
                        preserveNullAndEmptyArrays: false
                    }
                },
                {
                    D$project: {
                        dKTNO: 1,
                        dKTDT: 1,
                        cFTRATO: 1,
                        cFTTOT: 1,
                        lENGHT: "$dktInvoice.vOL.l",
                        bREADTH: "$dktInvoice.vOL.b",
                        hEIGHT: "$dktInvoice.vOL.h",
                        cUBWT: "$dktInvoice.vOL.cU"

                    }
                }
            ]
        }
        const getData = await firstValueFrom(this.operation.operationMongoPost("generic/query", reqInv));
        if (getData.length > 0) {

            sfxData.forEach(sfx => {
                const invData = getData.find((inv) => inv.dKTNO == sfx.dKTNO);
                if (invData) {
                    sfx.cFTTOT =
                        (parseFloat(invData.lENGHT) *
                            parseFloat(invData.bREADTH) *
                            parseFloat(invData.hEIGHT) *
                            parseInt(sfx.tOTPKG)
                        );
                }
            })

        }

        const req = {
            companyCode: this.storage.companyCode,
            collectionName: "docket_ops_det_ltl",
            data: sfxData
        }
        await firstValueFrom(this.operation.operationPost("generic/create", req));
        if (sfxEnvData && sfxEnvData.length > 0) {
            const reqEvent = {
                companyCode: this.storage.companyCode,
                collectionName: "docket_events_ltl",
                data: sfxEnvData
            }
            await firstValueFrom(this.operation.operationPost("generic/create", reqEvent));
        }
        return true

    }
    /*End*/
    /*below code is linked with the fieldMappingWithoutScanArrival function*/
    async updateNotStockUpdate(dktList, isScan, scanDkt, ls) {
        if (dktList && dktList.length > 0) {
            const dockets = dktList.map((d) => `${d.Shipment}-${d.Suffix}`)
            const dktOps = {
                "tHC": "",
                "lSNO": "",
                "mFNO": "",
                "sTS": DocketStatus.Booked,
                "sTSNM": DocketStatus[DocketStatus.Booked],
                "sTSTM": new Date(),
                "oPSSTS": `Booked at ${this.storage.branch} on${moment(new Date()).tz(this.storage.timeZone).format("DD MMM YYYY @ hh:mm A")}.`,
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
                    "_id": `${this.storage.companyCode}-${dkt.Shipment}-${dkt.Suffix}-${DocketEvents.Arrival}- ${moment(new Date()).format("DD MMM YYYY @ hh:mm A")}`, // Safely accessing the ID
                    "cID": this.storage.companyCode,
                    "dKTNO": dkt.Shipment,
                    "sFX": 0,
                    "lOC": dkt.Origin,
                    "eVNID": DocketEvents.Booking,
                    "eVNDES": getEnumName(DocketEvents, DocketEvents.Booking),
                    "eVNDT": new Date(),
                    "eVNSRC": "Arrival Scan",
                    "dOCTY": "CN",
                    "dOCNO": dkt.Shipment,
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
            await firstValueFrom(this.operation.operationMongoPost("generic/create", reqEvent));

            if (isScan) {
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
            }
            const mfNo = dktList.map((x) => x.mfNo);
            const reqMf = {
                companyCode: this.storage.companyCode,
                collectionName: "mf_headers_ltl",
                filter: { mFNO: { "D$in": mfNo } },
                update: { iSDEL: false }
            }
            await firstValueFrom(this.operation.operationMongoPut("generic/updateAll", reqMf));
            const reqMfDet = {
                companyCode: this.storage.companyCode,
                collectionName: "mf_details_ltl",
                filter: { mFNO: { "D$in": mfNo } },
                update: { iSDEL: false }
            }
            await firstValueFrom(this.operation.operationMongoPut("generic/updateAll", reqMfDet));
        }
    }
    /*End*/
    /*below code is linked with the fieldMappingWithoutScanArrival function*/
    async gettingLastSuffix(data) {
        const req = {
            companyCode: this.storage.companyCode,
            collectionName: "docket_ops_det_ltl",
            filters: [
                {
                    D$match: {
                        dKTNO: { D$in: data.map(d => d.Shipment) }
                    }
                },
                {
                    D$lookup: {
                        from: "docket_invoices_ltl",
                        localField: "dKTNO",
                        foreignField: "dKTNO",
                        as: "InvoiceDetails"
                    }
                },
                {
                    D$unwind: {
                        path: "$InvoiceDetails",
                        preserveNullAndEmptyArrays: false
                    }
                },
                {
                    D$group: {
                        _id: "$dKTNO",
                        dKTNO: { D$first: "$dKTNO" },
                        eNTDT: { D$first: "$eNTDT" },
                        eNTLOC: { D$first: "$eNTLOC" },
                        eNTBY: { D$first: "$eNTBY" },
                        cLOC: { D$first: "$cLOC" },
                        vOL: { D$first: "$InvoiceDetails.vOL" },
                        Suffix: {
                            D$max: "$sFX"
                        }
                    }
                }
            ]
        }
        const res = await firstValueFrom(this.operation.operationMongoPost("generic/query", req));
        return res.data;
    }
    /*End*/
    /*procces Dockets for the destionation and instorck status update*/
    processDockets(shipments, getInvoice, status, stsmessage) {
        let batchOperations = [];
        /*below getInvoice varible is used for
               the getting height weight vol for the calucation of  CFT*/
        shipments.forEach(async element => {
            let dktLd = 0
            if (getInvoice && getInvoice.length > 0) {
                try {
                    let h = getInvoice.find((x) => x.dKTNO == element.shipment).vOL.h || 0;
                    let l = getInvoice.find((x) => x.dKTNO == element.shipment).vOL.l || 0;
                    let b = getInvoice.find((x) => x.dKTNO == element.shipment).vOL.b || 0;
                    let pkgs = element?.unloadedPkg || 0;
                    dktLd = convert(h).from('cm').to('ft') *
                        convert(l).from('cm').to('ft') *
                        convert(b).from('cm').to('ft') * parseInt(pkgs);
                }
                catch (err) {
                    console.log(err);
                }
            }
            const dockets = [`${element.Shipment}-${element.Suffix}`];
            const dktOps = {
                "aRR":{
                    dT: new Date(),
                    pKGS: element?.unloadedPkg || 0,
                    wT: element?.unloadedWT || 0
                },
                "pEND":{
                    pKGS: element?.unloadedPkg || 0,
                    wT: element?.unloadedWT || 0
                },
                "tOTCWT": element?.unloadctWeight || 0,
                "tOTWT": element?.unloadedWT || 0,
                "tOTPKG": element?.unloadedPkg || 0,
                "cHRWT": element?.unloadctWeight || 0,
                "aCTWT": element?.unloadedWT || 0,
                "pKGS": element?.unloadedPkg || 0,
                "cFTTOT": parseFloat(dktLd.toFixed(2)),
                "cLOC": this.storage.branch,
                "tHC": "",
                "lSNO": "",
                "mFNO": "",
                "sTS": status?.code,
                "sTSNM": status?.name,
                "sTSTM": new Date(),
                "oPSSTS": stsmessage,
                "mODDT": new Date(),
                "mODLOC": this.storage.branch,
                "mODBY": this.storage.userName
            }
            batchOperations.push({
                filter: { "D$expr": { "D$in": [{ "D$concat": ["$dKTNO", "-", { "D$toString": "$sFX" }] }, dockets] } },
                update: dktOps
            });
        });
        // Compensate for any rounding differences in the first docket
        //this.compensateRounding(thc, batchOperations[0]);

        return batchOperations;
    }
    /**/
    /*process Dockets */
    async updateBulk(operations) {
        let chunks = chunkArray(operations, 100);
        await Promise.all(
            chunks.map(async (chunk) => {
                const updateRequest = {
                    companyCode: this.storage.companyCode,
                    collectionName: "docket_ops_det_ltl",
                    data: chunk
                };
                return firstValueFrom(this.operation.operationMongoPut(GenericActions.UpdateBulk, updateRequest));
            })
        );
    }
    async deleteTrip(filter) {
        const req = {
            companyCode: this.storage.companyCode,
            collectionName: "trip_Route_Schedule",
            filter: filter
        }
        const res = await firstValueFrom(this.operation.operationMongoRemove("generic/remove", req));
        return res;
    }
}
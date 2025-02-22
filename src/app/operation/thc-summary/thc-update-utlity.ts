import moment from "moment";
import { firstValueFrom } from "rxjs";
import Swal from "sweetalert2";
import * as StorageService from 'src/app/core/service/storage.service';
import { StoreKeys } from "src/app/config/myconstants";
import { timeZone } from "src/app/Utility/date/date-utils";
//const apiService = new ApiService();
export async function showConfirmationDialogThc(data, tripId, operationService, podDetails, vehicleNo, currentLocation, containerwise,prqNo="") {
    const confirmationResult = await Swal.fire({
        icon: "success",
        title: "Confirmation",
        text: "Are You Sure About This?",
        showCancelButton: true,
        confirmButtonText: "Yes, proceed",
        cancelButtonText: "Cancel",
    });

    if (confirmationResult.isConfirmed) {
        const res = await updateThcStatus(data, tripId, operationService, podDetails, vehicleNo, currentLocation,containerwise,prqNo);
        return res
    }

}
async function updateThcStatus(data, tripId, operationService, podDetails, vehicleNo, currentLocation, containerwise,prqNo) {
    const updatePromises = podDetails.map(async (element) => {
        //Event = EVN0004: Delivered, EVN0005: Arrived
        //Status = 3: Delivered, 4: Arrived

        let mappedCity = [];
        if(currentLocation.mappedCity && Array.isArray(currentLocation.mappedCity)){ 
            mappedCity = currentLocation.mappedCity;
        }
        
        let eventId = (element.tCT.toUpperCase() === currentLocation.locCity.toUpperCase()
                    ||  mappedCity.some(c => c.toUpperCase() == element.tCT.toUpperCase() ))
                    ? "EVN0004" : "EVN0005";

        let sts = (eventId == "EVN0004") ? 3 : 4;
        let stsnm = (eventId == "EVN0004") ? "Delivered" : "Arrived";
        let opsts = (eventId == "EVN0004")
            ? `Delivered at  ${StorageService.getItem(StoreKeys.Branch)} on ${moment(new Date()).tz(timeZone).format('DD MMM YYYY @ HH:mm A')}`
            : `Arrived at ${StorageService.getItem(StoreKeys.Branch)} on ${moment(new Date()).tz(timeZone).format('DD MMM YYYY @ HH:mm A')}`;

        let filter = {
            tHC: tripId,
            dKTNO: element.docNo,
            sFX: element.sFX || 0,
        };
        if (containerwise) {
            filter["cNO"] = element.cNO;
        }

        const reqBody = {
            "companyCode": StorageService.getItem(StoreKeys.CompanyCode),
            "collectionName": "docket_ops_det",
            "filter": filter,
            "update": {
                "sTS": sts,
                "sTSNM": stsnm,
                "oPSSTS": opsts,
                "rMRK": element.remarks,
                "pOD": element.pod,
                "aRVTM": element.arrivalTime,
                "rBY": element.receiveBy,
                "aRRDT":data.aRR.aCTDT,
                "aRRPKG":element.pKGS,
                "aRRWT":element.aCTWT,
                "vEHNO":vehicleNo,
                "cLOC":StorageService.getItem(StoreKeys.Branch),
                "cCT": currentLocation.locCity.toUpperCase(),
                "dELPKG":sts==3?element.pKGS:0,
                "dELWT":sts==3?element.aCTWT:0,
                "iSDEL":sts==3?true:false,
                "dELDT":sts==3?new Date():new Date(),
                "dELRES":"",
                "dELPER":StorageService.getItem(StoreKeys.UserName),
                "tHC": ""
            }
        };

        const reqBodyDocketEvent = {
            "companyCode": StorageService.getItem(StoreKeys.CompanyCode),
            "collectionName": "docket_events",
            "data": {
                "_id": `${StorageService.getItem(StoreKeys.CompanyCode)}-${element.docNo}-${element.sFX}-${element.cNO}-${eventId}-${moment(element?.arrivalTime||new Date()).format('YYYYMMDD-HHmmss')}`,
                "cID": StorageService.getItem(StoreKeys.CompanyCode),
                "dKTNO": element.docNo,
                "sFX": element.sFX || 0,
                "cNO": element.cNO,
                "lOC":currentLocation?.locCity||"",
                "eVNID": eventId,
                "eVNDES": (eventId == "EVN0004") ? "Delivered" : "Arrived",
                "eVNDT": new Date(),
                "eVNSRC": "THC Arrival",
                "nLOC": null,
                "dOCTY": "THC",
                "dOCNO":tripId,
                "eTA": null,
                "sTS": sts,
                "sTSNM": stsnm,
                "oPSTS": opsts,
                "eNTDT": new Date(),
                "eNTLOC": StorageService.getItem(StoreKeys.Branch),
                "eNTBY":  StorageService.getItem(StoreKeys.UserName),
            }
        };

        // Update Docket Ops Det
        const FilterRequest = {
            "companyCode": StorageService.getItem(StoreKeys.CompanyCode),
            "collectionName": "docket_ops_det",
            "filters": [
                {
                    "D$match": {
                        "dKTNO": element.docNo
                    }
                },
                {
                    "D$group": {
                        "_id": null,
                        "Delivered": {
                            "D$sum": {
                                "D$cond": [
                                    {
                                        "D$eq": [
                                            "$sTS",
                                            3
                                        ]
                                    },
                                    1,
                                    0
                                ]
                            }
                        },
                        "Booked": {
                            "D$sum": {
                                "D$cond": [
                                    {
                                        "D$eq": [
                                            "$sTS",
                                            1
                                        ]
                                    },
                                    1,
                                    0
                                ]
                            }
                        },
                        "TotalCount": {
                            "D$sum": 1
                        }
                    }
                }
            ]
        };


        await firstValueFrom(operationService.operationMongoPost("generic/create", reqBodyDocketEvent));
        await firstValueFrom(operationService.operationMongoPut("generic/update", reqBody));

        const opsDetails: any = await firstValueFrom(operationService.operationMongoPost("generic/query", FilterRequest));
        if (opsDetails && opsDetails?.data && sts == 3) {
            if (opsDetails.data[0].TotalCount == opsDetails.data[0].Delivered) {
                const reqBody = {
                    "companyCode": StorageService.getItem(StoreKeys.CompanyCode),
                    "collectionName": "dockets",
                    "filter": {
                        "dKTNO": element.docNo
                    },
                    "update": {
                        "oSTS": 3,
                        "oSTSN": "Delivered"
                    }
                };

                await firstValueFrom(operationService.operationMongoPut("generic/update", reqBody));
                const prqReq = {
                    "companyCode": StorageService.getItem(StoreKeys.CompanyCode),
                    "collectionName": "prq_summary",
                    "filter": {
                        "pRQNO":prqNo
                    },
                    "update": {
                        "sTS": 8,
                        "sTSNM": "Delivered"
                    }
                };

                await firstValueFrom(operationService.operationMongoPut("generic/update", prqReq));
            } else {
                const reqBody = {
                    "companyCode": StorageService.getItem(StoreKeys.CompanyCode),
                    "collectionName": "dockets",
                    "filter": {
                        "dKTNO": element.docNo
                    },
                    "update": {
                        "oSTS": 5,
                        "oSTSN": "Partially Delivered"
                    }
                };

                await firstValueFrom(operationService.operationMongoPut("generic/update", reqBody));
                const prqReq = {
                    "companyCode": StorageService.getItem(StoreKeys.CompanyCode),
                    "collectionName": "prq_summary",
                    "filter": {
                        "pRQNO":prqNo
                    },
                    "update": {
                        "sTS": 9,
                        "sTSNM":"Partially Delivered"
                    }
                };

                await firstValueFrom(operationService.operationMongoPut("generic/update", prqReq));

            }
        }
        if (sts == 4) {
            const reqBody = {
                "companyCode": StorageService.getItem(StoreKeys.CompanyCode),
                "collectionName": "dockets",
                "filter": {
                    "dKTNO": element.docNo
                },
                "update": {
                    "oSTS": sts,
                    "oSTSN": stsnm
                }
            };
            await firstValueFrom(operationService.operationMongoPut("generic/update", reqBody));
        }
        return opsDetails;
    });
    // Wait for all pod updates to complete
    await Promise.all(updatePromises);

    const thcReqBody = {
        "companyCode": StorageService.getItem(StoreKeys.CompanyCode),
        "collectionName": "thc_summary",
        "filter": { docNo: tripId },
        "update": data
    };

    // Update THC summary
    const thcResult = await firstValueFrom(operationService.operationMongoPut("generic/update", thcReqBody));

    return thcResult;
}

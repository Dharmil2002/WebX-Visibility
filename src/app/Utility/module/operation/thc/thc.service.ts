import { Injectable } from "@angular/core";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { StorageService } from "src/app/core/service/storage.service";
import { Collections, GenericActions, OperationActions } from "src/app/config/myconstants";
import { financialYear } from "src/app/Utility/date/date-utils";
import { firstValueFrom } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class ThcService {
    constructor(
        private operationService: OperationService,
        private storage: StorageService
    ) { }

    async getShipmentFiltered(branch, prqNo = null, fromCity = null, toCity = null, DocketsContainersWise = false) {

        let filter = { oRGN: branch, oSTS: 1 }
        if ((prqNo && prqNo !== "")) {
            filter["pRQNO"] = prqNo;
        }
        if ((fromCity && fromCity !== "")) {
            filter["fCT"] = fromCity;
        }
        if ((toCity && toCity !== "")) {
            filter["tCT"] = toCity;
        }
        filter["iSCONT"] = DocketsContainersWise;

        const reqBody = {
            companyCode: this.storage.companyCode,
            collectionName: Collections.Dockets,
            filter: filter
        };
        // Perform an asynchronous operation to fetch data from the operation service
        const result = await firstValueFrom(this.operationService.operationMongoPost(GenericActions.Get, reqBody));
        const dockets = result.data.map((x) => x.dKTNO);
        const reqOpBody = {
            companyCode: this.storage.companyCode,
            collectionName: Collections.docketOp,
            filter: {
                sTS: 1,
                dKTNO: { D$in: dockets }, D$or: [
                    { tOTPKG: { D$gt: 0 } },
                    { tOTWT: { D$gt: 0 } }
                ]
            }
        };
        const dktDetail = await firstValueFrom(this.operationService.operationMongoPost(GenericActions.Get, reqOpBody));
        const createShipmentObject = (element, dkt) => {
            return {
                bPARTYNM: element.bPARTYNM,
                docNo: element.dKTNO,
                sFX: element?.sFX || 0,
                cNO: element?.cNO || "",
                fCT: element.fCT,
                tCT: element.tCT,
                aCTWT: dkt?.tOTWT || 0,
                pKGS: dkt?.tOTPKG || 0,
                pod: element?.pOD || "",
                receiveBy: element?.rCVBY || "",
                arrivalTime: element?.aRRTM || "",
                remarks: element?.rEMARKS || "",
                transitHours: element?.tRNHR || 0,
            };
        };
        const createShipmentObjectContainerWise = (ops, dkt) => {
            return {
                bPARTYNM: dkt.bPARTYNM,
                docNo: dkt.dKTNO,
                sFX: ops?.sFX || 0,
                cNO: ops?.cNO || "",
                fCT: dkt.fCT,
                tCT: dkt.tCT,
                aCTWT: ops?.tOTWT || 0,
                pKGS: ops?.tOTPKG || 0,
                pod: dkt?.pOD || "",
                receiveBy: dkt?.rCVBY || "",
                arrivalTime: dkt?.aRRTM || "",
                remarks: dkt?.rEMARKS || "",
                transitHours: dkt?.tRNHR || 0,
            };
        };
        let docketList;
        if (DocketsContainersWise) {
            docketList = dktDetail.data.map((element) => { //ops Data 
                const dkt = result.data.find((x) => x.dKTNO === element.dKTNO);  // Dockets Data
                return createShipmentObjectContainerWise(element, dkt);
            });
        } else {
            docketList = result.data.map((element) => {// Dockets Data
                const dkt = dktDetail.data.find((x) => x.dKTNO === element.dKTNO); //ops Data 
                return createShipmentObject(element, dkt);
            });
        }
        return docketList;
    }

    async getShipment(vehicle = false,filter = {}) {

        const reqBody = {
            companyCode: this.storage.companyCode,
            collectionName: Collections.Dockets,
            filter:filter
        };

        // Perform an asynchronous operation to fetch data from the operation service
        const result = await this.operationService.operationMongoPost(GenericActions.Get, reqBody).toPromise();

        // If the 'vehicle' flag is true, map the 'result' array to a new format
        // and return it; otherwise, return the 'result' array as is
        return vehicle ? result.data.map(x => ({ name: x.vehicleNo, value: x.vehicleNo })) : result.data;
    }
    async prqDetail(isDropDown, filter = {}) {
        //Need to default max date range, and 
        // const startDate = new Date();
        // startDate.setMonth(startDate.getMonth() - 1);
        // const endDate = new Date();

        const reqBody = {
            companyCode: this.storage.companyCode,
            collectionName: Collections.PrqDetails,
            filter: filter
        };

        // Perform an asynchronous operation to fetch data from the operation service
        const result = await this.operationService.operationMongoPost(GenericActions.Get, reqBody).toPromise();
        if (isDropDown) {
            // Added By Harikesh For Status Docket Confirmed For PRQ
            // Filter out entries with empty or falsy values in the 'prqNo' property
            const excludedStatusValues = [3];

            const filteredData = result.data.filter(x => x.docNo && excludedStatusValues.includes(Number(x.sTS)));

            // Map the filtered data to the desired format
            const mappedData = filteredData.map(x => ({ name: x.docNo.toString(), value: x.docNo.toString() }));

            return mappedData;
        }
        else {
            return result.data;
        }
    }

    async thcGeneration(data) {

        // Define the request body with companyCode, collectionName, and an empty filter
        const reqBody = {
            companyCode: this.storage.companyCode,
            collectionName: Collections.ThcDetails,
            data: data,
            docType: "TH",
            branch: this.storage.branch,
            finYear: financialYear
        };
        // Perform an asynchronous operation to fetch data from the operation service
        const result = await this.operationService.operationMongoPost(OperationActions.CreateThc, reqBody).toPromise();
        return result;
    }
    async getThcDetail() {

        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        const endDate = new Date();

        const reqBody = {
            companyCode: this.storage.companyCode,
            collectionName: Collections.thcsummary,
            filter: {} //{ tripDate: { $gte: startDate, $lte: endDate } }
        };

        // Perform an asynchronous operation to fetch data from the operation service
        const result = await this.operationService.operationMongoPost(GenericActions.Get, reqBody).toPromise();
        return result;
    }
    async getNestedDockDetail(shipments, isUpdate) {
        const reqBody = {
            companyCode: this.storage.companyCode,
            collectionName: Collections.docketOp,
            filter: {}
        };
        if (!isUpdate) {
            const promises = shipments.map(async (element) => {
                reqBody.filter = { dKTNO: element.docketNumber, sFX: 0 };
                let nestedDetail = await this.operationService.operationPost(GenericActions.Get, reqBody).toPromise();
                element.noOfPkg = nestedDetail.data[0]?.tOTPKG || 0;
                element.totWeight = nestedDetail.data[0]?.tOTWT || 0;
                element.orgNoOfPkg = nestedDetail.data[0]?.tOTPKG || 0;
                element.orgTotWeight = nestedDetail.data[0]?.tOTWT || 0;
                element.sFX = nestedDetail.data[0]?.sFX || 0;
                return element;
            });

            // Wait for all promises to resolve
            const updatedShipments = await Promise.all(promises);
            return updatedShipments;
        }
        else {
            const promises = shipments.map(async (element) => {
                reqBody.filter = { dKTNO: element.docketNumber };
                let nestedDetail = await this.operationService.operationPost(GenericActions.Get, reqBody).toPromise();
                const length = nestedDetail.data.length - 1;
                element.noOfPkg = nestedDetail.data[length]?.tOTPKG || 0;
                element.totWeight = nestedDetail.data[length]?.tOTWT || 0;
                element.orgNoOfPkg = nestedDetail.data[length]?.tOTPKG || 0;
                element.orgTotWeight = nestedDetail.data[length]?.tOTWT || 0;
                element.sFX = nestedDetail.data[length]?.sFX || 0;
                return element;
            });

            // Wait for all promises to resolve
            const updatedShipments = await Promise.all(promises);
            return updatedShipments;
        }
    }
    async getThcDetails(tripId) {

        const reqBody = {
            companyCode: this.storage.companyCode,
            collectionName: Collections.thcsummary,
            filter: { docNo: tripId }
        };
        let nestedDetail = await firstValueFrom(this.operationService.operationPost(OperationActions.getThc, reqBody));
        return nestedDetail;
    }
    async getThcMovemnetDetails(tripId) {

        const reqBody = {
            companyCode: this.storage.companyCode,
            collectionName: Collections.thc_movement,
            filter: { docNo: tripId }
        };
        let nestedDetail = await firstValueFrom(this.operationService.operationPost(GenericActions.Get, reqBody));
        return nestedDetail;
    }
    async newsthcGeneration(request) {
        // Perform an asynchronous operation to fetch data from the operation service
        const result = await this.operationService.operationMongoPost(OperationActions.CreateThc, request).toPromise();
        return result;
    }
    async getThcDetailsByNo(tripId) {
        const reqBody = {
            companyCode: this.storage.companyCode,
            collectionName: Collections.thc_summary_ltl,
            filter: { docNo: tripId }
        };
        let nestedDetail = await firstValueFrom(this.operationService.operationPost("generic/getOne", reqBody));
        return nestedDetail;
    }
}
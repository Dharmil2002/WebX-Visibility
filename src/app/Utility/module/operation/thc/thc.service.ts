import { Injectable } from "@angular/core";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { StorageService } from "src/app/core/service/storage.service";
import { Collections, GenericActions, OperationActions } from "src/app/config/myconstants";
import { financialYear } from "src/app/Utility/date/date-utils";
import { firstValueFrom } from "rxjs";
import { ConvertToNumber } from "src/app/Utility/commonFunction/common";
import moment from "moment";
import { DocketStatus } from "src/app/Models/docStatus";

@Injectable({
    providedIn: "root",
})
export class ThcService {
    constructor(
        private operationService: OperationService,
        private storage: StorageService
    ) { }

    async getShipmentFiltered(prqNo = null, fromCity = null, toCity = null, stockCity = "", fromDate = null, toDate = null, containersWise = false) {
        let matchQuery = {
            'D$and': [
                { sTS: { D$in: [1, 4] } },
                ...(fromDate ? [{ 'dKTDT': { 'D$gte': fromDate } }] : []),
                ...(toDate ? [{ 'dKTDT': { 'D$lte': toDate } }] : []),
                ...((prqNo && prqNo != "") ? [{ 'pRQNO': prqNo }] : []),
                ...((stockCity && stockCity != "") ? [{ 'cCT': stockCity }] : []),
                ...((fromCity && fromCity != "") ? [{ 'oCT': fromCity }] : []),
                ...((toCity && toCity != "") ? [{ 'dCT': toCity }] : []),
                ...(containersWise ? [{ 'cNO': { 'D$nin': ["", null] } }] : [{ 'cNO': { 'D$in': ["", null] } }]),
            ],
        };

        const reqBody = {
            companyCode: this.storage.companyCode,
            collectionName: Collections.docketOp,
            filters: [
                {
                    "D$match": matchQuery
                }, {
                    "D$lookup": {
                        "from": Collections.Dockets,
                        "let": { "dKTNO": "$dKTNO" },
                        "pipeline": [
                            {
                                "D$match": {
                                    "D$and": [
                                        { "D$expr": { "D$eq": ["$dKTNO", "$$dKTNO"] } },
                                        { "cNL": { "D$in": [false, null] } }
                                    ]
                                }
                            }
                        ],
                        "as": "docket"
                    }
                }, {
                    "D$unwind": { "path": "$docket", "preserveNullAndEmptyArrays": false }
                }
            ]
        };

        const res = await firstValueFrom(this.operationService.operationMongoPost("generic/query", reqBody));
        const createShipmentObjectContainerWise = (ops) => {
            return {
                bPARTYNM: ops.docket.bPARTYNM,
                docNo: ops.dKTNO,
                sFX: ops?.sFX || 0,
                cNO: ops?.cNO,
                fCT: ops.oCT || ops.docket.fCT || "",
                tCT: ops.dCT || ops.docket.tCT || "",
                aCTWT: ops?.tOTWT || 0,
                pKGS: ops?.tOTPKG || 0,
                pod: ops.docket?.pOD || "",
                receiveBy: ops?.rCVBY || "",
                arrivalTime: ops?.aRRTM || "",
                remarks: ops?.rEMARKS || "",
                transitHours: ops?.tRNHR || 0,
            };
        };

        let docketList = res.data.map((ops) => {
            return createShipmentObjectContainerWise(ops);
        });

        return docketList || [];
    }

    async getShipment(vehicle = false, filter = {}) {

        const reqBody = {
            companyCode: this.storage.companyCode,
            collectionName: Collections.Dockets,
            filter: filter
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

    async getLocationDetail(locCode) {
        var locBody = {
            companyCode: this.storage.companyCode,
            collectionName: "location_detail",
            filter: {
                companyCode: this.storage.companyCode,
                locCode: locCode
            }
        }
        const locRes = await firstValueFrom(this.operationService.operationMongoPost(GenericActions.GetOne, locBody));
        return locRes.data;
    }

    async getThcDetail(filter = null) {

        // const startDate = new Date();
        // startDate.setMonth(startDate.getMonth() - 1);
        // const endDate = new Date();

        const reqBody = {
            companyCode: this.storage.companyCode,
            collectionName: Collections.thcsummary,
            filter: filter || {}
        };

        // Perform an asynchronous operation to fetch data from the operation service
        const result = await firstValueFrom(this.operationService.operationMongoPost(GenericActions.Get, reqBody));
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
        const result = await firstValueFrom(this.operationService.operationMongoPost(OperationActions.CreateThc, request));
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
    /*get Charges are come from product Charged master*/
    async getCharges(filter = {}) {
        const req = {
            companyCode: this.storage.companyCode,
            collectionName: "product_charges_detail",
            filter: filter
        };
        const res = await firstValueFrom(this.operationService.operationPost("generic/get", req));
        return res.data;
    }
    /*end*/
    async getChargesV2(filter, productFilter) {
        const devShardReq = {
            companyCode: this.storage.companyCode,
            filter: filter,
            collectionName: "charges",
        }
        const devShardRes = await firstValueFrom(this.operationService.operationMongoPost("generic/get", devShardReq));
        const TenantShardreq = {
            companyCode: this.storage.companyCode,
            collectionName: "product_charges_detail",
            filter: productFilter
        };
        const TenantShardres = await firstValueFrom(this.operationService.operationPost("generic/get", TenantShardreq));

        if (TenantShardres.success) {
            const retArry = TenantShardres.data.map(r => {
                let ch = devShardRes.data.find(f => f.cHCD === r.cHACD);
                if (ch) {
                    return r
                }
            }).filter(Boolean);;
            //console.log(retArry)
            return retArry
        }

        //console.log('null');
        return null
    }
    /*end*/
    /*below function is for the update a shipment*/
    async updateVehicle(data,filter) {
        const req = {
            companyCode: this.storage.companyCode,
            collectionName: "vehicle_status",
            filter: filter,
            update: data
        }
        return await firstValueFrom(this.operationService.operationMongoPut(GenericActions.Update, req));
    }
    /*end*/
    async updateThcLTL(data,filter){
        const req = {
            companyCode: this.storage.companyCode,
            collectionName: "thc_summary_ltl",
            filter: filter,
            update: data
        }
        return await firstValueFrom(this.operationService.operationMongoPut(GenericActions.Update, req));
   }

   async updateTHC(filter, data) {

    const req = {
      companyCode: this.storage.companyCode,
      collectionName: "thc_summary",
      filter: filter,
      update: data
    }
    const res = await firstValueFrom(this.operationService.operationMongoPut("generic/update", req));
    return res
  }

  async getDocketDetails(filter){
    const req={
      companyCode:this.storage.companyCode,
      collectionName:"docket_ops_det",
      filter:filter
    }
    const res= await firstValueFrom(this.operationService.operationMongoPost('generic/get', req));
    return res.data;
  }
  
  async updateDocket(data) {
    const dockets=await this.getDocketDetails({cID:this.storage.companyCode,tHC:data.docNo});
    if(dockets && dockets.length>0){
      dockets.forEach(async (x)=>{
    let evnData = {
      _id: `${this.storage.companyCode}-${x.dKTNO}-0-EVN0001-${moment(new Date()).format('YYYYMMDDHHmmss')}`,
      cID: this.storage.companyCode,
      dKTNO: x?.dKTNO || "",
      sFX: 0,
      lOC: this.storage.branch,
      eVNID: 'EVN0001',
      eVNDES: 'Booking',
      eVNDT: new Date(),
      eVNSRC: 'Booking',
      dOCTY: 'CN',
      dOCNO: x?.dKTNO || "",
      sTS: DocketStatus.Booked,
      sTSNM: DocketStatus[DocketStatus.Booked],
      oPSSTS: `Booked at ${x?.oRGN} on ${moment(new Date()).format("DD MMM YYYY @ hh:mm A")}`,
      eNTDT: x?.eNTDT,
      eNTLOC: x?.eNTLOC || "",
      eNTBY: x?.eNTBY || ""
    }
    let reqEvent = {
      companyCode: this.storage.companyCode,
      collectionName: "docket_events",
      data: evnData
    };
    await firstValueFrom(this.operationService.operationMongoPost('generic/create', reqEvent));
    let reqBody = {
      companyCode: this.storage.companyCode,
      collectionName: "docket_ops_det",
      filter:{dKTNO:x.dKTNO},
      update:{
        sTS: DocketStatus.Booked,
        sTSNM: DocketStatus[DocketStatus.Booked],
        mODDT:new Date(),
        mODBY:this.storage.userName,
        tHC:null,
        mF:null,
        mODLOC:this.storage.branch,
        oPSSTS:`Booked at ${x?.oRGN} on ${moment(new Date()).tz(this.storage.timeZone).format('DD MMM YYYY @ hh:mm A')}.`,
    }
    }
    await firstValueFrom(this.operationService.operationMongoPut('generic/update', reqBody));
  });
 
  }
  }
  
}
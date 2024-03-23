import { Injectable } from "@angular/core";
import moment from "moment";
import { firstValueFrom } from "rxjs";
import { getNextLocation } from "src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction";
import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";
import { ConvertToDate, ConvertToNumber } from "src/app/Utility/commonFunction/common";
import { Collections, GenericActions } from "src/app/config/myconstants";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { StorageService } from "src/app/core/service/storage.service";
import Swal from "sweetalert2";
import { VendorService } from "../../masters/vendor-master/vendor.service";
import { DocketEvents, DocketStatus, VehicleStatus, getEnumName } from "src/app/Models/docStatus";

@Injectable({
  providedIn: "root"
})
export class DepartureService {
  statusActions = {
    "1": "Create Trip",
    "2": "Vehicle Loading",
    "3": "Depart Vehicle",
    //"4": "Mark Arrival",
    "6": "Update Trip",
    "7": "Create Trip",
    "default": [""]
  };

  constructor(
    private operation: OperationService,
    private storage: StorageService,
    private vendor:VendorService
  ) {
  }
  async getRouteSchedule() {    
    try {
      // Fetching route data based on company code and branch location
      const routeData = await this.fetchData(Collections.trip_Route_Schedule, { cLOC: this.storage.branch,iSACT:true });
      // Mapping route data to create departure details
      const departureDetails = routeData.map(element => ({
        id: element?._id || "", // Safely accessing the ID
        RouteandSchedule: `${element.rUTCD}:${element.rUTNM}`, // Concatenating route code and name
        VehicleNo: element?.vEHNO || "", // Accessing vehicle number
        TripID: element?.tHC || "", // Matching THC record based on route code
        Scheduled: formatDocketDate(new Date().toISOString()), // Formatting current date as scheduled date
        Expected: formatDocketDate(new Date(new Date().getTime() + 10 * 60000).toISOString()), // Formatting expected date (10 mins from now)
        Hrs: this.computeHoursDifference(new Date(), new Date(new Date().getTime() + 10 * 60000)).toFixed(2), // Calculating the time difference in hours
        status:element.sTS,
        Action: this.statusActions[`${element.sTS}`], // Deciding action based on THC availability
        location: element?.cLOC || "", // Accessing location
      }));
      return departureDetails;
      // Use departureDetails as needed
    } catch (error) {
      // Handle any errors that occur during the fetching process
    }
  }
  // Generic function to fetch data from a given collection with a specified filter
  async fetchData(collectionName, filter) {
    const req = {
      companyCode: this.storage.companyCode,
      collectionName: collectionName,
      filter: filter
    };
    const { data } = await firstValueFrom(this.operation.operationPost(GenericActions.Get, req));
    return data;
  }
  // Utility function to compute the difference in hours between two dates
  computeHoursDifference(startDate, endDate) {
    return (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60); // Convert milliseconds to hours
  }
  async getFieldDepartureMapping(data, shipment) {
    
    const vendorCode=await this.vendor.getVendorDetail(data?.Vendor);
    const dktNoList = shipment?shipment.map((x) => x.dKTNO):[];
    const dktSfx=shipment?shipment.map((x)=>`${x.dKTNO}-${x.sFX}`):[];
    let eventJson = dktNoList;
    const origin = data.Route.split(":")[1].split("-")[0];
    const next = getNextLocation(data.Route.split(":")[1].split("-"), this.storage.branch);
    const legID = `${this.storage.companyCode}-${data.tripID}-${this.storage.branch}-${next}`;
    const getLeg = {
      companyCode: this.storage.companyCode,
      collectionName: "thc_movement_ltl",
      filter: { _id: legID},      
    }
    let isLegExist = false;
    let thc_movment = await firstValueFrom(this.operation.operationMongoPost("generic/getOne", getLeg));    
    let legData = thc_movment.data;    
    isLegExist = (legData?._id == legID);

    let thcSummary = {};    
    if(this.storage.branch == origin) 
    {
      thcSummary = {
        "tHCDT": new Date(),
        "vND": {
          "tY": vendorCode[0]?.vendorType || "",
          "tYNM": data?.VendorType || "",
          "cD":vendorCode[0]?.vendorCode || "",
          "nM": data?.Vendor || "",
          "pAN": vendorCode[0]?.panNo || "",
        },
        "oPSST": 1,
        "oPSSTNM": "In Transit",
        "fINST": 0,
        "fINSTNM": "",
        "cONTAMT": ConvertToNumber(data?.ContractAmt || 0, 2),
        "aDVPENAMT": 0,
        "aDVAMT": ConvertToNumber(data?.TotalAdv || 0, 2),
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
        "cHG":data?.cHG||0,
        "tOTAMT":ConvertToNumber(data?.TotalTripAmt||0,2),
        "aDV": {
          "aAMT": ConvertToNumber(data?.Advance || 0, 2),
          "pCASH": ConvertToNumber(data?.PaidByCash || 0, 2),
          "pBANK": ConvertToNumber(data?.PaidbyBank || 0, 2),
          "pFUEL": ConvertToNumber(data?.PaidbyFuel || 0, 2),
          "pCARD": ConvertToNumber(data?.PaidbyCard || 0, 2),
          "tOTAMT": ConvertToNumber(data?.TotalAdv || 0, 2)
        },
        "bALAMT": data?.BalanceAmt || 0,
        "aDPAYAT": "",
        "bLPAYAT": "",
        "iSBILLED": false,
        "bILLNO": "",
        "dRV": {
          "nM": data?.Driver || "",
          "mNO": data?.DriverMob || "",
          "lNO": data?.License || "",
          "lEDT": ConvertToDate(data?.Expiry)
        },
        "fLOC": this.storage.branch,
        "tLOC": next,
        "dPT": {          
          "sCHDT": ConvertToDate(data?.DeptartureTime),
          "eXPDT": ConvertToDate(data?.DeptartureTime),
          "aCTDT": ConvertToDate(data?.DeptartureTime),
          "oDOMT": 0,
          "cEWB": data?.Cewb || ""
        },
        "aRR": {
          "sCHDT":null,
          "eXPDT":null,
          "aCTDT":null,          
          "kM": "",
          "aCRBY": "",
          "aRBY": ""
        },
        "sCHDIST": 0,
        "aCTDIST": 0,
        "gPSDIST": 0,
        "mODDT": new Date(),
        "mODLOC": this.storage.branch,
        "mODBY": this.storage.userName
      }
    }
    else {
      thcSummary = {
        "oPSST": 1,
        "oPSSTNM": "In Transit",
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
        "fLOC": this.storage.branch,
        "tLOC": next,   
        "mODDT": new Date(),
        "mODLOC": this.storage.branch,
        "mODBY": this.storage.userName    
      }
    }
    
    const tsReq = {
      companyCode: this.storage.companyCode,
      collectionName: "thc_summary_ltl",
      filter: { _id: `${this.storage.companyCode}-${data.tripID}`},
      update: thcSummary
    }
    await firstValueFrom(this.operation.operationMongoPut("generic/updateAll", tsReq));
    
    let loadedWT = shipment?shipment.reduce((a, c) => { return a + c.lDWT; }, 0) || 0:0; 
    let loadedVol = shipment?shipment.reduce((a, c) => { return a + c.lDVOL; }, 0) || 0:0;

    if(!isLegExist) {            
      legData = {
        "_id": legID,
        "tHC": data.tripID,
        "cID": this.storage.companyCode,
        "fLOC": this.storage.branch || "",
        "tLOC": next || "",
        "lOAD": {
          "dKTS":shipment?shipment.filter(f => f.lDPKG > 0).length || 0:0,
          "pKGS":shipment?shipment.reduce((a, c) => { return a + c.lDPKG; }, 0) ||0:0,
          "wT": loadedWT || 0, 
          "vOL": loadedVol || 0,
          "vWT": 0,
          "rMK": "",
          "sEALNO": data?.DepartureSeal || "",
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
          "sCHDT": ConvertToDate(data?.DeptartureTime),
          "eXPDT": ConvertToDate(data?.DeptartureTime),
          "aCTDT": ConvertToDate(data?.DeptartureTime),
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
    }
    else {
      legData = {
        "lOAD": {
          "dKTS":shipment? shipment.filter(f => f.lDPKG > 0).length || 0:0,
          "pKGS":shipment?shipment.reduce((a, c) => { return a + c.lDPKG; }, 0) || 0:0,
          "wT": loadedWT || 0, 
          "vOL": loadedVol || 0,
          "vWT": 0,
          "rMK": "",
          "sEALNO": data?.DepartureSeal || "",
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
          "sCHDT": ConvertToDate(data?.DeptartureTime),
          "eXPDT": ConvertToDate(data?.DeptartureTime),
          "aCTDT": ConvertToDate(data?.DeptartureTime),
          "gPSDT": null,         
          "oDOMT": 0
        },
        "mODDT": new Date(),
        "mODLOC": this.storage.branch,
        "mODBY": this.storage.userName
      }
    }

    if(isLegExist) {
      const reqthc = {
        companyCode: this.storage.companyCode,
        collectionName: "thc_movement_ltl",
        filter: { _id: legID },
        update: legData
      }  
      await firstValueFrom(this.operation.operationMongoPut("generic/updateAll", reqthc));
    }
    else {
      const reqthc = {
        companyCode: this.storage.companyCode,
        collectionName: "thc_movement_ltl",        
        data: legData
      }  
      await firstValueFrom(this.operation.operationMongoPost("generic/create", reqthc));
    }
  
    const tripDetails = {
      sTS:VehicleStatus.Departed,
      sTSNM:VehicleStatus[VehicleStatus.Departed],      
      nXTLOC: next
    }

    const reqDepart = {
      companyCode: this.storage.companyCode,
      collectionName: "trip_Route_Schedule",
      filter:{tHC: data.tripID, rUTCD: data.Route.split(":")[0]},
      update: tripDetails
    }
    await firstValueFrom(this.operation.operationMongoPut("generic/update", reqDepart));
    if (dktNoList.length > 0) {
      eventJson = dktNoList.map((element,index) => {
        const evn = {
          "_id": `${this.storage.companyCode}-${element}-${index}-${DocketEvents.Departure}-${moment(new Date()).format('YYYYMMDDHHmmss')}`, // Safely accessing the ID
          "cID": this.storage.companyCode,
          "dKTNO": element,
          "sFX": 0,
          "lOC": this.storage.branch,
          "eVNID": DocketEvents.Departure,
          "eVNDES": getEnumName(DocketEvents, DocketEvents.Departure),
          "eVNDT": new Date(),
          "eVNSRC": "Depart Vehicle",
          "dOCTY": "TH",
          "dOCNO": data?.tripID || "",
          "sTS":DocketStatus.Departed,
          "sTSNM":DocketStatus[DocketStatus.Departed],
          "oPSSTS": `Departed from ${this.storage.branch} to ${next} with THC ${data.tripID} on ${moment(new Date()).tz(this.storage.timeZone).format("DD MMM YYYY @ hh:mm A")}.`,
          "eNTDT": new Date(),
          "eNTLOC": this.storage.branch,
          "eNTBY": this.storage.userName
        }
        return evn
      });
      const reqEvent = {
        companyCode: this.storage.companyCode,
        collectionName: "docket_events_ltl",
        data:eventJson
      }
      await firstValueFrom(this.operation.operationMongoPost("generic/create", reqEvent));
     
      const reqDktOpsDepart={
        companyCode: this.storage.companyCode,
        collectionName:"docket_ops_det_ltl",
        filter: { "D$expr": { "D$in": [{ "D$concat": ["$dKTNO", "-", { "D$toString": "$sFX" }] }, dktSfx] } },
        update:{
        "sTS":DocketStatus.Departed,
        "sTSNM":DocketStatus[DocketStatus.Departed],
        "oPSSTS":`Departed From ${this.storage.branch} on ${moment(new Date()).tz(this.storage.timeZone).format("DD MMM YYYY @ hh:mm A")}`,
        "mODBY":this.storage.userName,
        "mODDT":new Date(),
        "mODLOC":this.storage.branch}
      }
      await firstValueFrom(this.operation.operationMongoPut("generic/updateAll",reqDktOpsDepart));
    }
    Swal.fire({
      icon: "info",
      title: "Departure",
      text: "Vehicle to " + next + " is about to depart.",
      confirmButtonText: "OK",
    });
    return data.tripID;
  }
}
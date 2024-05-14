import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';

@Injectable({
  providedIn: 'root'
})
export class RouteLocationService {
routeCode={
  "Road":"R9888",
  "Rail":"R8888",
  "Air":"R7777"

}
  constructor(private masterService: MasterService, private storage: StorageService) { }
  //#region to get route dropdown
  async getRouteLocationDetail(): Promise<any[]> {
    try {
      // Prepare the request object
      const request = {
        // Get the company code from local storage
        companyCode: this.storage.companyCode,
        // Specify the collection name for route master locations
        collectionName: 'routeMasterLocWise',
        // Use an empty filter
        filter: {companyCode: this.storage.companyCode}
      };

      // Send a POST request to the 'generic/get' endpoint using the masterService
      const response = await firstValueFrom(this.masterService.masterPost('generic/get', request));
      // Process the data and create an array of route details
      const routeDet = response.data
        .filter(item => item.routeName !== "" && item.routeName !== undefined)
        .map(item => ({
          name: item.routeName,
          value: item.routeId || ""
        }));

      return routeDet;
    } catch (error) {
      // Handle errors, e.g., log them or throw a custom error
      console.error('Error in getRouteLocationDetail:', error);
      throw error; // Rethrow the error for the calling code to handle
    }
  }
  //#endregion
  //#below function is used for the check the Route is already exist or not
  async getRouteOne(filter){
    const req = {
      companyCode: this.storage.companyCode,
      collectionName: "routeMasterLocWise",
      filter: filter
    }
    const res = await firstValueFrom(this.masterService.masterPost('generic/getOne', req));
    return res && Object.keys(res.data).length > 0 ? res.data : null;
  }
  //#endregion
  //#region to below function is used for the save the route
  async addRouteLocation(data) {
     try {
    let routeData = [];
    const route = data?.route.split("-");
    if (route && route.length > 0) {
      route.forEach(element => {
        routeData.push({
          loccd: element,
          distKm: 0,
          trtimeHr: data?.transitHrs || "",
          sttimeHr: 0,
          speedHeavyVeh: 0,
          speedLightVeh: 0,
          nightDrivingRestricted: 0,
          restrictedHoursFrom: 0,
          restrictedHoursTo: 0
        })
      });
    }
    const dataRoute = {
      "_id": `${this.storage.companyCode}-${this.routeCode[data.routeMode]}-${data?.route || ""}`,
      "routeId": this.routeCode[data.routeMode],
      "routeMode": data.routeMode,
      "routeCat": "LONG HAUL",
      "routeKm": 0,
      "departureTime": new Date(),
      "controlLoc": this.storage.branch,
      "routeType": "One Way",
      "scheduleType": "Once in Week",
      "isActive": true,
      "entryBy": this.storage.userName,
      "companyCode": this.storage.companyCode,
      "cID": this.storage.companyCode,
      "routeName": data?.route,
      "aDHOC":true,
      "eNTDT": new Date(),
      "eNTLOC": this.storage.branch,
      "eNTBY": this.storage.userName
    }
    const reqRoute = {
      companyCode: this.storage.companyCode,
      collectionName: "routeMasterLocWise",
      data: dataRoute
    }
    await firstValueFrom(this.masterService.masterPost('generic/create', reqRoute));
    const trip = {
      "_id": `${this.storage.companyCode}-${this.routeCode[data.routeMode]}-${data?.route || ""}`,
      "cID": this.storage.companyCode,
      "tHC": "",
      "rUTCD": this.routeCode[data.routeMode],
      "rUTNM": data?.route || "",
      "sTM": new Date(),
      "cTM": "",
      "vEHNO": "",
      "sTS": 1,
      "sTSNM": "Route Added",
      "cLOC": this.storage.branch,
      "oRG": this.storage.branch,
      "iSACT": true,
      "dEST": "",
      "nXTLOC": "",
      "nXTETA": "",
      "eNTDT": new Date(),
      "eNTLOC": this.storage.branch,
      "eNTBY": this.storage.userName,
      "lSNO": "",
      "mFNO": ""
    }
    const tripReq = {
      companyCode: this.storage.companyCode,
      collectionName: "trip_Route_Schedule",
      data: trip
    }
    await firstValueFrom(this.masterService.masterPost('generic/create', tripReq));
    return {
      routeCat: "LONG HAUL",
      contBranch: this.storage.branch,
      scheduleTime:new Date(),
      routeType:"One Way",
      ScheduleType:"once in Week"
    };
  }
  catch(err){
    return false
  }
  }
  //#endregion
}
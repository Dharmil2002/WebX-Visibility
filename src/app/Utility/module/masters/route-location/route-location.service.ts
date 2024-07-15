import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';

@Injectable({
  providedIn: 'root'
})
export class RouteLocationService {
  routeCode = {
    "Road": "R9888",
    "Rail": "R8888",
    "Air": "R7777"

  }
  routeCodeMaster={
      "ROAD": "R0000",
      "RAIL": "T0000",
      "AIR":"A0000"
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
        filter: { companyCode: this.storage.companyCode }
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
  async getRouteOne(filter) {
    const companyCode = this.storage.companyCode;
    const getRequest = async (collectionName) => {
        const response = await this.masterService.masterPost('generic/getOne', { companyCode, collectionName, filter });
        return firstValueFrom(response);
    };
    try {
        const resRoute = await getRequest("routeMasterLocWise");
        const resAdHoc = await getRequest("adhoc_routes");
        const merge = { ...resRoute?.data, ...resAdHoc?.data };
        return Object.keys(merge).length > 0 ? merge : null;
    } catch (error) {
        console.error("Error fetching route data:", error);
        return null;
    }
}
  //#region to below function is used for the save the route
  async addRouteLocation(data,tableData) {
    debugger
    const routeDetails=[]
    if(tableData && tableData.length>0){
      tableData.forEach(element => {
        routeDetails.push({
          "lOCCD": element?.loc||"",
          "dTKM":element?.distance||"",
          "tRNHR":element?.transitHrs||0,
          "sTHR":0 ,
          "sPHVEH": 0,
          "SPLVEH":0,
          "nGTRES":0,
          "rHRFRM":0,
          "rHRTO": 0
        })
      });
     
    }
          // Summing the dTKM and tRNHR values, converting to numbers if necessary
      const totals = routeDetails.reduce((acc, route) => {
        const distance = parseFloat(route.dTKM) || 0; // Convert to number or use 0 if NaN
        const transitHours = parseFloat(route.tRNHR) || 0; // Convert to number or use 0 if NaN
        return {
          totalDistance: acc.totalDistance + distance,
          totalTransitHours: acc.totalTransitHours + transitHours
        };
      }, { totalDistance: 0, totalTransitHours: 0 });

    try {
      const dataRoute =
      {
        "_id": `${this.storage.companyCode}-${this.routeCode[data.routeMode]}-${data?.route || ""}`,
        "rUTCD": this.routeCode[data.routeMode],
        "rUTNM": data?.route,
        "rUTMODE": data.routeMode,
        "rUTCT": "LONG HAUL",
        "rUTKM": totals.totalDistance, // Assigning the total distance here
        "rUTHR": totals.totalTransitHours, // Assigning the total transit hours here
        "dPTM": null,
        "rUTDET": routeDetails,
        "cLOC": this.storage.branch,
        "rUTTYP": "Once in Week",
        "sDTYPE": "Daily",
        "iSACT": true,
        "eNTDT": new Date(),
        "eNTLOC": this.storage.branch,
        "eNTBY": this.storage.userName,
        "cID": this.storage.companyCode
      }
      const reqRoute = {
        companyCode: this.storage.companyCode,
        collectionName: "adhoc_routes",
        data: dataRoute
      }
      await firstValueFrom(this.masterService.masterPost('generic/create', reqRoute));
      return {
        routeCat: "LONG HAUL",
        contBranch: this.storage.branch,
        scheduleTime: new Date(),
        routeType: "One Way",
        ScheduleType: "once in Week"
      };
    }
    catch (err) {
      return false
    }
  }
  //#endregion
}
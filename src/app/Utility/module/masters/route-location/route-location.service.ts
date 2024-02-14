import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';

@Injectable({
  providedIn: 'root'
})
export class RouteLocationService {

  constructor(private masterService: MasterService,) { }
  //#region to get route dropdown
  async getRouteLocationDetail(): Promise<any[]> {
    try {
      // Prepare the request object
      const request = {
        // Get the company code from local storage
        companyCode: localStorage.getItem("companyCode"),
        // Specify the collection name for route master locations
        collectionName: 'routeMasterLocWise',
        // Use an empty filter
        filter: {companyCode: parseInt(localStorage.getItem("companyCode"))}
      };

      // Send a POST request to the 'generic/get' endpoint using the masterService
      const response = await firstValueFrom(this.masterService.masterPost('generic/get', request));
      // Process the data and create an array of route details
      const routeDet = response.data.map(item => {
        // Create a name by joining the loccd values with commas
        const name = item?.routeName||"";
        const value = item?.routeId||"";

        return {
          name,
          value
        };
      });

      return routeDet;
    } catch (error) {
      // Handle errors, e.g., log them or throw a custom error
      console.error('Error in getRouteLocationDetail:', error);
      throw error; // Rethrow the error for the calling code to handle
    }
  }
  //#endregion
}
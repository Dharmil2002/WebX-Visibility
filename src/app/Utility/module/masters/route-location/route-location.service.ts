import { Injectable } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';

@Injectable({
  providedIn: 'root'
})
export class RouteLocationService {

  constructor(private masterService: MasterService,) { }

  async getRouteLocationDetail() {
    // Prepare the request object
    const request = {
      // Get the company code from local storage
      companyCode: localStorage.getItem("companyCode"),
      // Specify the collection name for route master locations
      collectionName: 'routeMasterLocWise',
      // Use an empty filter
      filter: {}
    };

    // Send a POST request to the 'generic/get' endpoint using the masterService
    const response = await this.masterService.masterPost('generic/get', request).toPromise();

    // Process the data and create an array of route details
    const routeDet = response.data.map((item, index, array) => {
      const currentLocation = item.GSTdetails[0].loccd;
      const nextLocation = (index < array.length - 1) ? array[index + 1].GSTdetails[0].loccd : '';
      const name = `${currentLocation} - ${nextLocation}`;
      const value = item.routeId;

      return {
        name,
        value
      };
    });

    // Return the processed route details
    return routeDet;
  }

}

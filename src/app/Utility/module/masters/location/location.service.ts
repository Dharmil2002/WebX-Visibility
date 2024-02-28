import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";

@Injectable({
  providedIn: "root",
})
export class LocationService {
  constructor(private masterService: MasterService) { }

  // This async function retrieves location data from an API using the masterService.
  async locationFromApi(filter = {}) {
    // Prepare the request body with necessary parameters
    const reqBody = {
      companyCode: localStorage.getItem("companyCode"), // Get company code from local storage
      collectionName: "location_detail",
      filter: filter, // You can specify additional filters here if needed
    };

    try {
      // Make an asynchronous request to the API using masterMongoPost method
      const res = await firstValueFrom(this.masterService
        .masterMongoPost("generic/get", reqBody));

      // Map the response data to a more usable format
      const filterMap =
        res?.data?.map((x) => ({
          value: `${x.locCode}`,
          name: `${x.locCode}`,
          city: x.locCity,
          state: x.locState,
          locLevel:x.locLevel,
          locCity: x.locCity
        })) ?? null;

      // Sort the mapped data in ascending order by location name
      return filterMap.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      // Handle any errors that occur during the API request
      console.error("An error occurred:", error);
      return null; // Return null to indicate an error occurred
    }
  }
  async setCityLocationInForm(form, city, locationData) {

    const cityLocation = locationData.find(x => x.city === city);
    if (cityLocation) {
      form.setValue(cityLocation);
    }
  }
  //#region to get location data
  async getLocationList(): Promise<any[] | null> {
    // Prepare the request body with necessary parameters
    const reqBody = {
      companyCode: localStorage.getItem('companyCode'), // Get company code from local storage
      collectionName: 'location_detail',
      filter: {},
    };

    try {
      // Make an asynchronous request to the API using masterMongoPost method
      const res = await this.masterService.masterMongoPost('generic/get', reqBody).toPromise();

      // Map the response data to a more usable format
      const filterMap = res?.data.filter((item) => item.activeFlag) // Filter based on the activeFlag property
        .map((location) => ({
          value: location.locCode,
          name: location.locName,
        }));

      // Sort the mapped data in ascending order by location name
      return filterMap.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      // Handle any errors that occur during the API request
      console.error('An error occurred:', error);
      throw new Error('Failed to fetch location list'); // Throw a custom error or return null to indicate an error occurred
    }
  }
  //#endregion
}

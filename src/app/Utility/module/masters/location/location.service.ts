import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";

@Injectable({
  providedIn: "root",
})
export class LocationService {
  constructor(private masterService: MasterService, private storage: StorageService) { }

  // This async function retrieves location data from an API using the masterService.
  async locationFromApi(filter = {}) {
    filter = { ...filter, activeFlag: true }; // Add activeFlag filter to the request
    // Prepare the request body with necessary parameters
    const reqBody = {
      companyCode: this.storage.companyCode, // Get company code from local storage
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
          locCity: x.locCity,
          pincode:x.locPincode,
          extraData:x
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
  async getLocationList(nameWithCode = false): Promise<any[] | null> {
    // Prepare the request body with necessary parameters
    const reqBody = {
      companyCode: this.storage.companyCode, // Get company code from local storage
      collectionName: 'location_detail',
      filter: {activeFlag: true },
    };

    try {
      // Make an asynchronous request to the API using masterMongoPost method
      const res = await this.masterService.masterMongoPost('generic/get', reqBody).toPromise();

      // Map the response data to a more usable format
      const filterMap = res?.data.filter((item) => item.activeFlag) // Filter based on the activeFlag property
        .map((location) => ({
          value: location.locCode,
          name: nameWithCode ? `${location.locCode} : ${location.locName}`: location.locName,
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

  async getLocation(filter): Promise<any | null> {
    const reqBody = {
      companyCode: this.storage.companyCode, // Get company code from local storage
      collectionName: 'location_detail',
      filter: filter
    };

    var res = await firstValueFrom(this.masterService.masterMongoPost('generic/getOne', reqBody));    
    return res.data;
  }

  async getLocations(filter, project = null): Promise<any | null> {

    let filters= [];
    filters.push({ 
      D$match: filter
    });

    if(project) {
      filters.push({ 'D$project': project });
    }

    const reqBody = {
      companyCode: this.storage.companyCode, // Get company code from local storage
      collectionName: 'location_detail',
      filters: filters
    };

    var res = await firstValueFrom(this.masterService.masterMongoPost('generic/query', reqBody));    
    return res?.data || [];
  }

  async findAllDescendants(reportLoc): Promise<any[] | null> {
    const reqBody = {
      companyCode: this.storage.companyCode, // Get company code from local storage
      collectionName: 'location_detail',
      filter: { reportLoc: reportLoc, activeFlag: true },
      fields: { parent: "reportLoc", id: "locCode" },
      project: { "reportLoc": 1, "locCode": 1, "activeFlag": 1 }
    };

    var res = await firstValueFrom(this.masterService.masterMongoPost('generic/descendants', reqBody));    
    return res.data;
  }
}

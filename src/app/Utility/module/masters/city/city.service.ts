import { Injectable } from "@angular/core";
import { MasterService } from "src/app/core/service/Masters/master.service";

@Injectable({
  providedIn: "root",
})
export class CityService {
  constructor(private masterService: MasterService) {}

// This async function retrieves city data from an API using the masterService.
async getCity() {
    // Prepare the request body with necessary parameters
    const req = {
      companyCode: localStorage.getItem("companyCode"), // Get company code from local storage
      collectionName: "city_detail",
      filter: {}, // You can specify additional filters here if needed
    };
  
    try {
      // Make an asynchronous request to the API using masterMongoPost method
      const res: any = await this.masterService.masterMongoPost("generic/get", req).toPromise();
  
      // Check if the response and data are available
      if (res && res.data) {
        // Map the response data to a more usable format
        const city = res.data
          .map((x) => ({ name: x.cityName, value: x.cityName }))
          .filter((x) => x.name !== undefined && x.value !== undefined);
  
        // Sort the mapped data in ascending order by city name
        city.sort((a, b) => a.name.localeCompare(b.name));
  
        return city;
      } else {
        return null; // Return null if no data is available in the response
      }
    } catch (error) {
      // Handle any errors that occur during the API request
      console.error("Error fetching city:", error);
      return null; // Return null to indicate an error occurred
    }
  }
  
  
}

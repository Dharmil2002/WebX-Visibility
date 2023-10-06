import { Injectable } from "@angular/core";
import { MasterService } from "src/app/core/service/Masters/master.service";

@Injectable({
  providedIn: "root",
})
export class CustomerService {
  constructor(private masterService: MasterService) {}

  // This async function retrieves customer data from an API using the masterService.
  async customerFromApi() {
    // Prepare the request body with necessary parameters
    const reqBody = {
      companyCode: localStorage.getItem("companyCode"), // Get company code from local storage
      collectionName: "customer_detail",
      filter: {}, // You can specify additional filters here if needed
    };

    try {
      // Make an asynchronous request to the API using masterMongoPost method
      const res = await this.masterService
        .masterMongoPost("generic/get", reqBody)
        .toPromise();

      // Map the response data to a more usable format
      const filterMap =
        res?.data?.map((x) => ({
          value: x.customerCode,
          name: x.customerName,
        })) ?? null;

      // Sort the mapped data in ascending order by customer name
      return filterMap.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      // Handle any errors that occur during the API request
      console.error("An error occurred:", error);
      return null; // Return null to indicate an error occurred
    }
  }
}

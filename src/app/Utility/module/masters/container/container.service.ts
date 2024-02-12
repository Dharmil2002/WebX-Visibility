import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";

@Injectable({
  providedIn: "root",
})
export class ContainerService {

  constructor(private masterService: MasterService) { }
  companyCode = localStorage.getItem("companyCode")
  // This async function retrieves container data from an API using the masterService.
  async containerFromApi() {

    // Prepare the request body with necessary parameters
    const reqBody = {
      companyCode: this.companyCode, // Get company code from local storage
      collectionName: "container_detail",
      filter: {}, // You can specify additional filters here if needed
    };

    try {
      // Make an asynchronous request to the API using masterMongoPost method
      const res = await firstValueFrom(this.masterService.masterMongoPost("generic/get", reqBody));
      // Map the response data to a more usable format
      const filterMap =
        res?.data?.map((x) => ({
          value: x.containerCode,
          name: x.containerName,
        })) ?? null;

      // Sort the mapped data in ascending order by container name
      return filterMap.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      // Handle any errors that occur during the API request
      console.error("An error occurred:", error);
      return null; // Return null to indicate an error occurred
    }
  }
  //#region Fetches container details based on a filter value.
  /**
  * Fetches container details based on a filter value.
  * @param {string} filterValue - The value to filter containers by (e.g., containerCode).
  * @returns {Promise<Array>} - A Promise that resolves to an array of container details.
  */
  async getContainersByFilter(filterValue) {
    // Prepare the request body with necessary parameters
    const requestPayload = {
      companyCode: this.companyCode, // Get company code from local storage
      collectionName: "container_detail",
      filter: {
        containerCode: filterValue
      }, // You can specify additional filters here if needed
    };

    try {
      // Make an asynchronous request to the API using masterMongoPost method
      const response = await this.masterService
        .masterMongoPost("generic/get", requestPayload)
        .toPromise();

      // Extract and map the response data to a more usable format
      const containerData = response?.data || [];

      // Sort the mapped data in ascending order by container name
      return containerData.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      // Handle any errors that occur during the API request
      console.error("An error occurred:", error);
      return null; // Return null to indicate an error occurred
    }
  }
  //#endregion

  //#region 
  async getDetail() {
    const request = {
      companyCode: this.companyCode,
      collectionName: 'container_detail',
      filter: { activeFlag: true }
    };
    const res = await this.masterService.masterPost('generic/get', request).toPromise();
    const sortedData = res.data.sort((a, b) => {
      const A: any = a.entryDate;
      const B: any = b.entryDate;

      return B - A; // Sort in descending order
    });
    return sortedData;
  }
  //#endregion

  async getContainerList() {
    // Fetch container details asynchronously
    const container = await this.getDetail();

    // Use a Set to track unique names
    const uniqueNamesSet = new Set<number>();

    // Filter based on the isActive property and get unique names
    const containerData = container
      .filter((item) => item.activeFlag)
      .reduce((result, e) => {

        // Parse the loadCapacity as an integer
        const name = parseInt(e.loadCapacity);

        // Check if the name is not already in the set to ensure uniqueness
        if (!uniqueNamesSet.has(name)) {
          uniqueNamesSet.add(name);

          // Add the unique name and its corresponding containerCode to the result array
          result.push({
            name,
            value: e.containerCode
          });
        }

        // Return the updated result array for the next iteration
        return result;
      }, [] as { name: number; value: string }[])
      .sort((a, b) => a.name - b.name); // Sort numerically
    // Add "Con-" to each name before returning
    const containerDataWithPrefix = containerData.map((item) => ({
      name: `Con- ${item.name} MT`,
      value: item.value,
    }));

    return containerDataWithPrefix;
    return containerData
  }
}  
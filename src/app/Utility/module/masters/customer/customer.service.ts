import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class CustomerService {
  constructor(private masterService: MasterService, private filter: FilterUtils, private storage: StorageService) { }

  // This async function retrieves customer data from an API using the masterService.
  async customerFromApi() {
    // Prepare the request body with necessary parameters
    const reqBody = {
      companyCode: this.storage.companyCode, // Get company code from local storage
      collectionName: "customer_detail",
      filter: {}, // You can specify additional filters here if needed
    };

    try {
      // Make an asynchronous request to the API using masterMongoPost method
      const res = await firstValueFrom(this.masterService.masterMongoPost("generic/get", reqBody));

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

  async getCustomer(filter, project = null): Promise<any | null> {

    let filters = [];
    filters.push({
      D$match: filter
    });

    if (project) {
      filters.push({ 'D$project': project });
    }

    const reqBody = {
      companyCode: this.storage.companyCode, // Get company code from local storage
      collectionName: 'customer_detail',
      filters: filters
    };

    var res = await firstValueFrom(this.masterService.masterMongoPost('generic/query', reqBody));
    return res?.data || [];
  }


  async getCustomerByCodeOrName(code, name) {
    try {

      const filter = (code && name) ? { 'customerCode': code, 'customerName': name }
        : code ? { 'customerCode': code }
          : name ? { 'customerName': name }
            : undefined;

      if (!filter) return undefined;

      const cityBody = {
        companyCode: this.storage.companyCode,
        collectionName: "customer_detail",
        filter,
      };

      // Fetch pincode data from the masterService asynchronously
      const cResponse = await firstValueFrom(this.masterService.masterPost("generic/get", cityBody));

      // Extract the cityCodeData from the response
      const codeData = cResponse.data.map((x) => { return { name: x.customerName, value: x.customerCode } });

      if (codeData.length > 0) {
        return codeData[0];
      } else {
        return undefined;
      }
    } catch (error) {
      // Handle any errors that may occur during the asynchronous operation
      console.error("Error fetching data:", error);
      return undefined;
    }
  }

  async getCustomerForAutoComplete(form, jsondata, controlName, codeStatus) {
    try {
      const cValue = form.controls[controlName].value;

      // Check if filterValue is provided and pincodeValue is a valid number with at least 3 characters
      if (cValue.length >= 3) {
        const filter = { customerName: { 'D$regex': `^${cValue}`, 'D$options': 'i' } }

        // Prepare the pincodeBody with the companyCode and the determined filter
        const cityBody = {
          companyCode: this.storage.companyCode,
          collectionName: "customer_detail",
          filter,
        };

        // Fetch pincode data from the masterService asynchronously
        const cResponse = await firstValueFrom(this.masterService.masterPost("generic/get", cityBody));

        // Extract the cityCodeData from the response
        const codeData = cResponse.data.map((x) => { return { name: x.customerName, value: x.customerCode, otherdetails: x } });

        // Filter cityCodeData for partial matches
        if (codeData.length === 0) {
          // Show a popup indicating no data found for the given pincode
          console.log(`No data found for Customer ${cValue}`);
          // Swal.fire({
          //   icon: "info",
          //   title: "No Data Found",
          //   text: `No data found for Customer ${cValue}`,
          //   showConfirmButton: true,
          // });
        } else {
          // Call the filter function with the filtered data
          this.filter.Filter(
            jsondata,
            form,
            codeData,
            controlName,
            codeStatus
          );
        }
      }
    } catch (error) {
      // Handle any errors that may occur during the asynchronous operation
      console.error("Error fetching data:", error);
    }
  }
  // This async function retrieves customer data from an API using the masterService.
  async customerFromFilter(filter = {}, flag = false) {
    // Prepare the request body with necessary parameters
    const reqBody = {
      companyCode: this.storage.companyCode, // Get company code from local storage
      collectionName: "customer_detail",
      filter: filter, // You can specify additional filters here if needed
    };

    try {
      // Make an asynchronous request to the API using masterMongoPost method
      const res = await firstValueFrom(this.masterService.masterMongoPost("generic/get", reqBody));
      if (flag) {
        const filterMap =
          res?.data?.map((x) => ({
            value: x.customerCode,
            name: x.customerName,
          })) ?? null;
        return filterMap.sort((a, b) => a.name.localeCompare(b.name));
      }
      else {
        // Map the response data to a more usable format
        return res?.data;
      }
    }
    // Sort the mapped data in ascending order by customer name
    catch (error) {
      // Handle any errors that occur during the API request
      console.error("An error occurred:", error);
      return null; // Return null to indicate an error occurred
    }
  }
  // This async function retrieves customer data from an API using the masterService.
  async customerGroupFilter(groupName) {

    const reqBody = {
      companyCode: this.storage.companyCode,
      collectionName: "customerGroup_detail",
      filter: {
        activeFlag: true,
        groupName: groupName
      },
    };

    try {

      const res = await firstValueFrom(this.masterService.masterMongoPost("generic/get", reqBody));
      return res?.data?.[0];

    }
    // Sort the mapped data in ascending order by customer name
    catch (error) {
      // Handle any errors that occur during the API request
      console.error("An error occurred:", error);
      return null; // Return null to indicate an error occurred
    }
  }
  async getWalkForAutoComplete(form, jsondata, controlName, codeStatus) {
    try {
      const cValue = form.controls[controlName].value;

      // Check if filterValue is provided and pincodeValue is a valid number with at least 3 characters
      if (cValue.length >= 3) {
        const filter = { cUSTNM: { 'D$regex': `^${cValue}`, 'D$options': 'i' } }

        // Prepare the pincodeBody with the companyCode and the determined filter
        const cityBody = {
          companyCode: this.storage.companyCode,
          collectionName: "walkin_customers",
          filter,
        };

        // Fetch pincode data from the masterService asynchronously
        const cResponse = await firstValueFrom(this.masterService.masterPost("generic/get", cityBody));

        // Extract the cityCodeData from the response
        const codeData = cResponse.data.map((x) => { return { name: x.cUSTNM, value: x.cUSTCD, otherdetails: x } });

        // Filter cityCodeData for partial matches
        if (codeData.length === 0) {
          // Show a popup indicating no data found for the given pincode
          console.log(`No data found for Customer ${cValue}`);
          // Swal.fire({
          //   icon: "info",
          //   title: "No Data Found",
          //   text: `No data found for Customer ${cValue}`,
          //   showConfirmButton: true,
          // });
        } else {
          // Call the filter function with the filtered data
          this.filter.Filter(
            jsondata,
            form,
            codeData,
            controlName,
            codeStatus
          );
        }
      }
    } catch (error) {
      // Handle any errors that may occur during the asynchronous operation
      console.error("Error fetching data:", error);
    }
  }
  //#region to get customer Group list
  async getCustomerGroupData(filter = {}) {
    filter = { ...filter, activeFlag: true }; // Add activeFlag filter to the request

    const request = {
      companyCode: this.storage.companyCode,
      collectionName: 'customerGroup_detail',
      filter: filter, // You can specify additional filters here if needed
    };

    try {
      const response = await firstValueFrom(this.masterService.masterPost('generic/get', request));
      return response?.success && response?.data ?
        response.data.map(
          ({ groupName, groupCode }) => ({ name: groupName, value: groupCode })) : [];
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
      return [];
    }
  }
  //#endregion
}
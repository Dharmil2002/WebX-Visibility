import { Injectable } from "@angular/core";
import { filterAndUnique } from "src/app/Utility/Form Utilities/filter-utils";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { MasterService } from "src/app/core/service/Masters/master.service";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class PinCodeService {
  companyCode = parseInt(localStorage.getItem("companyCode"));
  constructor(private masterService: MasterService,
    private filter: FilterUtils) {

  }
  async pinCodeDetail() {
    // Prepare the request body with necessary parameters
    const reqBody = {
      companyCode: localStorage.getItem("companyCode"), // Get company code from local storage
      collectionName: "pincode_detail",
      filter: {},
    };
    try {
      // Make an asynchronous request to the API using masterMongoPost method
      const res = await this.masterService
        .masterMongoPost("generic/get", reqBody)
        .toPromise();
      return res.data
      // Sort the mapped data in ascending order by location name
    } catch (error) {
      // Handle any errors that occur during the API request
      console.error("An error occurred:", error);
      return null; // Return null to indicate an error occurred
    }
  }
  //#region To filter and set pincode 
  async validateAndFilterPincode(form, filterValue, jsondata, pincodeControlName, pincodeStatus) {
    try {
      const pincodeValue = form.controls[pincodeControlName].value;

      // Check if filterValue is provided and pincodeValue is a valid number with at least 3 characters
      if (!isNaN(pincodeValue) && pincodeValue.toString().length >= 3) {
        const filter = typeof filterValue === 'number' ? { ST: filterValue } : {};

        // Prepare the pincodeBody with the companyCode and the determined filter
        const pincodeBody = {
          companyCode: this.companyCode,
          collectionName: "pincode_master",
          filter,
        };

        // Fetch pincode data from the masterService asynchronously
        const pincodeResponse = await this.masterService.masterPost("generic/get", pincodeBody).toPromise();

        // Extract the pincodeData from the response
        const pincodeData = pincodeResponse.data
          .filter((x) => x.PIN.toString().startsWith(pincodeValue))
          .map((element) => ({
            name: element.PIN.toString(),
            value: element.PIN.toString(),
          }));

        // Find an exact pincode match in the pincodeData array
        const exactPincodeMatch = pincodeData.find((element) => element.name === pincodeValue.toString());

        if (!exactPincodeMatch) {
          // Filter pincodeData for partial matches
          const filteredPincodeData = pincodeData.filter((element) =>
            element.name.includes(pincodeValue.toString())
          );

          if (filteredPincodeData.length === 0) {
            // Show a popup indicating no data found for the given pincode
            Swal.fire({
              icon: "info",
              title: "No Data Found",
              text: `No data found for pincode ${pincodeValue}`,
              showConfirmButton: true,
            });
          } else {
            // Call the filter function with the filtered data
            this.filter.Filter(
              jsondata,
              form,
              filteredPincodeData,
              pincodeControlName,
              pincodeStatus
            );
          }
        }
      }
    } catch (error) {
      // Handle any errors that may occur during the asynchronous operation
      console.error("Error fetching pincode data:", error);
    }
  }
  //#endregion 
  /*get city on pinCode based*/
  async getCity(form, jsondata, cityControlName, citycodeStatus) {
    try {
      const cityValue = form.controls[cityControlName].value;

      // Check if filterValue is provided and pincodeValue is a valid number with at least 3 characters
      if (cityValue.length >= 3) {
        const filter = {}

        // Prepare the pincodeBody with the companyCode and the determined filter
        const cityBody = {
          companyCode: this.companyCode,
          collectionName: "pincode_master",
          filter,
        };

        // Fetch pincode data from the masterService asynchronously
        const cityResponse = await this.masterService.masterPost("generic/get", cityBody).toPromise();
        // Extract the cityCodeData from the response
       const cityCodeData = filterAndUnique(
          cityResponse.data,
          (element: { CT: string }) => element.CT.toLowerCase().includes(cityValue.toLowerCase()),
          (ct: { CT: string }) => ({ name: ct.CT, value: ct.CT })
        );
        // Filter cityCodeData for partial matches
        if (cityCodeData.length === 0) {
          // Show a popup indicating no data found for the given pincode
          Swal.fire({
            icon: "info",
            title: "No Data Found",
            text: `No data found for City ${cityValue}`,
            showConfirmButton: true,
          });
        } else {
          // Call the filter function with the filtered data
          this.filter.Filter(
            jsondata,
            form,
            cityCodeData,
            cityControlName,
            citycodeStatus
          );
        }
      }
    } catch (error) {
      // Handle any errors that may occur during the asynchronous operation
      console.error("Error fetching city data:", error);
    }
  }
}
import { Injectable } from "@angular/core";
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
  async pinCodeDetail(filter) {
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
  async validateAndFilterPincode(form, jsondata, pincodeControlName, pincodeStatus) {

    // Prepare the pincodeBody with the companyCode and an empty filter
    const pincodeBody = {
      companyCode: this.companyCode,
      collectionName: "pincode_master",
      filter: {},
    };

    try {
      // Fetch pincode data from the masterService asynchronously
      const pincodeResponse = await this.masterService.masterPost("generic/get", pincodeBody).toPromise();

      // Extract the pincodeData from the response
      const pincodeData = pincodeResponse.data.map((element) => ({
        name: element.PIN.toString(),
        value: element.PIN.toString(),
      }));

      const pincodeValue = form.controls[pincodeControlName].value;

      // Check if pincodeValue is a valid number and has at least 3 characters
      if (!isNaN(pincodeValue) && pincodeValue.length >= 3) {
        // Find an exact pincode match in the pincodeData array
        const exactPincodeMatch = pincodeData.find((element) => element.name === pincodeValue);

        if (!exactPincodeMatch) {
          // Filter pincodeData for partial matches
          const filteredPincodeData = pincodeData.filter((element) =>
            element.name.includes(pincodeValue)
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
}
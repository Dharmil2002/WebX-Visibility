import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
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
  async pinCodeDetail(filter = {}) {
    // Prepare the request body with necessary parameters
    const reqBody = {
      companyCode: localStorage.getItem("companyCode"), // Get company code from local storage
      collectionName: "pincode_master",
      filter: filter,
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
  async getCity(form, jsondata, controlName, codeStatus) {
    try {
      const cValue = form.controls[controlName].value;

      // Check if filterValue is provided and pincodeValue is a valid number with at least 3 characters
      if (cValue.length >= 3) {
        const filter = { CT: { 'D$regex': `^${cValue}`, 'D$options': 'i' } }

        // Prepare the pincodeBody with the companyCode and the determined filter
        const cityBody = {
          companyCode: localStorage.getItem("companyCode"),
          collectionName: "pincode_master",
          filter,
        };

        // Fetch pincode data from the masterService asynchronously
        const cResponse = await firstValueFrom(this.masterService.masterPost("generic/get", cityBody));

        // Extract data from the response
        const codeData = Array.from(new Set(cResponse.data.map(obj => obj.CT)))
          .map((ct: string) => {
            return { name: ct, value: ct }
          });

        // Filter cityCodeData for partial matches
        if (codeData.length === 0) {
          // Show a popup indicating no data found for the given pincode
          console.log(`No data found for City ${cValue}`);
          // Swal.fire({
          //   icon: "info",
          //   title: "No Data Found",
          //   text: `No data found for City ${cValue}`,
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
  async getCityDetails(filter = {}) {
    const cityBody = {
      companyCode: localStorage.getItem("companyCode"),
      collectionName: "pincode_master",
      filter: filter,
    };
    const cResponse = await firstValueFrom(this.masterService.masterPost("generic/get", cityBody));
    // Extract data from the response
    const codeData = Array.from(new Set(cResponse.data.map(obj => obj.CT)))
      .map((ct: string) => {
        return { name: ct, value: ct }
      });
    return codeData
  }
  async getPincodes(form, jsondata, controlName, codeStatus, city = '', stateCode = '') {
    try {
      const cValue = form.controls[controlName].value;

      // Check if filterValue is provided and pincodeValue is a valid number with at least 3 characters
      if (cValue.length >= 3) {
        let gte = parseInt(`${cValue}00000`.slice(0, 6));
        let lte = parseInt(`${cValue}99999`.slice(0, 6));
        const filter = { PIN: { 'D$gte': gte, 'D$lte': lte } }
        if (city)
          filter["CT"] = city;
        if (stateCode)
          filter["ST"] = stateCode;

        // Prepare the pincodeBody with the companyCode and the determined filter
        const cityBody = {
          companyCode: localStorage.getItem("companyCode"),
          collectionName: "pincode_master",
          filter,
        };

        // Fetch pincode data from the masterService asynchronously
        const cResponse = await firstValueFrom(this.masterService.masterPost("generic/get", cityBody));
        // Extract data from the response
        const codeData = cResponse.data.map((x) => { return { name: `${x.PIN}`, value: `${x.PIN}`, allData: x } });
        // Filter cityCodeData for partial matches
        if (codeData.length === 0) {
          // Show a popup indicating no data found for the given pincode
          // Swal.fire({
          //   icon: "info",
          //   title: "No Data Found",
          //   text: `No data found for City ${cValue}`,
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
    }
  }
  async getPincodeNestedData(filter, value) {
    try {
      // Check if filterValue is provided and pincodeValue is a valid number with at least 3 characters
      if (value.length >= 3) {
        // Prepare the pincodeBody with the companyCode and the determined filter
        const cityBody = {
          companyCode: localStorage.getItem("companyCode"),
          collectionName: "pincode_master",
          filter,
        };

        // Fetch pincode data from the masterService asynchronously
        const cResponse = await firstValueFrom(this.masterService.masterPost("generic/get", cityBody));
        // Extract data from the response
        const codeData = cResponse.data.map((x) => { return { name: `${x.PIN}`, value: `${x.PIN}`, allData: x } });
        // Filter cityCodeData for partial matches
        if (codeData.length === 0) {
          // Show a popup indicating no data found for the given pincode
          // Swal.fire({
          //   icon: "info",
          //   title: "No Data Found",
          //   text: `No data found for City ${cValue}`,
          //   showConfirmButton: true,
          // });
        } else {
          // Call the filter function with the filtered data
          return codeData
        }
      }
    } catch (error) {
      // Handle any errors that may occur during the asynchronous operation
    }
  }
  async getStateNestedData(filter, value) {
    try {
      // Check if filterValue is provided and pincodeValue is a valid number with at least 3 characters
      if (value.length >= 3) {
        // Prepare the pincodeBody with the companyCode and the determined filter
        const cityBody = {
          companyCode: localStorage.getItem("companyCode"),
          collectionName: "state_master",
          filter,
        };

        // Fetch pincode data from the masterService asynchronously
        const cResponse = await firstValueFrom(this.masterService.masterPost("generic/get", cityBody));
        // Extract data from the response
        const codeData = cResponse.data.map((x) => { return { name: `${x.STNM}`, value: `${x.STSN}`, allData: x } });
        // Filter cityCodeData for partial matches
        if (codeData.length === 0) {
          // Show a popup indicating no data found for the given pincode
          // Swal.fire({
          //   icon: "info",
          //   title: "No Data Found",
          //   text: `No data found for City ${cValue}`,
          //   showConfirmButton: true,
          // });
        } else {
          // Call the filter function with the filtered data
          return codeData
        }
      }
    } catch (error) {
      // Handle any errors that may occur during the asynchronous operation
    }
  }

}
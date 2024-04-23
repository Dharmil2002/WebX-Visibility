import { Injectable } from "@angular/core";
import { cp } from "fs";
import { firstValueFrom } from "rxjs";
import { filterAndUnique } from "src/app/Utility/Form Utilities/filter-utils";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
import Swal from "sweetalert2";
import { ClusterMasterService } from "../cluster/cluster.master.service";

@Injectable({
  providedIn: "root",
})
export class PinCodeService {
  companyCode = 0;
  constructor(private masterService: MasterService,
    private storage: StorageService,
    private filter: FilterUtils,
    private clusterMasterService: ClusterMasterService,
  ) {
    this.companyCode = this.storage.companyCode;
  }
  async pinCodeDetail(filter = {}) {
    // Prepare the request body with necessary parameters
    const reqBody = {
      companyCode: this.storage.companyCode, // Get company code from local storage
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
          companyCode: this.storage.companyCode,
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
      companyCode: this.storage.companyCode,
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
          companyCode: this.storage.companyCode,
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
          companyCode: this.storage.companyCode,
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
          companyCode: this.storage.companyCode,
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
  /*below is function for getting city and pincode*/
  async getCityPincode(form, jsondata, controlName, codeStatus, isCity, isArea = false) {
    try {
      const cValue = form.controls[controlName].value;
      let filter = {}
      // Check if filterValue is provided and pincodeValue is a valid number with at least 3 characters
      if (cValue.length >= 3) {
        if (isCity) {
          filter = { CT: { 'D$regex': `^${cValue}`, 'D$options': 'i' } }
        }
        else {
          let gte = parseInt(`${cValue}00000`.slice(0, 6));
          let lte = parseInt(`${cValue}99999`.slice(0, 6));
          filter = { PIN: { 'D$gte': gte, 'D$lte': lte } }
        }
        // Prepare the pincodeBody with the companyCode and the determined filter
        const cityBody = {
          companyCode: this.storage.companyCode,
          collectionName: "pincode_master",
          filter,
        };
        // Fetch pincode data from the masterService asynchronously
        const cResponse = await firstValueFrom(this.masterService.masterPost("generic/get", cityBody));
        // Extract data from the response
        let codeData = []
        let mergeData = []
        if (isArea) {
          try {
            const data = await this.clusterMasterService.getClusterData(cValue);
             mergeData = (data) ? data : [];
          } catch (error) {
            console.error("Failed to retrieve cluster data:", error);
            // Handle the error appropriately
          }
        }
        if (isCity) {
          const data = Array.from(new Set(cResponse.data.map(obj => obj.CT)))
            .map(ct => {
              // Find the first occurrence of this ct in the original data to get its pincode
              const originalItem = cResponse.data.find(item => item.CT === ct);
              return {
                name: originalItem.PIN,
                value: ct,
                ct: ct,
                pincode: originalItem.PIN, // include pincode here
                st: originalItem?.ST
              };
            });

            mergeData = (data) ? [...mergeData, ...data] : mergeData;
        }
        else {
          codeData = cResponse.data
            .filter((x) => x.PIN.toString().startsWith(cValue))
            .map((element) => ({
              name: element.CT,
              value: element.PIN,
              ct: element.CT,
              pincode: element.PIN.toString(),
              st: element.ST
            }));
          mergeData = codeData;
        }

        this.filter.Filter(
          jsondata,
          form,
          mergeData,
          controlName,
          codeStatus
        );        
      }
    } catch (error) {
      // Handle any errors that may occur during the asynchronous operation
    }
  }
  /*End*/
}
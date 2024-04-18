import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  constructor(private masterService: MasterService, private storage: StorageService,private filter: FilterUtils,) { }
  async getVendorDetail(filter) {
    // Prepare the request object
    const request = {
      companyCode: this.storage.companyCode,
      collectionName: 'vendor_detail',
      filter: filter ? filter : {}
    };

    // Send a POST request to the 'generic/get' endpoint using the masterService
    const response = await firstValueFrom(this.masterService.masterPost('generic/get', request));
    // Return the data from the response
    return response.data;
  }

  async VendorDetail(filter = {}) {
    // Prepare the request body with necessary parameters
    const reqBody = {
      companyCode: this.storage.companyCode, // Get company code from local storage
      collectionName: "vendor_detail",
      filter: filter,
    };
    try {
      // Make an asynchronous request to the API using masterMongoPost method
      const res = await firstValueFrom(this.masterService
        .masterMongoPost("generic/get", reqBody));
      return res.data
      // Sort the mapped data in ascending order by location name
    } catch (error) {
      // Handle any errors that occur during the API request
      console.error("An error occurred:", error);
      return null; // Return null to indicate an error occurred
    }
  }

  async getVendorForAutoComplete(form, jsondata, controlName, codeStatus) {
    try {
      const cValue = form.controls[controlName].value;
      // Check if filterValue is provided and pincodeValue is a valid number with at least 3 characters
      if (cValue.length >= 3) {
        const filter = { vendorName: { 'D$regex': `^${cValue}`, 'D$options': 'i' } }
        // Prepare the pincodeBody with the companyCode and the determined filter
        const cityBody = {
          companyCode: this.storage.companyCode,
          collectionName: "vendor_detail",
          filter,
        };

        // Fetch pincode data from the masterService asynchronously
        const cResponse = await firstValueFrom(this.masterService.masterPost("generic/get", cityBody));
        // Extract the cityCodeData from the response
        const codeData = cResponse.data.map((x) => { return { name: x.vendorName, value: x.vendorCode, otherdetails: x } });

        // Filter cityCodeData for partial matches
        if (codeData.length === 0) {
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
}

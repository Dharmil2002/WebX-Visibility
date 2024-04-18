import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  constructor(private masterService: MasterService, private storage: StorageService) { }
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
}

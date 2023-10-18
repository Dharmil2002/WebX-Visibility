import { Injectable } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';

@Injectable({
    providedIn: 'root'
})
export class VendorService {

    constructor(private masterService: MasterService,) { }
    async getVendorDetail(filter = {}) {
        // Prepare the request object
        const request = {
          companyCode: localStorage.getItem("companyCode"),
          collectionName: 'vendor_detail',
          filter: filter
        };
      
        // Send a POST request to the 'generic/get' endpoint using the masterService
        const response = await this.masterService.masterPost('generic/get', request).toPromise();
      
        // Return the data from the response
        return response.data;
      }
    }
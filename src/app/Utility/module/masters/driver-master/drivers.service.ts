import { Injectable } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';

@Injectable({
    providedIn: 'root'
})
export class DriverService {

    constructor(private masterService: MasterService, private storage: StorageService) { }
    async getDriverDetail(filter = {}) {
        // Prepare the request object
        const request = {
          companyCode: this.storage.companyCode,
          collectionName: 'driver_detail',
          filter: filter
        };
        // Send a POST request to the 'generic/get' endpoint using the masterService
        const response = await this.masterService.masterPost('generic/get', request).toPromise();
        // Return the data from the response
        return response.data;
      }
    }
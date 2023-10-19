import { Injectable } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';

@Injectable({
    providedIn: 'root'
})
export class VehicleService {

    constructor(private masterService: MasterService,) { }

    /**
     * Retrieves vehicle details based on the provided filter.
     * @param {Object} filter - The filter criteria for querying vehicle details.
     * @returns {Promise<Object>} - A promise that resolves to the vehicle data.
     */
    async getVehicleNestedDetail(filter = {}) {
        // Constructing the request object with necessary parameters
        const req = {
            companyCode: localStorage.getItem("companyCode"),
            collectionName: "fleet_master",
            filter: filter,
        };
        // Making an asynchronous request to fetch vehicle data using the master service
        const vehicleData = await this.masterService.masterPost("generic/get", req).toPromise();
        // Returning the vehicle data
        return vehicleData.data;
    }

}
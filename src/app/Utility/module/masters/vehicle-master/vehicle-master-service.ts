import { Injectable } from '@angular/core';
import { vehicleMarket } from 'src/app/Models/vehicle-market/vehicle-market';
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
    async addMarketVehicle(data?:vehicleMarket) {
        const req = {
            companyCode: localStorage.getItem("companyCode"),
            collectionName: "markets_vehicles",
            data: data,
        };
        // Making an asynchronous request to fetch vehicle data using the master service
        return this.masterService.masterPost("generic/create",req).toPromise();
    }
    async getMarketVehicledata(filter={}){
        const req = {
            companyCode: localStorage.getItem("companyCode"),
            collectionName: "markets_vehicles",
            filter: filter,
        };
        // Making an asynchronous request to fetch vehicle data using the master service
        return this.masterService.masterPost("generic/get",req).toPromise();
    }
}
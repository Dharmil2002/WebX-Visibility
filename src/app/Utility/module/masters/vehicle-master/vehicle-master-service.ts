import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { vehicleMarket } from 'src/app/Models/vehicle-market/vehicle-market';
import { Collections, GenericActions } from 'src/app/config/myconstants';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';

@Injectable({
    providedIn: 'root'
})

export class VehicleService {

    constructor(private masterService: MasterService, private storage: StorageService) { }

    /**
     * Retrieves vehicle details based on the provided filter.
     * @param {Object} filter - The filter criteria for querying vehicle details.
     * @returns {Promise<Object>} - A promise that resolves to the vehicle data.
     */
    async getVehicleNestedDetail(filter = {}) {
        // Constructing the request object with necessary parameters
        const req = {
            companyCode: this.storage.companyCode,
            collectionName: "fleet_master",
            filter: filter,
        };
        // Making an asynchronous request to fetch vehicle data using the master service
        const vehicleData = await this.masterService.masterPost("generic/get", req).toPromise();
        // Returning the vehicle data
        return vehicleData.data;
    }
    async addMarketVehicle(data?: vehicleMarket) {
        const req = {
            companyCode: this.storage.companyCode,
            collectionName: "markets_vehicles",
            data: data,
        };
        // Making an asynchronous request to fetch vehicle data using the master service
        return this.masterService.masterPost("generic/create", req).toPromise();
    }
    async addMarketVehicleDetails(data: any, isUpdate: boolean) {
        if (isUpdate) {
            const req = {
                companyCode: this.storage.companyCode,
                collectionName: "market_vehicles",
                filter: { vehNo: data.vehNo },
                update: data,
            };
            await firstValueFrom(this.masterService.masterMongoPut("generic/update", req));
            return true

        }
        else {
            const req = {
                companyCode: this.storage.companyCode,
                collectionName: "market_vehicles",
                data: data,
            };
            await firstValueFrom(this.masterService.masterPost("generic/create", req));
            const vehBody = {
                "_id": data.vID,
                "tripId": "",
                "vehNo": data.vID,
                "capacity": data.wTCAP,
                "fromCity": "",
                "toCity": "",
                "status": "Available",
                "eta": null,
                "lcNo": "",
                "lcExpireDate": null,
                "distance": 0,
                "vendorType": "Market",
                "vendor": "",
                "driver": "",
                "dMobNo": null,
                "vMobNo": null,
                "driverPan": "",
                "currentLocation": this.storage.branch,
                "updateBy": this.storage.userName,
                "updateDate": new Date(),
                "entryDate": new Date(),
                "entryBy": this.storage.userName,
                "vendorTypeCode": "4",
                "route": ""
            }
            const vehreq = {
                companyCode: this.storage.companyCode,
                collectionName: "vehicle_status",
                data: vehBody,
            };
            await firstValueFrom(this.masterService.masterPost("generic/create", vehreq));
            return true
        }
        // Making an asynchronous request to fetch vehicle data using the master service
    }
    /*End*/
    async getMarketVehicledata(filter = {}) {
        const req = {
            companyCode: this.storage.companyCode,
            collectionName: "markets_vehicles",
            filter: filter,
        };
        // Making an asynchronous request to fetch vehicle data using the master service
        return this.masterService.masterPost("generic/get", req).toPromise();
    }
    async getVehicleNo(filter, isDropdown) {
        try {
            const req = {
                companyCode: this.storage.companyCode,
                collectionName: "vehicle_status",
                filter: filter,
            };
            // Fetch vehicle data and destructure to get the data property
            const { data } = await firstValueFrom(this.masterService.masterPost("generic/get", req));
            // If isDropdown is true, transform data to dropdown format, else return raw data
            return isDropdown
                ? data.map(item => ({ value: item.vehNo, name: item.vehNo }))
                : data;
        } catch (error) {
            return isDropdown ? [] : null; // or any other appropriate default value
        }
    }
    async getMarketVehicle(filter) {
        const req = {
            companyCode: this.storage.companyCode,
            collectionName: "markets_vehicles",
            filter: filter
        };
        const res = await firstValueFrom(this.masterService.masterPost("generic/get", req));
        return res.data;
    }
    /*below function is firstly add for the loadingSheet which i wanna to add marketVehicle 
    V1 :Dhaval Patel 08-05-2024 11:58*/
    async updateOrCreateVehicleStatus(vehicle) {
        const { companyCode } = this.storage;
        const collectionName = "vehicle_status";
        const vehicleQuery = { vehNo: vehicle.vehNo };

        try {
            // Attempt to get existing vehicle data
            const findVehicleRequest = {
                companyCode,
                collectionName,
                filter: vehicleQuery,
            };
            const { data: existingVehicle } = await firstValueFrom(
                this.masterService.masterPost("generic/getOne", findVehicleRequest)
            );

            // If vehicle exists, update it; otherwise, create a new record
            if (existingVehicle && Object.keys(existingVehicle).length > 0) {
                const updateRequest = {
                    companyCode,
                    collectionName,
                    filter: vehicleQuery,
                    update: vehicle
                };
                await firstValueFrom(this.masterService.masterMongoPut("generic/update", updateRequest));
            } else {
                const createRequest = {
                    companyCode,
                    collectionName,
                    data: vehicle
                };
                await firstValueFrom(this.masterService.masterPost("generic/create", createRequest));
            }
        } catch (error) {
            console.error('Error managing vehicle data:', error);
        }
    }
    /*End*/
    async updateVehicleCap(data, isRunSheet = false) {
        if (data && Object.keys(data).length > 0) {
            const updateRequest = {
                companyCode: this.storage.companyCode,
                collectionName: "vehicle_status",
                filter: { vehNo: data.vehNo },
                update: {
                    "capacity": isRunSheet ? data?.vehicleSize : data?.Capacity || 0,
                    "capacityVolCFT": isRunSheet ? data?.vehicleSizeVol : data?.CapacityVolumeCFT || 0,
                    "vehType": isRunSheet ? data?.vehicleType.name : data?.vehicleType || "",
                    "vehTypeCode": isRunSheet ? data?.vehicleType.value : data?.vehicleTypeCode || ""
                }
            };
            await firstValueFrom(this.masterService.masterMongoPut("generic/update", updateRequest));
        }
    }
    
    async getVehicleOne(vehicleNo) {
        const request = {
          companyCode: this.storage.companyCode,
          collectionName: Collections.vehicleStatus,
          filter: { vehNo: vehicleNo },
        };
        const res = await firstValueFrom(
            this.masterService.masterMongoPost(GenericActions.GetOne, request)
        );
        return res.data;
      }
    

}

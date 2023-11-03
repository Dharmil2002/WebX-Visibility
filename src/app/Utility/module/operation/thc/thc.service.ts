import { Injectable } from "@angular/core";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { StorageService } from "src/app/core/service/storage.service";
import { Collections, GenericActions, OperationActions } from "src/app/config/myconstants";
import { financialYear } from "src/app/Utility/date/date-utils";

@Injectable({
    providedIn: "root",
  })
export class ThcService {
    constructor(
        private operationService: OperationService,
        private storage: StorageService
    )
    { }

    async getShipment(vehicle=false) {       
        const reqBody = {
            companyCode: this.storage.companyCode,
            collectionName: Collections.Dockets,
            filter: {}
        };
    
        // Perform an asynchronous operation to fetch data from the operation service
        const result = await this.operationService.operationMongoPost(GenericActions.Get, reqBody).toPromise();
    
        // If the 'vehicle' flag is true, map the 'result' array to a new format
        // and return it; otherwise, return the 'result' array as is
        return vehicle ? result.data.map(x => ({ name: x.vehicleNo, value: x.vehicleNo })) : result.data;
    }
    async prqDetail(isDropDown) {
        //Need to default max date range, and 
        // const startDate = new Date();
        // startDate.setMonth(startDate.getMonth() - 1);
        // const endDate = new Date();

        const reqBody = {
            companyCode: this.storage.companyCode,
            collectionName: Collections.PrqDetails,
            filter: {}
        };
    
        // Perform an asynchronous operation to fetch data from the operation service
        const result = await this.operationService.operationMongoPost(GenericActions.Get, reqBody).toPromise();
      if(isDropDown){
        // Filter out entries with empty or falsy values in the 'prqNo' property
        const filteredData = result.data.filter(x => x.prqNo && x.status !=7); // This filters out entries where 'prqNo' is falsy
    
        // Map the filtered data to the desired format
        const mappedData = filteredData.map(x => ({ name: x.prqNo.toString(), value: x.prqNo.toString()}));
    
        return mappedData;
      }
      else{
         return result.data;
      }
    }
    
    async thcGeneration(data){
         
         // Define the request body with companyCode, collectionName, and an empty filter
         const reqBody = {
            companyCode: this.storage.companyCode,
            collectionName: Collections.ThcDetails,
            data: data,
            docType: "TH",
            branch: this.storage.branch,
            finYear: financialYear
        };
        // Perform an asynchronous operation to fetch data from the operation service
        const result = await this.operationService.operationMongoPost(OperationActions.CreateThc, reqBody).toPromise();
        return result;
    }
    async getThcDetail(){   
        
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        const endDate = new Date();

        const reqBody = {
           companyCode: this.storage.companyCode,
           collectionName: Collections.ThcDetails,
           filter: {} //{ tripDate: { $gte: startDate, $lte: endDate } }
       };

       // Perform an asynchronous operation to fetch data from the operation service
       const result = await this.operationService.operationMongoPost(GenericActions.Get, reqBody).toPromise();
       return result;
    }
}


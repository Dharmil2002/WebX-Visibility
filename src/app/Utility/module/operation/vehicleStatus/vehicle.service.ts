import { Injectable } from "@angular/core";
import { OperationService } from "src/app/core/service/operations/operation.service";

interface VehicleRequest {
  _id?:string;
  tripId?: string; // Make tripId and other properties optional
  capacity?: number;
  fromCity?: string;
  toCity?: string;
  vehNo?:string;
  status?:string;
  eta?:Date;
  vendorType?: string;
  vMobNo?: string;
  vendor?:string;
  driver?:string;
  dMobNo?:string;
  driverPan?:string;
  lcNo?:string;
  lcExpireDate?:Date;
  distance?: number;
  currentLocation?: string;
  updateBy?: string;
  updateDate?: Date;
  companyCode?: string;
  collectionName?: string;
  filter?: { _id: string } | undefined; // Make filter property optional
  data?: Partial<VehicleRequest> | undefined; // Use Partial to make data property optional
  update?: Partial<VehicleRequest> | undefined; // Use Partial to make data property optional
}

@Injectable({
  providedIn: "root",
})
export class VehicleStatusService {
  constructor(
    private operation: OperationService
  ) {
  }
  async vehicleStatusUpdate(arrivalData: any, prqdata: any, market: boolean) {
    try {
      // Check if essential data is provided
      if (!arrivalData || !market) {
        throw new Error("Missing required data for vehicle status update. Ensure all parameters are provided.");
      }

      // Define common vehicle details
      const vehicleDetails: VehicleRequest = {
        _id: arrivalData.vehNo,
        tripId: prqdata.prqNo,
        vehNo:arrivalData.vehNo,
        capacity: prqdata.vehicleSize,
        fromCity: arrivalData.fromCity,
        toCity: arrivalData.toCity,
        status:"In Transit",
        eta:arrivalData.eta,
        lcNo:arrivalData.lcNo,
        lcExpireDate:arrivalData.lcExpireDate,
        distance: arrivalData.distance,
        vendorType:arrivalData.vendorType,
        vendor:arrivalData.vendor,        
        driver:arrivalData.driver,        
        dMobNo:arrivalData.dMobNo,        
        vMobNo:arrivalData.vMobNo,        
        driverPan:arrivalData.driverPan,        
        currentLocation: localStorage.getItem("Branch"),
        updateBy: localStorage.getItem("Username"),
        updateDate: new Date(),

      };
     
      // Create the request body object
      let reqBody: VehicleRequest = { filter: { _id: arrivalData.vehNo }, update: { ...vehicleDetails } };

      // Check if it's not a market update
      if (market) {
        // For non-market updates, set data and remove the filter
        reqBody.companyCode = localStorage.getItem("companyCode"),
          reqBody.collectionName = "vehicle_status"
        reqBody.data = { ...vehicleDetails };
        delete reqBody.filter;
      }
      else {
        delete reqBody.update._id;
        reqBody.companyCode = localStorage.getItem("companyCode"),
          reqBody.collectionName = "vehicle_status"
      }

      // Determine the API endpoint based on the market flag
      const apiEndpoint = market ? "generic/create" : "generic/update";

      // Make the API request
      const vehicleUpdate = market
      ? await this.operation.operationMongoPost(apiEndpoint, reqBody).toPromise()
      : await this.operation.operationMongoPut(apiEndpoint, reqBody).toPromise();
    
      return vehicleUpdate; // Optionally, you can return the updated vehicle data.
    } catch (error) {
      throw error; // Re-throw the error to be handled at a higher level or log it.
    }
  }
  async vehiclList(prqNo:string){
    
    const request={
      companyCode:localStorage.getItem("companyCode"),
      collectionName:"vehicle_status",
      filter:{tripId:prqNo}
    }
    const res= await this.operation.operationMongoPost('generic/get',request).toPromise();
    return res.data[0]
  }
}

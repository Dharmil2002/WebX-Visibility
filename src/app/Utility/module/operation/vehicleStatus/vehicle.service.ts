import { Injectable } from "@angular/core";
import { formatDate } from "src/app/Utility/date/date-utils";
import { OperationService } from "src/app/core/service/operations/operation.service";

interface RequestData<T> {
  companyCode: string | null;
  collectionName: string;
  filter: {
    [key: string]: T;
  };
}
interface VehicleRequest {
  _id?: string;
  tripId?: string; // Make tripId and other properties optional
  capacity?: number;
  fromCity?: string;
  toCity?: string;
  vehNo?: string;
  status?: string;
  eta?: Date;
  vendorType?: string;
  vMobNo?: string;
  vendor?: string;
  driver?: string;
  dMobNo?: string;
  driverPan?: string;
  lcNo?: string;
  lcExpireDate?: Date;
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

  /*below method is used for the vehicle status update*/

  async vehicleStatusUpdate(arrivalData: any, prqdata: any, market: boolean) {
    try {
      // Check if essential data is provided
      if (!arrivalData) {
        throw new Error("Missing required data for vehicle status update. Ensure all parameters are provided.");
      }

      // Define common vehicle details
      const vehicleDetails: VehicleRequest = {
        _id: arrivalData.vehNo,
        tripId: prqdata.prqNo,
        vehNo: arrivalData.vehNo,
        capacity: prqdata.vehicleSize,
        fromCity: arrivalData.fromCity,
        toCity: arrivalData.toCity,
        status: "In Transit",
        eta: arrivalData.eta,
        lcNo: arrivalData.lcNo,
        lcExpireDate: arrivalData.lcExpireDate,
        distance: arrivalData.distance,
        vendorType: arrivalData.vendorType,
        vendor: arrivalData.vendor,
        driver: arrivalData?.driver,
        dMobNo: arrivalData.dMobNo,
        vMobNo: arrivalData.vMobNo,
        driverPan: arrivalData.driverPan,
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

  /*End*/

  /* The following method is designed to retrieve data trip-wise. In this context,
       a "trip" can refer to various types of document numbers,
       such as PRQNO, DOCKNO, or THCNO, which are associated with a vehicle.
   */

  async vehiclList(tripId: string) {

    const request = {
      companyCode: localStorage.getItem("companyCode"),
      collectionName: "vehicle_status",
      filter: { tripId: tripId }
    }
    const res = await this.operation.operationMongoPost('generic/get', request).toPromise();
    return res.data[0]
  }

  /* End */

  /**
   * Fetch vehicle details from a MongoDB database, including vendor and driver information.
   * @param vehicleNo - The vehicle number to search for in the database.
   * @returns A promise that resolves to the merged vehicle data.
   */
  async vehicleListFromMaster(vehicleNo: string) {
    // Get the company code from local storage
    const companyCode = localStorage.getItem("companyCode");

    // Create a request object to fetch vehicle details
    const vehicleRequest: RequestData<string> = {
      companyCode,
      collectionName: "vehicle_detail",
      filter: { vehicleNo },
    };

    // Fetch vehicle details from the database
    const vehicleResult = await this.operation.operationMongoPost('generic/get', vehicleRequest).toPromise();

    // Extract vendor name from the vehicle details
    const vendorName = vehicleResult.data[0].vendorName;

    // Create a request object to fetch vendor details
    const vendorRequest: RequestData<string> = {
      companyCode,
      collectionName: 'vendor_detail',
      filter: { vendorName },
    };

    // Fetch vendor details from the database
    const vendorResult = await this.operation.operationMongoPost('generic/get', vendorRequest).toPromise();

    // Create a request object to fetch driver details
    const driverRequest: RequestData<string> = {
      companyCode,
      collectionName: 'driver_detail',
      filter: { vehicleNo },
    };

    // Fetch driver details from the database
    const driverResult = await this.operation.operationMongoPost('generic/get', driverRequest).toPromise();

    // Merge the retrieved data into a single object
    const mergedData = {
      vehicleNo,
      vendorName,
      vendorType: vendorResult.data[0]?.vendorType || "",
      vendorPhoneNo: vendorResult.data[0]?.vendorPhoneNo || "",
      driverName: driverResult.data[0]?.driverName || "",
      telno: driverResult.data[0]?.telno || "",
    };

    return mergedData;
  }


  async createTableData(NavData, vehicleStatusData) {
    const [fromCity, toCity] = NavData.fromToCity.split('-');

    const results = await Promise.all(vehicleStatusData.map(async item => {
      const { vendorName, vendorPhoneNo, vendorType, driverName, telno } = await this.vehicleListFromMaster(item.vehNo);

      return {
        ...item,
        action: 'Assign',
        fromCity,
        toCity,
        capacity: `${item.capacity} MT`,
        vendorType,
        driver_info: `${driverName}-${telno}`,
        vendor_info: `${vendorName}-${vendorPhoneNo}`,
        fromToCitySplit: `${fromCity}-${toCity}`,
        distance: 0,
        vendor: vendorName,
        vMobNo: vendorPhoneNo,
        driver: driverName,
        dMobNo: telno,
        isMarket: false,
        eta: formatDate(new Date().toUTCString(), 'dd/MM/yyyy HH:mm')
      };
    }));

    return results;
  }

  /*End*/
}

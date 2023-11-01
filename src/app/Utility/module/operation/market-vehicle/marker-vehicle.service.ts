import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { StorageService } from "src/app/core/service/storage.service";
import { Collections, GenericActions } from "src/app/config/myconstants";

@Injectable({
  providedIn: "root",
})
export class MarkerVehicleService {
  constructor(
    private operation: OperationService,
    private storage: StorageService
  ) {}

  async GetVehicleData(vehicleNo) {
    const request = {
      companyCode: this.storage.companyCode,
      collectionName: Collections.MarketVehicles,
      filter: { cID: this.storage.companyCode, vID: vehicleNo },
    };
    const res = await firstValueFrom(
      this.operation.operationMongoPost(GenericActions.Get, request)
    );
    return res.data[0];
  }

  async SaveVehicleData(data) {
    var vehData = await this.GetVehicleData(data.vID);
    let request = {
      companyCode: this.storage.companyCode,
      collectionName: Collections.MarketVehicles,
    };

    data['cID'] = this.storage.companyCode;
    data['_id'] = `${this.storage.companyCode}-${data.vID}`;
    
    if (vehData && vehData.vID == data.vID) {
      request["filter"] = { _id: data._id };
      request["update"] = data;
      const res = await firstValueFrom(
        this.operation.operationMongoPut(GenericActions.Update, request)
      );
      return res;
    } else {
      request["data"] = data;
      const res = await firstValueFrom(
        this.operation.operationMongoPost(GenericActions.Create, request)
      );
      return res;
    }
  }
}

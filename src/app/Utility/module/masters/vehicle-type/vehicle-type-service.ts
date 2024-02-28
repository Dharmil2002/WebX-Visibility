import { Injectable } from "@angular/core";
import moment from "moment";
import { firstValueFrom } from "rxjs";
import { DocketEvents, DocketStatus, getEnumName } from "src/app/Models/docStatus";
import { ConvertToNumber } from "src/app/Utility/commonFunction/common";
import { financialYear } from "src/app/Utility/date/date-utils";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { StorageService } from "src/app/core/service/storage.service";

@Injectable({
  providedIn: "root",
})
export class VehicleTypeService {
  constructor(
    private operationService: OperationService,
    private storage: StorageService
  ) {}
   async getVehicleTypeList() {
    const reqBody = {
      companyCode: this.storage.companyCode,
      collectionName: "vehicleType_detail",
      filter: {isActive:true},
    }
    const res= await firstValueFrom(this.operationService.operationMongoPost("generic/get", reqBody));
    return res.data.length>0?res.data:[];
   }
}
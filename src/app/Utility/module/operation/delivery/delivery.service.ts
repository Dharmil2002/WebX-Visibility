import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { StorageService } from "src/app/core/service/storage.service";


@Injectable({
  providedIn: "root",
})
export class DeliveryService {
    constructor(
        private operation: OperationService,
        private storage: StorageService
      ) {}
      
    async getDeliveryDetail(filter) {
        const req={
            companyCode:this.storage.companyCode,
            collectionName:"drs_details",
            filter:filter
        }
        const res= await firstValueFrom(this.operation.operationMongoPost('generic/get',req));
        return res.data;
    }

}
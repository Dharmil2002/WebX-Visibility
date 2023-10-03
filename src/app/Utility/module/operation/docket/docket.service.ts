import { Injectable } from "@angular/core";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { OperationService } from "src/app/core/service/operations/operation.service";


@Injectable({
    providedIn: "root",
})
export class DocketService {
    vehicleDetail: any;
    constructor(
        private masterService: MasterService,
        private operation: OperationService
    ) { }

    async updateDocket(data) {
        // Define the request body with companyCode, collectionName, and an empty filter
        const reqBody = {
            companyCode: localStorage.getItem("companyCode"),
            collectionName: "docket_temp",
            filter: {"docketNumber":data},
            update:{"status":"1"}
        };
        // Perform an asynchronous operation to fetch data from the operation service
        const result = await this.operation.operationMongoPut("generic/update", reqBody).toPromise();
        return result;
    }
}
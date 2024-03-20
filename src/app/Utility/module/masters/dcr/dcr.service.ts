import { firstValueFrom } from "rxjs";
import { Injectable } from "@angular/core";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { StorageService } from "src/app/core/service/storage.service";

@Injectable({
  providedIn: "root",
})
export class DCRService {
  constructor(
    private operation: OperationService,
    private storage: StorageService
  ) {}
  async getDCR(filter = {}) {
    const req = {
      companyCode: this.storage.companyCode,
      collectionName: "dcr_header",
      filter: filter,
    };
    const res = await firstValueFrom(
      this.operation.operationMongoPost("generic/get", req)
    );
    return res.data;
  }
  async fetchData(
    masterService,
    collectionName,
    filterCondition,
    nameKey,
    valueKey
  ) {
    try {
      const companyCode = parseInt(localStorage.getItem("companyCode"));
      const req = { companyCode, collectionName };
      const res = await masterService
        .masterPost("generic/get", req)
        .toPromise();
      if (res && res.data) {
        return res.data.filter(filterCondition).map((x) => ({
          name: x[nameKey],
          value: x[valueKey],
        }));
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
    return [];
  }

  async CustomerDetail(masterService) {
    return this.fetchData(
      masterService,
      "customer_detail",
      () => true,
      "customerName",
      "customerCode"
    );
  }
  async userDetail(masterService) {
    return this.fetchData(
      masterService,
      "user_master",
      (x) => x.userType === "Employee",
      "name",
      "userId"
    );
  }
  async vendorDetail(masterService) {
    return this.fetchData(
      masterService,
      "vendor_detail",
      (x) => x.vendorType === 3,
      "vendorName",
      "vendorCode"
    );
  }
}

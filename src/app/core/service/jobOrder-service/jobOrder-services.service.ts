import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { StorageService } from "src/app/core/service/storage.service";
import { MasterService } from "../Masters/master.service";
import { firstValueFrom } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class JobOrderService {
  constructor(
    private http: HttpClient,
    private masterService: MasterService,
    private storage: StorageService
  ) {}
  async CreateJobOrder(data, filter) {
    try {
      const request = {
        companyCode: this.storage.companyCode,
        collectionName: "job_order_headers",
        data: data,
        filter: filter,
      };
      const res = await firstValueFrom(
        this.masterService.masterPost("generic/create", request)
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
  async getJobOrderData(filter) {
    try {
      const request = {
        companyCode: this.storage.companyCode,
        collectionName: "job_order_headers",
        filter: filter,
      };
      const res = await firstValueFrom(
        this.masterService.masterPost("generic/get", request)
      );
      return res.data.length > 0 ? res.data : [];
    } catch (error) {
      console.log(error);
    }
  }
  async updateJobOrder(filter, data: any) {
    const req = {
      companyCode: this.storage.companyCode,
      collectionName: "job_order_headers",
      filter: filter,
      update: data,
    };
    await firstValueFrom(
      this.masterService.masterMongoPut("generic/update", req)
    );
    return true;
  }
  async getJobOrderDatawithFilters(filter) {
    try {
      const request = {
        companyCode: this.storage.companyCode,
        collectionName: "job_order_headers",
        filters: filter,
      };
      const res = await firstValueFrom(
        this.masterService.masterPost("generic/query", request)
      );
      return res.data.length > 0 ? res.data : [];
    } catch (error) {
      console.log(error);
    }
  }
  async getSingleJobOrderData(filter = {}) {
    try {
      const request = {
        companyCode: this.storage.companyCode,
        collectionName: "job_order_headers",
        filter: filter,
        sorting: { jOBNO: -1 },
      };
      const res = await firstValueFrom(
        this.masterService.masterPost("generic/findLastOne", request)
      );
      return res.data ? res.data : [];
    } catch (error) {
      console.log(error);
    }
  }
  async updateWorkOrder(collectionName, filter, data: any) {
    const req = {
      companyCode: this.storage.companyCode,
      collectionName: collectionName,
      filter: filter,
      update: data,
    };
    await firstValueFrom(
      this.masterService.masterMongoPut("generic/update", req)
    );
    return true;
  }
  async getWorkOrderData(filter) {
    try {
      const req = {
        companyCode: this.storage.companyCode,
        collectionName: "work_order_headers",
        filter: filter,
      };
      const res = await firstValueFrom(
        this.masterService.masterPost("generic/get", req)
      );
      return res.data.length > 0 ? res.data : [];
    } catch (error) {
      console.log(error);
    }
  }
  async getSingleWorkOrderData(filter = {}) {
    try {
      const requestObject = {
        companyCode: this.storage.companyCode,
        collectionName: "work_order_headers",
        filter: filter,
        sorting: { wORKNO: -1 },
      };
      const res = await firstValueFrom(
        this.masterService.masterPost("generic/findLastOne", requestObject)
      );
      return res.data ? res.data : [];
    } catch (error) {
      console.log(error);
    }
  }
  async getWorkOrdersWithFilters(filter) {
    try {
      const req = {
        companyCode: this.storage.companyCode,
        collectionName: "work_order_headers",
        filters: filter,
      };
      const res = await firstValueFrom(
        this.masterService.masterPost("generic/query", req)
      );
      return res.data.length > 0 ? res.data : [];
    } catch (error) {
      console.log(error);
    }
  }
}

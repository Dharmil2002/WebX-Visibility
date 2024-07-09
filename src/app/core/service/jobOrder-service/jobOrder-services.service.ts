import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GenericActions, StoreKeys } from "src/app/config/myconstants";
import { environment } from "src/environments/environment";
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
  async getJobOrderData(filter) {
    const request = {
      companyCode: this.storage.companyCode,
      collectionName: "job_order_headers",
      filter: filter,
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", request)
    );
    return res.data.length > 0 ? res.data : []
  }
  async CreateJobOrder(data,filter){
    const request = {
      companyCode: this.storage.companyCode,
      collectionName: "job_order_headers",
      data:data,
      filter: filter,
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/create", request)
    );
    return res.data;
  }
}

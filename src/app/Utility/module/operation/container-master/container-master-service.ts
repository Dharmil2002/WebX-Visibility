import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { StorageService } from "src/app/core/service/storage.service";


@Injectable({
  providedIn: "root",
})
export class ContainerMasterService {
    constructor(
        private operation: OperationService,
        private storage: StorageService
      ) { }

  async getContainerDetail(filter={},isDropdown=false) {
    const req = {
      "companyCode":this.storage.companyCode,
      "filter": filter,
      "collectionName": "container_detail_master"
    }
    const res = await firstValueFrom(this.operation.operationMongoPost('generic/get', req));

    const containerData = isDropdown
        ? res.data?.map(x => ({ name: x.cNNO, value: x.cNNO,containerData:x })) ?? []
        : res.data ?? [];
    return containerData;
  }
  async addContainerStatus(data) {
    const req = {
      "companyCode":this.storage.companyCode,
      "data": data,
      "collectionName": "container_status"
    }
    const res = await firstValueFrom(this.operation.operationMongoPost('generic/create', req));
    return res;
  }
  async getContainerStatus(filter={}) {
    const req = {
    "companyCode":this.storage.companyCode,
    "collectionName": "container_status",
    "filter": filter,
  }
    const res = await firstValueFrom(this.operation.operationMongoPost('generic/findLastOne', req));
    return res;
  }
  async getContainerList(filter={}) {
    const req = {
    "companyCode":this.storage.companyCode,
    "collectionName": "container_status",
    "filter": filter,
  }
    const res = await firstValueFrom(this.operation.operationMongoPost('generic/get', req));
    return res;
  }
}
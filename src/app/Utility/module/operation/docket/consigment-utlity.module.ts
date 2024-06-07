import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { StorageService } from "src/app/core/service/storage.service";

@Injectable({
  providedIn: "root",
})

export class ConsigmentUtility {

  constructor(
    private operationService: OperationService,
    private storage: StorageService
  ){}

  async updatePrq(data,update) {
    const reqBody = {
      companyCode: this.storage.companyCode,
      collectionName: "prq_summary",
      filter: {
        pRQNO: data?.prqNo || data?.prqId || "", // Use the current PRQ ID in the filter
      },
      update:update,
    };
    const res = await firstValueFrom(this.operationService.operationMongoPut("generic/update", reqBody));
    return res;
  }

  async getBillingData(filter={},mODE){
    const req={
      companyCode: this.storage.companyCode,
      collectionName:mODE=="FTL" ?"docket_fin_det":"docket_fin_det_ltl",
      filter:filter,
    }
    const res=await firstValueFrom(this.operationService.operationPost("generic/getOne",req));
    let resultArray=[]
    if(res.data && res.data.dKTNO){
    const mappedValues = res.data.cHG;
     resultArray = mappedValues[0] !== undefined ? mappedValues : [];
    }
    return resultArray;

  }
  async containorConsigmentDetail() {
    const containerReq = {
      companyCode: this.storage.companyCode,
      collectionName: "container_detail",
      filter: {},
    };
    const containerResponse = await this.operationService.operationPost("generic/get", containerReq).toPromise();
    const dropdown = containerResponse.data
      .map((x) => {
        return {
          name: x.containerType,
          value: x.containerType,
          loadCapacity: x.loadCapacity,
        };
      })
      .filter(
        (x) =>
          x.name !== undefined &&
          x.value !== undefined &&
          x.loadCapacity !== undefined
      );

    return dropdown;
  }
  public validationAutocomplete = [
    {
      name: "invalidAutocompleteObject",
      message: "Choose proper value",
    },
    {
      name: "autocomplete",
    },
  ];
}

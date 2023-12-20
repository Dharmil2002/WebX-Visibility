import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { OperationService } from "src/app/core/service/operations/operation.service";

@Injectable({
  providedIn: "root",
})

export class ConsigmentUtility {

  constructor(
    private operationService: OperationService
  ){}

  async updatePrq(data,update) {
    const reqBody = {
      companyCode: localStorage.getItem("companyCode"),
      collectionName: "prq_summary",
      filter: {
        pRQNO: data?.prqNo || data?.prqId || "", // Use the current PRQ ID in the filter
      },
      update:update,
    };
    const res = await firstValueFrom(this.operationService.operationMongoPut("generic/update", reqBody));
    return res;
  }

  async containorConsigmentDetail() {
    const containerReq = {
      companyCode: localStorage.getItem("companyCode"),
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

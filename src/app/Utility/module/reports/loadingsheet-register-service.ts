import { Injectable } from "@angular/core";
import moment from "moment";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
@Injectable({
  providedIn: "root",
})
export class LoadingSheetRegService {
  constructor(
    private masterServices: MasterService,
    private storage: StorageService
  ) {}

  async getloadingsheetReportDetail(data) {
    let matchQuery = {
      ...(data.DocNO != "" ? { lSNO: { D$in: data.DocumentArray } }:
      {D$and: [
        { eNTDT: { D$gte: data.startValue } }, // Convert start date to ISO format
        { eNTDT: { D$lte: data.endValue } }, // Bill date less than or equal to end date
        ...(data.DocNO != "" ? [{ lSNO: { D$in: data.DocumentArray } }] : []),
        ...(data.Location && data.Location != ""
          ? [{ lOC: { D$eq: data.Location } }]
          : []),
      ]}
      ),
    };

    const reqBody = {
      companyCode: this.storage.companyCode,
      reportName: "LoadingsheetRegister",
      filters: {
        filter: {
          ...matchQuery,
        }
      }
    }

    const res = await firstValueFrom(
      this.masterServices.masterMongoPost("generic/getReportData", reqBody)
    );
    const details = res.data.data.map((item) => ({
      ...item,
      LSDateTime : item.LSDateTime ? moment(item.LSDateTime).format("DD MMM YY HH:MM") : "",
      Datetime : item.Datetime ? moment(item.Datetime).format("DD MMM YY HH:MM") : "",
    }));

    return {
      data: details,
      grid: res.data.grid
    };

  }
}



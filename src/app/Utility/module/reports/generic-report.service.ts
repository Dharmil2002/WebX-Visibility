import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
@Injectable({
  providedIn: 'root'
})
export class ReportService{

  constructor(private masterServices: MasterService, private storage: StorageService) { }

  async fetchReportData(reportName, matchQuery) {
    const reqBody = {
      companyCode: this.storage.companyCode,
      reportName: reportName,
      filters: {
        filter: {
          ...matchQuery,
        }
      }
    };

    const res = await firstValueFrom(
      this.masterServices.masterMongoPost("generic/getReportData", reqBody)
    );

    return res;
  }
}

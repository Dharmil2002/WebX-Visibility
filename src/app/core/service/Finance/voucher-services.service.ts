import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StoreKeys } from 'src/app/config/myconstants';
import { environment } from 'src/environments/environment';
import * as StorageService from '../storage.service';
import { MasterService } from '../Masters/master.service';
import { firstValueFrom } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class VoucherServicesService {

  constructor(private http: HttpClient, private masterService: MasterService) { }
  //here is create for post request//
  FinancePost(ApiURL, Request) {
    return this.http.post<any>(`${environment.APIBaseURL}` + ApiURL, Request);
  }

  async GetAccountDetailFromApi() {
    try {
      const companyCode = parseInt(StorageService.getItem(StoreKeys.CompanyCode));
      const filter = {};
      const req = { companyCode, collectionName: 'account_detail', filter };
      const res = await firstValueFrom(this.masterService.masterPost('generic/get', req));
      if (res && res.data) {
        return res.data.map((item) => {
          return {
            LeadgerCode: item.aCCD,
            LeadgerName: item.aCNM,
            LeadgerCategory: item.mRPNM
          };
        });
      }
      else {
        return [];
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
    return [];
  }
}

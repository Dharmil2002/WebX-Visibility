import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Collections, GenericActions } from 'src/app/config/myconstants';
import { DocCalledAsModel } from 'src/app/shared/constants/docCalledAs';
import { StorageService } from '../storage.service';
import { StoreKeys } from 'src/app/config/myconstants';
import { firstValueFrom } from 'rxjs';
import { debug } from 'console';

@Injectable({
  providedIn: 'root',
})
export class ControlPanelService {
  private docCalledAs: DocCalledAsModel = {
    cID: 0,
    Docket: "CNote",
    THC: "Trip",
    LS: "Loadingsheet",
    MF: "Menifest",
    DRS: "Delivery Run Sheet",
  };

  constructor(private http: HttpClient, private storage: StorageService) { 
    this.docCalledAs = {
      cID: 0,
      Docket: "GCN",
      THC: "Trip",
      LS: "Loadingsheet",
      MF: "Menifest",
      DRS: "Delivery Run Sheet",
    };
    this.storage.setItem(StoreKeys.DocCallAs, JSON.stringify(this.docCalledAs));
  }


  async getDocumentNames(companyCode) {
    const req = {
      companyCode: companyCode,
      collectionName: Collections.Doccument_names,
      filter: { cID: companyCode }
    };

    const res = await firstValueFrom(this.http.post<any>(`${environment.APIBaseURL}${GenericActions.GetOne}`, req));
    let config =  res.data;    
    this.docCalledAs = { ...this.docCalledAs, ...config };
    
    this.storage.setItem(StoreKeys.DocCallAs, JSON.stringify(this.docCalledAs));
  }

  get DocCalledAs() {
    
    const data = this.storage.getItem(StoreKeys.DocCallAs);
    return JSON.parse(data);
  }
  async getModuleRules(filter) {
    const req={
      companyCode:this.storage.getItem(StoreKeys.CompanyCode),
      collectionName:"module_rules",
      filter:filter
    }
    const res = await firstValueFrom(this.http.post<any>(`${environment.APIBaseURL}${GenericActions.Get}`, req));
    return res.data;
  }
}

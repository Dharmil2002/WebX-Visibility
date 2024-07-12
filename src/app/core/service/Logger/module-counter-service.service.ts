import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { firstValueFrom } from 'rxjs';
import { ModuleCounter } from '../../models/Logger/ModuleCounterModel';
import { GeolocationService } from '../geo-service/geolocation.service';
import { Router } from '@angular/router';
import { GoogleAnalyticsService } from '../googleAnalytics.service';

@Injectable({
  providedIn: 'root'
})
export class ModuleCounterServiceService {

  MCounterRequest = new ModuleCounter();
  constructor(private http: HttpClient,
    private storage: StorageService,
    private router: Router,
    private GeolocationService: GeolocationService,
    private gAnalyticsService: GoogleAnalyticsService
  ) {
  }
  //#region LogDetails
  /**
   * Retrieves the details of the specified code type from the General_master collection.
   * @param codeType The code type to retrieve the details of.
   * @returns The details of the specified code type.
   */
  async prepareMCounterRequest() {
    const ipAddress = await this.getIpAddress(); // Wait for IP address
    const browserInfo = this.getBrowserInfo(); // No await needed here, unless GeolocationService.getBrowserInfo() returns a Promise
    const location = await this.getLocation(); // Wait for location
    const MenuInfo = this.GetMenuInfo(); // Get Menu Details
    this.MCounterRequest = {
      cID: this.storage.companyCode,
      cNM: this.storage.companyCd,
      uID: this.storage.userName,
      uNM: this.storage.loginName,
      bRCD: this.storage.branch,
      bRNM: this.GetBranchName(),
      eNTDT: new Date(),
      iP: ipAddress,
      bROWSER: {
        nM: browserInfo.nM,
        vR: browserInfo.vR,
      },
      ePOS: {
        tYP: 'Point',
        cDNATES: [location.latitude, location.longitude],
      },
      mID: MenuInfo?.MenuId || 0,
      mNM: MenuInfo?.MenuName || '',
      mCAT: MenuInfo?.Category || '',
      mSCAT: MenuInfo?.SubCategory || '',
    };
    this.gAnalyticsService.initialize()
    this.gAnalyticsService.eventV2('module_counter', this.MCounterRequest);
  }

  async getIpAddress(): Promise<string> {
    const result = await this.GeolocationService.getIpAddress();
    return result;
  }

  getBrowserInfo() {
    const BrowserInfo = this.GeolocationService.getBrowserInfo();
    return {
      nM: BrowserInfo?.name || '',
      vR: BrowserInfo?.version || '',
    };
  }

  async getLocation() {
    return await this.GeolocationService.getLocation();
  }

  GetBranchName() {
    // Read Data From Storage And Find Branch Name
    const LocationList = this.storage.getItem('loginLocations');
    const BranchList = JSON.parse(LocationList);
    const Branch = BranchList.find((x: any) => x.locCode === this.storage.branch);
    return Branch.locName || '';
  }
  GetMenuInfo() {
    // Get Menu Details From Router
    const MenuURI = this.router.url;
    const MenuList = this.storage.getItem('menu');
    const Menu = JSON.parse(MenuList);
    const MenuInfo = Menu.find((x: any) => x.MenuLink === MenuURI);
    return MenuInfo;

  }

}

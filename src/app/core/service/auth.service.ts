import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  firstValueFrom,
  of,
  throwError,
  timer,
} from "rxjs";

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { User } from "../models/user";
import { environment } from "src/environments/environment";
import { map, share } from "rxjs/operators";
import { APICacheService } from "./API-cache.service";
import { StorageService } from "./storage.service";
import { StoreKeys } from "src/app/config/myconstants";
import { LocationService } from "src/app/Utility/module/masters/location/location.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
 
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(
    private http: HttpClient,
    private _jwt: JwtHelperService,
    private _APICacheService: APICacheService,
    private storageService: StorageService,
    private locationService: LocationService
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(this.storageService.getItem(StoreKeys.CurrentUser))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }
  handleError(err) {
    return throwError(err);
  }

  private FilterObs$: BehaviorSubject<any> = new BehaviorSubject(null);

  getFilterObs(): Observable<any> {
    return this.FilterObs$.asObservable();
  }

  setFilterObs(Filter: any) {
    this.FilterObs$.next(Filter);
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  public get isTokenExpired(): boolean {
    let isExpired = true;
    const accessToken = this.storageService.token;
    const refreshToken = this.storageService.refreshToken;
    if(accessToken && accessToken != "") {
      isExpired = this._jwt.isTokenExpired(accessToken);
      if(refreshToken && refreshToken != "") {
        isExpired = isExpired && this._jwt.isTokenExpired(refreshToken);      
      }
    }    
    return isExpired;
  }

  async getCompany() {
    const req={
      companyCode: this.storageService.companyCode,
      collectionName:"company_master",
      filter:{companyCode:this.storageService.companyCode}
    }
    return await firstValueFrom(this.http.post<any>(`${environment.APIBaseURL}/generic/get`, req));
  }
  GetDmsMenu(companyDetails) {

    return this.http.post<any>(`${environment.APIBaseURL}Master/Menu`, companyDetails)
  }
  login(UserRequest) {
    let url = `${environment.AuthAPIGetway}login`;
    return this.http
      .post<any>(url,UserRequest)
      .pipe(
        map(async (user: any) => {
          if (user.tokens) {
           
            let userdetails = this._jwt.decodeToken(user.tokens.access.token);   
            this.storageService.setItem(StoreKeys.CompanyCode, user.usr.companyCode.toString());              
            this.storageService.setItem(StoreKeys.UserId, user.usr.userId);
            this.storageService.setItem(StoreKeys.UserName, user.usr.name);
            this.storageService.setItem(StoreKeys.CurrentUser, JSON.stringify(user));
            this.storageService.setItem(StoreKeys.CurrentBranch, user.usr.branchCode);
            this.storageService.setItem(StoreKeys.Token, user.tokens.access.token);
            this.storageService.setItem(StoreKeys.RefreshToken, user.tokens.refresh.token);
            this.storageService.setItem(StoreKeys.Role, user.usr.role);
            this.storageService.setItem(StoreKeys.Mode, "FTL");
            //localStorage.setItem("company_Name", "Velocity");            
            //this.storageService.setItem("userLocations", user.usr.multiLocation);

            const locations = user.usr?.multiLocation || [];
            var locRes =  await this.locationService.getLocations(
              { locCode: { D$in: locations}, activeFlag: true },
              { locCode: 1, locName: 1 }
              );
            if(locRes && locRes.length > 0){      
              this.storageService.setItem(StoreKeys.UserLocations, locRes.map((x) => x.locCode).join(","));
              this.storageService.setItem(StoreKeys.LoginLocations, JSON.stringify(locRes.map((x) => { return { locCode: x.locCode, locName: x.locName }; })));

              const b = locRes.find((x) => x.locCode == user.usr.branchCode);
              if(b) {
                this.storageService.setItem(StoreKeys.Branch, user.usr.branchCode);
              }
              else {
                this.storageService.setItem(StoreKeys.Branch, locRes[0].locCode);
              }
            }

            this.currentUserSubject.next(user);
            return user;
          }
        })
      );
  }

  refreshtoken() {

    let request = {
      "refreshToken": this.storageService.getItem(StoreKeys.RefreshToken)
    }
    return this.http
      .post<any>(
        `${environment.AuthAPIGetway}refresh-tokens`,
        request
      )
      .pipe(
        share({
          connector: () => new ReplaySubject(1),
          resetOnComplete: () => timer(1000),
        }),
        map((res) => {         
          this.storageService.setItem(StoreKeys.Token, res.access.token);
          this.storageService.setItem(StoreKeys.RefreshToken, res.refresh.token);
          return res;
        })
      );
  }
 async getCompanyDetail(){
    let companyDetails = await this.getCompany();
    return companyDetails.data[0];
  }



  logout() {
    // remove user from local storage to log user out
    this.storageService.clear();
    this.currentUserSubject.next(null);
    return of({ success: false });
  }

}

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
    private storageService: StorageService
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem("currentUser"))
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
            this.storageService.setItem("currentUser", JSON.stringify(user));
            this.storageService.setItem("UserName", user.usr.name);
            this.storageService.setItem("Branch", user.usr.branchCode);
            this.storageService.setItem("companyCode", user.usr.companyCode);
            this.storageService.setItem("Mode", "Export");
            //localStorage.setItem("company_Name", "Velocity");
            this.storageService.setItem("CurrentBranchCode", user.usr.multiLocation[0]);
            this.storageService.setItem("userLocations", user.usr.multiLocation);
            this.storageService.setItem("token", user.tokens.access.token);
            this.storageService.setItem("refreshToken", user.tokens.refresh.token);
            this.storageService.setItem("role", user.usr.role);
            localStorage.setItem("Mode", "Export");
            localStorage.setItem("companyCode", user.usr.companyCode);
            this.currentUserSubject.next(user);
            return user;
          }
        })
      );
  }

  refreshtoken() {

    let request = {
      "refreshToken": this.storageService.getItem('refreshToken')
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
          this.storageService.setItem("token", res.access.token);
          this.storageService.setItem("refreshToken", res.refresh.token);
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
    localStorage.clear();
    this.currentUserSubject.next(null);
    return of({ success: false });
  }

}

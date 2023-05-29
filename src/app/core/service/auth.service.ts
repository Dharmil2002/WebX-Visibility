import {
  BehaviorSubject,
  Observable,
  of,
  throwError,
} from "rxjs";

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { User } from "../models/user";
import { environment } from "src/environments/environment";
import { map} from "rxjs/operators";
import { APICacheService } from "./API-cache.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(
    private http: HttpClient,
    private _jwt: JwtHelperService,
    private _APICacheService: APICacheService
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

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }
  GetCompany(CompanyCode) {

    return this.http.post<any>(`${environment.localHost}Master/Company`, CompanyCode)
  }
  GetDmsMenu(companyDetails) {

    return this.http.post<any>(`${environment.localHost}Master/Menu`, companyDetails)
  }
 
  login(UserRequest) {

    return this.http
      .post<any>(`${environment.localHost}Authenticate/GetToken`, UserRequest)
      .pipe(
        map((user) => {
          localStorage.setItem("currentUser", JSON.stringify(user));
          localStorage.setItem("UserName", user.userName);
          localStorage.setItem("branch", user.branch);
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }
 
 
  GetConnectionInfo() {
    return this.http.post(
      environment.SignalRAPIGetway + "AlertSignalRInfo",
      ""
    );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.clear();
    this.currentUserSubject.next(null);
    return of({ success: false });
  }
 
}

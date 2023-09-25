import { AuthService } from "../service/auth.service";
import { Injectable } from "@angular/core";
import { Location } from '@angular/common';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, switchMap, tap } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  constructor(
    private authenticationService: AuthService,
    private _router: Router, private location: Location
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {


    return next.handle(request).pipe(
      catchError((err) => {


        if (err.status === 401) {

          // auto logout if 401 response returned from api
          if (!this.isRefreshing) {
            this.isRefreshing = true;

            this.authenticationService.refreshtoken().pipe(
              tap(
                (res) => {
                  this.isRefreshing = false;
                },
                (err) => {
                  console.log("Error In Refresh Token : " + err)
                  this.isRefreshing = false;
                  this.authenticationService.logout();
                  location.reload();
                }
              )
            ).subscribe();
          }
        }
        if (err.status === 500) {
          this._router.navigate(["authentication/page500"]);
        }

        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}

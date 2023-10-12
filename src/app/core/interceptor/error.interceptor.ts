import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError, EMPTY } from 'rxjs';
import { retryWhen, catchError, timeout, mergeMap, switchMap, tap } from 'rxjs/operators';

import { Router } from "@angular/router";
import { FailedApiServiceService } from "../service/api-tracking-service/failed-api-service.service";
import { GeolocationService } from "../service/geo-service/geolocation.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {  
  private retryLimit = 3;
  private requestTimeout = 20000; // Adjust the timeout value as needed (in milliseconds)

  constructor(    
    private failedApiService: FailedApiServiceService,
    private geoLocationService: GeolocationService,
    private router: Router
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let attempt = 0;
    
    return next.handle(request).pipe(
      retryWhen(errors =>
        errors.pipe(
          mergeMap((error, index) => {
            if (++attempt >= this.retryLimit) {
              return throwError(() => error);
            }
            if (
              error instanceof HttpErrorResponse &&
              (error.status === 500 || error.status === 502)
            ) {
              // Retry only for 500 and 502 errors
              return EMPTY;
            }
            return throwError(() => error);
          })
        )
      ),
      timeout(this.requestTimeout),
      catchError((error: any) => {
        try {
          let Location=this.geoLocationService.getLocation();
          this.failedApiService.addFailedRequest({
              id: this.failedApiService.getFailedRequests().length+1,
              url:request.url.split("v1/")[1],
              method: request.method,
              request: request.body,
              error: error, // Include error information
              source:request.body.collectionName,
              createdOn: new Date().toUTCString(),
              createdBy: localStorage.getItem("Username") || 'Unknown', // Provide a default value
              createdAt:Location, 
              attempts: 0
            });
        } catch (err) {}
        
        // Handle error, log, and perform additional actions as needed
        console.error('HTTP Request Error:', error);
        switch(error.status)
        {
          case 401:
            return throwError(() => error);
          case 500:
            this.router.navigate(["authentication/page500"]);
            return EMPTY;
          case 502:
            return EMPTY;
          default: 
            return throwError(() => 'An error occurred.');
        }
      })
    );
  }
}

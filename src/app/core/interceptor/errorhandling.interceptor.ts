import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, EMPTY } from 'rxjs';
import { retryWhen, catchError, timeout, mergeMap } from 'rxjs/operators';
import { FailedApiServiceService } from '../service/api-tracking-service/failed-api-service.service';
import { GeolocationService } from '../service/geo-service/geolocation.service';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
  private retryLimit = 3;
  private requestTimeout = 5000; // Adjust the timeout value as needed (in milliseconds)


    constructor(
        private failedApiService: FailedApiServiceService,
        private geoLocationService: GeolocationService
        ) {}

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
              return throwError(error);
            }
            if (
              error instanceof HttpErrorResponse &&
              (error.status === 500 || error.status === 502)
            ) {
              // Retry only for 500 and 502 errors
              return EMPTY;
            }
            return throwError(error);
          })
        )
      ),
      timeout(this.requestTimeout),
      catchError((error: any) => {
        this.failedApiService.addFailedRequest({
            id: this.failedApiService.getFailedRequests().length+1,
            url:request.url.split("v1/")[1],
            method: request.method,
            request: request.body,
            error: error, // Include error information
            source:request.body.collectionName,
            createdOn: new Date().toUTCString(),
            createdBy: localStorage.getItem("Username") || 'Unknown', // Provide a default value
            createdAt:this.geoLocationService.getCurrentLocation, // Use a valid date value
            attempts: 0
          });
        // Handle error, log, and perform additional actions as needed
        console.error('HTTP Request Error:', error);
        if (error.status === 401 || error.status === 400 || error.status === 403) {
          // Handle specific error statuses as needed, e.g., navigate to an error page
          // this.router.navigateByUrl('abort-access', { replaceUrl: true });
        } else if (error.status === 500 || error.status === 502) {
          // Handle specific error statuses as needed, e.g., navigate to an error page
          // this.router.navigateByUrl('server-error', { replaceUrl: true });
          // Do not return the error, return EMPTY to suppress it
          return EMPTY;
        }

        return throwError('An error occurred.');
      })
    );
  }
}

import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError, EMPTY } from "rxjs";
import {
  retryWhen,
  catchError,
  timeout,
  mergeMap,
  switchMap,
  delay,
  scan,
} from "rxjs/operators";
import { FailedApiServiceService } from "../service/api-tracking-service/failed-api-service.service";
import { GeolocationService } from "../service/geo-service/geolocation.service";
import { StorageService } from "../service/storage.service";
import { AuthService } from "../service/auth.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from "@angular/router";

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
  private retryLimit = 3;
  private retryDelayMilliseconds = 1000; // Delay between retry attempts (1 second)
  constructor(
    private failedApiService: FailedApiServiceService,
    private geoLocationService: GeolocationService,
    private authenticationService: AuthService,
    private _jwt: JwtHelperService,
    private router: Router,
    private storageService: StorageService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let attempt = 0;
    let accessToken = this.storageService.getItem("token");

    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return next.handle(request).pipe(
      retryWhen((errors) =>
        errors.pipe(
          scan((retryCount, error) => {
            if (retryCount >= this.retryLimit) {
              throw error; // Stop retrying and propagate the error
            }
            if (
              error instanceof HttpErrorResponse &&
              (error.status === 500 || error.status === 502)
            ) {
              // Retry only for 500 and 502 errors
              return retryCount + 1; // Increment the retry count
            }
            throw error; // Propagate other errors without retrying
          }, 0), // Initialize retry count to 0
          delay(this.retryDelayMilliseconds) // Delay before retrying
        )
      ),
      catchError((error: any) => {
        let Location = this.geoLocationService.getLocation();
        this.failedApiService.addFailedRequest({
          id: this.failedApiService.getFailedRequests().length + 1,
          url: request.url.split("v1/")[1],
          method: request.method,
          request: request.body,
          error: error, // Include error information
          source: request.body.collectionName,
          createdOn: new Date().toUTCString(),
          createdBy: localStorage.getItem("Username") || "Unknown", // Provide a default value
          createdAt: Location,
          attempts: 0,
        });
        // Handle error, log, and perform additional actions as needed
        console.error("HTTP Request Error:", error);
        if (
          error.status === 401 ||
          error.status === 400 ||
          error.status === 403
        ) {
          if (attempt >= this.retryLimit) {
            this.authenticationService.logout();
            location.reload();
          } else {
            attempt++;
            return this.refreshTokenAndRetry(request, next);
          }
        } else if (error.status === 500 || error.status === 502) {
          // Handle specific error statuses as needed, e.g., navigate to an error page
          // this.router.navigateByUrl('server-error', { replaceUrl: true });
          // Do not return the error, return EMPTY to suppress it
          this.router.navigate(["authentication/page500"]);
          return EMPTY;
        }
        return throwError("An error occurred.");
      })
    );
  }
  private refreshTokenAndRetry(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.authenticationService.refreshtoken().pipe(
      mergeMap((res) => {
        if (res) {
          let accessToken = this.storageService.getItem("token");
          req = req.clone({
            setHeaders: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          return next.handle(req);
        } else {
          // If token refresh fails, you can handle it as needed
          // For example, logout the user or redirect to the login page
          this.authenticationService.logout();
          location.reload();
          return EMPTY;
        }
      })
    );
  }
}

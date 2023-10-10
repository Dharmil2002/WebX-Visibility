import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { StorageService } from '../service/storage.service';
import { AuthService } from '../service/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthService,
    private _jwt: JwtHelperService,
    private storageService: StorageService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const excludedPaths = ['/auth/login', '/auth/refresh-tokens'];

    if (!excludedPaths.some(path => request.url.endsWith(path))) {
      request = this.addAuthorizationHeader(request);
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error.status === 401) {
          // Unauthorized error, token might have expired, attempt to refresh
          return this.refreshTokenAndRetry(request, next);
        } else {
          return throwError(error);
        }
      })
    );
  }

  private addAuthorizationHeader(
    request: HttpRequest<any>
  ): HttpRequest<any> {
    const accessToken = this.storageService.getItem('token');

    if (accessToken && !this._jwt.isTokenExpired(accessToken)) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    return request;
  }

  private refreshTokenAndRetry(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.authenticationService.refreshtoken().pipe(
      switchMap((res) => {
        if (res) {
          request = this.addAuthorizationHeader(request);
          return next.handle(request);
        } else {
          // If token refresh fails, you can handle it as needed
          // For example, logout the user or redirect to the login page
          this.authenticationService.logout();
          location.reload();
          return throwError('Token refresh failed');
        }
      })
    );
  }
}

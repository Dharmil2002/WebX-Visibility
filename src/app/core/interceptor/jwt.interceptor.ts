import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { StorageService } from '../service/storage.service';
import { AuthService } from '../service/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { EncryptionService } from '../service/encryptionService.service';
import { environment } from "src/environments/environment";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthService,
    private _jwt: JwtHelperService,
    private storageService: StorageService,
    private encryptionService: EncryptionService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const excludedPaths = ['/auth/login', '/auth/refresh-tokens'];
    const contentType = request.headers.get('Content-Type')?.toLowerCase()?.split(';');

    if (environment.production && ( contentType?.includes('application/json') || !contentType ) &&  request.body) {      
        request = request.clone({
          setHeaders: {
            encrypt: `true`,
          },
        });
    }

    if (request.headers.get('encrypt')) {
      const encryptedData = this.encryptionService.encrypt(JSON.stringify(request.body));

      request = request.clone({
        headers: request.headers,
        body: { data: encryptedData }
      });
    }
    
    if (!excludedPaths.some(path => request.url.endsWith(path))) {

      if(this.isTokenValid()) {
        request = this.addAuthorizationHeader(request);
      }
      else {
        return this.refreshTokenAndRetry(request, next);
      }
      // const accessToken = this.storageService.getItem('token');
      // if(this._jwt.isTokenExpired(accessToken)) {
      //   return this.refreshTokenAndRetry(request, next);
      // }
      // else {
      //   request = this.addAuthorizationHeader(request);
      // }
    }

    return next.handle(request).pipe(
      map(event => {
        if (event instanceof HttpResponse) {         
          if(event.body && event.body.encrypted && event.body.data) {
            const decryptedData = this.encryptionService.decrypt(event.body.data);
            const jsonData = JSON.parse(decryptedData);
            return event.clone({ body: jsonData });
          }
        }
        return event;
      }),
      catchError((error) => {
        if (error.status === 401 && !excludedPaths.some(path => request.url.endsWith(path))) {
          // Unauthorized error, token might have expired, attempt to refresh
          return this.refreshTokenAndRetry(request, next);
        } else {
          return throwError(() => error);
        }
      })
    );
  }


  private addAuthorizationHeader(
    request: HttpRequest<any>
  ): HttpRequest<any> {
    
    const accessToken = this.storageService.getItem('token');
    //&& !this._jwt.isTokenExpired(accessToken)
    if (accessToken && !this._jwt.isTokenExpired(accessToken)) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    return request;
  }

  private isTokenValid(): boolean {
    const accessToken = this.storageService.getItem('token');
    if(accessToken && !this._jwt.isTokenExpired(accessToken)) {
      return true;
    }
    return false;
  }


  private refreshTokenAndRetry(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    var refreshToken = this.storageService.getItem('refreshToken');
    if(!this._jwt.isTokenExpired(refreshToken)) {
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
            return throwError(() => new Error('Token refresh failed'));
          }
        })
      );
    }
    else {
      this.authenticationService.logout();
      location.reload();
      return throwError(() => new Error('Token refresh failed'));
    }
  }
}

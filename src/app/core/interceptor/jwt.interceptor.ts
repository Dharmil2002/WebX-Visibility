import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, catchError, switchMap, tap, throwError } from 'rxjs';
import { StorageService } from '../service/storage.service';
import { AuthService } from '../service/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor( private authenticationService: AuthService, private _jwt: JwtHelperService, private storageService: StorageService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let token:string = this.storageService.getItem('token');
    if (token) {
      if(this._jwt.isTokenExpired(token))
      {
        return this.refreshTokenAndRetry(request, next);
      }
      
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
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

  private refreshTokenAndRetry(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.authenticationService.refreshtoken().pipe(
      switchMap((res) => {
        if (res) {
          let token:string = this.storageService.getItem('token');
          req = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
          return next.handle(req);
        } else {
          // If token refresh fails, you can handle it as needed
          // For example, logout the user or redirect to the login page
          this.authenticationService.logout();
          location.reload();
        }
      })
    );
  }
}


import { ActivatedRoute, Router } from '@angular/router';
import {
  AuthenticationResult,
  EventMessage,
  EventType,
  InteractionStatus,
} from '@azure/msal-browser';
import { Component, OnInit, ViewChild } from '@angular/core';

import { MsalBroadcastService, MsalService } from '@azure/msal-angular';

import { filter, takeUntil } from 'rxjs/operators';

import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: "app-main-layout",
  templateUrl: "./main-layout.component.html",
  styleUrls: [],
})
export class MainLayoutComponent implements OnInit {
  private readonly _destroying$ = new Subject<void>();

  constructor(private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService) { }

  ngOnInit() {
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter(
          (msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS
        ),
        takeUntil(this._destroying$)
      )
      .subscribe((result: EventMessage) => {
        console.log(result);
        const payload = result.payload as AuthenticationResult;
        this.authService.instance.setActiveAccount(payload.account);
      });
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None)
      )
      .subscribe(() => {
        // this.setLoginDisplay();
        this.checkAndSetActiveAccount();
        this.getClaims(
          this.authService.instance.getActiveAccount()?.idTokenClaims
        );
      });
  }

  checkAndSetActiveAccount() {
    /**
     * If no active account set but there are accounts signed in, sets first account to active account
     * To use active account set here, subscribe to inProgress$ first in your component
     * Note: Basic usage demonstrated. Your app may require more complicated account selection logic
     */
    let activeAccount = this.authService.instance.getActiveAccount();

    if (
      !activeAccount &&
      this.authService.instance.getAllAccounts().length > 0
    ) {
      let accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
    }
  }

  // setLoginDisplay() {
  //   this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  // }

  getClaims(claims) {
    console.log(JSON.stringify(claims));
    localStorage.setItem('extension_VLUserId', claims.extension_VLUserId);
    localStorage.setItem('emails', claims.emails);
    localStorage.setItem('given_name', claims.given_name);
    localStorage.setItem('extension_CompanyCode', claims.extension_CompanyCode);
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}

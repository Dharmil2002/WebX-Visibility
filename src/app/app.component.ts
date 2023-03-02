import { Event, NavigationEnd, NavigationStart, Router } from "@angular/router";
import { AuthService } from "./core/service/auth.service";
import { Component } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { PlatformLocation } from "@angular/common";
import { SignalRService } from "./core/service/SignalR.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  myJsonData = [
    { name: 'Item 1', description: 'This is item 1' },
    { name: 'Item 2', description: 'This is item 2' },
    { name: 'Item 3', description: 'This is item 3' }
  ];
  currentUrl: string;
  constructor(
    public appservice: AuthService,
    public _router: Router,
    location: PlatformLocation,
    private spinner: NgxSpinnerService,
    public signalservice: SignalRService
  ) {
    this._router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
        this.spinner.show();
        location.onPopState(() => {
          window.location.reload();
        });
        this.currentUrl = routerEvent.url.substring(
          routerEvent.url.lastIndexOf("/") + 1
        );
      }
      if (routerEvent instanceof NavigationEnd) {
        this.spinner.hide();
      }
      window.scrollTo(0, 0);
    });
  }
  ngOnInit(): void {
    this.appservice.GetConnectionInfo().subscribe((res: any) => {
      let accessToken = res.accessToken;
      const options = {
        accessTokenFactory: async function () {
          if (accessToken) {
            const _accessToken = accessToken;
            return _accessToken;
          }
        },
      };
      this.signalservice.startConnection(res.url, options);
      this.signalservice.addTransferChartDataListener();
    });
  }
}

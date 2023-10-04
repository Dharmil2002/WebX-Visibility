import { Event, NavigationEnd, NavigationStart, Router } from "@angular/router";
import { AuthService } from "./core/service/auth.service";
import { Component, HostListener } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { PlatformLocation } from "@angular/common";
import { FailedApiServiceService } from "./core/service/api-tracking-service/failed-api-service.service";
import { RetryAndDownloadService } from "./core/service/api-tracking-service/retry-and-download.service";


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
    //private failedApiService: FailedApiServiceService,
    //private retryAndDownloadService: RetryAndDownloadService,
    private spinner: NgxSpinnerService
  ) {
    this._router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
        this.spinner.show();
        location.onPopState(() => {
          // window.location.reload();
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

  }
  // // Listen for page reload attempts
  // @HostListener('window:beforeunload', ['$event'])
  // unloadNotification($event: any): void {
  //   this.dowloadData();
  //   // Your custom message
  //   const confirmationMessage = 'Are you sure you want to leave this page? Your changes may not be saved.';
  //   // Set the custom message
  //   $event.returnValue = confirmationMessage;

  // }
  // dowloadData() {
  //   const failedRequests = this.failedApiService.getFailedRequests();
  //   if (failedRequests.length > 0) {
  //     this.retryAndDownloadService.downloadFailedRequests();
  //   }

  // }
}

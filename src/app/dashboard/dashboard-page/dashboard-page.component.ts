import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import{CnoteService} from 'src/app/core/service/Masters/CnoteService/cnote.service'
import { FailedApiServiceService } from 'src/app/core/service/api-tracking-service/failed-api-service.service';
import { RetryAndDownloadService } from 'src/app/core/service/api-tracking-service/retry-and-download.service';
@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html'
})
export class DashboardPageComponent implements OnInit {
  @ViewChild('myTabGroup') tabGroup!: MatTabGroup;

  breadscrums = [
    {
      title: "Network Logistics Management",
      items: ["Home"],
      active: "Network Logistics Management"
    }
  ]
  @ViewChild('myTabGroup') myTabGroup: MatTabGroup;
  detailtab: number;
  constructor(private changeDetectorRef: ChangeDetectorRef,
     private failedApiService: FailedApiServiceService,
     private retryAndDownloadService: RetryAndDownloadService,
     private activeRoute: ActivatedRoute,
     private Route:Router,
     private ICnoteServicevice: CnoteService) {
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
    
    }
   }

  ngOnInit() {
   
  }
  ngAfterContentChecked(): void {
    this.changeDetectorRef?.detectChanges();
  }
  GetSelectedIndex(Index: number) {
    if(Index==2){
   
  }
    this.myTabGroup.selectedIndex = Index;
  }

  ngAfterViewInit(): void {
    this.activeRoute.queryParams.subscribe(params => {
      const selectedTabIndex = params['tab'];
      if (selectedTabIndex) {
        const index = Number(selectedTabIndex);
        this.tabGroup.selectedIndex = index;
      }
    });
  }
    // Listen for page reload attempts
    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any): void {
      this.dowloadData();
      // Your custom message
      const confirmationMessage = 'Are you sure you want to leave this page? Your changes may not be saved.';
      // Set the custom message
      $event.returnValue = confirmationMessage;
  
    }
  dowloadData() {
    const failedRequests = this.failedApiService.getFailedRequests();
    if (failedRequests.length > 0) {
      this.retryAndDownloadService.downloadFailedRequests();
    }

  }
}

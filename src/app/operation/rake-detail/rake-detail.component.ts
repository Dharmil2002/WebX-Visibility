// Import required modules and classes
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { rateDetailMapping } from './rate-utlity';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { getGeneric } from '../rake-update/rake-update-utility';
import { GenericTableComponent } from 'src/app/shared-components/Generic Table/generic-table.component';
import { FailedApiServiceService } from 'src/app/core/service/api-tracking-service/failed-api-service.service';
import { RetryAndDownloadService } from 'src/app/core/service/api-tracking-service/retry-and-download.service';



@Component({
  selector: 'app-rake-detail',
  templateUrl: './rake-detail.component.html'
})
// Define the RakeDetailComponent class
export class RakeDetailComponent implements OnInit {
  // Flag to indicate if data is still loading, used to show loading animation
  tableLoad = true;

  // Metadata for the table
  METADATA = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };

  // Array to store table data
  tableData: any[];

  // Path for adding and editing records
  addAndEditPath: string;

  // Array of links for actions
  linkArray = [{ Row: "Action", Path: "Operation/CHAEntry" }];

  // Configuration for dynamic controls
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  height = '100vw';
  width = '100vw';
  maxWidth: '232vw'
  // Column headers for the table
  columnHeader = {
    RakeNo: {
      Title: "Rake No",
      class: "matcolumncenter",
      Style: "min-width:170px"
    },
    CNNo: {
      Title: "CN No",
      class: "matcolumncenter",
      Style: "",
    },
    BillingParty: {
      Title: "Billing Party",
      class: "matcolumncenter",
      Style: "",
    },
    FromToCity: {
      Title: "From-To City",
      class: "matcolumncenter",
      Style: "",
    },
    JobNo: {
      Title: "Job No",
      class: "matcolumncenter",
      Style: "",
    }
  };

  // List of static fields
  staticField = [
    "RakeNo",
    "CNNo",
    "BillingParty",
    "FromToCity",
    "JobNo",
  ];

  // Constructor for the component
  constructor(@Inject(MAT_DIALOG_DATA) public item: any,
  private masterService: MasterService, 
  public dialogRef: MatDialogRef<GenericTableComponent>, 
  private failedApiService: FailedApiServiceService,
  private retryAndDownloadService: RetryAndDownloadService) { 
     this.getRateDetail(item);
  }

  // Angular lifecycle hook: ngOnInit
  ngOnInit(): void {
    // Initialize component properties and perform any necessary setup
  }
  async getRateDetail(item){
   const getRakeDetail= await getGeneric(this.masterService,"rake_detail")
    const rateDetail=await rateDetailMapping(getRakeDetail,item);
    this.tableData=rateDetail;
    this.tableLoad=false;
  }
  close(){
    this.dialogRef.close();
  }
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

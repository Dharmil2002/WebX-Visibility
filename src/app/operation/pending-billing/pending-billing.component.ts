import { Component, OnInit } from '@angular/core';
import { groupAndCalculate, pendingbilling } from './pending-billing-utlity';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CustomeDatePickerComponent } from 'src/app/shared/components/custome-date-picker/custome-date-picker.component';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pending-billing',
  templateUrl: './pending-billing.component.html'
})
export class PendingBillingComponent implements OnInit {
  tableLoad: boolean = true;// flag , indicates if data is still lodaing or not , used to show loading animation
  tableData: any[];
  addAndEditPath: string;
  drillDownPath: string;
  isTouchUIActivated = false;
  data: any;
  csv: any;
  range: FormGroup;
  uploadComponent: any;
  csvFileName: string; // name of the csv file, when data is downloaded , we can also use function to generate filenames, based on dateTime.
  menuItemflag: boolean = true;
  readonly CustomeDatePickerComponent = CustomeDatePickerComponent;
  orgBranch: string = localStorage.getItem("Branch");
  companyCode: number = parseInt(localStorage.getItem("companyCode"));
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  TableStyle = "width:42%"
  /*Below is Link Array it will Used When We Want a DrillDown
 Table it's Jst for set A Hyper Link on same You jst add row Name Which You
 want hyper link and add Path which you want to redirect*/
  menuItems = [
  ];
  toggleArray = [];
  columnHeader = {
    billingparty: {
      Title: "Customer",
      class: "matcolumnleft",
      Style: "max-width: 220px",
    },
    count: {
      Title: "Shipment",
      class: "matcolumncenter",
      Style: "max-width: 100px",
    },
    pod: {
      Title: "Pod Received",
      class: "matcolumncenter",
      Style: "",
    },
    sum: {
      Title: "Unbilled Amount",
      class: "matcolumncenter",
      Style: "max-width: 90px",
    },
    action: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "max-width: 90px",
    }
  }
  linkArray = [{ Row: "action", Path: "Finance/InvoiceSummaryBill" }];
  staticField = [
    "billingparty",
    "count",
    "pod",
    "sum"
  ]
  METADATA = {
    checkBoxRequired: true,
    // selectAllorRenderedData : false,
    noColumnSort: ["checkBoxRequired"],
  };
  billingDetail: any[];
  constructor(
    private masterService: MasterService,  // Inject MasterService for data retrieval
    private datePipe: DatePipe,            // Inject DatePipe for date formatting
    private DashboardFilterPage: FormBuilder, // Inject FormBuilder for form controls
  ) {

  
    this.get();
    this.range = this.DashboardFilterPage.group({
      start: new FormControl(),  // Create a form control for start date
      end: new FormControl(),    // Create a form control for end date
    });
  }

  ngOnInit(): void {
    const now = new Date();
    const lastweek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 10
    );
    // Set default start and end dates when the component initializes
    this.range.controls["start"].setValue(lastweek);
    this.range.controls["end"].setValue(now);
  }


  async get() {
    this.tableLoad = true;  // Set tableLoad to true while fetching data
   // Fetch billing details asynchronously
   this.billingDetail = await pendingbilling(this.masterService);
    // Format the start and end dates using DatePipe
    const startDate = this.datePipe.transform(this.range.controls.start.value, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    const endDate = this.datePipe.transform(this.range.controls.end.value, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

    // Filter billingDetail based on date range
    const filteredRecords = this.billingDetail.filter(record => {
      const pickUpTime = new Date(record.pickUpTime);
      return startDate <= pickUpTime.toISOString() && pickUpTime.toISOString() < endDate;
    });

    // Group and calculate data for the filtered records
    const groupedData = groupAndCalculate(filteredRecords, 'billingParty', 'contractAmt');

    // Update tableData with the grouped data and set tableLoad to false
    this.tableData = groupedData;
    this.tableLoad = false;
  }

}

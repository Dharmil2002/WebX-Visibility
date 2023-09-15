import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { groupAndSummarize, invoiceDetail } from './invoice-utlity';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CustomeDatePickerComponent } from 'src/app/shared/components/custome-date-picker/custome-date-picker.component';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-invoice-management',
  templateUrl: './invoice-management.component.html'
})
export class InvoiceManagementComponent implements OnInit {
  tableLoad: boolean = true;// flag , indicates if data is still lodaing or not , used to show loading animation
  tableData: any[];
  addAndEditPath: string;
  drillDownPath: string;
  uploadComponent: any;
  csvFileName: string; // name of the csv file, when data is downloaded , we can also use function to generate filenames, based on dateTime.
  menuItemflag: boolean = true;
  orgBranch: string = localStorage.getItem("Branch");
  companyCode: number = parseInt(localStorage.getItem("companyCode"));

  readonly CustomeDatePickerComponent = CustomeDatePickerComponent;
  isTouchUIActivated = false;
  range: FormGroup;
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  TableStyle = "width:60%"
  /*Below is Link Array it will Used When We Want a DrillDown
 Table it's Jst for set A Hyper Link on same You jst add row Name Which You
 want hyper link and add Path which you want to redirect*/
  menuItems = [
  ];
  toggleArray = [];
  columnHeader = {
    customerName: {
      Title: "Customer",
      class: "matcolumnleft",
      Style: "max-width: 220px",
    },
    count: {
      Title: "Invoice Generated​",
      class: "matcolumnleft",
      Style: "max-width: 100px",
    },
    billingAmount: {
      Title: "Value",
      class: "matcolumncenter",
      Style: "max-width: 100px",
    },
    pendingSubmission: {
      Title: "Pending Submission​",
      class: "matcolumncenter",
      Style: "max-width: 220px",
    },
    pValue: {
      Title: "Value​",
      class: "matcolumncenter",
      Style: "max-width: 90px",
    },
    pendingCollection: {
      Title: "Pending Collection​",
      class: "matcolumncenter",
      Style: "max-width: 90px",
    },
    pcValue: {
      Title: "Value​",
      class: "matcolumncenter",
      Style: "max-width: 90px",
    }

  }
  staticField = [
    "customerName",
    "count",
    "billingAmount",
    "pendingSubmission",
    "pValue",
    "pendingCollection",
    "pcValue"
  ]
  METADATA = {
    checkBoxRequired: true,
    // selectAllorRenderedData : false,
    noColumnSort: ["checkBoxRequired"],
  };
  constructor(
    private masterService: MasterService,
    private datePipe: DatePipe,
    private DashboardFilterPage: FormBuilder
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
    const detail = await invoiceDetail(this.masterService);
    // Format the start and end dates using DatePipe
    const startDate = this.datePipe.transform(this.range.controls.start.value, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    const endDate = this.datePipe.transform(this.range.controls.end.value, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

    // Filter billingDetail based on date range
    const filteredRecords = detail.filter(record => {
      const invoiceDate = new Date(record.invoiceDate);
      return startDate <= invoiceDate.toISOString() && invoiceDate.toISOString() < endDate;
    });

    // Group and calculate data for the filtered records
    const additionalFields = {
      pendingSubmission: 0,
      pValue: 0,
      pendingCollection: 0,
      pcValue: 0

    };
    const groupedData = await groupAndSummarize(filteredRecords, "customerName", "billingAmount", additionalFields);
    // Convert the groupedData object into an array of objects
    const groupedArray = Object.values(groupedData);
    this.tableData = groupedArray;
    this.tableLoad = false;
  }

}

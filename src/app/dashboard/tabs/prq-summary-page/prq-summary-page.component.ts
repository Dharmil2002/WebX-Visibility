import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { getPrqDetailFromApi } from './prq-summary-utitlity';

@Component({
  selector: 'app-prq-summary-page',
  templateUrl: './prq-summary-page.component.html'
})
export class PrqSummaryPageComponent implements OnInit {
  summaryCountData: any;
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  METADATA = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };
  dynamicControls = {
    add: true,
    edit: true,
    csv: false,
  };
  //#region create columnHeader object,as data of only those columns will be shown in table.
  // < column name : Column name you want to display on table >

  columnHeader = {
    prqNo: {
      Title: "PRQ No",
      class: "matcolumnleft",
      Style: "min-width:200px",
    },
    vehicleSize: {
      Title: "Vehicle Size",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    billingParty: {
      Title: "Billing Party",
      class: "matcolumnleft",
      Style: "min-width:200px",
    },
    fromToCity: {
      Title: "From-To City",
      class: "matcolumnleft",
      Style: "min-width:200px",
    },
    pickUpDate: {
      Title: "Pick Up Date Time",
      class: "matcolumnleft",
      Style: "min-width:200px",
    },
    status: {
      Title: "Status",
      class: "matcolumnleft",
      Style: "min-width:100px",
    },
    Action: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "min-width:2px",
    },
  };
  //#endregion
  staticField = [
    "prqNo",
    "pickUpDate",
    "billingParty",
    "fromToCity",
    "status",
    "vehicleSize"
  ];
  addAndEditPath: string;
  tableData: any[];
  linkArray = [{ Row: "Action", Path: "Operation/PRQEntry" }];
  constructor(private _masterService:MasterService) {
    this.addAndEditPath = "Operation/PRQEntry";
  }

  ngOnInit(): void {
    this.summaryCountData = [
      {
        Title: "",
        count: 140,
        title: 'PRQ Count',
        count1: 12000,
        title1: "Amount",
        class: "info-box7 bg-success order-info-box7"
      },
      {
        Title: "Total Billed",
        count: 85,
        title: "PRQ Assigned",
        count1: 9500,
        title1: "Amount",
        class: 'info-box7 bg-c-Bottle-light order-info-box7'
      },
      {
        Title: "Total Un-Billed",
        count: 45,
        title: "PRQ Not Assigned",
        count1: 2500,
        title1: "Amount",
        class: 'info-box7 bg-danger order-info-box7'
      },
      {
        Title: "Business Loss",
        count: 12,
        title: "PRQ Rejected",
        count1: 1000,
        title1: "Amount",
        class: 'info-box7 bg-c-Grape-light order-info-box7'
      }
    ];
    this.getPrqDetails();
  }
  async getPrqDetails() {
  
    let data= await getPrqDetailFromApi(this._masterService);
    this.tableData=data;
    this.tableLoad = false;
  }

}

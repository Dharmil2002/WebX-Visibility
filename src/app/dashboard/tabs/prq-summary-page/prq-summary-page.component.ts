import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { getPrqDetailFromApi } from './prq-summary-utitlity';
import { Router } from '@angular/router';
import { showConfirmationDialog } from 'src/app/operation/prq-entry-page/prq-utitlity';

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
    size: {
      Title: "(Vehicle / Container) Size",
      class: "matcolumncenter",
      Style: "min-width:200px",
    },
    billingParty: {
      Title: "Billing Party",
      class: "matcolumnleft",
      Style: "min-width:200px",
    },
    fromToCity: {
      Title: "From-To City",
      class: "matcolumnleft",
      Style: "max-width:150px",
    },
    pickUpDate: {
      Title: "Pick Up Date Time",
      class: "matcolumnleft",
      Style: "min-width:100px",
    },
    status: {
      Title: "Status",
      class: "matcolumnleft",
      Style: "min-width:100px",
    },
    createdDate: {
      Title: "Created Date",
      class: "matcolumnleft",
      Style: "min-width:100px",
    },
    actionsItems: {
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
    "createdDate",
    "size"
  ];
  menuItems = [
    { label: 'Confirm' },
    { label: 'Reject' },
    { label: 'Assign Vehicle' },
    { label: 'Create Docket' },
    { label: 'Modify' },
  ];
  menuItemflag: boolean = true;
  addAndEditPath: string;
  tableData: any[];
  linkArray = [{ Row: "Action", Path: "Operation/PRQEntry" }];
  constructor(private _masterService:MasterService,private router: Router) {
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
   async handleMenuItemClick(data) {
    if (data.label.label === "Assign Vehicle") {
      this._masterService.setassignVehicleDetail(data.data);
      this.router.navigate(['/Operation/AssignVehicle'], {
        state: {
          data: data.data

        },
      });
    }
    else if (data.label.label === "Create Docket") {
      this.router.navigate(['Operation/ConsignmentEntry'], {
        state: {
          data: data.data
        },
      });
    }
    else if (data.label.label === "Confirm") {
      const tabIndex = 6; // Adjust the tab index as needed
      const status="1";
      await showConfirmationDialog(data.data, this._masterService, this.goBack.bind(this),tabIndex,status);
      this.getPrqDetails();
    }
    else if(data.label.label==="Modify"){
      this.router.navigate(['/Operation/PRQEntry'], {
        state: {
          data: data.data
        },
      });
    }
    else if(data.label.label==="Reject"){
      const tabIndex = "PRQ"; 
      const status="3";
      await showConfirmationDialog(data.data, this._masterService, this.goBack.bind(this),tabIndex,status);
      this.getPrqDetails();
    }
    
  }
  goBack(tabIndex: number): void {
    this.router.navigate(['/dashboard/GlobeDashboardPage'], { queryParams: { tab: tabIndex }, state: [] });
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { showConfirmationDialog } from 'src/app/operation/prq-entry-page/prq-utitlity';
import { PrqService } from 'src/app/Utility/module/operation/prq/prq.service';

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
      Title: "Veh/Cont-Size",
      class: "matcolumncenter",
      Style: "min-width:150px",
    },
    billingParty: {
      Title: "Billing Party",
      class: "matcolumnleft",
      Style: "min-width:100px",
    },
    fromToCity: {
      Title: "From-To City",
      class: "matcolumnleft",
      Style: "max-width:150px",
    },
    pickUpDate: {
      Title: "Pk-Up Dt-Time",
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
      Style: "max-width:80px",
    }
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
    { label: 'Add Docket' },
    { label: 'Modify' },
    { label: 'Create THC' },
  ];
  menuItemflag: boolean = true;
  addAndEditPath: string;
  tableData: any[];
  linkArray = [{ Row: "Action", Path: "Operation/PRQEntry" }];
  boxData: { count: number; title: string; class: string; }[];
  allPrq: any;
  constructor(
    private router: Router,
    private prqService:PrqService
    ) {
    this.addAndEditPath = "Operation/PRQEntry";
  }

  ngOnInit(): void {
    this.getPrqDetails();
  }
  async getPrqDetails() {
  
    let data= await this.prqService.getPrqDetailFromApi();
    this.tableData=data.tableData;
    this.allPrq=data.allPrqDetail;
    this.getPrqKpiCount();
    this.tableLoad = false;
  }
   async handleMenuItemClick(data) {
    if (data.label.label === "Assign Vehicle") {
      this.prqService.setassignVehicleDetail(data.data);
      this.router.navigate(['/Operation/AssignVehicle'], {
        state: {
          data: data.data

        },
      });
    }
    else if (data.label.label === "Add Docket") {
      this.router.navigate(['Operation/ConsignmentEntry'], {
        state: {
          data: data.data
        },
      });
    }
    else if (data.label.label === "Confirm") {
      const tabIndex = 6; // Adjust the tab index as needed
      const status="1";
      await this.prqService.showConfirmationDialog(data.data, this.goBack.bind(this),tabIndex,status);
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
      const status="5";
      await this.prqService.showConfirmationDialog(data.data, this.goBack.bind(this),tabIndex,status);
      this.getPrqDetails();
    }
    else if(data.label.label==="Create THC")
    this.router.navigate(['/Operation/thc-create'], {
      state: {
        data: data.data
      },
    });
  }
  goBack(tabIndex: number): void {
    this.router.navigate(['/dashboard/GlobeDashboardPage'], { queryParams: { tab: tabIndex }, state: [] });
  }

//Kpi count 
  getPrqKpiCount() {
    const createShipDataObject = (
      count: number,
      title: string,
      className: string
    ) => ({
      count,
      title,
      class: `info-box7 ${className} order-info-box7`,
    });
      const prqAssign=this.allPrq.filter((x)=>x.status=="2");
      const notPrqAssign=this.allPrq.filter((x)=>x.status=="1");
      const rejectAssign=this.allPrq.filter((x)=>x.status=="5");
    const shipData = [
      createShipDataObject(this.allPrq.length, "PRQ Count", "bg-c-Bottle-light"),
      createShipDataObject(prqAssign.length, "PRQ Assigned", "bg-c-Grape-light"),
      createShipDataObject(notPrqAssign.length, "PRQ Not Assigned", "bg-c-Daisy-light"),
      createShipDataObject(rejectAssign.length, "PRQ Rejected", "bg-c-Grape-light"),
    ];
    this.boxData=shipData
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import { getThcDetail } from '../thc-generation/thc-utlity';
import { formatDate } from 'src/app/Utility/date/date-utils';
import { showConfirmationDialogThc } from './thc-update-utlity';
import { MatDialog } from '@angular/material/dialog';
import { ThcUpdateComponent } from 'src/app/dashboard/tabs/thc-update/thc-update.component';

@Component({
  selector: 'app-thc-summary',
  templateUrl: './thc-summary.component.html'
})
export class ThcSummaryComponent implements OnInit {
  //here the declare the flag
  tableLoad: boolean;
  METADATA = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };
  //add dyamic controls for generic table
  dynamicControls = {
    add: true,
    edit: true,
    csv: false,
  };
  tableData: any[];
  TableStyle = "width:60%"
  //#region create columnHeader object,as data of only those columns will be shown in table.
  // < column name : Column name you want to display on table >
  columnHeader = {
    tripId: {
      Title: "THC No",
      class: "matcolumnleft",
      Style: "max-width:200px",
    },
    route: {
      Title: "Route",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    vehicle: {
      Title: "Vehicle No",
      class: "matcolumnleft",
      Style: "max-width:150px",
    },
    loadedKg: {
      Title: "Loaded Kg",
      class: "matcolumncenter",
      Style: "max-width:150px",
    }, 
    updateDate: {
      Title: "CreateAt",
      class: "matcolumnleft",
      Style: "max-width:150px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "max-width:150px",
    }
  };
  //#endregion
  staticField = [
    "tripId",
    "route",
    "vehicle",
    "loadedKg",
    "updateDate",
  ];
  addAndEditPath: string;
  menuItemflag: boolean = true;
  menuItems = [{label:"Update THC"},{label:"Delivered"}];

  //here declare varible for the KPi
  boxData: { count: number; title: string; class: string; }[];
  constructor(
    private _operationService:OperationService,
    private router: Router,
    public dialog: MatDialog
    ) { 
      this.getThcDetails();
      this.addAndEditPath = "Operation/thc-create";
     
    }

    //here the code which is get details of Thc Which is Display in Fron-end
  async getThcDetails() {
    const thcList = await getThcDetail(this._operationService);
    const thcDetail= thcList.data
    .map((item) => {
      if (item.updateDate) {
        item.updateDate = formatDate(item.updateDate, 'dd-MM-yy HH:mm');
        item.actions = item?.status === "1" ? ["Update THC"] :["Delivered"]
      }
      return item;
    });
    this.tableData =thcDetail;
   
   this.tableLoad=false;
  }

  ngOnInit(): void {
  }
  async handleMenuItemClick(data) {
    if (data.label.label === "Update THC") {
      const dialogref = this.dialog.open(ThcUpdateComponent, {
        width: "800px",
        height: "400px",
        data: data.data,
      });
      dialogref.afterClosed().subscribe((result) => {
          this.getThcDetails();
      });
    }
    
  }
  goBack(tabIndex: number): void {
    this.router.navigate(['/dashboard/GlobeDashboardPage'], { queryParams: { tab: tabIndex }, state: [] });
  }
}

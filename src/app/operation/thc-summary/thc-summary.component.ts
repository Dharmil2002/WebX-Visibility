import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import { getThcDetail } from '../thc-generation/thc-utlity';
import { formatDate } from 'src/app/Utility/date/date-utils';
import { MatDialog } from '@angular/material/dialog';

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
  branch:string=localStorage.getItem("Branch");
  //add dyamic controls for generic table
  dynamicControls = {
    add: true,
    edit: false,
    csv: false,
  };
  tableData: any[];
  TableStyle = "width:80%"
  //#region create columnHeader object,as data of only those columns will be shown in table.
  // < column name : Column name you want to display on table >
  columnHeader = {
    tripId: {
      Title: "THC No",
      class: "matcolumncenter",
      Style: "min-width:210px",
    },
    route: {
      Title: "Route",
      class: "matcolumncenter",
      Style: "max-width:200px",
    },
    vehicle: {
      Title: "Vehicle No",
      class: "matcolumncenter",
      Style: "max-width:130px",
    },
    loadedKg: {
      Title: "Loaded Kg",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    updateDate: {
      Title: "CreateAt",
      class: "matcolumncenter",
      Style: "max-width:250px",
    },
    statusAction:{
      Title:"Status",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumncenter",
      Style: "max-width:100px",
    }
  };
  //#endregion
  staticField = [
    "route",
    "vehicle",
    "loadedKg",
    "statusAction",
    "updateDate",
  ];
  linkArray = [
    { Row: 'tripId', Path: 'Operation/thc-view'},
  ]
  addAndEditPath: string;
  menuItemflag: boolean = true;
  menuItems = [{label:"Update THC"},{label:"Delivered"},{label:"View"}];

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
      const action= item.closingBranch.toLowerCase() === this.branch.toLowerCase();
      if (item.updateDate) {
        item.updateDate = formatDate(item.updateDate, 'dd-MM-yy HH:mm');
        item.statusAction=item?.status === "1" ? "In Transit" :"Delivered",
        item.actions =item.status === "1" && action?  ["Update THC","View"] :item.status === "1"?["View"]:["Delivered","View"];
      }
      return item;
    });
    this.tableData =thcDetail;

   this.tableLoad=false;
  }

  ngOnInit(): void {
  }
  async handleMenuItemClick(data) {
    const thcDetail=this.tableData.find((x)=>x._id===data.data._id);
    if (data.label.label === "Update THC") {
      this.router.navigate([this.addAndEditPath], {
        state: {
          data: {data:thcDetail,isUpdate:true},
        },
      });
    }
    if (data.label.label === "View") {
      this.router.navigate([this.addAndEditPath], {
        state: {
          data: {data:thcDetail,isView:true},
        },
      });
      // const dialogref = this.dialog.open(ThcViewComponent, {
      //   width: "800px",
      //   height: "500px",
      //   data: data.data,
      // });
      // dialogref.afterClosed().subscribe((result) => {
      // });
    }

  }
  goBack(tabIndex: number): void {
    this.router.navigate(['/dashboard/Index'], { queryParams: { tab: tabIndex }, state: [] });
  }
}

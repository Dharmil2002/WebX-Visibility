import { Component, HostListener, OnInit } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { getGeneric, rakeFieldMapping } from './rake-update-utility';
import { RakeDetailComponent } from '../rake-detail/rake-detail.component';

@Component({
  selector: 'app-rake-update',
  templateUrl: './rake-update.component.html'
})
export class RakeUpdateComponent implements OnInit {
  tableLoad: boolean = true;
  tableData: any;
  boxData: any;
  METADATA = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };
  dynamicControls = {
    add: false,
    edit: true,
    csv: false,
  };
  columnHeader = {
    RakeNo: {
      Title: "Rake No",
      class: "matcolumnleft",
      Style: "min-width:170px",
    },
    RakeEntryDate: {
      Title: "Rake Entry Date",
      class: "matcolumnleft",
      Style: "min-width:100px",
    },
    RRNo: {
      Title: "RRNo",
      class: "matcolumnleft",
      Style: "min-width:120px",
    },
    ContainerNo: {
      Title: "Container No",
      class: "matcolumnleft",
      Style: "min-width:200px",
    },
    FromToCity: {
      Title: "From-To City",
      class: "matcolumnleft",
      Style: "min-width:100px",
    },
    Weight: {
      Title: "Weight",
      class: "matcolumncenter",
      Style: "min-width:1px",
    },
    BillingParty: {
      Title: "Billing Party",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    CNNo: {
      Title: "CN No",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    JobNo: {
      Title: "Job No",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    CurrentStatus: {
      Title: "Current Status",
      class: "matcolumnleft",
      Style: "min-width:100px",
    },
    Action: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "min-width:200px",
    },
  };
  //#endregion
  staticField = [
    "SlNo",
    "RakeNo",
    "RakeEntryDate",
    "RRNo",
    "ContainerNo",
    "FromToCity",
    "Weight",
    "CurrentStatus"
  ];
  linkArray = [
    { Row: 'Action', Path: 'Operation/Handover', componentDetails: "" },
    { Row: 'BillingParty', Path: '', componentDetails: RakeDetailComponent },
    { Row: 'CNNo', Path: '', componentDetails: RakeDetailComponent },
    { Row: 'JobNo', Path: '', componentDetails: RakeDetailComponent }
  ]
  menuItems = [
    { label: "CNNo", componentDetails: RakeDetailComponent },
    { label: "JobNo", componentDetails: RakeDetailComponent },
    { label: "BillingParty", componentDetails: RakeDetailComponent }
    // Add more menu items as needed
  ];
  constructor(
    private masterService: MasterService
    ) { }

  ngOnInit(): void {
    this.getRakeDetail();
    this.getDashboadData();
  }
  getDashboadData() {
    this.boxData = [
      {
        "count": 10,
        "title": "In-Transit Containers - Loaded",
        "class": "info-box7 bg-c-Bottle-light order-info-box7"
      },
      {
        "count": 10,
        "title": "In-Transit Container - Empty",
        "class": "info-box7 bg-c-Grape-light order-info-box7"
      },
      {
        "count": 10,
        "title": "Available Container",
        "class": "info-box7 bg-c-Daisy-light order-info-box7"
      },
      {
        "count": 10,
        "title": "Mis-Routed Container",
        "class": "info-box7 bg-c-Grape-light order-info-box7"
      },

    ];
  }
  async getRakeDetail() {
    const detail = await getGeneric(this.masterService, "rake_detail");
    const rakeDetail = await rakeFieldMapping(detail);
    this.tableData = rakeDetail;
    this.tableLoad = false;
  }
 
}

import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { rakeUpdateDetail } from './rake-update-utility';

@Component({
  selector: 'app-rake-update',
  templateUrl: './rake-update.component.html'
})
export class RakeUpdateComponent implements OnInit {
  tableLoad:boolean=true;
  tableData: any;
  boxData:any;
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
      Style: "min-width:200px",
    },
    RakeEntryDate: {
      Title: "Rake Entry Date",
      class: "matcolumnleft",
      Style: "min-width:200px",
    },
    TrainName: {
      Title: "Train Name",
      class: "matcolumnleft",
      Style: "min-width:2px",
    },
    TrainNo: {
      Title: "Train No",
      class: "matcolumnleft",
      Style: "min-width:250px",
    },
    RRNo: {
      Title: "RRNo",
      class: "matcolumnleft",
      Style: "min-width:250px",
    },
    ContainerNo: {
      Title: "Container No",
      class: "matcolumnleft",
      Style: "min-width:110px",
    },
    FromCity: {
      Title: "From City",
      class: "matcolumnleft",
      Style: "min-width:2px",
    },
    ToCity: {
      Title: "To City",
      class: "matcolumnleft",
      Style: "min-width:2px",
    },
    IsEmpty: {
      Title: "IsEmpty",
      class: "matcolumnleft",
      Style: "min-width:200px",
    },
    Weight: {
      Title: "Weight",
      class: "matcolumnleft",
      Style: "min-width:200px",
    },
    BillingParty: {
      Title: "Billing Party",
      class: "matcolumnleft",
      Style: "min-width:200px",
    },
    CNNo: {
      Title: "CN No",
      class: "matcolumnleft",
      Style: "min-width:200px",
    },
    JobNo: {
      Title: "Job No",
      class: "matcolumnleft",
      Style: "min-width:200px",
    },
    CurrentStatus: {
      Title: "Current Status",
      class: "matcolumnleft",
      Style: "min-width:200px",
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
    "TrainName",
    "TrainNo",
    "RRNo",
    "ContainerNo",
    "FromCity",
    "ToCity",
    "IsEmpty",
    "Weight",
    "BillingParty",
    "CNNo",
    "JobNo",
    "CurrentStatus"
  ];
  linkArray = [
    { Row: 'Action', Path: 'Operation/HandedOver',componentDetails: ""}
  ]
  constructor(private masterService: MasterService) {  }

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
  async getRakeDetail(){
   
    const detail= await rakeUpdateDetail(this.masterService) ;
    this.tableData=detail;
    this.tableLoad=false;
  }

}

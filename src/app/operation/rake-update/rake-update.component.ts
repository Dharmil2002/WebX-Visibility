import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { getGeneric, rakeFieldMapping } from './rake-update-utility';

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
      Style: "min-width:100px",
    },
    TrainName: {
      Title: "Train Name",
      class: "matcolumnleft",
      Style: "min-width:2px",
    },
    TrainNo: {
      Title: "Train No",
      class: "matcolumnleft",
      Style: "min-width:120px",
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
    FromCity: {
      Title: "From City",
      class: "matcolumnleft",
      Style: "min-width:1px",
    },
    ToCity: {
      Title: "To City",
      class: "matcolumnleft",
      Style: "min-width:1px",
    },
    IsEmpty: {
      Title: "IsEmpty",
      class: "matcolumnleft",
      Style: "min-width:1px",
    },
    Weight: {
      Title: "Weight",
      class: "matcolumncenter",
      Style: "min-width:1px",
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
    const detail= await getGeneric(this.masterService,"rake_detail") ;
    const jobDetail= await getGeneric(this.masterService,"job_detail") ;
    const rakeDetail=await rakeFieldMapping(detail,jobDetail);
    this.tableData=rakeDetail;
    this.tableLoad=false;
  }

}

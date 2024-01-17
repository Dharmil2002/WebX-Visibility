import { Component, HostListener, OnInit } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { getGeneric, rakeFieldMapping } from './rake-update-utility';
import { RakeDetailComponent } from '../rake-detail/rake-detail.component';
import { Router } from '@angular/router';
import { RakeEntryService } from 'src/app/Utility/module/operation/rake-entry/rake-entry-service';

@Component({
  selector: 'app-rake-update',
  templateUrl: './rake-update.component.html'
})
export class RakeUpdateComponent implements OnInit {
  tableLoad: boolean = true;
  menuItemflag:boolean=true;
  tableData: any;
  boxData: any;
  filterColumn:boolean=true;
  METADATA = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };
  dynamicControls = {
    add: true,
    edit: true,
    csv: false,
  };
  columnHeader = {
    RakeNo: {
      Title: "Rake No",
      class: "matcolumnleft",
      Style: "min-width:250px",
    },
    RakeEntryDate: {
      Title: "Rake Entry Date",
      class: "matcolumnleft",
      Style: "min-width:100px",
    },
    RRNo: {
      Title: "RRNo",
      class: "matcolumnleft",
      Style: "max-width:70px",
    },
    ContainerNo: {
      Title: "Cont No",
      class: "matcolumnleft",
      Style: "max-width:70px",
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
      Style: "max-width:70px",
    },
    // JobNo: {
    //   Title: "Job No",
    //   class: "matcolumncenter",
    //   Style: "min-width:2px",
    // },
    CurrentStatus: {
      Title: "Current Status",
      class: "matcolumnleft",
      Style: "min-width:100px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "min-width:200px",
    },
  };
  menuItems = [{ label: "Updated" }];
  //#endregion
  staticField = [
    "SlNo",
    "RakeNo",
    "RakeEntryDate",
    "RRNo",
    "ContainerNo",
    "FromToCity",
    "Weight",
    "CurrentStatus",
    "iconName"
  ];
  linkArray = [
   // { Row: 'Action', Path: 'Operation/Handover', componentDetails: "" },
    { Row: 'BillingParty', Path: '', componentDetails: RakeDetailComponent },
    { Row: 'CNNo', Path: '', componentDetails: RakeDetailComponent },
    { Row: 'JobNo', Path: '', componentDetails: RakeDetailComponent }
  ]
  
  addAndEditPath: string;
  allColumnFilter:any;

  constructor(
    private masterService: MasterService,
    private rakeService:RakeEntryService,
    private router: Router
    ) { 
       this.allColumnFilter=this.columnHeader;
       this.addAndEditPath='Operation/RakeEntry'
    }

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
    const rakeDetail = await this.rakeService.getRakeDetail();
    this.tableData = rakeDetail;
    this.tableLoad = false;
  }
  handleMenuItemClick(data) {
 if(data.label.label=='Updated'){
      this.router.navigate(['Operation/Handover'], {
        state: {
          data: data.data,
          flag:'Updated'
        },
      });
    }
}


}

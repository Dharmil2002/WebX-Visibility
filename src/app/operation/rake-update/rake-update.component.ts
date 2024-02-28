import { filter } from 'rxjs/operators';
import { Component, HostListener, OnInit } from '@angular/core';
import { RakeDetailComponent } from '../rake-detail/rake-detail.component';
import { Router } from '@angular/router';
import { RakeEntryService } from 'src/app/Utility/module/operation/rake-entry/rake-entry-service';
import { ContainerMasterService } from 'src/app/Utility/module/operation/container-master/container-master-service';
import { StorageService } from 'src/app/core/service/storage.service';

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
      Style: "min-width:158px",
    },
    RRNo: {
      Title: "RRNo",
      class: "matcolumnleft",
      Style: "max-width:70px",
    },
    ContainerNo: {
      Title: "Cont No",
      class: "matcolumnleft",
      Style: "min-width:110px",
    },
    FromToCity: {
      Title: "From-To City",
      class: "matcolumnleft",
      Style: "min-width:150px",
    },
    Weight: {
      Title: "Weight",
      class: "matcolumncenter",
      Style: "min-width:1px",
    },
    BillingParty: {
      Title: "Billing Party",
      class: "matcolumncenter",
      Style: "min-width:130px",
    },
    CNNo: {
      Title: "CN No",
      class: "matcolumncenter",
      Style: "min-width:70px",
    },
    // JobNo: {
    //   Title: "Job No",
    //   class: "matcolumncenter",
    //   Style: "min-width:2px",
    // },
    CurrentStatus: {
      Title: "Current Status",
      class: "matcolumnleft",
      Style: "min-width:150px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "max-width:65px",
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
    { Row: 'BillingParty', Path: '', componentDetails: RakeDetailComponent,title:"billingPartyDetails"},
    { Row: 'CNNo', Path: '', componentDetails: RakeDetailComponent,title:"cnNos"}
  ]

  addAndEditPath: string;
  allColumnFilter:any;

  constructor(
    private rakeService:RakeEntryService,
    private containerMasterService:ContainerMasterService,
    private storage:StorageService,
    private router: Router
    ) {
       this.allColumnFilter=this.columnHeader;
       this.addAndEditPath='Operation/RakeEntry'
    }

  ngOnInit(): void {
    this.getRakeDetail();
  }

  async getRakeDetail() {
    const rakeDetail = await this.rakeService.getRakeDetail();
    const containerList= await this.containerMasterService.getContainerList({cID:this.storage.companyCode,"D$or":[{oRG:this.storage.branch},{dEST:this.storage.branch}]});
    this.boxData = [
      {
        "count": containerList.data.filter((x)=>x.sTS==2 && x.isEMPT=="N").length,
        "title": "In-Transit Containers - Loaded",
        "class": "info-box7 bg-c-Bottle-light order-info-box7"
      },
      {
        "count": containerList.data.filter((x)=>x.sTS==2 && x.isEMPT=="Y").length,
        "title": "In-Transit Container - Empty",
        "class": "info-box7 bg-c-Grape-light order-info-box7"
      },
      {
        "count":  containerList.data.filter((x)=>x.sTS==1).length,
        "title": "Available Container",
        "class": "info-box7 bg-c-Daisy-light order-info-box7"
      },
      {
        "count": 0,
        "title": "Mis-Routed Container",
        "class": "info-box7 bg-c-Grape-light order-info-box7"
      },

    ];
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

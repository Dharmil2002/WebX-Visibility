import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { DocketService } from 'src/app/Utility/module/operation/docket/docket.service';
import { ThcService } from "src/app/Utility/module/operation/thc/thc.service";
import { ControlPanelService } from 'src/app/core/service/control-panel/control-panel.service';
import { StorageService } from 'src/app/core/service/storage.service';

@Component({
  selector: 'app-docket-list',
  templateUrl: './docket-list.component.html'
})
export class DocketListComponent implements OnInit {
    /*Below is for the table displaye data */
    filterColumn:boolean=true;
    allColumnFilter:any;
    tableData: any;
    tableLoad: boolean;
    orgBranch: string = "";
    TableContainerStyle = "height:500px!important";
    docCalledAs: any;
    formTitle = "Docket List";

   /* column header is for the changes css or title in the table*/
  columnHeader = {    
    billingParty: {
      Title: "Billing Party",
      class: "matcolumnleft",
      Style: "min-width:300px",
      sticky: true
    },
    docNo: {
      Title: "Shipment",
      class: "matcolumnleft",
      Style: "min-width:220px",
      type:'windowLink',
      functionName:'OpenCnote',
      sticky: true
    },
    ftCity: {
      Title: "From-To City",
      class: "matcolumnleft",
      Style: "min-width:150px",
    },
    aCTWT: {
      Title: "Actual Weight(Kg)",
      class: "matcolumnright",
      Style: "min-width:150px; max-width:150px",
    },
    pKGS: {
      Title: "Package Count",
      class: "matcolumnright",
      Style: "min-width:100px; max-width:100px",
    },
    fRTAMT: {
      Title: "FV(₹)",
      class: "matcolumnright",
      Style: "min-width:150px; max-width:150px",
    },
    //  invoiceCount: {
    //   Title: "Inv Count",
    //   class: "matcolumncenter",
    //   Style: "max-width:70px",
    // },
    status:{
      Title: "Status",
      class: "matcolumncenter",
      Style: "min-width:80px",
    },
    createOn: {
      Title: "Created Date",
      class: "matcolumncenter",
      Style: "min-width:150px",
      datatype: 'datetime'
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "max-width:65px",
      stickyEnd: true
    }
  };
  //#endregion

  /*which field you displayed in a table Must Declare here*/
  staticField = [
    "billingParty",
    "ftCity",
    "actualWeight",
    "aCTWT",
    "pKGS",
    "tOTAMT",
    "fRTAMT",
    "status",
    "createOn"
  ];

  /*.......End................*/
  /* here the varible declare for menu Item option Both is required */
  menuItems = []
  menuItemflag: boolean = true;
  //  TableStyle = "width:90%"
  /*.......End................*/
  /*Here the Controls which Is Hide search or add Button in table*/
  dynamicControls = {
    add: true,
    edit: false,
    csv: false,
  };
  /*.......End................*/

  addAndEditPath = 'Operation/ConsignmentEntry';
  // menuItems = [{label:"Edit Docket"},{label:"View"}];

  constructor(
    private router: Router,
    private docketService: DocketService,
    private thcService: ThcService,
    private locationService: LocationService,
    private storage: StorageService,
    private controlPanel: ControlPanelService
  ) {
    this.orgBranch = this.storage.branch;
    this.docCalledAs = this.controlPanel.DocCalledAs;
    this.columnHeader.docNo.Title = this.docCalledAs.Docket;
    this.formTitle = `${this.docCalledAs.Docket} List`;
    this.menuItems = [
      { label: `Edit ${this.docCalledAs.Docket}` }
    ]

    this.getShipmentDetail();
    this.allColumnFilter = this.columnHeader

  }

  ngOnInit(): void {
  }

  async getShipmentDetail() {

    const loc = await this.locationService.getLocation( { companyCode: this.storage.companyCode, locCode: this.storage.branch } );
    /*below the method to get docket Detail using service*/
    
    const shipmentList = await this.docketService.getDocketsDetails(loc.locCity);
    this.tableData = await this.docketService.processShipmentList(shipmentList)
    this.tableLoad = false;
    /*end*/
  }

  async handleMenuItemClick(data) {
    const { label } = data.label;

    switch (label) {
      case `Edit ${this.docCalledAs.Docket}`:
        this.router.navigate(['/Operation/ConsignmentEntry'], {
          state: { data: data.data },
        });
        break;
      case `Create ${this.docCalledAs.THC}`:
        this.router.navigate(['/Operation/thc-create'], {
          state: { data: { data: data.data, addThc: true, viewType: 'addthc' } },
        });
        break;
      case "Rake Update":
        this.goBack('Job');
        break;
      default:
        // Handle any other cases here
        break;
    }
  }

  goBack(tabIndex: string): void {
    this.router.navigate(["/dashboard/Index"], {
      queryParams: { tab: tabIndex },
      state: [],
    });
  }
  functionCallHandler(event) {
    console.log(event);
    try {
      this[event.functionName](event.data);
    } catch (error) {
      console.log("failed");
    }
  }
  OpenCnote(data) {
    const templateBody = {
      templateName: "Docket",
      partyCode: "CONSRAJT58",
      DocNo: data.docNo,
    }
    const url = `${window.location.origin}/#/Operation/view-print?templateBody=${JSON.stringify(templateBody)}`;
    window.open(url, '', 'width=1000,height=800');
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocketService } from 'src/app/Utility/module/operation/docket/docket.service';
import { ThcService } from "src/app/Utility/module/operation/thc/thc.service";

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
    orgBranch: string = localStorage.getItem("Branch");
   /* column header is for the changes css or title in the table*/
  columnHeader = {
    createOn: {
      Title: "Created On",
      class: "matcolumnleft",
      Style: "max-width:150px",
    },
    billingParty: {
      Title: "Billing Party",
      class: "matcolumnleft",
      Style: "max-width:300px",
    },
    docketNumber: {
      Title: "Shipment",
      class: "matcolumnleft",
      Style: "min-width:300px",
      type:'windowLink',
      functionName:'OpenCnote'
    },
    ftCity: {
      Title: "From-To City",
      class: "matcolumncenter",
      Style: "max-width:200px",
    },
    actualWeight: {
      Title: "Act Wt(Kg)",
      class: "matcolumncenter",
      Style: "max-width:70px",
    },
    totalPkg: {
      Title: "Pkg Count",
      class: "matcolumncenter",
      Style: "max-width:70px",
    },
    totalAmount: {
      Title: "FV(₹)",
      class: "matcolumncenter",
      Style: "max-width:70px",
    },
     invoiceCount: {
      Title: "Inv Count",
      class: "matcolumncenter",
      Style: "max-width:70px",
    },
    status:{
      Title: "Status",
      class: "matcolumncenter",
      Style: "min-width:140px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "max-width:100px",
    }
  };
  //#endregion

  /*which field you displayed in a table Must Declare here*/
  staticField = [
    "billingParty",
    "ftCity",
    "actualWeight",
    "totalPkg",
    "totalAmount",
    "invoiceCount",
    "status",
    "createOn"
  ];

  /*.......End................*/
  /* here the varible declare for menu Item option Both is required */
  menuItems=[
    {label:"Edit Docket"},
    {label:"Rake Update"},
    {label:"Create THC"}
  ]
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

  addAndEditPath='Operation/ConsignmentEntry';
  // menuItems = [{label:"Edit Docket"},{label:"View"}];

  constructor(    
    private router: Router,
    private docketService:DocketService,
    private thcService: ThcService
    ) {
    this.getShipmentDetail();
    this.allColumnFilter=this.columnHeader
  }

  ngOnInit(): void {
  }

  async getShipmentDetail() {
   /*below the method to get docket Detail using service*/
    const shipmentList = await this.thcService.getShipment(false);
    this.tableData = await this.docketService.processShipmentList(shipmentList,this.orgBranch)
    this.tableLoad = false;
    /*end*/
  }

  async handleMenuItemClick(data) {
    const { label } = data.label;
  
    switch (label) {
      case "Edit Docket":
        this.router.navigate(['/Operation/ConsignmentEntry'], {
          state: { data: data.data },
        });
        break;
      case "Create THC":
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
  OpenCnote(data){
    const templateBody = {
      DocNo:data.docketNumber,
      templateName:'docket'
    }
    const url = `${window.location.origin}/#/Operation/view-print?templateBody=${JSON.stringify(templateBody)}`;
    window.open(url,'','width=1000,height=800');
  }
}

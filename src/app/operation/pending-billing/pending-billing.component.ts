import { Component, OnInit } from '@angular/core';
import { pendingbilling } from './pending-billing-utlity';
import { MasterService } from 'src/app/core/service/Masters/master.service';

@Component({
  selector: 'app-pending-billing',
  templateUrl: './pending-billing.component.html'
})
export class PendingBillingComponent implements OnInit {
  tableLoad:boolean=true;// flag , indicates if data is still lodaing or not , used to show loading animation
  tableData: any[];
  addAndEditPath: string;
  drillDownPath: string;
  uploadComponent: any;
  csvFileName: string; // name of the csv file, when data is downloaded , we can also use function to generate filenames, based on dateTime.
  menuItemflag: boolean = true;
  orgBranch: string = localStorage.getItem("Branch");
  companyCode: number = parseInt(localStorage.getItem("companyCode"));
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  TableStyle = "width:42%"
    /*Below is Link Array it will Used When We Want a DrillDown
   Table it's Jst for set A Hyper Link on same You jst add row Name Which You
   want hyper link and add Path which you want to redirect*/
   menuItems = [
   ];
   toggleArray = [];
   columnHeader = { 
  customer: {
    Title: "Customer",
    class: "matcolumnleft",
    Style: "max-width: 220px",
  },
  shipment: {
    Title: "Shipment",
    class: "matcolumncenter",
    Style: "max-width: 100px",
  },
  Podreceived: {
    Title: "Pod Received",
    class: "matcolumncenter",
    Style: "",
  },
  UnbilledAmount: {
    Title: "Unbilled Amount",
    class: "matcolumncenter", 
    Style: "max-width: 90px",
  },
  Action:{
    Title: "Action",
    class: "matcolumnleft",
    Style: "max-width: 90px",
  }
}
linkArray = [{ Row: "Action", Path: "" }];
staticField = [
  "customer",
  "shipment",
  "Podreceived",
  "UnbilledAmount"
]
   METADATA = {
    checkBoxRequired: true,
    // selectAllorRenderedData : false,
    noColumnSort: ["checkBoxRequired"],
  };
  constructor(private masterService: MasterService) { 
    this.getbillingDetail()
  }

  ngOnInit(): void {
  }
  async getbillingDetail(){
    const detail= await pendingbilling(this.masterService) ;
    this.tableData=detail;
    this.tableLoad=false;
  }
  
}

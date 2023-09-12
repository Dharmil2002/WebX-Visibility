import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import{invoiceBilling} from 'src/app/operation/invoice-management/invoice-utlity';
@Component({
  selector: 'app-invoice-management',
  templateUrl: './invoice-management.component.html'
})
export class InvoiceManagementComponent implements OnInit {
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
  TableStyle = "width:60%"
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
  invoiceGenerated: {
    Title: "Invoice Generated​",
    class: "matcolumnleft",
    Style: "max-width: 100px",
  },
  value: {
    Title: "Value",
    class: "matcolumncenter",
    Style:  "max-width: 100px",
  },
  pendingSubmission: {
    Title: "Pending Submission​",
    class: "matcolumncenter", 
    Style: "max-width: 220px",
  },
  pValue: {
    Title: "Value​",
    class: "matcolumncenter", 
    Style: "max-width: 90px",
  },
  pendingCollection: {
    Title: "Pending Collection​",
    class: "matcolumncenter", 
    Style: "max-width: 90px",
  },
  pcValue: {
    Title: "Value​",
    class: "matcolumncenter", 
    Style: "max-width: 90px",
  }
 
}
staticField = [
  "customer",
  "invoiceGenerated",
  "value",
  "pendingSubmission",
  "pValue",
  "pendingCollection",
  "pcValue"
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
    const detail= await invoiceBilling(this.masterService) ;
    this.tableData=detail;
    this.tableLoad=false;
  }

}

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
})
export class StocksComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  jsonUrl = '../../../assets/data/stocks.json'
  data: [] | any;
  tableload = true; // flag , indicates if data is still lodaing or not , used to show loading animation 
  csv: any[];
  addAndEditPath: string
  drillDownPath: string
  uploadComponent: any;
  csvFileName: string; // name of the csv file, when data is downloaded , we can also use function to generate filenames, based on dateTime. 
  companyCode: number;
  menuItemflag: boolean = true;
  breadscrums = [
    {
      title: "Docket Stock",
      items: ["Dashboard"],
      active: "Docket Stock"
    }
  ]
  METADATA = {
    checkBoxRequired: true,
    // selectAllorRenderedData : false,
    noColumnSort: ['checkBoxRequired']
  }
  dynamicControls = {
    add: false,
    edit: true,
    csv: false
  }
  /*Below is Link Array it will Used When We Want a DrillDown
   Table it's Jst for set A Hyper Link on same You jst add row Name Which You
   want hyper link and add Path which you want to redirect*/
  linkArray = [
    { Row: 'Action', Path: 'Masters/Docket/EwayBillDocketBooking' }
  ]
  menuItems = [
    { label: 'Create Run Sheet' },
    // Add more menu items as needed
  ];
  //Warning--It`s Used is not compasary if you does't add any link you just pass blank array
  /*End*/
  toggleArray = []
  //#region create columnHeader object,as data of only those columns will be shown in table.
  // < column name : Column name you want to display on table > 

  columnHeader = {
    "No": "Cnote",
    "Date": "Date",
    "PaymentType": "Pay-Type",
    "ContractParty": "Contract Party",
    "Origin-Destination": "Org-Dest",
    "FromCity-ToCity": "Leg",
    "NoofPackages": "Packages",
    "ActualWeight": "Act-Wt(Kg)",
    "ChargedWeight": "Chrg-Wt(Kg)",
    "Status": "Status",
    "Action": "Action"
  }
  //#endregion
  //#region declaring Csv File's Header as key and value Pair
  headerForCsv = {
    "No": "Cnote",
    "Date": "Date of Cnote",
    "PaymentType": "Payment Type",
    "ContractParty": "Contract Party",
    "Origin-Destination": "Origin-Destination",
    "FromCity-ToCity": "From City-To City",
    "NoofPackages": "No of Packages",
    "ActualWeight": "Actual Weight",
    "ChargedWeight": "Charged Weight",
    "Status": "Status",
    // "Action": "Action"
  }
  //#endregion
  // IscheckBoxRequired: boolean;
  // advancdeDetails: { data: { label: string; data: any; }; viewComponent: any; };
  // viewComponent: any;
  boxData: { count: any; title: any; class: string; }[];
  // declararing properties
  constructor(private http: HttpClient, private Route: Router) {
    super();
  }
  ngOnInit(): void {
    this.getRunSheetDetails();
  }
  getRunSheetDetails() {
    // Fetch data from the JSON endpoint
    this.http.get(this.jsonUrl).subscribe((res: any) => {
      this.data = res;
      this.csv = this.data['tabledata']
      this.boxData = this.data['StockCountData']
      // Extract relevant data arrays from the response
      //const tableArray = this.data['tabledata'];
      this.tableload = false;
    }
    );
  }
}

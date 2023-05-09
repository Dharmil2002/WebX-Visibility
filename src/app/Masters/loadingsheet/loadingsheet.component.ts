import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-loadingsheet',
  templateUrl: './loadingsheet.component.html'
})
export class LoadingsheetComponent {
  jsonUrl = '../../../assets/data/tableDataSmaple.json'
  data: [] | any;
  tableload = true; // flag , indicates if data is still lodaing or not , used to show loading animation 
  uploadComponent: any;
  csvFileName: string; // name of the csv file, when data is downloaded , we can also use function to generate filenames, based on dateTime. 
  companyCode: number;
  //#region create columnHeader object,as data of only those columns will be shown in table.
  // < (column name) : Column name you want to display on table > 
  columnHeader = {
    "checkBoxRequired": "",
    "Docket": "Docket",
    "Count": "Count",
    "TotalPackage": "TotalPackage",
    "TotalWeight": "TotalWeight",
    "TotalCFT": "TotalCFT",
    "VehicleCapacity": "VehicleCapacity"
  }

  METADATA = {
    checkBoxRequired: true,
    selectAllorRenderedData: false,
    noColumnSort: ['checkBoxRequired']
  }
  //#endregion
  IscheckBoxRequired: boolean;
  selectItems = [
    { label: 'RouteCode', options: ['Option 1', 'Option 2', 'Option 3'] },
    { label: 'RouteSchedule', options: ['Option A', 'Option B', 'Option C'] }
  ];
  divcol: string = "col-xl-3 col-lg-3 col-md-12 col-sm-12 mb-2";
  breadscrums = [
    {
      title: "Loading Sheet",
      items: ["Masters"],
      active: "Loading Sheet",
    },
  ]
  index: number;
  csv: any;

  constructor(private http: HttpClient) {
    // super();
    this.csvFileName = "exampleUserData.csv";
    this.IscheckBoxRequired = true;
  }
  ngOnInit(): void {
    this.index=0;
    this.http.get(this.jsonUrl).subscribe(res => {
      this.data = res;
      this.csv = this.data['data'];
      this.tableload = false;
    });
    try {
      this.companyCode = parseInt(localStorage.getItem("CompanyCode"));
    } catch (error) {
      // if companyCode is not found , we should logout immmediately.
    }
  }
  generatels() {

  }
  Showlist() {
    this.index = 1;
  }
}

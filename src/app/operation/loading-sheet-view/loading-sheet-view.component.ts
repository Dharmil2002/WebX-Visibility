import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { CreateLoadingSheetComponent } from '../create-loading-sheet/create-loading-sheet.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loading-sheet-view',
  templateUrl: './loading-sheet-view.component.html'
})
export class LoadingSheetViewComponent implements OnInit {
  jsonUrl = '../../../assets/data/shipmentDetails.json'
  data: [] | any;
  tableload = true; // flag , indicates if data is still lodaing or not , used to show loading animation 
  csv: any[];
  addAndEditPath: string
  drillDownPath: string
  extraData:any
  uploadComponent: any;
  csvFileName: string; // name of the csv file, when data is downloaded , we can also use function to generate filenames, based on dateTime. 
  companyCode: number;
  dynamicControls = {
    add: false,
    edit: false,
    csv: true
  }
  linkArray = [
  ]
  //declaring breadscrum
  breadscrums = [
    {
      title: "Loading-sheet",
      items: ["Loading"],
      active: "Update Shipments"
    }
  ]
  toggleArray=[]
  IscheckBoxRequired: boolean;
  menuItemflag: boolean = true;

  menuItems = [
    { label: 'Create Trip', componentDetails: CreateLoadingSheetComponent, function: "GeneralMultipleView" },
    { label: 'Update Trip', componentDetails: CreateLoadingSheetComponent, function: "GeneralMultipleView" },
    // Add more menu items as needed
  ];
  columnHeader = {
    "checkBoxRequired": "",
    "Shipment": "Shipment",
    "Customer": "Vehicle No",
    "Origin": "Trip ID",
    "Destination": "Scheduled",
    "Packages": "Expected",
    "Weight": "Status",
    "Volume": "Hrs",
  }
 //#region declaring Csv File's Header as key and value Pair
  headerForCsv = {
    "Shipment": "Shipment",
    "Customer": "Vehicle No",
    "Origin": "Trip ID",
    "Destination": "Scheduled",
    "Packages": "Expected",
    "Weight": "Status",
    "Volume": "Hrs",
  }

  METADATA = {
    checkBoxRequired: false,
    // selectAllorRenderedData : false,
    noColumnSort: ['checkBoxRequired']
  }
  loadinSheet: any;
  dataDetails: any;
  //#endregion


  constructor(private http: HttpClient,private Route: Router) {
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.loadinSheet = this.Route.getCurrentNavigation()?.extras?.state.data.columnData;
      this.extraData=this.Route.getCurrentNavigation()?.extras?.state.data.extraData;
      
      this.IscheckBoxRequired=true;
    }
    this.getLoadingSheetDetails()
  }


  ngOnInit(): void {

  }

  handleMenuItemClick(label: any) {
    if (label.label.label === 'Create Trip') {
      Swal.fire("Loading Sheet");
    }
    // Perform some action when a menu item is clicked in the child component
  }
  IsActiveFuntion(data) {
    this.dataDetails = data;
  }
  updateShipping(){
    this.createLoadingSheetData()
  }
  getLoadingSheetDetails() {
    this.http.get(this.jsonUrl).subscribe(res => {
      this.data = res;
      let tableArray = this.data.NestedSingmentData.filter((x)=>x.leg==this.loadinSheet.lag);
     let Shipment=[]
      this.extraData.forEach(element => {
        Shipment.push(element.Shipment)
      });
      if (Shipment) {
        tableArray.forEach((element) => {
          if (Shipment.includes(element.Shipment)) {
            element.isSelected = true;
          }
        });
      }
      
      this.csv = tableArray;
      // console.log(this.csv);
      this.tableload = false;

    });
  }
createLoadingSheetData(){
  this.Route.navigate(['Operation/CreateLoadingSheet'], {
    state: {
      shipping: this.dataDetails?this.dataDetails:this.csv.filter((x)=>x.isSelected==true),
    },
  });
}
    goBack(): void {
      this.createLoadingSheetData()
    }

}

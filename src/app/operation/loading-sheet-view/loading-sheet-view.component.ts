import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GenericTableComponent } from '../../shared-components/Generic Table/generic-table.component';
import { CnoteService } from '../../core/service/Masters/CnoteService/cnote.service';

@Component({
  selector: 'app-loading-sheet-view',
  templateUrl: './loading-sheet-view.component.html'
})
export class LoadingSheetViewComponent implements OnInit {
  jsonUrl = '../../../assets/data/arrival-dashboard-data.json'
  data: [] | any;
  tableload = true; // flag , indicates if data is still lodaing or not , used to show loading animation 
  csv: any[];
  addAndEditPath: string
  drillDownPath: string
  extraData: any
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
  toggleArray = []
  IscheckBoxRequired: boolean;
  menuItemflag: boolean = true;

  menuItems = [
  ];
  columnHeader = {
    "checkBoxRequired": "",
    "Shipment": "Shipment",
    "Origin": "Origin",
    "Destination": "Destination",
    "Packages": "Packages",
    "KgWeight": "Weight",
    "CftVolume": "Volume",
  };
 centerAlignedData = ['Shipment', 'Packages', 'KgWeight', 'CftVolume'];

  //#region declaring Csv File's Header as key and value Pair
  headerForCsv = {
    "Shipment": "Shipment",
    "Origin": "Origin",
    "Destination": "Destination",
    "Packages": "Packages",
    "KgWeight": "Weight",
    "CftVolume": "Volume",
  }

  METADATA = {
    checkBoxRequired: false,
    // selectAllorRenderedData : false,
    noColumnSort: ['checkBoxRequired']
  }
  loadinSheet: any;
  dataDetails: any;
  //#endregion


  constructor(private http: HttpClient, private Route: Router,private cnoteService: CnoteService,public dialogRef: MatDialogRef<GenericTableComponent>, @Inject(MAT_DIALOG_DATA) public item: any) {
    if (item) {
      this.loadinSheet = item;
      //this.extraData=this.Route.getCurrentNavigation()?.extras?.state.data.extraData;

      this.IscheckBoxRequired = true;
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
  updateShipping() {

    let jsonShipping = {
      shipping: this.dataDetails ? this.dataDetails : this.csv.filter((x) => x.isSelected == true)
    }
    this.dialogRef.close(jsonShipping)
  }
  getLoadingSheetDetails() {

    this.http.get(this.jsonUrl).subscribe(res => {
      this.data = res;
      let ShipingDatadetails=this.cnoteService.getShipingData();
      let tableArray = ShipingDatadetails.filter((x)=>x.Leg === this.loadinSheet.lag)
      let packagesData = this.data.packagesData.filter((x) =>
        tableArray.some((shipment) => shipment.Shipment === x.Shipment));
      let mergedData: any[] = [];

      // Perform inner join based on Shipment key
      mergedData = tableArray.filter((shippingItem) =>
        packagesData.some((packageItem) => packageItem.Shipment === shippingItem.Shipment)
      ).map((shippingItem) => {
        const matchingPackage = packagesData.find((packageItem) => packageItem.Shipment === shippingItem.Shipment);
        return { ...shippingItem, ...matchingPackage };
      });

      // The mergedData array now contains the merged result based on the Shipment key

      let Shipment: any[] = []
      // this.extraData.forEach(element => {
      //   Shipment.push(element.Shipment)
      // });
      if (Shipment) {
        tableArray.forEach((element) => {
          if (Shipment.includes(element.Shipment)) {
            element.isSelected = true;
          }
        });
      }

      this.csv = mergedData;
      // console.log(this.csv);
      this.tableload = false;

    });
  }
  createLoadingSheetData() {
    
    this.Route.navigate(['Operation/CreateLoadingSheet'], {
      state: {
        shipping: this.dataDetails ? this.dataDetails : this.csv.filter((x) => x.isSelected == true),
      },
    });
  }
  goBack(): void {
    this.dialogRef.close()
  }

}

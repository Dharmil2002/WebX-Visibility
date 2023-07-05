import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { GenericTableComponent } from '../../shared-components/Generic Table/generic-table.component';
import { CnoteService } from '../../core/service/Masters/CnoteService/cnote.service';
import { OperationService } from 'src/app/core/service/operations/operation.service';

@Component({
  selector: 'app-loading-sheet-view',
  templateUrl: './loading-sheet-view.component.html'
})
export class LoadingSheetViewComponent implements OnInit {
  arrivalData: [] | any;
  tableload = true; // flag , indicates if data is still lodaing or not , used to show loading animation 
  tableData: any[];
  addAndEditPath: string
  uploadComponent: any;
  csvFileName: string; // name of the csv file, when data is downloaded , we can also use function to generate filenames, based on dateTime. 
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
  menuItemflag: boolean;

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

  constructor(
    private cnoteService: CnoteService,
    private operationService: OperationService,
    public dialogRef: MatDialogRef<GenericTableComponent>,
    @Inject(MAT_DIALOG_DATA) public item: any
  ) {
    if (item) {
      this.loadinSheet = item;
      this.IscheckBoxRequired = true;
    }
    this.getLoadingSheetDetails();
  }
  


  ngOnInit(): void {

  }

  IsActiveFuntion(data) {
    this.dataDetails = data;
  }
  updateShipping() {
    // Create a JSON object with the shipping details
    let jsonShipping = {
      shipping: this.dataDetails ? this.dataDetails : this.tableData.filter((x) => x.isSelected == true)
    };
  
    // Close the dialog and pass the JSON object as the result
    this.dialogRef.close(jsonShipping);
  }

  getLoadingSheetDetails() {
  // Retrieve arrival data from the operation service
  this.operationService.getJsonFileDetails('arrivalUrl').subscribe(res => {
    this.arrivalData = res;

    // Retrieve shipping data from the cnote service
    let ShipingDatadetails = this.cnoteService.getShipingData();

    // Filter tableArray based on the specified condition
    let tableArray = ShipingDatadetails.filter((x) => x.Leg === this.loadinSheet.lag);

    // Filter packagesData based on the specified condition
    let packagesData = this.arrivalData.packagesData.filter((x) =>
      tableArray.some((shipment) => shipment.Shipment === x.Shipment)
    );

    let mergedData: any[] = [];

    // Perform inner join based on Shipment key
    mergedData = tableArray.filter((shippingItem) =>
      packagesData.some((packageItem) => packageItem.Shipment === shippingItem.Shipment)
    ).map((shippingItem) => {
      const matchingPackage = packagesData.find((packageItem) => packageItem.Shipment === shippingItem.Shipment);
      return { ...shippingItem, ...matchingPackage };
    });

    // The mergedData array now contains the merged result based on the Shipment key

    let Shipment: any[] = [];

    // Check if Shipment array is not empty
    if (Shipment) {
      // Set isSelected to true for elements in tableArray that are present in Shipment
      tableArray.forEach((element) => {
        if (Shipment.includes(element.Shipment)) {
          element.isSelected = true;
        }
      });
    }

    this.tableData = mergedData;

    this.tableload = false;
  });
}

  goBack(): void {
    this.dialogRef.close()
  }

}

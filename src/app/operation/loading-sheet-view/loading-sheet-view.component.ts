import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GenericTableComponent } from '../../shared-components/Generic Table/generic-table.component';
import { CnoteService } from '../../core/service/Masters/CnoteService/cnote.service';
import { OperationService } from 'src/app/core/service/operations/operation.service';

@Component({
  selector: 'app-loading-sheet-view',
  templateUrl: './loading-sheet-view.component.html'
})
export class LoadingSheetViewComponent implements OnInit {
  /* Business logic separation is pending in this code. 
Currently, all flows are working together without proper separation.
 The separation will be implemented by Dhaval Patel.
  So, no need to worry about it for now. */
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
  companyCode = parseInt(localStorage.getItem("companyCode"));
  menuItems = [
  ];
  columnHeader = {
    "checkBoxRequired": "",
    "dKTNO": "Shipment",
    "sFX": "Suffix",
    "cLOC": "Current Location",
    "oRGN": "Origin",
    "dEST": "Destination",
    "pKGS": "Packages",
    "aCTWT": "Weight",
    "cFTTOT": "Volume",
  };
  columnWidths = {
    'dKTNO': 'min-width:20%',
    'sFX': 'min-width:1%'
  };
  centerAlignedData = ['Shipment','Suffix', 'Packages', 'KgWeight', 'CftVolume'];

  //#region declaring Csv File's Header as key and value Pair
  headerForCsv = {
    "dKTNO": "Shipment",
    "sFX": "Suffix",
    "cLOC": "Current Location",
    "oRGN": "Origin",
    "dEST": "Destination",
    "pKGS": "Packages",
    "aCTWT": "Weight",
    "cFTTOT": "Volume",
  }

  METADATA = {
    checkBoxRequired: false,
    // selectAllorRenderedData : false,
    noColumnSort: ['checkBoxRequired']
  }
  loadingSheet: any;
  dataDetails: any;
  //#endregion

  constructor(
    public dialogRef: MatDialogRef<GenericTableComponent>,
    @Inject(MAT_DIALOG_DATA) public item: any
  ) {
     
    if (item) {
      this.loadingSheet = item;
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
    const shipment=this.tableData.filter((x) => x.isSelected == true)
    // Close the dialog and pass the JSON object as the result
    this.dialogRef.close(shipment);
  }

  getLoadingSheetDetails() {
    this.tableData = this.loadingSheet.items.map(x => {
      return { ...x, leg: this.loadingSheet.leg };
  });
  
      this.tableload = false;
  }

  goBack(): void {
    this.dialogRef.close()
  }
 
}

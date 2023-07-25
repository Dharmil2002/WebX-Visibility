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
  companyCode=parseInt(localStorage.getItem("companyCode"));
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
  
    const req = {
      companyCode: this.companyCode,
      type: "operation",
      collection: "docket",
    };
  // Retrieve arrival data from the operation service
  this.operationService.operationPost('common/getall',req).subscribe(res => {
    const shipingDetails = res.data;
    let tableArray =shipingDetails.filter((x) => {
      const orgLoc = x.orgLoc ? x.orgLoc.toLowerCase().trim() : '';
      const legParts = this.loadinSheet.leg.split('-');
      const legPart1 = legParts[0] ? legParts[0].toLowerCase().trim() : '';
      const legPart2 = legParts[1] ? legParts[1].toLowerCase().trim() : '';
    
      return orgLoc === legPart1 && x.destination.split(':')[1]?.toLowerCase().trim() === legPart2 && x.lsNo=="";
    });
    
    const shipmentDetails = tableArray.map((item) => ({
      Shipment: item.docketNumber,
      Origin: item.orgLoc,
      Destination: item.destination.split(':')[1].trim(),
      Packages: parseInt(item.totalChargedNoOfpkg),
      KgWeight: parseInt(item.chrgwt),
      CftVolume: parseInt(item.cft_tot),
    }));
    this.tableData = shipmentDetails;

    this.tableload = false;
  });
}

  goBack(): void {
    this.dialogRef.close()
  }

}

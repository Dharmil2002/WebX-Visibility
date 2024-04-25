import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GenericTableComponent } from '../../shared-components/Generic Table/generic-table.component';
import { CnoteService } from '../../core/service/Masters/CnoteService/cnote.service';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { DocketStatus } from 'src/app/Models/docStatus';
import { firstValueFrom } from 'rxjs';
import moment from 'moment';

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
  companyCode = 0;
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
    private storage: StorageService,
    private operationService: OperationService,
    public dialogRef: MatDialogRef<GenericTableComponent>,
    @Inject(MAT_DIALOG_DATA) public item: any
  ) {
     this.companyCode = this.storage.companyCode;
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
    debugger
    // Create a JSON object with the shipping details
    const shipment=this.tableData.filter((x) =>
      //`${x.cLOC}-${x.dEST}`== this.loadingSheet.leg  || 
      x.isSelected == true
    )
    // Close the dialog and pass the JSON object as the result
    this.dialogRef.close(shipment);
  }

  async getShipmentInStock(routeLocs: string[], fromDate: Date, toDate: Date, dktNotIn: string[] = []) {
      const dest = this.loadingSheet.leg.split('-')[1];
      routeLocs =  routeLocs.filter(x => x != dest);
      const req = {
        companyCode: this.storage.companyCode,
        collectionName: "docket_ops_det_ltl",
        filter: {
          'D$and': [
            { cLOC: this.storage.branch },
            { 'D$or': [
                {'D$and': [
                  { sTSTM: { 'D$gte': fromDate } },
                  { sTSTM: { 'D$lte': toDate } },  
                ]},
                { dEST: { 'D$eq': dest } }
            ]},
            { dEST: { 'D$nin': [...new Set([this.storage.branch, ...routeLocs])] } },
            { sTS: { 'D$in': [DocketStatus.Booked, DocketStatus.In_Transhipment_Stock] } },
            ...((dktNotIn && dktNotIn.length > 0) ? [{ dKTNO: { 'D$nin': dktNotIn } }] : [] ),
            { 'D$or': [{ lSNO: { "D$exists": false } }, { lSNO: "" }] }
          ]
        }
      };
      const result = await firstValueFrom(this.operationService.operationMongoPost("generic/get", req));
      if(result && result.data) {
        return result.data || [];
      }
  }

  async getLoadingSheetDetails() {
    
    let selectedDkts = this.loadingSheet.items.map(x => x.dKTNO) || [];
    let otherDkts  = this.loadingSheet.selectedDkts || [];
    selectedDkts = [... new Set([...selectedDkts, ...otherDkts])] ;
    
    const fromDate = moment(new Date()).add(-60, 'days').toDate();
    const toDate = moment(new Date()).endOf('day').toDate();
    const otherDockets = await this.getShipmentInStock(this.loadingSheet.routeLocs || [], fromDate, toDate, selectedDkts || []);    
    debugger;
    let data = [...this.loadingSheet.items, ...otherDockets];
    data.forEach(f => { f['dIndex'] = (`${f.cLOC}-${f.dEST}` == this.loadingSheet.leg) ? 1 : 2 });

    data = data.sort((a, b) => {
      const legComparison = a.dIndex - b.dIndex;
      if (legComparison !== 0) {
          return legComparison;
      }
      const statusComparison = `${a.cLOC}-${a.dEST}`.localeCompare(`${b.cLOC}-${b.dEST}`);
      if (statusComparison !== 0) {
          return statusComparison;
      }
      return a.dKTNO.localeCompare(b.dKTNO);
    });

    this.tableData = data.map(x => {
      return { ...x, leg: this.loadingSheet.leg };
    });
  
    this.tableload = false;
  }

  goBack(): void {
    this.dialogRef.close()
  }
 
}

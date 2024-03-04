import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import {UntypedFormGroup } from '@angular/forms';
import { CnoteService } from '../../../core/service/Masters/CnoteService/cnote.service';
import { ViewPrintComponent } from '../../view-print/view-print.component';
import { runningNumber } from 'src/app/Utility/date/date-utils';
@Component({
  selector: 'app-manifest-generated',
  templateUrl: './manifest-generated.component.html',
})
export class ManifestGeneratedComponent implements OnInit {
  jsonUrl = '../../../assets/data/manifestGenerated.json'
  tableload = false;
  csv: any[];
  data: [] | any;
  tripData: any;
  tabledata: any;
  manifestgeneratedTableForm: UntypedFormGroup
  manifestControlArray: any;
  orgBranch: string = localStorage.getItem("Branch");
  columnHeader = {
    "hyperlink": "MF Number",
    "Leg": "Leg",
    "ShipmentsLoadedBooked": "Shipments- Loaded/Booked",
    "PackagesLoadedBooked": "Packages Loaded/Booked",
    "WeightKg": "Weight Kg",
    "VolumeCFT": "Volume CFT",
  }
  hyperlinkControls = {
    value: "MFNumber",
    functionName: "viewMFview"
  }
  centerAlignedData = ['PackagesLoadedBooked', 'WeightKg', 'VolumeCFT'];

  //  #region declaring Csv File's Header as key and value Pair
  headerForCsv = {
    "MFNumber": "MF Number",
    "Leg": "Leg",
    "ShipmentsLoadedBooked": "Shipments- Loaded/Booked",
    "PackagesLoadedBooked": "Packages Loaded/Booked",
    "WeightKg": "Weight Kg",
    "VolumeCFT": "Volume CFT"
  }
  //declaring breadscrum
  breadscrums = [
    {
      title: "Manifest Generated",
      items: ["Home"],
      active: "Manifest Generated"
    }
  ]
  toggleArray = []
  menuItems = [
    { label: 'Print', componentDetails: ViewPrintComponent, function: "GeneralMultipleView" },
  ]
  linkArray = [

    { Row: 'Action', Path: '' }

  ]
  dynamicControls = {
    add: false,
    edit: false,
  }
  loadingData: any;
  formdata: any;
  menifest: any;
  mfNo: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public item: any,
    public dialogRef: MatDialogRef<ManifestGeneratedComponent>,
    private cnoteService: CnoteService
    ) {
    if (item) {
      this.mfNo=item?.mfNo||"";
      this.menifest = item.loadingSheetData;
      this.getMenifest();

    }
  }
  getMenifest() {

    let groupedDataWithoutKey;
    const groupedData = this.menifest.reduce((acc, element) => {
      const leg = element.Leg;
      if (!acc[leg]) {
        acc[leg] = {
          Leg: leg,
          TotalWeightKg: 0,
          TotalVolumeCFT: 0,
          TotalPackages: 0,
          ShipmentCount: 0,
          Data: []
        };
      }
      acc[leg].TotalWeightKg += element.WeightKg;
      acc[leg].TotalVolumeCFT += element.VolumeCFT;
      acc[leg].TotalPackages += element.Packages;
      acc[leg].ShipmentCount++;
      acc[leg].Data.push(element);
      return acc;
    }, {});
    groupedDataWithoutKey = Object.values(groupedData);
    let MeniFestDetails: any[] = [];
    groupedDataWithoutKey.forEach(element => {

      let meniFestjson = {
        MFNumber: this.mfNo,
        Leg: element?.Leg || '',
        ShipmentsLoadedBooked: element.ShipmentCount + "/" + element.ShipmentCount,
        PackagesLoadedBooked: element?.TotalPackages || '' + "/" + element?.TotalPackages || '',
        WeightKg: element.TotalWeightKg,
        VolumeCFT: element.TotalVolumeCFT,
        Action: "Print"
      }
      MeniFestDetails.push(meniFestjson)
    });
    this.cnoteService.setMeniFestDetails(MeniFestDetails);
    this.csv = MeniFestDetails;
  }

  ngOnInit(): void {
  }

  IsActiveFuntion($event) {
    this.loadingData = $event
  }
  functionCallHandler($event) {
    // console.log("fn handler called", $event);
    let field = $event.field;                   // the actual formControl instance
    let functionName = $event.functionName;     // name of the function , we have to call
    // we can add more arguments here, if needed. like as shown
    // $event['fieldName'] = field.name;
    // function of this name may not exists, hence try..catch 
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  Close(): void {
    this.dialogRef.close(this.csv)
  }

  viewMFview(event){
      const req = {
        templateName: "Manifest View-Print",
        DocNo: event.data?.MFNumber,
      };
      const url = `${window.location.origin}/#/Operation/view-print?templateBody=${JSON.stringify(req)}`;
      window.open(url, '', 'width=1000,height=800');
  }

}

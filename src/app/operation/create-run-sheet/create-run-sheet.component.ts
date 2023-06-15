import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { RunSheetControl } from 'src/assets/FormControls/RunsheetGeneration';
import { CnoteService } from 'src/app/core/service/Masters/CnoteService/cnote.service';

@Component({
  selector: 'app-create-run-sheet',
  templateUrl: './create-run-sheet.component.html'
})
export class CreateRunSheetComponent implements OnInit {
  jsonUrl = '../../../assets/data/create-runsheet-data.json'
  RunSheetTableForm: UntypedFormGroup
  jsonControlArray: any;
  RunSheetTable: any;
  runsheetData: any;
  //declaring breadscrum
  orgBranch: string = localStorage.getItem("Branch");
  breadscrums = [
    {
      title: "Create Run Sheet",
      items: ["Home"],
      active: "Create Run Sheet"
    }
  ]
  data: any;
  tableload = false;
  csv: any[];
  runSheetData: any;
  constructor(private http: HttpClient, private Route: Router,private CnoteService:CnoteService,private fb: UntypedFormBuilder
  ) {
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.RunSheetTable = this.Route.getCurrentNavigation()?.extras?.state.data;
    }
    this.IntializeFormControl()
  }
  toggleArray = []
  menuItems = []
  linkArray = []
  columnHeader = {
    "Document": "Document",
    "Type": "Type",
    "Customer": "Customer",
    "Address": "Address",
    "Pincode": "Pin code",
    "Packages": "Packages",
    "Weight": "Weight",
    "Volume": "Volume",
    "checkBoxRequired": "Select"
  }
  dynamicControls = {
    add: false,
    edit: false,
    csv: false
  }
  ngOnInit(): void {
    this.http.get(this.jsonUrl).subscribe(res => {
      this.data = res['GenerateData'].find((x)=>x.Cluster==this.RunSheetTable.columnData.Cluster);
      this.autoBindData();
      this.csv = res['RunsheetData'].filter((x)=>x.Cluster==this.RunSheetTable.columnData.Cluster);
      this.tableload = false;
    });
  }
  IntializeFormControl() {
    const RunSheetFormControl = new RunSheetControl();
    this.jsonControlArray = RunSheetFormControl.RunSheetFormControls();
    this.RunSheetTableForm = formGroupBuilder(this.fb, [this.jsonControlArray])
  }
  IsActiveFuntion(event){ 
     this.runSheetData=event;
  }
  functionCallHandler($event) {
    // console.log("fn handler called", $event);
    let field = $event.field;                   // the actual formControl instance
    let functionName = $event.functionName;     // name of the function , we have to call
    // we can add more arguments here, if needed. like as shown
    // function of this name may not exists, hence try..catch 
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  autoBindData() {
    this.RunSheetTableForm.controls['Cluster'].setValue(this.RunSheetTable.columnData.Cluster || '')
    this.RunSheetTableForm.controls['RunSheetID'].setValue(this.data?.RunSheetID || '')
    this.RunSheetTableForm.controls['Vehicle'].setValue(this.data?.VehicleNo || '')
    this.RunSheetTableForm.controls['VehType'].setValue(this.data?.VehType || '')
    this.RunSheetTableForm.controls['Vendor'].setValue(this.data?.VendorID || '')
    this.RunSheetTableForm.controls['VenType'].setValue(this.data?.VenType || '')
    this.RunSheetTableForm.controls['CapacityKg'].setValue(this.data?.CapacityKg || '')
    this.RunSheetTableForm.controls['CapVol'].setValue(this.data?.CapacityVolumeCFT || '')
    this.RunSheetTableForm.controls['LoadKg'].setValue(this.data?.LoadedKg || '')
    this.RunSheetTableForm.controls['LoadVol'].setValue(this.data?.LoadedVolumeCFT || '')
    this.RunSheetTableForm.controls['WeightUti'].setValue(this.data?.WeightUtilization || '')
    this.RunSheetTableForm.controls['VolUti'].setValue(this.data?.VolumeUtilization || '')
  }
  GenerateRunsheet(){
    const randomNumber = "PDNHW/" + this.orgBranch + "/" + 2223 + "/" + Math.floor(Math.random() * 100000);
    this.RunSheetTableForm.controls['RunSheetID'].setValue(randomNumber)
    let runSheetDetils={
      shippingData:this.runSheetData,
      runSheetDetails: this.RunSheetTableForm.value
    }
    this.CnoteService.setRunSheetData(runSheetDetils);
    this.goBack(3)
  }
  goBack(tabIndex: number): void {
    this.Route.navigate(['/dashboard/GlobeDashboardPage'], { queryParams: { tab: tabIndex } });
  }
}

import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { RunSheetControl } from 'src/assets/FormControls/RunsheetGeneration';
import { CnoteService } from 'src/app/core/service/Masters/CnoteService/cnote.service';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import Swal from 'sweetalert2';
import { OperationService } from 'src/app/core/service/operations/operation.service';

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
  backPath: string;
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
  constructor(private http: HttpClient, private Route: Router, private CnoteService: CnoteService, private operationService: OperationService, private fb: UntypedFormBuilder, private ObjSnackBarUtility: SnackBarUtilityService
  ) {
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.RunSheetTable = this.Route.getCurrentNavigation()?.extras?.state.data;
    }
    this.IntializeFormControl()
  }
  toggleArray = []
  menuItems = []
  METADATA = {
    checkBoxRequired: true,
    selectAllorRenderedData: false,
    noColumnSort: ["checkBoxRequired"],
  };
  linkArray = []
  columnHeader = {
    checkBoxRequired: {
      Title: "Select",
      class: "matcolumncenter",
      Style: "max-width:80px",
    },
    documentId: {
      Title: "Document",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    type: {
      Title: "Type",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    customer: {
      Title: "Customer",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    address: {
      Title: "Address",
      class: "matcolumncenter",
      Style: "min-width:20%",
    },
    pincode: {
      Title: "Pin code",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    packages: {
      Title: "Packages",
      class: "matcolumncenter",
      Style: "max-width:95px",
    },
    weight: {
      Title: "Weight",
      class: "matcolumncenter",
      Style: "max-width:90px",
    },
    volume: {
      Title: "Volume",
      class: "matcolumncenter",
      Style: "max-width:90px",
    },
  };
  branch = localStorage.getItem("Branch");

  staticField = [
    "documentId",
    "type",
    "customer",
    "address",
    "pincode",
    "packages",
    "weight",
    "volume"
  ];
  dynamicControls = {
    add: false,
    edit: false,
    csv: false
  }
  ngOnInit(): void {
    this.operationService.getJsonFileDetails('runSheerUrl').subscribe(res => {
      this.data = res['cluster'].find((x) => x.cluster == this.RunSheetTable.columnData.Cluster);
      this.autoBindData();
      this.csv = res['shipment'].filter((x) => x.cluster == this.RunSheetTable.columnData.Cluster);
      this.tableload = false;
      this.backPath = "/dashboard/Index";
    });
  }
  IntializeFormControl() {
    const RunSheetFormControl = new RunSheetControl();
    this.jsonControlArray = RunSheetFormControl.RunSheetFormControls();
    this.RunSheetTableForm = formGroupBuilder(this.fb, [this.jsonControlArray])
  }
  IsActiveFuntion(event) {
    this.runSheetData = event;
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
    const mappings = {
      'Cluster': 'cluster',
      'RunSheetID': 'runSheetID',
      'Vehicle': 'vehicleNo',
      'VehType': 'vehType',
      'Vendor': 'vendorId',
      'VenType': 'vendorType',
      'CapacityKg': 'capacityKg',
      'CapVol': 'capacityVol',
      'LoadKg': 'loadedKg',
      'LoadVol': 'loadedVol',
      'WeightUti': 'weightUtilization',
      'VolUti': 'volumeUtilization',
    };

    for (let key in mappings) {
      let value = this.data?.[mappings[key]] || '';
      if (key === 'Cluster') value = this.RunSheetTable?.columnData.Cluster || '';
      this.RunSheetTableForm.controls[key].setValue(value);
    }
  }
  GenerateRunsheet() {

    if (this.runSheetData == undefined) {
      // If no item has isSelected set to true, return or perform any desired action.
      this.ObjSnackBarUtility.ShowCommonSwal1('error', 'Please select atleast one Cluster to generate Runsheet!', false, false, false);
      return;
    }
    const randomNumber = "PDNHW/" + this.orgBranch + "/" + 2223 + "/" + Math.floor(Math.random() * 100000);
    this.RunSheetTableForm.controls['RunSheetID'].setValue(randomNumber)
    let json={
      runSheetID: this.RunSheetTableForm?.value.RunSheetID,
      cluster: this.RunSheetTableForm?.value.Cluster,
      vehicleNo:this.RunSheetTableForm?.value.Vehicle,
      vehType: this.RunSheetTableForm?.value.VehType,
      vendorId: this.RunSheetTableForm?.value.Vendor,
      vendorType: this.RunSheetTableForm?.value.VenType,
      capacityKg: this.RunSheetTableForm?.value.CapacityKg,
      capacityVol: this.RunSheetTableForm?.value.CapVol,
      loadedKg:this.RunSheetTableForm?.value.LoadKg,
      loadedVol: this.RunSheetTableForm?.value.LoadVol,
      weightUtilization: this.RunSheetTableForm?.value.WeightUti,
      volumeUtilization: this.RunSheetTableForm?.value.VolUti,
      // Pickup:this.RunSheetTableForm?.value.Pickup||'',
      // Delivery:this.RunSheetTableForm?.value.Delivery||'',
      action: "Depart"
    }
    let runSheetDetils = {
      shippingData: this.runSheetData,
      runSheetDetails: json
    }
    this.CnoteService.setRunSheetData(runSheetDetils);
    this.goBack('Delivery')
    Swal.fire({
      icon: "success",
      title: "Successful",
      text: `Run Sheet generated Successfully`,
      showConfirmButton: true,
    })
  }
  goBack(tabIndex: string): void {
    this.Route.navigate(['/dashboard/Index'], { queryParams: { tab: tabIndex } });
  }
}

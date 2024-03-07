import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { RunSheetControl } from 'src/assets/FormControls/RunsheetGeneration';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import Swal from 'sweetalert2';
import { RunSheetService } from 'src/app/Utility/module/operation/runsheet/runsheet.service';
import { VehicleStatusService } from 'src/app/Utility/module/operation/vehicleStatus/vehicle.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { SwalerrorMessage } from 'src/app/Utility/Validation/Message/Message';
import { VehicleTypeService } from 'src/app/Utility/module/masters/vehicle-type/vehicle-type-service';
import { GeneralService } from 'src/app/Utility/module/masters/general-master/general-master.service';
import { setGeneralMasterData } from 'src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction';
import { AutoComplete } from 'src/app/Models/drop-down/dropdown';

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
  delType:AutoComplete[];
  constructor(
    private Route: Router,
    private runSheetService: RunSheetService,
    private fb: UntypedFormBuilder,
    private vehStatus: VehicleStatusService,
    private filter: FilterUtils,
    private generalService:GeneralService,
    private vehicleTypeService: VehicleTypeService,
    public snackBarUtilityService: SnackBarUtilityService
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
      Title: "Pkgs",
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
  }

  IntializeFormControl() {
    const RunSheetFormControl = new RunSheetControl();
    this.jsonControlArray = RunSheetFormControl.RunSheetFormControls();
    this.RunSheetTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.getShipment();
    this.generalMaster();
  }
  /*below function for docket list which displayed below the form group*/
  async getShipment() {
    const res = await this.runSheetService.shipmentFieldMapping(this.RunSheetTable?.columnData.dktList || "");
    this.csv = res;
    this.autoBindData();
    this.getVehicle();
  }
  /*End*/
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
    this.RunSheetTableForm.controls['Cluster'].setValue(this.RunSheetTable?.columnData.Cluster);
  }
  async getVehicle() {
    const res = await this.vehStatus.getAvailableVehicles();
    const data = this.jsonControlArray.find((x) => x.name == "Vehicle")
    this.filter.Filter(
      this.jsonControlArray,
      this.RunSheetTableForm,
      res.map((x) => { return { name: x.vehNo, value: x.vehNo, type: x.vendorType } }),
      data.name,
      data.additionalData.showNameAndValue
    );
  }
  async getVehicleDetails() {
    
    const fieldName = ["CapacityKg", "CapVol", "Vendor"];
    this.RunSheetTableForm.controls['Vendor'].setValue("")
    this.RunSheetTableForm.controls['CapacityKg'].setValue(0)
    this.RunSheetTableForm.controls['CapVol'].setValue(0)
    if (this.RunSheetTableForm?.value.Vehicle.type != "Market") {
      this.jsonControlArray = this.jsonControlArray.map((x) => {
        if (fieldName.includes(x.name)) {
          x.disable = true;
        }
        if(x.name=="VehType"){
          x.type="text"
          x.disable = true
        }
        return x;
      });
      const vehDetails = await this.vehStatus.getVehDetails(this.RunSheetTableForm?.value.Vehicle.value);
      this.RunSheetTableForm.controls['VehType'].setValue(vehDetails?.vehicleType||"")
      this.RunSheetTableForm.controls['CapVol'].setValue(vehDetails?.cft || "")
      this.RunSheetTableForm.controls['CapacityKg'].setValue(parseFloat(vehDetails?.capacity) * 1000 || 0)
      this.RunSheetTableForm.controls['Vendor'].setValue(vehDetails?.vendorName || "")
    }
    else {
      const res = await this.vehicleTypeService.getVehicleTypeList();
      const vehicleType = res.map(x => ({ value: x.vehicleTypeCode, name: x.vehicleTypeName }));
      this.jsonControlArray =this.jsonControlArray.map((x) => {
        if (fieldName.includes(x.name)) {
          x.disable = false;
        }
        if(x.name=="VehType"){
          x.type="Staticdropdown",
          x.disable = false,
          x.value=vehicleType
        }
        return x;
      });
    
    }
 
    this.RunSheetTableForm.controls['VenType'].setValue(this.RunSheetTableForm?.value.Vehicle.type || "")
  }
  selectCheckBox(event) {
    this.getCapacity();
  }
  getCapacity() {
    this.RunSheetTableForm.controls['LoadKg'].setValue(0);
    this.RunSheetTableForm.controls['LoadVol'].setValue(0);
    this.RunSheetTableForm.controls['WeightUti'].setValue(0);
    this.RunSheetTableForm.controls['VolUti'].setValue(0);
    // Calculate the previously loaded values from the form
    let loadedKgInput = parseInt(this.RunSheetTableForm.value?.LoadKg || 0);
    let loadedCftInput = parseInt(this.RunSheetTableForm.value?.LoadVol || 0);
    // Initialize these variables to zero
    let loadAddedKg = 0;
    let volAddedCft = 0;
    const processedShipment = new Set();
    this.csv.forEach(element => {
      if (element?.isSelected) {
        // Check if the leg has been processed already
        if (!processedShipment.has(element?.documentId)) {
          const weightKg = parseInt(element?.weight) || 0;
          const volumeCFT = parseInt(element?.volume) || 0;
          loadAddedKg += isNaN(weightKg) ? 0 : weightKg;
          volAddedCft += isNaN(volumeCFT) ? 0 : volumeCFT;
          // Mark the leg as processed
          processedShipment.add(element?.documentId);
        }
      }
    });

    // Calculate the total loaded values, including previously loaded values
    loadedKgInput += loadAddedKg;
    loadedCftInput += volAddedCft;

    // Set NaN values to 0
    loadedKgInput = isNaN(loadedKgInput) ? 0 : loadedKgInput;
    loadedCftInput = isNaN(loadedCftInput) ? 0 : loadedCftInput;

    // Assuming `loadedKg` is another form control that holds the loaded weight in kilograms
    let loadedKg = parseFloat(`${loadedKgInput}`); // Get the loaded weight in kilograms
    // Convert loaded kilograms to tons (since 1 ton = 1000 kilograms)
    let loadedTons = loadedKg / 1000;

    // Now, calculate the percentage of the capacity that is loaded
    let capacityTons = parseFloat(this.RunSheetTableForm.controls['CapacityKg'].value); // Assuming this is actually the capacity in KG and needs conversion

    // Convert capacity from kilograms to tons if necessary
    capacityTons = capacityTons / 1000; // Convert to tons if the form actually holds kg instead of tons

    let percentage = (loadedTons * 100) / capacityTons;
    // Update the form controls with the calculated values
    this.RunSheetTableForm.controls['LoadKg'].setValue(isNaN(loadAddedKg) ? 0 : loadAddedKg);
    this.RunSheetTableForm.controls['LoadVol'].setValue(isNaN(volAddedCft) ? 0 : volAddedCft);
    this.RunSheetTableForm.controls['WeightUti'].setValue(isNaN(percentage) ? 0 : percentage.toFixed(2));
    const volumeUtilization = loadedCftInput * 100 / parseFloat(this.RunSheetTableForm.controls['CapVol'].value);
    this.RunSheetTableForm.controls['VolUti'].setValue(isNaN(volumeUtilization) ? 0 : volumeUtilization.toFixed(2));
    if (percentage > 100 || volumeUtilization > 100) {
      let errorMessage = "Capacity has been exceeded.";

      if (volumeUtilization > 100) {
        errorMessage = "Cubic feet volume is greater than vehicle volume.";
      }

      Swal.fire({
        icon: "error",
        title: "Capacity Exceeded",
        text: errorMessage,
        showConfirmButton: true,
      });
      this.csv.forEach((loadingItem) => {
        this.csv = this.csv.map((tableItem) => {
          if (loadingItem.documentId === tableItem.documentId) {
            return { ...tableItem, isSelected: false };
          }
          return tableItem;
        });
      });


    }


  }
  async checkIsMarketVehicle(){
    const fieldName = ["CapacityKg", "CapVol", "Vendor","VenType","vendPan","VehType"];
    if(typeof(this.RunSheetTableForm.controls['Vehicle'].value)=="string"){
      const res = await this.vehicleTypeService.getVehicleTypeList();
      const vehicleType = res.map(x => ({ value: x.vehicleTypeCode, name: x.vehicleTypeName }));
      this.RunSheetTableForm.controls['VehType'].setValue("");
      this.RunSheetTableForm.controls['Vendor'].setValue("");
      this.RunSheetTableForm.controls['VenType'].setValue("");
      this.RunSheetTableForm.controls['vendPan'].setValue("");
      this.RunSheetTableForm.controls['driverNm'].setValue("");
      this.RunSheetTableForm.controls['driverMobile'].setValue("");
      this.RunSheetTableForm.controls['lsNo'].setValue("");
      this.RunSheetTableForm.controls['lcExpireDate'].setValue("");
      this.jsonControlArray = this.jsonControlArray.map((x) => {
        if (fieldName.includes(x.name)) {
          x.disable = false
        }
        if(fieldName.includes(x.name) && x.name=="VehType"){
          x.type="Staticdropdown"
          x.value=vehicleType
          x.disable = false
        }
        return x;
      });
      this.RunSheetTableForm.controls['VenType'].setValue("Market");
    }
   
    
  
  }
  async GenerateRunsheet() {
    if (!this.csv.some((x) => x.isSelected)) {
      // If no item has isSelected set to true, return or perform any desired action.
      SwalerrorMessage("error", "Please Select Any one Record", "", true);
     // this.ObjSnackBarUtility.ShowCommonSwal1('error', 'Please select atleast one Cluster to generate Runsheet!', false, false, false);
      return;
    }
    this.snackBarUtilityService.commonToast(async () => {
      const formData=this.RunSheetTableForm.getRawValue();
      formData['deliveryTypeName']=this.delType.find((x)=>x.value==formData.deliveryType).name;
      const res = await this.runSheetService.drsFieldMapping(this.RunSheetTableForm.value, this.csv);
      const runSheetNo=await this.runSheetService.addRunSheet(res);
      Swal.fire({
        icon: "success",
        title: "Successful",
        text: `Run Sheet generated Successfully ${runSheetNo}`,
        showConfirmButton: true,
      })
      this.goBack('Delivery')
    },"Run Sheet generated Successfully")
 
  }
  async generalMaster(){
    this.delType = await this.generalService.getGeneralMasterData("RUNDELTYP");
    const delType=this.delType.find((x)=>x.name=="Delivery");
    setGeneralMasterData(this.jsonControlArray, this.delType, "deliveryType");
    this.RunSheetTableForm.controls['deliveryType'].setValue(delType.value)
    this.RunSheetTableForm.controls['deliveryType'].disable();

  }
  goBack(tabIndex: string): void {
    this.Route.navigate(['/dashboard/Index'], { queryParams: { tab: tabIndex } });
  }
}

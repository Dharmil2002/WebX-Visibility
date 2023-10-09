import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { clearValidatorsAndValidate } from 'src/app/Utility/Form Utilities/remove-validation';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { fleetModel } from 'src/app/core/models/Masters/fleetMaster';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { FleetControls } from 'src/assets/FormControls/fleet-control';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-fleet-master',
  templateUrl: './add-fleet-master.component.html',

})
export class AddFleetMasterComponent implements OnInit {
  FleetTable: fleetModel;
  breadScrums: { title: string; items: string[]; active: string; generatecontrol: true; toggle: boolean;}[];
  action: string;
  isUpdate = false;
  fleetTableForm: UntypedFormGroup;
  jsonControlFleetArray: any;
  FleetFormControls: FleetControls;
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  vehicleNo: any;
  vehicleNoStatus: any;
  allData: { vehicleData: any; };
  tableLoad: boolean;
  vehicleData: any;
  backPath:string;
  vehicleDet: any;
  vehTypeDet: any;
  SelectFile: File;
  imageName: string;
  selectedFiles: boolean;
  vehicleType: any;
  vehicleTypeStatus: any;
  submit = 'Save';

  constructor(
    private filter: FilterUtils,
    private route: Router,
    private fb: UntypedFormBuilder,
    private masterService: MasterService,
  ) {
    if (this.route.getCurrentNavigation()?.extras?.state != null) {
      this.FleetTable = route.getCurrentNavigation().extras.state.data;
      console.log(this.FleetTable);

      this.isUpdate = true;
      this.submit = 'Modify';
      this.action = "edit";
    } else {
      this.action = "Add";
    }
    if (this.action === "edit") {
      this.isUpdate = true;
      this.breadScrums = [
        {
          title: "Modify Master",
          items: ["Masters"],
          active: "Modify Fleet",
          generatecontrol: true,
          toggle: this.FleetTable.activeFlag
        },
      ];
    } else {
      this.breadScrums = [
        {
          title: "Fleet Master",
          items: ["Masters"],
          active: "Add Fleet",
          generatecontrol: true,
          toggle: false
        },
      ];
      this.FleetTable = new fleetModel({});
    }
    this.initializeFormControl();
  }

  initializeFormControl() {
    //throw new Error("Method not implemented.");
    this.FleetFormControls = new FleetControls(this.FleetTable, this.isUpdate);
    // Get form controls for Driver Details section
    this.jsonControlFleetArray = this.FleetFormControls.getFormControls();
    this.jsonControlFleetArray.forEach(data => {
      if (data.name === 'vehicleNo') {
        // Set category-related variables
        this.vehicleNo = data.name;
        this.vehicleNoStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'vehicleType') {
        // Set category-related variables
        this.vehicleType = data.name;
        this.vehicleTypeStatus = data.additionalData.showNameAndValue;
      }
    });
    // Build the form group using formGroupBuilder function
    this.fleetTableForm = formGroupBuilder(this.fb, [this.jsonControlFleetArray]);
  }

  ngOnInit(): void {
    this.getAllMastersData();
    this.backPath = "/Masters/FleetMaster/FleetMasterList";
  }

  //#region Function for Getting dropdown Data
  async getAllMastersData() {
    try {
      // Prepare the requests for different collections

      let vehicleReq = {
        "companyCode": parseInt(localStorage.getItem("companyCode")),
        "filter": {},
        "collectionName": "vehicle_detail"
      };
      let vehTypeReq = {
        "companyCode": parseInt(localStorage.getItem("companyCode")),
        "filter": {},
        "collectionName": "vehicleType_detail"
      };

      const vehicleRes = await this.masterService.masterPost('generic/get', vehicleReq).toPromise();
      const vehTypeRes = await this.masterService.masterPost('generic/get', vehTypeReq).toPromise();

      const mergedData = {
        vehicleData: vehicleRes?.data,
        vehTypeData: vehTypeRes?.data,
      };

      this.allData = mergedData;

      const vehicleDet = mergedData.vehicleData.map(element => ({
        name: element.vehicleNo,
        value: element.vehicleNo,
      }));
      const vehTypeDet = mergedData.vehTypeData.map(element => ({
        name: element.vehicleTypeName,
        value: element.vehicleTypeCode,
      }));
      this.vehicleDet = vehicleDet;
      this.vehTypeDet = vehTypeDet;
      this.filter.Filter(
        this.jsonControlFleetArray,
        this.fleetTableForm,
        vehicleDet,
        this.vehicleNo,
        this.vehicleNoStatus
      );
      this.filter.Filter(
        this.jsonControlFleetArray,
        this.fleetTableForm,
        vehTypeDet,
        this.vehicleType,
        this.vehicleTypeStatus
      );
      this.tableLoad = true;
      this.autofillDropdown();
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle the error as needed
    }
  }
  //#endregion

  autofillDropdown() {
    if (this.isUpdate) {
      this.vehicleData = this.vehicleDet.find((x) => x.name == this.FleetTable.vehicleNo);
      this.fleetTableForm.controls.vehicleNo.setValue(this.vehicleData);
      this.vehicleData = this.vehTypeDet.find((x) => x.name == this.FleetTable.vehicleType);
      this.fleetTableForm.controls.vehicleType.setValue(this.vehicleData);
    }
  }

  //#region  Fitness certificate Scan
  selectedFilefitnesscertificateScan(data) {
    let fileList: FileList = data.eventArgs;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const allowedFormats = ["jpeg", "png", "jpg"];
      const fileFormat = file.type.split('/')[1]; // Extract file format from MIME type

      if (allowedFormats.includes(fileFormat)) {
        this.SelectFile = file;
        this.imageName = file.name;
        this.selectedFiles = true;
        this.fleetTableForm.controls["fitnesscertificateScan"].setValue(this.SelectFile.name);

      } else {
        this.selectedFiles = false;
        Swal.fire({
          icon: "warning",
          title: "Alert",
          text: `Please select a JPEG, PNG, or JPG file.`,
          showConfirmButton: true,
        });
      }
    } else {
      this.selectedFiles = false;
      alert("No file selected");
    }
  }

  //#region Insurance Scan
  selectedFileinsuranceScan(data) {
    let fileList: FileList = data.eventArgs;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const allowedFormats = ["jpeg", "png", "jpg"];
      const fileFormat = file.type.split('/')[1]; // Extract file format from MIME type

      if (allowedFormats.includes(fileFormat)) {
        this.SelectFile = file;
        this.imageName = file.name;
        this.selectedFiles = true;
        this.fleetTableForm.controls["insuranceScan"].setValue(this.SelectFile.name);

      } else {
        this.selectedFiles = false;
        Swal.fire({
          icon: "warning",
          title: "Alert",
          text: `Please select a JPEG, PNG, or JPG file.`,
          showConfirmButton: true,
        });
      }
    } else {
      this.selectedFiles = false;
      alert("No file selected");
    }
  }
  //#endregion

  //#region Registration Scan
  selectedFileregistrationScan(data) {
    let fileList: FileList = data.eventArgs;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const allowedFormats = ["jpeg", "png", "jpg"];
      const fileFormat = file.type.split('/')[1]; // Extract file format from MIME type

      if (allowedFormats.includes(fileFormat)) {
        this.SelectFile = file;
        this.imageName = file.name;
        this.selectedFiles = true;
        this.fleetTableForm.controls["registrationScan"].setValue(this.SelectFile.name);

      } else {
        this.selectedFiles = false;
        Swal.fire({
          icon: "warning",
          title: "Alert",
          text: `Please select a JPEG, PNG, or JPG file.`,
          showConfirmButton: true,
        });
      }
    } else {
      this.selectedFiles = false;
      alert("No file selected");
    }
  }
  //#endregion

  //#region Function for save data
  async save() {
    const formValue = this.fleetTableForm.value;
    const controlNames = ["vehicleNo","vehicleType"];
    const controls = this.fleetTableForm;
    clearValidatorsAndValidate(controls);
    controlNames.forEach((controlName) => {
      const controlValue = formValue[controlName]?.name;
      this.fleetTableForm.controls[controlName].setValue(controlValue);
    });
    this.fleetTableForm.controls["activeFlag"].setValue(this.fleetTableForm.value.activeFlag === true ? true : false);
    if (this.isUpdate) {
      let id = this.fleetTableForm.value.vehicleNo;
      // Remove the "id" field from the form controls
      this.fleetTableForm.removeControl("_id");
      let req = {
        companyCode: this.companyCode,
        collectionName: "fleet_master",
        filter: { vehicleNo: id },
        update: this.fleetTableForm.value,
      };
      //API FOR UPDATE
      const res = await this.masterService
        .masterPut("generic/update", req)
        .toPromise();
      if (res) {
        // Display success message
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: res.message,
          showConfirmButton: true,
        });
        this.route.navigateByUrl("/Masters/FleetMaster/FleetMasterList");
      }
    } else {
      const randomNumber = (this.fleetTableForm.value.vehicleNo);
      this.fleetTableForm.controls["_id"].setValue(randomNumber);
      let req = {
        companyCode: this.companyCode,
        collectionName: "fleet_master",
        data: this.fleetTableForm.value,
      };
      //API FOR ADD
      const res = await this.masterService
        .masterPost("generic/create", req)
        .toPromise();
      if (res) {
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: res.message,
          showConfirmButton: true,
        });
        this.route.navigateByUrl("/Masters/FleetMaster/FleetMasterList");
      }
    }
  }
  //#endregion

  cancel() {
    this.route.navigateByUrl("/Masters/FleetMaster/FleetMasterList");
  }

  //#region Function Call Handler
  functionCallHandler($event) {
    // console.log("fn handler called" , $event);

    let field = $event.field; // the actual formControl instance
    let functionName = $event.functionName; // name of the function , we have to call

    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  //#endregion

  onToggleChange(event: boolean) {
    // Handle the toggle change event in the parent component
    this.fleetTableForm.controls['activeFlag'].setValue(event);
    console.log("Toggle value :", event);
  }

}

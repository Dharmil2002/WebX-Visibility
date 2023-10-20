import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { clearValidatorsAndValidate } from 'src/app/Utility/Form Utilities/remove-validation';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { fleetModel } from 'src/app/core/models/Masters/fleetMaster';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { ImagePreviewComponent } from 'src/app/shared-components/image-preview/image-preview.component';
import { FleetControls } from 'src/assets/FormControls/fleet-control';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-fleet-master',
  templateUrl: './add-fleet-master.component.html',

})
export class AddFleetMasterComponent implements OnInit {
  FleetTable: fleetModel;
  @Input() thc: boolean;
  breadScrums: { title: string; items: string[]; active: string; generatecontrol: true; toggle: boolean; }[];
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
  backPath: string;
  vehicleDet: any;
  vehTypeDet: any;
  SelectFile: File;
  imageName: string;
  selectedFiles: boolean;
  vehicleType: any;
  vehicleTypeStatus: any;
  submit = 'Save';
  url: any;
  constructor(
    private filter: FilterUtils,
    private route: Router,
    private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private dialog: MatDialog
  ) {
    if (this.route.getCurrentNavigation()?.extras?.state != null) {
      this.FleetTable = route.getCurrentNavigation().extras.state.data;
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
    if (this.thc) {
      this.jsonControlFleetArray = this.jsonControlFleetArray.filter((x) => x.name != "vehicleNo" && x.name != "_id");
    }
    // Build the form group using formGroupBuilder function
    this.fleetTableForm = formGroupBuilder(this.fb, [this.jsonControlFleetArray]);
  }

  ngOnInit(): void {
    this.getAllMastersData();
    this.backPath = "/Masters/FleetMaster/FleetMasterList";
    this.initializeFormControl();

  }

  //#region Function for Getting dropdown Data
  async getAllMastersData() {
    try {
      // Prepare the requests for different collections

      let vehicleRes;
      let vehTypeReq = {
        "companyCode": parseInt(localStorage.getItem("companyCode")),
        "filter": {},
        "collectionName": "vehicleType_detail"
      };
      const vehTypeRes = await this.masterService.masterPost('generic/get', vehTypeReq).toPromise();
      if (!this.thc) {
        let vehicleReq = {
          "companyCode": parseInt(localStorage.getItem("companyCode")),
          "filter": {},
          "collectionName": "vehicle_detail"
        };
        vehicleRes = await this.masterService.masterPost('generic/get', vehicleReq).toPromise();
      }
      const mergedData = {
        vehTypeData: vehTypeRes?.data,
        vehicleData: vehicleRes?.data,
      };

      this.allData = mergedData;
      if (!this.thc) {
        const vehicleDet = mergedData.vehicleData.map(element => ({
          name: element.vehicleNo,
          value: element.vehicleNo,
        }));
        this.vehicleDet = vehicleDet;
        this.filter.Filter(
          this.jsonControlFleetArray,
          this.fleetTableForm,
          vehicleDet,
          this.vehicleNo,
          this.vehicleNoStatus
        );
      }
      const vehTypeDet = mergedData.vehTypeData.map(element => ({
        name: element.vehicleTypeName,
        value: element.vehicleTypeCode,
      }));
      this.vehTypeDet = vehTypeDet;
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
  selectedFileregistrationScan(event) {
    //this.openImageDialog(event)
    let fileList: FileList = event.eventArgs;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const allowedFormats = ["jpeg", "png", "jpg"];
      const fileFormat = file.type.split('/')[1]; // Extract file format from MIME type

      if (allowedFormats.includes(fileFormat)) {
        this.url = fileList[0];
        this.SelectFile = file;
        this.imageName = file.name;
        this.selectedFiles = true;
        //        this.fleetTableForm.controls["registrationScan"].setValue(selectedFiles[0].name);

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
    const controlNames = ["vehicleNo", "vehicleType"];
    const controls = this.fleetTableForm;
    clearValidatorsAndValidate(controls);
    controlNames.forEach((controlName) => {
      const controlValue = formValue[controlName]?.name;
      this.fleetTableForm.controls[controlName].setValue(controlValue);
    });
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
      const randomNumber = this.fleetTableForm.value.vehicleNo;
      this.fleetTableForm.controls["_id"].setValue(randomNumber);
      //API FOR ADD
      let req = {
        companyCode: this.companyCode,
        collectionName: "fleet_master",
        data: this.fleetTableForm.value,
      };
      console.log(req);

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
    //console.log("Toggle value :", event);
  }
  //#region to check vehicle number
  async checkUniqueVehicle() {
    // Get the vehicle number from the form
    const vehicleNumber = this.fleetTableForm.value.vehicleNo.name;

    try {
      // Prepare the request to fetch the fleet collection
      const request = {
        companyCode: this.companyCode,
        collectionName: 'fleet_master',
        filter: { "vehicleNo": vehicleNumber },
      };

      // Fetch the fleet collection from the server
      const fleetCollection = await this.masterService.masterPost('generic/get', request).toPromise();

      // Check if the vehicle number already exists in the fleet collection
      if (fleetCollection.data.length > 0) {
        // Display an error message
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `This ${vehicleNumber} Number already added! Please try with another!`,
          showConfirmButton: true,
        });
        // Reset the vehicle number field
        this.fleetTableForm.controls['vehicleNo'].setValue('');
        return;
      }
    } catch (error) {
      // Handle errors appropriately, e.g., log the error or show an error message
      console.error('An error occurred while checking for unique vehicles:', error);
    }
  }
  //#endregion

  openImageDialog() {
    
    const reader = new FileReader();
let base64String
    reader.onload = (event) => {
      let base64String = event.target.result; // This contains the Base64-encoded string
      console.log(base64String);
    };
  
    reader.readAsDataURL(this.url); // Read the file as a data URL (Base64)

    this.dialog.open(ImagePreviewComponent, {
      data: { imageUrl: base64String },
      width: '30%',
      height: '50%',
    });
    //}
  }  
}
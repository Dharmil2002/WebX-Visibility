import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { clearValidatorsAndValidate } from 'src/app/Utility/Form Utilities/remove-validation';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { fleetModel } from 'src/app/core/models/Masters/fleetMaster';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { FormComponent } from 'src/app/shared-components/FormFields/form.component';
import { ImagePreviewComponent } from 'src/app/shared-components/image-preview/image-preview.component';
import { FleetControls } from 'src/assets/FormControls/fleet-control';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-fleet-master',
  templateUrl: './add-fleet-master.component.html',

})
export class AddFleetMasterComponent implements OnInit {
  fleetTableData: fleetModel;
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
  imageName: string;
  selectedFiles: boolean;
  vehicleType: any;
  vehicleTypeStatus: any;
  submit = 'Save';
  imageData: any = {};
  @ViewChild(FormComponent) childComponent: FormComponent;

  constructor(
    private filter: FilterUtils,
    private route: Router,
    private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private dialog: MatDialog,

  ) {
    if (this.route.getCurrentNavigation()?.extras?.state != null) {
      this.fleetTableData = route.getCurrentNavigation().extras.state.data;
      // console.log(this.fleetTableData);
      this.isUpdate = true;
      this.imageData = {
        'fitnesscertificateScan': this.fleetTableData.fitnesscertificateScan,
        'registrationScan': this.fleetTableData.registrationScan,
        'insuranceScan': this.fleetTableData.insuranceScan
      };
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
          toggle: this.fleetTableData.activeFlag
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
      this.fleetTableData = new fleetModel({});
    }
  }

  ngOnInit(): void {
    this.getAllMastersData();
    this.backPath = "/Masters/FleetMaster/FleetMasterList";
    this.initializeFormControl();
  }
  //#region to initialize form Controls
  initializeFormControl() {
    this.FleetFormControls = new FleetControls(this.fleetTableData, this.isUpdate);
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
  //#endregion
  //#region Function for Getting dropdown Data
  async getAllMastersData() {
    try {
      // Fetch vehicle type data
      const vehTypeData = await this.fetchMasterData("vehicleType_detail");

      // Fetch vehicle data if not in TH Component
      let vehicleData = [];
      if (!this.thc) {
        vehicleData = await this.fetchMasterData("vehicle_detail");
      }

      // Merge the data into a single object
      const mergedData = {
        vehTypeData: vehTypeData,
        vehicleData: vehicleData,
      };

      this.allData = mergedData;

      // Populate vehicle details and vehicle type details
      if (!this.thc) {
        this.vehicleDet = this.getFilteredVehicleDetails(mergedData.vehicleData);
        this.filter.Filter(
          this.jsonControlFleetArray,
          this.fleetTableForm,
          this.vehicleDet,
          this.vehicleNo,
          this.vehicleNoStatus
        );
      }

      this.vehTypeDet = this.getFilteredVehicleTypeDetails(mergedData.vehTypeData);
      this.filter.Filter(
        this.jsonControlFleetArray,
        this.fleetTableForm,
        this.vehTypeDet,
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

  async fetchMasterData(collectionName: string) {
    const req = {
      "companyCode": this.companyCode,
      "filter": {},
      "collectionName": collectionName,
    };
    const res = await this.masterService.masterPost('generic/get', req).toPromise();
    return res?.data || [];
  }

  getFilteredVehicleDetails(data: any) {
    return data
      .filter(element => element.isActive)
      .map(element => ({
        name: element.vehicleNo,
        value: element.vehicleNo,
      }));
  }

  getFilteredVehicleTypeDetails(data: any) {
    return data
      .filter(element => element.isActive)
      .map(element => ({
        name: element.vehicleTypeName,
        value: element.vehicleTypeCode,
      }));
  }
  //#endregion

  autofillDropdown() {
    if (this.isUpdate) {
      this.vehicleData = this.vehicleDet.find((x) => x.value == this.fleetTableData.vehicleNo);
      this.fleetTableForm.controls.vehicleNo.setValue(this.vehicleData);
      this.vehicleData = this.vehTypeDet.find((x) => x.name == this.fleetTableData.vehicleType);
      this.fleetTableForm.controls.vehicleType.setValue(this.vehicleData);
      this.childComponent.hide = false;
      // For setting image data, assuming you have imageData defined
      for (const controlName in this.imageData) {
        if (this.imageData.hasOwnProperty(controlName)) {
          const url = this.imageData[controlName];
          const fileName = this.extractFileName(url);
          // Set the form control value using the control name
          this.fleetTableForm.controls[controlName].setValue(fileName);
        }
      }
    }
  }

  // Define a function to extract the filename from a URL
  extractFileName(url: string): string {
    const parts = url.split('/');
    const filenameWithTimestamp = parts[parts.length - 1];
    const filenameParts = filenameWithTimestamp.split('_');
    const fileName = filenameParts[0];
    return fileName;
  }
  //#region Function for save data
  async save() {
    const controls = this.fleetTableForm;
    clearValidatorsAndValidate(controls);
    // Correct way to set values in form controls
    this.fleetTableForm.get('vehicleNo').setValue(this.fleetTableForm.value.vehicleNo.value);
    this.fleetTableForm.get('vehicleType').setValue(this.fleetTableForm.value.vehicleType.value);

    // Define an array of control names
    const imageControlNames = ['fitnesscertificateScan', 'insuranceScan', 'registrationScan'];
    let data = { ...this.fleetTableForm.value };

    imageControlNames.forEach(controlName => {
      const file = this.getFileByKey(controlName);

      // Set the URL in the corresponding control name
      data[controlName] = file;
    });

    if (this.isUpdate) {
      let id = this.fleetTableData._id;
      // Remove the "id" field from the form controls
      delete data._id;
      let req = {
        companyCode: this.companyCode,
        collectionName: "fleet_master",
        filter: { _id: id },
        update: data,
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
        data: data,
      };
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
  //#region to preview image
  openImageDialog(control) {
    const file = this.getFileByKey(control.imageName);
    this.dialog.open(ImagePreviewComponent, {
      data: { imageUrl: file },
      width: '30%',
      height: '50%',
    });
  }
  //#endregion
  //#region to handle file selection
  async selectedFile(event, controlName) {
    // Get the selected files from the input element
    const files: FileList = event;

    if (files.length > 0) {
      const file: File = files[0];

      // Extract the file format from the MIME type
      const fileFormat = file.type.split('/')[1]; // Extract file format from MIME type

      // Allowed file formats
      const allowedFormats = ["jpeg", "png", "jpg"];

      if (allowedFormats.includes(fileFormat)) {

        // Create a FormData object to prepare the file for upload
        const formData = new FormData();
        formData.append('companyCode', this.companyCode);
        formData.append('docType', "Fleet");
        formData.append('docGroup', 'Master');
        formData.append('docNo', file.name);
        formData.append('file', file);

        try {
          // Make the HTTP request to upload the file and await its response
          const res = await this.masterService.masterPost("blob/upload", formData).toPromise();
          const url = res.url
          // Store the file data and URL in the imageData variable
          this.imageData = {
            ...this.imageData,
            [controlName]: url
          };
          this.childComponent.hide = false;
          // Set the form control value to the file name
          this.fleetTableForm.controls[controlName].setValue(file.name);
        } catch (error) {
          // Handle HTTP request errors
          console.error("HTTP request error:", error);
        }
      } else {
        // Show a warning if the selected format is not allowed
        Swal.fire({
          icon: "warning",
          title: "Alert",
          text: `Please select a valid file format: ${allowedFormats.join(', ')}`,
          showConfirmButton: true,
        });
      }
    }
  }

  // Fitness Certificate Scan
  selectedFilefitnesscertificateScan(data) {
    this.selectedFile(data.eventArgs, "fitnesscertificateScan");
  }
  // Insurance Scan
  selectedFileinsuranceScan(data) {
    this.selectedFile(data.eventArgs, "insuranceScan");
  }
  // Registration Scan
  selectedFileregistrationScan(data) {
    this.selectedFile(data.eventArgs, "registrationScan");
  }

  // Function to get a file by key
  getFileByKey(key: string) {
    if (this.imageData.hasOwnProperty(key)) {
      return this.imageData[key];
    } else {
      return null; // Key not found in imageData
    }
  }
  //#endregion
}
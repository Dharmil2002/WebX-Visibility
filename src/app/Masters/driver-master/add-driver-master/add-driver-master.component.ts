import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DriverControls } from 'src/assets/FormControls/DriverMaster';
import { Inject } from "@angular/core";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { DriverMaster } from 'src/app/core/models/Masters/Driver';
import { AutoComplateCommon } from 'src/app/core/models/AutoComplateCommon';
import Swal from 'sweetalert2';
import { getShortName } from 'src/app/Utility/commonFunction/random/generateRandomNumber';
import { MasterService } from 'src/app/core/service/Masters/master.service';
@Component({
  selector: 'app-add-driver-master',
  templateUrl: './add-driver-master.component.html',
})
export class AddDriverMasterComponent implements OnInit {
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  DriverTableForm: UntypedFormGroup;
  error: string
  isUpdate = false;
  DriverTable: DriverMaster;
  LocationListAuto: AutoComplateCommon[];
  DCategoryDropdown: AutoComplateCommon[];
  VehicleDropdown: AutoComplateCommon[];
  UpdateLocation: any;
  action: any;
  retrievedData: any;
  userDetails: any;
  LocationId: any;
  DCategoryID: any
  vehno: any
  UpdateDCategory: any;
  updatedVehno: any;
  maxDate: Date;
  minDate: Date;
  ISManualDriverCode: boolean;
  DriverLocation: any;
  locationList: any;
  DatePipe: DatePipe;
  DriverFormControls: DriverControls;
  jsonControlDriverArray: any;
  jsonControlLicenseArray: any;
  jsonControlPermanentArray: any;
  jsonControlCurrentArray: any;
  jsonControlUploadArray: any;
  jsonControlBankDetailArray: any;
  accordionData: any
  location: any;
  locationStatus: any;
  category: any;
  categoryStatus: any;
  Vehicle: any;
  vehicleStatus: any;
  breadscrums: { title: string; items: string[]; active: string; }[];
  Routes: any;
  RouteStatus: any;
  selectedFiles: boolean;
  SelectFile: File;
  imageName: string;
  sampleDropdownData2 = [
    { name: "HQTR", value: "HQTR" },
    { name: "MUMB", value: "MUMB" },
    { name: "AMDB", value: "AMDB" }
  ]
  routedropdown = [
    {
      value: "S0010 ",
      name: "AMDB-BRDB-MUMB",
    },
    {
      value: "S0003 ",
      name: "AMDB-JAIB-DELB",
    },
    {
      value: "S0002 ",
      name: "MUMB-BRDB-AMDB",
    }

  ]
  locationData: any;
  routeLocation: any;
  routeDet: any;
  categoryDet: any;

  constructor(private Route: Router, @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: UntypedFormBuilder, private filter: FilterUtils,
    private masterService: MasterService
  ) {
    //super();
    this.maxDate = new Date(new Date());
    this.minDate = new Date("01 Jan 1900");
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.DriverTable = Route.getCurrentNavigation().extras.state.data;
      this.LocationId = this.DriverTable.driverLocation
      this.DCategoryID = this.DriverTable.dCategory
      this.isUpdate = true;
      this.action = 'edit'

    } else {
      this.action = 'Add'
    }
    if (this.action === 'edit') {
      this.isUpdate = true;
      this.breadscrums = [
        {
          title: "Driver Master",
          items: ["Masters"],
          active: "Edit Driver",
        },
      ];

    } else {
      this.breadscrums = [
        {
          title: "Driver Master",
          items: ["Masters"],
          active: "Add Driver",
        },
      ];
      this.DriverTable = new DriverMaster({})
      this.retrievedData = localStorage.getItem('currentUser');
      this.userDetails = JSON.parse(this.retrievedData);
    }
    this.initializeFormControl()

  }
  //#region This method creates the form controls from the json array along with the validations.
  initializeFormControl() {
    // Create DriverFormControls instance to get form controls for different sections
    const driverFormControls = new DriverControls(this.DriverTable, this.isUpdate);
    this.jsonControlDriverArray = driverFormControls.getFormControlsD();
    this.jsonControlLicenseArray = driverFormControls.getFormControlsL();
    this.jsonControlPermanentArray = driverFormControls.getFormControlsP();
    this.jsonControlUploadArray = driverFormControls.getFormControlsU();
    this.jsonControlBankDetailArray = driverFormControls.getFormControlsB();

    // Build the accordion data with section names as keys and corresponding form controls as values
    this.accordionData = {
      "Driver Details": this.jsonControlDriverArray,
      "License Details": this.jsonControlLicenseArray,
      "Address": this.jsonControlPermanentArray,
      "ID Proof Document Type": this.jsonControlUploadArray,
      "Bank Account Details": this.jsonControlBankDetailArray
    };

    // Build the form group using formGroupBuilder function and the values of accordionData
    this.DriverTableForm = formGroupBuilder(this.fb, Object.values(this.accordionData));
  }
  //#endregion

  ngOnInit(): void {
    //throw new Error("Method not implemented.");
    this.bindDropdown();
    this.getDropDownData();
  }

  getDropDownData() {
    this.masterService.getJsonFileDetails('dropDownUrl').subscribe(res => {
      const {
        locationDropdown,
        routeLocationDropdown,
      } = res;
      this.locationData = locationDropdown;
      this.routeLocation = routeLocationDropdown;
      if (this.isUpdate) {

        this.routeDet = this.findDropdownItemByName(this.routeLocation, this.DriverTable.dCategory);
        this.DriverTableForm.controls.dCategory.setValue(this.routeDet);

        this.categoryDet = this.findDropdownItemByName(this.locationData, this.DriverTable.driverLocation);
        this.DriverTableForm.controls.driverLocation.setValue(this.categoryDet);
      }

      const filterParams = [

        [
          this.jsonControlDriverArray,
          this.locationData,
          this.location,
          this.locationStatus
        ],

        [
          this.jsonControlDriverArray,
          this.routeLocation,
          this.category,
          this.categoryStatus
        ],

      ];

      filterParams.forEach(([jsonControlArray, dropdownData, formControl, statusControl]) => {
        this.filter.Filter(jsonControlArray, this.DriverTableForm, dropdownData, formControl, statusControl);
      });
    });
  }
  findDropdownItemByName(dropdownData, name) {
    return dropdownData.find(item => item.name === name);
  }
  bindDropdown() {
    this.jsonControlDriverArray.forEach(data => {
      if (data.name === 'driverLocation') {
        // Set location-related variables
        this.location = data.name;
        this.locationStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'dCategory') {
        // Set category-related variables
        this.category = data.name;
        this.categoryStatus = data.additionalData.showNameAndValue;
      }
    });
    this.filter.Filter(
      this.jsonControlDriverArray,
      this.DriverTableForm,
      this.sampleDropdownData2,
      this.location,
      this.locationStatus,
    ); this.filter.Filter(
      this.jsonControlDriverArray,
      this.DriverTableForm,
      this.routedropdown,
      this.category,
      this.categoryStatus,
    );
  }
  selectedJpgFile(data) {
    let fileList: FileList = data.eventArgs;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const allowedFormats = ["jpeg", "png", "jpg"];
      const fileFormat = file.type.split('/')[1]; // Extract file format from MIME type

      if (allowedFormats.includes(fileFormat)) {
        this.SelectFile = file;
        this.imageName = file.name;
        this.selectedFiles = true;
        this.DriverTableForm.controls["aadhar"].setValue(this.SelectFile.name);
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
  cancel() {
    window.history.back();
    this.Route.navigateByUrl("/Masters/DriverMaster/DriverMasterList");
  }
  selectedFile(data) {
    let fileList: FileList = data.eventArgs;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const allowedFormats = ["jpeg", "png", "jpg"];
      const fileFormat = file.type.split('/')[1]; // Extract file format from MIME type

      if (allowedFormats.includes(fileFormat)) {
        this.SelectFile = file;
        this.imageName = file.name;
        this.selectedFiles = true;
        this.DriverTableForm.controls["license"].setValue(this.SelectFile.name);

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
  save() {
    const formValue = this.DriverTableForm.value;
    const controlNames = [
      "dCategory",
      "driverLocation",
    ];
    controlNames.forEach(controlName => {
      const controlValue = formValue[controlName]?.name;
      this.DriverTableForm.controls[controlName].setValue(controlValue);
    });
    this.DriverTableForm.controls["activeFlag"].setValue(this.DriverTableForm.value.activeFlag == true ? "Y" : "N");
    if (this.isUpdate) {
      let id = this.DriverTableForm.value.id;
      // Remove the "id" field from the form controls
      this.DriverTableForm.removeControl("id");
      let req = {
        companyCode: this.companyCode,
        type: "masters",
        collection: "driver_detail",
        id: id,
        updates: this.DriverTableForm.value
      };
      this.masterService.masterPut('common/update', req).subscribe({
        next: (res: any) => {
          if (res) {
            // Display success message
            Swal.fire({
              icon: "success",
              title: "Successful",
              text: res.message,
              showConfirmButton: true,
            });
            this.Route.navigateByUrl('/Masters/DriverMaster/DriverMasterList');
          }
        }
      });
    } else {
      const randomNumber = getShortName(this.DriverTableForm.value.manualDriverCode);
      this.DriverTableForm.controls["id"].setValue(randomNumber);
      let req = {
        companyCode: this.companyCode,
        type: "masters",
        collection: "driver_detail",
        data: this.DriverTableForm.value
      };
      this.masterService.masterPost('common/create', req).subscribe({
        next: (res: any) => {
          if (res) {
            // Display success message
            Swal.fire({
              icon: "success",
              title: "Successful",
              text: res.message,
              showConfirmButton: true,
            });
            this.Route.navigateByUrl('/Masters/DriverMaster/DriverMasterList');
          }
        }
      });
    }
  }
  selectedPngFile(data) {
    let fileList: FileList = data.eventArgs;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const allowedFormats = ["jpeg", "png", "jpg"];
      const fileFormat = file.type.split('/')[1]; // Extract file format from MIME type

      if (allowedFormats.includes(fileFormat)) {
        this.SelectFile = file;
        this.imageName = file.name;
        this.selectedFiles = true;
        this.DriverTableForm.controls["panCard"].setValue(this.SelectFile.name);

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
  functionCallHandler($event) {
    // console.log("fn handler called" , $event);
    let field = $event.field;                   // the actual formControl instance
    let functionName = $event.functionName;     // name of the function , we have to call
    // function of this name may not exists, hence try..catch 
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
}
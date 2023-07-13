import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DriverControls } from 'src/assets/FormControls/DriverMaster';
import { Inject } from "@angular/core";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { utilityService } from 'src/app/Utility/utility.service';
import { DriverMaster } from 'src/app/core/models/Masters/Driver';
import { AutoComplateCommon } from 'src/app/core/models/AutoComplateCommon';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-add-driver-master',
  templateUrl: './add-driver-master.component.html',
})
export class AddDriverMasterComponent implements OnInit {
 //countryURL = '../../../assets/data/state-countryDropdown.json'
  DriverTableForm: UntypedFormGroup;
  error: string
  IsUpdate = false;
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
  Driver_Location: any;
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

  constructor(private Route: Router, @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: UntypedFormBuilder, private filter: FilterUtils,
    private http: HttpClient, private service: utilityService) {
    //super();
    this.maxDate = new Date(new Date());
    this.minDate = new Date("01 Jan 1900");
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.DriverTable = Route.getCurrentNavigation().extras.state.data;

      this.LocationId = this.DriverTable.driver_Location
      this.DCategoryID = this.DriverTable.driverCat
      this.IsUpdate = true;
      this.action = 'edit'

    } else {
      this.action = 'Add'
    }
    if (this.action === 'edit') {
      this.IsUpdate = true;
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
    const driverFormControls = new DriverControls(this.DriverTable, this.IsUpdate);
    this.jsonControlDriverArray = driverFormControls.getFormControlsD();
    this.jsonControlLicenseArray = driverFormControls.getFormControlsL();
    this.jsonControlPermanentArray = driverFormControls.getFormControlsP();
    this.jsonControlUploadArray = driverFormControls.getFormControlsU();
    this.jsonControlBankDetailArray= driverFormControls.getFormControlsB();

    // Build the accordion data with section names as keys and corresponding form controls as values
    this.accordionData = {
      "Driver Details": this.jsonControlDriverArray,
      "License Details": this.jsonControlLicenseArray,
      "Address": this.jsonControlPermanentArray,
      "ID Proof Document Type":this.jsonControlUploadArray,
      "Bank Account Details": this.jsonControlBankDetailArray
    };

    // Build the form group using formGroupBuilder function and the values of accordionData
    this.DriverTableForm = formGroupBuilder(this.fb, Object.values(this.accordionData));
  }
  //#endregion

  ngOnInit(): void {
    //throw new Error("Method not implemented.");
    this.bindDropdown();
  }
  bindDropdown() {
    this.jsonControlDriverArray.forEach(data => {
      if (data.name === 'Driver_Location') {
        // Set location-related variables
        this.location = data.name;
        this.locationStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'D_category') {
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
        this.DriverTableForm.controls["Company_Image"].setValue(this.SelectFile.name);
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
    this.DriverTableForm.controls["ActiveFlag"].setValue(this.DriverTableForm.value.ActiveFlag == true ? "Y" : "N");
    this.Route.navigateByUrl('/Masters/DriverMaster/DriverMasterList');
    this.service.exportData(this.DriverTableForm.value)
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
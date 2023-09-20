import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DriverControls } from 'src/assets/FormControls/DriverMaster';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { DriverMaster } from 'src/app/core/models/Masters/Driver';
import Swal from 'sweetalert2';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { convertNumericalStringsToInteger } from 'src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction';
@Component({
  selector: 'app-add-driver-master',
  templateUrl: './add-driver-master.component.html',
})
export class AddDriverMasterComponent implements OnInit {
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  DriverTableForm: UntypedFormGroup;
  DriverTable: DriverMaster;
  //#region Variable declaration
  isUpdate = false;
  action: any;
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
  breadscrums: { title: string; items: string[]; active: string; }[];
  selectedFiles: boolean;
  SelectFile: File;
  vehicleDet: any;
  imageName: string;
  routeLocation: any;
  categoryDet: any;
  LocationList: any;
  locData: any;
  Pincode: any;
  pincodeStatus: any;
  tableLoad: boolean;
  pincodeDet: any;
  allData: { locationData: any; pincodeData: any; };
  driverData: any;
  newDriverId: string;
  vehicleNo: any;
  vehicleNoStatus: any;
  pincodeData: any;
  vehicleData: any;
  //#endregion

  constructor(private Route: Router,
    private fb: UntypedFormBuilder, private filter: FilterUtils,
    private masterService: MasterService
  ) {
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.DriverTable = Route.getCurrentNavigation().extras.state.data;
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
      if (data.name === 'vehicleNo') {
        // Set category-related variables
        this.vehicleNo = data.name;
        this.vehicleNoStatus = data.additionalData.showNameAndValue;
      }
    });
    this.jsonControlPermanentArray.forEach(data => {
      if (data.name === 'pincode') {
        // Set pincode-related variables
        this.Pincode = data.name;
        this.pincodeStatus = data.additionalData.showNameAndValue;
      }
    });
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.DriverTableForm = formGroupBuilder(this.fb, Object.values(this.accordionData));
  }
  //#endregion

  ngOnInit(): void {
    this.getDropDownData();
    this.getAllMastersData();
  }

  getDropDownData() {
    this.masterService.getJsonFileDetails('dropDownUrl').subscribe(res => {
      const {
        routeLocationDropdown,
      } = res;
      this.routeLocation = routeLocationDropdown;
      if (this.isUpdate) {
        this.categoryDet = this.findDropdownItemByName(this.routeLocation, this.DriverTable.dCategory);
        this.DriverTableForm.controls.dCategory.setValue(this.categoryDet);
      }
      const filterParams = [
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
  //#region Save function
  save() {
    const formValue = this.DriverTableForm.value;
    const controlNames = [
      "dCategory",
      "driverLocation",
      "pincode",
      "vehicleNo"
    ];
    controlNames.forEach(controlName => {
      const controlValue = formValue[controlName]?.name;
      this.DriverTableForm.controls[controlName].setValue(controlValue);
    });
    let data = convertNumericalStringsToInteger(this.DriverTableForm.value);

    // Clear any errors in the form controls
    Object.values(this.DriverTableForm.controls).forEach(control => control.setErrors(null));

    if (this.isUpdate) {
      let id = data._id;
      // Remove the "id" field from the form controls
      delete data._id
      let req = {
        companyCode: this.companyCode,
        collectionName: "driver_detail",
        filter: { _id: id },
        update: this.DriverTableForm.value
      };
      this.masterService.masterPut('generic/update', req).subscribe({
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
      const lastCode = this.driverData[this.driverData.length - 1];
      const lastDriverCode = lastCode ? parseInt(lastCode.driverId.substring(1)) : 0;
      // Function to generate a new driver code
      function generateDriverCode(initialCode: number = 0) {
        const nextDriverCode = initialCode + 1;
        const driverNumber = nextDriverCode.toString().padStart(4, '0');
        const driverCode = `D${driverNumber}`;
        return driverCode;
      }
      this.newDriverId = generateDriverCode(lastDriverCode);
      data._id = this.newDriverId;
      data.driverId = this.newDriverId;
      let req = {
        companyCode: this.companyCode,
        collectionName: "driver_detail",
        data:this.DriverTableForm.value
      };
      this.masterService.masterPost('generic/create', req).subscribe({
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
  //#endregion

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

  getManualDriverCodeExists() {
    let req = {
      "companyCode": this.companyCode,
      "filter": {},
      "collectionName": "driver_detail"
    }
    this.masterService.masterPost('generic/get', req).subscribe({
      next: (res: any) => {
        if (res) {
          this.driverData = res.data;
          const count = res.data.filter(item => item.manualDriverCode == this.DriverTableForm.controls.manualDriverCode.value)
          if (count.length > 0) {
            Swal.fire({
              title: 'Driver Manual Code already exists! Please try with another',
              toast: true,
              icon: "error",
              showCloseButton: false,
              showCancelButton: false,
              showConfirmButton: true,
              confirmButtonText: "OK"
            });
            this.DriverTableForm.controls['manualDriverCode'].reset();
          }
        }
      }
    })
  }

  // Get all dropdown data
  async getAllMastersData() {
    try {
      // Prepare the requests for different collections
      let locationReq = {
        "companyCode": parseInt(localStorage.getItem("companyCode")),
        "filter": {},
        "collectionName": "location_detail"
      };

      let pincodeReq = {
        "companyCode": parseInt(localStorage.getItem("companyCode")),
        "filter": {},
        "collectionName": "pincode_detail"
      };
      let vehicleReq = {
        "companyCode": parseInt(localStorage.getItem("companyCode")),
        "filter": {},
        "collectionName": "vehicle_detail"
      };

      const locationRes = await this.masterService.masterPost('generic/get', locationReq).toPromise();
      const pincodeRes = await this.masterService.masterPost('generic/get', pincodeReq).toPromise();
      const vehicleRes = await this.masterService.masterPost('generic/get', vehicleReq).toPromise();

      const mergedData = {
        locationData: locationRes?.data,
        pincodeData: pincodeRes?.data,
        vehicleData: vehicleRes?.data,
      };
      this.allData = mergedData;
      this.pincodeDet = mergedData.pincodeData.map(element => ({
        name: element.pincode,
        value: element.pincode
      }));
      const LocationList = mergedData.locationData.map(element => ({
        name: element.locName,
        value: element.locCode
      }));
      const vehicleDet = mergedData.vehicleData.map(element => ({
        name: element.vehicleNo,
        value: element.id,
      }));
      this.LocationList = LocationList;
      this.vehicleDet = vehicleDet;
      this.filter.Filter(
        this.jsonControlDriverArray,
        this.DriverTableForm,
        LocationList,
        this.location,
        this.locationStatus
      );
      this.filter.Filter(
        this.jsonControlDriverArray,
        this.DriverTableForm,
        vehicleDet,
        this.vehicleNo,
        this.vehicleNoStatus
      );
      this.tableLoad = true;
      this.autofillDropdown();
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle the error as needed
    }
  }

  setStateCityData() {
    const fetchData = this.allData.pincodeData.find(item => item.pincode == this.DriverTableForm.controls.pincode.value.value)
    this.DriverTableForm.controls.city.setValue(fetchData.city)
  }
  autofillDropdown() {
    if (this.isUpdate) {
      this.locData = this.LocationList.find((x) => x.name == this.DriverTable.driverLocation);
      this.DriverTableForm.controls.driverLocation.setValue(this.locData);

      this.pincodeData = this.pincodeDet.find((x) => x.name == this.DriverTable.pincode);
      this.DriverTableForm.controls.pincode.setValue(this.pincodeData);

      this.vehicleData = this.vehicleDet.find((x) => x.name == this.DriverTable.vehicleNo);
      this.DriverTableForm.controls.vehicleNo.setValue(this.vehicleData);
    }
  }
  getPincodeData() {
    const pincodeValue = this.DriverTableForm.controls['pincode'].value;
    if (!isNaN(pincodeValue)) { // Check if pincodeValue is a valid number
      const pincodeList = this.pincodeDet.map((x) => ({ name: parseInt(x.name), value: parseInt(x.value) }));

      const exactPincodeMatch = pincodeList.find(element => element.name === pincodeValue.value);

      if (!exactPincodeMatch) {
        if (pincodeValue.toString().length > 2) {
          const filteredPincodeDet = pincodeList.filter(element => element.name.toString().includes(pincodeValue));
          if (filteredPincodeDet.length === 0) {
            // Show a popup indicating no data found for the given pincode
            Swal.fire({
              icon: "info",
              title: "No Data Found",
              text: `No data found for pincode ${pincodeValue}`,
              showConfirmButton: true,
            });
            return; // Exit the function
          } else {
            this.filter.Filter(
              this.jsonControlPermanentArray,
              this.DriverTableForm,
              filteredPincodeDet,
              this.Pincode,
              this.pincodeStatus
            );
          }
        }
      }
    }
  }
}

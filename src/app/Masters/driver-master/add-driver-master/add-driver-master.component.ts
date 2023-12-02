import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { DriverControls } from "src/assets/FormControls/DriverMaster";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { DriverMaster } from "src/app/core/models/Masters/Driver";
import Swal from "sweetalert2";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { clearValidatorsAndValidate } from "src/app/Utility/Form Utilities/remove-validation";
import { ImageHandling } from "src/app/Utility/Form Utilities/imageHandling";
import { ImagePreviewComponent } from "src/app/shared-components/image-preview/image-preview.component";
import { MatDialog } from "@angular/material/dialog";
import { PinCodeService } from "src/app/Utility/module/masters/pincode/pincode.service";
import { firstValueFrom } from "rxjs";
@Component({
  selector: "app-add-driver-master",
  templateUrl: "./add-driver-master.component.html",
})
export class AddDriverMasterComponent implements OnInit {
  driverFormControls: DriverControls;
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  DriverTableForm: UntypedFormGroup;
  DriverTable: DriverMaster;
  //#region Variable declaration
  isUpdate = false;
  action: any;
  updateCountry: any;
  jsonControlDriverArray: any;
  location: any;
  backPath: string;
  locationStatus: any;
  category: any;
  categoryStatus: any;
  breadScrums: { title: string; items: string[]; active: string; generatecontrol: true; toggle: boolean; }[];
  vehicleDet: any;
  imageName: string;
  routeLocation: any;
  categoryDet: any;
  LocationList: any;
  locData: any;
  pincodeStatus: any;
  tableLoad: boolean;
  newDriverId: string;
  vehicleNo: any;
  vehicleNoStatus: any;
  pincodeData: any;
  vehicleData: any;
  countryList: any;
  countryCode: any;
  countryCodeStatus: any;
  newDriverCode: any;
  submit = 'Save';
  imageData: any = {};
  allData: { locationData: any; pincodeData: any; vehicleData: any; driverData: any; };
  pincode: any;
  pincodeDet: any;

  //#endregion

  constructor(
    private Route: Router,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService,
    private objImageHandling: ImageHandling,
    private dialog: MatDialog,
    private objPinCodeService: PinCodeService

  ) {
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.DriverTable = Route.getCurrentNavigation().extras.state.data;

      this.isUpdate = true;
      this.imageData = {
        'DOBProofScan': this.DriverTable.DOBProofScan,
        'addressProofScan': this.DriverTable.addressProofScan,
        'licenseScan': this.DriverTable.licenseScan,
        'driverPhoto': this.DriverTable.driverPhoto
      }
      this.submit = 'Modify';
      this.action = "edit";
    } else {
      this.action = "Add";
    }
    if (this.action === "edit") {
      this.isUpdate = true;
      this.breadScrums = [
        {
          title: "Modify Driver",
          items: ["Masters"],
          active: "Modify Driver",
          generatecontrol: true,
          toggle: this.DriverTable.activeFlag
        },
      ];
    } else {
      this.breadScrums = [
        {
          title: "Add Driver",
          items: ["Masters"],
          active: "Add Driver",
          generatecontrol: true,
          toggle: false
        },
      ];
      this.DriverTable = new DriverMaster({});
    }
    this.initializeFormControl();
  }

  initializeFormControl() {
    //throw new Error("Method not implemented.");
    this.driverFormControls = new DriverControls(
      this.DriverTable,
      this.isUpdate
    );
    // Get form controls for Driver Details section
    this.jsonControlDriverArray = this.driverFormControls.getFormControlsD();
    this.jsonControlDriverArray.forEach((data) => {
      if (data.name === "vehicleNo") {
        // Set category-related variables
        this.vehicleNo = data.name;
        this.vehicleNoStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === "pincode") {
        // Set pincode-related variables
        this.pincode = data.name;
        this.pincodeStatus = data.additionalData.showNameAndValue;
      }
    });
    // Build the form group using formGroupBuilder function
    this.DriverTableForm = formGroupBuilder(this.fb, [
      this.jsonControlDriverArray,
    ]);
  }
  //#endregion

  ngOnInit(): void {
    this.bindDropdown();
    this.getDropDownData();
    this.getAllMastersData();
    this.backPath = "/Masters/DriverMaster/DriverMasterList";
  }

  //#region
  async getAllMastersData() {
    try {
      // Prepare the requests for different collections
      let locationReq = {
        companyCode: this.companyCode,
        filter: {},
        collectionName: "location_detail",
      };
      let pincodeReq = {
        companyCode: this.companyCode,
        filter: {},
        collectionName: "pincode_master",
      };
      let vehicleReq = {
        companyCode: this.companyCode,
        filter: {},
        collectionName: "vehicle_detail",
      };
      let driverReq = {
        companyCode: this.companyCode,
        filter: {},
        collectionName: "driver_detail",
      };
      const locationRes = await firstValueFrom(this.masterService
        .masterPost("generic/get", locationReq));
      const pincodeRes = await firstValueFrom(this.masterService
        .masterPost("generic/get", pincodeReq));
      const vehicleRes = await firstValueFrom(this.masterService
        .masterPost("generic/get", vehicleReq));
      const driverRes = await firstValueFrom(this.masterService
        .masterPost("generic/get", driverReq));

      const mergedData = {
        locationData: locationRes?.data,
        pincodeData: pincodeRes?.data,
        vehicleData: vehicleRes?.data,
        driverData: driverRes?.data
      };
      this.allData = mergedData;

      const vehicleDet = mergedData.vehicleData.map((element) => ({
        name: element.vehicleNo,
        value: element.vehicleNo,
      }));
      const pincodeDet = mergedData.pincodeData.map((element) => ({
        name: element.PIN.toString(),
        value: element.PIN.toString(),
      }));

      this.vehicleDet = vehicleDet;
      this.pincodeDet = pincodeDet;

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
  //#endregion

  //#region
  bindDropdown() {
    const propertyMappings = {
      country: { property: "countryCode", statusProperty: "countryCodeStatus" },
    };

    this.jsonControlDriverArray.forEach((data) => {
      const mapping = propertyMappings[data.name];
      if (mapping) {
        this[mapping.property] = data.name;
        this[mapping.statusProperty] = data.additionalData.showNameAndValue;
      }
    });
  }
  //#endregion

  //#region
  autofillDropdown() {
    if (this.isUpdate) {
      this.pincodeData = this.pincodeDet.find(
        (x) => x.name == this.DriverTable.pincode
      );
      this.DriverTableForm.controls.pincode.setValue(this.pincodeData);

      this.vehicleData = this.vehicleDet.find(
        (x) => x.name == this.DriverTable.vehicleNo
      );
      this.DriverTableForm.controls.vehicleNo.setValue(this.vehicleData);
    }
    // For setting image data, assuming you have imageData defined
    Object.keys(this.imageData).forEach((controlName) => {
      const url = this.imageData[controlName];
      const fileName = this.objImageHandling.extractFileName(url);
      // Set the form control value using the control name
      this.DriverTableForm.controls[controlName].setValue(fileName);

      //setting isFileSelected to true
      const control = this.jsonControlDriverArray.find(x => x.name === controlName);
      control.additionalData.isFileSelected = false
    });
  }
  //#endregion

  //#region
  async getDropDownData() {
    try {
      const res: any = await firstValueFrom(this.masterService.getJsonFileDetails("dropDownUrl"));
      this.countryList = res.countryList;
      if (this.isUpdate) {
        this.updateCountry = this.findDropdownItemByName(
          this.countryList,
          this.DriverTable.country
        );
        this.DriverTableForm.controls.country.setValue(this.updateCountry);
      }
      const filterParams = [
        [
          this.jsonControlDriverArray,
          this.countryList,
          this.countryCode,
          this.countryCodeStatus,
        ],
      ];
      filterParams.forEach(
        ([jsonControlArray, dropdownData, formControl, statusControl]) => {
          this.filter.Filter(
            jsonControlArray,
            this.DriverTableForm,
            dropdownData,
            formControl,
            statusControl
          );
        }
      );
    } catch (error) {
      // Handle errors here
      console.error("Error fetching dropdown data:", error);
    }
  }
  //#endregion

  //#region
  findDropdownItemByName(dropdownData, name) {
    return dropdownData.find((item) => item.name === name);
  }
  //#endregion

  //#region Driver Photo
  async selectFileDriverPhoto(data) {
    const allowedFormats = ["jpeg", "png", "jpg"];
    // Call the uploadFile method from the service
    this.imageData = await this.objImageHandling.uploadFile(data.eventArgs, "driverPhoto", this.
      DriverTableForm, this.imageData, "Driver", 'Master', this.jsonControlDriverArray, allowedFormats);
  }
  //#endregion

  //#region License Scan
  async selectedFileLicenseScan(data) {
    const allowedFormats = ["jpeg", "png", "jpg"];
    // Call the uploadFile method from the service
    this.imageData = await this.objImageHandling.uploadFile(data.eventArgs, "licenseScan", this.
      DriverTableForm, this.imageData, "Driver", 'Master', this.jsonControlDriverArray, allowedFormats);
  }
  //#endregion

  //#region DOB proof scan
  async selectedFileDOBProofScan(data) {
    const allowedFormats = ["jpeg", "png", "jpg"];
    // Call the uploadFile method from the service
    this.imageData = await this.objImageHandling.uploadFile(data.eventArgs, "DOBProofScan", this.
      DriverTableForm, this.imageData, "Driver", 'Master', this.jsonControlDriverArray, allowedFormats);
  }
  //#endregion

  //#region Address Proof Scan
  async selectedFileAddressProofScan(data) {
    const allowedFormats = ["jpeg", "png", "jpg"];
    // Call the uploadFile method from the service
    this.imageData = await this.objImageHandling.uploadFile(data.eventArgs, "addressProofScan", this.
      DriverTableForm, this.imageData, "Driver", 'Master', this.jsonControlDriverArray, allowedFormats);
  }
  //#endregion

  //#region save
  async save() {
    const controls = this.DriverTableForm;
    clearValidatorsAndValidate(controls);
    const formValue = this.DriverTableForm.value;
    const controlNames = ["country", "pincode", "vehicleNo"];
    controlNames.forEach((controlName) => {
      const controlValue = formValue[controlName]?.name;
      this.DriverTableForm.controls[controlName].setValue(controlValue);
    });

    // Remove field from the form controls
    this.DriverTableForm.removeControl("companyCode");
    this.DriverTableForm.removeControl("updateBy");
    this.DriverTableForm.removeControl("isUpdate");
    //  let data = convertNumericalStringsToInteger(this.DriverTableForm.value)
    this.DriverTableForm.controls["activeFlag"].setValue(
      this.DriverTableForm.value.activeFlag === true ? true : false
    );
    // Define an array of control names
    const imageControlNames = ['driverPhoto', 'licenseScan', 'addressProofScan', 'DOBProofScan'];
    let data = { ...this.DriverTableForm.value };

    imageControlNames.forEach(controlName => {
      const file = this.objImageHandling.getFileByKey(controlName, this.imageData);

      // Set the URL in the corresponding control name
      data[controlName] = file;
    });

    let req = {
      companyCode: this.companyCode,
      collectionName: "driver_detail",
      filter: {},
    };
    const res = await firstValueFrom(this.masterService
      .masterPost("generic/get", req));
    if (res) {
      // Generate srno for each object in the array
      const lastUsedDriverCode = res.data[res.data.length - 1];
      const lastDriverCode = lastUsedDriverCode
        ? parseInt(lastUsedDriverCode.manualDriverCode.substring(3))
        : 0;
      // Function to generate a new route code
      function generateDriverCode(initialCode: number = 0) {
        const nextDriverCode = initialCode + 1;
        const driverCodeNumber = nextDriverCode.toString().padStart(4, "0");
        const driverCode = `DR${driverCodeNumber}`;
        return driverCode;
      }
      if (this.isUpdate) {
        this.newDriverCode = this.DriverTable._id;
      } else {
        this.newDriverCode = generateDriverCode(lastDriverCode);
      }
      //generate unique manualDriverCode
      data.manualDriverCode = this.newDriverCode

      if (this.isUpdate) {
        let id = this.DriverTableForm.value._id;
        // Remove the "_id" field from the form controls
        this.DriverTableForm.removeControl("_id");
        let req = {
          companyCode: this.companyCode,
          collectionName: "driver_detail",
          filter: { _id: id },
          update: data,
        };
        const res = await firstValueFrom(this.masterService
          .masterPut("generic/update", req));
        if (res) {
          // Display success message
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: res.message,
            showConfirmButton: true,
          });
          this.Route.navigateByUrl("/Masters/DriverMaster/DriverMasterList");
        }
      } else {
        //const data = this.DriverTableForm.value;
        this.DriverTableForm.removeControl("_id");
        // Assign the generated _id directly
        const id = { _id: this.newDriverCode };
        // Merge the data and id objects
        const mergedObject = { ...data, ...id };

        let req = {
          companyCode: this.companyCode,
          collectionName: "driver_detail",
          data: mergedObject,
        };

        const res = await firstValueFrom(this.masterService
          .masterPost("generic/create", req));
        if (res) {
          // Display success message
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: res.message,
            showConfirmButton: true,
          });
          this.Route.navigateByUrl("/Masters/DriverMaster/DriverMasterList");
        }
      }
    }
  }
  //#endregion

  cancel() {
    this.Route.navigateByUrl("/Masters/DriverMaster/DriverMasterList");
  }

  setStateCityData() {
    const fetchData = this.allData.pincodeData.find((item) =>
      item.PIN == this.DriverTableForm.controls.pincode.value.value
    );
    this.DriverTableForm.controls.city.setValue(fetchData.CT);
  }

  //#region to set pin code
  getPincodeData() {
    this.objPinCodeService.validateAndFilterPincode(this.DriverTableForm, "", this.jsonControlDriverArray, 'pincode', this.pincodeStatus);
  }
  //#endregion

  //#region
  async checkDriverNameExist() {
    const drivernameExists = this.allData.driverData.some(
      (res) =>
        res._id === this.DriverTableForm.value._id ||
        res.driverName.toUpperCase() === this.DriverTableForm.value.driverName.toUpperCase()
    );
    if (drivernameExists) {
      // Show the popup indicating that the state already exists
      Swal.fire({
        text: "Driver Name already exists! Please try with another",
        title: 'Error',
        icon: "error",
        showConfirmButton: true,
      });
      this.DriverTableForm.controls["driverName"].reset();
    }
  }
  //#endregion

  //#region
  async checkLicenseNumberExist() {
    const licenseExists = this.allData.driverData.some(
      (res) =>
        res._id === this.DriverTableForm.value._id ||
        res.licenseNo === this.DriverTableForm.value.licenseNo
    );
    if (licenseExists) {
      // Show the popup indicating that the state already exists
      Swal.fire({
        text: "License Number already exists! Please try with another",
        title: 'Error',
        icon: "error",
        showConfirmButton: true,
      });
      this.DriverTableForm.controls["licenseNo"].reset();
    }
    error: (err: any) => {
      // Handle error if required
      console.error(err);
    };
  }
  //#endregion

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
  onToggleChange(event: boolean) {
    // Handle the toggle change event in the parent component
    this.DriverTableForm.controls['activeFlag'].setValue(event);
    // console.log("Toggle value :", event);
  }
  //#region to preview image
  openImageDialog(control) {
    const file = this.objImageHandling.getFileByKey(control.imageName, this.imageData);
    this.dialog.open(ImagePreviewComponent, {
      data: { imageUrl: file },
      width: '30%',
      height: '50%',
    });
  }
  //#endregion
}

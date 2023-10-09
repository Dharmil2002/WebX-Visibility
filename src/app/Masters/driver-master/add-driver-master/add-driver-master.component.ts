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
import { HttpErrorResponse } from "@angular/common/http";
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
  accordionData: any;
  location: any;
  locationStatus: any;
  category: any;
  categoryStatus: any;
  breadScrums: { title: string; items: string[]; active: string; generatecontrol: true; toggle: boolean; }[];
  selectedFiles: boolean;
  SelectFile: File;
  vehicleDet: any;
  imageName: string;
  routeLocation: any;
  categoryDet: any;
  LocationList: any;
  locData: any;
  pincode: any;
  pincodeStatus: any;
  tableLoad: boolean;
  pincodeDet: any;
  allData: { locationData: any; pincodeData: any; vehicleData: any };
  driverData: any;
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
  //#endregion

  constructor(
    private Route: Router,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService
  ) {
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.DriverTable = Route.getCurrentNavigation().extras.state.data;

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
          title: "Driver Master",
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
        collectionName: "pincode_detail",
      };
      let vehicleReq = {
        companyCode: this.companyCode,
        filter: {},
        collectionName: "vehicle_detail",
      };

      const locationRes = await this.masterService
        .masterPost("generic/get", locationReq)
        .toPromise();
      const pincodeRes = await this.masterService
        .masterPost("generic/get", pincodeReq)
        .toPromise();
      const vehicleRes = await this.masterService
        .masterPost("generic/get", vehicleReq)
        .toPromise();

      const mergedData = {
        locationData: locationRes?.data,
        pincodeData: pincodeRes?.data,
        vehicleData: vehicleRes?.data,
      };
      this.allData = mergedData;

      const vehicleDet = mergedData.vehicleData.map((element) => ({
        name: element.vehicleNo,
        value: element.vehicleNo,
      }));
      const pincodeDet = mergedData.pincodeData.map((element) => ({
        name: element.pincode.toString(),
        value: element.pincode.toString(),
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
      // this.filter.Filter(
      //   this.jsonControlDriverArray,
      //   this.DriverTableForm,
      //   pincodeDet,
      //   this.pincode,
      //   this.pincodeStatus
      // );
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
  }
  //#endregion

  //#region
  getDropDownData() {
    this.masterService.getJsonFileDetails("dropDownUrl").subscribe((res) => {
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
    });
  }
  //#endregion

  //#region
  findDropdownItemByName(dropdownData, name) {
    return dropdownData.find((item) => item.name === name);
  }
  //#endregion

  //#region Driver Photo
  selectedFileDriverPhoto(data) {
    let fileList: FileList = data.eventArgs;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const allowedFormats = ["jpeg", "png", "jpg"];
      const fileFormat = file.type.split("/")[1]; // Extract file format from MIME type

      if (allowedFormats.includes(fileFormat)) {
        this.SelectFile = file;
        this.imageName = file.name;
        this.selectedFiles = true;
        this.DriverTableForm.controls["driverPhoto"].setValue(
          this.SelectFile.name
        );
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

  //#region License Scan
  selectedFileLicenseScan(data) {
    let fileList: FileList = data.eventArgs;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const allowedFormats = ["jpeg", "png", "jpg"];
      const fileFormat = file.type.split("/")[1]; // Extract file format from MIME type

      if (allowedFormats.includes(fileFormat)) {
        this.SelectFile = file;
        this.imageName = file.name;
        this.selectedFiles = true;
        this.DriverTableForm.controls["licenseScan"].setValue(
          this.SelectFile.name
        );
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

  //#region DOB proof scan
  selectedFileDOBProofScan(data) {
    let fileList: FileList = data.eventArgs;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const allowedFormats = ["jpeg", "png", "jpg"];
      const fileFormat = file.type.split("/")[1]; // Extract file format from MIME type

      if (allowedFormats.includes(fileFormat)) {
        this.SelectFile = file;
        this.imageName = file.name;
        this.selectedFiles = true;
        this.DriverTableForm.controls["DOBProofScan"].setValue(
          this.SelectFile.name
        );
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

  //#region Address Proof Scan
  selectedFileAddressProofScan(data) {
    let fileList: FileList = data.eventArgs;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const allowedFormats = ["jpeg", "png", "jpg"];
      const fileFormat = file.type.split("/")[1]; // Extract file format from MIME type

      if (allowedFormats.includes(fileFormat)) {
        this.SelectFile = file;
        this.imageName = file.name;
        this.selectedFiles = true;
        this.DriverTableForm.controls["addressProofScan"].setValue(
          this.SelectFile.name
        );
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

  //#region License No
  selectedFile(data) {
    let fileList: FileList = data.eventArgs;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const allowedFormats = ["jpeg", "png", "jpg"];
      const fileFormat = file.type.split("/")[1]; // Extract file format from MIME type

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
  //#endregion

  //#region Pan Card
  selectedPngFile(data) {
    let fileList: FileList = data.eventArgs;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const allowedFormats = ["jpeg", "png", "jpg"];
      const fileFormat = file.type.split("/")[1]; // Extract file format from MIME type

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
  //#endregion

  //#region save
  async save() {
    const controls = this.DriverTableForm;
    clearValidatorsAndValidate(controls);
    const formValue = this.DriverTableForm.value;
    const controlNames = ["country","pincode","vehicleNo"];
    controlNames.forEach((controlName) => {
      const controlValue = formValue[controlName]?.name;
      this.DriverTableForm.controls[controlName].setValue(controlValue);
    });
    // this.DriverTableForm.controls["country"].setValue(
    //   this.DriverTableForm.value.country.name
    // );
    // this.DriverTableForm.controls["pincode"].setValue(
    //   this.DriverTableForm.value.pincode.name
    // );
    // this.DriverTableForm.controls["vehicleNo"].setValue(
    //   this.DriverTableForm.value.vehicleNo.name
    // );
    // Remove field from the form controls
    this.DriverTableForm.removeControl("companyCode");
    this.DriverTableForm.removeControl("updateBy");
    this.DriverTableForm.removeControl("isUpdate");
    //  let data = convertNumericalStringsToInteger(this.DriverTableForm.value)
    this.DriverTableForm.controls["activeFlag"].setValue(
      this.DriverTableForm.value.activeFlag === true ? true : false
    );

    let req = {
      companyCode: this.companyCode,
      collectionName: "driver_detail",
      filter: {},
    };
    const res = await this.masterService
      .masterPost("generic/get", req)
      .toPromise();
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
      this.DriverTableForm.controls["manualDriverCode"].setValue(
        this.newDriverCode
      );
      if (this.isUpdate) {
        let id = this.DriverTableForm.value._id;
        // Remove the "_id" field from the form controls
        this.DriverTableForm.removeControl("_id");
        let req = {
          companyCode: this.companyCode,
          collectionName: "driver_detail",
          filter: { _id: id },
          update: this.DriverTableForm.value,
        };
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
          this.Route.navigateByUrl("/Masters/DriverMaster/DriverMasterList");
        }
      } else {
        const data = this.DriverTableForm.value;
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

        const res = await this.masterService
          .masterPost("generic/create", req)
          .toPromise();
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

  //#region
  getManualDriverCodeExists() {
    let req = {
      companyCode: this.companyCode,
      filter: {},
      collectionName: "driver_detail",
    };
    this.masterService.masterPost("generic/get", req).subscribe({
      next: (res: any) => {
        if (res) {
          this.driverData = res.data;
          const count = res.data.filter(
            (item) =>
              item.manualDriverCode ==
              this.DriverTableForm.controls.manualDriverCode.value
          );
          if (count.length > 0) {
            Swal.fire({
              title:
                "Driver Manual Code already exists! Please try with another",
              toast: true,
              icon: "error",
              showCloseButton: false,
              showCancelButton: false,
              showConfirmButton: true,
              confirmButtonText: "OK",
            });
            this.DriverTableForm.controls["manualDriverCode"].reset();
          }
        }
      },
    });
  }
  //#endregion

  setStateCityData() {
    const fetchData = this.allData.pincodeData.find(
      (item) =>
        item.pincode == this.DriverTableForm.controls.pincode.value.value
    );
    this.DriverTableForm.controls.city.setValue(fetchData.city);
  }

  //#region
  getPincodeData() {
    const pincodeValue = this.DriverTableForm.controls["pincode"].value;
    // Check if pincodeValue is a valid number and has at least 3 characters
    if (!isNaN(pincodeValue) && pincodeValue.length >= 3) {
      // Find an exact pincode match in the pincodeDet array
      const exactPincodeMatch = this.pincodeDet.find(
        (element) => element.name === pincodeValue
      );

      if (!exactPincodeMatch) {
        // Filter pincodeDet for partial matches
        const filteredPincodeDet = this.pincodeDet.filter((element) =>
          element.name.includes(pincodeValue)
        );

        if (filteredPincodeDet.length === 0) {
          // Show a popup indicating no data found for the given pincode
          Swal.fire({
            icon: "info",
            title: "No Data Found",
            text: `No data found for pincode ${pincodeValue}`,
            showConfirmButton: true,
          });
        } else {
          // Call the filter function with the filtered data
          this.filter.Filter(
            this.jsonControlDriverArray,
            this.DriverTableForm,
            filteredPincodeDet,
            this.pincode,
            this.pincodeStatus
          );
        }
      }
    }
  }
  //#endregion

  //#region
  async checkDriverNameExist() {
    let req = {
      companyCode: this.companyCode,
      collectionName: "driver_detail",
      filter: {},
    };
    const res = await this.masterService
      .masterPost("generic/get", req)
      .toPromise();
    const drivernameExists = res.data.some(
      (res) =>
        res._id === this.DriverTableForm.value._id ||
        res.driverName === this.DriverTableForm.value.driverName
    );
    if (drivernameExists) {
      // Show the popup indicating that the state already exists
      Swal.fire({
        title: "Driver Name already exists! Please try with another",
        toast: true,
        icon: "error",
        showCloseButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: "OK",
      });
      this.DriverTableForm.controls["driverName"].reset();
    }
    error: (err: any) => {
      // Handle error if required
      console.error(err);
    };
  }
  //#endregion

  //#region
  async checkLicenseNumberExist() {
    let req = {
      companyCode: this.companyCode,
      collectionName: "driver_detail",
      filter: {},
    };
    const res = await this.masterService
      .masterPost("generic/get", req)
      .toPromise();
    const licenseExists = res.data.some(
      (res) =>
        res._id === this.DriverTableForm.value._id ||
        res.licenseNo === this.DriverTableForm.value.licenseNo
    );
    if (licenseExists) {
      // Show the popup indicating that the state already exists
      Swal.fire({
        title: "license Number already exists! Please try with another",
        toast: true,
        icon: "error",
        showCloseButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: "OK",
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
    console.log("Toggle value :", event);
  }
}

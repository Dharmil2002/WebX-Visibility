import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { VendorMaster } from "src/app/core/models/Masters/vendor-master";
import { VendorControl } from "src/assets/FormControls/vendor-control";
import { MasterService } from "src/app/core/service/Masters/master.service";
import Swal from "sweetalert2";
import { convertNumericalStringsToInteger } from "src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction";
import { Subject, take, takeUntil } from "rxjs";

@Component({
  selector: 'app-add-vendor-master',
  templateUrl: './add-vendor-master.component.html',
})
export class AddVendorMasterComponent implements OnInit {
  breadScrums: { title: string; items: string[]; active: string; }[];
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  action: string;
  isUpdate = false;
  vendorTabledata: VendorMaster;
  vendorTableForm: UntypedFormGroup;
  vendorFormControls: VendorControl;
  jsonControlVendorArray: any;
  jsonControlVendorOtherInfoArray: any;
  vendorType: any;
  vendorTypeStatus: any;
  data: any;
  accordionData: any;
  vLocation: any;
  vLocationStatus: any;
  vendorCity: any;
  vendorCityStatus: any;
  tdsSection: any;
  tdsSectionStatus: any;
  tdsType: any;
  tdsTypeStatus: any;
  lspName: any;
  lspNameStatus: any;
  vendorTypDetail: any;
  vendorTypeData: any;
  tdsSectionData: any;
  tdsTypeData: any;
  lspNameData: any;
  tdsSectionDetail: any;
  tdsTypeDetail: any;
  lspNameDetail: any;
  SelectFile: File;
  imageName: string;
  selectedFiles: boolean;
  vendorPinCodeStatus: any;
  vendorPinCode: any;
  pincodeResponse: any;
  pincodeData: any;
  newVendorCode: string;

  ngOnInit(): void {
    this.getDropDownData();
    this.getAllMastersData();
  }
  // Function to handle function calls
  functionCallHandler($event) {
    let functionName = $event.functionName;     // name of the function , we have to call
    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  constructor(
    private route: Router, private fb: UntypedFormBuilder, private filter: FilterUtils, private masterService: MasterService,) {
    if (this.route.getCurrentNavigation()?.extras?.state != null) {
      this.vendorTabledata = route.getCurrentNavigation().extras.state.data;
      this.action = 'edit'
      this.isUpdate = true;
    } else {
      this.action = "Add";
    }
    if (this.action === 'edit') {
      this.isUpdate = true;
      this.breadScrums = [
        {
          title: "Vendor Master",
          items: ["Home"],
          active: "Edit Vendor",
        },
      ];
    } else {
      this.breadScrums = [
        {
          title: "Vendor Master",
          items: ["Home"],
          active: "Add Vendor",
        },
      ];
      this.vendorTabledata = new VendorMaster({});
    }
    this.initializeFormControl()
    this.isUpdate ? this.vendorTableForm.controls["vendorType"].setValue(this.vendorTabledata.vendorType) : "";
  }
  initializeFormControl() {
    // Create vendorFormControls instance to get form controls for different sections
    const vehicleFormControls = new VendorControl(this.vendorTabledata, this.isUpdate);
    this.jsonControlVendorArray = vehicleFormControls.getVendorFormControls();
    this.jsonControlVendorOtherInfoArray = vehicleFormControls.getVendorOtherInfoFormControls();
    this.jsonControlVendorArray.forEach(data => {
      if (data.name === 'vendorType') {
        // Set vendorType related variables
        this.vendorType = data.name;
        this.vendorTypeStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'vendorLocation') {
        // Set vendorLocation related variables
        this.vLocation = data.name;
        this.vLocationStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'vendorPinCode') {
        // Set vendorPinCode related variables
        this.vendorPinCode = data.name;
        this.vendorPinCodeStatus = data.additionalData.showNameAndValue;
      }
    });
    this.jsonControlVendorOtherInfoArray.forEach(data => {
      if (data.name === 'tdsSection') {
        // Set tdsSection related variables
        this.tdsSection = data.name;
        this.tdsSectionStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'tdsType') {
        // Set tdsType related variables
        this.tdsType = data.name;
        this.tdsTypeStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'lspName') {
        // Set lspName related variables
        this.lspName = data.name;
        this.lspNameStatus = data.additionalData.showNameAndValue;
      }
    });
    this.accordionData = {
      "Vendor Details": this.jsonControlVendorArray,
      "Vendor Other Details": this.jsonControlVendorOtherInfoArray,
    };
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.vendorTableForm = formGroupBuilder(this.fb, Object.values(this.accordionData));
  }
  getDropDownData() {
    this.masterService.getJsonFileDetails('dropDownUrl').subscribe(res => {
      const {
        vendorTypeDropdown,
        tdsSectionDropdown,
        tdsTypeDropdown,
        lspNameDropdown,
      } = res;
      this.vendorTypeData = vendorTypeDropdown;
      this.tdsSectionData = tdsSectionDropdown;
      this.tdsTypeData = tdsTypeDropdown;
      this.lspNameData = lspNameDropdown;

      if (this.isUpdate) {
        this.vendorTypDetail = this.findDropdownItemByName(this.vendorTypeData, this.vendorTabledata.vendorType);
        this.vendorTableForm.controls.vendorType.setValue(this.vendorTypDetail);

        this.tdsSectionDetail = this.findDropdownItemByName(this.tdsSectionData, this.vendorTabledata.tdsSection);
        this.vendorTableForm.controls.tdsSection.setValue(this.tdsSectionDetail);

        this.tdsTypeDetail = this.findDropdownItemByName(this.tdsTypeData, this.vendorTabledata.tdsType);
        this.vendorTableForm.controls.tdsType.setValue(this.tdsTypeDetail);

        this.lspNameDetail = this.findDropdownItemByName(this.lspNameData, this.vendorTabledata.lspName);
        this.vendorTableForm.controls.lspName.setValue(this.lspNameDetail);

        this.vendorTableForm.controls["tdsSectionDropdown"].patchValue(this.tdsSectionData.filter((element) =>
          this.vendorTabledata.tdsSection.includes(element.name)))
      }

      const filterParams = [
        [this.jsonControlVendorArray, this.vendorTypeData, this.vendorType, this.vendorTypeStatus],
        [this.jsonControlVendorOtherInfoArray, this.tdsSectionData, this.tdsSection, this.tdsSectionStatus],
        [this.jsonControlVendorOtherInfoArray, this.tdsTypeData, this.tdsType, this.tdsTypeStatus],
        [this.jsonControlVendorOtherInfoArray, this.lspNameData, this.lspName, this.lspNameStatus],
      ];

      filterParams.forEach(([jsonControlArray, dropdownData, formControl, statusControl]) => {
        this.filter.Filter(jsonControlArray, this.vendorTableForm, dropdownData, formControl, statusControl);
      });
    });
  }
  findDropdownItemByName(dropdownData, name) {
    return dropdownData.find(item => item.name === name);
  }
  selectedFileForTdsDocument(data) {
    let fileList: FileList = data.eventArgs;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.SelectFile = file;
      this.imageName = file.name;
      this.selectedFiles = true;
      this.vendorTableForm.controls["tdsDocument"].setValue(this.SelectFile.name);
    } else {
      this.selectedFiles = false;
      Swal.fire({
        icon: "warning",
        title: "Alert",
        text: "Please select a file.",
        showConfirmButton: true,
      });
    }
  }
  selectedFileForCancelCheque(data) {
    let fileList: FileList = data.eventArgs;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const allowedFormats = ["jpeg", "png", "jpg"];
      const fileFormat = file.type.split('/')[1]; // Extract file format from MIME type

      if (allowedFormats.includes(fileFormat)) {
        this.SelectFile = file;
        this.imageName = file.name;
        this.selectedFiles = true;
        this.vendorTableForm.controls["cancelCheque"].setValue(this.SelectFile.name);
      } else {
        this.selectedFiles = false;
        Swal.fire({
          icon: "warning",
          title: "Alert",
          text: `Please select a CSV, JPEG, PNG, or JPG file.`,
          showConfirmButton: true,
        });
      }
    } else {
      this.selectedFiles = false;
      alert("No file selected");
    }
  }
  selectedFileForPdfFile(data) {
    let fileList: FileList = data.eventArgs;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const allowedFormats = ["pdf"];
      const fileFormat = file.type.split('/')[1]; // Extract file format from MIME type

      if (allowedFormats.includes(fileFormat)) {
        this.SelectFile = file;
        this.imageName = file.name;
        this.selectedFiles = true;
        this.vendorTableForm.controls["pdfFileUpload"].setValue(this.SelectFile.name);
      } else {
        this.selectedFiles = false;
        Swal.fire({
          icon: "warning",
          title: "Alert",
          text: `Please select a PDF`,
          showConfirmButton: true,
        });
      }
    } else {
      this.selectedFiles = false;
      Swal.fire({
        icon: "warning",
        title: "Alert",
        text: "Please select a file.",
        showConfirmButton: true,
      });
    }
  }
  selectedFileForReliableDocument(data) {
    let fileList: FileList = data.eventArgs;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.SelectFile = file;
      this.imageName = file.name;
      this.selectedFiles = true;
      this.vendorTableForm.controls["reliableDocument"].setValue(this.SelectFile.name);
    } else {
      this.selectedFiles = false;
      Swal.fire({
        icon: "warning",
        title: "Alert",
        text: "Please select a file.",
        showConfirmButton: true,
      });
    }
  }
  displayTds() {
    const generateControl = this.vendorTableForm.value.tdsApplicable === true;

    this.jsonControlVendorOtherInfoArray.forEach(data => {
      if (data.name === 'tdsSection' || data.name === 'tdsRate' || data.name === 'tdsType') {
        data.generatecontrol = generateControl;

        // Get the corresponding form control
        const formControl = this.vendorTableForm.get(data.name);

        // Clear existing validators before adding the required validator
        formControl.clearValidators();

        if (generateControl) {
          // Add the required validator if generateControl is true
          formControl.setValidators([Validators.required]);
        }

        // Update the form control's validation status
        formControl.updateValueAndValidity();
      }
    });
  }
  /*get All Master Data*/
  async getAllMastersData() {
    try {
      const reqBody = {
        "companyCode": this.companyCode,
        "type": "masters",
        "collection": "location_detail"
      }
      const pincodeBody = {
        "companyCode": this.companyCode,
        "type": "masters",
        "collection": "pincode_detail"
      }
      const locationBranchResponse = await this.masterService.masterPost('common/getall', reqBody).toPromise();
      this.pincodeResponse = await this.masterService.masterPost('common/getall', pincodeBody).toPromise();
      const locationBranchList = locationBranchResponse.data.map((x) => { { return { name: x.locName, value: x.locCode } } })

      // Handle the response from the server
      if (this.isUpdate) {
        this.vendorTableForm.controls["vendorLocationDropdown"].patchValue(locationBranchList.filter((element) =>
          this.vendorTabledata.vendorLocation.includes(element.name)
        ));
        this.pincodeData = this.pincodeResponse.data.map((x) => { { return { name: x.pincode, value: x.pincode } } }).find((x) => x.name == this.vendorTabledata.vendorPinCode);
        this.vendorTableForm.controls.vendorPinCode.setValue(this.pincodeData);

      }
      this.filter.Filter(this.jsonControlVendorArray, this.vendorTableForm, locationBranchList, this.vLocation, this.vLocationStatus);
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error('Error:', error);
    }
  }
  getPincode() {
    const pincodeValue = this.vendorTableForm.controls['vendorPinCode'].value;

    if (!isNaN(pincodeValue)) { // Check if pincodeValue is a valid number
      const pincodeList = this.pincodeResponse.data.map((x) => ({ name: parseInt(x.pincode), value: parseInt(x.pincode) }));

      const exactPincodeMatch = pincodeList.find(element => element.name === pincodeValue);

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
            this.filter.Filter(this.jsonControlVendorArray, this.vendorTableForm, filteredPincodeDet, this.vendorPinCode, this.vendorPinCodeStatus);
          }
        }
      }
    }
  }

  save() {
    const formValue = this.vendorTableForm.value;
    const controlNames = [
      "vendorType",
      "tdsType",
      "vendorPinCode",
      "lspName",
    ];
    controlNames.forEach(controlName => {
      const controlValue = formValue[controlName]?.name;
      this.vendorTableForm.controls[controlName].setValue(controlValue);
    });
    const vendorLocationDropdown1 = this.vendorTableForm.value.vendorLocationDropdown.map((item: any) => item.name);
    this.vendorTableForm.controls["vendorLocation"].setValue(vendorLocationDropdown1);

    const tdsSectionDropdownValue = this.vendorTableForm.value.tdsSectionDropdown;
    // Check if tdsSectionDropdownValue is empty string
    const tdsSectionDropdown1 = tdsSectionDropdownValue !== '' ? tdsSectionDropdownValue.map((item: any) => item.name) : [];

    this.vendorTableForm.controls["tdsSection"].setValue(tdsSectionDropdown1);

    this.vendorTableForm.controls["isActive"].setValue(this.vendorTableForm.value.isActive);
    Object.values(this.vendorTableForm.controls).forEach(control => control.setErrors(null));
    // Remove  field from the form controls
    this.vendorTableForm.removeControl("vendorLocationDropdown");
    this.vendorTableForm.removeControl("tdsSectionDropdown");
    let data = convertNumericalStringsToInteger(this.vendorTableForm.value)
    if (this.isUpdate) {
      let id = data.id;
      // Remove the "id" field from the form controls
      delete data.id;
      let req = {
        companyCode: this.companyCode,
        type: "masters",
        collection: "vendor_detail",
        id: id,
        updates: data
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
            this.route.navigateByUrl('/Masters/VendorMaster/VendorMasterList');
          }
        }
      });
    }
    else {
      let req = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        "type": "masters",
        "collection": "vendor_detail"
      }
      this.masterService.masterPost('common/getall', req).subscribe({
        next: (res: any) => {
          if (res) {
            // Generate srno for each object in the array
            const lastCode = res.data[res.data.length - 1];
            const lastVendorCode = lastCode ? parseInt(lastCode.vendorCode.substring(1)) : 0;
            // Function to generate a new route code
            function generateVendorCode(initialCode: number = 0) {
              const nextVendorCode = initialCode + 1;
              const vendorNumber = nextVendorCode.toString().padStart(4, '0');
              const vendorCode = `V${vendorNumber}`;
              return vendorCode;
            }
            this.newVendorCode = generateVendorCode(lastVendorCode);
            data.vendorCode = this.newVendorCode;
            data.id = this.newVendorCode;
            let req = {
              companyCode: this.companyCode,
              type: "masters",
              collection: "vendor_detail",
              data: data
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
                  this.route.navigateByUrl('/Masters/VendorMaster/VendorMasterList');
                }
              }
            });
          }
        }
      })
    }
  }
  cancel() {
    window.history.back();
  }
  setStateCityData() {
    const fetchData = this.pincodeResponse.data.find(item => item.pincode == this.vendorTableForm.controls.vendorPinCode.value.value)
    this.vendorTableForm.controls.vendorCity.setValue(fetchData.city)
  }
  protected _onDestroy = new Subject<void>();
  // function handles select All feature of all multiSelect fields of one form.
  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;
    const index = this.jsonControlVendorArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonControlVendorArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.vendorTableForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }
  //#endregion

  displayCp() {
    this.jsonControlVendorOtherInfoArray.forEach(data => {
      if (data.name === 'cpCode') {
        data.generatecontrol = this.vendorTableForm.controls.select.value === 'CP';
      }
    });
  }

}
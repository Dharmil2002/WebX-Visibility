import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { utilityService } from "src/app/Utility/utility.service";
import { VendorMaster } from "src/app/core/models/Masters/vendor-master";
import { VendorControl } from "src/assets/FormControls/vendor-control";
import { MasterService } from "src/app/core/service/Masters/master.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-add-vendor-master',
  templateUrl: './add-vendor-master.component.html',
})
export class AddVendorMasterComponent implements OnInit {
  breadScrums: { title: string; items: string[]; active: string; }[];
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  action: string;
  isUpdate = false;
  lastUsedVendorCode = 0;
  vendorTabledata: VendorMaster;
  vendorTableForm: UntypedFormGroup;
  vendorFormControls: VendorControl;
  jsonControlVendorArray: any;
  jsonControlVendorOtherInfoArray: any;
  vendorType: any;
  vendorTypeStatus: any;
  vTypelist: string;
  jsonControlArray: any;
  vCity: any;
  vCityStatus: any;
  vTypeStatus: any;
  data: any;
  vendorCode: any;
  vType: any;
  updateVendorCity: any;
  updateVendorType: any;
  vendorName: any;
  accordionData: any;
  vSubType: any;
  vSubTypeStatus: any;
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
  vehicleTypeData: any;
  vendorTypDetail: any;
  vendorTypeData: any;
  vSubTypeData: any;
  vLocationData: any;
  vendorCityData: any;
  tdsSectionData: any;
  tdsTypeData: any;
  lspNameData: any;
  selectData: any;
  vSubTypeDetail: any;
  vLocationDetail: any;
  vendorCityDetail: any;
  tdsSectionDetail: any;
  tdsTypeDetail: any;
  lspNameDetail: any;
  selectDetail: any;
  select: any;
  selectStatus: any;
  vendorCityName: any;
  SelectFile: File;
  imageName: string;
  selectedFiles: boolean;
  ngOnInit(): void {
    this.getDropDownData();
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
    private route: Router, private fb: UntypedFormBuilder, private filter: FilterUtils, private service: utilityService, private masterService: MasterService,) {
    if (this.route.getCurrentNavigation()?.extras?.state != null) {
      this.data = route.getCurrentNavigation().extras.state.data;
      this.action = 'edit'
      this.isUpdate = true;
    } else {
      this.action = "Add";
    }
    if (this.action === 'edit') {
      this.isUpdate = true;
      this.vendorTabledata = this.data;
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
        // Set vendorType category-related variables
        this.vendorType = data.name;
        this.vendorTypeStatus = data.additionalData.showNameAndValue;
      }

      if (data.name === 'vendorLocation') {
        // Set vendorLocation category-related variables
        this.vLocation = data.name;
        this.vLocationStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'vendorCity') {
        // Set vendorCity category-related variables
        this.vendorCityName = data.name;
        this.vendorCityStatus = data.additionalData.showNameAndValue;
      }
    });
    this.jsonControlVendorOtherInfoArray.forEach(data => {
      if (data.name === 'tdsSection') {
        // Set tdsSection category-related variables
        this.tdsSection = data.name;
        this.tdsSectionStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'tdsType') {
        // Set tdsType category-related variables
        this.tdsType = data.name;
        this.tdsTypeStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'lspName') {
        // Set lspName category-related variables
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
        locdataDropDown,
        cityLocDropDown,
        tdsSectionDropdown,
        tdsTypeDropdown,
        lspNameDropdown,
      } = res;
      this.vendorTypeData = vendorTypeDropdown;
      this.vLocationData = locdataDropDown;
      this.vendorCityData = cityLocDropDown;
      this.tdsSectionData = tdsSectionDropdown;
      this.tdsTypeData = tdsTypeDropdown;
      this.lspNameData = lspNameDropdown;

      if (this.isUpdate) {
        this.vendorTypDetail = this.findDropdownItemByName(this.vendorTypeData, this.vendorTabledata.vendorType);
        this.vendorTableForm.controls.vendorType.setValue(this.vendorTypDetail);

        this.vendorCityDetail = this.findDropdownItemByName(this.vendorCityData, this.vendorTabledata.vendorCity);
        this.vendorTableForm.controls.vendorCity.setValue(this.vendorCityDetail);

        this.tdsSectionDetail = this.findDropdownItemByName(this.tdsSectionData, this.vendorTabledata.tdsSection);
        this.vendorTableForm.controls.tdsSection.setValue(this.tdsSectionDetail);

        this.tdsTypeDetail = this.findDropdownItemByName(this.tdsTypeData, this.vendorTabledata.tdsType);
        this.vendorTableForm.controls.tdsType.setValue(this.tdsTypeDetail);

        this.lspNameDetail = this.findDropdownItemByName(this.lspNameData, this.vendorTabledata.lspName);
        this.vendorTableForm.controls.lspName.setValue(this.lspNameDetail);

        this.vendorTableForm.controls["vendorLocationDropdown"].patchValue(this.vLocationData.filter((element) =>
          this.vendorTabledata.vendorLocation.includes(element.name)))

        this.vendorTableForm.controls["tdsSectionDropdown"].patchValue(this.tdsSectionData.filter((element) =>
          this.vendorTabledata.tdsSection.includes(element.name)))
      }

      const filterParams = [
        [this.jsonControlVendorArray, this.vendorTypeData, this.vendorType, this.vendorTypeStatus],
        [this.jsonControlVendorArray, this.vLocationData, this.vLocation, this.vLocationStatus],
        [this.jsonControlVendorArray, this.vendorCityData, this.vendorCityName, this.vendorCityStatus],
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
  generateNextVendorCode(): string {
    // Get the last used vendor code from localStorage
    const lastVendorCode = parseInt(localStorage.getItem('lastVendorCode') || '0', 10);

    // Increment the last Vendor user code by 1 to generate the next one
    const nextVendorCode = lastVendorCode + 1;

    // Convert the number to a 4-digit string, padded with leading zeros
    const paddedNumber = nextVendorCode.toString().padStart(4, '0');

    // Combine the prefix "VDR" with the padded number to form the complete vendor code
    const vendorCode = `VDR${paddedNumber}`;

    // Update the last used Vendor code in localStorage
    localStorage.setItem('lastVendorCode', nextVendorCode.toString());

    return vendorCode;
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
  onChange(event: any) {
    // Get the value of the vendorSubType toggle
    const vendorSubTypeEnabled = event.target.checked;
    // Show/hide additional dropdown based on the toggle state
    if (vendorSubTypeEnabled) {
      this.vendorTableForm.controls['additionalDropdown'].enable();
    } else {
      this.vendorTableForm.controls['additionalDropdown'].disable();
    }
  }
  displayTds() {
    const generateControl = this.vendorTableForm.value.tdsApplicable == true;  // Check if value is "Y" to generate control
    this.jsonControlVendorOtherInfoArray.forEach(data => {
      if (data.name === 'tdsSection' || data.name === 'tdsRate' || data.name === 'tdsType') {
        data.generatecontrol = generateControl;  // Set generatecontrol property based on the generateControl value
      }
    });
  }
  save() {
    const formValue = this.vendorTableForm.value;
    const controlNames = [
      "vendorType",
      "vendorCity",
      "tdsType",
      "lspName",
    ];
    controlNames.forEach(controlName => {
      const controlValue = formValue[controlName]?.name;
      this.vendorTableForm.controls[controlName].setValue(controlValue);
    });
    const vendorLocationDropdown1 = this.vendorTableForm.value.vendorLocationDropdown.map((item: any) => item.name);
    this.vendorTableForm.controls["vendorLocation"].setValue(vendorLocationDropdown1);

    const tdsSectionDropdown1 = this.vendorTableForm.value.tdsSectionDropdown.map((item: any) => item.name);
    this.vendorTableForm.controls["tdsSection"].setValue(tdsSectionDropdown1);

    this.vendorTableForm.controls["isActive"].setValue(this.vendorTableForm.value.isActive == true);
    Object.values(this.vendorTableForm.controls).forEach(control => control.setErrors(null));
    // Remove  field from the form controls
    this.vendorTableForm.removeControl("CompanyCode");
    this.vendorTableForm.removeControl("vendorLocationDropdown");
    this.vendorTableForm.removeControl("tdsSectionDropdown");
    this.vendorTableForm.removeControl("isUpdate");
    if (this.isUpdate) {
      let id = this.vendorTableForm.value.id;
      // Remove the "id" field from the form controls
      this.vendorTableForm.removeControl("id");
      let req = {
        companyCode: this.companyCode,
        type: "masters",
        collection: "vendor_detail",
        id: id,
        updates: this.vendorTableForm.value
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
      const nextVendorCode = this.generateNextVendorCode();
      this.vendorTableForm.controls["vendorCode"].setValue(nextVendorCode);
      this.vendorTableForm.controls["id"].setValue(nextVendorCode);
      let req = {
        companyCode: this.companyCode,
        type: "masters",
        collection: "vendor_detail",
        data: this.vendorTableForm.value
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
  cancel() {
    window.history.back();
  }
}
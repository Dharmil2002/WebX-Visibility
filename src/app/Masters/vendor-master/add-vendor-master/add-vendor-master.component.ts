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
  countryCode: any;
  action: string;
  isUpdate = false;
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

        this.vLocationDetail = this.findDropdownItemByName(this.vLocationData, this.vendorTabledata.vendorLocation);
        this.vendorTableForm.controls.vendorLocation.setValue(this.vLocationDetail);

        this.tdsSectionDetail = this.findDropdownItemByName(this.tdsSectionData, this.vendorTabledata.tdsSection);
        this.vendorTableForm.controls.tdsSection.setValue(this.tdsSectionDetail);

        this.tdsTypeDetail = this.findDropdownItemByName(this.tdsTypeData, this.vendorTabledata.tdsType);
        this.vendorTableForm.controls.tdsType.setValue(this.tdsTypeDetail);

        this.lspNameDetail = this.findDropdownItemByName(this.lspNameData, this.vendorTabledata.lspName);
        this.vendorTableForm.controls.lspName.setValue(this.lspNameDetail);
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
  save() {
    const formValue = this.vendorTableForm.value;
    const controlNames = [
      "vendorType",
      "vendorCity",
      "vendorLocation",
      "tdsSection",
      "tdsType",
      "lspName",
    ];
    controlNames.forEach(controlName => {
      const controlValue = formValue[controlName]?.value;
      this.vendorTableForm.controls[controlName].setValue(controlValue);
    });
    this.vendorTableForm.controls.isActive.setValue(formValue.isActive ? "Y" : "N");
    this.route.navigateByUrl('/Masters/VendorMaster/VendorMasterList');
    this.service.exportData(formValue);
    if (this.action === 'edit') {
      Swal.fire({
        icon: "success",
        title: "Successful",
        text: `Data Updated successfully!!!`,
        showConfirmButton: true,
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Successful",
        text: `Data Downloaded successfully!!!`,
        showConfirmButton: true,
      });
    }
  }
  cancel() {
    window.history.back();
  }
}
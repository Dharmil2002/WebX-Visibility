import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { utilityService } from "src/app/Utility/utility.service";
import { SnackBarUtilityService } from "src/app/Utility/SnackBarUtility.service";
import { VehicleControls } from "src/assets/FormControls/vehicle-control";
import { vehicleModel } from "src/app/core/models/Masters/vehicle-master";
import { MasterService } from "src/app/core/service/Masters/master.service";
import Swal from "sweetalert2";
import { getShortName } from "src/app/Utility/commonFunction/random/generateRandomNumber";

@Component({
  selector: 'app-add-vehicle-master',
  templateUrl: './add-vehicle-master.component.html',
})
export class AddVehicleMasterComponent implements OnInit {
  breadScrums: { title: string; items: string[]; active: string; }[];
  action: string;
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  isUpdate = false;
  vehicleTabledata: vehicleModel;
  vehicleTableForm: UntypedFormGroup;
  jsonControlVehicleArray: any;
  jsonControlRegistrationArray: any;
  jsonControlOthersArray: any;
  jsonControlInnerDimensionArray: any;
  jsonControlOuterDimensionnArray: any;
  vehicleControl: VehicleControls;
  jsonControlCapacityInfoArray: any;
  accordionData: any;
  data: any;
  vType: any;
  vTypeStatus: any;
  cBranch: any;
  cBranchStatus: any;
  assetName: any;
  assetNameStatus: any;
  vendorType: any;
  vendorTypeStatus: any;
  vendorName: any;
  vendorNameStatus: any;
  gpsProvider: any;
  gpsProviderStatus: any;
  ftlTypeDesc: any;
  ftlTypeStatus: any;
  vehicleTypeData: any;
  controllBranchData: any;
  assetNameData: any;
  vendorTypeData: any;
  vendorNameData: any;
  gpsProviderData: any;
  ftlTypeData: any;
  vehicleTypeDetail: any;
  controllBranchDetail: any;
  assetNameDetail: any;
  vendorTypDetail: any;
  vendorNameDetail: any;
  gpsProviderDetail: any;
  ftlTypeDetail: any;
  permitState: any;
  permitStateStatus: any;
  permitStateData: any;
  permitStateDetail: any;
  routeLoc: any;
  routeStatus: any;
  routeLocData: any;
  lastUsedVehicleCode = 0;
  ngOnInit(): void {
    this.bindDropdown();
    this.getDropDownData();
  }
  functionCallHandler($event) {
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
  constructor(private service: utilityService, private masterService: MasterService,
    public objSnackBarUtility: SnackBarUtilityService,
    private route: Router, private fb: UntypedFormBuilder, private filter: FilterUtils) {
    if (this.route.getCurrentNavigation()?.extras?.state != null) {
      this.data = route.getCurrentNavigation().extras.state.data;
      this.action = 'edit'
      this.isUpdate = true;
    } else {
      this.action = "Add";
    }
    if (this.action === 'edit') {
      this.isUpdate = true;
      this.vehicleTabledata = this.data;
      this.breadScrums = [
        {
          title: "Vehicle Details",
          items: ["Home"],
          active: "Edit Vehicle",
        },
      ];
    } else {
      this.breadScrums = [
        {
          title: "Add Vehicle Master",
          items: ["Home"],
          active: "Vehicle Details",
        },
      ];
      this.vehicleTabledata = new vehicleModel({});
    }
    this.initializeFormControl()
  }
  initializeFormControl() {
    // Create vehicleFormControls instance to get form controls for different sections
    const vehicleFormControls = new VehicleControls(this.vehicleTabledata, this.isUpdate);
    this.jsonControlVehicleArray = vehicleFormControls.getFormControlsD();
    this.jsonControlRegistrationArray = vehicleFormControls.getFormControlsL();
    this.jsonControlOthersArray = vehicleFormControls.getFormControlsP();
    this.jsonControlInnerDimensionArray = vehicleFormControls.getInnerDimensionControl();
    this.jsonControlOuterDimensionnArray = vehicleFormControls.getOuterDimensionControl();
    this.jsonControlVehicleArray.forEach(data => {
    });
    this.accordionData = {
      "Vehicle Details": this.jsonControlVehicleArray,
      "Registration Details": this.jsonControlRegistrationArray,
      "Inner Dimension in ft": this.jsonControlInnerDimensionArray,
      "Outer Dimension in ft": this.jsonControlOuterDimensionnArray,
      "Payload Capacity as Per RC in Ton": this.jsonControlOthersArray
    };
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.vehicleTableForm = formGroupBuilder(this.fb, Object.values(this.accordionData));
  }
  bindDropdown() {
    this.jsonControlVehicleArray.forEach(data => {
      if (data.name === 'vehicleType') {
        // Set location-related variables
        this.vType = data.name;
        this.vTypeStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'controllBranch') {
        // Set category-related variables
        this.cBranch = data.name;
        this.cBranchStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'assetName') {
        // Set category-related variables
        this.assetName = data.name;
        this.assetNameStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'vendorType') {
        // Set category-related variables
        this.vendorType = data.name;
        this.vendorTypeStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'vendorName') {
        // Set category-related variables
        this.vendorName = data.name;
        this.vendorNameStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'gpsProvider') {
        // Set category-related variables
        this.gpsProvider = data.name;
        this.gpsProviderStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'ftlTypeDesc') {
        // Set category-related variables
        this.ftlTypeDesc = data.name;
        this.ftlTypeStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'permitState') {
        // Set category-related variables
        this.permitState = data.name;
        this.permitStateStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'route') {
        // Set category-related variables
        this.routeLoc = data.name;
        this.routeStatus = data.additionalData.showNameAndValue;
      }
    });
  }
  getDropDownData() {
    this.masterService.getJsonFileDetails('dropDownUrl').subscribe(res => {
      const {
        vehicleTypeDropdown,
        controllBranchDropdown,
        assetNameDropdown,
        vendorTypeDropdown,
        vendorNameDropdown,
        gpsProviderDropdown,
        ftlTypeDropdown,
        permitStateDropdown,
        routeLocationDropdown
      } = res;

      this.vehicleTypeData = vehicleTypeDropdown;
      this.controllBranchData = controllBranchDropdown;
      this.assetNameData = assetNameDropdown;
      this.vendorTypeData = vendorTypeDropdown;
      this.vendorNameData = vendorNameDropdown;
      this.gpsProviderData = gpsProviderDropdown;
      this.ftlTypeData = ftlTypeDropdown;
      this.permitStateData = permitStateDropdown;
      this.routeLocData = routeLocationDropdown;

      if (this.isUpdate) {
        this.vehicleTypeDetail = this.findDropdownItemByName(this.vehicleTypeData, this.vehicleTabledata.vehicleType);
        this.vehicleTableForm.controls.vehicleType.setValue(this.vehicleTypeDetail);

        this.controllBranchDetail = this.findDropdownItemByName(this.controllBranchData, this.vehicleTabledata.controllBranch);
        this.vehicleTableForm.controls.controllBranch.setValue(this.controllBranchDetail);

        this.assetNameDetail = this.findDropdownItemByName(this.assetNameData, this.vehicleTabledata.assetName);
        this.vehicleTableForm.controls.assetName.setValue(this.assetNameDetail);

        this.vendorTypDetail = this.findDropdownItemByName(this.vendorTypeData, this.vehicleTabledata.vendorType);
        this.vehicleTableForm.controls.vendorType.setValue(this.vendorTypDetail);

        this.vendorNameDetail = this.findDropdownItemByName(this.vendorNameData, this.vehicleTabledata.vendorName);
        this.vehicleTableForm.controls.vendorName.setValue(this.vendorNameDetail);

        this.gpsProviderDetail = this.findDropdownItemByName(this.gpsProviderData, this.vehicleTabledata.gpsProvider);
        this.vehicleTableForm.controls.gpsProvider.setValue(this.gpsProviderDetail);

        this.ftlTypeDetail = this.findDropdownItemByName(this.ftlTypeData, this.vehicleTabledata.ftlTypeDesc);
        this.vehicleTableForm.controls.ftlTypeDesc.setValue(this.ftlTypeDetail);

        this.vehicleTableForm.controls["permitStateDropdown"].patchValue(this.permitStateData.filter((element) =>
          this.vehicleTabledata.permitState.includes(element.name)))

        this.vehicleTableForm.controls["routeLocation"].patchValue(this.routeLocData.filter((element) =>
          this.vehicleTabledata.route.includes(element.name)));
      }

      const filterParams = [
        [this.jsonControlVehicleArray, this.vehicleTypeData, this.vType, this.vTypeStatus],
        [this.jsonControlVehicleArray, this.controllBranchData, this.cBranch, this.cBranchStatus],
        [this.jsonControlVehicleArray, this.assetNameData, this.assetName, this.assetNameStatus],
        [this.jsonControlVehicleArray, this.vendorTypeData, this.vendorType, this.vendorTypeStatus],
        [this.jsonControlVehicleArray, this.vendorNameData, this.vendorName, this.vendorNameStatus],
        [this.jsonControlVehicleArray, this.gpsProviderData, this.gpsProvider, this.gpsProviderStatus],
        [this.jsonControlVehicleArray, this.ftlTypeData, this.ftlTypeDesc, this.ftlTypeStatus],
        [this.jsonControlVehicleArray, this.permitStateData, this.permitState, this.permitStateStatus],
        [this.jsonControlVehicleArray, this.routeLocData, this.routeLoc, this.routeStatus]
      ];

      filterParams.forEach(([jsonControlArray, dropdownData, formControl, statusControl]) => {
        this.filter.Filter(jsonControlArray, this.vehicleTableForm, dropdownData, formControl, statusControl);
      });
    });
  }
  findDropdownItemByName(dropdownData, name) {
    return dropdownData.find(item => item.name === name);
  }

  //#region to calculate capacity based on Gross Vehicle Weight and unload weight and send validation msg if condition not matched
  calCapacity() {
    if (
      parseFloat(this.vehicleTableForm.value.GrossVehicleWeight) <
      parseFloat(this.vehicleTableForm.value.UnladenWeight)
    ) {
      this.objSnackBarUtility.showNotification(
        "snackbar-danger",
        "Gross Vehicle Weight must be greater than Unladen Weight !",
        "bottom",
        "center"
      );
      this.vehicleTableForm.get("capacity").setValue(0);
    } else {
      this.vehicleTableForm.get("capacity").setValue(
        parseFloat(this.vehicleTableForm.value.gvw) -
        parseFloat(this.vehicleTableForm.value.unldWt)
      );
    }
  }
  //#endregion
  getData(): void {
    var innerDCal =
      parseFloat(this.vehicleTableForm.value.innerLength) *
      parseFloat(this.vehicleTableForm.value.innerHeight) *
      parseFloat(this.vehicleTableForm.value.innerWidth);
    this.vehicleTableForm.controls["cft"].setValue(innerDCal.toFixed(2));
    var outerDCal =
      parseFloat(this.vehicleTableForm.value.outerLength) *
      parseFloat(this.vehicleTableForm.value.outerHeigth) *
      parseFloat(this.vehicleTableForm.value.outerWidth);
    this.vehicleTableForm.controls["outerCft"].setValue(outerDCal.toFixed(2));
  }
  cancel() {
    window.history.back();
  }
  generateNextVehicleCode(): string {
    // Get the last used vehicle code from localStorage
    const lastVehicleCode = parseInt(localStorage.getItem('lastVehicleCode') || '0', 10);

    // Increment the last vehicle code by 1 to generate the next one
    const nextVendorCode = lastVehicleCode + 1;

    // Convert the number to a 4-digit string, padded with leading zeros
    const paddedNumber = nextVendorCode.toString().padStart(4, '0');

    // Combine the prefix "VH" with the padded number to form the complete vehicle code
    const vehicleCode = `VH${paddedNumber}`;

    // Update the last used vehicle code in localStorage
    localStorage.setItem('lastVehicleCode', nextVendorCode.toString());

    return vehicleCode;
  }
  save() {
    const formValue = this.vehicleTableForm.value;
    const controlNames = [
      "vehicleType",
      "controllBranch",
      "assetName",
      "vendorType",
      "vendorName",
      "gpsProvider",
      "ftlTypeDesc",
    ];
    controlNames.forEach(controlName => {
      const controlValue = formValue[controlName]?.name;
      this.vehicleTableForm.controls[controlName].setValue(controlValue);
    });
    const permitStateDropdown = this.vehicleTableForm.value.permitStateDropdown.map((item: any) => item.name);
    this.vehicleTableForm.controls["permitState"].setValue(permitStateDropdown);

    const routeLocation = this.vehicleTableForm.value.routeLocation.map((item: any) => item.name);
    this.vehicleTableForm.controls["route"].setValue(routeLocation);

    this.vehicleTableForm.controls["isActive"].setValue(this.vehicleTableForm.value.isActive == true);
    Object.values(this.vehicleTableForm.controls).forEach(control => control.setErrors(null));
    // Remove field from the form controls
    this.vehicleTableForm.removeControl("CompanyCode");
    this.vehicleTableForm.removeControl("permitStateDropdown");
    this.vehicleTableForm.removeControl("routeLocation");
    this.vehicleTableForm.removeControl("isUpdate");

    if (this.isUpdate) {
      let id = this.vehicleTableForm.value.id;
      // Remove the "id" field from the form controls
      this.vehicleTableForm.removeControl("id");
      let req = {
        companyCode: this.companyCode,
        type: "masters",
        collection: "vehicle_detail",
        id: id,
        updates: this.vehicleTableForm.value
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
            this.route.navigateByUrl('/Masters/VehicleMaster/VehicleMasterList');
          }
        }
      });
    }
    else {
      const nextVehicleCode = this.generateNextVehicleCode();
      this.vehicleTableForm.controls["id"].setValue(nextVehicleCode);
      let req = {
        companyCode: this.companyCode,
        type: "masters",
        collection: "vehicle_detail",
        data: this.vehicleTableForm.value
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
            this.route.navigateByUrl('/Masters/VehicleMaster/VehicleMasterList');
          }
        }
      });
    }
  }
}


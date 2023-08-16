import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { SnackBarUtilityService } from "src/app/Utility/SnackBarUtility.service";
import { VehicleControls } from "src/assets/FormControls/vehicle-control";
import { vehicleModel } from "src/app/core/models/Masters/vehicle-master";
import { MasterService } from "src/app/core/service/Masters/master.service";
import Swal from "sweetalert2";
import { convertNumericalStringsToInteger } from "src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction";

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
  jsonControlDimensionArray: any;
  accordionData: any;
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
  assetNameData: any;
  vendorTypeData: any;
  gpsProviderData: any;
  assetNameDetail: any;
  vendorTypDetail: any;
  gpsProviderDetail: any;
  permitState: any;
  permitStateStatus: any;
  permitStateDetail: any;
  routeLoc: any;
  routeStatus: any;

  ngOnInit(): void {
    this.bindDropdown();
    this.getDropDownData();
    this.getDataAndPopulateForm();
    this.getAllMastersData();
  }
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
  constructor(private masterService: MasterService,
    public objSnackBarUtility: SnackBarUtilityService,
    private route: Router, private fb: UntypedFormBuilder, private filter: FilterUtils) {
    if (this.route.getCurrentNavigation()?.extras?.state != null) {
      this.vehicleTabledata = route.getCurrentNavigation().extras.state.data;
      this.action = 'edit'
      this.isUpdate = true;
    } else {
      this.action = "Add";
    }
    if (this.action === 'edit') {
      this.isUpdate = true;
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
    this.jsonControlDimensionArray = vehicleFormControls.getDimensionControl();
    this.accordionData = {
      "Vehicle Details": this.jsonControlVehicleArray,
      "Registration Details": this.jsonControlRegistrationArray,
      "Dimension in ft": this.jsonControlDimensionArray,
    };
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.vehicleTableForm = formGroupBuilder(this.fb, Object.values(this.accordionData));
  }
  setData(data, propertyName, statusPropertyName) {
    this[propertyName] = data.name;
    this[statusPropertyName] = data.additionalData.showNameAndValue;
  }
  bindDropdown() {
    this.jsonControlVehicleArray.forEach(data => {
      switch (data.name) {
        case 'vehicleType':
          this.setData.call(this, data, 'vType', 'vTypeStatus');
          break;
        case 'controllBranch':
          this.setData.call(this, data, 'cBranch', 'cBranchStatus');
          break;
        case 'assetName':
          this.setData.call(this, data, 'assetName', 'assetNameStatus');
          break;
        case 'vendorType':
          this.setData.call(this, data, 'vendorType', 'vendorTypeStatus');
          break;
        case 'vendorName':
          this.setData.call(this, data, 'vendorName', 'vendorNameStatus');
          break;
        case 'gpsProvider':
          this.setData.call(this, data, 'gpsProvider', 'gpsProviderStatus');
          break;
        case 'ftlTypeDesc':
          this.setData.call(this, data, 'ftlTypeDesc', 'ftlTypeStatus');
          break;
        case 'permitState':
          this.setData.call(this, data, 'permitState', 'permitStateStatus');
          break;
        case 'route':
          this.setData.call(this, data, 'routeLoc', 'routeStatus');
          break;
        default:
          // Handle the case where data.name doesn't match any of the cases
          break;
      }
    });
  }
  getDropDownData() {
    this.masterService.getJsonFileDetails('dropDownUrl').subscribe(res => {
      const {
        assetNameDropdown,
        vendorTypeDropdown,
        gpsProviderDropdown,
      } = res;

      this.assetNameData = assetNameDropdown;
      this.vendorTypeData = vendorTypeDropdown;
      this.gpsProviderData = gpsProviderDropdown;

      if (this.isUpdate) {
        this.assetNameDetail = this.findDropdownItemByName(this.assetNameData, this.vehicleTabledata.assetName);
        this.vehicleTableForm.controls.assetName.setValue(this.assetNameDetail);

        this.vendorTypDetail = this.findDropdownItemByName(this.vendorTypeData, this.vehicleTabledata.vendorType);
        this.vehicleTableForm.controls.vendorType.setValue(this.vendorTypDetail);

        this.gpsProviderDetail = this.findDropdownItemByName(this.gpsProviderData, this.vehicleTabledata.gpsProvider);
        this.vehicleTableForm.controls.gpsProvider.setValue(this.gpsProviderDetail);
      }

      const filterParams = [
        [this.jsonControlVehicleArray, this.assetNameData, this.assetName, this.assetNameStatus],
        [this.jsonControlVehicleArray, this.vendorTypeData, this.vendorType, this.vendorTypeStatus],
        [this.jsonControlVehicleArray, this.gpsProviderData, this.gpsProvider, this.gpsProviderStatus],
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
      parseFloat(this.vehicleTableForm.value.gvw) <
      parseFloat(this.vehicleTableForm.value.unldWt)
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
  /*get all Master Details*/
  async getAllMastersData() {
    try {
      const stateReqBody = {
        "companyCode": this.companyCode,
        "type": "masters",
        "collection": "state_detail"
      }
      const reqBody = {
        "companyCode": this.companyCode,
        "type": "masters",
        "collection": "routeMasterLocWise"
      }
      const generalReqBody = {
        "companyCode": this.companyCode,
        "type": "masters",
        "collection": "General_master"
      }
      const stateResponse = await this.masterService.masterPost('common/getall', stateReqBody).toPromise();
      const routeResponse = await this.masterService.masterPost('common/getall', reqBody).toPromise();
      const ftlTypeResponse = await this.masterService.masterPost('common/getall', generalReqBody).toPromise();
      const ftlTypeList = ftlTypeResponse.data.filter(item => item.codeType === "FTLTYP").
        map((x) => {
          { return { name: x.codeDesc, value: x.codeId } }
        });
      const routeList = routeResponse.data.map(element => ({
        name: element.loccd.join('-'),
        value: element.routeId,
      }));
      const stateList = stateResponse.data.map((x) => { { return { name: x.stateName, value: x.stateCode } } })
      // Handle the response from the server
      if (this.isUpdate) {
        this.vehicleTableForm.controls["permitStateDropdown"].patchValue(stateList.filter((element) =>
          this.vehicleTabledata.permitState.includes(element.name)
        ));
        this.vehicleTableForm.controls["routeLocation"].patchValue(routeList.filter((element) =>
          this.vehicleTabledata.route.includes(element.name)
        ));
        const ftlType = ftlTypeList.find((x) => x.name === this.vehicleTabledata.ftlTypeDesc);
        this.vehicleTableForm.controls['ftlTypeDesc'].setValue(ftlType);
      }
      this.filter.Filter(this.jsonControlVehicleArray, this.vehicleTableForm, stateList, this.permitState, this.permitStateStatus);
      this.filter.Filter(this.jsonControlVehicleArray, this.vehicleTableForm, routeList, this.routeLoc, this.routeStatus);
      this.filter.Filter(this.jsonControlVehicleArray, this.vehicleTableForm, ftlTypeList, this.ftlTypeDesc, this.ftlTypeStatus);
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error('Error:', error);
    }
  }
  async fetchDataAndPopulateForm(companyCode, collection, formControl, dataProperty, nameProperty, showNameAndValue) {
    try {
      const reqBody = {
        "companyCode": companyCode,
        "type": "masters",
        "collection": collection
      };

      const response = await this.masterService.masterPost('common/getall', reqBody).toPromise();
      const dataList = response.data.map(x => ({
        name: x[nameProperty],
        value: x[dataProperty]
      }));

      if (this.isUpdate) {
        const selectedData = dataList.find(x => x.name === this.vehicleTabledata[formControl]);
        this.vehicleTableForm.controls[formControl].setValue(selectedData);
      }

      // Call the Filter function with the appropriate arguments
      this.filter.Filter(this.jsonControlVehicleArray, this.vehicleTableForm, dataList, formControl, showNameAndValue);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  // Call the function for each data type with the appropriate showNameAndValue parameter
  async getDataAndPopulateForm() {
    await this.fetchDataAndPopulateForm(this.companyCode, "vehicleType_detail", "vehicleType", "vehicleTypeCode", "vehicleTypeName", true);
    await this.fetchDataAndPopulateForm(this.companyCode, "vendor_detail", "vendorName", "vendorCode", "vendorName", true);
    await this.fetchDataAndPopulateForm(this.companyCode, "location_detail", "controllBranch", "locCode", "locName", true);
  }
  checkVehicleNumberExist() {
    let req = {
      companyCode: this.companyCode,
      type: "masters",
      collection: "vehicle_detail"
    };
    this.masterService.masterPost('common/getall', req).subscribe({
      next: (res: any) => {
        const vehicleNoExists = res.data.some((res) => res.id === this.vehicleTableForm.value.id
          || res.vehicleNo === this.vehicleTableForm.value.vehicleNo);
        if (vehicleNoExists) {
          // Show the popup indicating that the state already exists
          Swal.fire({
            title: 'Vehicle Number already exists! Please try with another',
            toast: true,
            icon: "error",
            showCloseButton: false,
            showCancelButton: false,
            showConfirmButton: true,
            confirmButtonText: "OK"
          });
          this.vehicleTableForm.controls["vehicleNo"].reset();
        }
      },
      error: (err: any) => {
        // Handle error if required
        console.error(err);
      }
    });
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
    const permitStateDetail = this.vehicleTableForm.value.permitStateDropdown.map((item: any) => item.name);
    this.vehicleTableForm.controls["permitState"].setValue(permitStateDetail);

    const routeLocation = this.vehicleTableForm.value.routeLocation.map((item: any) => item.name);
    this.vehicleTableForm.controls["route"].setValue(routeLocation);

    Object.values(this.vehicleTableForm.controls).forEach(control => control.setErrors(null));
    // Remove field from the form controls
    this.vehicleTableForm.removeControl("CompanyCode");
    this.vehicleTableForm.removeControl("permitStateDropdown");
    this.vehicleTableForm.removeControl("routeLocation");
    this.vehicleTableForm.removeControl("isUpdate");
    this.vehicleTableForm.removeControl("");
    this.vehicleTableForm.controls["id"].setValue(this.vehicleTableForm.value.vehicleNo);
    let data = convertNumericalStringsToInteger(this.vehicleTableForm.value)

    if (this.isUpdate) {
      let id = this.vehicleTableForm.value.id;
      // Remove the "id" field from the form controls
      this.vehicleTableForm.removeControl("id");
      let req = {
        companyCode: this.companyCode,
        type: "masters",
        collection: "vehicle_detail",
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
            this.route.navigateByUrl('/Masters/VehicleMaster/VehicleMasterList');
          }
        }
      });
    }
    else {
      let req = {
        companyCode: this.companyCode,
        type: "masters",
        collection: "vehicle_detail",
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
            this.route.navigateByUrl('/Masters/VehicleMaster/VehicleMasterList');
          }
        }
      });
    }
  }
  enableGpsProvider($event) {
    this.jsonControlVehicleArray.forEach(data => {
      if (data.name === 'gpsProvider') {
        data.disable = !$event.eventArgs.checked; // Toggle the disable property based on checked value
        // Update the form control's validation status
        this.vehicleTableForm.controls.gpsProvider.updateValueAndValidity();
      }
    });
  }

}


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
import { calculateVolume } from "../vehicle-utility";
import { Subject, take, takeUntil } from "rxjs";
import { clearValidatorsAndValidate } from "src/app/Utility/Form Utilities/remove-validation";
@Component({
  selector: 'app-add-vehicle-master',
  templateUrl: './add-vehicle-master.component.html',
})
export class AddVehicleMasterComponent implements OnInit {
  breadScrums: { title: string; items: string[]; active: string; }[];
  action: string;
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  isUpdate = false;
  vehicleTable: vehicleModel;
  vehicleTableForm: UntypedFormGroup;
  jsonControlVehicleArray: any;
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
  protected _onDestroy = new Subject<void>();
  vehicleFormControls: VehicleControls
  vehicleType: any;
  vehicleTypeStatus: any;
  allData: {
    // vehicleData: vehicleRes?.data,
    vehTypeData: any;
    // venTypeData: any;
    routeData: any;
    venNameData: any;
  };
  vehTypeDet: any;
  vehTypeData: any;
  divisionList: any;
  division: any;
  divisionStatus: any;
  venTypeDet: any;
  venTypeData: any;
  venNameDet: any;
  routeDet: any;
  routeName: any;
  ftlTypeDescStatus: any;
  ftlTypeDescName: any;
  ftlTypeDet: any;
  updateCountry: any;
  divisionAccess: any;
  vendorData: any;
  RouteData: any;
  controllBranch: any;
  location: any;
  locationStatus: any;
  backPath: string;
  vendorDetail: any;
  vendorDetailList: any;

  constructor(
    private masterService: MasterService,
    public objSnackBarUtility: SnackBarUtilityService,
    private route: Router,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
  ) {
    if (this.route.getCurrentNavigation()?.extras?.state != null) {
      this.vehicleTable = route.getCurrentNavigation().extras.state.data;

      this.isUpdate = true;
      this.action = 'edit'

    } else {
      this.action = 'Add'
    }
    if (this.action === 'edit') {
      this.isUpdate = true;
      this.breadScrums = [
        {
          title: "Vehicle Master",
          items: ["Masters"],
          active: "Edit Vehicle",
        },
      ];

    } else {
      this.breadScrums = [
        {
          title: "Vehicle Master",
          items: ["Masters"],
          active: "Add Vehicle",
        },
      ];
      this.vehicleTable = new vehicleModel({})
    }
    this.initializeFormControl()
  }


  ngOnInit(): void {
    this.getDropDownDataVendor();
    this.getDropDownData();
    this.getDataAndPopulateForm();
    this.getAllMastersData();
    this.backPath = "/Masters/VehicleMaster/VehicleMasterList";
  }

  initializeFormControl() {

    this.vehicleFormControls = new VehicleControls(this.vehicleTable, this.isUpdate);
    // Get form controls for Driver Details section
    this.jsonControlVehicleArray = this.vehicleFormControls.getFormControlsD();
    this.jsonControlVehicleArray.forEach(data => {
      if (data.name === 'vehicleType') {
        // Set category-related variables
        this.vehicleType = data.name;
        this.vehicleTypeStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'vendorName') {
        // Set category-related variables
        this.vendorName = data.name;
        this.vendorNameStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'route') {
        // Set category-related variables
        this.routeName = data.name;
        this.routeStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'ftlTypeDesc') {
        // Set category-related variables
        this.ftlTypeDescName = data.name;
        this.ftlTypeDescStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'division') {
        // Set category-related variables
        this.division = data.name;
        this.divisionStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === "controllBranch") {
        // Set category-related variables
        this.location = data.name;
        this.locationStatus = data.additionalData.showNameAndValue;
      }
    });
    // Build the form group using formGroupBuilder function
    this.vehicleTableForm = formGroupBuilder(this.fb, [this.jsonControlVehicleArray]);
  }

  getDropDownDataVendor() {
    this.masterService.getJsonFileDetails('dropDownUrl').subscribe(res => {
      const {
        vendorTypeDropdown,
      } = res;
      this.vendorTypeData = vendorTypeDropdown;
      if (this.isUpdate) {
        this.vendorTypDetail = this.findDropdownItemByName(this.vendorTypeData, this.vehicleTable.vendorType);
        this.vehicleTableForm.controls.vendorType.setValue(this.vendorTypDetail);
      }
      const filterParams = [
        [this.jsonControlVehicleArray, this.vendorTypeData, this.vendorType, this.vendorTypeStatus],
      ];

      filterParams.forEach(([jsonControlArray, dropdownData, formControl, statusControl]) => {
        this.filter.Filter(jsonControlArray, this.vehicleTableForm, dropdownData, formControl, statusControl);
      });
    });
  }

  //#region
  getDropDownData() {
    this.masterService.getJsonFileDetails('dropDownUrl').subscribe(response => {
      this.divisionList = response.divisionAccess;

      this.vehicleTableForm.controls["DivisionDrop"].patchValue(
        this.divisionList.filter(element =>
          this.vehicleTable.division.includes(element.name)
        )
      );
      //}
      this.filter.Filter(
        this.jsonControlVehicleArray,
        this.vehicleTableForm,
        this.divisionList,
        this.division,
        this.divisionStatus
      );
    });
  }
  //#endregion

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

  //#region
  getDataForInnerOuter(): void {
    var innerDCal = calculateVolume(
      this.vehicleTableForm.value.lengthinFeet,
      this.vehicleTableForm.value.heightinFeet,
      this.vehicleTableForm.value.widthinFeet
    );
    this.vehicleTableForm.controls["cft"].setValue(innerDCal.toFixed(2));
  }
  //#endregion

  //#region  get all Master Details
  async getAllMastersData() {
    try {
      const generalReqBody = {
        "companyCode": this.companyCode,
        "collectionName": "General_master",
        "filter": {}
      }
      let vehTypeReq = {
        "companyCode": this.companyCode,
        "filter": {},
        "collectionName": "vehicleType_detail"
      };
      // let venTypeReq = {
      //   "companyCode": this.companyCode,
      //   "filter": {},
      //   "collectionName": "vendor_detail"
      // };
      let venNameReq = {
        "companyCode": this.companyCode,
        "filter": {},
        "collectionName": "vendor_detail"
      };
      let routeReq = {
        "companyCode": this.companyCode,
        "filter": {},
        "collectionName": "routeMasterLocWise"
      };
      const routeRes = await this.masterService.masterPost('generic/get', routeReq).toPromise();
      const venNameRes = await this.masterService.masterPost('generic/get', venNameReq).toPromise();
      // const venTypeRes = await this.masterService.masterPost('generic/get', venTypeReq).toPromise();
      const vehTypeRes = await this.masterService.masterPost('generic/get', vehTypeReq).toPromise();
      const generalMasterResponse = await this.masterService.masterPost("generic/get", generalReqBody).toPromise();
      const mergedData = {
        // vehicleData: vehicleRes?.data,
        vehTypeData: vehTypeRes?.data,
        // venTypeData: venTypeRes?.data,
        venNameData: venNameRes?.data,
        routeData: routeRes?.data,
        fltType: generalMasterResponse.data
      };

      this.allData = mergedData;

      const vehTypeDet = mergedData.vehTypeData.map(element => ({
        name: element.vehicleTypeName.toString(),
        value: element.vehicleTypeCode.toString(),
      }));

      const venNameDet = mergedData.venNameData
        .map(element => ({
          name: element.vendorName.toString(),
          value: element.vendorCode.toString(),
          type: element.vendorType.toString(),
        }));
      this.vendorDetailList = venNameDet;

      let routeDet = [];
      mergedData.routeData.forEach((item, index, array) => {
        if (index < array.length) {
          const currentLocation = item.GSTdetails[0].loccd;
          const nextLocation = array[index].GSTdetails[1].loccd;

          const name = `${currentLocation} - ${nextLocation}`;
          const value = name;

          routeDet.push({
            name,
            value
          });
        }
      });
    
      const FTLtype = mergedData.fltType.filter(item => item.codeType === "FTLTYP").
        map((x) => {
          { return { name: x.codeDesc, value: x.codeId } }
        });

      this.vehTypeDet = vehTypeDet;
      // this.venTypeDet = venTypeDet;
      this.venNameDet = venNameDet;
      this.routeDet = routeDet;
      // this.ftlTypeDet = ftlTypeDet;

      this.filter.Filter(
        this.jsonControlVehicleArray,
        this.vehicleTableForm,
        vehTypeDet,
        this.vehicleType,
        this.vehicleTypeStatus
      );

      // this.filter.Filter(
      //   this.jsonControlVehicleArray,
      //   this.vehicleTableForm,
      //   venTypeDet,
      //   this.vendorType,
      //   this.vendorTypeStatus
      // );

      this.filter.Filter(
        this.jsonControlVehicleArray,
        this.vehicleTableForm,
        venNameDet,
        this.vendorName,
        this.vendorNameStatus
      );

      this.filter.Filter(
        this.jsonControlVehicleArray,
        this.vehicleTableForm,
        routeDet,
        this.routeName,
        this.routeStatus
      );

      this.filter.Filter(
        this.jsonControlVehicleArray,
        this.vehicleTableForm,
        FTLtype,
        this.ftlTypeDescName,
        this.ftlTypeDescStatus
      );

      const ftlType = FTLtype.find((x) => x.name === this.vehicleTable.ftlTypeDesc);
      this.vehicleTableForm.controls['ftlTypeDesc'].setValue(ftlType);

      this.autofillDropdown();
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error('Error:', error);
    }
  }
  //#endregion

  vendorFieldChanged() {

    const vendorType = this.vehicleTableForm.value.vendorType;
    const vendorDetail = this.vendorDetailList.filter((x) => x.
      type.toLowerCase() == vendorType.toLowerCase());
    this.filter.Filter(
      this.jsonControlVehicleArray,
      this.vehicleTableForm,
      vendorDetail,
      this.vendorName,
      this.vendorNameStatus
    );
  }

  //#region
  autofillDropdown() {
    if (this.isUpdate) {

      this.vehTypeData = this.vehTypeDet.find((x) => x.name == this.vehicleTable.vehicleType);
      this.vehicleTableForm.controls.vehicleType.setValue(this.vehTypeData);

      this.vendorData = this.venNameDet.find((x) => x.name == this.vehicleTable.vendorName);
      this.vehicleTableForm.controls.vendorName.setValue(this.vendorData);

      this.venTypeData = this.venTypeDet.find((x) => x.name == this.vehicleTable.vendorType);
      this.vehicleTableForm.controls.vendorType.setValue(this.venTypeData);

      this.RouteData = this.routeDet.find((x) => x.name == this.vehicleTable.route);
      this.vehicleTableForm.controls.route.setValue(this.RouteData);

    }
  }
  //#endregion

  //#region mutliselection dropdown
  async fetchDataAndPopulateForm(collectionName, formControl, dataProperty, nameProperty, showNameAndValue) {
    try {
      const reqBody = {
        "companyCode": this.companyCode,
        "collectionName": collectionName,
        "filter": {}
      };
      const response = await this.masterService.masterPost("generic/get", reqBody).toPromise()
      const dataList = response.data.map(x => ({
        name: x[nameProperty],
        value: x[dataProperty]
      }));

      if (this.isUpdate) {
        const selectedData = dataList.find(x => x.name === this.vehicleTable[formControl]);
        this.vehicleTableForm.controls[formControl].setValue(selectedData);
        if (formControl == 'controllBranch') {
          const selectedData = dataList.filter(x => this.vehicleTable[formControl].includes(x.name));
          this.vehicleTableForm.controls['controllBranchDrop'].setValue(selectedData);
        }
      }
      // Call the Filter function with the appropriate arguments
      this.filter.Filter(this.jsonControlVehicleArray, this.vehicleTableForm, dataList, formControl, showNameAndValue);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  //#endregion

  //#region Call the function for each data type with the appropriate showNameAndValue parameter
  async getDataAndPopulateForm() {
    await this.fetchDataAndPopulateForm("location_detail", "controllBranch", "locCode", "locName", true);
  }
  //#endregion

  //#region
  async checkVehicleNumberExist() {
    let req = {
      "companyCode": this.companyCode,
      "collectionName": "vehicle_detail",
      "filter": {}
    };
    const res = await this.masterService.masterPost("generic/get", req).toPromise()
    const vehicleNoExists = res.data.some((res) => res._id === this.vehicleTableForm.value._id
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
    error: (err: any) => {
      // Handle error if required
      console.error(err);
    }
  }
  //#endregion

  //#region
  async save() {

    const controls = this.vehicleTableForm;
    clearValidatorsAndValidate(controls);
    const formValue = this.vehicleTableForm.value;
    const controlNames = [
      "vehicleType",
      "vendorType",
      "vendorName",
      "route",
      "ftlTypeDesc"];
    controlNames.forEach((controlName) => {
      const controlValue = formValue[controlName]?.name;
      this.vehicleTableForm.controls[controlName].setValue(controlValue);
    });

    const controlDetail = this.vehicleTableForm.value.controllBranchDrop;
    const controllBranchDrop = controlDetail ? controlDetail.map((item: any) => item.name) : "";
    this.vehicleTableForm.controls["controllBranch"].setValue(controllBranchDrop);

    const divisionDetail = this.vehicleTableForm.value.DivisionDrop;
    const DivisionDrop = divisionDetail ? divisionDetail.map((item: any) => item.name) : "";
    this.vehicleTableForm.controls["division"].setValue(DivisionDrop);

    this.vehicleTableForm.controls["isActive"].setValue(this.vehicleTableForm.value.isActive === true ? true : false);
    this.vehicleTableForm.removeControl("DivisionDrop")
    this.vehicleTableForm.removeControl("controllBranchDrop")
    if (this.isUpdate) {
      let id = this.vehicleTableForm.value.vehicleNo;
      // Remove the "id" field from the form controls
      this.vehicleTableForm.removeControl("_id");
      let req = {
        companyCode: this.companyCode,
        collectionName: "vehicle_detail",
        filter: { vehicleNo: id },
        update: this.vehicleTableForm.value,
      };
      //API FOR UPDATE
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
        this.route.navigateByUrl("/Masters/VehicleMaster/VehicleMasterList");
      }
    } else {
      const randomNumber = (this.vehicleTableForm.value.vehicleNo);
      this.vehicleTableForm.controls["_id"].setValue(randomNumber);
      let req = {
        companyCode: this.companyCode,
        collectionName: "vehicle_detail",
        data: this.vehicleTableForm.value,
      };
      //API FOR ADD
      const res = await this.masterService
        .masterPost("generic/create", req)
        .toPromise();
      if (res) {
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: res.message,
          showConfirmButton: true,
        });
        this.route.navigateByUrl("/Masters/VehicleMaster/VehicleMasterList");
      }
    }
  }
  //#endregion

  //#region
  enableGpsProvider($event) {
    this.jsonControlVehicleArray.forEach(data => {
      if (data.name === 'gpsProvider') {
        data.disable = !$event.eventArgs.checked; // Toggle the disable property based on checked value
        // Update the form control's validation status
        this.vehicleTableForm.controls.gpsProvider.updateValueAndValidity();
      }
    });
  }
  //#endregion

  //#region
  SwalMessage(message) {
    Swal.fire({
      title: message,//'Incorrect API',
      toast: true,
      icon: "error",
      showCloseButton: true,
      showCancelButton: false,
      showConfirmButton: false,
      confirmButtonText: "Yes"
    });
  }
  //#region

  //#region
  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;

    const index = this.jsonControlVehicleArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonControlVehicleArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.vehicleTableForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }
  //#endregion

  cancel() {
    window.history.back();
  }

  //#region
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
  //#endregion

}

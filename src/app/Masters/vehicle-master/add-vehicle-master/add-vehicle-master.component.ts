import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { SnackBarUtilityService } from "src/app/Utility/SnackBarUtility.service";
import { VehicleControls } from "src/assets/FormControls/vehicle-control";
import { vehicleModel } from "src/app/core/models/Masters/vehicle-master";
import { MasterService } from "src/app/core/service/Masters/master.service";
import Swal from "sweetalert2";
import { calculateVolume } from "../vehicle-utility";
import { Subject, firstValueFrom, take, takeUntil } from "rxjs";
import { clearValidatorsAndValidate } from "src/app/Utility/Form Utilities/remove-validation";
import { RouteLocationService } from "src/app/Utility/module/masters/route-location/route-location.service";
@Component({
  selector: 'app-add-vehicle-master',
  templateUrl: './add-vehicle-master.component.html',
})
export class AddVehicleMasterComponent implements OnInit {
  breadScrums: { title: string; items: string[]; active: string; generatecontrol: true; toggle: boolean; }[];
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
  submit = 'Save';
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
    private objRouteLocationService: RouteLocationService
  ) {
    if (this.route.getCurrentNavigation()?.extras?.state != null) {
      this.vehicleTable = route.getCurrentNavigation().extras.state.data;

      this.isUpdate = true;
      this.submit = 'Modify';
      this.action = 'edit'

    } else {
      this.action = 'Add'
    }
    if (this.action === 'edit') {
      this.isUpdate = true;
      this.breadScrums = [
        {
          title: "Modify Vehicle",
          items: ["Masters"],
          active: "Modify Vehicle",
          generatecontrol: true,
          toggle: this.vehicleTable.isActive
        },
      ];

    } else {
      this.breadScrums = [
        {
          title: "Add Vehicle",
          items: ["Masters"],
          active: "Add Vehicle",
          generatecontrol: true,
          toggle: false
        },
      ];
      this.vehicleTable = new vehicleModel({})
    }
    this.initializeFormControl();
    //this.vehicleTableForm.controls["vendorType"].setValue(this.vehicleTable.vendorType);
  }


  ngOnInit(): void {
    // this.getDropDownDataVendor();
    this.getDropDownData();
    this.getDataAndPopulateForm();
    this.getAllMastersData();
    this.backPath = "/Masters/VehicleMaster/VehicleMasterList";
    this.vendorFieldChanged();

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
      if (data.name === "vendorType") {
        // Set category-related variables
        this.vendorType = data.name;
        this.vendorTypeStatus = data.additionalData.showNameAndValue;
      }
    });
    // Build the form group using formGroupBuilder function
    this.vehicleTableForm = formGroupBuilder(this.fb, [this.jsonControlVehicleArray]);
  }

  // getDropDownDataVendor() {
  //   this.masterService.getJsonFileDetails('dropDownUrl').subscribe(res => {
  //     const {
  //       vendorTypeDropdown,
  //     } = res;
  //     this.vendorTypeData = vendorTypeDropdown;
  //     if (this.isUpdate) {
  //       this.vendorTypDetail = this.findDropdownItemByName(this.vendorTypeData, this.vehicleTable.vendorType);
  //       this.vehicleTableForm.controls.vendorType.setValue(this.vendorTypDetail);
  //     }
  //     const filterParams = [
  //       [this.jsonControlVehicleArray, this.vendorTypeData, this.vendorType, this.vendorTypeStatus],
  //     ];

  //     filterParams.forEach(([jsonControlArray, dropdownData, formControl, statusControl]) => {
  //       this.filter.Filter(jsonControlArray, this.vehicleTableForm, dropdownData, formControl, statusControl);
  //     });
  //   });
  // }

  //#region
  async getDropDownData() {
    try {
      const res: any = await firstValueFrom(this.masterService.getJsonFileDetails("dropDownUrl"));
      const {
        vendorTypeDropdown,
        divisionAccess
      } = res;

      this.vendorTypeData = vendorTypeDropdown;
      this.divisionList = divisionAccess;

      this.vehicleTableForm.controls["DivisionDrop"].patchValue(
        this.divisionList.filter(element =>
          this.vehicleTable.division.includes(element.name)
        )
      );

      this.filter.Filter(
        this.jsonControlVehicleArray,
        this.vehicleTableForm,
        this.divisionList,
        this.division,
        this.divisionStatus
      );

      this.filter.Filter(
        this.jsonControlVehicleArray,
        this.vehicleTableForm,
        this.vendorTypeData,
        this.vendorType,
        this.vendorTypeStatus
      );
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
      // Handle error, show message, or log as needed
    }
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
      const routeRes = await firstValueFrom(this.masterService.masterPost("generic/get", routeReq));
      const venNameRes = await firstValueFrom(this.masterService.masterPost("generic/get", venNameReq));
      const vehTypeRes = await firstValueFrom(this.masterService.masterPost("generic/get", vehTypeReq));
      const generalMasterResponse = await firstValueFrom(this.masterService.masterPost("generic/get", generalReqBody));
      const mergedData = {
        vehTypeData: vehTypeRes?.data,
        venNameData: venNameRes?.data,
        routeData: routeRes?.data,
        fltType: generalMasterResponse.data
      };

      this.allData = mergedData;
      const vehTypeDet = mergedData.vehTypeData.map(element => ({
        name: element.vehicleTypeName.toString(),
        value: element.vehicleTypeCode.toString(),
      }));

      // Define the user's location (change this to the actual user's location)
      const userLocation = localStorage.Branch;

      // Filter the vendor names based on the user's location
      const venNameDet = mergedData.venNameData
        // .filter(element => element.isActive && element.vendorLocation.includes(userLocation))
        .filter(element => element.isActive)
        .map(element => ({
          name: element.vendorName.toString(),
          value: element.vendorCode.toString(),
          type: element.vendorType.toString(),
        }));

      // Assign the filtered vendor names to the vendorDetailList variable
      this.vendorDetailList = venNameDet;

      // let routeDet = [];
      const routeDet = await this.objRouteLocationService.getRouteLocationDetail()


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
    const vendorType = this.vehicleTable.vendorTypeCode ? this.vehicleTable.vendorTypeCode : this.vehicleTableForm.value.vendorType.value;
    const controls = this.jsonControlVehicleArray.find(x => x.name === 'vendorName');
    controls.generatecontrol = true;

    // Reset the vendorName value
    this.vehicleTableForm.controls.vendorName.setValue("");

    if (parseInt(vendorType) === 3) {
      controls.generatecontrol = false;
    } else {
      //control.setValidators([Validators.required]);
      // Enable control generation
      controls.generatecontrol = true;
      const vendorDetail = this.vendorDetailList.filter((x) =>
        parseInt(x.type) === parseInt(vendorType)
      );
      this.filter.Filter(
        this.jsonControlVehicleArray,
        this.vehicleTableForm,
        vendorDetail,
        this.vendorName,
        this.vendorNameStatus
      );
    }
  }
  //#region
  autofillDropdown() {
    if (this.isUpdate) {

      this.vehTypeData = this.vehTypeDet.find((x) => x.name == this.vehicleTable.vehicleType);
      this.vehicleTableForm.controls.vehicleType.setValue(this.vehTypeData);

      if (this.vehicleTable.vendorName) {
        this.vendorData = this.venNameDet.find((x) => x.name === this.vehicleTable.vendorName);
        this.vehicleTableForm.controls.vendorName.setValue(this.vendorData);
      }

      this.venTypeData = this.vendorTypeData.find((x) => x.name == this.vehicleTable.vendorType);
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
      const response = await firstValueFrom(this.masterService.masterPost("generic/get", reqBody));
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
    const res = await firstValueFrom(this.masterService.masterPost("generic/get", req));
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
    formValue.vendorName ? this.vehicleTableForm.controls['vendorCode'].setValue(formValue.vendorName.value) : '';
    this.vehicleTableForm.controls['vehicleTypeCode'].setValue(formValue.vehicleType.value);
    this.vehicleTableForm.controls['vendorTypeCode'].setValue(formValue.vendorType.value);
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

    this.vehicleTableForm.removeControl("DivisionDrop")
    this.vehicleTableForm.removeControl("controllBranchDrop")
    let data = this.vehicleTableForm.value;
    if (this.isUpdate) {
      let id = this.vehicleTableForm.value.vehicleNo;
      // Remove the "id" field from the form controls
      delete data._id;
      data['mODDT'] = new Date()
      data['mODBY'] = this.vehicleTableForm.value.eNTBY
      delete data.eNTBY;
      data['mODLOC'] = localStorage.getItem("Branch")
      let req = {
        companyCode: this.companyCode,
        collectionName: "vehicle_detail",
        filter: { vehicleNo: id },
        update: data,
      };
      //API FOR UPDATE
      const res = await firstValueFrom(this.masterService
        .masterPost("generic/update", req));
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
      // this.vehicleTableForm.controls["_id"].setValue(randomNumber);
      data._id = randomNumber;
      data['eNTDT'] = new Date()
      data['eNTLOC'] = localStorage.getItem("Branch")
      let req = {
        companyCode: this.companyCode,
        collectionName: "vehicle_detail",
        data: data,
      };
      //API FOR ADD
      const res = await firstValueFrom(this.masterService.masterPost("generic/create", req));
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

  onToggleChange(event: boolean) {
    // Handle the toggle change event in the parent component
    this.vehicleTableForm.controls['isActive'].setValue(event);
    // console.log("Toggle value :", event);
  }

}

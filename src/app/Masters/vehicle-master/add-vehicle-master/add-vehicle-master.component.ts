import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators, } from "@angular/forms";
import { Router } from "@angular/router";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { SnackBarUtilityService } from "src/app/Utility/SnackBarUtility.service";
import { VehicleControls } from "src/assets/FormControls/vehicle-control";
import { vehicleModel } from "src/app/core/models/Masters/vehicle-master";
import { MasterService } from "src/app/core/service/Masters/master.service";
import Swal from "sweetalert2";
import { calculateVolume } from "../vehicle-utility";
import { Subject, firstValueFrom, take, takeUntil } from "rxjs";
import { clearValidatorsAndValidate } from "src/app/Utility/Form Utilities/remove-validation";
import { RouteLocationService } from "src/app/Utility/module/masters/route-location/route-location.service";
import { AutoComplateCommon } from "src/app/core/models/AutoComplateCommon";
import { GeneralService } from "src/app/Utility/module/masters/general-master/general-master.service";
import { HawkeyeUtilityService } from "src/app/Utility/module/hawkeye/hawkeye-utility.service";
@Component({
  selector: "app-add-vehicle-master",
  templateUrl: "./add-vehicle-master.component.html",
})
export class AddVehicleMasterComponent implements OnInit {
  breadScrums: {
    title: string;
    items: string[];
    active: string;
    generatecontrol: true;
    toggle: boolean;
  }[];
  action: string;
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  isUpdate = false;
  vehicleTable: vehicleModel;
  vehicleTableForm: UntypedFormGroup;
  jsonControlVehicleArray: any;
  vendorType: any;
  vendorTypeStatus: any;
  vendorName: any;
  vendorNameStatus: any;
  gpsProvider: any;
  gpsProviderStatus: any;
  ftlTypeDesc: any;
  vendorTypeData: any;
  gpsProviderData: any;
  vendorTypDetail: any;
  gpsProviderDetail: any;
  routeStatus: any;
  submit = "Save";
  protected _onDestroy = new Subject<void>();
  vehicleFormControls: VehicleControls;
  vehicleType: any;
  vehicleTypeStatus: any;
  allData: {
    // vehicleData: vehicleRes?.data,
    vehTypeData: any;
    // venTypeData: any;   
  };
  vehTypeDet: any;
  divisionList: any;
  division: any;
  divisionStatus: any;
  venTypeDet: any;
  venTypeData: any;
  routeDet: any;
  routeName: any;
  ftlTypeDescStatus: any;
  ftlTypeDescName: any;
  divisionAccess: any;
  vendorData: any;
  controllBranch: any;
  location: any;
  locationStatus: any;
  backPath: string;
  vendorDetail: any;

  constructor(
    private masterService: MasterService,
    public objSnackBarUtility: SnackBarUtilityService,
    private route: Router,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private objRouteLocationService: RouteLocationService,
    private generalService: GeneralService,
    private hawkeyeUtilityService: HawkeyeUtilityService
  ) {
    if (this.route.getCurrentNavigation()?.extras?.state != null) {
      this.vehicleTable = route.getCurrentNavigation().extras.state.data;
      console.log(this.vehicleTable);

      this.isUpdate = true;
      this.submit = "Modify";
      this.action = "edit";
    } else {
      this.action = "Add";
    }
    if (this.action === "edit") {
      this.isUpdate = true;
      this.breadScrums = [
        {
          title: "Modify Vehicle",
          items: ["Masters"],
          active: "Modify Vehicle",
          generatecontrol: true,
          toggle: this.vehicleTable.isActive,
        },
      ];
    } else {
      this.breadScrums = [
        {
          title: "Add Vehicle",
          items: ["Masters"],
          active: "Add Vehicle",
          generatecontrol: true,
          toggle: false,
        },
      ];
      this.vehicleTable = new vehicleModel({});
    }
    this.initializeFormControl();
    //this.vehicleTableForm.controls["vendorType"].setValue(this.vehicleTable.vendorType);
  }

  ngOnInit(): void {
    this.getDropDownData();
    this.getDataAndPopulateForm();
    this.getAllMastersData();
    this.backPath = "/Masters/VehicleMaster/VehicleMasterList";
    this.getDropDownList();
  }

  initializeFormControl() {
    this.vehicleFormControls = new VehicleControls(
      this.vehicleTable,
      this.isUpdate
    );
    // Get form controls for Driver Details section
    this.jsonControlVehicleArray = this.vehicleFormControls.getFormControlsD();

    // Build the form group using formGroupBuilder function
    this.vehicleTableForm = formGroupBuilder(this.fb, [
      this.jsonControlVehicleArray,
    ]);
    this.bindDropdown();
  }

  bindDropdown() {
    this.jsonControlVehicleArray.forEach((data) => {
      if (data.name === "vehicleType") {
        // Set category-related variables
        this.vehicleType = data.name;
        this.vehicleTypeStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === "vendorName") {
        // Set category-related variables
        this.vendorName = data.name;
        this.vendorNameStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === "route") {
        // Set category-related variables
        this.routeName = data.name;
        this.routeStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === "ftlTypeDesc") {
        // Set category-related variables
        this.ftlTypeDescName = data.name;
        this.ftlTypeDescStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === "division") {
        // Set category-related variables
        this.division = data.name;
        this.divisionStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === "controllBranch") {
        // Set category-related variables
        this.location = data.name;
        this.locationStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === "gpsProvider") {
        // Set category-related variables
        this.gpsProvider = data.name;
        this.gpsProviderStatus = data.additionalData.showNameAndValue;
        this.getGpsProvider();
      }
      if (data.name === "vendorType") {
        // Set category-related variables
        this.vendorType = data.name;
        this.vendorTypeStatus = data.additionalData.showNameAndValue;
        this.getVendorType();
      }
    });
  }

  //#region
  async getDropDownData() {
    try {
      const res: any = await firstValueFrom(
        this.masterService.getJsonFileDetails("dropDownUrl")
      );
      const { divisionAccess } = res;

      this.divisionList = divisionAccess;

      this.vehicleTableForm.controls["DivisionDrop"].patchValue(
        this.divisionList.filter((element) =>
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
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
      // Handle error, show message, or log as needed
    }
  }
  async getGpsProvider() {
    const Body = {
      companyCode: this.companyCode,
      collectionName: "customer_gpsprovider_mapping",
      filter: {},
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", Body)
    );

    if (res.success && res.data.length > 0) {
      const gpsProviderData = res.data.map((x) => {
        return {
          name: x.pNM,
          value: x.pID,
        };
      });
      //console.log("VendorTypeData", VendorTypeData);
      if (this.isUpdate) {
        const element = gpsProviderData.find(
          (x) => x.name == this.vehicleTable.gpsProvider
        );
        this.vehicleTableForm.controls.gpsProvider.setValue(element);
        //this.vendorFieldChanged()
      }
      this.filter.Filter(
        this.jsonControlVehicleArray,
        this.vehicleTableForm,
        gpsProviderData,
        this.gpsProvider,
        this.gpsProviderStatus
      );
    }
  }
  async getVendorType() {
    const Body = {
      companyCode: this.companyCode,
      collectionName: "General_master",
      filter: { codeType: "VT", activeFlag: true },
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", Body)
    );

    if (res.success && res.data.length > 0) {
      const VendorTypeData = res.data.map((x) => {
        return {
          name: x.codeDesc,
          value: x.codeId,
        };
      });
      //console.log("VendorTypeData", VendorTypeData);
      if (this.isUpdate) {
        const element = VendorTypeData.find(
          (x) => x.name == this.vehicleTable.vendorType
        );
        this.vehicleTableForm.controls.vendorType.setValue(element);
        this.vendorFieldChanged();
      }
      this.filter.Filter(
        this.jsonControlVehicleArray,
        this.vehicleTableForm,
        VendorTypeData,
        this.vendorType,
        this.vendorTypeStatus
      );
    }
  }

  //#endregion

  findDropdownItemByName(dropdownData, name) {
    return dropdownData.find((item) => item.name === name);
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
      this.vehicleTableForm
        .get("capacity")
        .setValue(
          (
            parseFloat(this.vehicleTableForm.value.gvw) -
            parseFloat(this.vehicleTableForm.value.unldWt)
          ).toFixed(2)
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
        companyCode: this.companyCode,
        collectionName: "General_master",
        filter: {},
      };
      let vehTypeReq = {
        companyCode: this.companyCode,
        filter: {},
        collectionName: "vehicleType_detail",
      };
      let gpsProviderReq = {
        companyCode: this.companyCode,
        filter: {},
        collectionName: "customer_gpsprovider_mapping",
      };
      const vehTypeRes = await firstValueFrom(
        this.masterService.masterPost("generic/get", vehTypeReq)
      );
      const generalMasterResponse = await firstValueFrom(
        this.masterService.masterPost("generic/get", generalReqBody)
      );
      const gpsProviderRes = await firstValueFrom(
        this.masterService.masterPost("generic/get", gpsProviderReq)
      );
      const mergedData = {
        vehTypeData: vehTypeRes?.data,
        fltType: generalMasterResponse.data,
        gpsProvider: gpsProviderRes?.data,
      };

      this.allData = mergedData;
      const vehTypeDet = mergedData.vehTypeData?.map((element) => ({
        name: element.vehicleTypeName.toString(),
        value: element.vehicleTypeCode.toString(),
      }));
      const gspProviderDet = mergedData.gpsProvider?.map((e) => ({
        name: e.pNM.toString(),
        value: e.pID.toString(),
      }));

      // let routeDet = [];
      this.routeDet =
      this.routeDet = await this.objRouteLocationService.getRouteLocationDetail();

      const FTLtype = mergedData.fltType
        .filter((item) => item.codeType === "FTLTYP")
        .map((x) => {
          {
            return { name: x.codeDesc, value: x.codeId };
          }
        });

      this.vehTypeDet = vehTypeDet;
      this.gpsProviderDetail = gspProviderDet;
      this.filter.Filter(
        this.jsonControlVehicleArray,
        this.vehicleTableForm,
        vehTypeDet,
        this.vehicleType,
        this.vehicleTypeStatus
      );
      this.filter.Filter(
        this.jsonControlVehicleArray,
        this.vehicleTableForm,
        this.gpsProviderDetail,
        this.gpsProvider,
        this.gpsProviderStatus
      );
      this.filter.Filter(
        this.jsonControlVehicleArray,
        this.vehicleTableForm,
        this.routeDet,
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

      const ftlType = FTLtype.find(
        (x) => x.name === this.vehicleTable.ftlTypeDesc
      );
      this.vehicleTableForm.controls["ftlTypeDesc"].setValue(ftlType);

      this.autofillDropdown();
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error("Error:", error);
    }
  }
  //#endregion

  async getDropDownList() {
    const vendorType: AutoComplateCommon[] =
      await this.generalService.getDataForMultiAutoComplete(
        "General_master",
        { codeType: "VENDTYPE" },
        "codeDesc",
        "codeId"
      );
    this.filter.Filter(
      this.jsonControlVehicleArray,
      this.vehicleTableForm,
      vendorType,
      this.vendorType,
      this.vendorTypeStatus
    );
  }

  async vendorFieldChanged() {
    this.vehicleTableForm.controls.vendorName.setValue("");
    const Body = {
      companyCode: this.companyCode,
      collectionName: "vendor_detail",
      filter: {
        vendorType: parseInt(this.vehicleTableForm.value.vendorType.value),
      },
    };
    const res = await firstValueFrom(this.masterService.masterPost("generic/get", Body));

    if (res.success && res.data.length > 0) {
      const vendorNameData = res.data.map((x) => {
        return {
          name: x.vendorName,
          value: x.vendorCode,
        };
      });
      if (this.isUpdate) {
        const element = vendorNameData.find(
          (x) => x.name === this.vehicleTable.vendorName
        );
        this.vehicleTableForm.controls.vendorName.setValue(element);
      }
      this.filter.Filter(
        this.jsonControlVehicleArray,
        this.vehicleTableForm,
        vendorNameData,
        this.vendorName,
        this.vendorNameStatus
      );
    } else {
      Swal.fire({
        icon: "info",
        title: "info",
        text: "Vendor name not found please select another vendor type",
        showConfirmButton: true,
      });
      this.vehicleTableForm.controls.vendorType.setValue("");
    }
  }
  //#region
  autofillDropdown() {
    if (this.isUpdate) {

      const vehTypeData = this.vehTypeDet.find(
        (x) => x.name == this.vehicleTable.vehicleType
      );
      this.vehicleTableForm.controls.vehicleType.setValue(vehTypeData);

      const RouteData = this.routeDet.find(
        (x) => x.name == this.vehicleTable.route
      );

      this.vehicleTableForm.controls.route.setValue(RouteData);
    }
  }
  //#endregion

  //#region mutliselection dropdown
  async fetchDataAndPopulateForm(
    collectionName,
    formControl,
    dataProperty,
    nameProperty,
    showNameAndValue
  ) {
    try {
      const reqBody = {
        companyCode: this.companyCode,
        collectionName: collectionName,
        filter: {},
      };
      const response = await firstValueFrom(
        this.masterService.masterPost("generic/get", reqBody)
      );
      const dataList = response.data.map((x) => ({
        name: x[nameProperty],
        value: x[dataProperty],
      }));

      if (this.isUpdate) {
        const selectedData = dataList.find(
          (x) => x.name === this.vehicleTable[formControl]
        );
        this.vehicleTableForm.controls[formControl].setValue(selectedData);
        if (formControl == "controllBranch") {
          const selectedData = dataList.filter((x) =>
            this.vehicleTable[formControl].includes(x.name)
          );
          this.vehicleTableForm.controls["controllBranchDrop"].setValue(
            selectedData
          );
        }
      }
      // Call the Filter function with the appropriate arguments
      this.filter.Filter(
        this.jsonControlVehicleArray,
        this.vehicleTableForm,
        dataList,
        formControl,
        showNameAndValue
      );
    } catch (error) {
      console.error("Error:", error);
    }
  }
  //#endregion

  //#region Call the function for each data type with the appropriate showNameAndValue parameter
  async getDataAndPopulateForm() {
    await this.fetchDataAndPopulateForm(
      "location_detail",
      "controllBranch",
      "locCode",
      "locName",
      true
    );
  }
  //#endregion

  //#region
  async checkVehicleNumberExist() {
    let req = {
      companyCode: this.companyCode,
      collectionName: "vehicle_detail",
      filter: {},
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", req)
    );
    const vehicleNoExists = res.data.some(
      (res) =>
        res._id === this.vehicleTableForm.value._id ||
        res.vehicleNo === this.vehicleTableForm.value.vehicleNo
    );
    if (vehicleNoExists) {
      // Show the popup indicating that the state already exists
      Swal.fire({
        title: "Vehicle Number already exists! Please try with another",
        toast: true,
        icon: "error",
        showCloseButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: "OK",
      });
      this.vehicleTableForm.controls["vehicleNo"].reset();
    }
    error: (err: any) => {
      // Handle error if required
      console.error(err);
    };
  }
  //#endregion

  //#region
  async save() {
    const controls = this.vehicleTableForm;
    clearValidatorsAndValidate(controls);
    const formValue = this.vehicleTableForm.value;
    formValue.vendorName
      ? this.vehicleTableForm.controls["vendorCode"].setValue(
        formValue.vendorName.value
      )
      : "";
    this.vehicleTableForm.controls["vehicleTypeCode"].setValue(
      formValue.vehicleType.value
    );
    this.vehicleTableForm.controls["vendorTypeCode"].setValue(
      formValue.vendorType.value
    );
    this.vehicleTableForm.controls["gpsProviderCode"].setValue(
      formValue.gpsProvider?.value || 0
    );
    const controlNames = [
      "vehicleType",
      "vendorType",
      "vendorName",
      "gpsProvider",
      "route",
      "ftlTypeDesc",
    ];
    controlNames.forEach((controlName) => {
      const controlValue = formValue[controlName]?.name;
      this.vehicleTableForm.controls[controlName].setValue(controlValue);
    });

    const controlDetail = this.vehicleTableForm.value.controllBranchDrop;
    const controllBranchDrop = controlDetail
      ? controlDetail.map((item: any) => item.name)
      : "";
    this.vehicleTableForm.controls["controllBranch"].setValue(
      controllBranchDrop
    );

    const divisionDetail = this.vehicleTableForm.value.DivisionDrop;
    const DivisionDrop = divisionDetail
      ? divisionDetail.map((item: any) => item.name)
      : "";
    this.vehicleTableForm.controls["division"].setValue(DivisionDrop);

    this.vehicleTableForm.removeControl("DivisionDrop");
    this.vehicleTableForm.removeControl("controllBranchDrop");
    let data = this.vehicleTableForm.value;
    if (this.isUpdate) {
      let id = this.vehicleTableForm.value.vehicleNo;
      // Remove the "id" field from the form controls
      delete data._id;
      data["mODDT"] = new Date();
      data["mODBY"] = this.vehicleTableForm.value.eNTBY;
      delete data.eNTBY;
      data["mODLOC"] = localStorage.getItem("Branch");
      let req = {
        companyCode: this.companyCode,
        collectionName: "vehicle_detail",
        filter: { vehicleNo: id },
        update: data,
      };
      //API FOR UPDATE
      const res = await firstValueFrom(
        this.masterService.masterMongoPut("generic/update", req)
      );
      if (res) {
        // Display success message
        const ctReq = {
          action: "UploadVehicle",
          reqBody: {
            companyCode: this.companyCode,
            vehicleDet: data,
          },
        };
        await this.updateStatus(data);
        if(data?.gpsDeviceEnabled && data?.gpsDeviceId && data?.gpsDeviceId!="" && data?.gpsProvider && data?.gpsProvider!=""){
          this.hawkeyeUtilityService.pushToCTCommon(ctReq);
        }
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: res.message,
          showConfirmButton: true,
        });
        this.route.navigateByUrl("/Masters/VehicleMaster/VehicleMasterList");
      }
    } else {
      const randomNumber = this.vehicleTableForm.value.vehicleNo;
      // this.vehicleTableForm.controls["_id"].setValue(randomNumber);
      data._id = randomNumber;
      data["eNTDT"] = new Date();
      data["eNTLOC"] = localStorage.getItem("Branch");
      let req = {
        companyCode: this.companyCode,
        collectionName: "vehicle_detail",
        data: data,
      };
      //API FOR ADD
      const res = await firstValueFrom(
        this.masterService.masterPost("generic/create", req)
      );
      if (res) {
        const ctReq = {
          action: "UploadVehicle",
          reqBody: {
            companyCode: this.companyCode,
            vehicleDet: data,
          },
        };
        await this.updateStatus(data);
        if(data?.gpsDeviceEnabled && data?.gpsDeviceId && data?.gpsDeviceId!="" && data?.gpsProvider && data?.gpsProvider!=""){
          this.hawkeyeUtilityService.pushToCTCommon(ctReq);
        }
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

  //#region Update Vehicle Status
  async updateStatus(data: any) {
    let req = {
      companyCode: this.companyCode,
      collectionName: "vehicle_status",
      filter: { vehNo: data.vehicleNo },
    };
    let vehStats = await firstValueFrom(
      this.masterService.masterPost("generic/get", req)
    );
    let vehS=vehStats?.data[0]
    const isUpdates = vehS != null && vehS?.vehNo;
    if(!vehS){
      vehS={}
    }
    vehS={
      ...vehS,
      route:data.route,
      updateDate: new Date(),
      updateBy:data?.mODBY || data?.eNTBY,
      capacity:data.capacity,
      vendor:data.vendorName,
      vendorCode:data.vendorCode,
      vendorType:data.vendorType,
      vendorTypeCode:data.vendorTypeCode
    }
    //update 
    if (isUpdates) {
      let req = {
        companyCode: this.companyCode,
        collectionName: "vehicle_status",
        filter: { 
          vehNo: data.vehicleNo },
        update: vehS,
      };
      
      const res = await firstValueFrom(
        this.masterService.masterMongoPut("generic/update", req)
      );
    }
    //add
    else {
      vehS={
        ...vehS,
        _id:data.vehicleNo,
        vehNo:data.vehicleNo,
        currentLocation:localStorage.getItem("Branch"),
        status:"Available",
        tripId:"",
        dMobNo:"",
        driver:"",
        driverCD:"",
        FromCity:"",
        ToCity:"",
        lcExpireDate:"",
        lcNo:"",
        driverPan:"",
        entryDate:new Date(),
        entryBy:data?.eNTBY || data?.mODBY
      };
      let req = {
        companyCode: this.companyCode,
        collectionName: "vehicle_status",
        data: vehS,
      };
      const res = await firstValueFrom(
        this.masterService.masterPost("generic/create", req)
      );
    }
  }
  //#endregion Update Vehicle Status
  //#region
  enableGpsProvider($event) {
    this.jsonControlVehicleArray.forEach((data) => {
      // if (data.name === "gpsProvider") {
      //   data.disable = !$event.eventArgs.checked; // Toggle the disable property based on checked value
      //   // Update the form control's validation status
      //   //this.vehicleTableForm.controls.gpsProvider.updateValueAndValidity();
      // }
    });
    if ($event.eventArgs.checked) {
      this.vehicleTableForm.controls["gpsDeviceId"].setValidators([
        Validators.required,
      ]);
      this.vehicleTableForm.controls["gpsProvider"].setValidators([
        Validators.required,
      ]);
    } else {
      this.vehicleTableForm.controls["gpsDeviceId"].clearValidators();
      this.vehicleTableForm.controls["gpsProvider"].clearValidators();
    }
    this.vehicleTableForm.controls.gpsProvider.updateValueAndValidity();
    this.vehicleTableForm.controls.gpsDeviceId.updateValueAndValidity();
  }
  //#endregion

  //#region
  SwalMessage(message) {
    Swal.fire({
      title: message, //'Incorrect API',
      toast: true,
      icon: "error",
      showCloseButton: true,
      showCancelButton: false,
      showConfirmButton: false,
      confirmButtonText: "Yes",
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
    let functionName = $event.functionName; // name of the function , we have to call
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
    this.vehicleTableForm.controls["isActive"].setValue(event);
    // console.log("Toggle value :", event);
  }
}

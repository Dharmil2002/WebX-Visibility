import { Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { LocationMaster } from "src/app/core/models/Masters/LocationMaster";
import { LocationControl } from "src/assets/FormControls/LocationMaster";
import { FilterUtils } from "src/app/Utility/Form Utilities/dropdownFilter";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { MasterService } from "src/app/core/service/Masters/master.service";
import Swal from "sweetalert2";
import { processProperties } from "../../processUtility";
import { take, takeUntil } from "rxjs/operators";
import { Subject, firstValueFrom } from "rxjs";
import { MapRender } from "src/app/Utility/Location Map/Maprendering";
import { PinCodeService } from "src/app/Utility/module/masters/pincode/pincode.service";
import { StateService } from "src/app/Utility/module/masters/state/state.service";
import { StorageService } from "src/app/core/service/storage.service";
import { autocompleteObjectValidator } from "src/app/Utility/Validation/AutoComplateValidation";
import { GeneralService } from "src/app/Utility/module/masters/general-master/general-master.service";
import { LocationService } from "src/app/Utility/module/masters/location/location.service";
import { latLongValidator } from "src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction";
import { AutoComplete } from "src/app/Models/drop-down/dropdown";
@Component({
  selector: "app-add-location-master",
  templateUrl: "./add-location-master.component.html",
})
export class AddLocationMasterComponent implements OnInit {
  locationTableForm: UntypedFormGroup;
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  private unsubscribe$: Subject<void> = new Subject<void>();
  protected _onDestroy = new Subject<void>();
  mappedPincode: string;
  mappedPincodeStatus: boolean;
  columnHeader = {
    PinCode: "Pin Code",
    City: "City",
    State: "State",
  };
  StaticField;
  breadScrums: {
    title: string;
    items: string[];
    active: string;
    generatecontrol: boolean;
    toggle: any;
  }[];
  hierachy:AutoComplete[];
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  //#region Variable declaration
  isUpdate = false;
  action: any;
  locationTable: LocationMaster;
  locationFormControls: LocationControl;
  error: string;
  jsonControlLocationArray: any;
  locHierachy: any;
  locHierachyStatus: any;
  reportLoc: any;
  reportLocStatus: any;
  pincodeDet: any;
  pincode: any;
  backPath: string;
  pincodeStatus: any;
  locationCity: any;
  locationCityStatus: any;
  report: any;
  reportStatus: any;
  stateLoc: any;
  stateLocStatus: any;
  locOwnership: any;
  locOwnershipStatus: any;
  reportLevelList: any;
  pincodeResponse: any;
  locationFilterResponse: any;
  locLevelList: any;
  locationResponse: any;
  locOwnerShipList: any;
  locationData: any;
  StateList: any;
  isChecked = false;
  submit = "Save";
  isSubmit=true;
  //#endregion

  constructor(
    private fb: UntypedFormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private filter: FilterUtils,
    private masterService: MasterService,
    private objPinCodeService: PinCodeService,
    private locationService:LocationService,
    private objState: StateService,
    private storage: StorageService,
    private generalService: GeneralService
  ) {
    if (this.router.getCurrentNavigation()?.extras?.state != null) {
      this.locationTable = router.getCurrentNavigation().extras.state.data;
      this.locationTable = {
        ...this.locationTable,
        mappedPinCode: this.locationTable?.mappedPinCode
          ? this.locationTable.mappedPinCode.join(", ")
          : "",
        mappedCity: this.locationTable?.mappedCity
          ? this.locationTable.mappedCity.join(", ")
          : "",
        mappedState: this.locationTable?.mappedState
          ? this.locationTable.mappedState.join(", ")
          : "",
      };
      this.isUpdate = true;
      this.submit = "Modify";
      this.action = "edit";
    } else {
      this.action = "Add";
    }
    if (this.action === "edit") {
      this.breadScrums = [
        {
          title: "Modify Location",
          items: ["Masters"],
          active: "Modify Location",
          generatecontrol: true,
          toggle: this.locationTable.activeFlag,
        },
      ];
    } else {
      this.breadScrums = [
        {
          title: "Add Location",
          items: ["Masters"],
          active: "Add Location",
          generatecontrol: true,
          toggle: false,
        },
      ];
      this.locationTable = new LocationMaster({});
    }
    this.initializeFormControl();
  }

  //#region This method creates the form controls from the json array along with the validations.
  initializeFormControl() {

    this.locationFormControls = new LocationControl(
      this.locationTable,
      this.isUpdate,
      this.isChecked
    );
    this.jsonControlLocationArray =
      this.locationFormControls.getFormControlsLocation();
    // Build the accordion data with section names as keys and corresponding form controls as values
    this.locationTableForm = formGroupBuilder(this.fb, [
      this.jsonControlLocationArray,
    ]);
    if (this.isUpdate) {
      this.CheckHQTR(this.locationTable.locLevel);
    }
  }
  //#endregion
  ngOnInit(): void {
    this.bindDropdown();
    this.getAllMastersData();
    this.backPath = "/Masters/LocationMaster/LocationMasterList";
  }
  bindDropdown() {
    const locationPropertiesMapping = {
      locLevel: { variable: "locHierachy", status: "locHierachyStatus" },
      reportLevel: { variable: "reportLoc", status: "reportLocStatus" },
      locPincode: { variable: "pincode", status: "pincodeStatus" },
      reportLoc: { variable: "report", status: "reportStatus" },
      ownership: { variable: "locOwnership", status: "locOwnershipStatus" },
      mappedPincode: {
        variable: "mappedPincode",
        status: "mappedPincodeStatus",
      },
    };
    processProperties.call(
      this,
      this.jsonControlLocationArray,
      locationPropertiesMapping
    );
  }

  //#region Pincode Dropdown
  getPincodeData() {
    this.objPinCodeService.getPincodes(this.locationTableForm,this.jsonControlLocationArray, "locPincode", this.pincodeStatus);
  }
  //#endregion

  //#region Save function
  async save() {
    this.isSubmit=false;
    const { mappedPinCode, mappedCity, mappedState } =
      this.locationTableForm.value;

    if (
      (mappedPinCode.length === 0 || mappedPinCode === "") &&
      (mappedCity.length === 0 || mappedCity === "") &&
      (mappedState.length === 0 || mappedState === "")
    ) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please fill at least one mapped area pincode/city/state",
        showConfirmButton: true,
      });
      return;
    }
    const locValue = this.locationTableForm.value;
    const { locLevel, reportLevel } = locValue;
    const formValue = this.locationTableForm.value;
    // Prepare a list of control names to process
    const controlNames = [
      "locLevel",
      "reportLevel",
      "reportLoc",
      "locPincode",
      "ownership",
    ];
    const extractControlValue = (controlName) => formValue[controlName]?.value;
    const resultArraypinCodeList = this.locationTableForm.value.mappedPinCode
      ? this.locationTableForm.value.mappedPinCode.split(",")
      : [];
    const resultArraycityList = this.locationTableForm.value.mappedCity
      ? this.locationTableForm.value.mappedCity.split(",")
      : [];
    const resultArraystateList = this.locationTableForm.value.mappedState
      ? this.locationTableForm.value.mappedState.split(",")
      : [];

    controlNames.forEach((controlName) => {
      const controlValue = extractControlValue(controlName);
      this.locationTableForm.controls[controlName].setValue(controlValue);
    });
    // Extract latitude and longitude from comma-separated string
    const latLng = this.locationTableForm.value.Latitude.split(",");
    this.locationTableForm.controls.Latitude.setValue(latLng[0] || 0);
    this.locationTableForm.controls.Longitude.setValue(latLng[1] || 0);
    this.locationTableForm.controls["mappedPinCode"].setValue(
      resultArraypinCodeList
    );
    this.locationTableForm.controls["mappedCity"].setValue(resultArraycityList);
    this.locationTableForm.controls["mappedState"].setValue(
      resultArraystateList
    );
    Object.values(this.locationTableForm.controls).forEach((control) =>
      control.setErrors(null)
    );

    if (this.isUpdate) {
      const locCode=this.locationTableForm.controls["locCode"].value;
      this.locationTableForm.removeControl("mappedPincode");
      this.locationTableForm.removeControl("pincodeHandler");
      let data = this.locationTableForm.value;
      data["mODDT"] = new Date();
      data["mODLOC"] = this.storage.branch;
      data["mODBY"] = this.storage.userName;
      const req = {
        companyCode: this.companyCode,
        collectionName: "location_detail",
        filter: {companyCode:this.companyCode,locCode: locCode },
        update: data,
      };
      const res = await firstValueFrom(
        this.masterService.masterPut("generic/update", req)
      );
      if (res) {
        // Display success message
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: "Record updated Successfully",
          showConfirmButton: true,
        });
        this.router.navigateByUrl("/Masters/LocationMaster/LocationMasterList");
      }
    } else {
      this.locationTableForm.removeControl("pincodeHandler");
      if ( locLevel.value === 1 ) {
        // Reset form controls and show an error message
        this.locationTableForm.patchValue({
          locLevel: 1,
          reportLevel: "",
        });
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: "You cannot add Multiple Location as Head Office. Please try with another location.",
          showConfirmButton: true,
        });
        return;
      }
      this.locationTableForm.removeControl("mappedPincode");
      let data = this.locationTableForm.value;
      data["eNTDT"] = new Date();
      data["eNTLOC"] = this.storage.branch;
      data["eNTBY"] = this.storage.userName;

      // Create a new record
      data["_id"] = `${this.companyCode}-${data["locCode"]}`;
      if(data["locLevel"] == 1 ){
        data["reportLevel"] = "";
        data["reportLoc"] = "";
      }
      const createReq = {
        companyCode: this.companyCode,
        collectionName: "location_detail",
        data: data,
      };
      const res = await firstValueFrom(
        this.masterService.masterPost("generic/create", createReq)
      );
      if (res) {
        // Display success message
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: "Record added Successfully",
          showConfirmButton: true,
        });
        this.router.navigateByUrl("/Masters/LocationMaster/LocationMasterList");
      }
    }
  }
  //#endregion

  functionCallHandler($event) {
    let functionName = $event.functionName; // name of the function , we have to call
    // we can add more arguments here, if needed. like as shown
    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  cancel() {
    this.router.navigateByUrl("/Masters/LocationMaster/LocationMasterList");
  }

  //#region to set zone , Country according to statename
  async getStateDetails() {
    // Get the state name from the form input
    const stateName = this.locationTableForm.value.locState;

    // Fetch state details by state name
    const stateDetails = await this.objState.fetchStateByFilterId(
      stateName,
      "STNM"
    );

    // Check if state details were found
    if (stateDetails.length > 0) {
      const { ZN, CNTR } = stateDetails[0];

      // Set the region value in the form
      this.locationTableForm.controls["locRegion"].setValue(ZN);

      // Fetch the list of countries from a JSON file
      this.masterService.getJsonFileDetails("countryList").subscribe((res) => {
        // Find the country name that matches the state's country code
        const countryName = res.find((x) => x.Code === CNTR);
        if (countryName) {
          // Set the country value in the form if found
          this.locationTableForm.controls["locCountry"].setValue(
            countryName.Country
          );
        }
      });
    }
  }
  //#endregion

    /*Here the function which is used for the bind staticDropdown Value*/
    async getAllMastersData() {
      this.hierachy = await this.generalService.getGeneralMasterData("HRCHY");
      this.locOwnerShipList = await this.generalService.getGeneralMasterData("LOC_OWN");
      // Find the form control with the name 'packaging_type'
      this.filter.Filter(
        this.jsonControlLocationArray,
        this.locationTableForm,
        this.hierachy,
        this.locHierachy,
        this.locHierachyStatus
      );
      this.filter.Filter(
        this.jsonControlLocationArray,
        this.locationTableForm,
        this.locOwnerShipList,
        this.locOwnership,
        this.locOwnershipStatus
      );
      if (this.isUpdate) {
        const locLevel =  this.hierachy.find(
          (x) => x.value == this.locationTable.locLevel
        );
        this.locationTableForm.controls.locLevel.setValue(locLevel);
        const ownership =  this.locOwnerShipList.find(
          (x) => x.name == this.locationTable.ownership
        );
        this.locationTableForm.controls.ownership.setValue(ownership);
        this.locationTableForm.controls.locPincode.setValue({name:this.locationTable.locPincode,value: this.locationTable.locPincode});
        this.setReportLevelData(locLevel);
      }

    }

  //#region to set state and city according to pincode
  async setStateCityData() {
    const {allData}=this.locationTableForm.controls.locPincode.value;
    console.log(allData);

    allData.ST = parseInt(allData.ST);
    // Fetch and set the state name based on the state code
    const stateName = await this.objState.fetchStateByFilterId(
      allData.ST,
      "ST"
    );
    this.locationTableForm.controls.locState.setValue(stateName[0].STNM);
    this.locationTableForm.controls.locStateId.setValue(stateName[0].ST);
    this.locationTableForm.controls.locCity.setValue(allData.CT);
    this.locationTableForm.controls['gstNumber'].setValue("");
    this.getStateDetails();
  }
  //#endregion

  setReportLevelData(event) {

    if (this.isUpdate) {
      const reportLevel = this.hierachy.find(
        (x) => x.value == this.locationTable.reportLevel
      );
      this.locationTableForm.controls.reportLevel.setValue(reportLevel);
      const reportLoc=this.locationTable.reportLoc?{name:this.locationTable.reportLoc,value:this.locationTable.reportLoc}:"";
      this.locationTableForm.controls.reportLoc.setValue(reportLoc);
    }
    if(this.locationTableForm.controls.locLevel.value.value == 1 && parseInt(this.locationTable.locLevel) != 1) {
      this.locationService.locationFromApi({ locLevel: this.locationTableForm.controls.locLevel.value.value })
      .then((data)=>{
        const isValueExist = data.length > 0;
        if (isValueExist) {
          Swal.fire({
            icon: "error",
            title: "error",
            text: `${this.locationTableForm.controls.locLevel.value.name} already exists!`,
            showConfirmButton: true,
          });

          // Reset the input field
          this.locationTableForm.controls["locLevel"].setValue(0);
          this.CheckHQTR(this.locationTableForm.value.locLevel.value);
        }
      });
    }

    this.filter.Filter(
      this.jsonControlLocationArray,
      this.locationTableForm,
      this.hierachy,
      this.reportLoc,
      this.reportLocStatus
    );

    this.CheckHQTR(this.locationTableForm.value.locLevel.value);
  }
  async getReportLocation() {
    const data= await this.locationService.locationFromApi({locCode: {'D$regex' : `^${this.locationTableForm.controls.reportLoc.value}`,'D$options' : 'i'} ,locLevel: parseInt(this.locationTableForm.controls.reportLevel.value.value)})
    this.filter.Filter(
      this.jsonControlLocationArray,
      this.locationTableForm,
      data,
      this.report,
      this.reportStatus
    );

  }
  // setReportLocData(event) {
  //   const locHierachy =
  //     this.isUpdate &&
  //     typeof event !== "object" &&
  //     !event.hasOwnProperty("value")
  //       ? event
  //       : event.eventArgs.option.value.value;
  //   const filter = this.locationResponse.filter(
  //     (x) => parseInt(x.locLevel) === parseInt(locHierachy)
  //   );
  //   const reportLoc = filter
  //     .filter((item) => item.activeFlag)
  //     .map((element) => ({
  //       name: element.locName,
  //       value: element.locCode,
  //     }));
  //   if (this.isUpdate) {
  //     const reportLocData = reportLoc.find(
  //       (x) => x.value == this.locationTable.reportLoc
  //     );
  //     this.locationTableForm.controls.reportLoc.setValue(reportLocData);
  //   }
  //   this.filter.Filter(
  //     this.jsonControlLocationArray,
  //     this.locationTableForm,
  //     reportLoc,
  //     this.report,
  //     this.reportStatus
  //   );
  //   //this.locationTableForm.controls.reportLoc.setValue("");
  // }
  //#region to check Existing location
  async checkValueExists(fieldName, errorMessage) {
    try {
      // Get the field value from the form controls
      let fieldValue = this.locationTableForm.controls[fieldName].value;
      fieldValue = fieldValue.toUpperCase();
      const locationList = await this.getLocationList();

      // Check if data exists for the given filter criteria
      const isValueExist = locationList.some(
        (item) => item[fieldName].toLowerCase() === fieldValue
      );

      // Check if data exists for the given filter criteria
      if (isValueExist) {
        // Show an error message using Swal (SweetAlert)
        Swal.fire({
          icon: "error",
          title: "error",
          text: `${errorMessage} already exists! Please try with another !`,
          showConfirmButton: true,
        });

        // Reset the input field
        this.locationTableForm.controls[fieldName].reset();
      }
    } catch (error) {
      // Handle errors that may occur during the operation
      console.error(
        `An error occurred while fetching ${fieldName} details:`,
        error
      );
    }
  }
  async checkLocCode(event) {
    console.log("event", event);
    // const res = await this.checkValueExists("locCode", "Location Code");
    const Body = {
      companyCode: this.companyCode,
      collectionName: "location_detail",
      filter: { locCode: this.locationTableForm.value.locCode.toUpperCase() },
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", Body)
    );
    if (res.success && res.data.length != 0) {
      Swal.fire({
        icon: "error",
        title: "error",
        text: `Location Code already exists! Please try with another !`,
        showConfirmButton: true,
      });
      this.locationTableForm.controls.locCode.setValue("");
    }
  }
  async checkLocName() {
    await this.checkValueExists("locName", "Location Name");
  }
  async checkGstNo() {
    await this.checkValueExists("gstNumber", "Gst Number");
  }
  //#endregion

  CheckHQTR(value) {
    if (value == 1) {
      this.jsonControlLocationArray.forEach((x) => {
        if (x.name == "reportLevel" || x.name == "reportLoc") {
          x.disable = true;
        }
      });
      this.locationTableForm.get("reportLevel").clearValidators();
      this.locationTableForm.get("reportLevel").updateValueAndValidity();
      this.locationTableForm.get("reportLoc").clearValidators();
      this.locationTableForm.get("reportLoc").updateValueAndValidity();
      this.locationTableForm.get("locLevel").clearValidators();
      this.locationTableForm
        .get("locLevel")
        .setValidators(autocompleteObjectValidator());
      this.locationTableForm.get("locLevel").updateValueAndValidity();
    } else {
      this.jsonControlLocationArray.forEach((x) => {
        if (x.name == "reportLevel" || x.name == "reportLoc") {
            x.disable = false;
        }
      });
      this.locationTableForm
        .get("reportLevel")
        .setValidators([Validators.required, autocompleteObjectValidator()]);
      this.locationTableForm.get("reportLevel").updateValueAndValidity();
      this.locationTableForm
        .get("reportLoc")
        .setValidators([Validators.required, autocompleteObjectValidator()]);
      this.locationTableForm.get("reportLoc").updateValueAndValidity();
      this.locationTableForm
        .get("locLevel")
        .setValidators([Validators.required, autocompleteObjectValidator()]);
      this.locationTableForm.get("locLevel").updateValueAndValidity();
    }
  }

  //#region get Latitude & Longitude from map
  showMap() {
    let dialogRef = this.dialog.open(MapRender, {
      data: {
        Modulename: "LocationMaster",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.locationTableForm.controls.Latitude.setValue(result);
    });
  }
  //#endregion

  //#region get multiple pincode
  async getMappedPincode() {
    // Get the search keyword
    let search = this.locationTableForm.controls.mappedPincode.value;
    let data = [];
    let dataSTNM = [];
    // Check if search length is less than 3 characters
    if (search.length >= 3) {
      // If the minimum search length is met
      if (!isNaN(search)) {
        let gte = parseInt(`${search}00000`.slice(0, 6));
        let lte = parseInt(`${search}99999`.slice(0, 6));
        const filter = { PIN: {'D$gte' : gte, 'D$lte' : lte} }
        const pinCode= await this.objPinCodeService.getPincodeNestedData(filter,search);
        data = pinCode
          .map((element) => ({
            name: element.name,
            value: "PIN",
          }));
      } else {
        let uniqueCTs = new Set();
        // Filter the data and remove duplicates based on the "CT" field
        const filter ={CT: {'D$regex' : `^${search}`,'D$options' : 'i'}}
        const city= await this.objPinCodeService.getPincodeNestedData(filter,search);
        data = city?city
          .filter((element) => element.allData.CT.toLowerCase().startsWith(search))
          .filter((element) => {
            if (!uniqueCTs.has(element.allData.CT)) {
              uniqueCTs.add(element.allData.CT);
              return true;
            }
            return false;
          })
          .map((element) => ({
            name: element.allData.CT.toString(), // + " - CT",
            value: "CT",
          })):[];
        let uniqueSTNMs = new Set();
        const statefilter ={STNM: {'D$regex' : `^${search}`,'D$options' : 'i'}}
        const states= await this.objPinCodeService.getStateNestedData(statefilter,search);
        dataSTNM =states?states
          .map((element) => ({
            name: element.name, // + " - ST",
            value: "ST",
          })): [];
        data = [...data, ...dataSTNM];
      }
      this.filter.Filter(
        this.jsonControlLocationArray,
        this.locationTableForm,
        data,
        this.mappedPincode,
        this.mappedPincodeStatus
      );
    }
  }
  //#endregion
  async resetPinCode(event) {
    await this.locationTableForm.controls.mappedPincode.patchValue([]);
    await this.locationTableForm.controls.pincodeHandler.patchValue([]);
    // this.jsonControlLocationArray[14].additionalData.isChecked = false
    // this.filter.Filter(
    //   this.jsonControlLocationArray,
    //   this.locationTableForm,
    //   [],
    //   this.mappedPincode,
    //   this.mappedPincodeStatus
    // );
  }
  //#region toggle multiselect data
  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;

    const index = this.jsonControlLocationArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonControlLocationArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        const uniqueValuesSet = new Set(val.map((item) => item.value));
        Array.from(uniqueValuesSet).forEach((item) => {
          if (item == "CT") {
            let mappedCity = val.filter((items) => items.value == "CT");
            this.locationTableForm.controls.mappedCity.patchValue(
              isSelectAll ? mappedCity.map((item) => item.name).toString() : []
            );
          }
          if (item == "ST") {
            let mappedState = val.filter((items) => items.value == "ST");
            this.locationTableForm.controls.mappedState.patchValue(
              isSelectAll ? mappedState.map((item) => item.name).toString() : []
            );
          }
          if (item == "PIN") {
            let mappedPinCode = val.filter((items) => items.value == "PIN");
            this.locationTableForm.controls.mappedPinCode.patchValue(
              isSelectAll
                ? mappedPinCode.map((item) => item.name).toString()
                : []
            );
          }
        });
        this.locationTableForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }
  setSelectedPincodeData(event) {
    const uniqueValuesSet = new Set(
      event.eventArgs.value.map((item) => item.value)
    );
    Array.from(uniqueValuesSet).forEach((item) => {
      if (item == "CT") {
        let mappedCity = event.eventArgs.value.filter(
          (items) => items.value == "CT"
        );
        this.locationTableForm.controls.mappedCity.patchValue(
          mappedCity.map((item) => item.name).toString()
        );
      }
      if (item == "ST") {
        let mappedState = event.eventArgs.value.filter(
          (items) => items.value == "ST"
        );
        this.locationTableForm.controls.mappedState.patchValue(
          mappedState.map((item) => item.name).toString()
        );
      }
      if (item == "PIN") {
        let mappedPinCode = event.eventArgs.value.filter(
          (items) => items.value == "PIN"
        );
        this.locationTableForm.controls.mappedPinCode.patchValue(
          mappedPinCode.map((item) => item.name).toString()
        );
      }
    });
  }
  //#endregion
  //set value empty
  setReporting() {
    this.locationTableForm.controls.reportLoc.setValue("");
  }
  //#region to set flag value
  onToggleChange(event: boolean) {
    // Handle the toggle change event in the parent component
    this.locationTableForm.controls["activeFlag"].setValue(event);
    //console.log("Toggle value :", event);
  }
  //#endregion
  latLongValidator(){
    let data=this.locationTableForm.controls.Latitude.value;
    const check=latLongValidator(data);
    if(data.length>18){
      if(check){
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Invalid Latitude and Longitude.",
        showConfirmButton: true,
      });
    }
    }
}
  //#region to validate state in gst number
  async validateState() {
    try {
      const gstNumber = this.locationTableForm.value.gstNumber;
      let gstState = gstNumber.substring(0, 2);
      gstState = parseInt(gstState);
      const locState = this.locationTableForm.value.locStateId;
      if (locState !== gstState) {
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: `This GST '${gstNumber}' belongs to '${locState}' not '${gstState}' Please correct the state code`,
          showConfirmButton: true,
        });
        this.locationTableForm.controls["gstNumber"].setValue("");
        return;
      }
      //const data= await this.locationService.locationFromApi({gstNumber: gstNumber})}})
      //this.checkGstNo();
    } catch (error) {
    }
  }
  //#endregion

  //#region to get location List
  async getLocationList() {
    try {
      const req = {
        companyCode: this.companyCode,
        collectionName: "location_detail",
        filter: {},
      };
      const response = await firstValueFrom(
        this.masterService.masterPost("generic/get", req)
      );

      return response
        ? response.data.sort((a, b) => a._id.localeCompare(b._id))
        : [];
    } catch (error) {
      throw error;
    }
  }
  //#endregion
}

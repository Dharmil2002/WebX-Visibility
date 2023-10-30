import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
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
import { ReplaySubject, Subject } from "rxjs";
import { MapRender } from "src/app/Utility/Location Map/Maprendering";
import { AutoComplateCommon } from "src/app/core/models/AutoComplateCommon";
import { PinCodeService } from "src/app/Utility/module/masters/pincode/pincode.service";
import { StateService } from "src/app/Utility/module/masters/state/state.service";
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
    'PinCode': 'Pin Code',
    'City': 'City',
    'State': 'State',
  };
  StaticField
  breadScrums: { title: string; items: string[]; active: string; generatecontrol: boolean; toggle: any; }[];
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
  submit = 'Save';
  //#endregion

  constructor(
    private fb: UntypedFormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private filter: FilterUtils,
    private masterService: MasterService,
    private objPinCodeService: PinCodeService,
    private objState: StateService
  ) {
    if (this.router.getCurrentNavigation()?.extras?.state != null) {
      this.locationTable = router.getCurrentNavigation().extras.state.data;
      this.locationTable = {
        ...this.locationTable,
        mappedPinCode: this.locationTable?.mappedPinCode.join(', '),
        mappedCity: this.locationTable?.mappedCity.join(', '),
        mappedState: this.locationTable?.mappedState.join(', '),
      };

      this.isUpdate = true;
      this.submit = 'Modify';
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
          toggle: this.locationTable.activeFlag
        },
      ];
    } else {
      this.breadScrums = [
        {
          title: "Add Location",
          items: ["Masters"],
          active: "Add Location",
          generatecontrol: true,
          toggle: false
        },
      ];
      this.locationTable = new LocationMaster({});
    }
    this.initializeFormControl();
  }

  //#region This method creates the form controls from the json array along with the validations.
  initializeFormControl() {
    this.locationFormControls = new LocationControl(this.locationTable, this.isUpdate, this.isChecked);
    this.jsonControlLocationArray = this.locationFormControls.getFormControlsLocation();
    // Build the accordion data with section names as keys and corresponding form controls as values
    this.locationTableForm = formGroupBuilder(this.fb, [this.jsonControlLocationArray]);
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
      mappedPincode: { variable: "mappedPincode", status: "mappedPincodeStatus" }
    };
    processProperties.call(
      this,
      this.jsonControlLocationArray,
      locationPropertiesMapping
    );
  }

  //#region Pincode Dropdown
  getPincodeData() {
    this.objPinCodeService.validateAndFilterPincode(this.locationTableForm, "", this.jsonControlLocationArray, 'locPincode', this.pincodeStatus);
  }
  //#endregion

  //#region Save function
  async save() {
    const { mappedPinCode, mappedCity, mappedState } = this.locationTableForm.value;

    if (
      (mappedPinCode.length === 0 || mappedPinCode === "") &&
      (mappedCity.length === 0 || mappedCity === "") &&
      (mappedState.length === 0 || mappedState === "")
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Please fill at least one mapped area pincode/city/state',
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
    const resultArraypinCodeList = this.locationTableForm.value.mappedPinCode ? this.locationTableForm.value.mappedPinCode.split(',') : [];
    const resultArraycityList = this.locationTableForm.value.mappedCity ? this.locationTableForm.value.mappedCity.split(',') : [];
    const resultArraystateList = this.locationTableForm.value.mappedState ? this.locationTableForm.value.mappedState.split(',') : [];

    controlNames.forEach((controlName) => {
      const controlValue = extractControlValue(controlName);
      this.locationTableForm.controls[controlName].setValue(controlValue);
    });
    // Extract latitude and longitude from comma-separated string
    const latLng = this.locationTableForm.value.Latitude.split(",");
    this.locationTableForm.controls.Latitude.setValue(latLng[0] || 0);
    this.locationTableForm.controls.Longitude.setValue(latLng[1] || 0);
    this.locationTableForm.controls["mappedPinCode"].setValue(resultArraypinCodeList)
    this.locationTableForm.controls["mappedCity"].setValue(resultArraycityList)
    this.locationTableForm.controls["mappedState"].setValue(resultArraystateList)
    Object.values(this.locationTableForm.controls).forEach((control) =>
      control.setErrors(null)
    );

    if (this.isUpdate) {
      const id = this.locationTableForm.value._id;
      this.locationTableForm.removeControl("_id");
      this.locationTableForm.removeControl("EntryBy");
      this.locationTableForm.removeControl("mappedPincode");
      this.locationTableForm.removeControl("pincodeHandler");

      const req = {
        companyCode: this.companyCode,
        collectionName: "location_detail",
        filter: { _id: id },
        update: this.locationTableForm.value,
      };
      const res = this.masterService.masterPut("generic/update", req).toPromise()
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
      if (locLevel.name === 'Head Office' && reportLevel.name === 'Head Office') {
        // Reset form controls and show an error message
        this.locationTableForm.patchValue({
          locLevel: '',
          reportLevel: '',
        });
        Swal.fire({
          icon: 'warning',
          title: 'Warning',
          text: 'You cannot add Multiple Location as Head Office. Please try with another location.',
          showConfirmButton: true,
        });
        return;
      }
      this.locationTableForm.removeControl("updateBy");
      this.locationTableForm.removeControl("mappedPincode");

      // Create a new record
      this.locationTableForm.controls["_id"].setValue(
        this.locationTableForm.controls["locCode"].value
      );

      const createReq = {
        companyCode: this.companyCode,
        collectionName: "location_detail",
        data: this.locationTableForm.value,
      };
      const res = this.masterService.masterPost("generic/create", createReq).toPromise()
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
    const stateDetails = await this.objState.fetchStateByFilterId(stateName, 'STNM');

    // Check if state details were found
    if (stateDetails.length > 0) {
      const { ZN, CNTR } = stateDetails[0];

      // Set the region value in the form
      this.locationTableForm.controls["locRegion"].setValue(ZN);

      // Fetch the list of countries from a JSON file
      this.masterService.getJsonFileDetails("countryList").subscribe((res) => {
        // Find the country name that matches the state's country code
        const countryName = res.find(x => x.Code === CNTR);
        if (countryName) {
          // Set the country value in the form if found
          this.locationTableForm.controls["locCountry"].setValue(countryName.Country);
        }
      });
    }
  }
  //#endregion

  /*get all Master Details*/
  async getAllMastersData() {
    try {
      const locationReqBody = {
        companyCode: this.companyCode,
        filter: {},
        collectionName: "location_detail",
      };
      const pincodeReqBody = {
        companyCode: this.companyCode,
        filter: {},
        collectionName: "pincode_master",
      };
      const generalReqBody = {
        companyCode: this.companyCode,
        filter: {},
        collectionName: "General_master",
      };
      const request = {
        "companyCode": this.companyCode,
        "collectionName": "state_master",
      };

      this.StateList = await this.masterService.masterPost('generic/get', request).toPromise();
      this.locationResponse = await this.masterService
        .masterPost("generic/get", locationReqBody)
        .toPromise();
      this.pincodeResponse = await this.masterService
        .masterPost("generic/get", pincodeReqBody)
        .toPromise();
      const generalResponse = await this.masterService
        .masterPost("generic/get", generalReqBody)
        .toPromise();
      this.locLevelList = generalResponse.data
        .filter((item) => item.codeType === "HRCHY" && item.activeFlag)
        .map((x) => {
          {
            return { name: x.codeDesc, value: x.codeId };
          }
        });
      this.reportLevelList = generalResponse.data
        .filter((item) => item.codeType === "HRCHY" && item.activeFlag)
        .map((x) => {
          {
            return { name: x.codeDesc, value: x.codeId };
          }
        });
      this.locOwnerShipList = generalResponse.data
        .filter((item) => item.codeType === "LOC_OWN" && item.activeFlag)
        .map((x) => {
          {
            return { name: x.codeDesc, value: x.codeId };
          }
        });
      // Create an array to store the merged data
      var mergedArray = [];

      // Merge the two JSON arrays based on the "ST" field
      for (var i = 0; i < this.pincodeResponse.data.length; i++) {
        var mergedItem = Object.assign({}, this.pincodeResponse.data[i]);
        for (var j = 0; j < this.StateList.data.length; j++) {
          if (this.pincodeResponse.data[i].ST === this.StateList.data[j].ST) {
            mergedItem = Object.assign({}, this.pincodeResponse.data[i], this.StateList.data[j]);
            break; // Break the inner loop when a match is found
          }
        }
        mergedArray.push(mergedItem);
      }

      this.pincodeDet = this.pincodeResponse.data
        .map((element) => ({
          name: element.PIN.toString(),
          value: element.PIN.toString(),
        }));
      this.pincodeResponse.data = mergedArray
      // Handle the response from the server
      if (this.isUpdate) {
        const locLevel = this.locLevelList.find(
          (x) => x.value == this.locationTable.locLevel
        );
        this.locationTableForm.controls.locLevel.setValue(locLevel);
        this.setReportLevelData(locLevel);
        const ownership = this.locOwnerShipList.find(
          (x) => x.name == this.locationTable.ownership
        );
        this.locationTableForm.controls.ownership.setValue(ownership);

        const pincodeDet = this.pincodeDet.find(
          (x) => x.value == this.locationTable.locPincode
        );
        this.locationTableForm.controls.locPincode.setValue(pincodeDet);
      }
      this.filter.Filter(
        this.jsonControlLocationArray,
        this.locationTableForm,
        this.locLevelList,
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
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error("Error:", error);
    }
  }
  //#region to set state and city according to pincode
  async setStateCityData() {
    const fetchData = this.pincodeResponse.data.find(
      (item) =>
        item.PIN == this.locationTableForm.controls.locPincode.value.value
    );
    fetchData.ST = parseInt(fetchData.ST)
    // Fetch and set the state name based on the state code
    const stateName = await this.objState.fetchStateByFilterId(fetchData.ST, 'ST');
    this.locationTableForm.controls.locState.setValue(stateName[0].STNM)
    this.locationTableForm.controls.locCity.setValue(fetchData.CT);
    this.getStateDetails();
  }
  //#endregion

  setReportLevelData(event) {
    if (this.isUpdate) {
      const reportLevel = this.locLevelList.find(
        (x) => x.value == this.locationTable.reportLevel
      );
      this.locationTableForm.controls.reportLevel.setValue(reportLevel);
      this.setReportLocData(
        this.isUpdate ? this.locationTable.reportLevel : event
      );
    }
    this.filter.Filter(
      this.jsonControlLocationArray,
      this.locationTableForm,
      this.locLevelList,
      this.reportLoc,
      this.reportLocStatus
    );
  }
  setReportLocData(event) {
    const locHierachy =
      this.isUpdate &&
        typeof event !== "object" &&
        !event.hasOwnProperty("value")
        ? event
        : event.eventArgs.option.value.value;
    const filter = this.locationResponse.data.filter(
      (x) => parseInt(x.locLevel) === parseInt(locHierachy)
    );
    const reportLoc = filter
      .filter((item) => item.activeFlag)
      .map((element) => ({
        name: element.locName,
        value: element.locCode,
      }));
    if (this.isUpdate) {
      const reportLocData = reportLoc.find(
        (x) => x.value == this.locationTable.reportLoc
      );
      this.locationTableForm.controls.reportLoc.setValue(reportLocData);
    }
    this.filter.Filter(
      this.jsonControlLocationArray,
      this.locationTableForm,
      reportLoc,
      this.report,
      this.reportStatus
    );
    //this.locationTableForm.controls.reportLoc.setValue("");
  }
  //#region to check Existing location
  async checkValueExists(fieldName, errorMessage) {
    try {
      // Get the field value from the form controls
      let fieldValue = this.locationTableForm.controls[fieldName].value;
      fieldValue = fieldValue.toUpperCase();
      // Create a request object with the filter criteria
      const req = {
        companyCode: this.companyCode,
        collectionName: "location_detail",
        filter: { [fieldName]: fieldValue },
      };

      // Send the request to fetch user data
      const locationlist = await this.masterService.masterPost("generic/get", req).toPromise();

      // Check if data exists for the given filter criteria
      if (locationlist.data.length > 0) {
        // Show an error message using Swal (SweetAlert)
        Swal.fire({
          icon: "error",
          title: 'error',
          text: `${errorMessage} already exists! Please try with another !`,
          showConfirmButton: true,
        });

        // Reset the input field
        this.locationTableForm.controls[fieldName].reset();
      }
    }
    catch (error) {
      // Handle errors that may occur during the operation
      console.error(`An error occurred while fetching ${fieldName} details:`, error);
    }
  }
  async checkLocCode() {
    await this.checkValueExists("locCode", "Location Code");
  }
  async checkLocName() {
    await this.checkValueExists("locName", "Location Name");
  }
  async checkGstNo() {
    await this.checkValueExists("gstNumber", "Gst Number");
  }
  //#endregion

  //#region get Latitude & Longitude from map
  showMap() {
    let dialogRef = this.dialog.open(MapRender, {
      data: {
        Modulename: "LocationMaster"
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.locationTableForm.controls.Latitude.setValue(result);
    });
  }
  //#endregion

  //#region get multiple pincode
  getMappedPincode() {
    // Get the search keyword
    let search = this.locationTableForm.controls.mappedPincode.value;
    let data = [];
    let dataSTNM = []
    // Check if search length is less than 3 characters
    if (search.length >= 3) {
      // If the minimum search length is met
      if (!isNaN(search)) {
        data = this.pincodeResponse.data
          .filter((x) => x.PIN.toString().startsWith(search))
          .map((element) => ({
            name: element.PIN.toString(),
            value: "PIN",
          }));
      } else {
        let uniqueCTs = new Set();
        // Filter the data and remove duplicates based on the "CT" field
        data = this.pincodeResponse.data
          .filter((element) => element.CT.toLowerCase().startsWith(search))
          .filter((element) => {
            if (!uniqueCTs.has(element.CT)) {
              uniqueCTs.add(element.CT);
              return true;
            }
            return false;
          })
          .map((element) => ({
            name: element.CT.toString(),// + " - CT",
            value: "CT",
          }));
        let uniqueSTNMs = new Set();
        dataSTNM = this.pincodeResponse.data
          .filter((element) => element.STNM.toLowerCase().startsWith(search))
          .filter((element) => {
            if (!uniqueSTNMs.has(element.STNM)) {
              uniqueSTNMs.add(element.STNM);
              return true;
            }
            return false;
          })
          .map((element) => ({
            name: element.STNM.toString(),// + " - ST",
            value: "ST",
          }));
        data = [...data, ...dataSTNM]
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
    await this.locationTableForm.controls.mappedPincode.patchValue([])
    await this.locationTableForm.controls.pincodeHandler.patchValue([])
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
        const uniqueValuesSet = new Set(val.map(item => item.value));
        Array.from(uniqueValuesSet).forEach(item => {
          if (item == 'CT') {
            let mappedCity = val.filter(items => items.value == 'CT')
            this.locationTableForm.controls.mappedCity.patchValue(isSelectAll ? mappedCity.map(item => item.name).toString() : [])
          } if (item == 'ST') {
            let mappedState = val.filter(items => items.value == 'ST')
            this.locationTableForm.controls.mappedState.patchValue(isSelectAll ? mappedState.map(item => item.name).toString() : [])

          } if (item == 'PIN') {
            let mappedPinCode = val.filter(items => items.value == 'PIN')
            this.locationTableForm.controls.mappedPinCode.patchValue(isSelectAll ? mappedPinCode.map(item => item.name).toString() : [])

          }
        })
        this.locationTableForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });

  }
  setSelectedPincodeData(event) {

    const uniqueValuesSet = new Set(event.eventArgs.value.map(item => item.value));
    Array.from(uniqueValuesSet).forEach(item => {
      if (item == 'CT') {
        let mappedCity = event.eventArgs.value.filter(items => items.value == 'CT')
        this.locationTableForm.controls.mappedCity.patchValue(mappedCity.map(item => item.name).toString())
      } if (item == 'ST') {
        let mappedState = event.eventArgs.value.filter(items => items.value == 'ST')
        this.locationTableForm.controls.mappedState.patchValue(mappedState.map(item => item.name).toString())

      } if (item == 'PIN') {
        let mappedPinCode = event.eventArgs.value.filter(items => items.value == 'PIN')
        this.locationTableForm.controls.mappedPinCode.patchValue(mappedPinCode.map(item => item.name).toString())

      }
    })
  }
  //#endregion
  //set value empty
  setReporting() {
    this.locationTableForm.controls.reportLoc.setValue("");
  }
  //#region to set flag value
  onToggleChange(event: boolean) {
    // Handle the toggle change event in the parent component
    this.locationTableForm.controls['activeFlag'].setValue(event);
    //console.log("Toggle value :", event);
  }
  //#endregion

  //#region to validate state in gst number
  async validateState() {
    try {
      const gstNumber = this.locationTableForm.value.gstNumber;
      let filterId = gstNumber.substring(0, 2);
      filterId = parseInt(filterId);
      // Fetch the GST state name based on the state code
      const stateName = await this.objState.fetchStateByFilterId(filterId, 'ST');
      const locState = stateName[0].STNM;
      const gstState = this.locationTableForm.value.locState;

      if (locState !== gstState) {
        Swal.fire({
          icon: 'warning',
          title: 'Warning',
          text: `This GST '${gstNumber}' belongs to '${locState}' not '${gstState}' Please correct the state code`,
          showConfirmButton: true,
        });
        this.locationTableForm.controls['gstNumber'].setValue("");
        return;
      }
      this.checkGstNo();
    } catch (error) {
      console.error('An error occurred while setting the GST state:', error);
    }
  }
  //#endregion
}
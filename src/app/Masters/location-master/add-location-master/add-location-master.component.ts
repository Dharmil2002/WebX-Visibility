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
import { HttpErrorResponse } from "@angular/common/http";
import { MapRender } from "src/app/Utility/Location Map/Maprendering";
import { AutoComplateCommon } from "src/app/core/models/AutoComplateCommon";
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
  breadScrums = [
    {
      title: "Add Location Master",
      items: ["Masters"],
      active: "Location Master",
    },
  ];
  locHierachy: any;
  locHierachyStatus: any;
  reportLoc: any;
  reportLocStatus: any;
  pincodeDet: any;
  pincode: any;
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
  //#endregion

  constructor(
    private fb: UntypedFormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private filter: FilterUtils,
    private masterService: MasterService
  ) {
    if (this.router.getCurrentNavigation()?.extras?.state != null) {
      this.locationTable = router.getCurrentNavigation().extras.state.data;

      console.log(this.locationTable);
      this.isUpdate = true;
      this.action = "edit";
    } else {
      this.action = "Add";
    }
    if (this.action === "edit") {
      this.breadScrums = [
        {
          title: "Location Master",
          items: ["Masters"],
          active: "Edit Location",
        },
      ];
    } else {
      this.breadScrums = [
        {
          title: "Location Master",
          items: ["Masters"],
          active: "Add Location",
        },
      ];
      this.locationTable = new LocationMaster({});
    }
    this.initializeFormControl();
  }

  //#region This method creates the form controls from the json array along with the validations.
  initializeFormControl() {
    this.locationFormControls = new LocationControl(this.locationTable, this.isUpdate);
    this.jsonControlLocationArray = this.locationFormControls.getFormControlsLocation();
    // Build the accordion data with section names as keys and corresponding form controls as values
    this.locationTableForm = formGroupBuilder(this.fb, [this.jsonControlLocationArray]);
  }
  //#endregion
  ngOnInit(): void {
    this.bindDropdown();
    this.getAllMastersData();
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
    const pincodeValue = this.locationTableForm.controls["locPincode"].value;

    // Check if pincodeValue is a valid number and has at least 3 characters
    if (!isNaN(pincodeValue) && pincodeValue.length >= 3) {
      // Find an exact pincode match in the pincodeDet array
      const exactPincodeMatch = this.pincodeDet.find(element => element.name === pincodeValue);

      if (!exactPincodeMatch) {
        // Filter pincodeDet for partial matches
        const filteredPincodeDet = this.pincodeDet.filter(element =>
          element.name.includes(pincodeValue)
        );

        if (filteredPincodeDet.length === 0) {
          // Show a popup indicating no data found for the given pincode
          Swal.fire({
            icon: "info",
            title: "No Data Found",
            text: `No data found for pincode ${pincodeValue}`,
            showConfirmButton: true,
          });
        } else {
          // Call the filter function with the filtered data
          this.filter.Filter(
            this.jsonControlLocationArray,
            this.locationTableForm,
            filteredPincodeDet,
            this.pincode,
            this.pincodeStatus
          );
        }
      }
    }
  }
  //#endregion

  //#region Save function
  save() {
    const formValue = this.locationTableForm.value;

    const controlNames = [
      "locLevel",
      "reportLevel",
      "reportLoc",
      "locPincode",
      "ownership",
    ];
    const extractControlValue = (controlName) => formValue[controlName]?.value;
    const resultArray = this.locationTableForm.value.pincodeHandler.map(item => item.value);
    controlNames.forEach((controlName) => {
      const controlValue = extractControlValue(controlName);
      this.locationTableForm.controls[controlName].setValue(controlValue);
    });
    // Extract latitude and longitude from comma-separated string
    const latLng = this.locationTableForm.value.Latitude.split(",");
    this.locationTableForm.controls.Latitude.setValue(latLng[0] || 0);
    this.locationTableForm.controls.Longitude.setValue(latLng[1] || 0);

    this.locationTableForm.controls["pincodeHandler"].setValue(resultArray)
    const onSuccess = (res) => {
      if (res) {
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: res.message,
          showConfirmButton: true,
        });
        this.router.navigateByUrl("/Masters/LocationMaster/LocationMasterList");
      }
    };
    Object.values(this.locationTableForm.controls).forEach((control) =>
      control.setErrors(null)
    );
    if (this.isUpdate) {
      const id = this.locationTableForm.value._id;
      this.locationTableForm.removeControl("_id");

      const req = {
        companyCode: this.companyCode,
        collectionName: "location_detail",
        filter: { _id: id },
        update: this.locationTableForm.value,
      };
      this.masterService
        .masterPut("generic/update", req)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: onSuccess,
        });
    } else {
      this.locationTableForm.controls["_id"].setValue(
        this.locationTableForm.controls["locCode"].value
      );

      const createReq = {
        companyCode: this.companyCode,
        collectionName: "location_detail",
        data: this.locationTableForm.value,
      };

      this.masterService
        .masterPost("generic/create", createReq)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: onSuccess,
        });
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

  getLocationDetails() {
    let req = {
      companyCode: this.companyCode,
      filter: { locCode: this.locationTableForm.value.locCode },
      collectionName: "location_detail",
    };
    this.masterService.masterPost("generic/get", req).subscribe({
      next: (res: any) => {
        if (res) {
          if (res.data.length > 0) {
            Swal.fire({
              title: "Location Code Already exist! Please try with another",
              toast: true,
              icon: "error",
              showCloseButton: false,
              showCancelButton: false,
              showConfirmButton: true,
              confirmButtonText: "OK",
            });
            this.locationTableForm.controls["locCode"].setErrors({
              locCodeExist: true,
            });
            this.locationTableForm.controls["locCode"].setValue("");
          }
          (err) => {
            if (err instanceof HttpErrorResponse) {
            }
          };
        }
      },
    });
  }
  //#region to set zone according to statename
  getStateDetails() {
    const stateName = this.locationTableForm.value.locState;
    const req = {
      companyCode: this.companyCode,
      filter: { STNM: stateName },
      collectionName: "state_master",
    };
    this.masterService.masterPost("generic/get", req).subscribe({
      next: (res: any) => {
        if (res.data && res.data.length > 0) {
          const firstStateData = res.data[0];
          this.locationTableForm.controls["locRegion"].setValue(firstStateData.ZN);
          this.masterService.getJsonFileDetails("countryList").subscribe((res) => {
            const countryName = res.find(x => x.Code == firstStateData.CNTR)
            this.locationTableForm.controls["locCountry"].setValue(countryName.Country);
          })
        } else {
          // Handle the case where no data is found for the given stateName
          console.error(`No data found for state: ${stateName}`);
        }
      },
      error: (err) => {
        if (err instanceof HttpErrorResponse) {
          // Handle HTTP error if needed
          console.error("HTTP error:", err);
        }
      },
    });
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
      this.locationResponse = await this.masterService
        .masterPost("generic/get", locationReqBody)
        .toPromise();
      this.pincodeResponse = await this.masterService
        .masterPost("generic/get", pincodeReqBody)
        .toPromise();
      const generalResponse = await this.masterService
        .masterPost("generic/get", generalReqBody)
        .toPromise();
      this.locationFilterResponse = this.locationResponse.data
        .filter((item) => item.activeFlag)
        .map((element) => ({
          name: element.locName,
          value: element.locCode,
        }));
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

      this.pincodeDet = this.pincodeResponse.data
        .map((element) => ({
          name: element.PIN.toString(),
          value: element.PIN.toString(),
        }));
      // Handle the response from the server
      if (this.isUpdate) {
        const locLevel = this.locLevelList.find(
          (x) => x.value == this.locationTable.locLevel
        );
        this.locationTableForm.controls.locLevel.setValue(locLevel);
        this.setReportLevelData(locLevel);
        const ownership = this.locOwnerShipList.find(
          (x) => x.value == this.locationTable.ownership
        );
        this.locationTableForm.controls.ownership.setValue(ownership);

        const pincodeDet = this.pincodeDet.find(
          (x) => x.value == this.locationTable.locPincode
        );
        this.locationTableForm.controls.locPincode.setValue(pincodeDet);

        var filter = [];
        this.locationTable.pincodeHandler.forEach(item => {
          filter.push(this.pincodeDet.find(element => element.value == item));
        });

        this.locationTableForm.controls['pincodeHandler'].patchValue(filter);
        let index = this.jsonControlLocationArray.findIndex(obj => obj.name === 'mappedPincode');
        this.jsonControlLocationArray[index].filterOptions = new ReplaySubject<AutoComplateCommon[]>(1)
        this.jsonControlLocationArray[index].filterOptions.next(this.pincodeDet.slice());

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
    const request = {
      "companyCode": this.companyCode,
      "collectionName": "state_master",
      "filter": { ST: fetchData.ST }
    };

    // Fetch pincode data
    const state = await this.masterService.masterPost('generic/get', request).toPromise();
    this.locationTableForm.controls.locState.setValue(state.data[0].STNM)
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
    const reportLoc = filter.map((element) => ({
      name: element.locCode,
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
  }
  //#region to check Existing location
  async checkLocationCodeExist() {
    // Extract locCode and locName form controls
    const { locCode, locName } = this.locationTableForm.controls;

    let codeExists = false;
    let nameExists = false;

    try {
      // Prepare the request to fetch location data from the API
      const req = {
        companyCode: this.companyCode,
        filter: {},
        collectionName: "location_detail",
      };

      // Make the API call to fetch location data
      const res = await this.masterService.masterPost("generic/get", req).toPromise();

      // Check if the API response contains data
      if (res && res.data) {
        // Store the fetched location data
        this.locationData = res.data;
      }

      // Iterate through the fetched location data
      for (const item of this.locationData) {
        // Check if locCode already exists
        if (item.locCode === locCode.value) {
          codeExists = true;
          break;
        }

        // Check if locName already exists
        if (item.locName === locName.value) {
          nameExists = true;
          break;
        }
      }

      // If codeExists flag is true, show an error message and reset locCode
      if (codeExists) {
        this.showDuplicateError("Location Code");
        locCode.reset();
      }

      // If nameExists flag is true, show an error message and reset locName
      if (nameExists) {
        this.showDuplicateError("Location Name");
        locName.reset();
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
  }

  // Helper function to display a Swal error message
  private showDuplicateError(fieldName: string) {
    Swal.fire({
      title: `${fieldName} already exists! Please try with another`,
      toast: true,
      icon: "error",
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonText: "OK",
    });
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

    // Check if search length is less than 3 characters
    if (search.length >= 3) {
      // If the minimum search length is met
      const pinCode = this.pincodeDet.filter((x) => x.name.includes(search));
      this.filter.Filter(
        this.jsonControlLocationArray,
        this.locationTableForm,
        pinCode,
        this.mappedPincode,
        this.mappedPincodeStatus
      );

    }
  }
  //#endregion

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
        this.locationTableForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }
  //#endregion
}
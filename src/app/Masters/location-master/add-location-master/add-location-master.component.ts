import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocationMaster } from 'src/app/core/models/Masters/LocationMaster';
import { LocationControl } from 'src/assets/FormControls/LocationMaster';
import { FilterUtils } from 'src/app/Utility/Form Utilities/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-location-master',
  templateUrl: './add-location-master.component.html',
})
export class AddLocationMasterComponent implements OnInit {
  locationTableForm: UntypedFormGroup;
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
 //#region Variable declaration
  data: any;
  isUpdate = false;
  action: any;
  locationHierarchy: any;
  LocationTable: LocationMaster;
  locationFormControls: LocationControl
  error: string;
  jsonControlLocationArray: any;
  jsonControlOtherArray: any;
  accordionData: any
  hierarchydet: any;
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
  reportLocation: any;
  pincodeLoc: any;
  pincodeDet: any;
  pincode: any;
  pincodeStatus: any;
  cityLoc: any;
  cityLocDet: any;
  locationCity: any;
  locationCityStatus: any;
  reportingLoDet: any;
  reportingLoc: any;
  report: any;
  reportStatus: any;
  stateData: any;
  stateDet: any;
  stateLoc: any;
  stateLocStatus: any;
  zoneData: any;
  zoneDet: any;
  zoneLoc: any;
  zoneLocStatus: any;
  ownershipData: any;
  ownerShipDet: any;
  locOwnership: any;
  locOwnershipStatus: any;
  accountLoc: any;
  accountLocStatus: any;
  accounting: any;
  accountingDet: any;
  dataLocDet: any;
  locData: any;
  locDataStatus: any;
  defaultDet: any;
  nextLocation: any;
  nextLocationStatus: any;
  contLocDet: any;
  prevLocDet: any;
  locPrev: any;
  locPrevStatus: any;
  locCont: any;
  locContStatus: any;
  showSaveAndCancelButton = false;
  //#endregion
  
  constructor(
    private fb: UntypedFormBuilder, public dialog: MatDialog, private router: Router, private filter: FilterUtils,
    private masterService: MasterService, private route: Router,
  ) {
    if (this.router.getCurrentNavigation()?.extras?.state != null) {
      this.LocationTable = router.getCurrentNavigation().extras.state.data;
      this.isUpdate = true;
      this.action = 'edit'

    } else {
      this.action = 'Add'
    }
    if (this.action === 'edit') {
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
      this.LocationTable = new LocationMaster({});
    }
    this.initializeFormControl();
  }

  //#region This method creates the form controls from the json array along with the validations.
  initializeFormControl() {
    const locationFormControls = new LocationControl(this.LocationTable, this.isUpdate);
    this.jsonControlLocationArray = locationFormControls.getFormControlsLocation();
    this.jsonControlOtherArray = locationFormControls.getFormControlsOther();
    // Build the accordion data with section names as keys and corresponding form controls as values
    this.accordionData = {
      "Location Details": this.jsonControlLocationArray,
      "Other Details": this.jsonControlOtherArray,
    };
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.locationTableForm = formGroupBuilder(this.fb, Object.values(this.accordionData));
  }
  //#endregion
  ngOnInit(): void {
    this.bindDropdown();
    this.getDropDownData();
    this.getLocation();
    this.getPincodeData();
    this.getCityData();
    this.getStateData();
  }
  bindDropdown() {
    this.jsonControlLocationArray.forEach(data => {
      if (data.name === 'locLevel') {
        // Set location-related variables
        this.locHierachy = data.name;
        this.locHierachyStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'reportLevel') {
        // Set category-related variables
        this.reportLoc = data.name;
        this.reportLocStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'locPincode') {
        // Set category-related variables
        this.pincode = data.name;
        this.pincodeStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'locCity') {
        // Set category-related variables
        this.locationCity = data.name;
        this.locationCityStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'reportLoc') {
        // Set category-related variables
        this.report = data.name;
        this.reportStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'locState') {
        // Set category-related variables
        this.stateLoc = data.name;
        this.stateLocStatus = data.additionalData.showNameAndValue;
      }
    });
    this.jsonControlOtherArray.forEach(data => {
      if (data.name === 'locRegion') {
        // Set location-related variables
        this.zoneLoc = data.name;
        this.zoneLocStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'ownership') {
        // Set category-related variables
        this.locOwnership = data.name;
        this.locOwnershipStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'acctLoc') {
        // Set category-related variables
        this.accountLoc = data.name;
        this.accountLocStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'dataLoc') {
        // Set category-related variables
        this.locData = data.name;
        this.locDataStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'nextLoc') {
        // Set category-related variables
        this.nextLocation = data.name;
        this.nextLocationStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'prevLoc') {
        // Set category-related variables
        this.locPrev = data.name;
        this.locPrevStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'contLoc') {
        // Set category-related variables
        this.locCont = data.name;
        this.locContStatus = data.additionalData.showNameAndValue;
      }
    });
  }

  //#region DROPDOWN FILTER IN OPTIMIZED WAY
  getDropDownData() {
    this.masterService.getJsonFileDetails('dropDownUrl').subscribe(res => {
      const {
        locationHierarchyDropDown,
        ownershipDropdown,
        zoneDropDown,
        locationOwnershipDropDown,
      } = res;
      this.locationHierarchy = locationHierarchyDropDown;
      this.reportingLoc = ownershipDropdown;
      this.zoneData = zoneDropDown;
      this.ownershipData = locationOwnershipDropDown;
      if (this.isUpdate) {
        this.hierarchydet = this.findDropdownItemByName(this.locationHierarchy, this.LocationTable.locLevel);
        this.locationTableForm.controls.locLevel.setValue(this.hierarchydet);

        this.reportLocation = this.findDropdownItemByName(this.locationHierarchy, this.LocationTable.reportLevel);
        this.locationTableForm.controls.reportLevel.setValue(this.reportLocation);

        this.reportingLoDet = this.findDropdownItemByName(this.reportingLoc, this.LocationTable.reportLoc);
        this.locationTableForm.controls.reportLoc.setValue(this.reportingLoDet);

        this.reportingLoDet = this.findDropdownItemByName(this.reportingLoc, this.LocationTable.reportLoc);
        this.locationTableForm.controls.reportLoc.setValue(this.reportingLoDet);

        this.zoneDet = this.findDropdownItemByName(this.zoneData, this.LocationTable.locRegion);
        this.locationTableForm.controls.locRegion.setValue(this.zoneDet);

        this.ownerShipDet = this.findDropdownItemByName(this.ownershipData, this.LocationTable.ownership);
        this.locationTableForm.controls.ownership.setValue(this.ownerShipDet);
      }
      const filterParams = [
        [this.jsonControlLocationArray, this.locationHierarchy, this.locHierachy, this.locHierachyStatus],
        [this.jsonControlLocationArray, this.locationHierarchy, this.reportLoc, this.reportLocStatus],
        [this.jsonControlLocationArray, this.reportingLoc, this.report, this.reportStatus],
        [this.jsonControlOtherArray, this.zoneData, this.zoneLoc, this.zoneLocStatus],
        [this.jsonControlOtherArray, this.ownershipData, this.locOwnership, this.locOwnershipStatus],
        [this.jsonControlOtherArray, this.accounting, this.locCont, this.locContStatus]
      ];
      filterParams.forEach(([jsonControlArray, dropdownData, formControl, statusControl]) => {
        this.filter.Filter(jsonControlArray, this.locationTableForm, dropdownData, formControl, statusControl);
      });
    });
  }
  //#endregion

  //#region Dropdown for Location List
  getLocation() {
    let req = {
      "companyCode": this.companyCode,
      "type": "masters",
      "collection": "location_detail"
    };
    this.masterService.masterPost('common/getall', req).subscribe({
      next: (res: any) => {
        const LocationList = res.data.map(element => ({
          name: element.locName,
          value: element.locCode
        }));
        if (this.isUpdate) {
          this.locData = LocationList.find((x) => x.name == this.LocationTable.prevLoc);
          this.locationTableForm.controls.prevLoc.setValue(this.locData);

          this.locData = LocationList.find((x) => x.name == this.LocationTable.acctLoc);
          this.locationTableForm.controls.acctLoc.setValue(this.locData);

          this.locData = LocationList.find((x) => x.name == this.LocationTable.dataLoc);
          this.locationTableForm.controls.dataLoc.setValue(this.locData);

          this.locData = LocationList.find((x) => x.name == this.LocationTable.nextLoc);
          this.locationTableForm.controls.nextLoc.setValue(this.locData);

          this.locData = LocationList.find((x) => x.name == this.LocationTable.contLoc);
          this.locationTableForm.controls.contLoc.setValue(this.locData);

        }
        this.filter.Filter(
          this.jsonControlOtherArray,
          this.locationTableForm,
          LocationList,
          this.locPrev,
          this.locPrevStatus
        );
        this.filter.Filter(
          this.jsonControlOtherArray,
          this.locationTableForm,
          LocationList,
          this.accountLoc,
          this.accountLocStatus
        );
        this.filter.Filter(
          this.jsonControlOtherArray,
          this.locationTableForm,
          LocationList,
          this.accountLoc,
          this.accountLocStatus
        );
        this.filter.Filter(
          this.jsonControlOtherArray,
          this.locationTableForm,
          LocationList,
          this.locData,
          this.locDataStatus
        );
        this.filter.Filter(
          this.jsonControlOtherArray,
          this.locationTableForm,
          LocationList,
          this.nextLocation,
          this.nextLocationStatus
        );
        this.filter.Filter(
          this.jsonControlOtherArray,
          this.locationTableForm,
          LocationList,
          this.locCont,
          this.locContStatus
        );

      }
    });
  }
  //#endregion

  //#region Dropdown for Pincode 
  getPincodeData() {
    let req = {
      "companyCode": this.companyCode,
      "type": "masters",
      "collection": "pincode_detail"
    };
    this.masterService.masterPost('common/getall', req).subscribe({
      next: (res: any) => {
        // Assuming the API response contains an array named 'pincodeList'
        const pincodeList = res.data.map(element => ({
          name: element.pincode,
          value: element.pincode
        }));
        if (this.isUpdate) {
          this.pincodeDet = pincodeList.find((x) => x.name == this.LocationTable.locPincode);
          this.locationTableForm.controls.locPincode.setValue(this.pincodeDet);
        }
        this.filter.Filter(
          this.jsonControlLocationArray,
          this.locationTableForm,
          pincodeList,
          this.pincode,
          this.pincodeStatus
        );
      }
    });
  }
  //#endregion

  //#region Dropdown for City
  getCityData() {
    let req = {
      "companyCode": this.companyCode,
      "type": "masters",
      "collection": "city_detail"
    };
    this.masterService.masterPost('common/getall', req).subscribe({
      next: (res: any) => {
        const cityList = res.data.map(element => ({
          name: element.cityName,
          value: element.id
        }));
        if (this.isUpdate) {
          this.cityLocDet = cityList.find((x) => x.name == this.LocationTable.locCity);
          this.locationTableForm.controls.locCity.setValue(this.cityLocDet);
        }
        this.filter.Filter(
          this.jsonControlLocationArray,
          this.locationTableForm,
          cityList,
          this.locationCity,
          this.locationCityStatus
        );
      }
    });
  }
  //#endregion

  //#region Dropdown for State
  getStateData() {
    let req = {
      "companyCode": this.companyCode,
      "type": "masters",
      "collection": "state_detail"
    };
    this.masterService.masterPost('common/getall', req).subscribe({
      next: (res: any) => {
        const stateList = res.data.map(element => ({
          name: element.stateName,
          value: element.stateCode
        }));
        if (this.isUpdate) {
          this.stateData = stateList.find((x) => x.name == this.LocationTable.locState);
          this.locationTableForm.controls.locState.setValue(this.stateData);
        }
        this.filter.Filter(
          this.jsonControlLocationArray,
          this.locationTableForm,
          stateList,
          this.stateLoc,
          this.stateLocStatus
        );
      }
    });
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
      "locState",
      "locCity",
      "locRegion",
      "acctLoc",
      "dataLoc",
      "nextLoc",
      "prevLoc",
      "ownership",
      "contLoc",
    ];
    controlNames.forEach(controlName => {
      const controlValue = formValue[controlName]?.name;
      this.locationTableForm.controls[controlName].setValue(controlValue);
    });
    this.locationTableForm.controls["activeFlag"].setValue(this.locationTableForm.value.activeFlag == true ? "Y" : "N");
    if (this.isUpdate) {
      let id = this.locationTableForm.value.id;
      // Remove the "id" field from the form controls
      this.locationTableForm.removeControl("id");
      let req = {
        companyCode: this.companyCode,
        type: "masters",
        collection: "location_detail",
        id: id,
        updates: this.locationTableForm.value
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
            this.route.navigateByUrl('/Masters/LocationMaster/LocationMasterList');
          }
        }
      });
    } else {
      this.locationTableForm.controls['id'].setValue(this.locationTableForm.controls['locCode'].value);
      let req = {
        companyCode: this.companyCode,
        type: "masters",
        collection: "location_detail",
        data: this.locationTableForm.value
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
            this.route.navigateByUrl('/Masters/LocationMaster/LocationMasterList');
          }
        }
      });
    }
  }
  //#endregion

  findDropdownItemByName(dropdownData, name) {
    return dropdownData.find(item => item.name === name);
  }
  functionCallHandler($event) {
    // console.log("fn handler called" , $event);
    let field = $event.field;                   // the actual formControl instance
    let functionName = $event.functionName;     // name of the function , we have to call
    // we can add more arguments here, if needed. like as shown
    // $event['fieldName'] = field.name;
    // function of this name may not exists, hence try..catch 
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  cancel() {
    window.history.back();
  }
}

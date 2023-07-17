import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocationMaster } from 'src/app/core/models/Masters/LocationMaster';
import { LocationControl } from 'src/assets/FormControls/LocationMaster';
import { FilterUtils } from 'src/app/Utility/Form Utilities/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { utilityService } from 'src/app/Utility/utility.service';
import Swal from 'sweetalert2';
import { getShortName } from 'src/app/Utility/commonFunction/random/generateRandomNumber';

@Component({
  selector: 'app-add-location-master',
  templateUrl: './add-location-master.component.html',
})
export class AddLocationMasterComponent implements OnInit {
  locationTableForm: UntypedFormGroup;
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
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
  locationCitygStatus: any;
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
        this.locationCitygStatus = data.additionalData.showNameAndValue;
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


  //DROPDOWN FILTER IN OPTIMIZED WAY
  getDropDownData() {
    this.masterService.getJsonFileDetails('dropDownUrl').subscribe(res => {
      const {
        locationHierarchyDropDown,
        pincodeLocationDropDown,
        cityLocDropDown,
        ownershipDropdown,
        stateLocDropDown,
        zoneDropDown,
        locationOwnershipDropDown,
        locdataDropDown
      } = res;
      this.locationHierarchy = locationHierarchyDropDown;
      this.pincodeLoc = pincodeLocationDropDown;
      this.cityLoc = cityLocDropDown;
      this.reportingLoc = ownershipDropdown;
      this.stateData = stateLocDropDown;
      this.zoneData = zoneDropDown;
      this.ownershipData = locationOwnershipDropDown;
      this.accounting = locdataDropDown;
      if (this.isUpdate) {
        this.hierarchydet = this.findDropdownItemByName(this.locationHierarchy, this.LocationTable.locLevel);
        this.locationTableForm.controls.locLevel.setValue(this.hierarchydet);

        this.reportLocation = this.findDropdownItemByName(this.locationHierarchy, this.LocationTable.reportTo);
        this.locationTableForm.controls.reportLevel.setValue(this.reportLocation);

        this.pincodeDet = this.findDropdownItemByName(this.pincodeLoc, this.LocationTable.locPincode);
        this.locationTableForm.controls.locPincode.setValue(this.pincodeDet);

        this.cityLocDet = this.findDropdownItemByName(this.cityLoc, this.LocationTable.locCity);
        this.locationTableForm.controls.locCity.setValue(this.cityLocDet);

        this.reportingLoDet = this.findDropdownItemByName(this.reportingLoc, this.LocationTable.reportLoc);
        this.locationTableForm.controls.reportLoc.setValue(this.reportingLoDet);

        this.stateDet = this.findDropdownItemByName(this.stateData, this.LocationTable.locState);
        this.locationTableForm.controls.locState.setValue(this.stateDet);

        this.zoneDet = this.findDropdownItemByName(this.zoneData, this.LocationTable.locZone);
        this.locationTableForm.controls.locRegion.setValue(this.zoneDet);

        this.ownerShipDet = this.findDropdownItemByName(this.ownershipData, this.LocationTable.ownership);
        this.locationTableForm.controls.ownership.setValue(this.ownerShipDet);

        this.accountingDet = this.findDropdownItemByName(this.accounting, this.LocationTable.acctLoc);
        this.locationTableForm.controls.acctLoc.setValue(this.accountingDet);

        this.dataLocDet = this.findDropdownItemByName(this.accounting, this.LocationTable.dataLoc);
        this.locationTableForm.controls.dataLoc.setValue(this.dataLocDet);

        this.defaultDet = this.findDropdownItemByName(this.accounting, this.LocationTable.defaultLoc);
        this.locationTableForm.controls.nextLoc.setValue(this.defaultDet);

        this.prevLocDet = this.findDropdownItemByName(this.accounting, this.LocationTable.nearLoc);
        this.locationTableForm.controls.prevLoc.setValue(this.prevLocDet);

        this.contLocDet = this.findDropdownItemByName(this.accounting, this.LocationTable.contLoc);
        this.locationTableForm.controls.contLoc.setValue(this.contLocDet);
      }
      const filterParams = [
        [this.jsonControlLocationArray, this.locationHierarchy, this.locHierachy, this.locHierachyStatus],
        [this.jsonControlLocationArray, this.locationHierarchy, this.reportLoc, this.reportLocStatus],
        [this.jsonControlLocationArray, this.pincodeLoc, this.pincode, this.pincodeStatus],
        [this.jsonControlLocationArray, this.cityLoc, this.locationCity, this.locationCitygStatus],
        [this.jsonControlLocationArray, this.reportingLoc, this.report, this.reportStatus],
        [this.jsonControlLocationArray, this.stateData, this.stateLoc, this.stateLocStatus],
        [this.jsonControlOtherArray, this.zoneData, this.zoneLoc, this.zoneLocStatus],
        [this.jsonControlOtherArray, this.ownershipData, this.locOwnership, this.locOwnershipStatus],
        [this.jsonControlOtherArray, this.accounting, this.accountLoc, this.accountLocStatus],
        [this.jsonControlOtherArray, this.accounting, this.locData, this.locDataStatus],
        [this.jsonControlOtherArray, this.accounting, this.nextLocation, this.nextLocationStatus],
        [this.jsonControlOtherArray, this.accounting, this.locPrev, this.locPrevStatus],
        [this.jsonControlOtherArray, this.accounting, this.locCont, this.locContStatus]
      ];
      filterParams.forEach(([jsonControlArray, dropdownData, formControl, statusControl]) => {
        this.filter.Filter(jsonControlArray, this.locationTableForm, dropdownData, formControl, statusControl);
      });
    });
  }

  

  save() {
    const formValue = this.locationTableForm.value;
    Object.keys(formValue).forEach(key => {
      this.locationTableForm.controls[key].setValue(formValue[key]);
    });
    this.locationTableForm.controls["activeFlag"].setValue(this.locationTableForm.value.activeFlag == true ? "Y" : "N");
    if (this.isUpdate) {
        let id = this.locationTableForm.value.id;
        // Remove the "id" field from the form controls
        this.locationTableForm.removeControl("id");
        let req = {
            companyCode: this.companyCode,
            type: "masters",
            collection: "location",
            id: id,
            data: this.locationTableForm.value
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
        const randomNumber = getShortName(this.locationTableForm.value.locName);
        this.locationTableForm.controls["id"].setValue(randomNumber);
        let req = {
            companyCode: this.companyCode,
            type: "masters",
            collection: "location",
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

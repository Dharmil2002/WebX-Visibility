import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocationMaster } from 'src/app/core/models/Masters/LocationMaster';
import { LocationControl } from 'src/assets/FormControls/LocationMaster';
import { FilterUtils } from 'src/app/Utility/Form Utilities/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';

@Component({
  selector: 'app-add-location-master',
  templateUrl: './add-location-master.component.html',
})
export class AddLocationMasterComponent implements OnInit {
  locationTableForm: UntypedFormGroup;
  data: any;
  isUpdate = false;
  action: any;
  locationHierarchy:any;
  LocationTable: LocationMaster;
  locationFormControls: LocationControl
  error: string;
  jsonControlLocationArray: any;
  jsonControlOtherArray: any;
  accordionData: any
  hierarchydet: any;
  breadscrums = [
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
  constructor(
    private fb: UntypedFormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private filter: FilterUtils,
    private masterService: MasterService
  ) {
    if (this.router.getCurrentNavigation()?.extras?.state != null) {
      this.LocationTable = router.getCurrentNavigation().extras.state.data;
      this.isUpdate = true;
      this.action = 'edit'

    } else {
      this.action = 'Add'
    }
    if (this.action === 'edit') {
      this.breadscrums = [
        {
          title: "Location Master",
          items: ["Masters"],
          active: "Edit Location",
        },
      ];

    } else {
      this.breadscrums = [
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
    // Create DriverFormControls instance to get form controls for different sections
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
      if (data.name === 'Loc_Level') {
        // Set location-related variables
        this.locHierachy = data.name;
        this.locHierachyStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'Report_Level') {
        // Set category-related variables
        this.reportLoc = data.name;
        this.reportLocStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'LocPincode') {
        // Set category-related variables
        this.pincode = data.name;
        this.pincodeStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'LocCity') {
        // Set category-related variables
        this.locationCity = data.name;
        this.locationCitygStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'Report_Loc') {
        // Set category-related variables
        this.report = data.name;
        this.reportStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'LocState') {
        // Set category-related variables
        this.stateLoc = data.name;
        this.stateLocStatus = data.additionalData.showNameAndValue;
      }
    });
    this.jsonControlOtherArray.forEach(data => {
      if (data.name === 'LocRegion') {
        // Set location-related variables
        this.zoneLoc = data.name;
        this.zoneLocStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'Ownership') {
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
      if (data.name === 'NextLoc') {
        // Set category-related variables
        this.nextLocation = data.name;
        this.nextLocationStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'PrevLoc') {
        // Set category-related variables
        this.locPrev = data.name;
        this.locPrevStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'ContLoc') {
        // Set category-related variables
        this.locCont = data.name;
        this.locContStatus = data.additionalData.showNameAndValue;
      }
    });
  }

getDropDownData() {
    //throw new Error("Method not implemented.");
    this.masterService.getJsonFileDetails('dropDownUrl').subscribe(res => {
      this.locationHierarchy = res.locationHierarchyDropDown;
       this.pincodeLoc = res.pincodeLocationDropDown;
      this.cityLoc = res.cityLocDropDown;
       this.reportingLoc = res.ownershipDropdown;
      this.stateData = res.stateLocDropDown;
      this.zoneData = res.zoneDropDown;
      this.ownershipData = res.locationOwnershipDropDown;
      this.accounting = res.locdataDropDown;
      if (this.isUpdate) {
        this.hierarchydet = this.locationHierarchy.find((x) => x.name == this.LocationTable.locLevel);
        this.locationTableForm.controls.Loc_Level.setValue(this.hierarchydet);
        this.reportLocation = this.locationHierarchy.find((x) => x.name == this.LocationTable.reportTo);
        this.locationTableForm.controls.Report_Level.setValue(this.reportLocation);
        this.pincodeDet = this.pincodeLoc.find((x) => x.name == this.LocationTable.locPincode);
        this.locationTableForm.controls.LocPincode.setValue(this.pincodeDet);
        this.cityLocDet = this.cityLoc.find((x) => x.name == this.LocationTable.locCity);
        this.locationTableForm.controls.LocCity.setValue(this.cityLocDet);
        this.reportingLoDet = this.reportingLoc.find((x) => x.name == this.LocationTable.reportLoc);
        this.locationTableForm.controls.Report_Loc.setValue(this.reportingLoDet);
        this.stateDet = this.stateData.find((x) => x.name == this.LocationTable.locState);
        this.locationTableForm.controls.LocState.setValue(this.stateDet);
        this.zoneDet = this.zoneData.find((x) => x.name == this.LocationTable.locZone);
        this.locationTableForm.controls.LocRegion.setValue(this.zoneDet);
        this.ownerShipDet = this.ownershipData.find((x) => x.name == this.LocationTable.ownership);
        this.locationTableForm.controls.Ownership.setValue(this.ownerShipDet);
        this.accountingDet = this.accounting.find((x) => x.name == this.LocationTable.acctLoc);
        this.locationTableForm.controls.acctLoc.setValue(this.accountingDet);
        this.dataLocDet = this.accounting.find((x) => x.name == this.LocationTable.dataLoc);
        this.locationTableForm.controls.dataLoc.setValue(this.dataLocDet);
        this.defaultDet = this.accounting.find((x) => x.name == this.LocationTable.defaultLoc);
        this.locationTableForm.controls.NextLoc.setValue(this.defaultDet);
        this.prevLocDet = this.accounting.find((x) => x.name == this.LocationTable.nearLoc);
        this.locationTableForm.controls.PrevLoc.setValue(this.prevLocDet);
        this.contLocDet = this.accounting.find((x) => x.name == this.LocationTable.contLoc);
        this.locationTableForm.controls.ContLoc.setValue(this.contLocDet);
        // this.ownerShipDet = this.ownershipData.find((x) => x.name == this.customerTable.ownership);
        // this.locationTableForm.controls.ownership.setValue(this.ownerShipDet);
      }
      this.filter.Filter(
        this.jsonControlLocationArray,
        this.locationTableForm,
        this.locationHierarchy,
        this.locHierachy,
        this.locHierachyStatus,
      );
      this.filter.Filter(
        this.jsonControlLocationArray,
        this.locationTableForm,
        this.locationHierarchy,
        this.reportLoc,
        this.reportLocStatus,
      );
      this.filter.Filter(
        this.jsonControlLocationArray,
        this.locationTableForm,
        this.pincodeLoc,
        this.pincode,
        this.pincodeStatus,
      );
      this.filter.Filter(
        this.jsonControlLocationArray,
        this.locationTableForm,
        this.cityLoc,
        this.locationCity,
        this.locationCitygStatus,
      );
      this.filter.Filter(
        this.jsonControlLocationArray,
        this.locationTableForm,
        this.reportingLoc,
        this.report,
        this.reportStatus,
      );
      this.filter.Filter(
        this.jsonControlLocationArray,
        this.locationTableForm,
        this.stateData,
        this.stateLoc,
        this.stateLocStatus,
      );
      this.filter.Filter(
        this.jsonControlOtherArray,
        this.locationTableForm,
        this.zoneData,
         this.zoneLoc,
        this.zoneLocStatus,
      );
      this.filter.Filter(
        this.jsonControlOtherArray,
        this.locationTableForm,
        this.ownershipData, 
        this.locOwnership,
        this.locOwnershipStatus,
      );
      this.filter.Filter(
        this.jsonControlOtherArray,
        this.locationTableForm,
        this.accounting, 
        this.accountLoc,
        this.accountLocStatus,
      );
      this.filter.Filter(
        this.jsonControlOtherArray,
        this.locationTableForm,
        this.accounting, 
        this.locData,
        this.locDataStatus,
      );
       this.filter.Filter(
        this.jsonControlOtherArray,
        this.locationTableForm,
        this.accounting, 
        this.locData,
        this.locDataStatus,
      );
      this.filter.Filter(
        this.jsonControlOtherArray,
        this.locationTableForm,
        this.accounting, 
        this.nextLocation,
        this.nextLocationStatus,
      );
      this.filter.Filter(
        this.jsonControlOtherArray,
        this.locationTableForm,
        this.accounting, 
        this.locPrev,
        this.locPrevStatus,
      );
      this.filter.Filter(
        this.jsonControlOtherArray,
        this.locationTableForm,
        this.accounting, 
        this.locCont,
        this.locContStatus,
      );
    });
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

import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { LocationMaster } from 'src/app/core/models/Masters/LocationMaster';
import { LocationControl } from 'src/assets/FormControls/LocationMaster';
import { FilterUtils } from 'src/app/Utility/Form Utilities/dropdownFilter';
import { AutoComplateCommon } from 'src/app/core/models/AutoComplateCommon';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';

@Component({
  selector: 'app-add-location-master',
  templateUrl: './add-location-master.component.html',
})
export class AddLocationMasterComponent implements OnInit {
  LocationTableForm: UntypedFormGroup;
  data: any;
  IsUpdate = false;
  CityUpdate: any;
  action: any;
  LocationHierarchy: AutoComplateCommon[];
  nestedHierarchy: AutoComplateCommon[];
  CityAutoComplate: AutoComplateCommon[];
  StateAutoComplete: AutoComplateCommon[];
  AutoRegion: AutoComplateCommon[];
  Timezone: AutoComplateCommon[]
  LocationAutocomplate: AutoComplateCommon[];
  LocationTable: LocationMaster;
  breadscrums = [
    {
      title: "Add Location Master",
      items: ["Masters"],
      active: "Location Master",
    },
  ];
  
  regionId: any;
  zoneId: any;
  stateId: any;
  locCity: string;
  reportlevelId: any;
  loclevalId: any;
  Report_Loc: string;
  Zone: any;
  StateUpdate: any;
  timezone: any;
  ReportLeval: any;
  ReportLocation: any;
  LocLeval: any;
  LocationList: any;
  Loccode: any;
  loc_startdt: any;
  loc_enddt: any;
  jsonControlArray: any[];
  Loc_Level: any;
  Loc_LevelStatus: any;
  Report_Level: any;
  Report_LevelStatus: any;
  Report_LocStatus: any;
  locationFormControls: LocationControl
  LocState: any;
  LocStateStatus: any;
  LocCity: any;
  LocCityStatus: any;
  TimezoneId: any;
  TimezoneStatus: any;
  LocRegion: any;
  LocRegionStatus: any;
  TimezoneIds: any;
  Report_Locnm: any;
  LocCitynm: any;
  error: string;
  ISLocCode: boolean;
  jsonControlLocationArray: any;
  jsonControlOtherArray: any;
  accordionData: any
  constructor(
    private fb: UntypedFormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    public ObjSnackBarUtility: SnackBarUtilityService,
   // private ILocationMasterServiceService: LocationMasterServiceService,
    private router: Router,
    private filter: FilterUtils

  ) {
    if (this.router.getCurrentNavigation()?.extras?.state != null) {
      this.LocationTable = router.getCurrentNavigation().extras.state.data;
      console.log(JSON.stringify(this.LocationTable));
      this.regionId = this.LocationTable.regionId
      this.zoneId = this.LocationTable.zoneId
      this.stateId = this.LocationTable.stateId
      this.locCity = this.LocationTable.locCity
      this.timezone = this.LocationTable.timezoneID
      this.reportlevelId = this.LocationTable.reportlevelId
      this.loclevalId = this.LocationTable.loclevalId
      this.Report_Loc = this.LocationTable.report_Loc
      this.loc_startdt = this.LocationTable.loc_startdt <= "1900-01-01T00:00:00" ? "" : this.LocationTable.loc_startdt;
      this.loc_enddt = this.LocationTable.loc_enddt <= "1900-01-01T00:00:00" ? "" : this.LocationTable.loc_enddt;
      this.IsUpdate = true;
      this.action = 'edit'

    } else {
      this.action = 'Add'
      this.loc_startdt = "";
      this.loc_enddt = "";
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
    const driverFormControls = new LocationControl(this.LocationTable, this.IsUpdate);
    this.jsonControlLocationArray = driverFormControls.getFormControlsLocation();
    this.jsonControlOtherArray = driverFormControls.getFormControlsOther();

    // Build the accordion data with section names as keys and corresponding form controls as values
    this.accordionData = {
      "Location Details": this.jsonControlLocationArray,
      "Other Details": this.jsonControlOtherArray,
    };

    // Build the form group using formGroupBuilder function and the values of accordionData
    this.LocationTableForm = formGroupBuilder(this.fb, Object.values(this.accordionData));
  }
  //#endregion

  

  ngOnInit(): void {
    // this.GetAllLocationHierarchy();
    // this.GetCityDetails();
    // this.GetStateDetails();
    // this.GetAllTimezone("");
    // this.GetZoneDetails();
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
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 5000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
    this.router.navigateByUrl('/Masters/LocationMaster/LocationMasterList');
  }
}

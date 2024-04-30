import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { LocationService } from "src/app/Utility/module/masters/location/location.service";
import { AdminRuleControl } from "src/assets/FormControls/ControlPanel/Admin-ruleControls";
import { Subject, take, takeUntil } from "rxjs";

@Component({
  selector: "app-dcr-rules",
  templateUrl: "./dcr-rules.component.html",
})
export class DcrRulesComponent implements OnInit {
  // Breadcrumbs
  breadScrums = [
    {
      title: "Series Admin Rules",
      items: ["Control"],
      active: "Series Admin Rules",
    },
  ];
  jsonControlArray: any;
  ComputerizedjsonControlArray: any;
  ManageExceptionsjsonControlArray: any;
  dcrRulesTableForm: UntypedFormGroup;
  ComputerizedRulesTableForm: UntypedFormGroup;
  ManageExceptionsTableForm: UntypedFormGroup;
  AdminRuleFormControl: AdminRuleControl;
  companyCode: any = 0;
  locationtatus: boolean;
  showForm: boolean = false;
  Location: any;
  LocationStatus: any;

  constructor(
    private storage: StorageService,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private locationService: LocationService
  ) {
    this.companyCode = this.storage.companyCode;
    this.initializeFormControl();
  }

  ngOnInit(): void {}

  //#region initializeFormControl
  initializeFormControl() {
    this.AdminRuleFormControl = new AdminRuleControl();
    this.jsonControlArray =
      this.AdminRuleFormControl.getadminRuleFormControls();
    this.dcrRulesTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);

    this.ComputerizedjsonControlArray =
      this.AdminRuleFormControl.getComputerizedRuleFormControls();
    this.ComputerizedRulesTableForm = formGroupBuilder(this.fb, [
      this.ComputerizedjsonControlArray,
    ]);

    this.ManageExceptionsjsonControlArray =
      this.AdminRuleFormControl.getManageExceptionsFormControls();
    this.ManageExceptionsTableForm = formGroupBuilder(this.fb, [
      this.ManageExceptionsjsonControlArray,
    ]);
    // this.addDcrTableForm.controls["documentType"].setValue("dkt");
    this.bindDropdown();
  }
  //#endregion

  //#region bindDropdown
  bindDropdown() {
    this.ManageExceptionsjsonControlArray.forEach((data) => {
      if (data.name === "location") {
        // Set Pincode related variables
        this.Location = data.name;
        this.LocationStatus = data.additionalData.showNameAndValue;
      }
    });
  }
  //#endregion

  //#region  Handle function calls
  functionCallHandler($event) {
    let functionName = $event.functionName; // name of the function , we have to call

    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  //#endregion

  //#region manageExceptions
  async manageExceptions() {
    this.showForm = !this.showForm;
  }
  //#endregion

  //#region function handles select All feature of all multiSelect fields of one form.
  protected _onDestroy = new Subject<void>();
  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;
    const index = this.ManageExceptionsjsonControlArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.ManageExceptionsjsonControlArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.ManageExceptionsTableForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }
  //#endregion

  //#region getlocation
  async getlocation() {
    let location =
      this.ManageExceptionsTableForm.value.LocationcodecontrolHandler.length > 0
        ? this.ManageExceptionsTableForm.value.LocationcodecontrolHandler.map(
            (x) => x.value
          )
        : "";
    let destinationMapping = await this.locationService.locationFromApi({
      locCode: {
        D$regex: `^${this.ManageExceptionsTableForm.controls.location.value}`,
        D$options: "i",
      },
    });
    if (location) {
      destinationMapping = destinationMapping.filter(
        (x) => !location.includes(x.value)
      );
      destinationMapping.push(
        ...this.ManageExceptionsTableForm.value.LocationcodecontrolHandler
      );
    }
    this.filter.Filter(
      this.ManageExceptionsjsonControlArray,
      this.ManageExceptionsTableForm,
      destinationMapping,
      this.Location,
      this.LocationStatus
    );
  }
  //#endregion

}

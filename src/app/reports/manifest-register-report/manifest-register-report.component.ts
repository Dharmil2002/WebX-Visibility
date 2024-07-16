import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import moment from 'moment';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { Subject, take, takeUntil } from 'rxjs';
import { ManifestRegister } from 'src/assets/FormControls/Reports/manifest-register/manifest-register';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { ExportService } from 'src/app/Utility/module/export.service';
import Swal from 'sweetalert2';
import { ManifestRegService } from 'src/app/Utility/module/reports/manifest-register-service';
import { GeneralLedgerReportService } from 'src/app/Utility/module/reports/general-ledger-report.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { ModuleCounterService } from 'src/app/core/service/Logger/module-counter-service.service';

@Component({
  selector: 'app-manifest-register-report',
  templateUrl: './manifest-register-report.component.html',
})
export class ManifestRegisterReportComponent implements OnInit {
  jsonControlArray: any;
  desName: any;
  desStatus: any;
  chargesKeys: any[];
  branchName: any;
  branchStatus: any;
  constructor(private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private locationService: LocationService,
    public snackBarUtilityService: SnackBarUtilityService,
    private exportService: ExportService,
    private ManifestRegServices: ManifestRegService,
    private generalLedgerReportService: GeneralLedgerReportService,
    private Storage: StorageService,
    private MCountrService: ModuleCounterService
  ) { }

  ngOnInit(): void {
    this.initializeFormControl()
    const now = moment().endOf('day').toDate();
    const lastweek = moment().add(-10, 'days').startOf('day').toDate()
    // Set the 'start' and 'end' controls in the form to the last week and current date, respectively
    this.manifestRegisterForm.controls["start"].setValue(lastweek);
    this.manifestRegisterForm.controls["end"].setValue(now);
    this.getDropdownData();
    this.branchName = this.jsonControlArray.find(
      (data) => data.name === "Location"
    )?.name;
    this.branchStatus = this.jsonControlArray.find(
      (data) => data.name === "Location"
    )?.additionalData.showNameAndValue;
  }
  breadScrums = [
    {
      title: "Manifest Register Report",
      items: ["Report"],
      active: "Manifest Register Report",
    },
  ];
  manifestRegisterForm: UntypedFormGroup;
  protected _onDestroy = new Subject<void>();
  LoadTable = false;
  loading = true;
  csvFileName: string; // name of the csv file, when data is downloaded
  source: any;
  ReportingBranches: string[] = [];
  columns: any;
  sorting: any;
  searching: any;
  paging: any;
  showOverlay = false;
  formTitle: "Manifest Register Report";

  initializeFormControl() {
    const controls = new ManifestRegister();
    this.jsonControlArray = controls.manifestRegisterControlArray;
    this.manifestRegisterForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.csvFileName = "Manifest_Register_Report";
  }

  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }

  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;
    const index = this.jsonControlArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonControlArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.manifestRegisterForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }

  async getDropdownData() {
    const locationList = await this.locationService.locationFromApi();
    this.filter.Filter(this.jsonControlArray, this.manifestRegisterForm, locationList, "Location", false);
    const branchList = await this.locationService.locationFromApi();
    this.filter.Filter(
      this.jsonControlArray,
      this.manifestRegisterForm,
      branchList,
      this.branchName,
      this.branchStatus
    );
    const loginBranch = branchList.find(x => x.value === this.Storage.branch);
    this.manifestRegisterForm.controls["Location"].setValue(loginBranch);
  }

  async save() {
    this.loading = true;
    try {
      this.ReportingBranches = [];
      if (this.manifestRegisterForm.value.Individual == "N") {
        this.ReportingBranches = await this.generalLedgerReportService.GetReportingLocationsList(this.manifestRegisterForm.value.Location.name);
        this.ReportingBranches.push(this.manifestRegisterForm.value.Location.value);
      } else {
        this.ReportingBranches.push(this.manifestRegisterForm.value.Location.value);
      }
      const startDate = new Date(this.manifestRegisterForm.controls.start.value);
      const endDate = new Date(this.manifestRegisterForm.controls.end.value);
      const startValue = moment(startDate).startOf('day').toDate();
      const endValue = moment(endDate).endOf('day').toDate();
      const mFNO = this.manifestRegisterForm.value.Document;
      const ManifestArray = mFNO ? mFNO.includes(',') ? mFNO.split(',') : [mFNO] : [];
      const branch = this.ReportingBranches;
      const reqBody = {
        startValue, endValue, mFNO, branch, ManifestArray
      }
      const result = await this.ManifestRegServices.getManifestRegisterReportDetails(reqBody);
      console.log("data", result);
      this.columns = result.grid.columns;
      this.sorting = result.grid.sorting;
      this.searching = result.grid.searching;
      this.paging = result.grid.paging;

      this.source = result.data;
      this.LoadTable = true;
      this.showOverlay = true;
      // Push the module counter data to the server
      this.MCountrService.PushModuleCounter();
      if (this.source.length === 0) {
        if (this.source) {
          Swal.fire({
            icon: "error",
            title: "No Records Found",
            text: "Cannot Download CSV",
            showConfirmButton: true,
          });
        }
        return;
      }
      this.loading = false;
    } catch (error) {
      // this.snackBarUtilityService.ShowCommonSwal("error", error.message);
    }
  }
}

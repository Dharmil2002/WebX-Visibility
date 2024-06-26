import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import moment from 'moment';
import { Subject, take, takeUntil } from 'rxjs';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { timeString } from 'src/app/Utility/date/date-utils';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { ExportService } from 'src/app/Utility/module/export.service';
import { GeneralService } from 'src/app/Utility/module/masters/general-master/general-master.service';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { GCNFlowRegService } from 'src/app/Utility/module/reports/gcn-flow-register-service';
import { GeneralLedgerReportService } from 'src/app/Utility/module/reports/general-ledger-report.service';
import { AutoComplateCommon } from 'src/app/core/models/AutoComplateCommon';
import { StorageService } from 'src/app/core/service/storage.service';
import { GCNFlow } from 'src/assets/FormControls/Reports/gcn-flow-Report/gcn-flow-Report';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gcn-flow-report',
  templateUrl: './gcn-flow-report.component.html',
})
export class GcnFlowReportComponent implements OnInit {
  jsonControlArray: any;
  desName: any;
  GcnFlowFormControls: GCNFlow;
  desStatus : any;
  chargesKeys: any[];
  branchName: any;
  tranName: any;
  tranStatus: any;
  branchStatus: any;
  payName: any;
  payStatus: any;
  constructor(private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private locationService: LocationService,
    private generalService: GeneralService,
    public snackBarUtilityService: SnackBarUtilityService,
    private GCNFlowRegServices: GCNFlowRegService,
  )
    { }

  ngOnInit(): void {
    this.initializeFormControl()
    const now = moment().endOf('day').toDate();
    const lastweek = moment().add(-10, 'days').startOf('day').toDate()
    // Set the 'start' and 'end' controls in the form to the last week and current date, respectively
    this.GcnFlowFormRegisterForm.controls["start"].setValue(lastweek);
    this.GcnFlowFormRegisterForm.controls["end"].setValue(now);
    this.getDropdownData();
  }
  breadScrums = [
    {
      title: "GCN Flow Report",
      items: ["Report"],
      active: "GCN Flow Report",
    },
  ];

  GcnFlowFormRegisterForm: UntypedFormGroup;
  protected _onDestroy = new Subject<void>();
  LoadTable=false;
  loading = true;
  csvFileName: string; // name of the csv file, when data is downloaded
  source: any;
  ReportingBranches: string[] = [];
  columns: any;
  sorting: any;
  searching: any;
  movName : any;
  movStatus : any;
  paging: any;
  showOverlay = false;
  formTitle: "GCN Flow Report";
  

  initializeFormControl() {
    this.GcnFlowFormControls = new GCNFlow();
    this.csvFileName = "GCN_Flow_Register";
    this.jsonControlArray = this.GcnFlowFormControls.GCNFlowControlArray;
    this.branchName = this.jsonControlArray.find(
      (data) => data.name === "Location"
    )?.name;
    this.branchStatus = this.jsonControlArray.find(
      (data) => data.name === "Location"
    )?.additionalData.showNameAndValue;
    this.payName = this.jsonControlArray.find(
      (data) => data.name === "pAYBAS"
    )?.name;
    this.payStatus = this.jsonControlArray.find(
      (data) => data.name === "pAYBAS"
    )?.additionalData.showNameAndValue;
    this.tranName = this.jsonControlArray.find(
      (data) => data.name === "tranmode"
    )?.name;
    this.tranStatus = this.jsonControlArray.find(
      (data) => data.name === "tranmode"
    )?.additionalData.showNameAndValue;

    this.movName = this.jsonControlArray.find(
      (data) => data.name === "movType"
    )?.name;
    this.movStatus = this.jsonControlArray.find(
      (data) => data.name === "movType"
    )?.additionalData.showNameAndValue;

    this.GcnFlowFormRegisterForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.GcnFlowFormRegisterForm.controls["ReportType"].setValue('Cumulative');
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
        this.GcnFlowFormRegisterForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }

  async getDropdownData() {
    const locationList = await this.locationService.getLocationList();
    const paymentType: AutoComplateCommon[] = await this.generalService.getDataForMultiAutoComplete("General_master", { codeType: "PAYTYP" }, "codeDesc", "codeId");
    const tranmode: AutoComplateCommon[] = await this.generalService.getDataForMultiAutoComplete("General_master", { codeType: "tran_mode" }, "codeDesc", "codeId");
    this.filter.Filter(
      this.jsonControlArray,
      this.GcnFlowFormRegisterForm,
      locationList,
      this.branchName,
      this.branchStatus
    );
    this.filter.Filter(
      this.jsonControlArray,
      this.GcnFlowFormRegisterForm,
      paymentType,
      this.payName,
      this.payStatus
    );
    this.filter.Filter(
      this.jsonControlArray,
      this.GcnFlowFormRegisterForm,
      tranmode,
      this.tranName,
      this.tranStatus
    );
  }

  async save() {
    debugger;
    this.loading = true;
    try {
      const startValue = new Date(this.GcnFlowFormRegisterForm.controls.start.value);
        const endValue = new Date(this.GcnFlowFormRegisterForm.controls.end.value);
        const startDate = moment(startValue).startOf('day').toDate();
        const endDate = moment(endValue).endOf('day').toDate();
        const fromloc = Array.isArray(this.GcnFlowFormRegisterForm.value.fromlocHandler)
          ? this.GcnFlowFormRegisterForm.value.fromlocHandler.map(x => { return { locCD: x.value, locNm: x.name }; })
          : [];
        const payment = Array.isArray(this.GcnFlowFormRegisterForm.value.payTypeHandler)
          ? this.GcnFlowFormRegisterForm.value.payTypeHandler.map(x => { return { payCD: x.value, payNM: x.name }; })
          : [];
        const transitmode = Array.isArray(this.GcnFlowFormRegisterForm.value.transitHandler)
          ? this.GcnFlowFormRegisterForm.value.transitHandler.map(x => { return { tranCD: x.value, tranNM: x.name }; })
          : [];
        const loadtype = this.GcnFlowFormRegisterForm.value.loadType;
        
        const ReportType = this.GcnFlowFormRegisterForm.value.ReportType;
      const reqBody = {
        startDate, endDate, fromloc, payment,transitmode,loadtype,ReportType
      }
      const result = await this.GCNFlowRegServices.getGCNRegisterReportDetails(reqBody)
      debugger;
      this.columns = result.grid.columns;
      this.sorting = result.grid.sorting;
      this.searching = result.grid.searching;
      this.paging = result.grid.paging;

      this.source = result.data;
      this.LoadTable = true;
      this.showOverlay = true;

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
    }
  }
}

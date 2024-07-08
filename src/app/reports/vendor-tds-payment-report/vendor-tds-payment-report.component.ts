import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import moment from 'moment';
import { Subject, firstValueFrom, take, takeUntil } from 'rxjs';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { financialYear } from 'src/app/Utility/date/date-utils';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { GeneralLedgerReportService } from 'src/app/Utility/module/reports/general-ledger-report.service';
import { VendorTdsPaymentService } from 'src/app/Utility/module/reports/vendor-tds-payment-register-service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { NavDataService } from 'src/app/core/service/navdata.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { VendorTdsPaymentReportControl } from 'src/assets/FormControls/Reports/vendor-tds-payment-report/vendor-tds-payment-report';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vendor-tds-payment-report',
  templateUrl: './vendor-tds-payment-report.component.html'
})
export class VendorTdsPaymentReportComponent implements OnInit {
  tdspaymentregisterFormControl: VendorTdsPaymentReportControl
  jsontdspayregisterFormArray: any;
  tdspaymentregisterTableForm: UntypedFormGroup
  branchName: any;
  branchStatus: any;
  csvFileName: string;
  ReportingBranches: string[] = [];
  loading = true; // Loading indicator
  columns: any;
  sorting: any;
  searching: any;
  paging: any;
  source: any;
  LoadTable: boolean;
  showOverlay = false;
  protected _onDestroy = new Subject<void>();
  now = moment().endOf('day').toDate();

  breadScrums = [
    {
      title: "Vendor Tds Payment Register Report",
      items: ["Home"],
      active: "Vendor Tds Payment Register Report",
    }
  ];
  vendorName: any;
  vendorStatus: any;

  constructor(private fb: UntypedFormBuilder,
    private locationService: LocationService,
    private filter: FilterUtils,
    private Storage: StorageService,
    private generalLedgerReportService: GeneralLedgerReportService,
    private tdsdetails: VendorTdsPaymentService,
    public snackBarUtilityService: SnackBarUtilityService,
    private masterServices: MasterService,
    private nav: NavDataService,
  ) {
    this.initializeFormControl();
  }

  ngOnInit(): void {
    const now = moment().endOf('day').toDate();
    const lastYearAprilFirst = moment().subtract(1, 'year').startOf('year').month(3).date(1).toDate();
    this.tdspaymentregisterTableForm.controls["start"].setValue(lastYearAprilFirst);
    this.tdspaymentregisterTableForm.controls["end"].setValue(now);

    this.csvFileName = "vendor_Register_Report";
    this.getDropdownData();
  }

  initializeFormControl() {
    this.tdspaymentregisterFormControl = new VendorTdsPaymentReportControl();
    this.jsontdspayregisterFormArray = this.tdspaymentregisterFormControl.tdspaymentReportControlArray;
    this.tdspaymentregisterTableForm = formGroupBuilder(this.fb, [this.jsontdspayregisterFormArray]);
    this.tdspaymentregisterTableForm.controls["ReportType"].setValue('Individual');
    //this.tdspaymentregisterTableForm.controls['DocumentStatus'].setValue(5);
    this.branchName = this.jsontdspayregisterFormArray.find(
      (data) => data.name === "Location"
    )?.name;
    this.branchStatus = this.jsontdspayregisterFormArray.find(
      (data) => data.name === "Location"
    )?.additionalData.showNameAndValue;

    this.vendorName = this.jsontdspayregisterFormArray.find(
      (data) => data.name === "vennmcd"
    )?.name;
    this.vendorStatus = this.jsontdspayregisterFormArray.find(
      (data) => data.name === "vennmcd"
    )?.additionalData.showNameAndValue;
  }


  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }

  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;
    const index = this.jsontdspayregisterFormArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsontdspayregisterFormArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.tdspaymentregisterTableForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });


  }

  async getDropdownData() {
    const branchList = await this.locationService.locationFromApi();
    this.filter.Filter(
      this.jsontdspayregisterFormArray,
      this.tdspaymentregisterTableForm,
      branchList,
      this.branchName,
      this.branchStatus
    );
    const loginBranch = branchList.find(x => x.value === this.Storage.branch);
    this.tdspaymentregisterTableForm.controls["Location"].setValue(loginBranch);
    
    const financialYearlist = this.generalLedgerReportService.getFinancialYear();
    this.filter.Filter(
      this.jsontdspayregisterFormArray,
      this.tdspaymentregisterTableForm,
      financialYearlist,
      "Fyear",
      false
    );

    let venNameReq = {
      "companyCode": this.Storage.companyCode,
      "filter": {},
      "collectionName": "vendor_detail"
    };
    const venNameRes = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", venNameReq));
    
    const venNameDet = venNameRes.data
      .map(element => ({
        name: element.vendorName.toString(),
        value: element.vendorCode.toString(),
      }));

    this.filter.Filter(
      this.jsontdspayregisterFormArray,
      this.tdspaymentregisterTableForm,
      venNameDet,
      this.vendorName,
      this.vendorStatus
    );

    const selectedFinancialYear = financialYearlist.find(x => x.value === financialYear);
    this.tdspaymentregisterTableForm.controls["Fyear"].setValue(selectedFinancialYear);
    
  }

  //#region to reset date range
  resetDateRange() {
    const selectedFinancialYear = this.tdspaymentregisterTableForm.controls.Fyear.value;
    const year = parseInt(selectedFinancialYear.value.slice(0, 2), 10) + 2000; // Get the full year from the financial year string
    const minDate = new Date(year, 3, 1);  // April 1 of the calculated year
    let maxDate = new Date(year + 1, 2, 31); // March 31 of the next year

    if (maxDate >= this.now) {
      maxDate = this.now;
    }

    this.tdspaymentregisterTableForm.controls["start"].setValue(minDate);
    this.tdspaymentregisterTableForm.controls["end"].setValue(maxDate);

  }
  //#endregion

  async save() {
    this.loading = true;
    try {
      this.ReportingBranches = [];
      if (this.tdspaymentregisterTableForm.value.Individual == "N") {
        this.ReportingBranches = await this.generalLedgerReportService.GetReportingLocationsList(this.tdspaymentregisterTableForm.value.Location.value);
        this.ReportingBranches.push(this.tdspaymentregisterTableForm.value.Location.value);
      } else {
        this.ReportingBranches.push(this.tdspaymentregisterTableForm.value.Location.value);
      }
      const startDate = new Date(this.tdspaymentregisterTableForm.controls.start.value);
      const endDate = new Date(this.tdspaymentregisterTableForm.controls.end.value);
      const startValue = moment(startDate).startOf('day').toDate();
      const endValue = moment(endDate).endOf('day').toDate();
      const status = "";
      const rtype = this.tdspaymentregisterTableForm.value.ReportType;
      const tpsNo = this.tdspaymentregisterTableForm.value.DocumentNo;
      const TdsnoArray = tpsNo ? tpsNo.includes(',') ? tpsNo.split(',') : [tpsNo] : [];
      const voucherNo = this.tdspaymentregisterTableForm.value.voucherNo;
      const vouchernoArray = voucherNo ? voucherNo.includes(',') ? voucherNo.split(',') : [voucherNo] : [];
      const branch = this.ReportingBranches;
      const vendrnm = Array.isArray(this.tdspaymentregisterTableForm.value.vennmcdHandler)
      ? this.tdspaymentregisterTableForm.value.vennmcdHandler.map(x => { return { vCD: x.value, vNM: x.name }; })
      : [];
      
      const reqBody = {
        startValue, endValue, status, rtype, branch,vendrnm, tpsNo, TdsnoArray,vouchernoArray
      }
      const result = await this.tdsdetails.getVendorTdsPayReportDetail(reqBody);
      console.log("data", result);
      this.columns = result.grid.columns;
      this.sorting = result.grid.sorting;
      this.searching = result.grid.searching;
      this.paging = result.grid.paging;

      const stateData = {
        data: result,
        formTitle: 'Vendor Tds Payment Register Report',
        csvFileName: this.csvFileName
      };
      this.nav.setData(stateData);
      const url = `/#/Reports/generic-report-view`;
      window.open(url, '_blank');
    } catch (error) {
      this.snackBarUtilityService.ShowCommonSwal("error", error.message);
    }
  }
}

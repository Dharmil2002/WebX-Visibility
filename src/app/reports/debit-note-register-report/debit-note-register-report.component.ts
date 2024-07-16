import { Component, OnInit } from '@angular/core';
import { DebitNoteRegister } from 'src/assets/FormControls/Reports/debit-note-register-report/debit-note-register-report';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { financialYear } from 'src/app/Utility/date/date-utils';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { GeneralLedgerReportService } from 'src/app/Utility/module/reports/general-ledger-report.service';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { DebitNoteRegisterService } from 'src/app/Utility/module/reports/debit-note-register-service';
import { NavDataService } from 'src/app/core/service/navdata.service';
import moment from 'moment';
import { Subject, firstValueFrom, take, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { ModuleCounterService } from 'src/app/core/service/Logger/module-counter-service.service';
@Component({
  selector: 'app-debit-note-register-report',
  templateUrl: './debit-note-register-report.component.html'
})
export class DebitNoteRegisterReportComponent implements OnInit {
  DebitNoteFormControls: DebitNoteRegister;
  DebitNoteForm: UntypedFormGroup;
  jsonControlArray: any;
  breadScrums = [
    {
      title: "Debit Note Register Report",
      items: ["Report"],
      active: "Debit Note Register Report",
    },
  ];
  venNameDet: any;
  loading = true;
  columns = [];
  paging: any;
  sorting: any;
  searching: any;
  source: any[] = [];
  columnMenu: any;
  LoadTable = false;
  ReportingBranches: string[] = [];
  protected _onDestroy = new Subject<void>();
  constructor(private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private locationService: LocationService,
    private storage: StorageService,
    private masterServices: MasterService,
    private generalLedgerReportService: GeneralLedgerReportService,
    public snackBarUtilityService: SnackBarUtilityService,
    private debitNoteRegisterService: DebitNoteRegisterService,
    private nav: NavDataService,
    private MCountrService: ModuleCounterService
  ) { }

  ngOnInit(): void {
    this.initializeFormControl()
    const now = moment().endOf('day').toDate();
    this.DebitNoteForm.controls["start"].setValue(now);
    this.DebitNoteForm.controls["end"].setValue(now);
    this.getDropDownList();
  }
  async getDropDownList() {
    let venNameReq = {
      "companyCode": this.storage.companyCode,
      "filter": {},
      "collectionName": "vendor_detail"
    };
    const venNameRes = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", venNameReq));
    this.DebitNoteForm.get('Individual').setValue("Y");
    const branchList = await this.locationService.locationFromApi();

    this.filter.Filter(
      this.jsonControlArray,
      this.DebitNoteForm,
      branchList,
      "branch",
      false
    );
    const loginBranch = branchList.find(branch => branch.value === this.storage.branch);
    this.DebitNoteForm.controls["branch"].setValue(loginBranch);
    const DebitNoteStatusList = [
      { name: "All", value: "All" },
      { name: "Generated", value: "1" },
      { name: "Approved", value: "2" },
      { name: "Cancelled", value: "3" }
    ]
    this.filter.Filter(
      this.jsonControlArray,
      this.DebitNoteForm,
      DebitNoteStatusList,
      "documnetstatus",
      false
    );
    const venNameData = venNameRes?.data;
    const venNameDet = Array.isArray(venNameData) ?
      venNameData.map(element => ({
        name: element.vendorName.toString(),
        value: element.vendorCode.toString(),
      })) : [];
    this.venNameDet = venNameDet;

    this.DebitNoteForm.get('documnetstatus').setValue(DebitNoteStatusList[0]);
    this.filter.Filter(
      this.jsonControlArray,
      this.DebitNoteForm,
      venNameDet,
      "vennmcd",
      false
    );
    const financialYearlist = this.generalLedgerReportService.getFinancialYear();
    this.filter.Filter(
      this.jsonControlArray,
      this.DebitNoteForm,
      financialYearlist,
      "Fyear",
      false
    );
    const selectedFinancialYear = financialYearlist.find(x => x.value === financialYear);
    this.DebitNoteForm.controls["Fyear"].setValue(selectedFinancialYear);
  }

  initializeFormControl() {
    const controls = new DebitNoteRegister();
    this.jsonControlArray = controls.DebitNoteControlArray;
    // Build the form using formGroupBuilder
    this.DebitNoteForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
  }

  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }

  validateDateRange(event): void {
    const startControlValue = this.DebitNoteForm.controls.start.value;
    const endControlValue = this.DebitNoteForm.controls.end.value;
    const selectedFinancialYear = this.DebitNoteForm.controls.Fyear.value;
    if (!startControlValue || !endControlValue) {
      return;
    }
    const startDate = new Date(startControlValue);
    const endDate = new Date(endControlValue);
    const startYear = startDate.getFullYear();
    const financialYearStart = startDate.getMonth() < 3 ? startYear - 1 : startYear;
    const calculatedFnYr = `${financialYearStart.toString().slice(-2)}${(financialYearStart + 1).toString().slice(-2)}`;
    if (selectedFinancialYear.value === calculatedFnYr) {
      const year = parseInt(selectedFinancialYear.value.slice(0, 2), 10) + 2000;
      const minDate = new Date(year, 3, 1);  // April 1 of the calculated year
      const maxDate = new Date(year + 1, 2, 31); // March 31 of the next year
      if (startDate >= minDate && startDate <= maxDate && endDate >= minDate && endDate <= maxDate) {
        console.log('Both dates are within the valid range.');
      } else {
        this.dateRangeWarning(selectedFinancialYear);
        this.clearDateControls();
      }
    }
    else {
      this.dateRangeWarning(selectedFinancialYear);
      this.clearDateControls();
    }
  }
  // Function to display a warning message if the date range is not within the selected financial year
  dateRangeWarning(selectedFinancialYear): void {
    Swal.fire({
      icon: "warning",
      title: "Warning",
      text: `Date range not within FY ${selectedFinancialYear.name}`,
      showConfirmButton: true,
    });
  }
  // Function to clear the date range controls
  clearDateControls(): void {
    this.DebitNoteForm.controls["start"].setValue("");
    this.DebitNoteForm.controls["end"].setValue("");
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
        this.DebitNoteForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }
  async save() {
    this.loading = true;
    try {
      this.ReportingBranches = [];
      if (this.DebitNoteForm.value.Individual == "N") {
        this.ReportingBranches = await this.generalLedgerReportService.GetReportingLocationsList(this.DebitNoteForm.value.branch.value);
        this.ReportingBranches.push(this.DebitNoteForm.value.branch.value);
      } else {
        this.ReportingBranches.push(this.DebitNoteForm.value.branch.value);
      }
      const startDate = new Date(this.DebitNoteForm.controls.start.value);
      const endDate = new Date(this.DebitNoteForm.controls.end.value);
      const startValue = moment(startDate).startOf('day').toDate();
      const endValue = moment(endDate).endOf('day').toDate();
      const finYear = this.DebitNoteForm.value.Fyear;
      const Branch = this.ReportingBranches;
      const Individual = this.DebitNoteForm.value.Individual;
      const DocStatus = this.DebitNoteForm.value.documnetstatus;
      const MSME = this.DebitNoteForm.value.msmeRegistered;
      const vendData = Array.isArray(this.DebitNoteForm.value.vendnmcdHandler)
        ? this.DebitNoteForm.value.vendnmcdHandler.map(x => { return { vCD: x.value, vNM: x.name }; })
        : [];
      const DocNo = this.DebitNoteForm.value.docNo;
      const DocNos = DocNo ? DocNo.includes(',') ? DocNo.split(',') : [DocNo] : [];
      const VoucherNo = this.DebitNoteForm.value.voucherNo;
      const VoucherNos = VoucherNo ? VoucherNo.includes(',') ? VoucherNo.split(',') : [VoucherNo] : [];
      const reqBody = {
        startValue, endValue, finYear, Branch, Individual, DocStatus, MSME, vendData, DocNos, DocNo, VoucherNo, VoucherNos
      }
      const result = await this.debitNoteRegisterService.GetDebitNoteDetails(reqBody);
      this.columns = result.grid.columns;
      this.sorting = result.grid.sorting;
      this.searching = result.grid.searching;
      this.paging = result.grid.paging;
      if (result.data.length === 0) {
        let message = "No Data Found!";
        if (DocNos.length > 0) {
          message = "There is No Debit note has been Generated against this Document!";
        } else if (VoucherNos.length > 0) {
          message = "This voucher is not generated against Debit note!";
        }
        this.snackBarUtilityService.ShowCommonSwal("error", message);
        return;
      }
      const Details = {
        data: result,
        formTitle: 'Debit Note Register Details',
        csvFileName: 'DebitNoteRegisterReport'
      };
      this.nav.setData(Details);
      // Push the module counter data to the server
      this.MCountrService.PushModuleCounter();
      const url = `/#/Reports/generic-report-view`;
      window.open(url, '_blank')
    }
    catch (error) {
      this.snackBarUtilityService.ShowCommonSwal("error", error.message);
    }
  }
}

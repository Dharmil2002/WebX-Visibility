import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import moment from 'moment';
import { finYear, financialYear, timeString } from 'src/app/Utility/date/date-utils';
import { Subject, firstValueFrom, take, takeUntil } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { CreditNoteRegisterReportService } from 'src/app/Utility/module/reports/credit-note-register-report-service';
import { GeneralLedgerReportService } from 'src/app/Utility/module/reports/general-ledger-report.service';
import { CreditNoteRegister } from 'src/assets/FormControls/Reports/CreditNote-Register/creditnote-register';
import Swal from "sweetalert2";
import { SnackBarUtilityService } from "src/app/Utility/SnackBarUtility.service";
import { NavDataService } from 'src/app/core/service/navdata.service';

@Component({
  selector: 'app-credit-note-register-report',
  templateUrl: './credit-note-register-report.component.html'
  
})
export class CreditNoteRegisterReportComponent implements OnInit {
  CreditNoteRegisterFormControls: CreditNoteRegister;
  jsonControlArray: any;
  branchName: any;
  branchStatus: any;
  CustCd: any;
  custNameDet: any;
  customerDetailList: any;
  breadScrums = [
    {
      title: "CreditNote Register Report",
      items: ["Report"],
      active: "CreditNote Register Report",
    },
  ];
  CreditNoteReportRegisterForm: UntypedFormGroup;
  jsonCreditNoteArray: any;
  ReportingBranches: string[] = [];
  formTitle = "Credit Note Register Report"
  csvFileName: string; // name of the csv file, when data is downloaded
  source: any[] = []; // Array to hold data
  loading = true // Loading indicator
  LoadTable=false;
  showOverlay:boolean = false;
  //#region Table
  columns = [];
  //#endregion

  paging: any ;
  sorting: any ;
  searching: any ;
  columnMenu: any ;
  theme: "MATERIAL";
  EndDate: any = moment().format("DD MMM YY");
  now = moment().endOf('day').toDate();
  lastweek = moment().add(-10, 'days').startOf('day').toDate();
  protected _onDestroy = new Subject<void>();
  constructor(
    public snackBarUtilityService: SnackBarUtilityService,
    private fb:UntypedFormBuilder,
    private filter: FilterUtils,
    private generalLedgerReportService: GeneralLedgerReportService,
    private locationService: LocationService,
    private storage: StorageService,
    private masterServices: MasterService,
    private CnoteDetails: CreditNoteRegisterReportService,
    private nav: NavDataService
  ) { }
  ngOnInit(): void {
    this.initializeFormControl()

    const now = moment().endOf('day').toDate();
    const lastweek = moment().add(-10, 'days').startOf('day').toDate()

    // Set the 'start' and 'end' controls in the form to the last week and current date, respectively
    this.CreditNoteReportRegisterForm.controls["start"].setValue(lastweek);
    this.CreditNoteReportRegisterForm.controls["end"].setValue(now);
    this.getDropDownList();
  }
  initializeFormControl() {
    const controls = new CreditNoteRegister();
    this.jsonControlArray = controls.creditnoteRegisterControlArray;
    this.branchName = this.jsonControlArray.find(
      (data) => data.name === "Branch"
    )?.name;
    this.branchStatus = this.jsonControlArray.find(
      (data) => data.name === "Branch"
    )?.additionalData.showNameAndValue;
    this.CustCd = this.jsonControlArray.find(
      (data) => data.name === "custnmcd"
    )?.name;
    // Build the form using formGroupBuilder
    this.CreditNoteReportRegisterForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
  }
  async getDropDownList() {
    const branchList = await this.locationService.locationFromApi();
    this.filter.Filter(
      this.jsonControlArray,
      this.CreditNoteReportRegisterForm,
      branchList,
      this.branchName,
      this.branchStatus
    );
    const loginBranch = branchList.find(x => x.value === this.storage.branch);
    this.CreditNoteReportRegisterForm.controls["Branch"].setValue(loginBranch);
    this.CreditNoteReportRegisterForm.get('Individual').setValue("Y");
    const custNameReq = {
      companyCode: this.storage.companyCode,
      filter: {},
      collectionName: "customer_detail"
    };
    const financialYearlist = this.generalLedgerReportService.getFinancialYear();
    this.filter.Filter(
      this.jsonControlArray,
      this.CreditNoteReportRegisterForm,
      financialYearlist,
      "Fyear",
      false
    );
    const selectedFinancialYear = financialYearlist.find(x => x.value === financialYear);
    this.CreditNoteReportRegisterForm.controls["Fyear"].setValue(selectedFinancialYear);
    const custNameResPromise = this.masterServices.masterMongoPost("generic/get", custNameReq);
    const custNameRes = await firstValueFrom(custNameResPromise);
    const custNameData = custNameRes?.data || [];
    const custNameDet = custNameData.map(({ customerName, customerCode }) => ({
      name: customerName.toString(),
      value: customerCode.toString(),
    }));
    this.customerDetailList = custNameDet;
    this.custNameDet = custNameDet;
    this.filter.Filter(this.jsonControlArray, this.CreditNoteReportRegisterForm, custNameDet, this.CustCd,false);

  }

    functionCallHandler($event) {
      let functionName = $event.functionName; // name of the function , we have to call
      // function of this name may not exists, hence try..catch
      try {
        this[functionName]($event);
      } catch (error) {
        // we have to handle , if function not exists.
        console.log("failed");
      }
    }
    validateDateRange(event): void {

      // Get the values from the form controls
      const startControlValue = this.CreditNoteReportRegisterForm.controls.start.value;
      const endControlValue = this.CreditNoteReportRegisterForm.controls.end.value;
      const selectedFinancialYear = this.CreditNoteReportRegisterForm.controls.Fyear.value;
  
      // Check if both start and end dates are selected
      if (!startControlValue || !endControlValue) {
        // Exit the function if either start or end date is not selected
        return;
      }
  
      // Convert the control values to Date objects
      const startDate = new Date(startControlValue);
      const endDate = new Date(endControlValue);
  
      // Determine the financial year based on the start date
      const startYear = startDate.getFullYear(); // Extract the year from the start date
  
      const financialYearStart = startDate.getMonth() < 3 ? startYear - 1 : startYear;
  
      const calculatedFnYr = `${financialYearStart.toString().slice(-2)}${(financialYearStart + 1).toString().slice(-2)}`;
  
      // Check if the selected financial year matches the calculated financial year
      if (selectedFinancialYear.value === calculatedFnYr) {
  
        // Define the financial year date range
        // Parse the selected financial year to get the start year (e.g., '2324' -> 2023)
        const year = parseInt(selectedFinancialYear.value.slice(0, 2), 10) + 2000; // Get the full year from the financial year string
        const minDate = new Date(year, 3, 1);  // April 1 of the calculated year
        const maxDate = new Date(year + 1, 2, 31); // March 31 of the next year
  
        // Check if both dates fall within the specified financial year range
        if (startDate >= minDate && startDate <= maxDate && endDate >= minDate && endDate <= maxDate) {
          // Both dates are within the valid range
          console.log('Both dates are within the valid range.');
        } else {
          // Show a warning if the date range is not within the financial year
          this.dateRangeWarning(selectedFinancialYear);
          this.clearDateControls();
        }
      }
      else {
        // Show a warning if the date range is not within the financial year
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
      this.CreditNoteReportRegisterForm.controls["start"].setValue("");
      this.CreditNoteReportRegisterForm.controls["end"].setValue("");
    }
     //#region save
  async save() {
    this.loading = true;
    try {
      this.ReportingBranches = [];
      if (this.CreditNoteReportRegisterForm.value.Individual == "N") {
        this.ReportingBranches = await this.generalLedgerReportService.GetReportingLocationsList(this.CreditNoteReportRegisterForm.value.Branch.value);
        this.ReportingBranches.push(this.CreditNoteReportRegisterForm.value.Branch?.value||"");
      } else {
        this.ReportingBranches.push(this.CreditNoteReportRegisterForm.value.Branch?.value||"");
      }
      const startDate = new Date(this.CreditNoteReportRegisterForm.controls.start.value);
      const endDate = new Date(this.CreditNoteReportRegisterForm.controls.end.value);
      const startValue = moment(startDate).startOf('day').toDate();
      const endValue = moment(endDate).endOf('day').toDate();
      const docNo = this.CreditNoteReportRegisterForm.value.DocNo;
      const DocNos = docNo ? docNo.includes(',') ? docNo.split(',') : [docNo] : [];
      const voucherNo = this.CreditNoteReportRegisterForm.value.VoucherNo;
      const VoucherNos = voucherNo ? voucherNo.includes(',') ? voucherNo.split(',') : [voucherNo] : [];
       const status = this.CreditNoteReportRegisterForm.value.DocStatus;
      const cust = this.CreditNoteReportRegisterForm.value.custnmcd;
      const custData = Array.isArray(this.CreditNoteReportRegisterForm.value.partynmHandler)
      ? this.CreditNoteReportRegisterForm.value.partynmHandler.map(x => { return { cCD: x.value, cNM: x.name }; })
      : [];
      const branch = this.ReportingBranches;
      const individual = this.CreditNoteReportRegisterForm.value.Individual;
      const reqBody = {
        startValue, endValue, branch 
         ,DocNos, status, custData,individual,VoucherNos
      }
      const result = await this.CnoteDetails.getcustomerGstRegisterReportDetail(reqBody);
      
      this.columns = result.grid.columns;
      this.sorting = result.grid.sorting;
      this.searching = result.grid.searching;
      this.paging = result.grid.paging;
      this.showOverlay = true;
      this.source = result.data;
      this.LoadTable = true;

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
      const stateData = {
        data: result,
        formTitle: 'CreditNote Register Report',
        csvFileName: 'CreditNoteRegisterReport'
      };
      // Convert the state data to a JSON string and encode it
      const stateString = encodeURIComponent(JSON.stringify(stateData));
      this.nav.setData(stateData);
      // Create the new URL with the state data as a query parameter
      const url = `/#/Reports/generic-report-view`;
      // Open the URL in a new tab
      window.open(url, '_blank');
    } catch (error) {
      this.snackBarUtilityService.ShowCommonSwal("error", error.message);
    }
  }
    //#region to reset date range
    resetDateRange() {
      const selectedFinancialYear = this.CreditNoteReportRegisterForm.controls.Fyear.value;
      const year = parseInt(selectedFinancialYear.value.slice(0, 2), 10) + 2000; // Get the full year from the financial year string
      const minDate = new Date(year, 3, 1);  // April 1 of the calculated year
      let maxDate = new Date(year + 1, 2, 31); // March 31 of the next year
  
      if (maxDate >= this.now) {
        maxDate = this.now;
      }
  
      this.CreditNoteReportRegisterForm.controls["start"].setValue(minDate);
      this.CreditNoteReportRegisterForm.controls["end"].setValue(maxDate);
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
          this.CreditNoteReportRegisterForm.controls[autocompleteSupport].patchValue(
            isSelectAll ? val : []
          );
        });
    }
}

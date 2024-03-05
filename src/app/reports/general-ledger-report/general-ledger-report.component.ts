import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import moment from 'moment';
import { Subject, take, takeUntil } from 'rxjs';
import { PayBasisdetailFromApi } from 'src/app/Masters/Customer Contract/CustomerContractAPIUtitlity';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { financialYear, timeString } from 'src/app/Utility/date/date-utils';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { StateService } from 'src/app/Utility/module/masters/state/state.service';
import { GeneralLedgerReportService } from 'src/app/Utility/module/reports/general-ledger-report.service';
import { exportAsExcelFile } from 'src/app/Utility/module/reports/vendor-gst-invoice';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { GeneralLedgerReport } from 'src/assets/FormControls/Reports/General-Ledger-Report/general-ledger-report';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-general-ledger-report',
  templateUrl: './general-ledger-report.component.html'
})
export class GeneralLedgerReportComponent implements OnInit {
  generalLedgerFormControls: GeneralLedgerReport;
  jsonGeneralLedgerArray: any;
  breadScrums = [
    {
      title: "General Ledger Report ",
      items: ["Report"],
      active: "General Ledger Report ",
    },
  ];
  generalLedgerForm: UntypedFormGroup;
  stateName: any;
  stateStatus: any;
  branchName: any;
  branchStatus: any;
  categoryName: any;
  categoryStatus: any;
  accountName: any;
  accountStatus: any;
  financYrName: any;
  financYrStatus: any;
  CSVHeader = {
    "AccountCode": "AccountCode",
    "AccountName": "AccountName",
    "Category": "Category",
    "Vendor Manual Bill Number": "Vendor Manual Bill Number",
    "Vendor Bill Date": "Vendor Bill Date",
    "Voucher No": "Voucher No",
    "Date": "Date",
    "Particular": "Particular",
    "Debit": "Debit",
    "Credit": "Credit",
    "PartyCode": "PartyCode",
    "PartyName": "PartyName",
    "Document No": "Document No",
    "Narration": "Narration",
    "Cheque No": "Cheque No",
    "LocName": "LocName",
    "StateFilter": "StateFilter",
  }
  //ReportingBranches: [];
  ReportingBranches: string[] = [];
  protected _onDestroy = new Subject<void>();

  constructor(private fb: UntypedFormBuilder,
    private stateService: StateService,
    private filter: FilterUtils,
    private locationService: LocationService,
    private masterService: MasterService,
    private storage: StorageService,
    public snackBarUtilityService: SnackBarUtilityService,
    private generalLedgerReportService: GeneralLedgerReportService,
  ) { }

  ngOnInit(): void {
    this.initializeFormControl()

    const now = moment().endOf('day').toDate();
    const lastweek = moment().add(-10, 'days').startOf('day').toDate()

    // Set the 'start' and 'end' controls in the form to the last week and current date, respectively
    this.generalLedgerForm.controls["start"].setValue(lastweek);
    this.generalLedgerForm.controls["end"].setValue(now);
    this.getDropdownData();
  }
  //#region to initialize form control
  initializeFormControl() {

    // Retrieve and set details for the 'state' control
    this.stateName = this.getControlDetails("state")?.name;
    this.stateStatus = this.getControlDetails("state")?.status;

    // Retrieve and set details for the 'branch' control
    this.branchName = this.getControlDetails("branch")?.name;
    this.branchStatus = this.getControlDetails("branch")?.status;

    // Retrieve and set details for the 'category' control
    this.categoryName = this.getControlDetails("category")?.name;
    this.categoryStatus = this.getControlDetails("category")?.status;

    // Retrieve and set details for the 'aCCONTCD' control
    this.accountName = this.getControlDetails("aCCONTCD")?.name;
    this.accountStatus = this.getControlDetails("aCCONTCD")?.status;

    // Retrieve and set details for the 'Fyear' control
    this.financYrName = this.getControlDetails("Fyear")?.name;
    this.financYrStatus = this.getControlDetails("Fyear")?.status;

    // Build the form using formGroupBuilder
    this.generalLedgerForm = formGroupBuilder(this.fb, [this.jsonGeneralLedgerArray]);
  }
  // Function to retrieve control details by name
  getControlDetails = (name: string) => {

    this.generalLedgerFormControls = new GeneralLedgerReport();
    this.jsonGeneralLedgerArray = this.generalLedgerFormControls.generalLedgerControlArray;

    // Find the control in jsonGeneralLedgerArray
    const control = this.jsonGeneralLedgerArray.find(data => data.name === name);

    // Return an object with control name and status (if found)
    return {
      name: control?.name,
      status: control?.additionalData.showNameAndValue,
    };
  };
  //#endregion
  //#region to get dropdown data
  async getDropdownData() {
    try {
      // Fetch data from various services
      const financialYearlist = this.generalLedgerReportService.getFinancialYear();
      const statelist = await this.stateService.getState();
      const branchList = await this.locationService.locationFromApi();
      const categorylist = await PayBasisdetailFromApi(this.masterService, "MCT");
      const accountList = await this.generalLedgerReportService.getAccountDetail();

      // Apply filters for each dropdown
      this.filterDropdown(this.financYrName, this.financYrStatus, financialYearlist);
      this.filterDropdown(this.stateName, this.stateStatus, statelist);
      this.filterDropdown(this.branchName, this.branchStatus, branchList);
      this.filterDropdown(this.categoryName, this.categoryStatus, categorylist);
      this.filterDropdown(this.accountName, this.accountStatus, accountList);


      // Set default values for 'branch' and 'Fyear' controls
      const loginBranch = branchList.find(x => x.name === this.storage.branch);
      const selectedFinancialYear = financialYearlist.find(x => x.value === financialYear);

      this.generalLedgerForm.controls["branch"].setValue(loginBranch);
      this.generalLedgerForm.controls["Fyear"].setValue(selectedFinancialYear);
      this.generalLedgerForm.get('Individual').setValue("Y");

    } catch (error) {
      console.error('An error occurred in getDropdownData:', error.message || error);
    }
  }

  // Function to filter and update dropdown data in the form
  filterDropdown(name: string, status: any, dataList: any[]) {
    this.filter.Filter(this.jsonGeneralLedgerArray, this.generalLedgerForm, dataList, name, status);
  }
  //#endregion
  //#region to call function handler
  functionCallHandler($event) {
    let functionName = $event.functionName;     // name of the function , we have to call
    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  //#endregion
  //#region to export data in csv file
  async save() {
    this.snackBarUtilityService.commonToast(async () => {
      try {
        this.ReportingBranches = [];
        if (this.generalLedgerForm.value.Individual == "N") {
          this.ReportingBranches = await this.generalLedgerReportService.GetReportingLocationsList(this.generalLedgerForm.value.branch.name);
          this.ReportingBranches.push(this.generalLedgerForm.value.branch.name);
        } else {
          this.ReportingBranches.push(this.generalLedgerForm.value.branch.name);
        }

        const startDate = new Date(this.generalLedgerForm.controls.start.value);
        const endDate = new Date(this.generalLedgerForm.controls.end.value);

        const startValue = moment(startDate).startOf('day').toDate();
        const endValue = moment(endDate).endOf('day').toDate();

        const reportTyp = this.generalLedgerForm.value.reportTyp;
        const state = Array.isArray(this.generalLedgerForm.value.stateHandler)
          ? this.generalLedgerForm.value.stateHandler.map(x => x.name)
          : [];
        const fnYear = this.generalLedgerForm.value.Fyear.value;
        const category = this.generalLedgerForm.value.category.name;
        const branch = this.ReportingBranches;
        const individual = this.generalLedgerForm.value.Individual;
        const accountCode = Array.isArray(this.generalLedgerForm.value.accountHandler)
          ? this.generalLedgerForm.value.accountHandler.map(x => x.value)
          : [];
        const reqBody = {
          startValue, endValue, reportTyp, state, fnYear: parseInt(fnYear),
          category, branch, individual, accountCode
        }
        const data = await this.generalLedgerReportService.getGeneralLedger(reqBody)
        if (data.length === 0) {
          Swal.hideLoading();
          setTimeout(() => {
            Swal.close();
          }, 1000);

          if (data) {
            Swal.fire({
              icon: "error",
              title: "No Records Found",
              text: "Cannot Download CSV",
              showConfirmButton: true,
            });
          }
          return;
        }
        Swal.hideLoading();
        setTimeout(() => {
          Swal.close();
        }, 1000);
        // Export the record to Excel
        exportAsExcelFile(data, `General_Ledger_Report-${timeString}`, this.CSVHeader);

      } catch (error) {
        this.snackBarUtilityService.ShowCommonSwal(
          "error",
          error.message
        );
      }
    }, "General Leadger Report Generating Please Wait..!");
  }
  //#endregion
  //#region to call toggle function
  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;
    const index = this.jsonGeneralLedgerArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonGeneralLedgerArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.generalLedgerForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }
  //#endregion
}
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import moment from 'moment';
import { Subject, take, takeUntil } from 'rxjs';
import { GetGeneralMasterData } from 'src/app/Masters/Customer Contract/CustomerContractAPIUtitlity';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { finYear, financialYear, timeString } from 'src/app/Utility/date/date-utils';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { ExportService } from 'src/app/Utility/module/export.service';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { GeneralLedgerReportService } from 'src/app/Utility/module/reports/general-ledger-report.service';
import { voucherRegService } from 'src/app/Utility/module/reports/voucherRegister.service';
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
    "Voucher No": "Voucher No",
    "Date": "Date",
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
  ReportingBranches: string[] = [];
  protected _onDestroy = new Subject<void>();

  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  linkArray = [];

  staticField: string[] = ["AccountCode",
    "AccountName",
    "Category",
    "Date",
    "Debit",
    "Credit",
    "PartyCode",
    "PartyName",
    "Document No",
    "Narration",
    "Cheque No",
    "LocName",
    "StateFilter"]

  ledgerHeader: any = {
    "AccountCode": {
      Title: "AccountCode",
      class: "matcolumnleft",
      datatype: "string",
      sticky: true
    },
    "AccountName": {
      Title: "AccountName",
      class: "matcolumnleft",
      datatype: "string",
      sticky: true
    },
    "Category": {
      Title: "Category",
      class: "matcolumnleft",
      datatype: "string",
      sticky: true
    },
    "Voucher No": {
      Title: "Voucher No",
      class: "matcolumnleft",
      type: "Link",
      functionName: "getVoucherDetails",
      sticky: true
    },
    "Date": {
      Title: "Date",
      class: "matcolumncenter",
      datatype: "date"
    },
    "Debit": {
      Title: "Debit",
      class: "matcolumnright",
      datatype: "number"
    },
    "Credit": {
      Title: "Credit",
      class: "matcolumnright",
      datatype: "number"
    },
    "PartyCode": {
      Title: "PartyCode",
      class: "matcolumnleft",
      datatype: "string",
    },
    "PartyName": {
      Title: "PartyName",
      class: "matcolumnleft ",
      datatype: "string",
    },
    "Document No": {
      Title: "Document No",
      class: "matcolumnleft",
      datatype: "string",
    },
    "Narration": {
      Title: "Narration",
      class: "matcolumnleft",
      datatype: "string",
    },
    "Cheque No": {
      Title: "Cheque No",
      class: "matcolumnleft",
      datatype: "string",
    },
    "LocName": {
      Title: "LocName",
      class: "matcolumnleft",
      datatype: "string",
    },
    "StateFilter": {
      Title: "StateFilter",
      class: "matcolumnleft",
      datatype: "string",
    },
  }
  tableLoad: boolean = false;
  drillDownData: any[];

  constructor(private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private locationService: LocationService,
    private masterService: MasterService,
    private storage: StorageService,
    public snackBarUtilityService: SnackBarUtilityService,
    private generalLedgerReportService: GeneralLedgerReportService,
    private exportService: ExportService,
    private voucherRegService: voucherRegService,
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
      const branchList = await this.locationService.locationFromApi();
      const categorylist = await GetGeneralMasterData(this.masterService, "MCT");
      const accountList = await this.generalLedgerReportService.getAccountDetail();

      // Apply filters for each dropdown
      this.filterDropdown(this.financYrName, this.financYrStatus, financialYearlist);
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
        const reqBody = await this.getRequestData();
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
        this.exportService.exportAsCSV(data, `General_Ledger_Report-${timeString}`, this.CSVHeader);

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
  validateDateRange() {
     const startControl = this.generalLedgerForm.controls.start.value;
    const endControl = this.generalLedgerForm.controls.end.value;
    const fnYearControl = this.generalLedgerForm.value.Fyear.value;

    // if (!startControl || !endControl || !fnYearControl) {
    //   console.error('Form controls are not properly initialized.');
    //   return;
    // }



    console.log(`startDate = ${startControl}, endDate = ${endControl}`);
    console.log(`fnYear = ${fnYearControl}`);

    if (fnYearControl == 2324) {
      const startElement = this.jsonGeneralLedgerArray.find(x => x.name === 'start');
      const endElement = this.jsonGeneralLedgerArray.find(x => x.name === 'end');

      if (startElement) {
        startElement.additionalData.minDate = new Date('2023-04-01');
      } else {
        console.error('Start element not found in jsonGeneralLedgerArray');
      }

      if (endElement) {
        endElement.additionalData.maxDate = new Date('2024-03-31');
      } else {
        console.error('End element not found in jsonGeneralLedgerArray');
      }

      console.log('fnYear is 2324');
    }
  }
  //#region to set party name according to received from data
  async reportSubTypeChanged() {
    const reportSubType = this.generalLedgerForm.value.reportSubType;

    this.generalLedgerForm.controls.subLedger.setValue("");
    this.generalLedgerForm.controls.subLedgerHandler.setValue("");

    let responseFromAPI = [];
    switch (reportSubType) {
      case 'Location':
        responseFromAPI = await this.locationService.getLocations(
          { companyCode: this.storage.companyCode, activeFlag: true },
          { _id: 0, locCode: 1, locName: 1 })
        responseFromAPI = responseFromAPI.map(x => ({
          value: x.locCode,
          name: x.locName
        }));
        this.filter.Filter(
          this.jsonGeneralLedgerArray,
          this.generalLedgerForm,
          responseFromAPI,
          "subLedger",
          true
        );
        break;
      case 'Customer':
        responseFromAPI = await this.generalLedgerReportService.customersData()
        this.filter.Filter(
          this.jsonGeneralLedgerArray,
          this.generalLedgerForm,
          responseFromAPI,
          "subLedger",
          true
        );
        break;
      case 'Vendor':
        responseFromAPI = await this.generalLedgerReportService.vendorsData();
        this.filter.Filter(
          this.jsonGeneralLedgerArray,
          this.generalLedgerForm,
          responseFromAPI,
          "subLedger",
          true
        );
        break;
      case 'Employee':
        responseFromAPI = await this.generalLedgerReportService.usersData()
        this.filter.Filter(
          this.jsonGeneralLedgerArray,
          this.generalLedgerForm,
          responseFromAPI,
          "subLedger",
          true
        );
        break;
      case 'Driver':
        responseFromAPI = await this.generalLedgerReportService.driversData()
        this.filter.Filter(
          this.jsonGeneralLedgerArray,
          this.generalLedgerForm,
          responseFromAPI,
          "subLedger",
          true
        );
        break;
      case 'Vehicle':
        responseFromAPI = await this.generalLedgerReportService.vehicleData()
        this.filter.Filter(
          this.jsonGeneralLedgerArray,
          this.generalLedgerForm,
          responseFromAPI,
          "subLedger",
          true
        );
        break;
      default:

    }
  }
  //#endregion
  //#region to get ledger data to show in table 
  async getDrillDown() {
    this.snackBarUtilityService.commonToast(async () => {
      try {
        this.tableLoad = false;
        const reqBody = await this.getRequestData();
        this.drillDownData = await this.generalLedgerReportService.getGeneralLedger(reqBody)
        console.log(this.drillDownData)
        if (this.drillDownData.length === 0) {
          Swal.hideLoading();
          setTimeout(() => {
            Swal.close();
          }, 1000);
          Swal.fire({
            icon: "error",
            title: "No Records Found",
            // text: "Cannot Download CSV",
            showConfirmButton: true,
          });
          return
        } else {
          this.tableLoad = true;
          Swal.hideLoading();
          setTimeout(() => {
            Swal.close();
          }, 1000);
        }
      } catch (error) {
        this.snackBarUtilityService.ShowCommonSwal(
          "error",
          error.message
        );
      }
    }, "General Leadger Report Generating Please Wait..!");
  }
  //#endregion
  //#region to get request data
  async getRequestData() {
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

    const fnYear = this.generalLedgerForm.value.Fyear.value;
    const category = this.generalLedgerForm.value.category.name;
    const branch = this.ReportingBranches;
    const individual = this.generalLedgerForm.value.Individual;
    const accountCode = Array.isArray(this.generalLedgerForm.value.accountHandler)
      ? this.generalLedgerForm.value.accountHandler.map(x => x.value)
      : [];

    const partyName = Array.isArray(this.generalLedgerForm.value.subLedgerHandler)
      ? this.generalLedgerForm.value.subLedgerHandler.map(x => x.value)
      : [];
    const reqBody = {
      startValue, endValue, reportTyp, fnYear: parseInt(fnYear),
      category, branch, individual, accountCode, partyName
    }
    return reqBody
  }
  //#endregion
  //#region to get voucher details
  async getVoucherDetails(event) {
    const vNoArray = [event.value]
    const reqBody = { vNoArray }
    const data = await this.voucherRegService.getvoucherRegReportDetail(reqBody);
    const csv = data.map((x) => {
      x.DA = x.DA == 0 ? "0.00" : x.DA
      x.CA = x.CA == 0 ? "0.00" : x.CA
      x.vamount = x.vamount == 0 ? "0.00" : x.vamount
      return x
    })
    const voucherCSVHeader = {
      "vNO": "Voucher No",
      "vDt": "Voucher Date",
      "vTp": "Voucher Type",
      "accLoc": "Account Loc",
      "accCdDes": "Account Code : Description",
      "DA": "Debit Amt",
      "CA": "Credit Amt",
      "Narr": "Narration",
      "PT": "Party Type",
      "PCN": "Party Code - Name",
      "TT": "Transaction Type",
      "DocNo": "Document No",
      "CUNo": "Cheque/ UTR No",
      "CUDate": "Cheque/ UTR Date",
      "EB": "Entry By",
      "EDT": "Entry Date Time",
      "EL": "Entry Location",
      "vamount": "voucherAmt(₹)"
    }
    this.exportService.exportAsCSV(csv, `Voucher-Register_Report-${timeString}`, voucherCSVHeader);

  }
  //#endregion
}
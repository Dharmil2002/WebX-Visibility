import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import moment from 'moment';
import { Subject, takeUntil, take, firstValueFrom } from 'rxjs';
import { productdetailFromApi } from 'src/app/Masters/Customer Contract/CustomerContractAPIUtitlity';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { GeneralLedgerReportService } from 'src/app/Utility/module/reports/general-ledger-report.service';
import { ReportService } from 'src/app/Utility/module/reports/generic-report.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { NavDataService } from 'src/app/core/service/navdata.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { ToPayPaidReportControl } from 'src/assets/FormControls/Reports/To-Pay-Paid/to-pay-paid-but-not-collected-register-report-control';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-to-pay-paid-but-not-collected-register-report',
  templateUrl: './to-pay-paid-but-not-collected-register-report.component.html'
})
export class ToPayPaidButNotCollectedRegisterReportComponent implements OnInit {
  breadScrums = [
    {
      title: "To Pay/Paid But Not Collected Register Report",
      items: ["Home"],
      active: "To Pay/Paid But Not Collected Register Report",
    },
  ];
  jsonControlFormArray: any
  formTitle = "To Pay/Paid But Not Collected Register Data"
  csvFileName: string; // name of the csv file, when data is downloaded
  source: any[] = []; // Array to hold data
  loading = true // Loading indicator
  LoadTable = false;
  columns = []; // Array to hold columns
  paging: any;
  sorting: any;
  searching: any;
  columnMenu: any;
  theme: "MATERIAL"
  tableLoad: false;
  toPayPaidReportForm: UntypedFormGroup;
  protected _onDestroy = new Subject<void>();
  summaryData: any[];
  filterData: any;

  dynamicControls = {
    add: false,
    edit: false,
    csv: true,
  };
  summaryGroup: any[] = [];
  staticField: string[] = ["GCN", "serviceType", "dEST", "pAYTYP", "pAYTYPNM", "tOTL"]
  constructor(private fb: UntypedFormBuilder,
    private locationService: LocationService,
    private filter: FilterUtils,
    public snackBarUtilityService: SnackBarUtilityService,
    private storage: StorageService,
    private generalLedgerReportService: GeneralLedgerReportService,
    private reportService: ReportService,
    private masterService: MasterService,
    private nav: NavDataService) { }
  ngOnInit(): void {
    this.initFormControls();
    const now = new Date();
    const lastweek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 10
    );
    // Set the 'start' and 'end' controls in the form to the last week and current date, respectively
    this.toPayPaidReportForm.controls["start"].setValue(lastweek);
    this.toPayPaidReportForm.controls["end"].setValue(now);
    this.getDropDownList();
    this.csvFileName = `ToPay_Paid_But_Not_Collected_Register_Report-${moment().format("YYYYMMDD-HHmmss")}`;
  }
  //#region to initialize form controls
  initFormControls() {
    const formControls = new ToPayPaidReportControl();
    this.jsonControlFormArray = formControls.toPayPaidReportControlArray;
    this.toPayPaidReportForm = formGroupBuilder(this.fb, [this.jsonControlFormArray]);
  }
  //#endregion
  //#region to get dropdown data
  async getDropDownList() {
    const locationList = await this.locationService.getLocationList();
    const modeList = await productdetailFromApi(this.masterService);
    const loginBranch = locationList.find(x => x.value === this.storage.branch);

    this.toPayPaidReportForm.controls["location"].setValue(loginBranch);
    this.toPayPaidReportForm.get('Individual').setValue("Y");
    this.toPayPaidReportForm.get('DateType').setValue("Bookingdate");
    this.toPayPaidReportForm.get('Paybasis').setValue("P01");
    this.filter.Filter(this.jsonControlFormArray, this.toPayPaidReportForm, modeList, "Transitmode", true);
    this.filter.Filter(this.jsonControlFormArray, this.toPayPaidReportForm, locationList, "location", true);
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
  //#region to call toggle function
  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;
    const index = this.jsonControlFormArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonControlFormArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.toPayPaidReportForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }

  //#endregion
  //#region to get data to show in table
  async save() {
    // Display a toast message while the report is being generated
    this.snackBarUtilityService.commonToast(async () => {
      try {
        let ReportingBranches = [];
        // Check if the form is for individual or multiple locations
        if (this.toPayPaidReportForm.value.Individual == "N") {
          // If multiple, get the reporting locations list based on the selected location
          ReportingBranches = await this.generalLedgerReportService.GetReportingLocationsList(this.toPayPaidReportForm.value.location.value);
          // Add the selected location to the reporting branches list
          ReportingBranches.push(this.toPayPaidReportForm.value.location.value);
        } else {
          // If individual, just add the selected location
          ReportingBranches.push(this.toPayPaidReportForm.value.location.value);
        }

        // Convert start and end dates to Date objects
        const startDate = new Date(this.toPayPaidReportForm.controls.start.value);
        const endDate = new Date(this.toPayPaidReportForm.controls.end.value);
        const StatusAson = this.toPayPaidReportForm.controls.StatusAson.value ? new Date(this.toPayPaidReportForm.controls.StatusAson.value) : '';

        // Use moment.js to set the start date to the beginning of the day and the end date to the end of the day
        const startValue = moment(startDate).startOf('day').toDate();
        let endValue = moment(endDate).endOf('day').toDate();
        const statusAsOn = StatusAson ? moment(StatusAson).endOf('day').toDate() : '';
        endValue = statusAsOn ? statusAsOn : endValue;

        const modeList = Array.isArray(this.toPayPaidReportForm.value.modeHandler)
          ? this.toPayPaidReportForm.value.modeHandler.map(x => x.value)
          : [];

        const dateType = this.toPayPaidReportForm.value.DateType;
        const serviceType = this.toPayPaidReportForm.value.ServiceType;
        const payBasis = this.toPayPaidReportForm.value.Paybasis;
        const location = ReportingBranches;

        const requestbody = { startValue, endValue, location, modeList, dateType, serviceType, payBasis };

        const data = await this.getReportData(requestbody)
        console.log(data);
        // this.summaryData=data
        // if (data.data.length === 0) {
        //   this.LoadTable = false;
        //   this.loading = false;
        //   if (data) {
        //     Swal.fire({
        //       icon: "error",
        //       title: "No Records Found",
        //       text: "Cannot Download CSV",
        //       showConfirmButton: true,
        //     });
        //   }
        //   return;
        // }
        // Close the loading Swal after a short delay
        Swal.hideLoading();
        setTimeout(() => {
          Swal.close();
        }, 1000);
        this.loading = false;
      } catch (error) {
        // Show an error message if the try block fails
        this.snackBarUtilityService.ShowCommonSwal(
          "error",
          error.message
        );
      }
    }, "To Pay/Paid But Not Collected Register Report Generating Please Wait..!");
  }
  //#endregion
  //#region to download csv file
  async getReportData(data) {

    const matchQuery = {
      'D$and': [
        { dKTDT: { 'D$gte': data.startValue } }, // Start date condition
        { dKTDT: { 'D$lte': data.endValue } }, // End date condition  
        ...(data.location ? [{ 'dEST': { 'D$in': data.location } }] : []), // Location condition
        ...(data.modeList.length > 0 ? [{ 'tRNMOD': { 'D$in': data.modeList } }] : []), // Location condition
        ...(data.payBasis ? [{ 'pAYTYP': { 'D$in': data.payBasis } }] : []), // Location condition
      ]
    }
    const reqBodyFTL = {
      companyCode: this.storage.companyCode,
      collectionName: 'dockets',
      filters: [
        { D$match: matchQuery },
        {
          "D$group": {
            "_id": {
              "pAYTYP": "$pAYTYP",
              "pAYTYPNM": "$pAYTYPNM",
              "dEST": "$dEST"
            },
            "GCN": {
              "D$sum": 1
            },
            "tTLAMT": {
              "D$sum": "$tOTAMT"
            },
          }
        },
        {
          "D$project": {
            "_id": 0,
            "pAYTYP": "$_id.pAYTYP",
            "pAYTYPNM": "$_id.pAYTYPNM",
            "dEST": "$_id.dEST",
            "GCN": 1,
            "tOTL": "$tTLAMT",
            "serviceType": "FTL"
          }
        }
      ]
    }
    const resFTL = await firstValueFrom(this.masterService.masterMongoPost('generic/query', reqBodyFTL));

    const reqBodyLTL = {
      companyCode: this.storage.companyCode,
      collectionName: 'dockets_ltl',
      filters: [
        { D$match: matchQuery },
        {
          "D$group": {
            "_id": {
              "pAYTYP": "$pAYTYP",
              "pAYTYPNM": "$pAYTYPNM",
              "dEST": "$dEST"
            },
            "GCN": {
              "D$sum": 1
            },
            "tTLAMT": {
              "D$sum": "$tOTAMT"
            },
          }
        },
        {
          "D$project": {
            "_id": 0,
            "pAYTYP": "$_id.pAYTYP",
            "pAYTYPNM": "$_id.pAYTYPNM",
            "dEST": "$_id.dEST",
            "GCN": 1,
            "tOTL": "$tTLAMT",
            "serviceType": "LTL"
          }
        }
      ]
    }
    const resLTL = await firstValueFrom(this.masterService.masterMongoPost('generic/query', reqBodyLTL));

    const res = [...resFTL.data, ...resLTL.data];
    console.log(res);
    return res;
  }

  //#endregion
}

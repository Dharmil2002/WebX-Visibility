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
import { ConvertToNumber } from 'src/app/Utility/commonFunction/common';
import _ from 'lodash';


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
  columns = []; // Array to hold columns
  paging: any;
  sorting: any;
  searching: any;
  columnMenu: any;
  theme: "MATERIAL"
  tableLoad: boolean = false;
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
  summaryHeader: any;
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
    this.toPayPaidReportForm.get('Paybasis').setValue("Both");
    this.toPayPaidReportForm.get('ServiceType').setValue("Both");
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
        this.tableLoad = false;
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
        const service = this.toPayPaidReportForm.value.ServiceType;
        let payBasis = this.toPayPaidReportForm.value.Paybasis;
        payBasis === 'Both' ? payBasis = ["P01", "P03"] : payBasis;
        const location = ReportingBranches;

        this.filterData = { startValue, endValue, location, modeList, dateType, service, payBasis };

        const data = await this.getReportData(this.filterData);
        console.log(data);

        if (data.length === 0) {
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
        const pivotData = await this.pivotData({ data: data });
        console.log(pivotData);

        this.staticField = pivotData.staticFields;
        this.summaryHeader = pivotData.config.display;
        this.summaryData = pivotData.data;
        this.summaryGroup = pivotData.columnGroup;
        this.tableLoad = true;

        // Close the loading Swal after a short delay
        Swal.hideLoading();
        setTimeout(() => {
          Swal.close();
        }, 1000);

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
  //#region prepare query to get data
  async getReportData(data) {
    try {
      const { startValue, endValue, location, modeList, payBasis, service } = data;
      const { companyCode } = this.storage;

      // Create the match query based on provided filters
      const matchQuery = {
        'D$and': [
          { dKTDT: { 'D$gte': startValue } }, // Start date condition
          { dKTDT: { 'D$lte': endValue } }, // End date condition
          ...(location ? [{ 'dEST': { 'D$in': location } }] : []), // Location condition
          ...(modeList.length > 0 ? [{ 'tRNMOD': { 'D$in': modeList } }] : []), // Mode list condition
          ...(payBasis ? [{ 'pAYTYP': { 'D$in': payBasis } }] : []), // Pay basis condition
        ]
      };

      // Function to create request body for MongoDB query
      const createRequestBody = (collectionName, serviceType) => ({
        companyCode,
        collectionName,
        filters: [
          { D$match: matchQuery }, // Apply match query
          {
            "D$group": {
              "_id": {
                "pAYTYP": "$pAYTYP",
                "pAYTYPNM": "$pAYTYPNM",
                "dEST": "$dEST"
              },
              "GCN": { "D$sum": 1 }, // Sum of GCN
              "tTLAMT": { "D$sum": "$tOTAMT" } // Sum of total amount
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
              "serviceType": serviceType // Add service type to each document
            }
          }
        ]
      });

      // Define the collections to fetch data from based on the service type
      let collections = [];
      if (service === 'FTL') {
        collections.push({ name: 'dockets', serviceType: 'FTL' });
      } else if (service === 'LTL') {
        collections.push({ name: 'dockets_ltl', serviceType: 'LTL' });
      } else {
        collections = [
          { name: 'dockets', serviceType: 'FTL' },
          { name: 'dockets_ltl', serviceType: 'LTL' }
        ];
      }

      // Fetch data from all collections concurrently
      const responses = await Promise.all(collections.map(async ({ name, serviceType }) => {
        const requestBody = createRequestBody(name, serviceType);
        const response = await firstValueFrom(this.masterService.masterMongoPost('generic/query', requestBody));
        return response.data;
      }));

      // Flatten the response array to get a single array of results
      const res = responses.flat();

      return res;
    } catch (error) {
      console.error("Error fetching report data:", error);
      throw error; // Re-throw the error to be handled by the calling function if needed
    }
  }
  //#endregion
  //#region to format data for pivot table
  async pivotData({ data }) {
    const fields = [
      { "caption": "GCN", "field": "GCN", "decimal": 0, "datafield": "GCN" },
      { "caption": "Amount", "field": "Amount", "decimal": 2, "datafield": "tOTL" }
    ];

    const allStockTypes = _(data)
      .map(item => ({
        pAYTYPNM: item.pAYTYPNM.replace(' Stock', '').replace(/ /g, '_'),
        pAYTYP: item.pAYTYP
      }))
      .uniqBy('pAYTYPNM')
      .sortBy('pAYTYP')
      .value();

    const columnGroup = [{
      Name: "LocationGroup",
      Title: "",
      class: "matcolumncenter",
      ColSpan: 2,
      sticky: true
    }];

    const displayJson = {
      "LocationCode": {
        Title: "Branch",
        class: "matcolumnleft",
        Style: "min-width: 100px",
        datatype: "string",
        sticky: true
      },
      "ServiceType": {
        Title: "Service Type",
        class: "matcolumnleft",
        Style: "min-width: 100Px",
        sticky: true,
        datatype: "string"
      }
    };

    const initializeAggregates = (stockTypes = null, isTotal = false) => {
      if (stockTypes) {
        return stockTypes.reduce((acc, type) => {
          fields.forEach(f => { acc[type.pAYTYPNM + '_' + f.field] = 0; });
          return acc;
        }, {});
      } else if (isTotal) {
        const acc = {};
        fields.map(f => { acc['Total_' + f.field] = 0; });
        return acc;
      }
    };

    const pivotData = _.chain(data)
      .groupBy(item => item.dEST + '|' + item.serviceType)
      .map((items, key) => {
        const [locKey, serviceType] = key.split('|');
        const aggregates = initializeAggregates(allStockTypes);
        let rowTotals = initializeAggregates(null, true);

        _.forEach(items, item => {
          const typeKey = item.pAYTYPNM.replace(' Stock', '').replace(/ /g, '_');

          fields.forEach(f => {
            aggregates[typeKey + '_' + f.field] += ConvertToNumber(item[f.datafield] ?? 0, f.decimal);
          });

          fields.forEach(f => {
            rowTotals['Total_' + f.field] += ConvertToNumber(item[f.datafield] ?? 0, f.decimal);
          });
        });

        return {
          LocationCode: locKey,
          ServiceType: serviceType,
          ...aggregates,
          ...rowTotals
        };
      })
      .value();

    allStockTypes.push({ pAYTYPNM: 'Total', pAYTYP: 0 });

    allStockTypes.map(type => {
      columnGroup.push({
        Name: `${type.pAYTYPNM}-Group`,
        Title: type.pAYTYPNM.replace(/_/g, ' '),
        class: "matcolumncenter",
        ColSpan: 2,
        sticky: true
      });

      fields.map(f => {
        displayJson[`${type.pAYTYPNM}_${f.field}`] = {
          Title: `${f.caption}`,
          class: "matcolumnright",
          Style: "min-width: 100px",
          datatype: "number",
          decimalPlaces: f.decimal,
          columnData: type
        };

        if (f.field == "GCN") {
          displayJson[`${type.pAYTYPNM}_${f.field}`]["type"] = "Link";
          displayJson[`${type.pAYTYPNM}_${f.field}`]["functionName"] = "downloadcsv";
        }
      });
    });

    const columns = initializeAggregates(allStockTypes);
    _.sortBy(pivotData, ['Location']);

    const grandTotal = {
      LocationCode: "Grand Total",
      ServiceType: "",
      PAID_GCN: 0,
      PAID_Amount: 0,
      TO_PAY_GCN: 0,
      TO_PAY_Amount: 0,
      Total_GCN: 0,
      Total_Amount: 0
    };

    const groupedData = _.chain(pivotData)
      .groupBy('LocationCode')
      .map((items, key) => {
        const total = items.reduce((acc, item) => {
          acc.PAID_GCN += item.PAID_GCN || 0;
          acc.PAID_Amount += item.PAID_Amount || 0;
          acc.TO_PAY_GCN += item.TO_PAY_GCN || 0;
          acc.TO_PAY_Amount += item.TO_PAY_Amount || 0;
          acc.Total_GCN += item.Total_GCN || 0;
          acc.Total_Amount += item.Total_Amount || 0;
          return acc;
        }, {
          LocationCode: key,
          ServiceType: " ",
          PAID_GCN: 0,
          PAID_Amount: 0,
          TO_PAY_GCN: 0,
          TO_PAY_Amount: 0,
          Total_GCN: 0,
          Total_Amount: 0
        });

        grandTotal.PAID_GCN += total.PAID_GCN;
        grandTotal.PAID_Amount += total.PAID_Amount;
        grandTotal.TO_PAY_GCN += total.TO_PAY_GCN;
        grandTotal.TO_PAY_Amount += total.TO_PAY_Amount;
        grandTotal.Total_GCN += total.Total_GCN;
        grandTotal.Total_Amount += total.Total_Amount;

        return [total, ...items];
      })
      .flatten()
      .value();

    groupedData.push(grandTotal);

    return {
      staticFields:
        ["LocationCode", "ServiceType", , "PAID_Amount", , "TO_PAY_Amount", , "Total_Amount"],
      // ["LocationCode", "ServiceType", "PAID_GCN", "PAID_Amount", "TO_PAY_GCN", "TO_PAY_Amount", "Total_GCN", "Total_Amount"],
      config: { display: displayJson }, data: groupedData, columnGroup
    };
  }

  //#endregion

  async downloadcsv(event) {
    if (event.value && event.value > 0) {
      console.log(event);

      const data = event.data;
      const columnData = event.columnData;

      var filter = { ...this.filterData };

      if (columnData.pAYTYP)
        filter.payBasis = columnData.pAYTYP;

      if (data.LocationCode && data.LocationCode != "")
        filter.location = [data.LocationCode];

      console.log(filter);
      //let result = await this.stockReportService.getStockData(filter);

      // if (!result || (Array.isArray(result) && result.length === 0)) {

      //   Swal.fire({
      //     icon: "error",
      //     title: "No Records Found",
      //     text: "Cannot Download CSV",
      //     showConfirmButton: true,
      //   });
      // }

      setTimeout(() => {
        Swal.close();
      }, 1000);
      //console.log(result);

      // this.exportService.exportAsCSV(result, `Stock Register-${data.LocationCode}-${columnData.StockType}-${moment().format("YYYYMMDD-HHmmss")}`, this.detailCSVHeader);
    }
  }
}
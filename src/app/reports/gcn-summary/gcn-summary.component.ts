import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import _ from 'lodash';
import moment from 'moment';
import { firstValueFrom, Subject, take, takeUntil } from 'rxjs';
import { ModuleCounterService } from 'src/app/core/service/Logger/module-counter-service.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { NavDataService } from 'src/app/core/service/navdata.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { productdetailFromApi } from 'src/app/Masters/Customer Contract/CustomerContractAPIUtitlity';
import { ConvertToNumber } from 'src/app/Utility/commonFunction/common';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { GeneralLedgerReportService } from 'src/app/Utility/module/reports/general-ledger-report.service';
import { ReportService } from 'src/app/Utility/module/reports/generic-report.service';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { ToPayPaidReportControl } from 'src/assets/FormControls/Reports/To-Pay-Paid/to-pay-paid-but-not-collected-register-report-control';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gcn-summary',
  templateUrl: './gcn-summary.component.html'
})
export class GCNSummaryComponent implements OnInit {
  breadScrums = [
    {
      title: "GCN Summary",
      items: ["Home"],
      active: "GCN Summary",
    },
  ];
  jsonControlFormArray: any
  formTitle = "GCN Approval Data"
  csvFileName: string; // name of the csv file, when data is downloaded  
  tableLoad: boolean = false;
  protected _onDestroy = new Subject<void>();
  summaryData: any[];
  filterData: any;
  dynamicControls = {
    add: false,
    edit: false,
    csv: true,
  };
  summaryGroup: any[] = [];
  summaryHeader: any;
  gcnSummaryReportForm: UntypedFormGroup;
  staticField: string[];
  constructor(private fb: UntypedFormBuilder,
    private locationService: LocationService,
    private filter: FilterUtils,
    public snackBarUtilityService: SnackBarUtilityService,
    private storage: StorageService,
    private generalLedgerReportService: GeneralLedgerReportService,
    private reportService: ReportService,
    private masterService: MasterService,
    private MCountrService: ModuleCounterService,
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
    this.gcnSummaryReportForm.controls["start"].setValue(lastweek);
    this.gcnSummaryReportForm.controls["end"].setValue(now);
    this.getDropDownList();
    this.csvFileName = `GCN Approval Report -${moment().format("YYYYMMDD-HHmmss")}`;
  }
  //#region to initialize form controls
  initFormControls() {
    const formControls = new ToPayPaidReportControl();
    this.jsonControlFormArray = formControls.toPayPaidReportControlArray.filter(x => {

      if (x.name == 'Paybasis') {
        x.value = [
          { value: ["P03"], name: "To Pay" },
          { value: ["P01"], name: "Paid" },
          { value: ["P02"], name: "TBB" },
          { value: "All", name: "All" },]
      }
      return x.name != 'StatusAson'
    });

    this.gcnSummaryReportForm = formGroupBuilder(this.fb, [this.jsonControlFormArray]);
  }
  //#endregion
  //#region to get dropdown data
  async getDropDownList() {
    const locationList = await this.locationService.getLocationList();
    const modeList = await productdetailFromApi(this.masterService);
    const loginBranch = locationList.find(x => x.value === this.storage.branch);

    this.gcnSummaryReportForm.controls["location"].setValue(loginBranch);
    this.gcnSummaryReportForm.get('Individual').setValue("Y");
    this.gcnSummaryReportForm.get('Paybasis').setValue("All");
    this.gcnSummaryReportForm.get('ServiceType').setValue("Both");
    this.filter.Filter(this.jsonControlFormArray, this.gcnSummaryReportForm, modeList, "Transitmode", true);
    this.filter.Filter(this.jsonControlFormArray, this.gcnSummaryReportForm, locationList, "location", true);
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
        this.gcnSummaryReportForm.controls[autocompleteSupport].patchValue(
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
        if (this.gcnSummaryReportForm.value.Individual == "N") {
          // If multiple, get the reporting locations list based on the selected location
          ReportingBranches = await this.generalLedgerReportService.GetReportingLocationsList(this.gcnSummaryReportForm.value.location.value);
          // Add the selected location to the reporting branches list
          ReportingBranches.push(this.gcnSummaryReportForm.value.location.value);
        } else {
          // If individual, just add the selected location
          ReportingBranches.push(this.gcnSummaryReportForm.value.location.value);
        }

        // Convert start and end dates to Date objects
        const startDate = new Date(this.gcnSummaryReportForm.controls.start.value);
        const endDate = new Date(this.gcnSummaryReportForm.controls.end.value);

        // Use moment.js to set the start date to the beginning of the day and the end date to the end of the day
        const startValue = moment(startDate).startOf('day').toDate();
        const endValue = moment(endDate).endOf('day').toDate();

        const modeList = Array.isArray(this.gcnSummaryReportForm.value.modeHandler)
          ? this.gcnSummaryReportForm.value.modeHandler.map(x => x.value)
          : [];

        const service = this.gcnSummaryReportForm.value.ServiceType;
        let payBasis = this.gcnSummaryReportForm.value.Paybasis;
        payBasis === 'All' ? payBasis = ["P01", "P02", "P03"] : payBasis;
        const location = ReportingBranches;

        this.filterData = { startValue, endValue, location, modeList, service, payBasis };
        const data = await this.gcnSummaryReport(this.filterData);
        // Push the module counter data to the server
        this.MCountrService.PushModuleCounter();
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
    }, "GCN Summary Report Generating Please Wait..!");
  }
  //#endregion
  //#region prepare query to get data
  async gcnSummaryReport(data) {
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
            D$group: {
              _id: {
                fSTS: "$fSTS",
                fSTSN: "$fSTSN",
                dEST: "$dEST",
                dKTNO: "$dKTNO"
              },
              GCN: {
                D$sum: 1
              },
              tTLAMT: {
                D$sum: "$tOTAMT"
              }
            }
          },
          {
            D$group: {
              _id: {
                fSTS: "$_id.fSTS",
                fSTSN: "$_id.fSTSN",
                dEST: "$_id.dEST"
              },
              GCN: {
                D$sum: "$GCN"
              },
              tTLAMT: {
                D$sum: "$tTLAMT"
              }
            }
          },
          {
            D$project: {
              _id: 0,
              fSTS: "$_id.fSTS",
              fSTSN: {
                D$cond: {
                  if: {
                    D$eq: ["$_id.fSTSN", "Pending"]
                  },
                  then: "Not Approved",
                  else: "$_id.fSTSN"
                }
              },
              dEST: "$_id.dEST",
              GCN: 1,
              tOTL: "$tTLAMT",
              serviceType: serviceType
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

    const allTypes = _(data)
      .map(item => ({
        fSTSN: item.fSTSN.replace(' Stock', '').replace(/ /g, '_'),
        fSTS: item.fSTS
      }))
      .uniqBy('fSTSN')
      .orderBy('fSTS', 'desc')
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
          fields.forEach(f => { acc[type.fSTSN + '_' + f.field] = 0; });
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
        const aggregates = initializeAggregates(allTypes);
        let rowTotals = initializeAggregates(null, true);

        _.forEach(items, item => {
          const typeKey = item.fSTSN.replace(' Stock', '').replace(/ /g, '_');

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

    allTypes.push({ fSTSN: 'Total', fSTS: [0, 1] });

    allTypes.map(type => {
      columnGroup.push({
        Name: `${type.fSTSN}-Group`,
        Title: type.fSTSN.replace(/_/g, ' '),
        class: "matcolumncenter",
        ColSpan: 2,
        sticky: true
      });

      fields.map(f => {
        displayJson[`${type.fSTSN}_${f.field}`] = {
          Title: `${f.caption}`,
          class: "matcolumnright",
          Style: "min-width: 100px",
          datatype: "number",
          decimalPlaces: f.decimal,
          columnData: type
        };

        if (f.field == "GCN") {
          displayJson[`${type.fSTSN}_${f.field}`]["type"] = "Link";
          displayJson[`${type.fSTSN}_${f.field}`]["functionName"] = "downloadcsv";
        }
      });
    });

    const columns = initializeAggregates(allTypes);
    _.sortBy(pivotData, ['Location']);

    const grandTotal = {
      LocationCode: "Grand Total",
      ServiceType: " ",
      Not_Approved_GCN: 0,
      Not_Approved_Amount: 0,
      Approved_GCN: 0,
      Approved_Amount: 0,
      Total_GCN: 0,
      Total_Amount: 0
    };

    const groupedData = _.chain(pivotData)
      .groupBy('LocationCode')
      .map((items, key) => {
        const total = items.reduce((acc, item) => {
          acc.Not_Approved_GCN += item.Not_Approved_GCN || 0;
          acc.Not_Approved_Amount += item.Not_Approved_Amount || 0;
          acc.Approved_GCN += item.Approved_GCN || 0;
          acc.Approved_Amount += item.Approved_Amount || 0;
          acc.Total_GCN += item.Total_GCN || 0;
          acc.Total_Amount += item.Total_Amount || 0;
          return acc;
        }, {
          LocationCode: key,
          ServiceType: " ",
          Not_Approved_GCN: 0,
          Not_Approved_Amount: 0,
          Approved_GCN: 0,
          Approved_Amount: 0,
          Total_GCN: 0,
          Total_Amount: 0
        });

        grandTotal.Not_Approved_GCN += total.Not_Approved_GCN;
        grandTotal.Not_Approved_Amount += total.Not_Approved_Amount;
        grandTotal.Approved_GCN += total.Approved_GCN;
        grandTotal.Approved_Amount += total.Approved_Amount;
        grandTotal.Total_GCN += total.Total_GCN;
        grandTotal.Total_Amount += total.Total_Amount;

        return [total, ...items];
      })
      .flatten()
      .value();

    groupedData.push(grandTotal);

    return {
      staticFields:
        ["LocationCode", "ServiceType", , "Approved_Amount", , "Not_Approved_Amount", , "Total_Amount"],

      config: { display: displayJson }, data: groupedData, columnGroup
    };
  }

  //#endregion
  //#region to call drill down report data
  async downloadcsv(event) {
    if (event.value && event.value > 0) {
      // console.log(event);

      const data = event.data;
      const columnData = event.columnData;

      var filter = { ...this.filterData };

      // Ensure fSTS is always treated as an array
      filter["fSTS"] = Array.isArray(columnData.fSTS) ? columnData.fSTS : [columnData.fSTS];

      filter.service = data.ServiceType;

      if (data.LocationCode && data.LocationCode != "")

        data.LocationCode === "Grand Total" ? filter.location = this.filterData.location :
          filter.location = [data.LocationCode];

      const result = await this.getGCNRegister(filter);

      if (!result || (Array.isArray(result) && result.length === 0)) {
        Swal.fire({
          icon: "error",
          title: "No Records Found",
          text: "Cannot Download CSV",
          showConfirmButton: true,
        });
      }

      // Prepare the state data to include all necessary properties
      const stateData = {
        data: result,
        formTitle: 'GCN Approval Report Data',
        csvFileName: this.csvFileName
      };
      // Convert the state data to a JSON string and encode it        
      this.nav.setData(stateData);
      // Create the new URL with the state data as a query parameter
      const url = `/#/Reports/generic-report-view`;
      // Open the URL in a new tab
      window.open(url, '_blank');
      setTimeout(() => {
        Swal.close();
      }, 1000);
    }
  }
  //#endregion
  //#region to made query for report and get data
  async getGCNRegister(data) {

    const { startValue, endValue, location, modeList, payBasis, service, fSTS } = data;

    // Construct the match query with conditional filters
    const matchQuery = {
      'D$and': [
        { 'dKTDT': { 'D$gte': startValue } },
        { 'dKTDT': { 'D$lte': endValue } },
        ...(location ? [{ 'dEST': { 'D$in': location } }] : []),
        ...(modeList.length > 0 ? [{ 'tRNMOD': { 'D$in': modeList } }] : []),
        ...(payBasis ? [{ 'pAYTYP': { 'D$in': payBasis } }] : []),
        ...(fSTS ? [{ 'fSTS': { 'D$in': fSTS } }] : []),
      ],
    };

    try {
      let resFTL = { data: { data: [], grid: null } };
      let resLTL = { data: { data: [], grid: null } };

      // Fetch data based on the service type
      if (service === " ") {
        resFTL = await this.reportService.fetchReportData("GCNSummaryFTL", matchQuery);
        resLTL = await this.reportService.fetchReportData("GCNSummaryLTL", matchQuery);
      }
      if (service === "LTL") {
        resLTL = await this.reportService.fetchReportData("GCNSummaryLTL", matchQuery);
      }
      if (service === "FTL") {
        resFTL = await this.reportService.fetchReportData("GCNSummaryFTL", matchQuery);
      }

      const combinedData = [...resFTL.data.data, ...resLTL.data.data];
      // console.log(combinedData);

      // Map and format the combined data
      const data = combinedData.map((item) => {
        return {
          ...item,
          fSTSN: item.fSTSN === 'Pending' ? 'Not Approved' : item.fSTSN,
          dKTDT: item.dKTDT ? moment(item.dKTDT).format("DD MMM YY HH:mm") : "",
          tOTAMT: typeof item.tOTAMT === 'number' ? item.tOTAMT.toFixed(2) : "0.00",
        };
      });

      // Return the formatted data and grid structure
      return {
        data: data,
        grid: resFTL.data.grid || resLTL.data.grid, // Assuming grid structure is the same for both responses
      };
    } catch (error) {
      console.log("Error fetching report data:", error.message);
    }
  }
  //#endregion
}
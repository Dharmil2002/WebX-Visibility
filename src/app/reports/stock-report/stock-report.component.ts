import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import moment from 'moment';
import { Subject, take, takeUntil } from 'rxjs';

import { GetGeneralMasterData, productdetailFromApi } from 'src/app/Masters/Customer Contract/CustomerContractAPIUtitlity';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { ExportService } from 'src/app/Utility/module/export.service';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { StockReportService } from 'src/app/Utility/module/reports/stock-report.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { StockReport } from 'src/assets/FormControls/Reports/stock-report-controls/stock-report';
import Swal from 'sweetalert2';
import _, { forEach } from 'lodash';
import { ConvertToNumber } from 'src/app/Utility/commonFunction/common';
import { ModuleCounterService } from 'src/app/core/service/Logger/module-counter-service.service';

@Component({
  selector: 'app-stock-report',
  templateUrl: './stock-report.component.html'
})
export class StockReportComponent implements OnInit {
  jsonControlArray: any;
  stockReportForm: UntypedFormGroup;
  protected _onDestroy = new Subject<void>();
  breadScrums = [
    {
      title: "Stock Report",
      items: ["Report"],
      active: "Stock Report",
    },
  ];

  detailCSVHeader = {
    CNote: "C Note No.",
    CDate: "C Note Date",
    OriginLocation: "OriginLocation",
    DestinationLocation: "DestinationLocation",
    CurrentLocation: "CurrentLocation",
    EDD: "EDD",
    Paybas: "Paybas",
    TransportMode: "TransportMode",
    FlowType: "FlowType",
    ArrivedDate: "ArrivedDate",
    THCNextLocation: "THCNextLocation",
    PackagesNo: "PackagesNo",
    ActualWeight: "ActualWeight",
    ChargedWeight: "ChargedWeight",
    Freight: "Freight",
    SubTotal: "SubTotal",
    GSTCharged: "GSTCharged",
    CnoteTotal: "Cnote Total",
    StockType: "StockType",
    FromCity: "FromCity",
    ToCity: "ToCity",
    ConsigneeName: "ConsigneeName",
    ConsinorName: "ConsinorName",
    PackageType: "PackageType",
    PickupDelivery: "PickupDelivery",
    DocketStatus: "DocketStatus",
    PrivateMarka: "PrivateMarka"
  }

  summaryGroup: any[] = [];
  staticField: string[] = ["loc", "StockType", "Dockets", "Packages", "ActWeight", "ChgWeight", "Freight", "OtherAmt", "SubTotal", "GST", "Total"]
  summaryHeader: any = {
    "loc": {
      Title: "Location",
      class: "matcolumnleft",
    },
    "StockType": {
      Title: "Stock Type",
      class: "matcolumnleft",
    },
    "Dockets": {
      Title: "Dockets",
      class: "matcolumnleft",
    },
    "Packages": {
      Title: "Packages",
      class: "matcolumnleft",
    },
    "ActWeight": {
      Title: "ActWeight",
      class: "matcolumnleft",
    },
    "ChgWeight": {
      Title: "ChgWeight",
      class: "matcolumnleft",
    },
    "Freight": {
      Title: "Freight",
      class: "matcolumnleft",
    },
    "OtherAmt": {
      Title: "OtherAmt",
      class: "matcolumnleft",
    },
    "SubTotal": {
      Title: "SubTotal",
      class: "matcolumnleft",
    },
    "GST": {
      Title: "GST",
      class: "matcolumnleft",
    },
    "Total": {
      Title: "Total",
      class: "matcolumnleft",
    },
  }

  submit = 'Download';

  summaryData: any[];
  filterData: any;
  tableLoad = true;

  dynamicControls = {
    add: false,
    edit: false,
    csv: true,
  };
  DetailHeader = {
  }
  linkArray = [];

  locations: any[] = [];
  cumulativeLocation: string[] = [];

  constructor(private masterService: MasterService,
    private filter: FilterUtils,
    private fb: UntypedFormBuilder,
    private locationService: LocationService,
    private storage: StorageService,
    private stockReportService: StockReportService,
    private snackBarUtilityService: SnackBarUtilityService,
    private exportService: ExportService,
    private MCountrService: ModuleCounterService
  ) { }

  ngOnInit(): void {
    this.initializeFormControl()

    const now = moment().endOf('day').toDate();
    const lastweek = moment().add(-10, 'days').startOf('day').toDate()

    // Set the 'start' and 'end' controls in the form to the last week and current date, respectively
    this.stockReportForm.controls["start"].setValue(lastweek);
    this.stockReportForm.controls["end"].setValue(now);
    this.getDropdownData();
  }
  //#region to initialize form control
  initializeFormControl() {
    const controls = new StockReport();
    this.jsonControlArray = controls.StockReportControlArray;

    // Build the form using formGroupBuilder
    this.stockReportForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.stockReportForm.controls['DateType'].setValue('BookingDate');
    this.stockReportForm.controls['LocationType'].setValue('CurrentLocation');
    this.stockReportForm.controls["ReportType"].setValue('Summary');
  }
  //#endregion
  async getDropdownData() {

    const paybasisList = await GetGeneralMasterData(this.masterService, 'PAYTYP')
    const modeList = await productdetailFromApi(this.masterService);
    // console.log(modeList);

    // Fetch branch list asynchronously
    const locationList = await this.locationService.locationFromApi();

    // Filter issuing bank dropdown
    this.filter.Filter(this.jsonControlArray, this.stockReportForm, paybasisList, "paybasis", false);
    this.filter.Filter(this.jsonControlArray, this.stockReportForm, modeList, "mode", false);
    this.filter.Filter(this.jsonControlArray, this.stockReportForm, locationList, "toLocation", false);
    this.filter.Filter(this.jsonControlArray, this.stockReportForm, locationList, "fromLocation", false);

  }

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
    const index = this.jsonControlArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonControlArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.stockReportForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }
  //#endregion
  //#region to export csv file
  async save() {
    this.snackBarUtilityService.commonToast(async () => {
      try {
        this.tableLoad = true;
        const reportType = this.stockReportForm.value.ReportType;
        const startValue = new Date(this.stockReportForm.controls.start.value);
        const endValue = new Date(this.stockReportForm.controls.end.value);

        const startDate = moment(startValue).startOf('day').toDate();
        const endDate = moment(endValue).endOf('day').toDate();

        const paybasisList = Array.isArray(this.stockReportForm.value.paybasisHandler)
          ? this.stockReportForm.value.paybasisHandler.map(x => x.value)
          : [];

        const modeList = Array.isArray(this.stockReportForm.value.modeHandler)
          ? this.stockReportForm.value.modeHandler.map(x => x.value)
          : [];

        const BookingType = this.stockReportForm.value.BookingType;
        const dateType = this.stockReportForm.value.DateType;
        const locationType = this.stockReportForm.value.LocationType;
        const stockType = Array.isArray(this.stockReportForm.value.StockType) ? '' : this.stockReportForm.value.StockType;
        const formatType = this.stockReportForm.value.FormatType;
        const fromLocation = this.stockReportForm.value.fromLocation.value;
        const toLocation = this.stockReportForm.value.toLocation.value;
        this.locations = await this.locationService.findAllDescendants(this.storage.branch);

        this.cumulativeLocation = this.locations.filter(f => f.activeFlag == true).map(x => x.locCode);
        if (this.cumulativeLocation.length == 0) { this.cumulativeLocation.push(this.storage.branch) };


        const lc = await this.locationService.getLocation({ companyCode: this.storage.companyCode, locCode: this.storage.branch });
        const rlc = await this.locationService.getLocation({ companyCode: this.storage.companyCode, locCode: lc.reportLoc });
        this.locations.push(lc);
        this.locations.push(rlc);

        this.filterData = { startDate, endDate, modeList, paybasisList, BookingType, stockType, dateType, locationType, formatType, fromLocation, toLocation, cumulativeLocation: this.cumulativeLocation }

        // Push the module counter data to the server
        this.MCountrService.PushModuleCounter();
        let data = [];
        if (reportType == 'Register') {
          data = await this.stockReportService.getStockData(this.filterData);
        }
        else {
          data = await this.stockReportService.getStockSummary(this.filterData);

          Swal.hideLoading();

          if (!data || (Array.isArray(data) && data.length === 0)) {

            Swal.fire({
              icon: "error",
              title: "No Records Found",
              text: "Cannot Download CSV",
              showConfirmButton: true,
            });

            return;
          }

          setTimeout(() => {
            Swal.close();
          }, 1000);

          // this.summaryData = data;
          // this.tableLoad = false;
          // console.log(data);

          var pivot = await this.pivotData({ data, locations: this.locations });
          this.staticField = pivot.staticFields;
          this.summaryHeader = pivot.config.display;
          this.summaryData = pivot.data;
          this.summaryGroup = pivot.columnGroup;
          this.tableLoad = false;
        }

        if (reportType == 'Register') {
          // Export the record to Excel
          this.exportService.exportAsCSV(data, `Stock Register-${moment().format("YYYYMMDD-HHmmss")}`, this.detailCSVHeader);
        }

      } catch (error) {
        console.log(error);
        this.snackBarUtilityService.ShowCommonSwal(
          "error",
          "No Records Found"
        );
      }
    }, "Stock Report Generating Please Wait..!");
  }
  //#endregion

  async downloadcsv(event) {
    if (event.value && event.value > 0) {
      const data = event.data;
      const columnData = event.columnData;

      var filter = { ...this.filterData };

      if (columnData.StockTypeId)
        filter.stockType = columnData.StockTypeId;

      if (data.LocationCode && data.LocationCode != "")
        filter.cumulativeLocation = [data.LocationCode];

      console.log(filter);
      let result = await this.stockReportService.getStockData(filter);

      if (!result || (Array.isArray(result) && result.length === 0)) {

        Swal.fire({
          icon: "error",
          title: "No Records Found",
          text: "Cannot Download CSV",
          showConfirmButton: true,
        });
      }

      setTimeout(() => {
        Swal.close();
      }, 1000);

      this.exportService.exportAsCSV(result, `Stock Register-${data.LocationCode}-${columnData.StockType}-${moment().format("YYYYMMDD-HHmmss")}`, this.detailCSVHeader);
    }
  }

  /**
   * Generates a pivot table data based on the provided data and locations.
   *
   * @param data - The array of data to be pivoted.
   * @param locations - The array of locations.
   * @returns A promise that resolves to an object containing the static fields, configuration, data, and column groups of the pivot table.
   */
  async pivotData({ data, locations }: { data: any[]; locations: any[]; }): Promise<any> {
    const fields = [
      { "caption": "Count", "field": "Count", "decimal": 0, "datafield": "Dockets" },
      { "caption": "Packages", "field": "Packages", "decimal": 0, "datafield": "Packages" },
      { "caption": "Actual Weight", "field": "Actual_Weight", "decimal": 2, "datafield": "ActWeight" },
      { "caption": "Charged Weight", "field": "Charged_Weight", "decimal": 2, "datafield": "ChgWeight" },
      { "caption": "Freight", "field": "Freight", "decimal": 2, "datafield": "Freight" },
      { "caption": "Subtotal", "field": "Subtotal", "decimal": 2, "datafield": "SubTotal" },
      { "caption": "GST Charged", "field": "GST_Charged", "decimal": 2, "datafield": "GST" },
      { "caption": "Docket Total", "field": "Docket_Total", "decimal": 2, "datafield": "Total" }
    ];

    const allStockTypes = _(data)
      .map(item => ({
        StockType: item.StockType.replace(' Stock', '').replace(/ /g, '_'),
        StockTypeId: item.StockTypeId
      }))
      .uniqBy('StockType')
      .sortBy('StockTypeId')
      .value();

    const columnGroup: any[] = [{
      Name: "LocationGroup",
      Title: "",
      class: "matcolumncenter",
      ColSpan: 2,
      sticky: true
    }];

    const displayJson: any = {};
    const staticFields = ["Location", "ReportLocation"];

    displayJson["Location"] = {
      Title: "Location",
      class: "matcolumnleft",
      Style: "min-width: 250px",
      sticky: true
    };

    displayJson["ReportLocation"] = {
      Title: "Reporting Location",
      class: "matcolumnleft",
      Style: "min-width: 250px",
      sticky: true
    };

    const initializeAggregates = (stockTypes = null, isTotal = false) => {
      if (stockTypes) {
        return stockTypes.reduce((acc: { [x: string]: number; }, type: { StockType: string; }) => {
          fields.forEach(f => { acc[type.StockType + '_' + f.field] = 0; });
          return acc;
        }, {});
      } else if (isTotal) {
        const acc = {};
        fields.map(f => { acc['Total_' + f.field] = 0; });
        return acc;
      }
    };

    const pivotData = _.chain(data)
      .groupBy('loc')
      .map((items, locKey) => {
        const aggregates = initializeAggregates(allStockTypes);
        let rowTotals = initializeAggregates(null, true);

        _.forEach(items, item => {
          const typeKey = item.StockType.replace(' Stock', '').replace(/ /g, '_');

          fields.forEach(f => {
            aggregates[typeKey + '_' + f.field] += ConvertToNumber(item[f.datafield] ?? 0, f.decimal);
          });

          fields.forEach(f => {
            rowTotals['Total_' + f.field] += ConvertToNumber(item[f.datafield] ?? 0, f.decimal);
          });
        });

        const loc = locations.find(f => f.locCode == locKey);
        const rep = locations.find(f => f.locCode == loc.reportLoc);

        return {
          LocationCode: loc.locCode,
          Location: `${loc.locCode} : ${loc.locName}`,
          ReportLocation: rep ? `${rep.locCode} : ${rep.locName}` : "",
          ...aggregates,
          ...rowTotals
        };
      })
      .value();

    allStockTypes.push({ StockType: 'Total', StockTypeId: 0 });

    allStockTypes.map(type => {
      columnGroup.push({
        Name: `${type.StockType}-Group`,
        Title: type.StockType.replace(/_/g, ' '),
        class: "matcolumncenter",
        ColSpan: 8
      });

      fields.map(f => {
        displayJson[`${type.StockType}_${f.field}`] = {
          Title: `${f.caption}`,
          class: "matcolumnright",
          Style: "min-width: 100px",
          datatype: "number",
          decimalPlaces: f.decimal,
          columnData: type
        };

        if (f.field == "Count") {
          displayJson[`${type.StockType}_${f.field}`]["type"] = "Link";
          displayJson[`${type.StockType}_${f.field}`]["functionName"] = "downloadcsv";
        } else {
          staticFields.push(type.StockType + '_' + f.field);
        }
      });
    });

    const columns = initializeAggregates(allStockTypes);
    _.sortBy(pivotData, ['Location']);

    _.each(pivotData, row => {
      _.forEach(Object.keys(columns), column => {
        columns[column] += row[column] || 0;
      });
    });

    pivotData.push({
      LocationCode: "",
      Location: "Total",
      ReportLocation: "",
      ...columns
    });

    return { staticFields, config: { display: displayJson }, data: pivotData, columnGroup };
  }
}

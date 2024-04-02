import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import moment from 'moment';
import { Subject, take, takeUntil } from 'rxjs';

import { PayBasisdetailFromApi, productdetailFromApi } from 'src/app/Masters/Customer Contract/CustomerContractAPIUtitlity';
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
import _ from 'lodash';
import { columnHeader } from 'src/app/Masters/customer-master/customer-master-list/customer-utlity';
import { fi } from 'date-fns/locale';

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
  }

  summaryCSVHeader = {
    ReportLocationName: "Report Location Name",
    ReportBranchName: "Report Branch Name",
    BookingCount: "Booking Count",
    BookingPackgesNo: "Booking PackgesNo",
    BookingActualWeight: "Booking ActualWeight",
    BookingChargedWeight: "Booking ChargedWeight",
    BookingFreight: "Booking Freight",
    BookingSubtotal: "Booking Subtotal",
    BookingGSTCharged: "Booking GSTCharged",
    BookingDocketTotal: "Booking DocketTotal",
    DeliveryCount: "Delivery Count",
    DeliveryPackgesNo: "Delivery PackgesNo",
    DeliveryActualWeight: "Delivery ActualWeight",
    DeliveryChargedWeight: "Delivery ChargedWeight",
    DeliveryFreight: "Delivery Freight",
    DeliveryGSTCharged: "Delivery GSTCharged",
    DeliveryDocketTotal: "Delivery DocketTotal",
    InTransitCount: "InTransit Count",
    InTransitPackgesNo: "InTransit PackgesNo",
    InTransitActualWeight: "InTransit ActualWeight",
    InTransitChargedWeight: "InTransit ChargedWeight",
    InTransitFreight: "InTransit Freight",
    InTransitSubtotal: "InTransit Subtotal",
    InTransitGSTCharged: "InTransit GSTCharged",
    InTransitDocketTotal: "	InTransit DocketTotal",
    TransCount: "Trans Count",
    TransPackgesNo: "Trans PackgesNo",
    TransActualWeight: "Trans ActualWeight",
    TransChargedWeight: "Trans ChargedWeight",
    TransFreight: "Trans Freight",
    TransSubtotal: "Trans Subtotal",
    TransGSTCharged: "Trans GSTCharged",
    TransDocketTotal: "Trans DocketTotal",
    GoneForDeliveryCount: "GoneForDelivery Count",
    GoneForDeliveryPackgesNo: "GoneForDelivery PackgesNo",
    GoneForDeliveryActualWeight: "GoneForDelivery ActualWeight",
    GoneForDeliveryChargedWeight: "GoneForDelivery ChargedWeight",
    GoneForDeliveryFreight: "GoneForDelivery Freight",
    GoneForDeliverySubtotal: "GoneForDelivery Subtotal",
    GoneForDeliveryGSTCharged: "GoneForDelivery GSTCharged",
    GoneForDeliveryDocketTotal: "GoneForDelivery DocketTotal"
  }

  summaryGroup: any[] = [];
  staticField: string[] = ["loc","StockType","Dockets","Packages","ActWeight","ChgWeight","Freight","OtherAmt","SubTotal","GST","Total"]
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
    csv: false,
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
    private exportService: ExportService
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

    const paybasisList = await PayBasisdetailFromApi(this.masterService, 'PAYTYP')
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
        if(this.cumulativeLocation.length == 0){ this.cumulativeLocation.push(this.storage.branch) };


        const lc =  await this.locationService.getLocation({ companyCode: this.storage.companyCode, locCode: this.storage.branch });
        const rlc = await this.locationService.getLocation({ companyCode: this.storage.companyCode, locCode: lc.reportLoc });        
        this.locations.push(lc);
        this.locations.push(rlc);
        
        this.filterData = { startDate, endDate, modeList, paybasisList, BookingType, stockType, dateType, locationType, formatType, fromLocation, toLocation, cumulativeLocation: this.cumulativeLocation }
        
        // console.log(requestbody);
        console.log( this.filterData);
        let data = [];
        if(reportType == 'Register') {
          data = await this.stockReportService.getStockData(this.filterData);         
        }
        else {
          data = await this.stockReportService.getStockSummary(this.filterData);
          // this.summaryData = data;
          // this.tableLoad = false;
          // console.log(data);

          var pivot = await this.pivotData(data, this.locations);
          this.staticField = pivot.staticFields;
          this.summaryHeader = pivot.config;
          this.summaryData = pivot.data;
          this.summaryGroup = pivot.columnGroup;
          this.tableLoad = false;          
        }
        
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

        if(reportType == 'Register') {
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
    if(event.value && event.value > 0) {
      const data = event.data;
      const columnData = event.columnData;

      var filter = { ...this.filterData };

      filter.stockType = columnData.StockTypeId;
      filter.cumulativeLocation = [ data.LocationCode ];

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

  async pivotData(data, locations) {
      // Step 1: Create a master list of all unique stock types      
      const allStockTypes = _(data)
        .map(item => ({
          StockType: item.StockType.replace(' Stock', '').replace(/ /g, '_'),
          StockTypeId: item.StockTypeId
        }))
        .uniqBy('StockType') // or 'StockTypeId' if it should be unique by ID
        .sortBy('StockTypeId')
        .value();
      
      let columnGroup = [{
        Name: "Location",
        class: "matcolumnleft",
        ColSpan: 2
      }];
      let displayJson = {};
      let staticFields = ["Location","ReportLocation"];
      displayJson["Location"] = {
          Title: "Location",
          class: "matcolumnleft",
          Style: "min-width: 250px"
      };

      displayJson["ReportLocation"] = {
          Title: "Reporting Location",
          class: "matcolumnleft",
          Style: "min-width: 250px"
      };

      allStockTypes
      .map(type => {
        columnGroup.push({ 
          Name: type.StockType, 
          class: "matcolumnright",
          ColSpan: 8
        });
        var fields = ['Count','Packages','Actual_Weight','Charged_Weight','Freight','Subtotal','GST_Charged','Docket_Total'];
        fields.map(field => {
          
          displayJson[type.StockType + '_' + field.replace(/_/g, '')] = {
              Title: type.StockType.replace(/_/g, ' ') + ' ' + field.replace(/_/g, ' '),
              class: "matcolumnright",
              Style: "min-width: 100px",
              columnData: type
          };
          if(field == "Count") {
            displayJson[type.StockType + '_' + field.replace(/_/g, '')]["type"] = "Link";
            displayJson[type.StockType + '_' + field.replace(/_/g, '')]["functionName"] = "downloadcsv";
          }
          else {
            staticFields.push(type.StockType + '_' + field.replace(/_/g, ''));
          }
        });
      });

      // Step 2: Define a function to initialize aggregates with all stock types
      const initializeAggregates = (stockTypes) => {
        return stockTypes.reduce((acc, type) => {          
          acc[type.StockType + '_Count'] = 0;
          acc[type.StockType + '_Packages'] = 0;
          acc[type.StockType + '_ActualWeight'] = 0;
          acc[type.StockType + '_ChargedWeight'] = 0;
          acc[type.StockType + '_Freight'] = 0;
          acc[type.StockType + '_Subtotal'] = 0;
          acc[type.StockType + '_GSTCharged'] = 0;
          acc[type.StockType + '_DocketTotal'] = 0;
          return acc;
        }, {});
      };

      // Step 3: Use the master list to ensure each location has all stock types
      const pivotData = _.chain(data)
      .groupBy('loc') // Group by location
      .map((items, locKey) => { // Process each group
        // Initialize the aggregate object with all stock types from the master list
        const aggregates = initializeAggregates(allStockTypes);

        // Process each item
        _.forEach(items, item => {
          const typeKey = item.StockType.replace(' Stock', '').replace(/ /g, '_');
          
          // Increment the counts and sums
          aggregates[typeKey + '_Count'] += parseInt(item.Dockets || 0) || 0;
          aggregates[typeKey + '_Packages'] += item.Packages || 0;
          aggregates[typeKey + '_ActualWeight'] += item.ActWeight || 0;
          aggregates[typeKey + '_ChargedWeight'] += item.ChgWeight || 0;
          aggregates[typeKey + '_Freight'] += item.Freight || 0;
          aggregates[typeKey + '_Subtotal'] += item.SubTotal || 0;
          aggregates[typeKey + '_GSTCharged'] += item.GST || 0;
          aggregates[typeKey + '_DocketTotal'] += item.Total || 0;
        });

        // Return the aggregated data for the location
        const loc = locations.find(f => f.locCode == locKey);
        const rep = locations.find(f => f.locCode == loc.reportLoc);

        return { 
          LocationCode: loc.locCode,
          Location: `${loc.locCode} : ${loc.locName}`,
          ReportLocation : `${rep.locCode} : ${rep.locName}`,          
          ...aggregates
        };
      })
      .value();

      return { staticFields, config: displayJson, data: pivotData, columnGroup };

      /*
       // Step 1: Group by 'salesperson' and 'region'
          const groupedData = _.groupBy(data, item => item.loc);
          // Step 2: Map each group to aggregate data
          const pivotData = _.map(groupedData, (items, key) => {
            // Extracting 'salesperson' and 'region' from the key
            
            // Aggregating data
            const stockTypes = _.groupBy(items, 'StockType');
            const aggregates = _.mapValues(stockTypes, stockItems => {                  
              return {
                Type: stockItems[0].StockType.replace(' Stock', '').replace(/ /g, '_'),
                Count: stockItems.length,
                PackgesNo: _.sumBy(stockItems, 'Packages'),
                ActualWeight: _.sumBy(stockItems, 'ActWeight'),
                ChargedWeight: _.sumBy(stockItems, 'ChgWeight'),
                Freight: _.sumBy(stockItems, 'Freight'),
                Subtotal: _.sumBy(stockItems, 'SubTotal'),
                GSTCharged: _.sumBy(stockItems, 'GST'),
                DocketTotal: _.sumBy(stockItems, 'Total'),
              };
            });

            return { location: key, stock: aggregates };
          });
      */
  }
}

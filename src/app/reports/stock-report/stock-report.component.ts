import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import moment from 'moment';
import { Subject, take, takeUntil } from 'rxjs';
import { PayBasisdetailFromApi, productdetailFromApi } from 'src/app/Masters/Customer Contract/CustomerContractAPIUtitlity';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { GeneralService } from 'src/app/Utility/module/masters/general-master/general-master.service';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { GeneralLedgerReportService } from 'src/app/Utility/module/reports/general-ledger-report.service';
import { StockReportService } from 'src/app/Utility/module/reports/stock-report.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { StockReport } from 'src/assets/FormControls/Reports/stock-report-controls/stock-report';

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
  constructor(private masterService: MasterService,
    private filter: FilterUtils,
    private fb: UntypedFormBuilder,
    private locationService: LocationService,
    private storage: StorageService,
    private generalService: GeneralService,
    private stockReportService: StockReportService,
    private generalLedgerReportService: GeneralLedgerReportService,
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
    this.stockReportForm.controls['LocationType'].setValue('OriginLocation');
  }
  //#endregion
  async getDropdownData() {

    const paybasisList = await PayBasisdetailFromApi(this.masterService, 'PAYTYP')
    const modeList = await productdetailFromApi(this.masterService);
    // console.log(modeList);

    // Fetch branch list asynchronously
    const locationList = await this.locationService.locationFromApi();
    const fromReportingOfficeList = await this.generalService.getGeneralMasterData("HRCHY");
    // console.log(fromReportingOfficeList);

    // Filter issuing bank dropdown
    this.filter.Filter(this.jsonControlArray, this.stockReportForm, paybasisList, "paybasis", false);
    this.filter.Filter(this.jsonControlArray, this.stockReportForm, modeList, "mode", false);
    this.filter.Filter(this.jsonControlArray, this.stockReportForm, locationList, "toLocation", false);
    this.filter.Filter(this.jsonControlArray, this.stockReportForm, locationList, "fromLocation", false);
    this.stockReportForm.controls["FormatType"].setValue('Register');

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
    const cumulativeLocation = await this.generalLedgerReportService.GetReportingLocationsList(this.storage.branch);
    cumulativeLocation.push(this.storage.branch);

    const requestbody = { startDate, endDate, modeList, paybasisList, BookingType, stockType, dateType, locationType, formatType, fromLocation, toLocation,cumulativeLocation }
    // console.log(requestbody);
    console.log(requestbody);
    const data = await this.stockReportService.getStockData(requestbody);
    console.log(data);


  }
  //#endregion
}

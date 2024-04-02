import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subject, take, takeUntil } from 'rxjs';
import { FilterUtils } from 'src/app/Utility/Form Utilities/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { PinCodeService } from 'src/app/Utility/module/masters/pincode/pincode.service';
import { cNoteGSTControl } from 'src/assets/FormControls/CNote-GST-Wise-Register-report/cnote-gst-wise-register';
import { GeneralService } from 'src/app/Utility/module/masters/general-master/general-master.service';
import { AutoComplateCommon } from 'src/app/core/models/AutoComplateCommon';
import { CnwGstService, convertToCSV, exportAsExcelFile } from 'src/app/Utility/module/reports/cnw.gst.service';
import { timeString } from 'src/app/Utility/date/date-utils';
import { CustomerService } from 'src/app/Utility/module/masters/customer/customer.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cnw-gst-register',
  templateUrl: './cnw-gst-register.component.html'
})
export class CnwGstRegisterComponent implements OnInit {
  breadScrums = [
    {
      title: "Consignment Note GST Register Report",
      items: ["Home"],
      active: "Consignment Note GST Register Report",
    },
  ];
  cnoteTableForm: UntypedFormGroup;
  jsoncnoteFormArray: any;
  protected _onDestroy = new Subject<void>();
  cnoteGSTFormControls: cNoteGSTControl
  originName: any;
  originStatus: any;
  desName: any;
  desStatus: any;
  fromcityName: any;
  fromcityStatus: any;
  tocityName: any;
  tocityStatus: any;
  tableLoad = true;
  payName: any;
  payStatus: any;
  tranModeName: any;
  transModeStatus: any;

  CSVHeader = {
    "docketNumber": "Consignment Note No",
    "docketDate": "Consignment Note Date",
    "time": "Time",
    "edd": "EDD",
    "bbrnch": "Booking Branch",
    "dbranch": "Delivery Branch",
    "payty": "Payment Type",
    "busity": "Business Type",
    "prod": "Product",
    "contID": "Contract ID",
    "conpar": "Contract party",
    "sertp": "Service Type",
    "vehno": "Vehicle No",
    "billparnm": "Billing Party Name",
    "bacode": "BA Code",
    "lastmodby": "Last Modified By",
    "cnotemoddt": "CNote Modified Date",
    "cusrefno": "Customer Ref No",
    "movty": "Type of Movement",
    "tranmode": "Transport Mode",
    "status": "Status",
    "loadty": "Load Type",
    "subtot": "Sub Total",
    "doctot": "Docket Total",
    "gstrt": "GST Rate",
    "gstamt": "GST Amount",
    "frtrt": "FRT Rate",
    "frttp": "FRT Type",
    "frichar": "Freight Charge",
    "otherchar": "Other Charges",
    "greentax": "Green tax",
    "dropchar": "Drop Charges",
    "docchar": "Document Charges",
    "warchar": "Warehouse Charges",
    "deduc": "Deduction",
    "unloadchar": "Unloading Charges",
    "holiserchar": "Holiday Service Charges",
    "focchar": "FOV Charges",
    "codchar": "COD/DOD Charges",
    "appchar": "Appointment Charges",
    "odachar": "ODA Charges",
    "fuelchar": "FuelSurcharge Charges",
    "loadchar": "Loading Charges",
    "gstchar": "GST Charge",
    "advremark": "Advance Remark",
    "dphrt": "DPH Rate",
    "dphamt": "DPH Amount",
    "disrt": "Disc Rate",
    "discamt": "Disc Amount",
    "jobno": "Job Number",
    "jobdt": "Job Date ",
    "chano": "CHA Number ",
    "chadt": "CHA Date",
    "chaamt": "CHA Amount",
  }

  custName: any;
  custStatus: any;

  constructor(
    private filter: FilterUtils,
    private fb: UntypedFormBuilder,
    private locationService: LocationService,
    private generalService: GeneralService,
    private pinCodeService: PinCodeService,
    private cnwGstService: CnwGstService,
    private customerService: CustomerService,
  ) {
    this.initializeFormControl();
  }

  initializeFormControl() {
    this.cnoteGSTFormControls = new cNoteGSTControl();
    this.jsoncnoteFormArray = this.cnoteGSTFormControls.cnoteGSTControlArray;
    this.originName = this.jsoncnoteFormArray.find(
      (data) => data.name === "origin"
    )?.name;
    this.originStatus = this.jsoncnoteFormArray.find(
      (data) => data.name === "origin"
    )?.additionalData.showNameAndValue;
    this.desName = this.jsoncnoteFormArray.find(
      (data) => data.name === "destination"
    )?.name;
    this.desStatus = this.jsoncnoteFormArray.find(
      (data) => data.name === "destination"
    )?.additionalData.showNameAndValue;
    this.fromcityName = this.jsoncnoteFormArray.find(
      (data) => data.name === "fromCity"
    )?.name;
    this.fromcityStatus = this.jsoncnoteFormArray.find(
      (data) => data.name === "fromCity"
    )?.additionalData.showNameAndValue;
    this.tocityName = this.jsoncnoteFormArray.find(
      (data) => data.name === "toCity"
    )?.name;
    this.tocityStatus = this.jsoncnoteFormArray.find(
      (data) => data.name === "toCity"
    )?.additionalData.showNameAndValue;
    this.payName = this.jsoncnoteFormArray.find(
      (data) => data.name === "payType"
    )?.name;
    this.payStatus = this.jsoncnoteFormArray.find(
      (data) => data.name === "payType"
    )?.additionalData.showNameAndValue;
    this.tranModeName = this.jsoncnoteFormArray.find(
      (data) => data.name === "transMode"
    )?.name;
    this.transModeStatus = this.jsoncnoteFormArray.find(
      (data) => data.name === "transMode"
    )?.additionalData.showNameAndValue;
    this.custName = this.jsoncnoteFormArray.find(
      (data) => data.name === "cust"
    )?.name;
    this.custStatus = this.jsoncnoteFormArray.find(
      (data) => data.name === "cust"
    )?.additionalData.showNameAndValue;
    this.cnoteTableForm = formGroupBuilder(this.fb, [this.jsoncnoteFormArray]);
  }

  ngOnInit(): void {
    const now = new Date();
    const lastweek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 10
    );
    // Set the 'start' and 'end' controls in the form to the last week and current date, respectively
    this.cnoteTableForm.controls["start"].setValue(lastweek);
    this.cnoteTableForm.controls["end"].setValue(now);
    this.getDropDownList();
  }

  async getPincodeDetail(event) {
    const cityMapping =
      event.field.name == "fromCity" ? this.fromcityStatus : this.tocityStatus;
    this.pinCodeService.getCity(
      this.cnoteTableForm,
      this.jsoncnoteFormArray,
      event.field.name,
      cityMapping
    );
  }

  async getDropDownList() {
    const locationList = await this.locationService.getLocationList();
    const paymentType: AutoComplateCommon[] = await this.generalService.getDataForMultiAutoComplete("General_master", { codeType: "PAYTYP" }, "codeDesc", "codeId");
    const transMode: AutoComplateCommon[] = await this.generalService.getDataForMultiAutoComplete("General_master", { codeType: "tran_mode" }, "codeDesc", "codeId");
    const customer = await this.customerService.customerFromApi();
    // const paymentType: AutoComplateCommon[] = await this.generalService.getGeneralMaster('PAYTYP');
    // const transMode: AutoComplateCommon[] = await this.generalService.getGeneralMaster('tran_mode');
    this.filter.Filter(
      this.jsoncnoteFormArray,
      this.cnoteTableForm,
      paymentType,
      this.payName,
      this.payStatus
    );
    this.filter.Filter(
      this.jsoncnoteFormArray,
      this.cnoteTableForm,
      locationList,
      this.originName,
      this.originStatus
    );
    this.filter.Filter(
      this.jsoncnoteFormArray,
      this.cnoteTableForm,
      locationList,
      this.desName,
      this.desStatus
    );
    this.filter.Filter(
      this.jsoncnoteFormArray,
      this.cnoteTableForm,
      transMode,
      this.tranModeName,
      this.transModeStatus
    );
    this.filter.Filter(
      this.jsoncnoteFormArray,
      this.cnoteTableForm,
      customer,
      this.custName,
      this.custStatus
    );
  }

  async save() {
    const startValue = new Date(this.cnoteTableForm.controls.start.value);
    const endValue = new Date(this.cnoteTableForm.controls.end.value);
    // Fetch data from the service
    let data = await this.cnwGstService.getCNoteGSTregisterReportDetail(startValue, endValue);
    // Extract selected values from the form
    const payment = Array.isArray(this.cnoteTableForm.value.payTypeHandler)
      ? this.cnoteTableForm.value.payTypeHandler.map(x => x.name)
      : [];
    const tranMode = Array.isArray(this.cnoteTableForm.value.transModeHandler)
      ? this.cnoteTableForm.value.transModeHandler.map(x => x.name)
      : [];
    const tocity = Array.isArray(this.cnoteTableForm.value.toCityHandler)
      ? this.cnoteTableForm.value.toCityHandler.map(x => x.name)
      : [];
    const fromcity = Array.isArray(this.cnoteTableForm.value.fromCityHandler)
      ? this.cnoteTableForm.value.fromCityHandler.map(x => x.name)
      : [];
    const fromLocation = Array.isArray(this.cnoteTableForm.value.fromlocHandler)
      ? this.cnoteTableForm.value.fromlocHandler.map(x => x.value)
      : [];
    const toLocation = Array.isArray(this.cnoteTableForm.value.tolocHandler)
      ? this.cnoteTableForm.value.tolocHandler.map(x => x.value)
      : [];
    const cust = Array.isArray(this.cnoteTableForm.value.custHandler)
      ? this.cnoteTableForm.value.custHandler.map(x => x.name)
      : [];
    // Filter records based on form values
    const filteredRecords = data.filter(record => {
      const paytpDet = payment.length === 0 || payment.includes(record.payty);
      const custDet = cust.length === 0 || cust.includes(record.cSGNNM);
      const modeDet = tranMode.length === 0 || tranMode.includes(record.tranmode);
      const toCityDet = tocity.length === 0 || tocity.includes(record.tCT);
      const fromcityDet = fromcity.length === 0 || fromcity.includes(record.fCT);
      const fromLocDet = fromLocation.length === 0 || fromLocation.includes(record.oRGN);
      const toLocDet = toLocation.length === 0 || toLocation.includes(record.dEST);

      return paytpDet && modeDet && toCityDet && fromcityDet && fromLocDet && toLocDet && custDet;
    });
    // Assuming you have your selected data in a variable called 'selectedData'
    // const selectedData = filteredRecords;
    if (filteredRecords.length === 0) {
      // Display a message or take appropriate action when no records are found
      if (filteredRecords) {
        Swal.fire({
          icon: "error",
          title: "No Records Found",
          text: "Cannot Download CSV",
          showConfirmButton: true,
        });
      }
      return;
    }
    const filteredRecordsWithoutKeys = filteredRecords.map((record) => {
      const { tCT, fCT, oRGN, dEST, cSGNNM, ...rest } = record;
      return rest;
    });
    // exportAsExcelFile(filteredRecordsWithoutKeys, `Cnote_GST_Wise_Register_Report-${timeString}`, this.CSVHeader);
  }

  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;
    const index = this.jsoncnoteFormArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsoncnoteFormArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.cnoteTableForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }

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
}

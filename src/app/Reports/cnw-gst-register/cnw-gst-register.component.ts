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
import { CnwGstService, convertToCSV } from 'src/app/Utility/module/reports/cnw.gst.service';
import { DatePipe } from '@angular/common';
import { timeString } from 'src/app/Utility/date/date-utils';

@Component({
  selector: 'app-cnw-gst-register',
  templateUrl: './cnw-gst-register.component.html'
})
export class CnwGstRegisterComponent implements OnInit {
  breadScrums = [
    {
      title: "CNote wise GST Register Report",
      items: ["Home"],
      active: "Job Register Report",
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
  tableData: any[];
  METADATA = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };
  allColumnFilter: any;
  filterColumn: boolean = true;

  dynamicControls = {
    add: false,
    edit: true,
    csv: true,
  };

  columnHeader = {
    docketNumber: {
      Title: "CNote No",
      class: "matcolumncenter",
      Style: "max-width:200px",
    },
    docketDate: {
      Title: "CNote Date",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    billingParty: {
      Title: "Billing Party",
      class: "matcolumncenter",
      Style: "min-width:150px",
    },
    movementType: {
      Title: "Movement Type",
      class: "matcolumncenter",
      Style: "max-width:90px",
    },
    payType: {
      Title: "Payment Mode",
      class: "matcolumncenter",
      Style: "max-width:90px",
    },
    origin: {
      Title: "Origin",
      class: "matcolumncenter",
      Style: "max-width:90px",
    },
    destination: {
      Title: "Destination",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    fromCity: {
      Title: "From City",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    toCity: {
      Title: "To City",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    prqNo: {
      Title: "PRQ No",
      class: "matcolumncenter",
      Style: "max-width:200px",
    },
    transMode: {
      Title: "Transport Mode",
      class: "matcolumncenter",
      Style: "max-width:90px",
    },
    vendorType: {
      Title: "Vendor Type",
      class: "matcolumncenter",
      Style: "max-width:90px",
    },
    vendorName: {
      Title: "Vendor Name",
      class: "matcolumncenter",
      Style: "min-width:100px",
    },
    pAddress: {
      Title: "Pickup Address",
      class: "matcolumncenter",
      Style: "min-width:100px",
    },
    dAddress: {
      Title: "Delivery Address",
      class: "matcolumncenter",
      Style: "min-width:100px",
    },
    prLrNo: {
      Title: "PR LR No",
      class: "matcolumncenter",
      Style: "max-width:90px",
    },
    pck_type: {
      Title: "Packing Type",
      class: "matcolumncenter",
      Style: "max-width:90px",
    },
    wt_in: {
      Title: "Wt In",
      class: "matcolumncenter",
      Style: "max-width:90px",
    },
    gpChDel: {
      Title: "GP/CH/Del",
      class: "matcolumncenter",
      Style: "max-width:90px",
    },
    risk: {
      Title: "Risk",
      class: "matcolumncenter",
      Style: "min-width:100px",
    },
    deltype: {
      Title: "Delivery Type",
      class: "matcolumncenter",
      Style: "min-width:100px",
    },
    issuingFrom: {
      Title: "Issuing From",
      class: "matcolumncenter",
      Style: "max-width:90px",
    },
    vehicleNo: {
      Title: "Lorry No",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    consignorName: {
      Title: "Consignor Name",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    consignorCntNo: {
      Title: "Consignor Cnt No",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    consigneeName: {
      Title: "Consignee Name",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    consigneeCntNo: {
      Title: "Consignee Cnt No",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    ewayBill: {
      Title: "EWay Bill No",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    expDt: {
      Title: "Expiry Date",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    invoiceNo: {
      Title: "Invoice No",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    invoiceAmt: {
      Title: "Invoice Amt (₹)",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    NoofPck: {
      Title: "No of Package",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    materialNm: {
      Title: "Material Name",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    actualWt: {
      Title: "Actual Wt (MT)",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    charWt: {
      Title: "Charged Wt (MT)",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    freightRt: {
      Title: "Freight Rt (₹)",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    freightRtTp: {
      Title: "Freight Rt Type",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    freightAmt: {
      Title: "Freight Amt (₹)",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    otherAmt: {
      Title: "Other Amt (₹)",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    grossAmt: {
      Title: "Gross Amt (₹)",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    rcm: {
      Title: "RCM",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    gstAmt: {
      Title: "GST Amt (₹)",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    gstcharAmt: {
      Title: "GST Charged Amt (₹)",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    TotAmt: {
      Title: "Total Amt (₹)",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
  }

  staticField = [
    "docketNumber",
    "docketDate",
    "billingParty",
    "movementType",
    "payType",
    "origin",
    "fromCity",
    "toCity",
    "destination",
    "prqNo",
    "transMode",
    "vendorType",
    "vendorName",
    "pAddress",
    "dAddress",
    "prLrNo",
    "pck_type",
    "wt_in",
    "gpChDel",
    "risk",
    "deltype",
    "issuingFrom",
    "vehicleNo",
    "consignorName",
    "consignorCntNo",
    "consigneeName",
    "consigneeCntNo",
    "ewayBill",
    "expDt",
    "invoiceNo",
    "invoiceAmt",
    "NoofPck",
    "materialNm",
    "actualWt",
    "charWt",
    "freightRt",
    "freightRtTp",
    "freightAmt",
    "otherAmt",
    "grossAmt",
    "rcm",
    "gstAmt",
    "gstcharAmt",
    "TotAmt"
  ]

  headerForCsv = {
    "docketNumber": "Consignment Note No",
    "docketDate": "Consignment Note Date",
    "billingParty": "Billing Party",
    "movementType": "Movement Type",
    "payType": "Payment Mode",
    "origin": "Origin",
    "fromCity": "From City",
    "toCity": "To City",
    "destination": "Destination",
    "prqNo": "PRQ No",
    "transMode": "Transport Mode",
    "vendorType": "Vendor Type",
    "vendorName": "Vendor Name",
    "pAddress": "Pickup Address",
    "dAddress": "Delivery Address",
    "prLrNo": "PR LR No",
    "pck_type": "Packaging Type",
    "wt_in": "Weight In",
    "gpChDel": "GP/CH/Del",
    "risk": "Risk",
    "deltype": "Delivery Type",
    "issuingFrom": "Issuing From",
    "vehicleNo": " Lorry No",
    "consignorName": " Consignor Name",
    "consignorCntNo": " Consignor Contact Number",
    "consigneeName": "Consignee Name",
    "consigneeCntNo": "Consignee Contact Number",
    "ewayBill": "EWay Bill",
    "expDt": "Expiry Date",
    "invoiceNo": "Invoice Number",
    "invoiceAmt": "Invoice Amount (₹)",
    "NoofPck": "No of Package",
    "materialNm": " Material Number",
    "actualWt": "Actual Weight",
    "charWt": "Charged Wight",
    "freightRt": "Freight Rate",
    "freightRtTp": "Freight Rate Type",
    "freightAmt": "Freight Amount (₹)",
    "otherAmt": "Other Amount (₹)",
    "grossAmt": "Gross Amount (₹)",
    "rcm": "RCM",
    "gstAmt": "GST Amount (₹)",
    "gstcharAmt": "GST Charged Amount (₹)",
    "TotAmt": "Total Amount (₹)"
  }

  payName: any;
  payStatus: any;
  tranModeName: any;
  transModeStatus: any;
  csvFileName: string;
  constructor(
    private filter: FilterUtils,
    private fb: UntypedFormBuilder,
    private locationService: LocationService,
    private generalService: GeneralService,
    private pinCodeService: PinCodeService,
    private cnwGstService: CnwGstService
  ) {
    this.initializeFormControl();
    this.allColumnFilter = this.columnHeader;
    this.csvFileName = `Cnote_GST_Wise_Register_Report-${timeString}.csv`;
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
    const paymentType: AutoComplateCommon[] = await this.generalService.getGeneralMaster('PAYTYP');
    const transMode: AutoComplateCommon[] = await this.generalService.getGeneralMaster('tran_mode');
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
      paymentType,
      this.payName,
      this.payStatus
    );
    this.filter.Filter(
      this.jsoncnoteFormArray,
      this.cnoteTableForm,
      transMode,
      this.tranModeName,
      this.transModeStatus
    );
  }

  async save() {
    let data = await this.cnwGstService.getCNoteGSTregisterReportDetail();
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
    const filteredRecords = data.filter(record => {
      const paytpDet = payment.length === 0 || payment.includes(record.payType);
      const modeDet = tranMode.length === 0 || tranMode.includes(record.transMode);
      const toCityDet = tocity.length === 0 || tocity.includes(record.toCity);
      const fromcityDet = fromcity.length === 0 || fromcity.includes(record.fromCity);
      const fromLocDet = fromLocation.length === 0 || fromLocation.includes(record.origin);
      const toLocDet = toLocation.length === 0 || toLocation.includes(record.destination);

      // const startDate = this.datePipe.transform(this.cnoteTableForm.controls.start.value, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
      // const endDate = this.datePipe.transform(this.cnoteTableForm.controls.end.value, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
      // const entryTime = record.odocketDate;
      // const isDateRangeValid = startDate <= entryTime && entryTime < endDate;

      return paytpDet && modeDet && toCityDet && fromcityDet && fromLocDet && toLocDet;
    });

    // Assuming you have your selected data in a variable called 'selectedData'
    const selectedData = filteredRecords;

    // Convert the selected data to a CSV string
    const csvString = convertToCSV(selectedData, this.headerForCsv);

    // Create a Blob (Binary Large Object) from the CSV string
    const blob = new Blob([csvString], { type: 'text/csv' });

    // Create a link element
    const a = document.createElement('a');

    // Set the href attribute of the link to the Blob URL
    a.href = URL.createObjectURL(blob);

    // Set the download attribute with the desired file name
    a.download = this.csvFileName;

    // Append the link to the body
    document.body.appendChild(a);

    // Trigger a click on the link to start the download
    a.click();

    // Remove the link from the body
    document.body.removeChild(a);
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

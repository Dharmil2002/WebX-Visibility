import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import moment from 'moment';
import { Subject, firstValueFrom, take, takeUntil } from 'rxjs';
import { timeString } from 'src/app/Utility/date/date-utils';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { StateService } from 'src/app/Utility/module/masters/state/state.service';
import { CustGSTInvoiceService, exportAsExcelFile } from 'src/app/Utility/module/reports/customer-wise-gst-invoice-service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { customerWiseGSTInvControl } from 'src/assets/FormControls/Customer-Wise-GST-Invoice/customer-wise-gst-invoice';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-wise-gst-invoice',
  templateUrl: './customer-wise-gst-invoice.component.html'
})
export class CustomerWiseGstInvoiceComponent implements OnInit {

  breadScrums = [
    {
      title: "Customer wise GST Invoice Register Report ",
      items: ["Home"],
      active: "Customer wise GST Invoice Register Report ",
    },
  ];
  CustGSTInvTableForm: UntypedFormGroup
  jsonCustGSTInvFormArray: any
  cusWiseGSTInvFormControls: customerWiseGSTInvControl
  protected _onDestroy = new Subject<void>();
  sacName: any;
  sacStatus: any;
  allData: {
    custNameData: any;
    sacData: any
  };
  custName: any;
  custStatus: any;
  stateName: any;
  stateStatus: any;

  constructor(
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private storage: StorageService,
    private masterServices: MasterService,
    private custGSTInvoiceService: CustGSTInvoiceService,
    private objStateService: StateService
  ) {
    this.initializeFormControl();
  }

  CSVHeader = {
    "BILLNO": "Bill No",
    "BILLDT": "Bill Date",
    "DocumentType": "Document Type",
    "BILLSTATUS": "Bill Status",
    "BillGenState": "Bill Gen State",
    "BillBanch": "Bill Banch",
    "Generation_GSTNO": "Generation GSTNO",
    "Party": "Party",
    "PartyType": "Party Type",
    "BillToState": "Bill To State",
    "PartyGSTN": "Party GSTN",
    "BillSubAt": "Bill Sub At",
    "BusinessType": "Business Type",
    "Total_Taxable_Value": "Total Taxable Value",
    "SAC": "SAC",
    "GSTRATE": "GST RATE",
    "GSTTotal": "GST Total",
    "RCM": "RCM",
    "IGST": "IGST",
    "CGST": "CGST",
    "SGSTUGST": "SGSTUGST",
    "CNAMT": "CNAMT",
    "Discount": "Discount",
    "TotalInvoice_Value": "Total Invoice Value",
    "TDSRate": "TDS Rate",
    "TDSAmount": "TDS Amount",
    "TDSSec": "TDS Sec",
    "ReasonForIssue": "ReasonForIssue",
    "InvoiceNo": "Invoice No",
    "Manualno": "Manualno",
    "Currency": "Currency",
    "ExchangeRate": "Exchange Rate",
    "CurrencyAmount": "Currency Amount",
    "GstExempted": "Gst Exempted",
    "PayBasis": "Pay Basis",
    "Narration": "Narration",
    "UserId": "UserId",
    "ExemptionCategory": "GST Exemption Category",
    "IrnNo": "IrnNo",
  }

  ngOnInit(): void {
    const now = moment().endOf('day').toDate();
    const lastweek = moment().add(-10, 'days').startOf('day').toDate()

    // Set the 'start' and 'end' controls in the form to the last week and current date, respectively
    this.CustGSTInvTableForm.controls["start"].setValue(lastweek);
    this.CustGSTInvTableForm.controls["end"].setValue(now);
    this.getDropDownList();

  }

  initializeFormControl() {
    this.cusWiseGSTInvFormControls = new customerWiseGSTInvControl();
    this.jsonCustGSTInvFormArray = this.cusWiseGSTInvFormControls.custWiseGSTInvControlArray
    this.custName = this.jsonCustGSTInvFormArray.find(
      (data) => data.name === "custnmcd"
    )?.name;
    this.custStatus = this.jsonCustGSTInvFormArray.find(
      (data) => data.name === "custnmcd"
    )?.additionalData.showNameAndValue;
    this.sacName = this.jsonCustGSTInvFormArray.find(
      (data) => data.name === "saccd"
    )?.name;
    this.sacStatus = this.jsonCustGSTInvFormArray.find(
      (data) => data.name === "saccd"
    )?.additionalData.showNameAndValue;
    this.stateName = this.jsonCustGSTInvFormArray.find(
      (data) => data.name === "gststate"
    )?.name;
    this.stateStatus = this.jsonCustGSTInvFormArray.find(
      (data) => data.name === "gststate"
    )?.additionalData.showNameAndValue;
    this.CustGSTInvTableForm = formGroupBuilder(this.fb, [this.jsonCustGSTInvFormArray]);
  }

  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;
    const index = this.jsonCustGSTInvFormArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonCustGSTInvFormArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.CustGSTInvTableForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }
  async getDropDownList() {
    let custNameReq = {
      "companyCode": this.storage.companyCode,
      "filter": {},
      "collectionName": "customer_detail"
    };
    let sacReq = {
      "companyCode": this.storage.companyCode,
      "filter": {},
      "collectionName": "sachsn_master"
    };
    const custNameRes = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", custNameReq));
    const sacRes = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", sacReq));
    const mergedData = {
      custNameData: custNameRes?.data,
      sacData: sacRes?.data
    };

    this.allData = mergedData;

    const custNameDet = mergedData.custNameData
      .map(element => ({
        name: element.customerName.toString(),
        value: element.customerCode.toString()
      }));

    const sacDet = mergedData.sacData
      .filter(element => element.SNM !== "" && element.SNM !== undefined && element.SNM !== null)
      .map(element => ({
        name: element.SNM,
        value: element.SID,
      }));

    const statelist = await this.objStateService.getState();

    this.filter.Filter(
      this.jsonCustGSTInvFormArray,
      this.CustGSTInvTableForm,
      custNameDet,
      this.custName,
      this.custStatus
    );
    this.filter.Filter(
      this.jsonCustGSTInvFormArray,
      this.CustGSTInvTableForm,
      sacDet,
      this.sacName,
      this.sacStatus
    );
    this.filter.Filter(
      this.jsonCustGSTInvFormArray,
      this.CustGSTInvTableForm,
      statelist,
      this.stateName,
      this.stateStatus
    );
  }

  //#region to apply filters and based on that download excel file
  async save() {
    // Extracting values from the form controls


    const startValue = new Date(this.CustGSTInvTableForm.controls.start.value);
    const endValue = new Date(this.CustGSTInvTableForm.controls.end.value);

    const startDate = moment(startValue).startOf('day').toDate();
    const endDate = moment(endValue).endOf('day').toDate();
  
    const docummentNo = this.CustGSTInvTableForm.value.docNo;
    const cancelBill = this.CustGSTInvTableForm.value.cannon;

    // Splitting docNo into an array if it contains a comma
    const docNoArray = docummentNo.includes(',') ? docummentNo.split(',') : [docummentNo];

    // Extracting customer names from custnmcdHandler if it's an array
    const customerName = Array.isArray(this.CustGSTInvTableForm.value.custnmcdHandler)
      ? this.CustGSTInvTableForm.value.custnmcdHandler.map(x => x.value)
      : [];

    // Extracting saccdHandler, gststateHandler values
    const sacData = Array.isArray(this.CustGSTInvTableForm.value.saccdHandler)
      ? this.CustGSTInvTableForm.value.saccdHandler.map(x => x.value)
      : [];

    const stateData = Array.isArray(this.CustGSTInvTableForm.value.gststateHandler)
      ? this.CustGSTInvTableForm.value.gststateHandler.map(x => x.name)
      : [];
    const requestbody = { startDate, endDate, docNoArray, stateData, customerName }
   // console.log(requestbody);

    // Fetching data from the service based on provided parameters
    let data = await this.custGSTInvoiceService.getcustomerGstRegisterReportDetail(requestbody);

    // Filtering data based on cancelled status
    const filteredRecord = cancelBill === 'Cancelled' ? data.find(record => record.BILLSTATUS === 'Cancelled') : data;

    // Checking if there are records after filtering and displaying an error if not
    if (!filteredRecord || (Array.isArray(filteredRecord) && filteredRecord.length === 0)) {
      Swal.fire({
        icon: "error",
        title: "No Records Found",
        text: "Cannot Download CSV",
        showConfirmButton: true,
      });
      return;
    }

    // Exporting filtered data to Excel
    exportAsExcelFile(filteredRecord, `Customer_Wise_GST_Invoice_Register_Report-${timeString}.csv`, this.CSVHeader);
  }
  //#endregion

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
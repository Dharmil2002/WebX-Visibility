import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subject, firstValueFrom, take, takeUntil } from 'rxjs';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { timeString } from 'src/app/Utility/date/date-utils';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { StateService } from 'src/app/Utility/module/masters/state/state.service';
import { VendorGSTInvoiceService, exportAsExcelFile } from 'src/app/Utility/module/reports/vendor-gst-invoice';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { vendorWiseGSTControl } from 'src/assets/FormControls/Vendor-Wise-GST-Register-Report/vendor-wise-gst-register';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vendor-wise-gst-invoice-register',
  templateUrl: './vendor-wise-gst-invoice-register.component.html'
})
export class VendorWiseGstInvoiceRegisterComponent implements OnInit {

  allData: {
    venNameData: any;
    sacData: any
  };
  breadScrums = [
    {
      title: "Vendor Wise GST Invoice Register Report",
      items: ["Home"],
      active: "Vendor Wise GST Invoice Register Report",
    },
  ];
  vendorgstregisTableForm: UntypedFormGroup
  jsonvendgstregisFormArray: any
  vengstFormControls: vendorWiseGSTControl
  protected _onDestroy = new Subject<void>();
  vendorDetail: any;
  vendorDetailList: any;
  venNameDet: any;
  vendorName: any;
  vendorStatus: any;
  sacList: any;
  sacDet: any;
  sacName: any;
  sacStatus: any;
  stateName: any;
  stateStatus: any;

  constructor(
    private storage: StorageService,
    private masterServices: MasterService,
    private filter: FilterUtils,
    private fb: UntypedFormBuilder,
    private vendorGSTInvoiceService: VendorGSTInvoiceService,
    private objStateService: StateService

  ) {
    this.initializeFormControl()
  }

  CSVHeader = {
    "BILLNO": "BILLNO",
    "BILLDT": "BILLDT",
    "DocumentType": "DocumentType",
    "BILLSTATUS": "BILLSTATUS",
    "BillGenState": "Bill Gen State",
    "BillBanch": "Bill Banch",
    "Generation_GSTNO": "Generation GSTNO",
    "Party": "Party",
    "PartyType": "PartyType",
    "Bill_To_State": "Bill To State",
    "Party_GSTN": "Party GSTN",
    "Bill_Sub_At": "Bill Sub At",
    "BusinessType": "Business Type",
    "Total_Taxable_Value": "Total Taxable Value",
    "SAC": "SAC",
    "TCS_Rate": "TCS Rate",
    "TCS_Amount": "TCS Amount",
    "GSTRATE": "GSTRATE",
    "RCM": "RCM",
    "IGST": "IGST",
    "CGST": "CGST",
    "SGST_UGST": "SGST UGST",
    "Total_Invoice_Value": "Total Invoice Value",
    "TDS_Rate": "TDS Rate",
    "TDS_Amount": "TDS Amount",
    "TDS Ledger ": "TDS Ledger ",
    "TDS Section Description ": "TDS Section Description ",
    "REMARK": "REMARK",
    "ReceiverName": "Receiver Name",
    "ApplicableTax": "Applicable Tax",
    "ECommerceGSTIN": "ECommerce GSTIN",
    "VENDORBILLDT": "VENDOR BILL DATE",
    "MANUALBILLNO": "MANUAL BILL NO",
    "Currency": "Currency",
    "ExchangeRt": "Exchange Rate",
    "CurrencyAmt": "Currency Amount",
    "PayBasis": "PayBasis",
    "Narration": "Narration",
    "UserId": "UserId",
    "GSTExemptionCat": "GST Exemption Category",
    "IrnNo": "IrnNo",
    "InvNetValue": "Invoice Net Value",
  }

  ngOnInit(): void {
    const now = new Date();
    const lastweek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 10
    );
    // Set the 'start' and 'end' controls in the form to the last week and current date, respectively
    this.vendorgstregisTableForm.controls["start"].setValue(lastweek);
    this.vendorgstregisTableForm.controls["end"].setValue(now);
    this.getDropDownList()
  }

  initializeFormControl() {
    this.vengstFormControls = new vendorWiseGSTControl();
    this.jsonvendgstregisFormArray = this.vengstFormControls.vendorwisegstControlArray;
    this.vendorName = this.jsonvendgstregisFormArray.find(
      (data) => data.name === "vennmcd"
    )?.name;
    this.vendorStatus = this.jsonvendgstregisFormArray.find(
      (data) => data.name === "vennmcd"
    )?.additionalData.showNameAndValue;
    this.sacName = this.jsonvendgstregisFormArray.find(
      (data) => data.name === "saccd"
    )?.name;
    this.sacStatus = this.jsonvendgstregisFormArray.find(
      (data) => data.name === "saccd"
    )?.additionalData.showNameAndValue;
    this.stateName = this.jsonvendgstregisFormArray.find(
      (data) => data.name === "gststate"
    )?.name;
    this.stateStatus = this.jsonvendgstregisFormArray.find(
      (data) => data.name === "gststate"
    )?.additionalData.showNameAndValue;

    this.vendorgstregisTableForm = formGroupBuilder(this.fb, [this.jsonvendgstregisFormArray]);
  }

  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;
    const index = this.jsonvendgstregisFormArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonvendgstregisFormArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.vendorgstregisTableForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }

  async getDropDownList() {
    let venNameReq = {
      "companyCode": this.storage.companyCode,
      "filter": {},
      "collectionName": "vendor_detail"
    };
    let sacReq = {
      "companyCode": this.storage.companyCode,
      "filter": {},
      "collectionName": "sachsn_master"
    };
    const venNameRes = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", venNameReq));
    const sacRes = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", sacReq));
    const mergedData = {
      venNameData: venNameRes?.data,
      sacData: sacRes?.data
    };

    this.allData = mergedData;

    const venNameDet = mergedData.venNameData
      .map(element => ({
        name: element.vendorName.toString(),
        value: element.vendorCode.toString(),
        type: element.vendorType.toString(),
      }));
    const sacDet = mergedData.sacData.map(element => ({
      name: element.SNM,
      value: element.SHCD
    }));

    this.vendorDetailList = venNameDet;
    this.sacList = sacDet;

    this.venNameDet = venNameDet;
    this.sacDet = sacDet;
    const statelist = await this.objStateService.getState();

    this.filter.Filter(
      this.jsonvendgstregisFormArray,
      this.vendorgstregisTableForm,
      venNameDet,
      this.vendorName,
      this.vendorStatus
    );
    this.filter.Filter(
      this.jsonvendgstregisFormArray,
      this.vendorgstregisTableForm,
      sacDet,
      this.sacName,
      this.sacStatus
    );

    this.filter.Filter(
      this.jsonvendgstregisFormArray,
      this.vendorgstregisTableForm,
      statelist,
      this.stateName,
      this.stateStatus
    );

  }

  //#region to apply filters and download excel file
  async save() {

    // Extract values from the form
    const startValue = new Date(this.vendorgstregisTableForm.controls.start.value);
    const endValue = new Date(this.vendorgstregisTableForm.controls.end.value);
    const docummentNo = this.vendorgstregisTableForm.value.docNo;
    const cancelBill = this.vendorgstregisTableForm.value.cannon;

    // Check if a comma is present in docNo
    const docNoArray = docummentNo.includes(',') ? docummentNo.split(',') : [docummentNo];

    // Extract vendor names from vennmcdHandler if it's an array
    const vendrnm = Array.isArray(this.vendorgstregisTableForm.value.vennmcdHandler)
      ? this.vendorgstregisTableForm.value.vennmcdHandler.map(x => x.name)
      : [];

    // Get data from the service
    let data = await this.vendorGSTInvoiceService.getvendorGstRegisterReportDetail(startValue, endValue, docNoArray);

    // Extract saccdHandler, gststateHandler values
    const sacData = Array.isArray(this.vendorgstregisTableForm.value.saccdHandler)
      ? this.vendorgstregisTableForm.value.saccdHandler.map(x => x.name)
      : [];

    const stateData = Array.isArray(this.vendorgstregisTableForm.value.gststateHandler)
      ? this.vendorgstregisTableForm.value.gststateHandler.map(x => x.name)
      : [];

    // Filter data based on SAC (Service Accounting Code)
    data = data.filter(record => {
      const recordSacLowerCase = record.SAC.toLowerCase(); // Convert to lowercase for case-insensitive comparison
      const isSacDataEmpty = sacData.length === 0;
      const isSacIncluded = isSacDataEmpty || sacData.some(sac => recordSacLowerCase.includes(sac.toLowerCase()));
      return isSacIncluded;
    });

    // Filter data based on state
    data = data.filter(record => {
      const sacDet = stateData.length === 0 || stateData.includes(record.BillGenState);
      return sacDet;
    });

    // Filter data based on vendor names
    data = data.filter(record => {
      const partyName = record.Party.split(':')[1]?.trim().toLowerCase(); // Extract and convert to lowercase
      const vendrnmLowerCase = vendrnm.map(name => name.toLowerCase()); // Convert array elements to lowercase
      const isVendrnmEmpty = vendrnmLowerCase.length === 0;
      const isPartyIncluded = isVendrnmEmpty || vendrnmLowerCase.includes(partyName);
      return isPartyIncluded;
    });

    // Filter data based on cancelled status
    const filteredRecord = cancelBill === 'Cancelled' ? data.find(record => record.BILLSTATUS === 'Cancelled') : data;

    // Check if there are records after filtering
    if (!filteredRecord || (Array.isArray(filteredRecord) && filteredRecord.length === 0)) {
      Swal.fire({
        icon: "error",
        title: "No Records Found",
        text: "Cannot Download CSV",
        showConfirmButton: true,
      });
      return;
    }

    // Export the record to Excel
    exportAsExcelFile(filteredRecord, `Vendor_Wise_GST_Invoice_Register_Report-${timeString}`, this.CSVHeader);
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

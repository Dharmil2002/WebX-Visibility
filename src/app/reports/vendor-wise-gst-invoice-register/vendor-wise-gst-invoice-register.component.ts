import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { timeString } from 'src/app/Utility/date/date-utils';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { VendorService } from 'src/app/Utility/module/masters/vendor-master/vendor.service';
import { VendorGSTInvoiceService, convertToCSV } from 'src/app/Utility/module/reports/vendor-gst-invoice';
import { VendorDetail } from 'src/app/core/models/Masters/vendor-master/vendor-master';
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
      title: "Vendor Wise GST Register Report",
      items: ["Home"],
      active: "Vendor Wise GST Register Report",
    },
  ];
  vendorgstregisTableForm: UntypedFormGroup
  jsonvendgstregisFormArray: any
  vengstFormControls: vendorWiseGSTControl
  vendorDetail: any;
  vendorDetailList: any;
  venNameDet: any;
  vendorName: any;
  vendorStatus: any;
  sacList: any;
  sacDet: any;
  sacName: any;
  sacStatus: any;

  constructor(
    private storage: StorageService,
    private masterServices: MasterService,
    private filter: FilterUtils,
    private fb: UntypedFormBuilder,
    private vendorGSTInvoiceService: VendorGSTInvoiceService
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
    this.vendorgstregisTableForm = formGroupBuilder(this.fb, [this.jsonvendgstregisFormArray]);
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

  }

  async save() {
    let data = await this.vendorGSTInvoiceService.getvendorGstRegisterReportDetail();
    const sacData = Array.isArray(this.vendorgstregisTableForm.value.saccdHandler)
      ? this.vendorgstregisTableForm.value.saccdHandler.map(x => x.name)
      : [];
    const filteredRecords = data.filter(record => {
      const sacDet = sacData.length === 0 || sacData.includes(record.sac);
      const startValue = new Date(this.vendorgstregisTableForm.controls.start.value);
      const endValue = new Date(this.vendorgstregisTableForm.controls.end.value);
      const entryTime = new Date(record.entrydt);
      endValue.setHours(23, 59, 59, 999);
      const isDateRangeValid = entryTime >= startValue && entryTime <= endValue;

      return isDateRangeValid && sacDet;
    });
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
    // Convert the selected data to a CSV string 
    const csvString = convertToCSV(filteredRecords, this.CSVHeader);
    // Create a Blob (Binary Large Object) from the CSV string
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    // Create a link element
    const a = document.createElement('a');
    // Set the href attribute of the link to the Blob URL
    a.href = URL.createObjectURL(blob);
    // Set the download attribute with the desired file name
    a.download = `Vendor_Wise_GST_Invoice_Register_Report-${timeString}.csv`;
    // Append the link to the body
    document.body.appendChild(a);
    // Trigger a click on the link to start the download
    a.click();
    // Remove the link from the body
    document.body.removeChild(a);
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

import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { timeString } from 'src/app/Utility/date/date-utils';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { CustGSTInvoiceService, convertToCSV } from 'src/app/Utility/module/reports/customer-wise-gst-invoice-service';
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
  sacName: any;
  sacStatus: any;
  allData: {
    custNameData: any;
    sacData: any
  };
  customerDetailList: any;
  sacList: any;
  custNameDet: any;
  sacDet: any;
  custName: any;
  custStatus: any;

  constructor(
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private storage: StorageService,
    private masterServices: MasterService,
    private custGSTInvoiceService: CustGSTInvoiceService
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
    const now = new Date();
    const lastweek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 10
    );
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
    this.CustGSTInvTableForm = formGroupBuilder(this.fb, [this.jsonCustGSTInvFormArray]);
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
        name: element.customerCode.toString(),
        value: element.customerName.toString(),
      }));
    const sacDet = mergedData.sacData.map(element => ({
      name: element.SNM,
      value: element.SHCD
    }));

    this.customerDetailList = custNameDet;
    this.sacList = sacDet;

    this.custNameDet = custNameDet;
    this.sacDet = sacDet;

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

  }

  async save() {
    let data = await this.custGSTInvoiceService.getcustomerGstRegisterReportDetail();
    const filteredRecords = data.filter(record => {
      const startValue = new Date(this.CustGSTInvTableForm.controls.start.value);
      const endValue = new Date(this.CustGSTInvTableForm.controls.end.value);
      const entryTime = new Date(record.obGNDT);
      endValue.setHours(23, 59, 59, 999);
      const isDateRangeValid = entryTime >= startValue && entryTime <= endValue;

      return isDateRangeValid;
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
    a.download = `Customer_Wise_GST_Invoice_Register_Report-${timeString}.csv`;
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

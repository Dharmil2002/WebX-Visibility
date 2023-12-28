import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { timeString } from 'src/app/Utility/date/date-utils';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { VendorWiseOutService, convertToCSV } from 'src/app/Utility/module/reports/vendor-wise-outstanding';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { vendOutControl } from 'src/assets/FormControls/Vendor-Outstanding-report/vendor-outstanding-report';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vendor-outstanding-report',
  templateUrl: './vendor-outstanding-report.component.html'
})
export class VendorOutstandingReportComponent implements OnInit {

  breadScrums = [
    {
      title: "Vendor Wise Outstanding Report ",
      items: ["Home"],
      active: "Vendor Wise Outstanding Report ",
    },
  ];
  VendWiseOutTableForm: UntypedFormGroup
  jsonVendWiseOutFormArray: any
  vendoutFormControl: vendOutControl
  locName: any;
  locStatus: any;
  vendorName: any;
  vendorStatus: any;
  allData: {
    venNameData: any;
    venTypeData: any;
  };
  vendorDetailList: any;
  venNameDet: any;
  venTypeDet: any;
  vendTypeDetail: any;
  vendorTypeName: any;
  vendorTypeStatus: any;

  constructor(
    private fb: UntypedFormBuilder,
    private locationService: LocationService,
    private filter: FilterUtils,
    private storage: StorageService,
    private masterServices: MasterService,
    private vendorWiseOutService: VendorWiseOutService
  ) {
    this.initializeFormControl()
  }

  ngOnInit(): void {
    const now = new Date();
    const lastweek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 10
    );
    // Set the 'start' and 'end' controls in the form to the last week and current date, respectively
    this.VendWiseOutTableForm.controls["start"].setValue(lastweek);
    this.VendWiseOutTableForm.controls["end"].setValue(now);
    this.getDropDownList()
  }

  initializeFormControl() {
    this.vendoutFormControl = new vendOutControl();
    this.jsonVendWiseOutFormArray = this.vendoutFormControl.VendOutControlArray;
    this.locName = this.jsonVendWiseOutFormArray.find(
      (data) => data.name === "loc"
    )?.name;
    this.locStatus = this.jsonVendWiseOutFormArray.find(
      (data) => data.name === "loc"
    )?.additionalData.showNameAndValue;
    this.vendorName = this.jsonVendWiseOutFormArray.find(
      (data) => data.name === "vennmcd"
    )?.name;
    this.vendorStatus = this.jsonVendWiseOutFormArray.find(
      (data) => data.name === "vennmcd"
    )?.additionalData.showNameAndValue;
    this.vendorTypeName = this.jsonVendWiseOutFormArray.find(
      (data) => data.name === "vendtype"
    )?.name;
    this.vendorTypeStatus = this.jsonVendWiseOutFormArray.find(
      (data) => data.name === "vendtype"
    )?.additionalData.showNameAndValue;
    this.VendWiseOutTableForm = formGroupBuilder(this.fb, [this.jsonVendWiseOutFormArray]);
  }

  CSVHeader = {
    "srNo": "#",
    "vendorCD":"Vendor Code",
    "vendor": "Vendor",
    "openingBal": "Opening Balance",
    "totalBillAmtFrom010423To111223": "Total Bill Amount From 01 Apr 2023 To 11 Dec 2023",
    "paidAmtFrom010423To111223": "Paid Amount From 01 Apr 2023 To 11 Dec 2023",
    "finalized": "Finalized",
    "unFinalized": "Un-Finalized",
    "0-30": "0-30",
    "31-60": "31-60",
    "61-90": "61-90",
    "91-120": "91-120",
    "121-150": "121-150",
    "151-180": "151-180",
    ">180": ">180",
    "totalPayable": "Total Payable",
    "onAccountAmt": "On Account Amt",
    "manualVoucher": "Manual Voucher",
    "jVAmt": "JV Amount",
    "paidAdvanceAmount": "Paid Advance Amount",
    "ledgerBalance": "Ledger Balance"
  }

  async getDropDownList() {
    const locationList = await this.locationService.getLocationList();
    let venNameReq = {
      "companyCode": this.storage.companyCode,
      "filter": {},
      "collectionName": "vendor_detail"
    };
    const venNameRes = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", venNameReq));
    const mergedData = {
      venNameData: venNameRes?.data,
      venTypeData: venNameRes?.data,
    };
    this.allData = mergedData;
    const venNameDet = mergedData.venNameData
      .map(element => ({
        name: element.vendorName.toString(),
        value: element.vendorCode.toString(),
      }));
    const venTypeDet = mergedData.venTypeData
      .map(element => ({
        name: element.vendorType,
        value: element.vendorType,
      }));

    this.vendorDetailList = venNameDet;
    this.vendTypeDetail = venTypeDet;
    this.venNameDet = venNameDet;
    this.venTypeDet = venTypeDet
    this.filter.Filter(
      this.jsonVendWiseOutFormArray,
      this.VendWiseOutTableForm,
      venNameDet,
      this.vendorName,
      this.vendorStatus
    );
    this.filter.Filter(
      this.jsonVendWiseOutFormArray,
      this.VendWiseOutTableForm,
      venTypeDet,
      this.vendorTypeName,
      this.vendorTypeStatus
    );
    this.filter.Filter(
      this.jsonVendWiseOutFormArray,
      this.VendWiseOutTableForm,
      locationList,
      this.locName,
      this.locStatus
    );
  }

  async save() {
    let data = await this.vendorWiseOutService.getvendorWiseOutReportDetail();
    const locData = Array.isArray(this.VendWiseOutTableForm.value.locHandler)
      ? this.VendWiseOutTableForm.value.locHandler.map(x => x.name)
      : [];
    const vendNMData = Array.isArray(this.VendWiseOutTableForm.value.vendnmcdHandler)
      ? this.VendWiseOutTableForm.value.vendnmcdHandler.map(x => x.name)
      : [];
    const filteredRecords = data.filter(record => {
      const locDet = locData.length === 0 || locData.includes(record.lOC);
      const venNMDet = vendNMData.length === 0 || vendNMData.includes(record.Vendor);
      const startValue = new Date(this.VendWiseOutTableForm.controls.start.value);
      const endValue = new Date(this.VendWiseOutTableForm.controls.end.value);
      const entryTime = new Date(record.obDT);
      endValue.setHours(23, 59, 59, 999);
      const isDateRangeValid = entryTime >= startValue && entryTime <= endValue;

      return isDateRangeValid && locDet && venNMDet;
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
    a.download = `Vendor_Wise_Outstanding_Report-${timeString}.csv`;
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

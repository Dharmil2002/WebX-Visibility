import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { timeString } from 'src/app/Utility/date/date-utils';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { UnbillRegisterService, convertToCSV } from 'src/app/Utility/module/reports/unbill-register.service';
import { billRegControl } from 'src/assets/FormControls/Unbill-Register/unbill-register';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-unbill-register',
  templateUrl: './unbill-register.component.html'
})
export class UnbillRegisterComponent implements OnInit {
  breadScrums = [
    {
      title: "Bill Register Report ",
      items: ["Home"],
      active: "Bill Register Report ",
    },
  ];
  unbillRegisTableForm: UntypedFormGroup
  jsonunBillRegisFormArray: any
  unBillFormControls: billRegControl
  locName: any;
  locStatus: any;

  constructor(
    private fb: UntypedFormBuilder,
    private locationService: LocationService,
    private filter: FilterUtils,
    private unbillRegisterService: UnbillRegisterService
  ) {
    this.initializeFormControl();
  }

  ngOnInit(): void {
    const now = new Date();
    const lastweek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 10
    );
    // Set the 'start' and 'end' controls in the form to the last week and current date, respectively
    this.unbillRegisTableForm.controls["start"].setValue(lastweek);
    this.unbillRegisTableForm.controls["end"].setValue(now);
    this.getDropDownList()
  }

  initializeFormControl() {
    this.unBillFormControls = new billRegControl();
    this.jsonunBillRegisFormArray = this.unBillFormControls.billRegControlArray;
    this.locName = this.jsonunBillRegisFormArray.find(
      (data) => data.name === "loc"
    )?.name;
    this.locStatus = this.jsonunBillRegisFormArray.find(
      (data) => data.name === "loc"
    )?.additionalData.showNameAndValue;
    this.unbillRegisTableForm = formGroupBuilder(this.fb, [this.jsonunBillRegisFormArray]);
  }

  async getDropDownList() {
    const locationList = await this.locationService.getLocationList();
    this.filter.Filter(
      this.jsonunBillRegisFormArray,
      this.unbillRegisTableForm,
      locationList,
      this.locName,
      this.locStatus
    );
  }

  CSVHeader = {
    "DocketNo": "Docket No",
    "DocketDate": "Docket Date",
    "ADD": "ADD",
    "EDD": "EDD",
    "ArrivedDate": "Arrived Date",
    "Origin": "Origin",
    "Destination": "Destination",
    "CurrentLocation": "Current Location",
    "PayBasis": "Pay Basis",
    "TransportMode": "TransportMode",
    "BookingType": "Booking Type",
    "ConsignorName": "Consignor Name",
    "ConsigneeName": "Consignee Name",
    "BillingPartyCode": "Billing Party Code",
    "BillingPartyName": "Billing Party Name",
    "PkgsNo": "Pkgs No",
    "ActualWeight": "Actual Weight",
    "ChargeWeight": "Charge Weight",
    "DocketTotal": "Docket Total",
    "SubTotal": "Sub Total",
    "FRTRate": "FRT Rate",
    "FRTType": "FRT Type",
    "FreightCharges": "Freight Charges",
    "DocketStatus": "Docket Status",
    "PackagingType": "Packaging Type",
    "PickupDelivery": "Pickup Delivery",
    "RegionalOffice": "Regional Office",
    "OriginZone": "Origin Zone",
    "DestinationZone": "Destination Zone",
    "Length": "Length",
    "Breadth": "Breadth",
    "Height": "Height",
    "TotalCFT": "Total CFT",
    "CFTRatio": "CFT Ratio",
    "PFMNo": "PFM No",
    "PFMDate": "PFM Date",
    "PFMEntryDate": "PFM Entry Date",
    "PFMEeneratedBranch": "PFM Generated Branch",
    "PFMGeneratedBY": "PFM Generated BY",
    "PFMReceivedDate": "PFM Received Date",
    "PFMAcknowlegedBranch": "PFM Acknowleged Branch",
    "PFMAcknowlegedBY": "PFM Acknowleged BY",
    "PFMStatus": "PFM Status",
    "JobNumber": "Job Number",
    "CHANumber": "CHA Number"
  }

  async save() {
    let data = await this.unbillRegisterService.getunbillRegisterReportDetail();
    const loc = Array.isArray(this.unbillRegisTableForm.value.locHandler)
      ? this.unbillRegisTableForm.value.locHandler.map(x => x.value)
      : [];
    const filteredRecords = data.filter(record => {
      const des = loc.length === 0 || loc.includes(record.Destination);
      const startValue = new Date(this.unbillRegisTableForm.controls.start.value);
      const endValue = new Date(this.unbillRegisTableForm.controls.end.value);
      const entryTime = new Date(record.odKTDT);
      endValue.setHours(23, 59, 59, 999);
      const isDateRangeValid = entryTime >= startValue && entryTime <= endValue;

      return isDateRangeValid && des
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
    a.download = `Unbilled_Register_Report-${timeString}.csv`;
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

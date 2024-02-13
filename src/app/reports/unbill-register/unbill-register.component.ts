import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subject, take, takeUntil } from 'rxjs';
import { timeString } from 'src/app/Utility/date/date-utils';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { UnbillRegisterService, convertToCSV, exportAsExcelFile } from 'src/app/Utility/module/reports/unbill-register.service';
import { billRegControl } from 'src/assets/FormControls/Reports/Unbill-Register/unbill-register';
// import { billRegControl } from 'src/assets/FormControls/Unbill-Register/unbill-register';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-unbill-register',
  templateUrl: './unbill-register.component.html'
})
export class UnbillRegisterComponent implements OnInit {
  breadScrums = [
    {
      title: "UnBilled Register Report ",
      items: ["Home"],
      active: "UnBilled Register Report ",
    },
  ];
  unbillRegisTableForm: UntypedFormGroup
  jsonunBillRegisFormArray: any
  unBillFormControls: billRegControl
  protected _onDestroy = new Subject<void>();
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

  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;
    const index = this.jsonunBillRegisFormArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonunBillRegisFormArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.unbillRegisTableForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
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
    const startValue = new Date(this.unbillRegisTableForm.controls.start.value);
    const endValue = new Date(this.unbillRegisTableForm.controls.end.value);
    let data = await this.unbillRegisterService.getunbillRegisterReportDetail(startValue,endValue);
    const loc = Array.isArray(this.unbillRegisTableForm.value.locHandler)
      ? this.unbillRegisTableForm.value.locHandler.map(x => x.value)
      : [];
    const filteredRecords = data.filter(record => {
      const des = loc.length === 0 || loc.includes(record.Destination); 

      return des
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
    // const filteredRecordsWithoutKeys = filteredRecords.map((record) => {
    //   const { odKTDT, ...rest } = record;
    //   return rest;
    // });
    exportAsExcelFile(filteredRecords, `Unbilled_Register_Report-${timeString}`, this.CSVHeader);
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

import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subject, firstValueFrom, take, takeUntil } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { PrqReportControl } from 'src/assets/FormControls/Reports/prq-register/prq-register';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { exportAsExcelFile, prqreportService } from 'src/app/Utility/module/reports/prq-register-service';
import Swal from 'sweetalert2';
import { timeString } from 'src/app/Utility/date/date-utils';
@Component({
  selector: 'app-prq-register-report',
  templateUrl: './prq-register-report.component.html'
})
export class PrqRegisterReportComponent implements OnInit {
  breadScrums = [
    {
      title: "PRQ Register Report",
      items: ["Home"],
      active: "PRQ Register Report",
    }
  ];
  prqregisterTableForm: UntypedFormGroup
  jsonprqregisterFormArray: any;
  prqregisterFormControl: PrqReportControl
  protected _onDestroy = new Subject<void>();
  billPCD: any;
  billPNM: any;
  allData: {
    billParty: any;
  };
  prqDetailList: any
  billPartyDet: any
  prqNoDet: any
  prqData: any;
  prqDet: any;
  constructor(
    private fb: UntypedFormBuilder,
    private storage: StorageService,
    private masterServices: MasterService,
    private filter: FilterUtils,
    private prqreportservice: prqreportService
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
    this.prqregisterTableForm.controls["start"].setValue(lastweek);
    this.prqregisterTableForm.controls["end"].setValue(now);
    this.getDropDownList()
  }

  CSVHeader = {
    "srno": "Sl No",
    "prqNo": "PRQ Number",
    "prqDt": "PRQ Date",
    "PickDtTime": "Pick Up Date & Time",
    "prqStatus":"PRQ Status",
    "BillParty": "Billing Party Name & Code",
    "from": "From",
    "to": "To",
    "carrierType": "Carrier Type",
    "Cap": "Capacity",
    "PayMode": "Payment Mode",
    "PRQRaiseBranch": "PRQ Raised on Branch",
    "ContractAmt": "Contract Amount",
    "VehNo": "Vehicle Number",
    "VenType": "Vendor type",
    "VenCD": "Vendor Code",
    "VenNm": "Vendor Name",
    "ConsigNoteNo": "Consignment Note No",
    "ConsigNoteDt": "Consignment Note Date",
    "ConsigNoteTotAmt": "Consignment Note Total Amount",
    "THCNo": "THC Number",
    "THCDt": "THC Date",
    "THCAmt": "THC Amount",
  }

  initializeFormControl() {
    this.prqregisterFormControl = new PrqReportControl();
    this.jsonprqregisterFormArray = this.prqregisterFormControl.prqReportControlArray;
    this.billPNM = this.jsonprqregisterFormArray.find(
      (data) => data.name === "billParty"
    )?.name;
    this.billPCD = this.jsonprqregisterFormArray.find(
      (data) => data.name === "billParty"
    )?.additionalData.showNameAndValue;
    this.prqregisterTableForm = formGroupBuilder(this.fb, [this.jsonprqregisterFormArray]);
  }

  // Asynchronous function to fetch drop-down list data
  async getDropDownList() {
    let prqReq = {
      "companyCode": this.storage.companyCode,
      "filter": {},
      "collectionName": "prq_summary"
    };
    const prqRes = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", prqReq));
    const mergedData = {
      billParty: prqRes?.data
    };
    // Extract relevant information for the billParty drop-down list
    this.allData = mergedData;
    // Extract relevant information for the billParty drop-down list
    const billPartyDet = mergedData.billParty
      .map(element => ({
        name: element.bPARTYNM,
        value: element.bPARTY,
      }));
    // Filter out duplicate entries
    const uniqueBillPartyDet = Array.from(new Set(billPartyDet.map(a => a.value)))
      .map(value => {
        return billPartyDet.find(a => a.value === value);
      });
    this.prqDetailList = uniqueBillPartyDet;
    this.billPartyDet = uniqueBillPartyDet;
    this.filter.Filter(
      this.jsonprqregisterFormArray,
      this.prqregisterTableForm,
      uniqueBillPartyDet,
      this.billPNM,
      this.billPCD
    );
  }

  async save() {
    const PRQNo = this.prqregisterTableForm.value.prqNo;
    const prqArray = PRQNo ? PRQNo.includes(',') ? PRQNo.split(',') : [PRQNo] : [];
    const startValue = new Date(this.prqregisterTableForm.controls.start.value);
    const endValue = new Date(this.prqregisterTableForm.controls.end.value);
    const billparty = Array.isArray(this.prqregisterTableForm.value.bpartyHandler)
      ? this.prqregisterTableForm.value.bpartyHandler.map(x => { return { BPartyCD: x.value, prqBPartyNm: x.name }; })
      : [];
    const data = await this.prqreportservice.getprqReportDetail(startValue, endValue, billparty, prqArray);
    if (data.length === 0) {
      if (data) {
        Swal.fire({
          icon: "error",
          title: "No Records Found",
          text: "Cannot Download CSV",
          showConfirmButton: true,
        });
      }
      return;
    }
    // Assuming exportAsExcelFile is a function that exports data to Excel
    exportAsExcelFile(data, `PRQ_Register_Report-${timeString}`, this.CSVHeader);
  }

  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;
    const index = this.jsonprqregisterFormArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonprqregisterFormArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.prqregisterTableForm.controls[autocompleteSupport].patchValue(
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

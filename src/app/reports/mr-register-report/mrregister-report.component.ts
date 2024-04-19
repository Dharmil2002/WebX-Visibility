import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { MRRegister } from 'src/assets/FormControls/Reports/MR-Register/mr-register';

@Component({
  selector: 'app-mrregister-report',
  templateUrl: './mrregister-report.component.html'
})
export class MRRegisterReportComponent implements OnInit {
  MRRegisterFormControls: MRRegister;
  jsonControlArray: any;
  breadScrums = [
    {
      title: "Cheque Register Report",
      items: ["Report"],
      active: "Cheque Register Report",
    },
  ];
  mRRegisterForm: UntypedFormGroup;
  CSVHeader = {
    MRNo: "MR No.",
    MRDate: "MR Date",
    MRTime: "MR Time",
    MRType: "MR Type",
    MRLocation: "MR Location",
    Party: "Party",
    MRAmount: "MR Amount",
    TDS: "TDS",
    GSTAmount: "GST Amount",
    FreightRebate: "Freight Rebate",
    CLAIM: "CLAIM",
    OtherDeduction: "Other Deduction",
    NetMRCloseAmt: "Net MR Close Amt",
    MRCloseDate: "MR Close Date",
    MRCloseBy: "MR Close By",
    PayMode: "Pay Mode",
    ChequeNo: "Cheque No",
    ChequeDate: "Cheque Date",
    ChequeAmount: "Cheque Amount",
    CancelledBy: "Cancelled By",
    CancelledOn: "Cancelled On",
    CancelledReasion: "Cancelled Reasion",
    GatePassNo: "Gate Pass No",
    GCNNo: "GCN No",
    BillNo: "Bill No",
    Origin: "Origin",
    Destination: "Destination",
    BasicFreight: "Basic Freight",
    SubTotal: "Sub. Total",
    DocketTotal: "Docket Total",
    ActualWeight: "Actual Weight",
    ChargedWeight: "Charged Weight",
    NoPkg: "No Pkg",
    GodownNoName: "Godown No/Name",
    DeliveryDateandTime: "Delivery Date and Time",
    PrivateMarka: "Private Marka",
    VehicleNo: "Vehicle No.",
    Status: "Status As Deliver/Undelivered",
    SaidToContains: "Said to contains",
    Receiver: "Receiver",
    ReceiverNo: "Receiver No.",
    Remark: "Remark",
    FreightDeduction: "Freight Deduction",
    ClaimDeduction: "Claim Deduction",
    OtherAmount: "Other Amount",
    ServiceCharges: "Service Charges",
    Discount: "Discount",
    SpecialCharges: "Special Charges",
    UnloadingCharges: "Unloading Charges",
    Damurrage : "Damurrage",
    DetentionCharge: "Detention charge",
    OtherCharges: "Other Charges",
    DDCharges: "DD Charges"
  }
  constructor(private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService,) {}

  ngOnInit(): void {
  }
  //#region to initialize form control
  initializeFormControl() {
    const controls = new MRRegister();
    this.jsonControlArray = controls.mrRegisterControlArray;

    // Build the form using formGroupBuilder
    this.mRRegisterForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
  }
  //#endregion
  //#region to call function handler
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
  //#endregion
}

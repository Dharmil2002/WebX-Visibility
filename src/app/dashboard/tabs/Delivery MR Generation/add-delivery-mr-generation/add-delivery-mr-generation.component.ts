import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { DeliveryMrGeneration } from 'src/assets/FormControls/DeliveryMr';
import { MatDialog } from '@angular/material/dialog';
import { DeliveryMrGenerationModalComponent } from '../delivery-mr-generation-modal/delivery-mr-generation-modal.component';
import { Router } from '@angular/router';
import { autocompleteObjectValidator } from 'src/app/Utility/Validation/AutoComplateValidation';
import { GetAccountDetailFromApi, GetBankDetailFromApi, GetsachsnFromApi } from 'src/app/finance/Debit Voucher/debitvoucherAPIUtitlity';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { financialYear } from 'src/app/Utility/date/date-utils';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { VoucherDataRequestModel, VoucherInstanceType, VoucherRequestModel, VoucherType, ledgerInfo } from 'src/app/Models/Finance/Finance';
import { VoucherServicesService } from 'src/app/core/service/Finance/voucher-services.service';
import { DocketService } from 'src/app/Utility/module/operation/docket/docket.service';
import { GenericActions, StoreKeys } from 'src/app/config/myconstants';
import { InvoiceModel } from 'src/app/Models/dyanamic-form/dyanmic.form.model';
import { InvoiceServiceService } from 'src/app/Utility/module/billing/InvoiceSummaryBill/invoice-service.service';
import { ThcService } from 'src/app/Utility/module/operation/thc/thc.service';
import { StateService } from 'src/app/Utility/module/masters/state/state.service';
import { ConvertToNumber } from 'src/app/Utility/commonFunction/common';
import { ControlPanelService } from 'src/app/core/service/control-panel/control-panel.service';
@Component({
  selector: 'app-add-delivery-mr-generation',
  templateUrl: './add-delivery-mr-generation.component.html'
})
export class AddDeliveryMrGenerationComponent implements OnInit {

  jsonControlDeliveryMrGenArray: any;
  deliveryMrTableForm: UntypedFormGroup

  jsonControlBookingTimechargesArray: any;
  AlljsonControlBookingTimechargesArray: any;
  BookingTimechargesForm: UntypedFormGroup

  breadscrums = [
    {
      title: "Delivery MR Generation",
      items: ["Dashboard"],
      active: "Delivery MR Generation",
    },
  ];

  VoucherRequestModel = new VoucherRequestModel();
  VoucherDataRequestModel = new VoucherDataRequestModel();
  className = "col-xl-3 col-lg-3 col-md-6 col-sm-6 mb-2";



  jsonControlPaymentArray: any;
  PaymentSummaryFilterForm: UntypedFormGroup;
  AlljsonControlPaymentSummaryFilterArray: any;
  jsonSummaryControlArray: any;
  jsonSummaryControls: any;
  jsonCollectionControlArray: any;

  SummaryForm: UntypedFormGroup;
  filteredDocket = []
  DocketDetails: any;
  DocketFinDetails: any;
  SACCode: any;
  docketNo: any;
  AlljsonControlMRArray: any;
  totalMRamt: any;
  AccountsBanksList: any;

  ShowBookingTimeCharges = false;
  chargeList: any;
  DeliveryTimeChargesArray: any[];
  DeliveryTimeChargesForm: UntypedFormGroup;
  CollectionForm: UntypedFormGroup;
  ChargesList: any;
  States: any[];
  isGSTApplicable: boolean = true;
  GSTType: any;
  GSTRate: number = 12;
  GSTApplied: string[];
  VoucherDetails: any;
  TotalBookingTimeCharges: number = 0;
  TotalDeliveryTimeCharges: number = 0;
  TotalEditedAmount: number = 0;
  TotalDiffrentAmount: number = 0;
  isInterBranchControl: boolean = false;

  constructor(private fb: UntypedFormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private filter: FilterUtils,
    private masterService: MasterService,
    private objLocationService: LocationService,
    private operation: OperationService,
    private storage: StorageService,
    private voucherServicesService: VoucherServicesService,
    public snackBarUtilityService: SnackBarUtilityService,
    private docketService: DocketService,
    private invoiceService: InvoiceServiceService,
    private thcService: ThcService,
    private stateService: StateService,
    private controlPanel: ControlPanelService
  ) {
    if (this.router.getCurrentNavigation()?.extras?.state != null) {
      const data = this.router.getCurrentNavigation()?.extras?.state.data;
      this.docketNo = data.data.no;
    } else {
      this.docketNo = "DEL2013";
    }
  }

  ngOnInit(): void {
    this.initializeDeliveryMrFormControls();
  }
  //#region to call handler function
  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  //#endregion
  //#region to initializes the form controls for the Delivery MR table.
  async initializeDeliveryMrFormControls() {
    // Create an instance of the DeliveryMrGeneration class to generate form controls.
    const deliveryMrControlsGenerator = new DeliveryMrGeneration();

    // Retrieve the generated form controls array from the DeliveryMrGeneration instance.
    this.jsonControlDeliveryMrGenArray = deliveryMrControlsGenerator.getDeliveryMrControls();
    this.AlljsonControlMRArray = this.jsonControlDeliveryMrGenArray;
    this.deliveryMrTableForm = formGroupBuilder(this.fb, [this.jsonControlDeliveryMrGenArray]);

    this.jsonControlBookingTimechargesArray = deliveryMrControlsGenerator.getBookingTimecharges();

    this.jsonControlPaymentArray = deliveryMrControlsGenerator.getDeliveryMrPaymentControls();
    this.PaymentSummaryFilterForm = formGroupBuilder(this.fb, [this.jsonControlPaymentArray])
    this.AlljsonControlPaymentSummaryFilterArray = this.jsonControlPaymentArray;
    this.jsonControlPaymentArray = this.jsonControlPaymentArray.slice(0, 1);

    this.jsonSummaryControlArray = deliveryMrControlsGenerator.getDeliveryMrBillingControls();
    this.jsonSummaryControls = deliveryMrControlsGenerator.getDeliveryMrBillingControls();
    this.SummaryForm = formGroupBuilder(this.fb, [this.jsonSummaryControlArray]);

    this.jsonCollectionControlArray = deliveryMrControlsGenerator.getCollectionDetailsControls();
    this.CollectionForm = formGroupBuilder(this.fb, [this.jsonCollectionControlArray]);

    this.deliveryMrTableForm.controls['ConsignmentNoteNumber'].setValue(this.docketNo);
    this.docketNo ? await this.ValidateDocketNo() : null;
    await this.GetGSTRate();
    await this.getAccountingRules();
  }
  //#region to validate docket number
  async ValidateDocketNo() {
    const DocketNo = this.deliveryMrTableForm.value.ConsignmentNoteNumber;
    if (!DocketNo) {
      return;
    }

    try {
      const filter = { "dKTNO": DocketNo };
      const docketdetails = await this.docketService.getDocketsDetailsLtl(filter);

      if (docketdetails.length === 1) {
        this.DocketDetails = docketdetails[0];
        await this.SetDocketsDetails(this.DocketDetails);
      } else {
        await Swal.fire({
          icon: "info",
          title: "Information",
          text: `This Consignment No: ${DocketNo} is not valid`,
          showConfirmButton: true,
        });
        this.deliveryMrTableForm.controls.ConsignmentNoteNumber.reset();
        return;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error gracefully, maybe show an error message to the user
    }
  }
  async SetDocketsDetails(data) {
    this.deliveryMrTableForm.get('PayBasis').setValue(data.pAYTYPNM);
    this.deliveryMrTableForm.get('Consignor').setValue(`${data.cSGN.cD}:${data.cSGN.nM}`);
    this.deliveryMrTableForm.get('ConsignorGST').setValue(data.cSGN.gST);
    this.deliveryMrTableForm.get('Consignee').setValue(`${data.cSGE.cD}:${data.cSGE.nM}`);
    this.deliveryMrTableForm.get('ConsigneeGST').setValue(data.cSGE.gST);

    this.isGSTApplicable = (data.rCM == "Y" || data.rCM == "RCM") ? true : false;
    this.deliveryMrTableForm.get('GSTApplicability').setValue(this.isGSTApplicable ? "Yes" : "No");
    await this.GetBookingTimeCharges();
    if (data.cSGN.gST && data.cSGE.gST) {
      const StateCodeList = [parseInt(data.cSGN.gST.substring(0, 2)), parseInt(data.cSGE.gST.substring(0, 2))]
      await this.GetStateCodeWiseStateDetails(StateCodeList);
    }
    await this.fetchAndProcessCharges();
  }
  async GetBookingTimeCharges() {
    const DocketNo = this.deliveryMrTableForm.value.ConsignmentNoteNumber;
    if (!DocketNo) {
      return;
    }
    const filter = { "dKTNO": DocketNo };
    const docketFindetails = await this.docketService.getDocketsFinDetailsLtl(filter);
    if (docketFindetails.length === 1) {
      this.DocketFinDetails = docketFindetails[0];
      if (this.DocketFinDetails.cHG.length > 0) {
        this.ChargesList = await this.SetBookingTimeCharges(this.DocketFinDetails.cHG);
        this.AlljsonControlBookingTimechargesArray = [...this.jsonControlBookingTimechargesArray, ...this.ChargesList,];

        this.BookingTimechargesForm = formGroupBuilder(this.fb, [
          this.AlljsonControlBookingTimechargesArray,
        ]);
        this.BookingTimechargesForm.get('OldFreight').setValue(this.DocketFinDetails?.fRTAMT || 0);
        this.BookingTimechargesForm.get('NewFreight').setValue(this.DocketFinDetails?.fRTAMT || 0);
        this.ShowBookingTimeCharges = true;
      }
      if (this.DocketDetails.pAYTYP == 'P01') {
        await this.getVoucherDetails();
      }
    }
  }
  async SetBookingTimeCharges(charges) {

    const generateCharges = (charge) => {
      // Helper function to generate a single charge object
      const generateChargeObject = (index) => ({
        name: charge.cHGID + index, // Add an index to make names unique
        label: `${charge.cHGNM} (${charge.oPS}) ₹`,
        placeholder: charge.cHGNM,
        type: "number",
        value: index == 3 ? 0 : charge.aMT,
        generatecontrol: true,
        disable: (this.DocketDetails.pAYTYP == 'P01' && index > 1) || index == 1 ? true : false,
        ChargType: charge.oPS,
        ChargeId: charge.cHGID,
        FormType: "BookingTimeCharges",
        Validations: [

          index == 2 ? {
            name: "pattern",
            message: "Please Enter only positive numbers with up to two decimal places",
            pattern: "^\\d+(\\.\\d{1,2})?$",
          } : [],],
        functions: {
          onChange: "OnChangeBookingTimeCharges",
        },
      });

      // Generate three charge objects based on the input charge
      const charges = [];
      for (let i = 1; i <= 3; i++) {
        charges.push(generateChargeObject(i));
      }
      return charges;
    };

    // Generate three sets of charges for each charge object
    let combinedCharges = [];
    charges.forEach(charge => {
      combinedCharges = combinedCharges.concat(generateCharges(charge));
    });

    return combinedCharges;
  }

  private async fetchAndProcessCharges() {
    this.chargeList = await this.thcService.getCharges({
      "cHAPP": { 'D$eq': 'DeliveryMR' },
      'isActive': { 'D$eq': true }
    });

    if (this.chargeList && this.chargeList.length > 0) {
      const invoiceList = this.chargeList
        .filter(element => element)
        .map((element, index) => ({
          id: 1 + index,
          name: element.cHACD || '',
          label: `${element.sELCHA}(${element.aDD_DEDU})`,
          placeholder: element.cAPTION || '',
          type: 'number',
          value: 0,
          filterOptions: '',
          displaywith: '',
          generatecontrol: true,
          disable: true,
          FormType: "DeliveryTimeCharges",
          Validations: [{
            name: "pattern",
            message: "Please Enter only positive numbers with up to two decimal places",
            pattern: "^\\d+(\\.\\d{1,2})?$",
          }],
          additionalData: {
            metaData: element,
            showNameAndValue: element.iSREQ
          },
          functions: {
            onChange: "OnChangeBookingTimeCharges",
          },
        }));

      const enable = invoiceList.map(x => ({
        ...x,
        name: `${x.name}`,
        disable: false
      }));

      this.DeliveryTimeChargesArray = enable.sort((a, b) => a.name.localeCompare(b.name));
      this.DeliveryTimeChargesForm = formGroupBuilder(this.fb, [this.DeliveryTimeChargesArray]);
      this.OnChangeBookingTimeCharges(null);
    }
  }

  OnChangeBookingTimeCharges(event) {
    // Set Diffrent Amount
    if (event) {
      if (event.field.FormType === "BookingTimeCharges") {
        const OldAmount = parseFloat(this.BookingTimechargesForm.get(event.field.ChargeId + "1").value);
        const NewAmount = parseFloat(this.BookingTimechargesForm.get(event.field.ChargeId + "2").value);
        const DiffAmount = parseFloat((OldAmount - NewAmount).toFixed(2));
        this.BookingTimechargesForm.get(event.field.ChargeId + "3").setValue(DiffAmount);
      }
    }

    const NewFreight = this.BookingTimechargesForm.get('NewFreight').value;
    // Calculate the Booking time charges

    this.TotalBookingTimeCharges = 0;
    this.TotalEditedAmount = 0;
    this.TotalDiffrentAmount = 0;

    for (let i = 1; i <= 3; i++) {
      this.DocketFinDetails.cHG.forEach(item => {
        const value = parseFloat(this.BookingTimechargesForm.get(item.cHGID + i).value);
        const amountToAdd = isNaN(value) ? 0 : (item.oPS === "+" ? value : -value);

        if (i === 1) {
          this.TotalBookingTimeCharges += amountToAdd;
        } else if (i === 2) {
          this.TotalEditedAmount += amountToAdd;
        } else if (i === 3) {
          this.TotalDiffrentAmount += amountToAdd;
        }
      });
    }

    // Calculate Delivery Time Charges
    this.TotalDeliveryTimeCharges = 0;
    this.DeliveryTimeChargesArray.forEach((element) => {
      const value = parseFloat(this.DeliveryTimeChargesForm.get(element.name).value);
      const amountToAdd = isNaN(value) ? 0 : (element.additionalData.metaData.aDD_DEDU === "-" ? -value : value);
      this.TotalDeliveryTimeCharges += amountToAdd;
    });
    const taxableAmount = this.TotalEditedAmount + NewFreight + this.TotalDeliveryTimeCharges;
    this.SummaryForm.get('DocketNewTotal').setValue(taxableAmount.toFixed(2));

    let GSTAmount = 0;
    if (this.isGSTApplicable) {
      GSTAmount = ConvertToNumber(taxableAmount * (this.GSTRate / 100), 2);

      this.jsonSummaryControlArray.filter(f => this.GSTApplied.includes(f.name)).forEach(item => {
        this.SummaryForm.get(item.name).setValue((GSTAmount / this.GSTApplied.length).toFixed(2));
      });
    }

    const total = (taxableAmount + GSTAmount);
    this.SummaryForm.get('Dockettotal').setValue(total.toFixed(2));

    this.OnChangeCheckBox(null);
  }

  // Function to calculate and update summary form values
  updateSummaryForm(total, eventCheck) {
    const roundedValue = eventCheck ? Math.ceil(total) : total;
    const diff = ConvertToNumber(roundedValue - total, 2);

    this.SummaryForm.get("RoundOffAmount").setValue(diff.toFixed(2));
    this.SummaryForm.get("RoundedOff").setValue(roundedValue.toFixed(2));
  }

  // Function to calculate and update collection form values
  updateCollectionForm(total) {
    let collectedAmount = this.DocketDetails.pAYTYP === "P01" ? this.DocketDetails.tOTAMT || 0 : 0;
    if (this.VoucherDetails) {
      collectedAmount = this.VoucherDetails.nNETP || 0;
      this.CollectionForm.get("CollectionMRNo").setValue(this.VoucherDetails?.vNO || "");
    }

    const collectionAmount = ConvertToNumber(total - collectedAmount, 2);
    this.CollectionForm.get("CollectedAmount").setValue(collectedAmount.toFixed(2));
    this.CollectionForm.get("NewCollectionAmount").setValue(collectionAmount.toFixed(2));
    this.CollectionForm.get("PendingAmount").setValue(0.00);
  }

  // Handler for checkbox change
  OnChangeCheckBox(event) {
    const total = ConvertToNumber(this.SummaryForm.get("Dockettotal").value, 2);
    this.updateSummaryForm(total, event?.event?.checked);

    const roundedValue = ConvertToNumber(this.SummaryForm.get("RoundedOff").value, 2);
    this.updateCollectionForm(roundedValue);
  }

  // Handler for toggle up/down
  toggleUpDown(event) {
    const total = ConvertToNumber(this.SummaryForm.get("Dockettotal").value, 2);
    const isUpDown = event.isUpDown;
    this.updateSummaryForm(total, isUpDown);

    const roundedValue = ConvertToNumber(this.SummaryForm.get("RoundedOff").value, 2);
    this.updateCollectionForm(roundedValue);
  }

  async GetStateCodeWiseStateDetails(GSTCodeList) {
    let req = {
      companyCode: this.storage.companyCode,
      collectionName: "state_master",
      filter: {
        ST: { D$in: GSTCodeList },
      }
    };
    const res = await firstValueFrom(this.masterService.masterPost("generic/get", req));
    if (res.data && res.data.length > 0) {
      this.States =res.data;
      if (res.data.length > 1)
        this.GSTType = await this.stateService.getGSTType(res.data[0], res.data[1]);
      else {
        this.GSTType = await this.stateService.getGSTType(res.data[0], res.data[0]);
      }
    }
    const gstToRemove = [];
    this.GSTApplied = [];

    Object.keys(this.GSTType).forEach(key => {
      if (this.GSTType[key])
        this.GSTApplied.push(key);
      else
        gstToRemove.push(key);
    });
    console.log(this.GSTApplied);

    this.jsonSummaryControlArray = this.jsonSummaryControlArray.filter(x => !gstToRemove.includes(x.name));
  }

  async getAccountingRules() {
    const filter = {
      cID: this.storage.companyCode,
      mODULE: "THC",
      aCTIVE: true,
      rULEID: { D$in: ["THCIBC", "THCCB"] }
    }
    const res: any = await this.controlPanel.getModuleRules(filter);
    if (res.length > 0) {
        this.isInterBranchControl =  res.find(x => x.rULEID === "THCIBC")?.vAL || false;
    }
  }

  async GetGSTRate() {
    let req = {
      companyCode: this.storage.companyCode,
      collectionName: "sachsn_master",
      filter: {
        TYP: "SAC",
        SID: 577
      }
    };
    const res = await firstValueFrom(this.masterService.masterPost("generic/getOne", req));
    if (res.data) {
      this.SACCode = res.data
      this.GSTRate = res.data.GSTRT || 12;
    }
  }

  async getVoucherDetails() {
    let req = {
      companyCode: this.storage.companyCode,
      collectionName: "voucher_trans",
      filter: {
        tTYP: 1, vTNO: this.DocketDetails.dKTNO
      }
    };
    const res = await firstValueFrom(this.masterService.masterPost("generic/getOne", req));
    if (res.data) {
      this.VoucherDetails = res.data;
    }
  }

  //#endregion 

  //#region Payment Modes Changes
  async OnPaymentModeChange(event) {
    const PaymentMode = this.PaymentSummaryFilterForm.get("PaymentMode").value;
    let filterFunction;

    switch (PaymentMode) {
      case "Cheque":
        filterFunction = (x) => x.name !== "CashAccount";

        break;
      case "Cash":
        filterFunction = (x) => x.name !== "ChequeOrRefNo" && x.name !== "Bank" && x.name !== 'Date';
        break;
      case "RTGS/UTR":
        filterFunction = (x) => x.name !== "CashAccount";
        break;
    }

    this.jsonControlPaymentArray =
      this.AlljsonControlPaymentSummaryFilterArray.filter(filterFunction);
    const Accountinglocation = this.storage.branch;
    switch (PaymentMode) {
      case "Cheque":
        this.AccountsBanksList = await GetAccountDetailFromApi(this.masterService, "BANK", Accountinglocation)
        let responseFromAPIBank = await GetBankDetailFromApi(this.masterService, Accountinglocation)

        const bankCodes = this.AccountsBanksList.map(item => `${item.bANCD}:${item.bANM}`);

        responseFromAPIBank = responseFromAPIBank.filter(f => bankCodes.includes(`${f.Accountnumber}:${f.Bankname}`));

        this.filter.Filter(
          this.jsonControlPaymentArray,
          this.PaymentSummaryFilterForm,
          responseFromAPIBank,
          "Bank",
          false
        );

        const Bank = this.PaymentSummaryFilterForm.get("Bank");
        Bank.setValidators([
          Validators.required,
          autocompleteObjectValidator(),
        ]);
        Bank.updateValueAndValidity();


        const ChequeOrRefNo = this.PaymentSummaryFilterForm.get("ChequeOrRefNo");
        ChequeOrRefNo.setValidators([Validators.required]);
        ChequeOrRefNo.updateValueAndValidity();


        const CashAccount = this.PaymentSummaryFilterForm.get("CashAccount");
        CashAccount.setValue("");
        CashAccount.clearValidators();
        CashAccount.updateValueAndValidity();

        break;
      case "Cash":
        const responseFromAPICash = await GetAccountDetailFromApi(
          this.masterService,
          "CASH",
          Accountinglocation
        );
        this.filter.Filter(
          this.jsonControlPaymentArray,
          this.PaymentSummaryFilterForm,
          responseFromAPICash,
          "CashAccount",
          false
        );

        const CashAccountS = this.PaymentSummaryFilterForm.get("CashAccount");
        CashAccountS.setValidators([
          Validators.required,
          autocompleteObjectValidator(),
        ]);
        CashAccountS.updateValueAndValidity();

        const BankS = this.PaymentSummaryFilterForm.get("Bank");
        BankS.setValue("");
        BankS.clearValidators();
        BankS.updateValueAndValidity();

        const ChequeOrRefNoS = this.PaymentSummaryFilterForm.get("ChequeOrRefNo");
        ChequeOrRefNoS.setValue("");
        ChequeOrRefNoS.clearValidators();
        ChequeOrRefNoS.updateValueAndValidity();

        break;
      case "RTGS/UTR":
        this.AccountsBanksList = await GetAccountDetailFromApi(this.masterService, "BANK", Accountinglocation)
        const responseFromAPIBankRTGS = await GetBankDetailFromApi(this.masterService, Accountinglocation)
        this.filter.Filter(
          this.jsonControlPaymentArray,
          this.PaymentSummaryFilterForm,
          responseFromAPIBank,
          "Bank",
          false
        );

        const BankRTGS = this.PaymentSummaryFilterForm.get("Bank");
        BankRTGS.setValidators([
          Validators.required,
          autocompleteObjectValidator(),
        ]);
        BankRTGS.updateValueAndValidity();


        const ChequeOrRefNoRTGS = this.PaymentSummaryFilterForm.get("ChequeOrRefNo");
        ChequeOrRefNoRTGS.setValidators([Validators.required]);
        ChequeOrRefNoRTGS.updateValueAndValidity();


        const CashAccountRTGS = this.PaymentSummaryFilterForm.get("CashAccount");
        CashAccountRTGS.setValue("");
        CashAccountRTGS.clearValidators();
        CashAccountRTGS.updateValueAndValidity();
        break;
    }
  }



  async GenerateMR() {
    const DocketNo = this.deliveryMrTableForm.value.ConsignmentNoteNumber;
    if (!DocketNo) {
      Swal.fire({
        text: 'Please fill the required details above',
        icon: "warning",
        title: 'Warning',
        showConfirmButton: true,
      });
      return false
    } else {
      this.snackBarUtilityService.commonToast(async () => {
        try {
          let gst = {};
          let GSTAmount = 0;
          this.GSTApplied.map(x => {
            gst[x] = ConvertToNumber(this.SummaryForm.value[x].value, 2);
            GSTAmount = GSTAmount + parseFloat(this.SummaryForm.value[x].value);
          });

          const btChgs = this.DocketFinDetails.cHG.map(item => {
            let d = {
              ...item,
              cHACAT: "B"
            };

            const value = ConvertToNumber(this.BookingTimechargesForm.get(d.cHGID + 2).value, 2);
            d.aMT = isNaN(value) ? 0 : (d.oPS === "-" ? -value : value);
            return d;
          });

          const dtChgs = this.DeliveryTimeChargesArray.map((d) => {

            var nd = {
              "cHGID": d.additionalData.metaData.cHACD,
              "cHGNM": d.additionalData.metaData.cAPTION || d.additionalData.metaData.sELCHA,
              "aMT": 0,
              "oPS": d.additionalData.metaData.aDD_DEDU,
              "cHACAT": d.additionalData.metaData.cHACAT,
            }
            const value = parseFloat(this.DeliveryTimeChargesForm.get(d.name).value);
            nd.aMT = isNaN(value) ? 0 : (d.additionalData.metaData.aDD_DEDU === "-" ? -value : value);
            return nd;
          });


console.log(this.AccountsBanksList);
console.log(this.AccountsBanksList.find(item => item.bANCD == this.PaymentSummaryFilterForm.value.Bank.value)?.aCNM);
          const headerRequest = {
            cID: this.storage.companyCode,
            gCNNO: DocketNo,
            dLVRT: "",
            cNTCTNO: this.DocketDetails.cSGN?.mOB || '',
            rCEIVNM: this.DocketDetails.cSGN?.nM || '',
            CONSGNM: this.DocketDetails.cSGN?.nM || '',
            mOD: this.PaymentSummaryFilterForm.value.PaymentMode,
            bNK: this.AccountsBanksList.find(item => item.bANCD == this.PaymentSummaryFilterForm.value.Bank.value)?.aCNM || '',
            cHQNo: this.PaymentSummaryFilterForm.value.ChequeOrRefNo ? this.PaymentSummaryFilterForm.value.ChequeOrRefNo : '',
            cHQDT: this.PaymentSummaryFilterForm.value.Date ? this.PaymentSummaryFilterForm.value.Date : '',
            iSUBNK: "",
            oNACC: "",
            dPOSTBNKNM: this.PaymentSummaryFilterForm.value.Bank.name,
            dPOSTBNKCD: this.PaymentSummaryFilterForm.value.Bank.value,
            bILNGPRT: this.DocketDetails.bPARTYNM,
            bPARTY: this.DocketDetails.bPARTY,
            bKNGST: this.States[0].STNM,
            bKNGSTCD: this.States[0].ST,
            sPLYSTNM: this.States[1]?.STNM || this.States[0].STNM,
            sPLYSTCD: this.States[1]?.ST || this.States[0].ST,
            sACCDNM: this.SACCode.SNM,
            sACCd: this.SACCode.SHCD,
            gSTRT: this.GSTRate,
            gST: {
              ...gst
            },
            sUBTTL: ConvertToNumber(this.SummaryForm.value.DocketNewTotal, 2),
            gSTAMT: ConvertToNumber(GSTAmount, 2),
            //tDSSCTCD: this.SummaryForm.value.TDSSection.value,
            //tDSSCTNM: this.SummaryForm.value.TDSSection.name,
            //tDSRT: this.SummaryForm.value.TDSRate,
            //tDSAmt: parseFloat(this.SummaryForm.value.TDSAmount).toFixed(2) || 0,
            gSTCHRGD: ConvertToNumber(GSTAmount, 2),
            tOTAMT: ConvertToNumber(this.SummaryForm.value.Dockettotal, 2),
            rNDOFF: ConvertToNumber(this.SummaryForm.value.RoundOffAmount, 2) || 0,
            dLVRMRAMT: ConvertToNumber(this.SummaryForm.value.RoundedOff, 2),
            cLLCTAMT: ConvertToNumber(this.CollectionForm.value.NewCollectionAmount, 2),
            pRTLYCLCTD: false,
            pRTLYRMGAMT: ConvertToNumber(this.CollectionForm.value.PendingAmount, 2),
            vNO: "",
            lOC: this.storage.branch,
            eNTDT: new Date(),
            eNTLOC: this.storage.branch,
            eNTBY: this.storage.userName
          }
          const detailRequests = {
            cID: this.storage.companyCode,
            gCNNO: this.DocketDetails.dKTNO,
            dKTNO: this.DocketDetails.dKTNO,
            cHG: [...btChgs, ...dtChgs],
            pYBASIS: this.DocketDetails.pAYTYP,
            sUBTTL: this.DocketDetails.gROAMT,
            nWSUBTTL: ConvertToNumber(this.SummaryForm.value.DocketNewTotal, 2),
            gSTAMT: ConvertToNumber(GSTAmount, 2),
            sACCDNM: this.SACCode.SNM,
            sACCd: this.SACCode.SHCD,
            gSTRT: this.GSTRate,
            gST: {
              ...gst
            },
            rTDFRNC: ConvertToNumber(this.SummaryForm.value.DocketNewTotal - this.DocketDetails.gROAMT, 2),
            vNO: "",
            lOC: this.storage.branch,
            tOTL: ConvertToNumber(this.SummaryForm.value.Dockettotal, 2),
            eNTDT: new Date(),
            eNTLOC: this.storage.branch,
            eNTBY: this.storage.userName
          }

          let data = {
            chargeDetails: [detailRequests],
            ...headerRequest
          };
          // Prepare the request body with company code, collection name, and job detail data.
          let reqBody = {
            companyCode: this.storage.companyCode,
            //collectionName: "delivery_mr_header",
            docType: "MR",
            branch: this.storage.branch,
            finYear: financialYear,
            data: data
          };

          //Send a POST request to create the job detail in the MongoDB collection.
          const res = await firstValueFrom(this.operation.operationPost("operation/delMR/create", reqBody));
          if (res.success) {
            if (headerRequest.cLLCTAMT > 0) {
              const vRes = await this.GenerateVoucher(res?.data);
              if (vRes && vRes.success ) {
                const reqMR = {
                  companyCode: this.storage.companyCode,
                  collectionName: "delivery_mr_header",
                  filter: { docNo: res?.data?.data?.docNo, cID: this.storage.companyCode },
                  update: {
                    vNO: vRes?.data?.chargeDetails?.ops[0]?.dMRNO
                  }
                }
                await firstValueFrom(this.operation.operationPut(GenericActions.UpdateMany, reqMR));

                const reqMRDet = {
                  companyCode: this.storage.companyCode,
                  collectionName: "delivery_mr_details",
                  filter: { dLMRNO: res?.data?.data?.docNo, cID: this.storage.companyCode },
                  update: {
                    vNO: vRes?.data?.chargeDetails?.ops[0]?.dMRNO
                  }
                }
                await firstValueFrom(this.operation.operationPut(GenericActions.Update, reqMRDet));

                 // If the branches match, navigate to the DeliveryMrGeneration page
                this.router.navigate(["/dashboard/DeliveryMrGeneration/Result"], {
                  state: {
                    data: res.data.chargeDetails
                  },
                });
              }
              else {
                this.snackBarUtilityService.ShowCommonSwal(
                  "error",
                  "Fail To Do Account Posting!"
                );
              }
            }
            Swal.hideLoading();
            setTimeout(() => {
              Swal.close();
            }, 2000);           
          } else {
            this.snackBarUtilityService.ShowCommonSwal(
              "error",
              "Fail Generate Delivery MR!"
            );
          }
          /*
          if (res) {
            const reqBody = {
              companyCode: this.storage.companyCode,
              collectionName: "voucher_trans",
              filter: { vNO: VoucherNo },
              update: {
                vTNO: res?.data?.chargeDetails?.ops[0]?.dMRNO
              }
            };
            await firstValueFrom(this.operation.operationPut("generic/update", reqBody));

            Swal.hideLoading();
            setTimeout(() => {
              Swal.close();
            }, 2000);
            // If the branches match, navigate to the DeliveryMrGeneration page
            this.router.navigate(["/dashboard/DeliveryMrGeneration/Result"], {
              state: {
                data: res.data.chargeDetails
              },
            });
          }
          */
        }
        catch (error) {
          console.error("Error fetching data:", error);
          this.snackBarUtilityService.ShowCommonSwal(
            "error",
            "Fail To Submit Data..!"
          );
        }
      }, "Delivery MR Generating..!");
    }

  }

  //#endregion
  async GenerateVoucher(data) {
    let res = [];
    if (!data)
      return null;

    const dmr = data?.data?.header;
    if(!dmr)
      return null;
    
    try {
      const paybase = this.DocketDetails.pAYTYP;
      let requestModel = this.PrepareVoucher("collection",this.storage.branch, dmr, paybase);
      const res = await firstValueFrom(this.voucherServicesService.FinancePost("fin/account/voucherentry", requestModel));
      if (res.success) {
         res.push(res?.data?.mainData?.ops[0].vNO);
         await this.accountPosting(res, this.storage.branch, requestModel); 
      }

      if(this.isInterBranchControl ) {
        let requestModel2 = this.PrepareVoucher("transfer", this.DocketDetails.oRGN, dmr, paybase);
        const res2 = await firstValueFrom(this.voucherServicesService.FinancePost("fin/account/voucherentry", requestModel));
        if (res2.success) {
          res.push(res2?.data?.mainData?.ops[0].vNO);
          await this.accountPosting(res2, this.DocketDetails.oRGN, requestModel2); 
        }
      }
      
    } catch (error) {
      this.snackBarUtilityService.ShowCommonSwal(
        "error",
        "Fail To Submit Data..!"
      );
    }
  }

  async accountPosting(res, branch, requestModel) {
    let reqBody = {
      companyCode: this.storage.companyCode,
      voucherNo: res?.data?.mainData?.ops[0].vNO,
      transDate: Date(),
      finYear: financialYear,
      branch: branch,
      transCode: VoucherInstanceType.DeliveryMR,
      transType: VoucherInstanceType[VoucherInstanceType.DeliveryMR],
      voucherCode: VoucherType.JournalVoucher,
      voucherType: VoucherType[VoucherType.JournalVoucher],
      docType: "VR",
      partyType: "Customer",
      docNo: this.docketNo,
      partyCode: this.DocketDetails.bPARTY,
      partyName: this.DocketDetails.bPARTYNM,
      entryBy: this.storage.userName,
      entryDate: Date(),
      debit: requestModel.voucherlineItems
        .filter((item) => item.credit == 0)
        .map(function (item) {
          return {
            accCode: item.accCode,
            accName: item.accName,
            accCategory: item.accCategory,
            amount: item.debit,
            narration: item.narration ?? "",
          };
        }),
      credit: requestModel.voucherlineItems
        .filter((item) => item.debit == 0)
        .map(function (item) {
          return {
            accCode: item.accCode,
            accName: item.accName,
            accCategory: item.accCategory,
            amount: item.credit,
            narration: item.narration ?? "",
          };
        }),
    };
    const resPosting = await firstValueFrom(this.voucherServicesService.FinancePost("fin/account/posting", reqBody));
    if (resPosting.success) {
      //
    }
    else {
      console.log("Error in Account Posting", resPosting);
    }
  }
  PrepareVoucher(type, branch, dmr, paybase): any {
    let voucherRequestModel = new VoucherRequestModel();
    let voucherDataRequestModel = new VoucherDataRequestModel();
    const PaymentMode = this.PaymentSummaryFilterForm.get("PaymentMode").value;

    let gst = {};    
    let GSTAmount = dmr.cLLCTAMT/(1+(this.GSTRate / 100));
    this.GSTApplied.map(x => {
      gst[x] = ConvertToNumber(GSTAmount/this.GSTApplied.length, 2);
    });

    if (PaymentMode == "Cheque" || PaymentMode == "RTGS/UTR") {
      const BankDetails = this.PaymentSummaryFilterForm.get("Bank").value;
      const AccountDetails = this.AccountsBanksList.find(item => item.bANCD == BankDetails?.value && item.bANM == BankDetails?.name)
      if (AccountDetails != undefined) {
        this.PaymentSummaryFilterForm.get("Bank").setValue(AccountDetails)
      } else {
        this.snackBarUtilityService.ShowCommonSwal("info", "Please select valid Bank Which is mapped with Account Master")
        return;
      }
    }
    voucherRequestModel.companyCode = this.storage.companyCode;
    voucherRequestModel.docType = "VR";

    voucherRequestModel.branch = branch; //Nee to change as per Inter branch control logic
    voucherRequestModel.finYear = financialYear;

    voucherDataRequestModel.voucherNo = "";
    voucherDataRequestModel.transCode = VoucherInstanceType.DeliveryMR;
    voucherDataRequestModel.transType = VoucherInstanceType[VoucherInstanceType.DeliveryMR];
    voucherDataRequestModel.voucherCode = VoucherType.JournalVoucher;
    voucherDataRequestModel.voucherType = VoucherType[VoucherType.JournalVoucher];
    voucherDataRequestModel.transDate = new Date();
    voucherDataRequestModel.docType = "VR";
    voucherDataRequestModel.branch = branch;
    voucherDataRequestModel.finYear = financialYear;

    voucherDataRequestModel.accLocation = branch;
    voucherDataRequestModel.preperedFor = "Customer"
    voucherDataRequestModel.partyCode = this.DocketDetails.bPARTY;
    voucherDataRequestModel.partyName = this.DocketDetails.bPARTYNM;
    if(this.DocketDetails.pAYTYP == 'P01') {
      voucherDataRequestModel.partyState = this.States.find(f => f.ST == parseInt(this.DocketDetails.cSGN.gST.substring(0, 2)))?.STNM || this.DocketDetails.cSGN.gST.substring(0, 2); 
    }
    else {
      voucherDataRequestModel.partyState = this.States.find(f => f.ST == parseInt(this.DocketDetails.cSGE.gST.substring(0, 2)))?.STNM || this.DocketDetails.cSGE.gST.substring(0, 2); 
    }
    voucherDataRequestModel.entryBy = this.storage.userName;
    voucherDataRequestModel.entryDate = new Date();

    voucherDataRequestModel.tcsRate = 0;
    voucherDataRequestModel.tcsAmount = 0;

    Object.keys(gst).forEach(item => {
      voucherDataRequestModel[item] = ConvertToNumber(gst[item], 2)
    });

    voucherDataRequestModel.GSTTotal = GSTAmount;

    voucherDataRequestModel.GrossAmount =  ConvertToNumber(dmr.cLLCTAMT - GSTAmount,2) || 0;
    voucherDataRequestModel.netPayable = ConvertToNumber(dmr.cLLCTAMT,2) || 0;
    voucherDataRequestModel.roundOff = 0;
    voucherDataRequestModel.voucherCanceled = false;

    voucherDataRequestModel.paymentMode = this.PaymentSummaryFilterForm.value.PaymentMode;
    voucherDataRequestModel.refNo = (PaymentMode === 'Cheque' || PaymentMode === 'RTGS/UTR') ? this.PaymentSummaryFilterForm.value.ChequeOrRefNo : "";
    voucherDataRequestModel.accountName = (PaymentMode === 'Cheque' || PaymentMode === 'RTGS/UTR') ? this.PaymentSummaryFilterForm.value.Bank.bANM : this.PaymentSummaryFilterForm.value.CashAccount.name;
    voucherDataRequestModel.accountCode = (PaymentMode === 'Cheque' || PaymentMode === 'RTGS/UTR') ? this.PaymentSummaryFilterForm.value.Bank.bANCD : this.PaymentSummaryFilterForm.value.CashAccount.value;
    voucherDataRequestModel.date = (PaymentMode === 'Cheque' || PaymentMode === 'RTGS/UTR') ? this.PaymentSummaryFilterForm.value.date : "";

    voucherDataRequestModel.scanSupportingDocument = "";
    voucherDataRequestModel.transactionNumber = dmr.docNo;

    const voucherlineItems = this.GetJournalVoucherLedgers(type, voucherDataRequestModel, gst, paybase);
    voucherRequestModel.details = voucherlineItems;
    voucherRequestModel.data = voucherDataRequestModel;
    voucherRequestModel.debitAgainstDocumentList = [];

    return voucherRequestModel;        
  }
  //#region to disable submit btn
  isSubmitDisabled(): boolean {
    return (
      !this.PaymentSummaryFilterForm.valid ||
      !this.SummaryForm.valid
    );
  }
  //#endregion
  //#region Navigation to Delivery tab
  cancel(): void {
    this.navigateWithTabIndex('Delivery');
  }

  /**
   * Navigates back to the specified tab index using the Router.
   * @param tabIndex The index of the tab to navigate back to.
   */
  navigateWithTabIndex(tabIndex: string): void {
    this.router.navigate(['/dashboard/Index'], { queryParams: { tab: tabIndex } });
  }
  GetJournalVoucherLedgers(type, VoucherDataRequestModel, gst, paybase) {
    const createVoucher = (
      accCode,
      accName,
      accCategory,
      debit,
      credit,
      DocketNo,
      sacCode = "",
      sacName = ""
    ) => ({
      companyCode: this.storage.companyCode,
      voucherNo: "",
      transCode: VoucherInstanceType.DeliveryMR,
      transType: VoucherInstanceType[VoucherInstanceType.DeliveryMR],
      voucherCode: VoucherType.JournalVoucher,
      voucherType: VoucherType[VoucherType.JournalVoucher],
      transDate: new Date(),
      finYear: financialYear,
      branch: this.storage.branch,
      accCode,
      accName,
      accCategory,
      sacCode: sacCode,
      sacName: sacName,
      debit,
      credit,
      GSTRate: 0,
      GSTAmount: 0,
      Total: debit + credit,
      TDSApplicable: false,
      narration: `When Delivery MR Generation  For : ${DocketNo}`,
    });

    const Result = [];

    if(type == "collection") {
      const PaymentMode = VoucherDataRequestModel.PaymentMode;
        if (PaymentMode == "Cash") {
          Result.push(createVoucher(VoucherDataRequestModel.accountCode,VoucherDataRequestModel.accountName, "ASSET", VoucherDataRequestModel.netPayable, 0, VoucherDataRequestModel.transactionNumber));
        }
        if (PaymentMode == "Cheque" || PaymentMode == "RTGS/UTR") {
          const AccountDetails = this.AccountsBanksList.find(item => item.bANCD == VoucherDataRequestModel.accountCode && item.bANM == VoucherDataRequestModel.accountName)
          Result.push(createVoucher(AccountDetails.aCCD, AccountDetails.aCNM, "ASSET", VoucherDataRequestModel.netPayable, 0, VoucherDataRequestModel.transactionNumber));
        }
        
      if(this.isInterBranchControl) {
        Result.push(createVoucher(ledgerInfo["AST006002"].LeadgerCode, ledgerInfo["AST006002"].LeadgerName, ledgerInfo["AST006002"].LeadgerCategory, 
                    0, VoucherDataRequestModel.netPayable, VoucherDataRequestModel.transactionNumber));
      }
      else {

        Result.push(createVoucher(ledgerInfo["INC001015"].LeadgerCode, ledgerInfo["INC001015"].LeadgerName, ledgerInfo["INC001015"].LeadgerCategory, 
                      0, VoucherDataRequestModel.GrossAmount, VoucherDataRequestModel.transactionNumber));

        Object.keys(gst).forEach(item => {
          Result.push(createVoucher(ledgerInfo[item].LeadgerCode, ledgerInfo[item].LeadgerName, ledgerInfo[item].LeadgerCategory, 
                  0, gst[item], VoucherDataRequestModel.transactionNumber));
        });
      }
    }
    else if(type == "transfer") {
      if(this.isInterBranchControl) {
        Result.push(createVoucher(ledgerInfo["AST006002"].LeadgerCode, ledgerInfo["AST006002"].LeadgerName, ledgerInfo["AST006002"].LeadgerCategory, 
        VoucherDataRequestModel.netPayable, 0, VoucherDataRequestModel.transactionNumber));

        if(paybase == 'P01') 
        {         
          Result.push(createVoucher(ledgerInfo["INC001015"].LeadgerCode, ledgerInfo["INC001015"].LeadgerName, ledgerInfo["INC001015"].LeadgerCategory, 
                      0, VoucherDataRequestModel.GrossAmount, VoucherDataRequestModel.transactionNumber));

          Object.keys(gst).forEach(item => {
            Result.push(createVoucher(ledgerInfo[item].LeadgerCode, ledgerInfo[item].LeadgerName, ledgerInfo[item].LeadgerCategory, 
                    0, gst[item], VoucherDataRequestModel.transactionNumber));
          });
        }
        else {

            const diff = ConvertToNumber(VoucherDataRequestModel.netPayable - this.DocketDetails.tOTAMT,2);
            const gross =  ConvertToNumber(diff - VoucherDataRequestModel.GSTTotal, 2)

            Result.push(createVoucher(ledgerInfo["INC001009"].LeadgerCode, ledgerInfo["INC001009"].LeadgerName, ledgerInfo["INC001009"].LeadgerCategory, 
                      0, this.DocketDetails.tOTAMT, VoucherDataRequestModel.transactionNumber));

            Result.push(createVoucher(ledgerInfo["INC001015"].LeadgerCode, ledgerInfo["INC001015"].LeadgerName, ledgerInfo["INC001015"].LeadgerCategory, 
                      0, gross, VoucherDataRequestModel.transactionNumber));

            Object.keys(gst).forEach(item => {
              Result.push(createVoucher(ledgerInfo[item].LeadgerCode, ledgerInfo[item].LeadgerName, ledgerInfo[item].LeadgerCategory, 
                      0, gst[item], VoucherDataRequestModel.transactionNumber));
            });
        }
      }
    }
    
    return Result;
  }
  //#endregion
}
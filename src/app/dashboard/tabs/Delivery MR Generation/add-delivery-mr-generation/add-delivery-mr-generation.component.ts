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
import { StoreKeys } from 'src/app/config/myconstants';
import { InvoiceModel } from 'src/app/Models/dyanamic-form/dyanmic.form.model';
import { InvoiceServiceService } from 'src/app/Utility/module/billing/InvoiceSummaryBill/invoice-service.service';
import { ThcService } from 'src/app/Utility/module/operation/thc/thc.service';
import { StateService } from 'src/app/Utility/module/masters/state/state.service';
import { ConvertToNumber } from 'src/app/Utility/commonFunction/common';
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
  SummaryForm: UntypedFormGroup;
  filteredDocket = []
  DocketDetails: any;
  DocketFinDetails: any;
  SACCodeList: any;
  headerDetails: any;
  docketNo: any;
  AlljsonControlMRArray: any;
  totalMRamt: any;
  AccountsBanksList: any;

  ShowBookingTimeCharges = false;
  chargeList: any;
  DeliveryTimeChargesArray: any[];
  DeliveryTimeChargesForm: UntypedFormGroup;
  ChargesList: any;
  States: any[];
  GSTType: any;
  GSTRate: number = 12;
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
    private stateService: StateService
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
  initializeDeliveryMrFormControls() {
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


    this.deliveryMrTableForm.controls['ConsignmentNoteNumber'].setValue(this.docketNo);
    this.docketNo ? this.ValidateDocketNo() : null;
    this.GetGSTRate();
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
        this.SetDocketsDetails(this.DocketDetails);
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
  SetDocketsDetails(data) {
    this.deliveryMrTableForm.get('PayBasis').setValue(data.pAYTYPNM);
    this.deliveryMrTableForm.get('Consignor').setValue(`${data.cSGN.cD}:${data.cSGN.nM}`);
    this.deliveryMrTableForm.get('ConsignorGST').setValue(data.cSGN.gST);
    this.deliveryMrTableForm.get('Consignee').setValue(`${data.cSGE.cD}:${data.cSGE.nM}`);
    this.deliveryMrTableForm.get('ConsigneeGST').setValue(data.cSGE.gST);
    this.deliveryMrTableForm.get('GSTApplicability').setValue(data.rCM);
    this.GetBookingTimeCharges();
    if (data.cSGN.gST && data.cSGE.gST) {
      const StateCodeList = [parseInt(data.cSGN.gST.substring(0, 2)), parseInt(data.cSGE.gST.substring(0, 2))]
      this.GetStateCodeWiseStateDetails(StateCodeList);
    }
    this.fetchAndProcessCharges();
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
        disable: index == 2 ? false : true,
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
            metaData: element.aDD_DEDU,
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

    let TotalBookingTimeCharges = 0;
    let TotalEditedAmount = 0;
    let TotalDiffrentAmount = 0;

    for (let i = 1; i <= 3; i++) {
      this.DocketFinDetails.cHG.forEach(item => {
        const value = parseFloat(this.BookingTimechargesForm.get(item.cHGID + i).value);
        const amountToAdd = isNaN(value) ? 0 : (item.oPS === "+" ? value : -value);

        if (i === 1) {
          TotalBookingTimeCharges += amountToAdd;
        } else if (i === 2) {
          TotalEditedAmount += amountToAdd;
        } else if (i === 3) {
          TotalDiffrentAmount += amountToAdd;
        }
      });
    }

    // Calculate Delivery Time Charges
    let TotalDeliveryTimeCharges = 0;
    this.DeliveryTimeChargesArray.forEach((element) => {
      const value = parseFloat(this.DeliveryTimeChargesForm.get(element.name).value);
      const amountToAdd = isNaN(value) ? 0 : (element.additionalData.metaData === "+" ? value : -value);
      TotalDeliveryTimeCharges += amountToAdd;
    });
    const taxableAmount = TotalEditedAmount + NewFreight + TotalDeliveryTimeCharges;
    this.SummaryForm.get('DocketNewTotal').setValue(taxableAmount);

    let GSTAmount = ConvertToNumber(taxableAmount * (this.GSTRate / 100), 2);

    const gstToRemove = [];
    const gstApplied = [];
    for (const key in Object.keys(this.GSTType)) {
      if (!this.GSTType[key])
        gstToRemove.push[key];
      else
        gstApplied.push[key];
    }

    this.jsonSummaryControlArray = this.jsonSummaryControlArray.filter(x => !gstToRemove.includes(x.name));
    this.jsonSummaryControlArray.filter(f => gstApplied.includes(f.name)).forEach(item => {
      this.SummaryForm.get(item.name).setValue((GSTAmount / gstApplied.length).toFixed(2));
    });


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
      this.States = []
      if (res.data.length > 1)
        this.GSTType = await this.stateService.getGSTType(res.data[0], res.data[1]);
      else {
        this.GSTType = await this.stateService.getGSTType(res.data[0], res.data[0]);
      }
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
      this.GSTRate = res.data.GSTRT || 12;
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
        const responseFromAPIBank = await GetBankDetailFromApi(this.masterService, Accountinglocation)
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



  async GenerateMR(VoucherNo) {
    const DocketNo = this.deliveryMrTableForm.value.ConsignmentNoteNumber;
    if (DocketNo || !this.SummaryForm.valid) {
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
          const headerRequest = {
            cID: this.storage.companyCode,
            gCNNO: DocketNo,
            dLVRT: this.headerDetails.Deliveredto,
            cNTCTNO: this.headerDetails.ContactNumber,
            rCEIVNM: this.headerDetails.NameofReceiver ? this.headerDetails.NameofReceiver : '',
            CONSGNM: this.headerDetails.NameofConsignee ? this.headerDetails.NameofConsignee : '',
            mOD: this.PaymentSummaryFilterForm.value.PaymentMode,
            bNK: this.PaymentSummaryFilterForm.value.Bank.name,
            cHQNo: this.PaymentSummaryFilterForm.value.ChequeOrRefNo,
            cHQDT: this.PaymentSummaryFilterForm.value.Date,
            iSUBNK: this.PaymentSummaryFilterForm.value.issuedFromBank,
            oNACC: this.PaymentSummaryFilterForm.value.OnAccount,
            dPOSTBNKNM: this.PaymentSummaryFilterForm.value.depositedIntoBank.name,
            dPOSTBNKCD: this.PaymentSummaryFilterForm.value.depositedIntoBank.value,
            bILNGPRT: this.SummaryForm.value.BillingParty,
            bKNGST: this.SummaryForm.value.Stateofbooking,
            sPLYSTNM: this.SummaryForm.value.StateofSupply.name,
            sPLYSTCD: this.SummaryForm.value.StateofSupply.value,
            sACCDNM: this.SummaryForm.value.SACCode.name,
            sACCd: this.SummaryForm.value.SACCode.value,
            gSTRT: this.SummaryForm.value.GSTRate,
            gSTAMT: parseFloat(this.SummaryForm.value.GSTAmount.toFixed(2)) || 0,
            tDSSCTCD: this.SummaryForm.value.TDSSection.value,
            tDSSCTNM: this.SummaryForm.value.TDSSection.name,
            tDSRT: this.SummaryForm.value.TDSRate,
            tDSAmt: parseFloat(this.SummaryForm.value.TDSAmount).toFixed(2) || 0,
            gSTCHRGD: this.SummaryForm.value.GSTCharged,
            dLVRMRAMT: this.SummaryForm.value.DeliveryMRNetAmount,
            cLLCTAMT: this.SummaryForm.value.CollectionAmount,
            rNDOFF: this.SummaryForm.value.roundOffAmt || 0,
            pRTLYCLCTD: this.SummaryForm.value.PartiallyCollected,
            pRTLYRMGAMT: (this.SummaryForm.value.PartiallyCollectedAmt).toFixed(2) || 0,
            vNO: VoucherNo,
            lOC: this.storage.branch,
            eNTDT: new Date(),
            eNTLOC: this.storage.branch,
            eNTBY: this.storage.userName
          }
          const detailRequests = {
            cID: this.storage.companyCode,
            gCNNO: this.DocketDetails.dKTNO,
            cHG: this.DocketDetails.cHG,
            // pYBASIS: element.payBasis,
            // sUBTTL: parseFloat(element.subTotal),
            // nWSUBTTL: parseFloat(element.newSubTotal),
            // rTDFRNC: parseFloat(element.rateDifference),
            // vNO: VoucherNo,
            // lOC: this.storage.branch,
            // tOTL: parseFloat(element.totalAmount),
            eNTDT: new Date(),
            eNTLOC: this.storage.branch,
            eNTBY: this.storage.userName
          }

          let data = {
            chargeDetails: detailRequests,
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
          if (res) {
            const reqBody = {
              companyCode: this.storage.companyCode,
              collectionName: "voucher_trans",
              filter: { vNO: VoucherNo },
              update: {
                vTNO: res?.data?.chargeDetails?.ops[0]?.dLMRNO
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
        }
        catch (error) {
          this.snackBarUtilityService.ShowCommonSwal(
            "error",
            "Fail To Submit Data..!"
          );
        }
      }, "Delivery MR Generating..!");
    }

  }


  //#endregion
  GenerateVoucher() {
    const PaymentMode = this.PaymentSummaryFilterForm.get("PaymentMode").value;
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
    this.snackBarUtilityService.commonToast(async () => {
      try {

        this.VoucherRequestModel.companyCode = this.storage.companyCode;
        this.VoucherRequestModel.docType = "VR";
        this.VoucherRequestModel.branch = this.storage.branch;
        this.VoucherRequestModel.finYear = financialYear;

        this.VoucherDataRequestModel.voucherNo = "";
        this.VoucherDataRequestModel.transCode = VoucherInstanceType.DeliveryMR;
        this.VoucherDataRequestModel.transType = VoucherInstanceType[VoucherInstanceType.DeliveryMR];
        this.VoucherDataRequestModel.voucherCode = VoucherType.JournalVoucher;
        this.VoucherDataRequestModel.voucherType = VoucherType[VoucherType.JournalVoucher];
        this.VoucherDataRequestModel.transDate = new Date();
        this.VoucherDataRequestModel.docType = "VR";
        this.VoucherDataRequestModel.branch = this.storage.branch;
        this.VoucherDataRequestModel.finYear = financialYear;

        this.VoucherDataRequestModel.accLocation = this.storage.branch;
        this.VoucherDataRequestModel.preperedFor = "Customer"
        this.VoucherDataRequestModel.partyCode = this.filteredDocket[0]?.bPARTY;
        this.VoucherDataRequestModel.partyName = this.filteredDocket[0]?.bPARTYNM;
        this.VoucherDataRequestModel.partyState = this.SummaryForm.value.StateofSupply.name
        this.VoucherDataRequestModel.entryBy = this.storage.userName;
        this.VoucherDataRequestModel.entryDate = new Date();
        this.VoucherDataRequestModel.panNo = ""

        this.VoucherDataRequestModel.tdsSectionCode = this.SummaryForm.value.SACCode.value;
        this.VoucherDataRequestModel.tdsSectionName = this.SummaryForm.value.SACCode.name;
        this.VoucherDataRequestModel.tdsRate = this.SummaryForm.value.TDSRate;
        this.VoucherDataRequestModel.tdsAmount = this.SummaryForm.value.TDSAmount;
        this.VoucherDataRequestModel.tdsAtlineitem = false;
        this.VoucherDataRequestModel.tcsSectionCode = undefined
        this.VoucherDataRequestModel.tcsSectionName = undefined
        this.VoucherDataRequestModel.tcsRate = 0;
        this.VoucherDataRequestModel.tcsAmount = 0;

        this.VoucherDataRequestModel.IGST = 0;
        this.VoucherDataRequestModel.SGST = 0;
        this.VoucherDataRequestModel.CGST = 0;
        this.VoucherDataRequestModel.UGST = 0;
        this.VoucherDataRequestModel.GSTTotal = this.SummaryForm.value.GSTAmount;

        this.VoucherDataRequestModel.GrossAmount = this.SummaryForm.value.DeliveryMRNetAmount || 0;
        this.VoucherDataRequestModel.netPayable = this.SummaryForm.value.CollectionAmount || 0;
        this.VoucherDataRequestModel.roundOff = this.SummaryForm.value.roundOffAmt || 0;
        this.VoucherDataRequestModel.voucherCanceled = false;

        this.VoucherDataRequestModel.paymentMode = this.PaymentSummaryFilterForm.value.PaymentMode;
        this.VoucherDataRequestModel.refNo = this.PaymentSummaryFilterForm.value?.ChequeOrRefNo;
        this.VoucherDataRequestModel.accountName = this.PaymentSummaryFilterForm.value?.Bank.name;
        this.VoucherDataRequestModel.accountCode = this.PaymentSummaryFilterForm.value?.Bank.value;
        this.VoucherDataRequestModel.date = this.PaymentSummaryFilterForm.value?.Date;
        this.VoucherDataRequestModel.scanSupportingDocument = "";


        const voucherlineItems = this.GetJournalVoucherLedgers();
        this.VoucherRequestModel.details = voucherlineItems;
        this.VoucherRequestModel.data = this.VoucherDataRequestModel;
        this.VoucherRequestModel.debitAgainstDocumentList = [];

        firstValueFrom(this.voucherServicesService
          .FinancePost("fin/account/voucherentry", this.VoucherRequestModel)).then((res: any) => {
            if (res.success) {
              let reqBody = {
                companyCode: this.storage.companyCode,
                voucherNo: res?.data?.mainData?.ops[0].vNO,
                transDate: Date(),
                finYear: financialYear,
                branch: this.storage.branch,
                transCode: VoucherInstanceType.BalancePayment,
                transType:
                  VoucherInstanceType[VoucherInstanceType.BalancePayment],
                voucherCode: VoucherType.JournalVoucher,
                voucherType: VoucherType[VoucherType.JournalVoucher],
                docType: "Voucher",
                partyType: "Vendor",
                docNo: this.docketNo,
                partyCode: "" + this.DocketDetails.cSGE?.cD || "",
                partyName: this.DocketDetails.cSGE?.nM || "",
                entryBy: this.storage.userName,
                entryDate: Date(),
                debit: voucherlineItems
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
                credit: voucherlineItems
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
              firstValueFrom(
                this.voucherServicesService.FinancePost(
                  "fin/account/posting",
                  reqBody
                )
              ).then((res: any) => {
                if (res.success) {
                  this.GenerateMR(reqBody.voucherNo)
                  Swal.hideLoading();
                  Swal.close();
                } else {
                  this.snackBarUtilityService.ShowCommonSwal(
                    "error",
                    "Fail To Do Account Posting..!"
                  );
                }
              });
            }
          })
          .catch((error) => {
            this.snackBarUtilityService.ShowCommonSwal("error", error);
          })
          .finally(() => { });
      } catch (error) {
        this.snackBarUtilityService.ShowCommonSwal(
          "error",
          "Fail To Submit Data..!"
        );
      }
    }, "Delivery MR Voucher Generating..!");

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
  GetJournalVoucherLedgers() {
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

    Result.push(createVoucher(ledgerInfo["INC001006"].LeadgerCode, ledgerInfo["INC001006"].LeadgerName, ledgerInfo["INC001006"].LeadgerCategory,
      0, parseFloat(this.SummaryForm.value.CollectionAmount) || 0, this.docketNo));
    Result.push(createVoucher(ledgerInfo["AST001002"].LeadgerCode, ledgerInfo["AST001002"].LeadgerName, ledgerInfo["AST001002"].LeadgerCategory,
      parseFloat(this.SummaryForm.value.CollectionAmount) || 0, 0, this.docketNo));

    return Result;
  }
  //#endregion
}
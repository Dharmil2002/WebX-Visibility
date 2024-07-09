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
import { SACInfo, VoucherDataRequestModel, VoucherInstanceType, VoucherRequestModel, VoucherType, ledgerInfo } from 'src/app/Models/Finance/Finance';
import { VoucherServicesService } from 'src/app/core/service/Finance/voucher-services.service';
import { DocketService } from 'src/app/Utility/module/operation/docket/docket.service';
import { GenericActions, StoreKeys } from 'src/app/config/myconstants';
import { InvoiceModel } from 'src/app/Models/dyanamic-form/dyanmic.form.model';
import { InvoiceServiceService } from 'src/app/Utility/module/billing/InvoiceSummaryBill/invoice-service.service';
import { ThcService } from 'src/app/Utility/module/operation/thc/thc.service';
import { StateService } from 'src/app/Utility/module/masters/state/state.service';
import { ConvertToNumber } from 'src/app/Utility/commonFunction/common';
import { ControlPanelService } from 'src/app/core/service/control-panel/control-panel.service';
import { GeneralService } from 'src/app/Utility/module/masters/general-master/general-master.service';
import { AutoComplete } from 'src/app/Models/drop-down/dropdown';
import { GetGeneralMasterData } from 'src/app/Masters/Customer Contract/CustomerContractAPIUtitlity';
import { setGeneralMasterData } from 'src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction';
import { CustomerService } from 'src/app/Utility/module/masters/customer/customer.service';
import { getApiCompanyDetail } from 'src/app/finance/invoice-summary-bill/invoice-utility';
import { CustomerBillStatus } from 'src/app/Models/docStatus';
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
  bookingChargeList: any;
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
  checkboxChecked: boolean = true; // Checkbox is checked by default
  paymentMode: AutoComplete[];
  rateType: AutoComplete[];
  Demurragecharge: number = 0;
  chargeDetails: any;
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
    private thcService: ThcService,
    private stateService: StateService,
    private controlPanel: ControlPanelService,
    private generalService: GeneralService,
    private invoiceServiceService: InvoiceServiceService,
    private customerService: CustomerService,
  ) {
    if (this.router.getCurrentNavigation()?.extras?.state != null) {
      const data = this.router.getCurrentNavigation()?.extras?.state.data;
      this.docketNo = data.data.no;
    }
    // else {
    //   this.docketNo = "DEL2013";
    // }
  }

  ngOnInit(): void {
    this.initializeDeliveryMrFormControls();
    this.getGeneralmasterData();
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
    this.OnChangeCheckBox({ event: { event: { checked: true } } });
    this.PaymentSummaryFilterForm.controls.PaymentMode.setValue("Cash");
    this.OnPaymentModeChange(event);
  }
  //#endregion

  //#region
  async getContractDetails(docketdetails) {
    const request = {
      companyCode: this.storage.companyCode,
      collectionName: "cust_contract",
      filter: {
        cONID: docketdetails.cONTRACT
      }
    };
    const result = await firstValueFrom(this.operation.operationMongoPost(GenericActions.GetOne, request));
    if (result?.data) {
      const demurrage = {
        "dMRTPD": result?.data.dMRTPD,
        "dRTYP": result?.data.dRTYP,
        "fSDAY": result?.data.fSDAY,
        "dMIN": result?.data.dMIN,
        "dMAX": result?.data.dMAX
      }
      const arrivalData = await this.getArrivalDate(docketdetails);
      this.calculateDemurrage(docketdetails, demurrage, arrivalData);
      return result?.data;
    }
    return null;
  }
  //#endregion
  async getArrivalDate(docketdetails) {
    const request = {
      companyCode: this.storage.companyCode,
      collectionName: "docket_ops_det_ltl",
      filter: {
        dKTNO: docketdetails.dKTNO
      }
    };
    const result = await firstValueFrom(this.operation.operationMongoPost(GenericActions.GetOne, request));

    if (result?.data) {
      return result?.data;

    }
    return null;
  }
  //#region
  calculateDemurrage(docket, demurrage, arrivalData) {

    // Calculate the number of days from arrival date to current date
    const arrivalDate = new Date(arrivalData?.aRRDT);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - arrivalDate.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Calculate the demurrage days (total days - free storage days)
    const demurrageDays = Math.max(totalDays - demurrage.fSDAY, 0);
    if (demurrageDays === 0) {
      this.Demurragecharge = 0;
      return 0;
    }
    // Calculate the charges based on rate per kg or rate per package per day
    let charge = 0;
    if (demurrage.dRTYP === "RTTYP-0005" && demurrage.dMRTPD !== null) { // Per Kg
      charge = docket.cHRWT * demurrage.dMRTPD * demurrageDays;
    }
    else if (demurrage.dRTYP === "RTTYP-0006" && demurrage.dMRTPD !== null) { // Per Pkg
      charge = docket.pKGS * demurrage.dMRTPD * demurrageDays;
    }
    else {
      throw new Error("Unsupported rate type or missing rate value.");
    }

    // Apply the minimum and maximum charges in one line
    charge = Math.min(Math.max(charge, demurrage.dMIN), demurrage.dMAX);
    this.Demurragecharge = charge;
    return charge;
  }
  //#endregion



  //#region getGeneralmasterData for PAYMOD
  async getGeneralmasterData() {
    const gmData = await this.generalService.getGeneralMasterData(["PAYMOD", "RTTYP"]);
    this.paymentMode = gmData.filter((x) => x.type == "PAYMOD");
    this.rateType = gmData.filter((x) => x.type == "RTTYP");
    console.log("this.rateType", this.rateType);
    setGeneralMasterData(this.AlljsonControlPaymentSummaryFilterArray, this.paymentMode, "PaymentMode");
  }
  //#endregion

  //#region to validate docket number
  async ValidateDocketNo() {
    const DocketNo = this.deliveryMrTableForm.value.ConsignmentNoteNumber;
    if (!DocketNo) {
      return;
    }

    try {
      const filter = { "cID": this.storage.companyCode, dEST: this.storage.branch, "dKTNO": DocketNo, pAYTYP: { D$in: ["P01", "P03"] } };
      const docketdetails = await this.docketService.getDocketsDetailsLtl(filter);
      this.getContractDetails(docketdetails[0]);
      this.getArrivalDate(docketdetails[0]);
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
  //#endregion

  //#region SetDocketsDetails
  async SetDocketsDetails(data) {
    this.deliveryMrTableForm.get('PayBasis').setValue(data.pAYTYPNM);
    this.deliveryMrTableForm.get('Consignor').setValue(`${data.cSGN.cD}:${data.cSGN.nM}`);
    this.deliveryMrTableForm.get('ConsignorGST').setValue(data.cSGN.gST || "");
    this.deliveryMrTableForm.get('Consignee').setValue(`${data.cSGE.cD}:${data.cSGE.nM}`);
    this.deliveryMrTableForm.get('ConsigneeGST').setValue(data.cSGE.gST);
    this.deliveryMrTableForm.get('package').setValue(data.pKGS);
    this.deliveryMrTableForm.get('weight').setValue(data.aCTWT);
    this.deliveryMrTableForm.get('chargeweight').setValue(data.cHRWT);
    this.deliveryMrTableForm.get('bookingbranch').setValue(data.oRGN);

    this.isGSTApplicable = (data.rCM == "Y" || data.rCM == "RCM" || data.rCM == "") ? false : true;
    this.deliveryMrTableForm.get('GSTApplicability').setValue(this.isGSTApplicable ? "Yes" : "No");
    await this.GetBookingTimeCharges();
    if (data.cSGN.gST && data.cSGE.gST && data?.cSGN?.gST != "" && data?.cSGE?.gST != "") {
      const StateCodeList = [parseInt(data.cSGN.gST.substring(0, 2)), parseInt(data.cSGE.gST.substring(0, 2))]
      await this.GetStateCodeWiseStateDetails(StateCodeList);
    }
    await this.fetchAndProcessCharges("DeliveryMR", data.tRNMOD);
  }
  //#endregion

  //#region GetBookingTimeCharges
  async GetBookingTimeCharges() {

    const DocketNo = this.deliveryMrTableForm.value.ConsignmentNoteNumber;
    if (!DocketNo) {
      return;
    }

    const filterCharges = { "pRNm": this.DocketDetails.tRNMODNM, aCTV: true, cHBTY: "Booking" }
    const productFilter = {
      "cHACAT": { "D$in": ['C', 'B'] },
      "pRNM": this.DocketDetails.tRNMODNM,
      "cHAPP": { D$in: ["GCN"] },
      "cHATY": { 'D$eq': 'Charges' },
      isActive: true
    }
    this.bookingChargeList = await this.thcService.getChargesV2(filterCharges, productFilter);



    const filter = { cID: this.storage.companyCode, "dKTNO": DocketNo };
    const docketFindetails = await this.docketService.getDocketsFinDetailsLtl(filter);
    if (docketFindetails.length === 1) {
      this.DocketFinDetails = docketFindetails[0];
      await this.SetExtraBookingTimeCharges();
      if (this.DocketFinDetails.cHG && this.DocketFinDetails.cHG.length > 0) {
        this.ChargesList = await this.SetBookingTimeCharges(this.DocketFinDetails.cHG);
        this.AlljsonControlBookingTimechargesArray = [...this.jsonControlBookingTimechargesArray, ...this.ChargesList,];

        this.BookingTimechargesForm = formGroupBuilder(this.fb, [
          this.AlljsonControlBookingTimechargesArray,
        ]);
        this.BookingTimechargesForm.get('OldFreight').setValue(this.DocketFinDetails?.fRTAMT || 0);
        this.BookingTimechargesForm.get('NewFreight').setValue(this.DocketFinDetails?.fRTAMT || 0);
        this.ShowBookingTimeCharges = true;
      }
      else {

        this.AlljsonControlBookingTimechargesArray = [...this.jsonControlBookingTimechargesArray];
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
  //#endregion

  //#region SetBookingTimeCharges & generateCharges
  async SetBookingTimeCharges(chargesList) {

    const generateCharges = (charge) => {
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
          } : [],
        ],
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
    chargesList.forEach(charge => {
      combinedCharges = combinedCharges.concat(generateCharges(charge));
    });

    return combinedCharges;
  }
  //#endregion

  //#region SetExtraBookingTimeCharges
  async SetExtraBookingTimeCharges() {
    this.bookingChargeList.forEach(charge => {
      if (this.DocketFinDetails.cHG && this.DocketFinDetails.cHG.length > 0) {
        if (!this.DocketFinDetails.cHG.find(item => item.cHGID === charge.cHACD)) {
          this.DocketFinDetails.cHG.push({
            cHGID: charge.cHACD,
            cHGNM: charge.cAPTION,
            aMT: 0,
            oPS: charge.aDD_DEDU === "+" ? "+" : "-",
            cHACAT: charge.cHACAT
          });
        }
      }
    });
  }
  //#endregion

  //#region Fetch and Process Charges
  private async fetchAndProcessCharges(ChargeName, ProductCode) {
    this.chargeList = await this.thcService.getCharges({
      "cHAPP": { 'D$eq': ChargeName },
      "pRCD": { 'D$eq': ProductCode },
      "cHATY": { 'D$eq': 'Charges' },
      'isActive': { 'D$eq': true }
    });

    if (this.chargeList && this.chargeList.length > 0) {
      const invoiceList = this.chargeList
        .filter(element => element)
        .map((element, index) => {

          const value = element.cHACD === 'CHA0005' ? this.Demurragecharge : 0;
          return {
            id: 1 + index,
            name: element.cHACD || '',
            label: `${element.cAPTION}(${element.aDD_DEDU})`,
            placeholder: element.cAPTION || '',
            type: 'number',
            value: value,
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
          }
        });

      const enable = invoiceList.map(x => ({
        ...x,
        name: `${x.name}`,
        disable: false
      }));
      this.DeliveryTimeChargesArray = enable.sort((a, b) => a.name.localeCompare(b.name));
      this.DeliveryTimeChargesForm = formGroupBuilder(this.fb, [this.DeliveryTimeChargesArray]);
    }
    this.OnChangeBookingTimeCharges(null);
  }
  //#endregion

  //#region  OnChangeBookingTimeCharges
  OnChangeBookingTimeCharges(event) {
    // Set Diffrent Amount
    if (event) {
      if (event.field.FormType === "BookingTimeCharges") {
        const OldAmount = parseFloat(this.BookingTimechargesForm.get(event.field.ChargeId + "1").value);
        const NewAmount = parseFloat(this.BookingTimechargesForm.get(event.field.ChargeId + "2").value);
        const DiffAmount = parseFloat((NewAmount - OldAmount).toFixed(2));
        this.BookingTimechargesForm.get(event.field.ChargeId + "3").setValue(DiffAmount);
      }
    }
    const NewFreight = Number(this.BookingTimechargesForm.get('NewFreight').value || 0);
    // Calculate the Booking time charges

    this.TotalBookingTimeCharges = 0;
    this.TotalEditedAmount = 0;
    this.TotalDiffrentAmount = 0;

    for (let i = 1; i <= 3; i++) {
      if (this.DocketFinDetails.cHG && this.DocketFinDetails.cHG.length > 0) {
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
    }

    // Calculate Delivery Time Charges
    this.TotalDeliveryTimeCharges = 0;
    if (this.DeliveryTimeChargesArray != undefined) {
      this.DeliveryTimeChargesArray.forEach((element) => {
        const value = parseFloat(this.DeliveryTimeChargesForm.get(element.name).value);
        const amountToAdd = isNaN(value) ? 0 : (element.additionalData.metaData.aDD_DEDU === "-" ? -value : value);
        this.TotalDeliveryTimeCharges += amountToAdd;
      });
    }
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
  //#endregion

  //#region  Function to calculate and update summary form values
  updateSummaryForm(total, eventCheck) {
    const roundedValue = eventCheck ? Math.ceil(total) : total;
    const diff = ConvertToNumber(roundedValue - total, 2);

    this.SummaryForm.get("RoundOffAmount").setValue(diff.toFixed(2));
    this.SummaryForm.get("RoundedOff").setValue(roundedValue.toFixed(2));
  }
  //#endregion

  //#region  Function to calculate and update collection form values
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
  //#endregion

  //#region  Handler for checkbox change
  OnChangeCheckBox(event) {
    const total = ConvertToNumber(this.SummaryForm.get("Dockettotal").value, 2);
    this.updateSummaryForm(total, event?.event?.checked);

    const roundedValue = ConvertToNumber(this.SummaryForm.get("RoundedOff").value, 2);
    this.updateCollectionForm(roundedValue);
  }
  //#endregion

  //#region  Handler for toggle up/down
  toggleUpDown(event) {
    const total = ConvertToNumber(this.SummaryForm.get("Dockettotal").value, 2);
    const isUpDown = event.isUpDown;
    this.updateSummaryForm(total, isUpDown);

    const roundedValue = ConvertToNumber(this.SummaryForm.get("RoundedOff").value, 2);
    this.updateCollectionForm(roundedValue);
  }
  //#endregion

  //#region GetStateCodeWiseStateDetails
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
      this.States = res.data;
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
  //#endregion

  //#region GetAccountingRules
  async getAccountingRules() {
    const filter = {
      cID: this.storage.companyCode,
      mODULE: "THC",
      aCTIVE: true,
      rULEID: { D$in: ["THCIBC", "THCCB"] }
    }
    const res: any = await this.controlPanel.getModuleRules(filter);
    if (res.length > 0) {
      this.isInterBranchControl = res.find(x => x.rULEID === "THCIBC")?.vAL === true ? true : false;
    }
  }
  //#endregion

  //#region GetGSTRate
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
  //#endregion

  //#region Voucher Generation
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
      case "Credit":
        this.PaymentSummaryFilterForm.controls["CashAccount"].disable();
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
      case "Credit":
        this.PaymentSummaryFilterForm.controls["CashAccount"].disable();
        break;
    }
  }
  //#endregion

  //#region Generate MR
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

          let btChgs = [];
          if (this.DocketFinDetails.cHG && this.DocketFinDetails.cHG.length > 0) {
            btChgs = this.DocketFinDetails.cHG.map(item => {
              let d = {
                ...item,
                cHACAT: "B"
              };

              const value = ConvertToNumber(this.BookingTimechargesForm.get(d.cHGID + 2).value, 2);
              d.aMT = isNaN(value) ? 0 : (d.oPS === "-" ? -value : value);
              return d;
            });
          }

          let dtChgs = [];
          if (this.DeliveryTimeChargesArray != undefined) {
            dtChgs = this.DeliveryTimeChargesArray.map((d) => {

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
          }

          let PaymentMode = this.PaymentSummaryFilterForm.value.PaymentMode
          const headerRequest = {
            cID: this.storage.companyCode,
            gCNNO: DocketNo,
            dLVRT: "",
            cNTCTNO: this.DocketDetails.cSGN?.mOB || '',
            rCEIVNM: this.DocketDetails.cSGN?.nM || '',
            CONSGNM: this.DocketDetails.cSGN?.nM || '',
            mOD: this.PaymentSummaryFilterForm.value.PaymentMode,
            bNK: (PaymentMode === 'Cheque' || PaymentMode === 'RTGS/UTR') ? this.AccountsBanksList.find(item => item.bANCD == this.PaymentSummaryFilterForm.value.Bank.value)?.aCNM || '' : '',
            cHQNo: (PaymentMode === 'Cheque' || PaymentMode === 'RTGS/UTR') ? this.PaymentSummaryFilterForm.value.ChequeOrRefNo || '' : '',
            cHQDT: (PaymentMode === 'Cheque' || PaymentMode === 'RTGS/UTR') ? this.PaymentSummaryFilterForm.value.Date || '' : '',
            iSUBNK: "",
            oNACC: "",
            dPOSTBNKNM: (PaymentMode === 'Cheque' || PaymentMode === 'RTGS/UTR') ? this.PaymentSummaryFilterForm.value.Bank.name : '',
            dPOSTBNKCD: (PaymentMode === 'Cheque' || PaymentMode === 'RTGS/UTR') ? this.PaymentSummaryFilterForm.value.Bank.value : '',
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
            mRDT: this.deliveryMrTableForm.controls.mrdate.value || "",
            rECNM: this.deliveryMrTableForm.controls.receivername.value || "",
            mOBNO: this.deliveryMrTableForm.controls.mobileno.value || "",
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
            if (headerRequest.cLLCTAMT > 0 && headerRequest.mOD !== "Credit") {
              const vRes: any = await this.GenerateVoucher(res?.data.data.ops[0]);
              if (vRes && vRes.length > 0) {
                const reqMR = {
                  companyCode: this.storage.companyCode,
                  collectionName: "delivery_mr_header",
                  filter: { docNo: res?.data?.header?.docNo, cID: this.storage.companyCode },
                  update: {
                    vNO: vRes
                  }
                }
                await firstValueFrom(this.operation.operationPut(GenericActions.UpdateMany, reqMR));

                const reqMRDet = {
                  companyCode: this.storage.companyCode,
                  collectionName: "delivery_mr_details",
                  filter: { dLMRNO: res?.data?.header?.docNo, cID: this.storage.companyCode },
                  update: {
                    vNO: vRes
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
            else if (headerRequest.mOD === "Credit") {
              // If Payment Mode is To Pay then Generate Bill 
              if (this.DocketDetails.pAYTYP == "P03") {
                this.chargeDetails = res.data.chargeDetails
                this.AutoCustomerInvoicing();
              } else {
                this.router.navigate(["/dashboard/DeliveryMrGeneration/Result"], {
                  state: {
                    data: res.data.chargeDetails
                  },
                });
              }
            }
            else {
              this.snackBarUtilityService.ShowCommonSwal(
                "success",
                "Delivery MR Generating..!"
              );
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

  //#region Generate Voucher
  async GenerateVoucher(data) {

    let Result = [];
    if (!data)
      return null;

    const dmr = data;
    if (!dmr)
      return null;

    try {

      const paybase = this.DocketDetails.pAYTYP;
      let requestModel = this.PrepareVoucher("collection", this.storage.branch, dmr, paybase);
      const res = await firstValueFrom(this.voucherServicesService.FinancePost("fin/account/voucherentry", requestModel));
      if (res.success) {
        Result.push(res?.data?.mainData?.ops[0].vNO);
        await this.accountPosting(res, this.storage.branch, requestModel);
      }

      if (this.isInterBranchControl) {
        let requestModel2 = this.PrepareVoucher("transfer", this.DocketDetails.oRGN, dmr, paybase);
        const res2 = await firstValueFrom(this.voucherServicesService.FinancePost("fin/account/voucherentry", requestModel2));
        if (res2.success) {
          Result.push(res2?.data?.mainData?.ops[0].vNO);
          await this.accountPosting(res2, this.DocketDetails.oRGN, requestModel2);
        }
      }
      return Result;

    } catch (error) {
      this.snackBarUtilityService.ShowCommonSwal(
        "error",
        "Fail To Submit Data..!"
      );
    }
  }
  //#endregion

  //#region Account Posting
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
      debit: requestModel.details
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
      credit: requestModel.details
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
  //#endregion

  //#region Prepare Voucher
  PrepareVoucher(type, branch, dmr, paybase): any {

    let voucherRequestModel = new VoucherRequestModel();
    let voucherDataRequestModel = new VoucherDataRequestModel();
    const PaymentMode = this.PaymentSummaryFilterForm.get("PaymentMode").value;

    let gst = {};
    let GSTAmount = ConvertToNumber(dmr.cLLCTAMT - (dmr.cLLCTAMT / (1 + (this.GSTRate / 100))), 2);
    if (!this.isGSTApplicable) {
      GSTAmount = 0;
    }
    else {
      this.GSTApplied.map(x => {
        gst[x] = ConvertToNumber(GSTAmount / this.GSTApplied.length, 2);
      });
    }

    let AccountDetails;
    if (PaymentMode == "Cheque" || PaymentMode == "RTGS/UTR") {
      const BankDetails = this.PaymentSummaryFilterForm.get("Bank").value;
      AccountDetails = this.AccountsBanksList.find(item => item.bANCD == BankDetails?.value && item.bANM == BankDetails?.name)
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
    if (this.DocketDetails.pAYTYP == 'P01') {
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

    voucherDataRequestModel.GrossAmount = ConvertToNumber(dmr.cLLCTAMT - GSTAmount, 2) || 0;
    voucherDataRequestModel.netPayable = ConvertToNumber(dmr.cLLCTAMT, 2) || 0;
    voucherDataRequestModel.roundOff = 0;
    voucherDataRequestModel.voucherCanceled = false;

    voucherDataRequestModel.paymentMode = this.PaymentSummaryFilterForm.value.PaymentMode;
    voucherDataRequestModel.refNo = (PaymentMode === 'Cheque' || PaymentMode === 'RTGS/UTR') ? this.PaymentSummaryFilterForm.value.ChequeOrRefNo : "";
    voucherDataRequestModel.accountName = (PaymentMode === 'Cheque' || PaymentMode === 'RTGS/UTR') ? AccountDetails?.bANM : this.PaymentSummaryFilterForm.value.CashAccount.name;
    voucherDataRequestModel.accountCode = (PaymentMode === 'Cheque' || PaymentMode === 'RTGS/UTR') ? AccountDetails?.bANCD : this.PaymentSummaryFilterForm.value.CashAccount.value;
    voucherDataRequestModel.date = (PaymentMode === 'Cheque' || PaymentMode === 'RTGS/UTR') ? this.PaymentSummaryFilterForm.value.date : "";

    voucherDataRequestModel.scanSupportingDocument = "";
    voucherDataRequestModel.transactionNumber = dmr.docNo;

    const voucherlineItems = this.GetJournalVoucherLedgers(type, voucherDataRequestModel, gst, paybase);
    voucherRequestModel.details = voucherlineItems;
    voucherRequestModel.data = voucherDataRequestModel;
    voucherRequestModel.debitAgainstDocumentList = [];

    return voucherRequestModel;
  }
  //#endregion

  //#region to disable submit btn
  isSubmitDisabled(): boolean {
    return (
      !this.deliveryMrTableForm.valid ||
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
  //#endregion

  //#region Get Journal Voucher Ledgers
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

    if (type == "collection") {
      const PaymentMode = VoucherDataRequestModel.paymentMode;
      if (this.isInterBranchControl) {
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
      // Calculate Total Credit and Debit Amount If Any Difrrence Add to Gross Amount
      const TotalCredit = Result.reduce((a, b) => a + parseFloat(b.credit), 0);
      if (PaymentMode == "Cash") {
        Result.push(createVoucher(VoucherDataRequestModel.accountCode, VoucherDataRequestModel.accountName, "ASSET", TotalCredit, 0, VoucherDataRequestModel.transactionNumber));
      }
      if (PaymentMode == "Cheque" || PaymentMode == "RTGS/UTR") {
        const AccountDetails = this.AccountsBanksList.find(item => item.bANCD == VoucherDataRequestModel.accountCode && item.bANM == VoucherDataRequestModel.accountName)
        Result.push(createVoucher(AccountDetails.aCCD, AccountDetails.aCNM, "ASSET", TotalCredit, 0, VoucherDataRequestModel.transactionNumber));
      }
    }
    else if (type == "transfer") {
      if (this.isInterBranchControl) {
        Result.push(createVoucher(ledgerInfo["AST006002"].LeadgerCode, ledgerInfo["AST006002"].LeadgerName, ledgerInfo["AST006002"].LeadgerCategory,
          VoucherDataRequestModel.netPayable, 0, VoucherDataRequestModel.transactionNumber));

        if (paybase == 'P01') {
          Object.keys(gst).forEach(item => {
            Result.push(createVoucher(ledgerInfo[item].LeadgerCode, ledgerInfo[item].LeadgerName, ledgerInfo[item].LeadgerCategory,
              0, gst[item], VoucherDataRequestModel.transactionNumber));
          });

          let totalGST = 0;
          Object.keys(gst).forEach(item => {
            totalGST += gst[item];
          });

          if (totalGST != 0) {
            Result.push(createVoucher(ledgerInfo["INC001015"].LeadgerCode, ledgerInfo["INC001015"].LeadgerName, ledgerInfo["INC001015"].LeadgerCategory,
              0, VoucherDataRequestModel.netPayable - totalGST, VoucherDataRequestModel.transactionNumber));
          }
        }
        else {

          const diff = ConvertToNumber(VoucherDataRequestModel.netPayable - this.DocketDetails.tOTAMT, 2);
          const gross = ConvertToNumber(diff - VoucherDataRequestModel.GSTTotal, 2)

          Result.push(createVoucher(ledgerInfo["INC001009"].LeadgerCode, ledgerInfo["INC001009"].LeadgerName, ledgerInfo["INC001009"].LeadgerCategory,
            0, this.DocketDetails.tOTAMT, VoucherDataRequestModel.transactionNumber));

          if (gross != 0) {
            Result.push(createVoucher(ledgerInfo["INC001015"].LeadgerCode, ledgerInfo["INC001015"].LeadgerName, ledgerInfo["INC001015"].LeadgerCategory,
              0, gross, VoucherDataRequestModel.transactionNumber));
          }

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

  //#region Auto Customer Invoicing for Paid  GCN WT-930
  async AutoCustomerInvoicing() {
    // STEP 1: Get the required data from the form
    const DocketNo = this.DocketDetails.dKTNO;
    const customerCode = this.DocketDetails.cSGE.cD;
    const customerName = this.DocketDetails.cSGE.nM;
    // STEP 2: Prepare the request body For For Approve GCN And Call the API
    const DocketStatusResult = this.invoiceServiceService.updateShipmentStatus(DocketNo, "LTL");
    if (DocketStatusResult) {
      // STEP 3: Prepare the request body For Customer Bill Generation And Call the API
      const custList = await this.customerService.customerFromFilter({ customerCode: customerCode }, false);
      const CustomerDetails = custList[0];
      const custGroup = await this.customerService.customerGroupFilter(CustomerDetails?.customerGroup);
      const tranDetail = await getApiCompanyDetail(this.masterService);
      const gstAppliedList = await this.stateService.checkGst(tranDetail?.data[0].gstNo, this.DocketDetails?.cSGN?.gST);
      const gstTypes = Object.fromEntries(
        Object.entries(gstAppliedList).filter(([key, value]) => value === true)
      )
      let jsonBillingList = [
        {
          _id: "",
          bILLNO: "",
          dKTNO: DocketNo,
          cID: this.storage.companyCode,
          oRGN: this.DocketDetails?.oRGN || "",
          dEST: this.DocketDetails?.dEST || "",
          dKTDT: this.DocketDetails?.dKTDT || new Date(),
          cHRGWT: this.DocketDetails?.cHRWT || 0.00,
          dKTAMT: this.DocketDetails?.fRTAMT || 0.00,
          dKTTOT: this.DocketDetails?.gROAMT || 0.00,
          sUBTOT: this.DocketDetails?.gROAMT || 0.00,
          gSTTOT: this.DocketDetails?.gSTCHAMT || 0.00,
          gSTRT: this.DocketDetails?.gSTRT || 0.00,
          tOTAMT: this.DocketDetails?.tOTAMT || 0.00,
          fCHRG: this.DocketDetails?.fRTRT || 0.00,
          sGST: 'SGST'.includes(Object.keys(gstTypes).join()) ? parseFloat(this.DocketDetails?.gSTCHAMT) / 2 : 0,
          sGSTRT: 'SGST'.includes(Object.keys(gstTypes).join()) ? parseFloat(this.DocketDetails.gSTRT || 0) / 2 : 0,
          cGST: 'CGST'.includes(Object.keys(gstTypes).join()) ? parseFloat(this.DocketDetails?.gSTCHAMT) / 2 : 0,
          cGSTRT: 'CGST'.includes(Object.keys(gstTypes).join()) ? parseFloat(this.DocketDetails.gSTRT || 0) / 2 : 0,
          uTGST: 'UTGST'.includes(Object.keys(gstTypes).join()) ? parseFloat(this.DocketDetails?.gSTCHAMT) : 0,
          uTGSTRT: 'UTGST'.includes(Object.keys(gstTypes).join()) ? parseFloat(this.DocketDetails.gSTRT || 0) : 0,
          iGST: 'IGST'.includes(Object.keys(gstTypes).join()) ? parseFloat(this.DocketDetails?.gSTCHAMT) : 0,
          iGSTRT: 'IGST'.includes(Object.keys(gstTypes).join()) ? parseFloat(this.DocketDetails.gSTRT || 0) : 0,
          eNTDT: new Date(),
          eNTLOC: this.storage.branch || "",
          eNTBY: this.storage?.userName || "",
        }];
      const billData = {
        "_id": `${this.storage.companyCode}` || "",
        "cID": this.storage.companyCode,
        "companyCode": this.storage.companyCode,
        "dOCTYP": "Transaction",
        "dOCCD": "T",
        "bUSVRT": "LTL",
        "bILLNO": "",
        "bGNDT": new Date(),
        "bDUEDT": new Date(),
        "bLOC": this.DocketDetails?.dEST || "",
        "pAYBAS": this.DocketDetails?.pAYTYP,
        "tRNMODE": this.DocketDetails?.tRNMOD,
        "bSTS": CustomerBillStatus.Submitted,
        "bSTSNM": CustomerBillStatus[CustomerBillStatus.Submitted],
        "bSTSDT": new Date(),
        "eXMT": this.DocketDetails?.rCM == "Y" ? true : false,
        "eXMTRES": "",
        "gEN": {
          "lOC": this.DocketDetails?.oRGN || "",
          "cT": this.DocketDetails?.fCT || "",
          "sT": "",
          "gSTIN": "",
        },
        "sUB": {
          "lOC": this.storage.branch,
          "tO": customerName,
          "tOMOB": CustomerDetails?.customer_mobile || "",
          "dTM": this.DocketDetails?.dKTDT || new Date(),
          "dOC": ""
        },
        "cOL": {
          "lOC": "",
          "aMT": 0.00,
          "bALAMT": this.DocketDetails?.tOTAMT || 0.00,
        },
        "cUST": {
          "cD": customerCode,
          "nM": customerName,
          "tEL": CustomerDetails?.customer_mobile || "",
          "aDD": CustomerDetails?.RegisteredAddress || "",
          "eML": CustomerDetails?.Customer_Emails || "",
          "cT": CustomerDetails?.city || "",
          "sT": CustomerDetails?.state || "",
          "gSTIN": CustomerDetails?.GSTdetails ? CustomerDetails?.GSTdetails?.[0]?.gstNo : "",
          "cGCD": custGroup?.groupCode || "",
          "cGNM": custGroup?.groupName || "",
        },
        "gST": {
          "tYP": Object.keys(gstTypes).join() || "",
          "rATE": this.DocketDetails?.gSTRT || 0.00,
          "iGST": 'IGST'.includes(Object.keys(gstTypes).join()) ? parseFloat(this.DocketDetails?.gSTCHAMT) : 0,
          "uTGST": 'UTGST'.includes(Object.keys(gstTypes).join()) ? parseFloat(this.DocketDetails?.gSTCHAMT) : 0,
          "cGST": 'CGST'.includes(Object.keys(gstTypes).join()) ? parseFloat(this.DocketDetails?.gSTCHAMT) / 2 : 0,
          "sGST": 'SGST'.includes(Object.keys(gstTypes).join()) ? parseFloat(this.DocketDetails?.gSTCHAMT) / 2 : 0,
          "aMT": this.DocketDetails?.gSTCHAMT || 0.00,
        },
        "aPR": {
          "loc": this.storage.branch,
          "aDT": new Date(),
          "aBY": this.storage.userName,
        },
        "sUPDOC": "",
        "pRODID": this.DocketDetails?.tRNMOD || "",
        "dKTCNT": 1,
        "CURR": "INR",
        "dKTTOT": this.DocketDetails?.tOTAMT || 0.00,
        "gROSSAMT": this.DocketDetails?.tOTAMT || 0.00,
        "rOUNOFFAMT": 0.00,
        "aMT": this.DocketDetails?.tOTAMT || 0.00,
        "custDetails": jsonBillingList,
        "eNTDT": new Date(),
        "eNTLOC": this.storage.branch,
        "eNTBY": this.storage.userName,
      }
      const req = {
        companyCode: this.storage.companyCode,
        docType: "BILL",
        branch: this.storage.branch,
        finYear: financialYear,
        party: customerName.toUpperCase(),
        collectionName: "cust_bill_headers",
        data: billData
      };
      const res = await firstValueFrom(this.operation.operationPost("finance/bill/cust/create", req));
      if (res) {
        if (res.success) {
          const BillNo = res.data.ops[0].docNo;
          this.AccountPostingForAutoBilling(billData, BillNo, DocketNo);
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: res.message,
            showConfirmButton: false,
          });
        }
      }

    }
  }
  // Account Posting When  When Bill Has been Generated/ Finalized	
  async AccountPostingForAutoBilling(billData, BillNo, DocketNo) {
    this.snackBarUtilityService.commonToast(async () => {
      try {
        const TotalAmount = billData?.aMT || 0;
        const GstAmount = billData?.gST?.aMT || 0;

        this.VoucherRequestModel.companyCode = this.storage.companyCode;
        this.VoucherRequestModel.docType = "VR";
        this.VoucherRequestModel.branch = this.storage.branch;
        this.VoucherRequestModel.finYear = financialYear

        this.VoucherDataRequestModel.voucherNo = "";
        this.VoucherDataRequestModel.transCode = VoucherInstanceType.BillApproval;
        this.VoucherDataRequestModel.transType = VoucherInstanceType[VoucherInstanceType.BillApproval];
        this.VoucherDataRequestModel.voucherCode = VoucherType.JournalVoucher;
        this.VoucherDataRequestModel.voucherType = VoucherType[VoucherType.JournalVoucher];
        this.VoucherDataRequestModel.transDate = new Date();
        this.VoucherDataRequestModel.docType = "VR";
        this.VoucherDataRequestModel.branch = this.storage.branch;
        this.VoucherDataRequestModel.finYear = financialYear

        this.VoucherDataRequestModel.accLocation = this.storage.branch;
        this.VoucherDataRequestModel.preperedFor = "Customer";
        this.VoucherDataRequestModel.partyCode = billData?.cUST?.cD || "";
        this.VoucherDataRequestModel.partyName = billData?.cUST?.nM || "";
        this.VoucherDataRequestModel.partyState = billData?.cUST?.sT || "";
        this.VoucherDataRequestModel.entryBy = this.storage.userName;
        this.VoucherDataRequestModel.entryDate = new Date();
        this.VoucherDataRequestModel.panNo = ""

        this.VoucherDataRequestModel.tdsSectionCode = "";
        this.VoucherDataRequestModel.tdsSectionName = "";
        this.VoucherDataRequestModel.tdsRate = 0;
        this.VoucherDataRequestModel.tdsAmount = 0;
        this.VoucherDataRequestModel.tdsAtlineitem = false;
        this.VoucherDataRequestModel.tcsSectionCode = "";
        this.VoucherDataRequestModel.tcsSectionName = "";
        this.VoucherDataRequestModel.tcsRate = 0;
        this.VoucherDataRequestModel.tcsAmount = 0;

        this.VoucherDataRequestModel.IGST = billData?.gST?.iGST || 0;
        this.VoucherDataRequestModel.SGST = billData?.gST?.sGST || 0;
        this.VoucherDataRequestModel.CGST = billData?.gST?.cGST || 0;
        this.VoucherDataRequestModel.UGST = billData?.gST?.uTGST || 0;
        this.VoucherDataRequestModel.GSTTotal = GstAmount;

        this.VoucherDataRequestModel.GrossAmount = TotalAmount || 0;
        this.VoucherDataRequestModel.netPayable = TotalAmount;
        this.VoucherDataRequestModel.roundOff = 0;
        this.VoucherDataRequestModel.voucherCanceled = false
        this.VoucherDataRequestModel.transactionNumber = BillNo;
        this.VoucherDataRequestModel.paymentMode = "";
        this.VoucherDataRequestModel.refNo = "";
        this.VoucherDataRequestModel.accountName = "";
        this.VoucherDataRequestModel.accountCode = "";
        this.VoucherDataRequestModel.date = "";
        this.VoucherDataRequestModel.scanSupportingDocument = "";
        var VoucherlineitemList = this.GetVouchersLedgersForAutoBilling(billData, BillNo);

        this.VoucherRequestModel.details = VoucherlineitemList
        this.VoucherRequestModel.data = this.VoucherDataRequestModel;
        this.VoucherRequestModel.debitAgainstDocumentList = [];

        this.voucherServicesService
          .FinancePost("fin/account/voucherentry", this.VoucherRequestModel)
          .subscribe({
            next: (res: any) => {

              let reqBody = {
                companyCode: this.storage.companyCode,
                voucherNo: res?.data?.mainData?.ops[0].vNO,
                transDate: Date(),
                finYear: financialYear,
                branch: this.storage.branch,
                transCode: VoucherInstanceType.BillApproval,
                transType: VoucherInstanceType[VoucherInstanceType.BillApproval],
                voucherCode: VoucherType.JournalVoucher,
                voucherType: VoucherType[VoucherType.JournalVoucher],
                docType: "Voucher",
                partyType: "Customer",
                docNo: BillNo,
                partyCode: billData?.cUST?.cD || "",
                partyName: billData?.cUST?.nM || "",
                entryBy: this.storage.userName,
                entryDate: Date(),
                debit: VoucherlineitemList.filter(item => item.credit == 0).map(function (item) {
                  return {
                    "accCode": item.accCode,
                    "accName": item.accName,
                    "accCategory": item.accCategory,
                    "amount": item.debit,
                    "narration": item.narration ?? ""
                  };
                }),
                credit: VoucherlineitemList.filter(item => item.debit == 0).map(function (item) {
                  return {
                    "accCode": item.accCode,
                    "accName": item.accName,
                    "accCategory": item.accCategory,
                    "amount": item.credit,
                    "narration": item.narration ?? ""
                  };
                }),
              };

              this.voucherServicesService
                .FinancePost("fin/account/posting", reqBody)
                .subscribe({
                  next: (res: any) => {
                    this.router.navigate(["/dashboard/DeliveryMrGeneration/Result"], {
                      state: {
                        data: this.chargeDetails
                      },
                    });
                    // Swal.fire({
                    //   icon: "success",
                    //   title: "Booked Successfully",
                    //   text: "DocketNo : " + DocketNo,
                    //   showConfirmButton: true,
                    // }).then((result) => {
                    //   if (result.isConfirmed) {
                    //     Swal.hideLoading();
                    //     setTimeout(() => {
                    //       Swal.close();
                    //     }, 2000);
                    //   }
                    // });
                  },
                  error: (err: any) => {

                    if (err.status === 400) {
                      this.snackBarUtilityService.ShowCommonSwal("error", "Bad Request");
                    } else {
                      this.snackBarUtilityService.ShowCommonSwal("error", err);
                    }
                  },
                });

            },
            error: (err: any) => {
              this.snackBarUtilityService.ShowCommonSwal("error", err);
            },
          });
      } catch (error) {
        this.snackBarUtilityService.ShowCommonSwal("error", "Fail To Submit Data..!");
      }


    }, "C-Note Booking Voucher Generating..!");

  }
  GetVouchersLedgersForAutoBilling(billData, BillNo) {
    const TotalAmount = billData?.aMT;
    const GstAmount = billData?.gST?.aMT;
    const GstRate = billData?.gST?.rATE;
    const DocketAmount = parseFloat(billData?.dKTTOT) - parseFloat(billData?.gST?.aMT);

    const createVoucher = (accCode, accName, accCategory, debit, credit, sacInfo = "",) => ({
      companyCode: this.storage.companyCode,
      voucherNo: "",
      transCode: VoucherInstanceType.BillApproval,
      transType: VoucherInstanceType[VoucherInstanceType.BillApproval],
      voucherCode: VoucherType.JournalVoucher,
      voucherType: VoucherType[VoucherType.JournalVoucher],
      transDate: new Date(),
      finYear: financialYear,
      branch: this.storage.branch,
      accCode,
      accName,
      accCategory,
      sacCode: sacInfo ? SACInfo['996511'].sacCode : "",
      sacName: sacInfo ? SACInfo['996511'].sacName : "",
      debit,
      credit,
      GSTRate: sacInfo ? GstRate : 0,
      GSTAmount: sacInfo ? GstAmount : 0,
      Total: debit + credit,
      TDSApplicable: false,
      narration: `When Customer Bill freight is Generated :${BillNo}`,
    });

    const response = [
      createVoucher(ledgerInfo['AST001002'].LeadgerCode, ledgerInfo['AST001002'].LeadgerName, ledgerInfo['AST001002'].LeadgerCategory, TotalAmount, 0),
    ];
    let LeadgerDetails;
    switch (billData?.pRODID) {
      case "P1":
        LeadgerDetails = ledgerInfo['INC001003'];
        break;
      case "P2":
        LeadgerDetails = ledgerInfo['INC001004'];
        break;
      case "P3":
        LeadgerDetails = ledgerInfo['INC001002'];
        break;
      case "P4":
        LeadgerDetails = ledgerInfo['INC001001'];
        break;
      default:
        LeadgerDetails = ledgerInfo['INC001003'];
        break;
    }
    // Income Ledger
    if (LeadgerDetails) {
      response.push(createVoucher(LeadgerDetails.LeadgerCode, LeadgerDetails.LeadgerName, LeadgerDetails.LeadgerCategory, 0, DocketAmount));
    }

    const gstTypeMapping = {
      UGST: { accCode: ledgerInfo['LIA002002'].LeadgerCode, accName: ledgerInfo['LIA002002'].LeadgerName, accCategory: ledgerInfo['LIA002002'].LeadgerCategory, prop: "uGST" },
      cGST: { accCode: ledgerInfo['LIA002003'].LeadgerCode, accName: ledgerInfo['LIA002003'].LeadgerName, accCategory: ledgerInfo['LIA002003'].LeadgerCategory, prop: "cGST" },
      IGST: { accCode: ledgerInfo['LIA002004'].LeadgerCode, accName: ledgerInfo['LIA002004'].LeadgerName, accCategory: ledgerInfo['LIA002004'].LeadgerCategory, prop: "iGST" },
      SGST: { accCode: ledgerInfo['LIA002001'].LeadgerCode, accName: ledgerInfo['LIA002001'].LeadgerName, accCategory: ledgerInfo['LIA002001'].LeadgerCategory, prop: "sGST" },
    };

    const gstType = billData?.gST?.tYP;
    const GSTTypeList = [gstType]
    GSTTypeList.forEach(element => {
      if (gstType && gstTypeMapping[element]) {
        const { accCode, accName, accCategory, prop } = gstTypeMapping[element];
        if (billData?.gST?.[prop] > 0) {
          response.push(createVoucher(accCode, accName, accCategory, 0, billData?.gST?.[prop], '996511'));
        }
      }
    });
    return response;
  }
  //#endregion

}

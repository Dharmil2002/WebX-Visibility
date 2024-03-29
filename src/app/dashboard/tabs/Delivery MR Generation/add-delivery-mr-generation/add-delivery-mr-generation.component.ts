import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { DeliveryMrGeneration } from 'src/assets/FormControls/DeliveryMr';
import { MatDialog } from '@angular/material/dialog';
import { DeliveryMrGenerationModalComponent } from '../delivery-mr-generation-modal/delivery-mr-generation-modal.component';
import { Router } from '@angular/router';
import { autocompleteObjectValidator } from 'src/app/Utility/Validation/AutoComplateValidation';
import { GetAccountDetailFromApi, GetsachsnFromApi } from 'src/app/finance/Debit Voucher/debitvoucherAPIUtitlity';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { financialYear } from 'src/app/Utility/date/date-utils';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { VoucherDataRequestModel, VoucherInstanceType, VoucherRequestModel, VoucherType } from 'src/app/Models/Finance/Finance';
import { VoucherServicesService } from 'src/app/core/service/Finance/voucher-services.service';
import { DocketService } from 'src/app/Utility/module/operation/docket/docket.service';

@Component({
  selector: 'app-add-delivery-mr-generation',
  templateUrl: './add-delivery-mr-generation.component.html'
})
export class AddDeliveryMrGenerationComponent implements OnInit {

  jsonControlDeliveryMrGenArray: any;
  deliveryMrTableForm: UntypedFormGroup
  breadscrums = [
    {
      title: "Delivery MR Generation",
      items: ["Dashboard"],
      active: "Delivery MR Generation",
    },
  ];
  tableData: any = [];
  tableload: boolean; // flag , indicates if data is still lodaing or not , used to show loading animation
  menuItemflag: boolean = true;
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  linkArray = [];

  VoucherRequestModel = new VoucherRequestModel();
  VoucherDataRequestModel = new VoucherDataRequestModel();

  columnHeader = {
    consignmentNoteNumber: {
      Title: "Consignment Note Number ",
      class: "matcolumnleft",
      Style: "min-width:15em",
    },
    payBasis: {
      Title: "PayBasis",
      class: "matcolumnleft",
      // Style: "min-width:80px",
    },
    subTotal: {
      Title: "Sub Total Amount(₹)",
      class: "matcolumncenter",
      //Style: "max-width:70px",
    },
    newSubTotal: {
      Title: "New Sub Total Amount(₹)",
      class: "matcolumncenter",
      //Style: "min-width:200px",
    },
    rateDifference: {
      Title: "Rate Difference(₹)",
      class: "matcolumncenter",
      //Style: "min-width:80px",
    },
    Loading: {
      Title: "Loading(₹)",
      class: "matcolumncenter",
      //Style: "max-width:70px",
    },
    Freight: {
      Title: "Freight(₹)",
      class: "matcolumncenter",
      //Style: "max-width:70px",
    },
    Unloading: {
      Title: "Unloading Charge(₹)",
      class: "matcolumncenter",
      //Style: "max-width:70px",
    },
    GST: {
      Title: "GST(₹)",
      class: "matcolumncenter",
      //Style: "min-width:100px",
    },
    Discount: {
      Title: "Discount(₹)",
      class: "matcolumncenter",
      //Style: "min-width:100px",
    },
    Demurrage: {
      Title: "Demurrage(₹)",
      class: "matcolumncenter",
      //Style: "min-width:100px",
    },
    GreenTax: {
      Title: "Green Tax(₹)",
      class: "matcolumncenter",
      //Style: "min-width:100px",
    },
    Insurance: {
      Title: "Insurance(₹)",
      class: "matcolumncenter",
      //Style: "min-width:100px",
    },
    Document: {
      Title: "Document(₹)",
      class: "matcolumncenter",
      //Style: "min-width:100px",
    },
    Multipointdelivery: {
      Title: "Multi-point delivery(₹)",
      class: "matcolumncenter",
      //Style: "min-width:100px",
    },
    totalAmount: {
      Title: "Total Amount(₹)",
      class: "matcolumncenter",
      //Style: "min-width:100px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumncenter",
      //Style: "min-width:100px",
    },
  };

  staticField = [
    "totalAmount",
    "Multipointdelivery",
    "Document",
    "Insurance",
    "GreenTax",
    "Demurrage",
    "Discount",
    "GST",
    "Unloading",
    "Freight",
    "Loading",
    "rateDifference",
    "newSubTotal",
    "subTotal",
    "payBasis",
    "consignmentNoteNumber"
  ];
  menuItems = [
    { label: 'Edit' },
  ]
  jsonControlPaymentArray: any;
  PaymentSummaryFilterForm: UntypedFormGroup;
  AlljsonControlPaymentSummaryFilterArray: any;
  jsonControlBillingArray: any;
  billingForm: UntypedFormGroup;
  filteredDocket = []
  SACCodeList: any;
  TotalAmountList: { count: string; title: string; class: string; }[];
  headerDetails: any;
  docketNo: any;
  AlljsonControlMRArray: any;
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
  ) {
    if (this.router.getCurrentNavigation()?.extras?.state != null) {
      const data = this.router.getCurrentNavigation()?.extras?.state.data;
      //console.log(data.data.no);
      this.docketNo = data.data.no;
    }
  }

  ngOnInit(): void {
    this.initializeDeliveryMrFormControls();
    this.getTDSData();
    this.TotalAmountList = [
      {
        count: "0.00",
        title: "Total MR Amount",
        class: `color-Success-light`,
      }
    ];
  }
  //#region to call handler function
  functionCallHandler($event) {
    let functionName = $event.functionName; // name of the function , we have to call
    // function of this name may not exists, hence try..catch
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
    this.jsonControlPaymentArray = deliveryMrControlsGenerator.getDeliveryMrPaymentControls();
    this.jsonControlBillingArray = deliveryMrControlsGenerator.getDeliveryMrBillingControls();
    this.AlljsonControlPaymentSummaryFilterArray = this.jsonControlPaymentArray;
    this.AlljsonControlMRArray = this.jsonControlDeliveryMrGenArray;
    this.PaymentSummaryFilterForm = formGroupBuilder(this.fb, [this.jsonControlPaymentArray])

    // Build the form group using the FormBuilder and the obtained form controls array.
    this.deliveryMrTableForm = formGroupBuilder(this.fb, [this.jsonControlDeliveryMrGenArray]);
    this.billingForm = formGroupBuilder(this.fb, [this.jsonControlBillingArray]);
    this.jsonControlPaymentArray = this.jsonControlPaymentArray.slice(0, 1);

    this.deliveryMrTableForm.controls['Deliveredto'].setValue("Receiver");
    const filterFunction = (x) => x.name !== "NameofConsignee";
    this.jsonControlDeliveryMrGenArray = this.AlljsonControlMRArray.filter(filterFunction);

    // Clear validation for NameofReceiver control
    const NameofConsignee = this.deliveryMrTableForm.get('NameofConsignee');
    NameofConsignee.clearValidators();
    NameofConsignee.updateValueAndValidity();

    this.deliveryMrTableForm.controls['ConsignmentNoteNumber'].setValue(this.docketNo);
    this.docketNo ? this.validateConsig() : null;
  }
  //#endregion
  //#region to add data in table
  async save() {
    this.tableload = true;
    const delayDuration = 1000;
    // Create a promise that resolves after the specified delay
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    // Use async/await to introduce the delay
    await delay(delayDuration);
    this.filteredDocket.forEach(element => {
      const json = {
        id: this.tableData.length + 1,
        consignmentNoteNumber: element.dKTNO,
        totalAmount: 0,
        Multipointdelivery: 0,
        Document: 0,
        Insurance: 0,
        GreenTax: 0,
        Demurrage: 0,
        Discount: 0,
        GST: 0,
        Unloading: 0,
        Freight: 0,
        Loading: 0,
        rateDifference: 0,
        newSubTotal: 0,
        subTotal: 0,
        payBasis: element.pAYTYPNM,
        actions: ['Edit']
      };
      this.tableData.push(json);
    });
    this.tableload = false;

    if (this.deliveryMrTableForm.value.Deliveredto === 'Receiver') {
      this.billingForm.controls['BillingParty'].setValue(this.filteredDocket[0].bPARTYNM);
    } else {
      this.billingForm.controls['BillingParty'].setValue(this.filteredDocket[0].cSGN.nM);
    }
    this.headerDetails = this.deliveryMrTableForm.value;
    this.deliveryMrTableForm.reset();
  }
  //#endregion
  //#region to change control
  async hideControl() {
    const deliveredToValue = this.deliveryMrTableForm.value.Deliveredto;

    const filter = { "dKTNO": this.docketNo };
    const consigneeName = await this.docketService.getDocketsDetailsLtl(filter);

    const cgnm = consigneeName[0]?.cSGN.nM;

    const NameofReceiver = this.deliveryMrTableForm.get('NameofReceiver');
    const NameofConsignee = this.deliveryMrTableForm.get('NameofConsignee');

    if (deliveredToValue === 'Receiver') {
      const filterFunction = (x) => x.name !== "NameofConsignee";
      this.jsonControlDeliveryMrGenArray = this.AlljsonControlMRArray.filter(filterFunction);

      // Reset values and clear validators
      NameofConsignee.setValue('');
      NameofConsignee.clearValidators();
      NameofConsignee.updateValueAndValidity();

      // Apply required validator for NameofReceiver control
      NameofReceiver.setValidators([Validators.required]);
      NameofReceiver.updateValueAndValidity();
    }

    if (deliveredToValue === 'Consignee') {
      const filterFunction = (x) => x.name !== "NameofReceiver";
      this.jsonControlDeliveryMrGenArray = this.AlljsonControlMRArray.filter(filterFunction);

      // Reset values and clear validators
      NameofReceiver.setValue('');
      NameofReceiver.clearValidators();
      NameofReceiver.updateValueAndValidity();

      // Apply required validator for NameofConsignee control      
      NameofConsignee.setValue(cgnm);
      NameofConsignee.setValidators([Validators.required]);
      NameofConsignee.updateValueAndValidity();
    }
  }
  //#endregion
  //#region to Add a new item to the table or edit
  addDetails(event) {
    const request = {
      List: this.tableData,
      Details: event,
    }
    this.tableload = true;
    const dialogRef = this.dialog.open(DeliveryMrGenerationModalComponent, {
      data: request,
      width: "100%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe(async (data) => {

      const delayDuration = 1000;
      // Create a promise that resolves after the specified delay
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      // Use async/await to introduce the delay
      await delay(delayDuration);

      const json = {
        id: data.id,
        consignmentNoteNumber: data.consignmentNoteNumber,
        Multipointdelivery: parseFloat(data["Multi-point delivery"]) || 0,
        Document: parseFloat(data.Document) || 0,
        Insurance: parseFloat(data.Insurance) || 0,
        GreenTax: parseFloat(data["Green Tax"]) || 0,
        Demurrage: parseFloat(data.Demurrage) || 0,
        Discount: parseFloat(data.Discount) || 0,
        GST: parseFloat(data.GST) || 0,
        Unloading: parseFloat(data.Unloading) || 0,
        Freight: parseFloat(data.Freight) || 0,
        Loading: parseFloat(data.Loading) || 0,
        newSubTotal: parseFloat(data.newSubTotal) || 0,
        subTotal: data.subTotal || 0,
        rateDifference: parseFloat(data.newSubTotal) - parseFloat(data.subTotal),
        totalAmount: (parseFloat(data.Document || 0) +
          + parseFloat(data.Insurance || 0)
          + parseFloat(data["Green Tax"] || 0)
          + parseFloat(data.Demurrage || 0)
          + parseFloat(data.GST || 0)
          + parseFloat(data.Unloading || 0)
          + parseFloat(data.Freight || 0)
          + parseFloat(data.Loading || 0)) - parseFloat(data.Discount || 0),
        payBasis: data.payBasis,
        actions: ['Edit']
      };
      this.tableData = this.tableData.filter(item => item.id !== data.id);
      this.tableData.unshift(json);
      this.tableload = false;
      let totalMr = 0;
      this.tableData.forEach(item => {
        totalMr += item.totalAmount;
      });
      const totalMrItem = this.TotalAmountList.find(x => x.title === "Total MR Amount");
      totalMrItem ? totalMrItem.count = totalMr.toFixed(2) : 0
    });
  }
  //#endregion
  //#region to fill or remove data form table to controls
  handleMenuItemClick(data) {
    //console.log(data);
    this.addDetails(data)
  }
  //#endregion 
  //#region to validate docket number
  async validateConsig() {
    const NoofDocketValue = this.deliveryMrTableForm.value.ConsignmentNoteNumber;
    const consignmentNoteNumbers = NoofDocketValue.includes(',') ? NoofDocketValue.split(',').map(i => i.trim()) : [NoofDocketValue];

    try {
      const docketDataArray = await Promise.all(
        consignmentNoteNumbers.map(async (element) => {
          const filter = { "dKTNO": element };
          return await this.docketService.getDocketsDetailsLtl(filter)
        })
      );

      // Flatten the array of arrays
      const flattenedDocketData = docketDataArray.flat();

      // Filter out null values and ensure uniqueness based on docketNumber
      this.filteredDocket = flattenedDocketData.filter(
        (data, index, self) =>
          data !== null &&
          index === self.findIndex((d) => d.dKTNO === data.dKTNO)
      );

      if (this.filteredDocket.length === 0) {
        Swal.fire({
          icon: "info",
          title: `This Consignment No: ${NoofDocketValue} is not valid`,
          showConfirmButton: true,
        });
        this.deliveryMrTableForm.controls.ConsignmentNoteNumber.reset();
        return;
      }

      // Check if billingParty is the same for all elements
      const uniqueBillingParties = [...new Set(this.filteredDocket.map(data => data.bPARTYNM))];

      if (uniqueBillingParties.length !== 1) {
        // If billingParty is not the same for all elements, show an informative message
        Swal.fire({
          icon: "info",
          title: "Billing parties are different for given consignment note numbers",
          showConfirmButton: true,
        });
        // Return or handle accordingly
        return;
      }

    } catch (error) {
      console.error("Error fetching data:", error);
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
        filterFunction = (x) => x.name !== "ChequeOrRefNo" && x.name !== "Bank"
          && x.name !== 'depositedIntoBank' && x.name !== 'issuedFromBank' && x.name !== 'OnAccount';
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
        const responseFromAPIBank = await GetAccountDetailFromApi(this.masterService, "BANK", Accountinglocation);
        this.filter.Filter(
          this.jsonControlPaymentArray,
          this.PaymentSummaryFilterForm,
          responseFromAPIBank,
          "Bank",
          false
        );
        this.filter.Filter(
          this.jsonControlPaymentArray,
          this.PaymentSummaryFilterForm,
          responseFromAPIBank,
          "depositedIntoBank",
          true
        );
        const Bank = this.PaymentSummaryFilterForm.get("Bank");
        Bank.setValidators([
          Validators.required,
          autocompleteObjectValidator(),
        ]);
        Bank.updateValueAndValidity();

        const depositedIntoBank = this.PaymentSummaryFilterForm.get("depositedIntoBank");
        depositedIntoBank.setValidators([
          Validators.required,
          autocompleteObjectValidator(),
        ]);
        depositedIntoBank.updateValueAndValidity();

        const ChequeOrRefNo = this.PaymentSummaryFilterForm.get("ChequeOrRefNo");
        ChequeOrRefNo.setValidators([Validators.required]);
        ChequeOrRefNo.updateValueAndValidity();

        const issuedFromBank = this.PaymentSummaryFilterForm.get("issuedFromBank");
        issuedFromBank.setValidators([Validators.required]);
        issuedFromBank.updateValueAndValidity();

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

        const depositedInBank = this.PaymentSummaryFilterForm.get("depositedIntoBank");
        depositedInBank.setValue("");
        depositedInBank.clearValidators();
        depositedInBank.updateValueAndValidity();

        const issuedBank = this.PaymentSummaryFilterForm.get("issuedFromBank");
        issuedBank.setValue("");
        issuedBank.clearValidators();
        issuedBank.updateValueAndValidity();
        break;
      case "RTGS/UTR":
        break;
    }
  }
  //#endregion
  //#region to get dropdown's data
  async getTDSData() {
    const filter = { locCode: localStorage.getItem('Branch') }
    const stateList = await this.objLocationService.locationFromApi(filter);
    this.billingForm.get("Stateofbooking").setValue(stateList?.[0]?.state);
    let Accountinglocation = this.billingForm.value.Stateofbooking
    let responseFromAPITDS = await GetAccountDetailFromApi(this.masterService, "TDS", Accountinglocation)
    this.filter.Filter(
      this.jsonControlBillingArray,
      this.billingForm,
      responseFromAPITDS,
      "TDSSection",
      false
    );
    this.SACCodeList = await GetsachsnFromApi(this.masterService)
    this.filter.Filter(
      this.jsonControlBillingArray,
      this.billingForm,
      this.SACCodeList,
      "SACCode",
      false
    );
    const stateReqBody = {
      companyCode: this.storage.companyCode,
      filter: {},
      collectionName: "state_master",
    };

    const resState = await this.masterService.masterPost('generic/get', stateReqBody).toPromise();
    const StateLists = resState?.data
      .map(x => ({
        value: x.ST, name: x.STNM
      }))
      .filter(x => x != null)
      .sort((a, b) => a.name.localeCompare(b.name));

    this.filter.Filter(
      this.jsonControlBillingArray,
      this.billingForm,
      StateLists,
      "StateofSupply",
      false
    );
  }
  //#endregion
  //#region to set bank name
  setBankName() {
    const bnknm = this.PaymentSummaryFilterForm.value.Bank;
    bnknm ? this.PaymentSummaryFilterForm.controls['depositedIntoBank'].setValue(bnknm) : '';
  }
  //#endregion
  //#region to calculate TDS related amount
  TDSSectionFieldChanged(event) {
    // Get the value of TDSSection from the form
    const TDSFormValue = this.billingForm.value.TDSSection;

    // Get the TDS rate from the TDSSection value
    const TDSRate = TDSFormValue?.rHUF || 0;

    // Set the TDS rate in the form
    this.billingForm.get("TDSRate").setValue(TDSRate);

    // Get the total amount count from TotalAmountList or default to 0 if undefined
    const totalAmountCount = parseFloat(this.TotalAmountList[0]?.count) || 0;

    // Calculate TDS amount based on the TDS rate and total amount
    const TDSAmount = totalAmountCount * TDSRate / 100;

    // Calculate the remaining amount after deducting TDS
    const totalTDSamt = totalAmountCount - TDSAmount;

    // Set the TDS amount in the form
    this.billingForm.get("TDSAmount").setValue(TDSAmount);

    // Get the GSTAmount from the form or default to 0 if undefined
    const totalGSTamt = this.billingForm.value.GSTAmount || 0;

    // Calculate the DeliveryMRNetAmount by adding TDS and GST amounts
    const deliveryMramt = parseFloat(totalTDSamt + totalGSTamt).toFixed(2);

    // Set the DeliveryMRNetAmount in the form
    this.billingForm.get("DeliveryMRNetAmount").setValue(deliveryMramt);

  }
  //#endregion
  //#region to calculate GST related amount
  SACCodeFieldChanged() {
    // Get the selected SAC code from the form
    const selectedSACCode = this.billingForm.value.SACCode?.name;

    // Find the corresponding SAC code object from SACCodeList
    const selectedSACCodeObject = this.SACCodeList.find(x => x.name === selectedSACCode);

    // Set GSTRate in the form
    this.billingForm.get("GSTRate").setValue(selectedSACCodeObject?.GSTRT || 0);

    // Get the total amount count from TotalAmountList or default to 0 if undefined
    const totalAmountCount = parseFloat(this.TotalAmountList[0]?.count) || 0;

    // Calculate and set GSTAmount in the form
    const GSTAmount = totalAmountCount * (selectedSACCodeObject?.GSTRT || 0) / 100;
    //const totalGSTamt = totalAmountCount + GSTAmount;

    // Set GSTAmount in the form
    this.billingForm.get("GSTAmount").setValue(GSTAmount);

    // Enable GSTCharged based on the presence of GSTRate
    this.billingForm.get("GSTCharged").setValue(!!this.billingForm.value.GSTRate);
  }
  //#endregion
  //#region to save data to collection delivery_mr_header and delivery_mr_details
  async GenerateMR(VoucherNo) {
    if (this.tableData.length === 0 || !this.billingForm.valid) {
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
            dOCNO: this.tableData.map(item => item.consignmentNoteNumber),
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
            bILNGPRT: this.billingForm.value.BillingParty,
            bKNGST: this.billingForm.value.Stateofbooking,
            sPLYSTNM: this.billingForm.value.StateofSupply.name,
            sPLYSTCD: this.billingForm.value.StateofSupply.value,
            sACCDNM: this.billingForm.value.SACCode.name,
            sACCd: this.billingForm.value.SACCode.value,
            gSTRT: this.billingForm.value.GSTRate,
            gSTAMT: this.billingForm.value.GSTAmount,
            tDSSCTCD: this.billingForm.value.TDSSection.value,
            tDSSCTNM: this.billingForm.value.TDSSection.name,
            tDSRT: this.billingForm.value.TDSRate,
            tDSAmt: this.billingForm.value.TDSAmount,
            gSTCHRGD: this.billingForm.value.GSTCharged,
            dLVRMRAMT: this.billingForm.value.DeliveryMRNetAmount,
            cLLCTAMT: this.billingForm.value.CollectionAmount,
            rNDOFF: this.billingForm.value.roundOffAmt || 0,
            pRTLYCLCTD: this.billingForm.value.PartiallyCollected,
            pRTLYRMGAMT: (this.billingForm.value.PartiallyCollectedAmt).toFixed(2) || 0,
            vNO: VoucherNo,
            eNTDT: new Date(),
            eNTLOC: this.storage.branch,
            eNTBY: this.storage.userName
          }
          const detailRequests = this.tableData.map(element => {
            return {
              cID: this.storage.companyCode,
              dOCNO: element.consignmentNoteNumber,
              mLTPNTDLRY: element.Multipointdelivery,
              dOC: element.Document,
              iNSURNC: element.Insurance,
              gRNTX: element.GreenTax,
              dMRG: element.Demurrage,
              dISCNT: element.Discount,
              gST: element.GST,
              uNLODNG: element.Unloading,
              fRGHT: element.Freight,
              lODNG: element.Loading,
              //cNSGTNO:
              pYBASIS: element.payBasis,
              sUBTTL: element.subTotal,
              nWSUBTTL: element.newSubTotal,
              rTDFRNC: element.rateDifference,
              vNO: VoucherNo,
              //dORDLVRY:
              // fRCLPCHRGE:
              //   gTPSCHRG:
              // oTHRCHRG:
              tOTL: element.totalAmount,
              eNTDT: new Date(),
              eNTLOC: this.storage.branch,
              eNTBY: this.storage.userName

            }
          });

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
  //#region to roundoff delivery Amount
  applyRoundOffIfChecked() {
    const isChecked = this.billingForm.value.RoundOff;
    const deliveryMRNetAmountControl = this.billingForm.get("DeliveryMRNetAmount");
    let value = deliveryMRNetAmountControl.value;

    if (isChecked) {
      // Round off the value to the nearest integer
      const roundedValue = value ? Math.round(value) : 0;

      // Calculate the decimal part
      const decimalPart = (value - roundedValue).toFixed(2);
      //console.log(decimalPart);

      // Set the rounded value back to the form control
      deliveryMRNetAmountControl.setValue(roundedValue);
      this.billingForm.get("roundOffAmt").setValue(decimalPart);
    } else {
      // No rounding required, set the original value
      deliveryMRNetAmountControl.setValue(value);
    }
  }
  //#endregion
  //#region to set Partially Collected checkbox value
  setPartiallyCollected() {
    // Reset values
    this.billingForm.get("PartiallyCollectedAmt").setValue(0);
    this.billingForm.get("PartiallyCollected").setValue(false);

    // Get values from the form
    const collectedAMT = this.billingForm.value.CollectionAmount;
    const mrNetAMT = this.billingForm.value.DeliveryMRNetAmount;

    // Check conditions
    if (collectedAMT < mrNetAMT) {
      const PartiallyCollectedAmt = mrNetAMT - collectedAMT;

      // Set values and log
      this.billingForm.get("PartiallyCollected").setValue(true);
      this.billingForm.get("PartiallyCollectedAmt").setValue(PartiallyCollectedAmt);
      //console.log("Partially Collected Amount:", PartiallyCollectedAmt);
    } else if ((collectedAMT > mrNetAMT)) {

      Swal.fire({
        icon: "info",
        title: `Delivery MR Net Amount should be less than CollectionAmount`,
        showConfirmButton: true,
      });
      this.billingForm.controls.CollectionAmount.reset();
      // No partial collection
      this.billingForm.get("PartiallyCollected").setValue(false);
      return;
    }
    else {
      // No partial collection
      this.billingForm.get("PartiallyCollected").setValue(false);
    }
  }
  //#endregion
  GenerateVoucher() {

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
        this.VoucherDataRequestModel.partyState = this.billingForm.value.StateofSupply.name
        this.VoucherDataRequestModel.entryBy = this.storage.userName;
        this.VoucherDataRequestModel.entryDate = new Date();
        this.VoucherDataRequestModel.panNo = ""

        this.VoucherDataRequestModel.tdsSectionCode = this.billingForm.value.SACCode.value;
        this.VoucherDataRequestModel.tdsSectionName = this.billingForm.value.SACCode.name;
        this.VoucherDataRequestModel.tdsRate = this.billingForm.value.TDSRate;
        this.VoucherDataRequestModel.tdsAmount = this.billingForm.value.TDSAmount;
        this.VoucherDataRequestModel.tdsAtlineitem = false;
        this.VoucherDataRequestModel.tcsSectionCode = undefined
        this.VoucherDataRequestModel.tcsSectionName = undefined
        this.VoucherDataRequestModel.tcsRate = 0;
        this.VoucherDataRequestModel.tcsAmount = 0;

        this.VoucherDataRequestModel.IGST = 0;
        this.VoucherDataRequestModel.SGST = 0;
        this.VoucherDataRequestModel.CGST = 0;
        this.VoucherDataRequestModel.UGST = 0;
        this.VoucherDataRequestModel.GSTTotal = this.billingForm.value.GSTAmount;

        this.VoucherDataRequestModel.GrossAmount = this.billingForm.value.DeliveryMRNetAmount || 0;
        this.VoucherDataRequestModel.netPayable = this.billingForm.value.CollectionAmount || 0;
        this.VoucherDataRequestModel.roundOff = this.billingForm.value.roundOffAmt || 0;
        this.VoucherDataRequestModel.voucherCanceled = false;

        this.VoucherDataRequestModel.paymentMode = this.PaymentSummaryFilterForm.value.PaymentMode;
        this.VoucherDataRequestModel.refNo = this.PaymentSummaryFilterForm.value?.ChequeOrRefNo;
        this.VoucherDataRequestModel.accountName = this.PaymentSummaryFilterForm.value?.Bank.name;
        this.VoucherDataRequestModel.accountCode = this.PaymentSummaryFilterForm.value?.Bank.value;
        this.VoucherDataRequestModel.date = this.PaymentSummaryFilterForm.value?.Date;
        this.VoucherDataRequestModel.scanSupportingDocument = "";


        const companyCode = this.storage.companyCode;
        const CurrentBranchCode = this.storage.branch;

        let voucherLineItemList = [];

        this.tableData.forEach(item => {
          // console.log(this.billingForm.value);

          const voucherLineItem = {
            companyCode: companyCode,
            voucherNo: "",
            transCode: VoucherInstanceType.DeliveryMR,
            transType: VoucherInstanceType[VoucherInstanceType.DeliveryMR],
            voucherCode: VoucherType.JournalVoucher,
            voucherType: VoucherType[VoucherType.JournalVoucher],
            transDate: new Date(),
            finYear: financialYear,
            branch: CurrentBranchCode,
            accCode: '',
            accName: '',
            sacCode: "",
            sacName: "",
            debit: parseFloat(item.totalAmount).toFixed(2),
            credit: 0,
            GSTRate: this.billingForm.value?.GSTRate,
            GSTAmount: item.GST,
            Total: parseFloat(item.totalAmount).toFixed(2),
            TDSApplicable: false,
            narration: ""
          };

          voucherLineItemList.push(voucherLineItem);
        });

        this.VoucherRequestModel.details = voucherLineItemList;
        this.VoucherRequestModel.data = this.VoucherDataRequestModel;
        this.VoucherRequestModel.debitAgainstDocumentList = [];
        console.log(this.VoucherRequestModel);

        firstValueFrom(this.voucherServicesService
          .FinancePost("fin/account/voucherentry", this.VoucherRequestModel)).then((res: any) => {
            if (res.success) {
              Swal.hideLoading();
              Swal.close();
              this.GenerateMR(res?.data?.mainData?.ops[0].vNO)
            }
          }).catch((error) => { this.snackBarUtilityService.ShowCommonSwal("error", error); })
          .finally(() => {

          });

      } catch (error) {
        this.snackBarUtilityService.ShowCommonSwal(
          "error",
          error.message
        );
      }
    }, "Delivery MR Voucher Generating..!");

  }
  //#region to disable submit btn
  isSubmitDisabled(): boolean {
    return (
      !this.PaymentSummaryFilterForm.valid ||
      !this.billingForm.valid ||
      this.TotalAmountList[0].count === '0.00'
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
}
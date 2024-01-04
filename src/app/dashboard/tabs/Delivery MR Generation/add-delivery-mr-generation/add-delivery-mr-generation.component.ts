import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { DeliveryMrGeneration } from 'src/assets/FormControls/DeliveryMr';
import { deliveryStaticData } from '../deliveryData';
import { MatDialog } from '@angular/material/dialog';
import { DeliveryMrGenerationModalComponent } from '../delivery-mr-generation-modal/delivery-mr-generation-modal.component';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { InvoiceModel } from 'src/app/Models/dyanamic-form/dyanmic.form.model';
import { autocompleteObjectValidator } from 'src/app/Utility/Validation/AutoComplateValidation';
import { GetAccountDetailFromApi } from 'src/app/finance/credit-debit-voucher/debitvoucherAPIUtitlity';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { MasterService } from 'src/app/core/service/Masters/master.service';


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
  tableData = deliveryStaticData;
  tableload = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  companyCode: number = parseInt(localStorage.getItem("companyCode"));
  menuItemflag: boolean = true;
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  linkArray = [];

  columnHeader = {
    consignmentNoteNumber: {
      Title: "Consignment Note Number ",
      class: "matcolumnleft",
      //Style: "min-width:15%",
    },
    payBasis: {
      Title: "PayBasis",
      class: "matcolumnleft",
      // Style: "min-width:80px",
    },
    subTotal: {
      Title: "Sub Total Amount(₹)",
      class: "matcolumnleft",
      //Style: "max-width:70px",
    },
    newSubTotal: {
      Title: "New Sub Total Amount(₹)",
      class: "matcolumnleft",
      //Style: "min-width:200px",
    },
    rateDifference: {
      Title: "Rate Difference(₹)",
      class: "matcolumnleft",
      //Style: "min-width:80px",
    },
    doorDelivery: {
      Title: "Door Delivery(₹)",
      class: "matcolumncenter",
      //Style: "max-width:70px",
    },
    demmurage: {
      Title: "Demmurage(₹)",
      class: "matcolumncenter",
      //Style: "max-width:70px",
    },
    loadingCharge: {
      Title: "Loading Charge(₹)",
      class: "matcolumncenter",
      //Style: "max-width:70px",
    },
    unLoadingCharge: {
      Title: "UnLoading Charge(₹)",
      class: "matcolumnleft",
      //Style: "min-width:100px",
    },
    forclipCharge: {
      Title: "Forclip Charge(₹)",
      class: "matcolumnleft",
      //Style: "min-width:100px",
    },
    gatepassCharge: {
      Title: "Gatepass Charge(₹)",
      class: "matcolumnleft",
      //Style: "min-width:100px",
    },
    otherCharge: {
      Title: "Other Charge(₹)",
      class: "matcolumnleft",
      //Style: "min-width:100px",
    },
    totalAmount: {
      Title: "Total Amount(₹)",
      class: "matcolumnleft",
      //Style: "min-width:100px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      //Style: "min-width:100px",
    },
  };
  branch = localStorage.getItem("Branch");

  staticField = [
    "totalAmount",
    "otherCharge",
    "gatepassCharge",
    "forclipCharge",
    "unLoadingCharge",
    "loadingCharge",
    "demmurage",
    "doorDelivery",
    "rateDifference",
    "newSubTotal",
    "subTotal",
    "payBasis",
    "consignmentNoteNumber"
  ];
  menuItems = [
    { label: 'Edit' },
  ]
  isChagesValid: boolean;
  jsonControlPaymentArray: any;
  PaymentSummaryFilterForm: UntypedFormGroup;
  AlljsonControlPaymentSummaryFilterArray: any;
  jsonControlBillingArray: any;
  billingForm: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private filter: FilterUtils,
    private masterService: MasterService) {
    if (this.router.getCurrentNavigation()?.extras?.state != null) {
      const data = this.router.getCurrentNavigation()?.extras?.state.data;
      console.log(data);

    }
  }

  ngOnInit(): void {
    this.initializeDeliveryMrFormControls();
    this.getTDSData();
  }

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

  //#region to initializes the form controls for the Delivery MR table.
  initializeDeliveryMrFormControls() {
    // Create an instance of the DeliveryMrGeneration class to generate form controls.
    const deliveryMrControlsGenerator = new DeliveryMrGeneration();

    // Retrieve the generated form controls array from the DeliveryMrGeneration instance.
    this.jsonControlDeliveryMrGenArray = deliveryMrControlsGenerator.getDeliveryMrControls();
    this.jsonControlPaymentArray = deliveryMrControlsGenerator.getDeliveryMrPaymentControls();
    this.jsonControlBillingArray = deliveryMrControlsGenerator.getDeliveryMrBillingControls();
    this.AlljsonControlPaymentSummaryFilterArray = this.jsonControlPaymentArray;
    this.PaymentSummaryFilterForm = formGroupBuilder(this.fb, [this.jsonControlPaymentArray])

    // Build the form group using the FormBuilder and the obtained form controls array.
    this.deliveryMrTableForm = formGroupBuilder(this.fb, [this.jsonControlDeliveryMrGenArray]);
    this.billingForm = formGroupBuilder(this.fb, [this.jsonControlBillingArray]);
    this.jsonControlPaymentArray = this.jsonControlPaymentArray.slice(0, 1);
    this.deliveryMrTableForm.controls['Deliveredto'].setValue("Receiver");
    this.deliveryMrTableForm.controls['NoofDocket'].setValue("Single");
  }
  //#endregion

  save() {
    this.addDetails(this.deliveryMrTableForm.value);
    // if (this.deliveryMrTableForm.valid) {
    //   const consignmentNoteNumber = this.deliveryMrTableForm.value.ConsignmentNoteNumber ? this.deliveryMrTableForm.value.ConsignmentNoteNumbersplit(',').map(i => i.trim()) : [];

    //   console.log(consignmentNoteNumber);
    //   this.addDetails(this.deliveryMrTableForm.value);
    // } else {
    //   Swal.fire({
    //     icon: "warning",
    //     title: "Warning",
    //     text: 'Please Fill Delivery MR Generation details',
    //     showConfirmButton: true,
    //   });
    // }
    console.log(this.deliveryMrTableForm.value);
  }

  hideControl() {
    // Get the value of the 'Deliveredto' control from the form
    const deliveredToValue = this.deliveryMrTableForm.value.Deliveredto;

    // Check if the control value is 'Consignee' or 'Receiver'
    if (deliveredToValue === 'Consignee' || deliveredToValue === 'Receiver') {
      // Determine the control properties based on the 'deliveredToValue'
      const controlName = (deliveredToValue === 'Consignee') ? 'NameofReceiver' : 'NameofConsignee';
      const label = (deliveredToValue === 'Consignee') ? 'Name of Consignee' : 'Name of Receiver';
      const placeholder = (deliveredToValue === 'Consignee') ? 'Name of Consignee' : 'Name of Receiver';
      const validationMessage = (deliveredToValue === 'Consignee') ? 'Name of Consignee is required' : 'Name of Receiver is required';

      // Find the control in the jsonControlDeliveryMrGenArray
      const disableControl = this.jsonControlDeliveryMrGenArray.find(control => control.name === controlName);

      // Modify the properties of disableControl if found
      if (disableControl) {
        disableControl.name = controlName;
        disableControl.label = label;
        disableControl.placeholder = placeholder;
        disableControl.value = '';
        disableControl.Validations = [{
          name: 'required',
          message: validationMessage,
        }];
      }
    }
  }
  //#region to Add a new item to the table or edit
  addDetails(event) {
    const request = {
      List: this.tableData,
      Details: event,
    }
    this.tableload = false;
    const dialogRef = this.dialog.open(DeliveryMrGenerationModalComponent, {
      data: request,
      width: "100%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe((data) => {
      console.log(data);
      const mrTable = {
        nWSUBTTL: parseFloat(data.newSubTotal),
        //rTDFRNC:parseFloat(data.
        dORDLVRY: parseFloat(data.doorDelivery),
        dMRG: parseFloat(data.Demurrage),
        lODNGCHRG: parseFloat(data.Loading),
        uNLODNGCHRG: parseFloat(data.Unloading),
        fRCLPCHRGE: parseFloat(data.forclip),
        gTPSCHRG: parseFloat(data.Gatepass),
        oTHRCHRG: parseFloat(data.Other)
      }
      //this.getTableDetail();
      this.tableload = true;
      console.log(mrTable);
    });
  }
  //#endregion

  //#region  to fill or remove data form table to controls
  handleMenuItemClick(data) {
    console.log(data);

    // const terDetails = this.TErouteBasedTableData.find(x => x._id == data.data._id);
    // data.label.label === 'Remove' ? this.removeTableData(terDetails._id) :
    this.addDetails(data)
  }
  //#endregion 

  validateConsig() {
    // Get the value of the 'Deliveredto' control from the form
    const NoofDocketValue = this.deliveryMrTableForm.value.ConsignmentNoteNumber;
    console.log(NoofDocketValue);
    const consignmentNoteNumber = this.deliveryMrTableForm.value.ConsignmentNoteNumber ? this.deliveryMrTableForm.value.ConsignmentNoteNumbersplit(',').map(i => i.trim()) : [];

    console.log(consignmentNoteNumber);

  }
  // Payment Modes Changes
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

    switch (PaymentMode) {
      case "Cheque":
        const responseFromAPIBank = await GetAccountDetailFromApi(
          this.masterService,
          "BANK",
          ''
        );
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

        const ChequeOrRefNo =
          this.PaymentSummaryFilterForm.get("ChequeOrRefNo");
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
          "CASH", '');
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

        const ChequeOrRefNoS =
          this.PaymentSummaryFilterForm.get("ChequeOrRefNo");
        ChequeOrRefNoS.setValue("");
        ChequeOrRefNoS.clearValidators();
        ChequeOrRefNoS.updateValueAndValidity();

        break;
      case "RTGS/UTR":
        break;
    }
  }
  async getTDSData() {
    const responseFromAPIBank = await GetAccountDetailFromApi(
      this.masterService,
      "TDS",
      ''
    );
    this.filter.Filter(
      this.jsonControlBillingArray,
      this.billingForm,
      responseFromAPIBank,
      "TDSSection",
      false
    );
  }
}
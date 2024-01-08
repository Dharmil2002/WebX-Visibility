import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { DeliveryMrGeneration } from 'src/assets/FormControls/DeliveryMr';
import { MatDialog } from '@angular/material/dialog';
import { DeliveryMrGenerationModalComponent } from '../delivery-mr-generation-modal/delivery-mr-generation-modal.component';
import { Router } from '@angular/router';
import { autocompleteObjectValidator } from 'src/app/Utility/Validation/AutoComplateValidation';
import { GetAccountDetailFromApi, GetsachsnFromApi } from 'src/app/finance/credit-debit-voucher/debitvoucherAPIUtitlity';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';

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
  // tableData = deliveryStaticData;
  tableData: any = [];
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
      Style: "min-width:13em",
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
  branch = localStorage.getItem("Branch");

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
  isLoad: boolean;
  SACCodeList: any;
  constructor(private fb: UntypedFormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private filter: FilterUtils,
    private masterService: MasterService,
    private objLocationService: LocationService) {
    if (this.router.getCurrentNavigation()?.extras?.state != null) {
      const data = this.router.getCurrentNavigation()?.extras?.state.data;
      console.log(data);

    }
  }

  ngOnInit(): void {
    this.initializeDeliveryMrFormControls();
    this.getTDSData();
    this.getDocketList('');
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
        consignmentNoteNumber: element.docketNumber,
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
        payBasis: element.payType,
        actions: ['Edit']
      };
      this.tableData.push(json);
    });
    this.tableload = false;
    this.isLoad = true;

    if (this.deliveryMrTableForm.value.Deliveredto === 'Receiver') {
      this.billingForm.controls['BillingParty'].setValue(this.filteredDocket[0].billingParty);
    } else {
      this.billingForm.controls['BillingParty'].setValue(this.filteredDocket[0].consigneeName);
    }
    console.log();


  }
  //#endregion
  //#region to change control
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
  //#endregion
  //#region to Add a new item to the table or edit
  addDetails(event) {
    const request = {
      List: this.tableData,
      Details: event,
    }
    this.tableload = true;
    this.isLoad = true;
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
        Multipointdelivery: parseFloat(data["Multi-point delivery"]),
        Document: parseFloat(data.Document),
        Insurance: parseFloat(data.Insurance),
        GreenTax: parseFloat(data["Green Tax"]),
        Demurrage: parseFloat(data.Demurrage),
        Discount: parseFloat(data.Discount),
        GST: parseFloat(data.GST),
        Unloading: parseFloat(data.Unloading),
        Freight: parseFloat(data.Freight),
        Loading: parseFloat(data.Loading),
        newSubTotal: parseFloat(data.newSubTotal),
        subTotal: data.subTotal,
        rateDifference: parseFloat(data.newSubTotal) - parseFloat(data.subTotal),
        totalAmount: (parseFloat(data.Document) +
          + parseFloat(data.Insurance)
          + parseFloat(data["Green Tax"])
          + parseFloat(data.Demurrage)
          + parseFloat(data.GST)
          + parseFloat(data.Unloading)
          + parseFloat(data.Freight)
          + parseFloat(data.Loading)) - parseFloat(data.Discount),
        payBasis: data.payBasis,
        actions: ['Edit']
      };
      this.tableData = this.tableData.filter(item => item.id !== data.id);
      this.tableData.unshift(json);
      this.tableload = false;
      this.isLoad = false;


    });
  }
  //#endregion
  //#region to fill or remove data form table to controls
  handleMenuItemClick(data) {
    console.log(data);
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
          const filter = { "docketNumber": element };
          return this.getDocketList(filter);
        })
      );

      // Flatten the array of arrays
      const flattenedDocketData = docketDataArray.flat();

      // Filter out null values and ensure uniqueness based on docketNumber
      this.filteredDocket = flattenedDocketData.filter(
        (data, index, self) =>
          data !== null &&
          index === self.findIndex((d) => d.docketNumber === data.docketNumber)
      );

      // const foundMatch = docketData.find(x => consignmentNoteNumbers.includes(x.docketNumber));
      if (this.filteredDocket.length === 0) {
        Swal.fire({
          icon: "info",
          title: `This Consignment No: ${NoofDocketValue} is not valid`,
          showConfirmButton: true,
        });
        return;
      }

      // Check if billingParty is the same for all elements
      const uniqueBillingParties = [...new Set(this.filteredDocket.map(data => data.billingParty))];

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
  //#endregion
  async getTDSData() {
    const filter = { locCode: localStorage.getItem('Branch') }
    const stateList = await this.objLocationService.locationFromApi(filter);
    this.billingForm.get("Stateofbooking").setValue(stateList[0].state);

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
      companyCode: this.companyCode,
      filter: {},
      collectionName: "state_master",
    };

    const resState = await this.masterService.masterPost('generic/get', stateReqBody).toPromise();
    const StateList = resState?.data
      .map(x => ({
        value: x.ST, name: x.STNM
      }))
      .filter(x => x != null)
      .sort((a, b) => a.name.localeCompare(b.name));

    this.filter.Filter(
      this.jsonControlBillingArray,
      this.billingForm,
      stateList,
      "StateofSupply",
      false
    );
  }

  setBankName() {
    const bnknm = this.PaymentSummaryFilterForm.value.Bank;
    bnknm ? this.PaymentSummaryFilterForm.controls['depositedIntoBank'].setValue(bnknm) : '';
  }
  async getDocketList(data = {}) {
    const req = {
      companyCode: this.companyCode,
      filter: data,
      collectionName: "docket",
    };

    // Fetch data from the 'docket' collection using the masterService
    const res = await firstValueFrom(this.masterService.masterPost('generic/get', req));
    return res.data;
  }
  TDSSectionFieldChanged(event) {
    this.billingForm.get("TDSRate").setValue(this.billingForm.value?.TDSSection?.rHUF)
    this.calculateTDSAndTotal('');

  }
  SACCodeFieldChanged() {
    const GSTRate = this.SACCodeList.filter(x => x.name === this.billingForm.value.SACCode?.name)
    this.billingForm.get("GSTRate").setValue(GSTRate[0].GSTRT)
  }
  calculateTDSAndTotal(event) {
    // const TDSRate = Number(this.billingForm.value['TDSRate']);
    // const DebitAmount = this.tableData.filter(item => item.TDSApplicable == "Yes").reduce((accumulator, currentValue) => {
    //   return accumulator + parseFloat(currentValue['DebitAmount']);
    // }, 0);
    // if (!isNaN(DebitAmount) && !isNaN(TDSRate)) {
    //   const TDSAmount = (DebitAmount * TDSRate) / 100;
    //   this.billingForm.controls.TDSDeduction.setValue(TDSAmount.toFixed(2));
    //   //this.CalculatePaymentAmount();
    // } else {
    //   console.error('Invalid input values for DebitAmount or GSTRate');
    // }
  }
}